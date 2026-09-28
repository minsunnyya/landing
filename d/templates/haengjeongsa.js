const FALLBACK_SERVICES = ["출입국·비자", "인허가", "행정심판", "각종 민원"];

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function serviceItems(services) {
  const items = Array.isArray(services) ? services : String(services || "").split(",");
  return items.map((item) => item.trim()).filter(Boolean).slice(0, 8);
}

function serviceDescription(service) {
  const text = service.toLowerCase();
  if (/비자|출입국|체류|귀화/.test(text)) return "대상과 체류 목적을 확인하고 필요한 절차와 서류를 안내합니다.";
  if (/허가|인가|등록|신고|공장|건설|식품/.test(text)) return "업종·지역·시설 조건에 따라 필요한 행정 절차를 먼저 가립니다.";
  if (/심판|구제|영업정지|면허/.test(text)) return "처분 내용과 통지일을 확인한 뒤 가능한 대응 절차를 검토합니다.";
  return "사실관계와 요청 목적을 확인하고 알맞은 행정 절차를 안내합니다.";
}

export function renderPage(data, context) {
  const services = serviceItems(data.services);
  const safeServices = services.length ? services : FALLBACK_SERVICES;
  const phoneHref = String(data.phone || "").replace(/[^\d+]/g, "");
  const contactHref = context.kakaoUrl || (phoneHref ? `tel:${phoneHref}` : context.siteUrl);
  const region = esc(data.region || "가까운 지역");
  const address = esc(data.address || `${data.region || ""} 방문 상담`);
  const name = esc(data.name || "행정사사무소");
  const proposal = `웍스프레임이 ${name}께 제안드리는 샘플 페이지입니다. 요청하시면 바로 삭제합니다.`;
  const serviceCards = safeServices.map((service) => `
    <article class="service-card">
      <h3>${esc(service)}</h3>
      <p>${esc(serviceDescription(service))}</p>
    </article>`).join("");
  const questions = safeServices.slice(0, 4).map((service) => `
    <article class="question-card">
      <h3>${esc(service)}: 무엇부터 준비해야 하나요?</h3>
      <p>현재 상황, 대상, 필요한 기한을 상담에서 확인한 뒤 준비 항목을 안내합니다.</p>
    </article>`).join("");

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
      ${context.renderHero({ ...data, services: safeServices }, { contactHref, esc })}
      <section class="section" id="services">
        <div class="wrap">
          <h2>복잡한 행정업무를<br>찾기 쉽게 정리했습니다.</h2>
          <p class="section-intro">업무 이름만 나열하지 않고, 방문자가 자신의 상황에 맞는 정보를 찾을 수 있도록 안내합니다.</p>
          <div class="service-grid">${serviceCards}</div>
        </div>
      </section>
      <section class="section section-alt" id="questions">
        <div class="wrap">
          <h2>상담 전에 많이 묻는 질문</h2>
          <p class="section-intro">정확한 판단은 상담 후 가능하며, 아래 내용은 문의를 시작하기 위한 일반 안내입니다.</p>
          <div class="question-grid">${questions}</div>
        </div>
      </section>
      <section class="section">
        <div class="wrap">
          <h2>상담부터 업무 진행까지</h2>
          <ol class="process">
            <li><span>상담 접수</span><strong>현재 상황과 필요한 업무를 확인합니다.</strong></li>
            <li><span>자료 확인</span><strong>사실관계와 준비된 서류를 살펴봅니다.</strong></li>
            <li><span>절차 안내</span><strong>가능한 절차와 추가 준비사항을 설명합니다.</strong></li>
            <li><span>업무 진행</span><strong>위임 범위와 일정에 따라 서류 작성·제출을 지원합니다.</strong></li>
          </ol>
          <p class="notice">사건별 요건과 처리 기간은 다를 수 있으며, 허가·등록·인용 등 특정 결과를 보장하지 않습니다. 실적·후기 영역은 실제 내용을 확인한 뒤 채웁니다.</p>
        </div>
      </section>
      <section class="contact" id="contact">
        <div class="wrap">
          <h2>지금 필요한 행정 절차부터 확인하세요.</h2>
          <p>${region} ${name}에서 상담 내용을 확인한 뒤 필요한 준비사항을 안내합니다.</p>
          <div class="hero-actions">
            <a class="button js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">상담 문의하기</a>
            ${phoneHref ? `<a class="button secondary js-cta" href="tel:${phoneHref}">전화 ${esc(data.phone)}</a>` : ""}
          </div>
        </div>
      </section>
      <footer class="site-footer">
        <div class="wrap">
          <strong>${name}</strong>
          <div>${address}${data.phone ? ` · ${esc(data.phone)}` : ""}</div>
          <p>본 페이지는 웍스프레임이 공개 정보를 바탕으로 구성한 제안용 샘플입니다. 실제 운영 전 업체 확인이 필요합니다.</p>
        </div>
      </footer>
      <nav class="mobile-cta" aria-label="빠른 상담">
        ${phoneHref ? `<a class="js-cta" href="tel:${phoneHref}">전화하기</a>` : `<a href="#services">업무 보기</a>`}
        <a class="primary js-cta" href="${esc(contactHref)}" target="_blank" rel="noopener">상담받기</a>
      </nav>
    </div>`;
}
