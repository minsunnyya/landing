const VISA_CODES = ["E-7", "F-2", "F-4", "F-5", "F-6", "D-8"];

export function renderHero(data, { contactHref, esc }, variant) {
  const services = data.services.length ? data.services : ["취업비자", "거주", "재외동포", "영주", "결혼이민", "투자"];
  const visas = VISA_CODES.map((code, index) => `
    <li><strong>${code}</strong><span>${esc(services[index % services.length])}</span></li>`).join("");
  const headline = esc(data.headline || "한국에서의 다음 절차,\n언어의 장벽 없이.");
  return `
    <section class="hero variant-${variant}" id="top">
      <div class="wrap hero-inner hero-grid">
        <div class="hero-copy">
          <h1>${headline.replace(/\n/g, "<br>")}</h1>
          <p class="hero-lead">${esc(data.intro || "비자·체류 목적과 현재 상황을 확인하고, 필요한 서류와 절차를 이해하기 쉽게 안내합니다.")}</p>
          <div class="hero-actions">
            <a class="button js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">상담 문의하기</a>
            <a class="button secondary" href="#services">업무 확인</a>
          </div>
        </div>
        <aside class="passport-panel" aria-label="언어와 비자 종류">
          <div class="lang-row" aria-label="지원 언어 예시">
            <span>한국어</span><span>EN</span><span>中文</span><span>VI</span>
          </div>
          <ul class="visa-list">${visas}</ul>
        </aside>
      </div>
    </section>`;
}
