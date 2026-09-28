import { CONFIG, hasLiveApi } from "./config.js";
import { startTracking } from "./tracker.js";

const DESIGNS = Object.freeze({
  haengjeongsa: ["document", "local-office", "multilingual"],
});
const ASSET_VERSION = "4";
const ALLOWED_PUBLIC_FIELDS = ["id", "template", "design", "name", "region", "phone", "address", "services", "headline", "intro"];

function hash(input) {
  let value = 2166136261;
  for (const char of String(input)) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function safeId(value) {
  return /^[a-z0-9]{4,12}$/i.test(value || "") ? value : "";
}

function publicData(raw, id) {
  const clean = {};
  for (const key of ALLOWED_PUBLIC_FIELDS) clean[key] = raw?.[key] ?? "";
  clean.id = id;
  clean.template = DESIGNS[clean.template] ? clean.template : "haengjeongsa";
  clean.services = Array.isArray(clean.services)
    ? clean.services.map(String)
    : String(clean.services || "").split(",").map((item) => item.trim()).filter(Boolean);
  return clean;
}

async function loadLead(id, useMock) {
  if (useMock) {
    const response = await fetch("./mock/sample.json", { cache: "no-store" });
    if (!response.ok) throw new Error("mock-load");
    const records = await response.json();
    const record = records.find((item) => item.id === id);
    if (!record) throw new Error("not-found");
    return record;
  }
  if (!hasLiveApi()) throw new Error("api-not-configured");
  const endpoint = new URL(CONFIG.apiUrl);
  endpoint.searchParams.set("id", id);
  const response = await fetch(endpoint, { cache: "no-store", redirect: "follow" });
  if (!response.ok) throw new Error("api-response");
  const payload = await response.json();
  if (!payload.ok || !payload.data) throw new Error(payload.error || "not-found");
  return payload.data;
}

function assignVariants(data) {
  const choices = DESIGNS[data.template];
  const design = choices.includes(data.design) ? data.design : choices[hash(`${data.id}:design`) % choices.length];
  return {
    design,
    hero: hash(`${data.id}:hero`) % 2 === 0 ? "a" : "b",
    color: hash(`${data.id}:color`) % 2 === 0 ? "a" : "b",
  };
}

function addStyle(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${href}?v=${ASSET_VERSION}`;
  document.head.append(link);
}

function showError(message) {
  document.getElementById("loading")?.remove();
  document.getElementById("demo-root").innerHTML = `
    <section class="state-page">
      <h1>페이지를 찾을 수 없어요.</h1>
      <p>${message}</p>
      <a href="${CONFIG.siteUrl}">웍스프레임으로 이동</a>
    </section>`;
}

async function boot() {
  const params = new URLSearchParams(location.search);
  const id = safeId(params.get("id"));
  const useMock = params.get("mock") === "1";
  if (!id && !useMock) {
    showError("주소를 다시 확인해 주세요.");
    return;
  }

  try {
    const lead = publicData(await loadLead(id || "test1", useMock), id || "test1");
    const assigned = assignVariants(lead);
    const base = `./designs/${lead.template}/${assigned.design}`;
    addStyle(`${base}/tokens.css`);
    addStyle(`${base}/colors.css`);
    document.body.dataset.color = assigned.color;
    document.body.className = `design-${assigned.design} hero-${assigned.hero}`;

    const [{ renderPage }, { renderHero }] = await Promise.all([
      import(`./templates/${lead.template}.js?v=${ASSET_VERSION}`),
      import(`${base}/heroes.js?v=${ASSET_VERSION}`),
    ]);

    document.title = `${lead.name || "행정사사무소"} 홈페이지 제안`;
    const root = document.getElementById("demo-root");
    root.innerHTML = renderPage(lead, {
      renderHero: (data, helpers) => renderHero(data, helpers, assigned.hero),
      siteUrl: CONFIG.siteUrl,
      kakaoUrl: CONFIG.kakaoUrl,
    });
    document.getElementById("loading")?.remove();
    root.focus({ preventScroll: true });
    try {
      startTracking({ id: lead.id, endpoint: CONFIG.apiUrl, enabled: !useMock && hasLiveApi() });
    } catch (trackingError) {
      console.warn("[WorksFrame tracking]", trackingError);
    }
  } catch (error) {
    console.error("[WorksFrame demo]", error);
    const message = error.message === "api-not-configured"
      ? "현재 데모 데이터 연결을 준비 중입니다."
      : "삭제되었거나 사용할 수 없는 제안 링크입니다.";
    showError(message);
  }
}

boot();
