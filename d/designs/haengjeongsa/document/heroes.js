export function renderHero(data, { contactHref, esc }, variant) {
  const services = data.services.slice(0, 5);
  const rows = services.map((service, index) => `
    <li><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(service)}</strong><small>상담 안내</small></li>`).join("");
  const headline = esc(data.headline || `${data.region || ""} 행정업무,\n절차부터 분명하게.`);
  return `
    <section class="hero variant-${variant}" id="top">
      <div class="wrap hero-inner hero-grid">
        <div class="hero-copy">
          <h1>${headline.replace(/\n/g, "<br>")}</h1>
          <p class="hero-lead">${esc(data.intro || "복잡한 행정 절차를 업무별로 정리하고, 필요한 준비사항부터 상담까지 차분하게 안내합니다.")}</p>
          <div class="hero-actions">
            <a class="button js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">상담 문의하기</a>
            <a class="button secondary" href="#services">업무분야 보기</a>
          </div>
        </div>
        <ol class="document-index" aria-label="주요 업무 목차">${rows}</ol>
      </div>
    </section>`;
}
