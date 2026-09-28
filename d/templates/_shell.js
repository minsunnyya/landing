export function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

export function phoneDigits(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

export function serviceItems(services, fallback) {
  const items = Array.isArray(services) ? services : String(services || "").split(",");
  const clean = items.map((item) => item.trim()).filter(Boolean).slice(0, 8);
  return clean.length ? clean : fallback;
}

export function frame(data, context, { sections, contactTitle, contactText }) {
  const phone = phoneDigits(data.phone);
  const contactHref = context.kakaoUrl || (phone ? `tel:${phone}` : context.siteUrl);
  const region = esc(data.region || "가까운 지역");
  const address = esc(data.address || `${data.region || ""} 방문 상담`);
  const name = esc(data.name || "행정사사무소");
  const proposal = `웍스프레임이 ${name}께 제안드리는 샘플 페이지입니다. 요청하시면 바로 삭제합니다.`;
  const services = serviceItems(data.services, []);

  return `
    <div class="proposal-bar">
      <span>${proposal}</span>
      <a href="${context.siteUrl}" target="_blank" rel="noopener">웍스프레임</a>
    </div>
    <div class="site-shell">
      <header class="site-head">
        <div class="wrap">
          <a class="brand" href="#top">${name}</a>
          <div class="head-meta">${region}<br>${esc(data.phone || "상담 연락처")}</div>
        </div>
      </header>
      ${context.renderHero({ ...data, services }, { contactHref, esc })}
      ${sections}
      <section class="contact" id="contact">
        <div class="wrap">
          <h2>${contactTitle}</h2>
          <p>${contactText}</p>
          <div class="hero-actions">
            <a class="button js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">상담 문의하기</a>
            ${phone ? `<a class="button secondary js-cta" href="tel:${phone}">전화 ${esc(data.phone)}</a>` : ""}
          </div>
        </div>
      </section>
      <footer class="site-footer">
        <div class="wrap">
          <strong>${name}</strong>
          <div>${address}${data.phone ? ` · ${esc(data.phone)}` : ""}</div>
          <p>본 페이지는 웍스프레임이 공개 정보를 바탕으로 구성한 제안용 샘플입니다. 실제 운영 전 업체 확인이 필요합니다. 허가·인용 등 특정 결과는 보장하지 않습니다.</p>
        </div>
      </footer>
      <nav class="mobile-cta" aria-label="빠른 상담">
        ${phone ? `<a class="js-cta" href="tel:${phone}">전화하기</a>` : `<a href="#work">업무 보기</a>`}
        <a class="primary js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">상담받기</a>
      </nav>
    </div>`;
}
