export function renderHero(data, { contactHref, esc }, variant) {
  const headline = esc(data.headline || `${data.region || "가까운 곳"}에서\n편하게 묻는 행정 상담.`);
  const tags = data.services.slice(0, 4).map((service) => `<span>${esc(service)}</span>`).join("");
  return `
    <section class="hero variant-${variant}" id="top">
      <div class="wrap hero-inner hero-grid">
        <div class="hero-copy">
          <h1>${headline.replace(/\n/g, "<br>")}</h1>
          <p class="hero-lead">${esc(data.intro || "멀리 찾지 않아도 됩니다. 필요한 업무와 현재 상황을 알려 주시면 준비할 내용부터 안내합니다.")}</p>
          <div class="hero-actions">
            <a class="button js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">지금 상담하기</a>
            ${data.phone ? `<a class="button secondary js-cta" href="tel:${esc(String(data.phone).replace(/[^\d+]/g, ""))}">${esc(data.phone)}</a>` : ""}
          </div>
        </div>
        <aside class="hero-location">
          <div class="map-mark" aria-hidden="true"><span>●</span></div>
          <div>
            <p class="location-name">${esc(data.region || "지역 상담")}<br>${esc(data.name)}</p>
            <p class="office-hours">${esc(data.address || "방문 전 상담 시간을 확인해 주세요.")}</p>
            <div class="nearby-list">${tags}</div>
          </div>
        </aside>
      </div>
    </section>`;
}
