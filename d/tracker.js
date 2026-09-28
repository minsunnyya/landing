const OPT_OUT_KEY = "worksframe-demo-owner";

function ownerOptedOut() {
  const params = new URLSearchParams(location.search);
  try {
    if (params.get("me") === "1") localStorage.setItem(OPT_OUT_KEY, "1");
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return params.get("me") === "1";
  }
}

export function startTracking({ id, endpoint, enabled }) {
  const optedOut = ownerOptedOut();
  if (!enabled || !id || optedOut) return;
  const sent = new Set();
  const send = (eventName) => {
    if (sent.has(eventName)) return;
    sent.add(eventName);
    const payload = JSON.stringify({
      id,
      e: eventName,
      t: new Date().toISOString(),
      ua: navigator.userAgent.slice(0, 500),
    });
    let delivered = false;
    try {
      delivered = typeof navigator.sendBeacon === "function"
        && navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain;charset=UTF-8" }));
    } catch {
      delivered = false;
    }
    if (!delivered) {
      fetch(endpoint, { method: "POST", mode: "no-cors", keepalive: true, body: payload }).catch(() => {});
    }
  };

  send("view");
  window.setTimeout(() => send("dwell30"), 30000);

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max > 0 && scrollY / max >= 0.9) {
      send("scroll");
      removeEventListener("scroll", onScroll);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".js-cta")) send("cta");
  });
}
