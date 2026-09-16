(function () {
  var header = document.querySelector("header");
  var bb = document.getElementById("bb");
  var mp = document.getElementById("mp");
  var megaWrap = document.getElementById("megaWrap");
  var megaPanel = document.getElementById("megaPanel");
  var searchOpen = document.getElementById("searchOpen");
  var searchScrim = document.getElementById("searchScrim");
  var searchInput = document.getElementById("searchInput");
  var searchHits = document.getElementById("searchHits");
  var hoverTimer;

  function closeMobile() {
    if (!mp || !bb) return;
    mp.classList.remove("open");
    bb.classList.remove("open");
    bb.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-lock");
  }

  function closeMega() {
    if (header) header.classList.remove("mega-open");
    if (megaWrap) {
      var btn = megaWrap.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  }

  function openMega() {
    if (window.matchMedia("(max-width:1080px)").matches) return;
    if (header) header.classList.add("mega-open");
    if (megaWrap) {
      var btn = megaWrap.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle("compact", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (bb && mp) {
    bb.addEventListener("click", function () {
      var open = mp.classList.toggle("open");
      bb.classList.toggle("open", open);
      bb.setAttribute("aria-expanded", open);
      document.body.classList.toggle("menu-lock", open);
    });
    mp.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobile);
    });
  }

  if (megaWrap && megaPanel) {
    megaWrap.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimer);
      openMega();
    });
    megaWrap.addEventListener("mouseleave", function () {
      hoverTimer = setTimeout(closeMega, 180);
    });
    megaPanel.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimer);
      openMega();
    });
    megaPanel.addEventListener("mouseleave", function () {
      hoverTimer = setTimeout(closeMega, 180);
    });
    var mbtn = megaWrap.querySelector("button");
    if (mbtn) {
      mbtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (window.matchMedia("(max-width:1080px)").matches) return;
        if (header && header.classList.contains("mega-open")) closeMega();
        else openMega();
      });
    }
  }

  var catalog = [
    { t: "민원·진정", k: "업무", u: "services.html#minwon" },
    { t: "인허가·신고·등록", k: "업무", u: "services.html#permit" },
    { t: "행정심판·행정구제", k: "업무", u: "services.html#relief" },
    { t: "출입국·외국인", k: "업무", u: "services.html#visa" },
    { t: "기업행정", k: "업무", u: "services.html#biz" },
    { t: "법인·비영리", k: "업무", u: "services.html#corp" },
    { t: "공장 관련 행정절차", k: "사례", u: "case-01.html" },
    { t: "공장설립 행정절차", k: "블로그", u: "article-factory.html" },
    { t: "고충민원 신청방법", k: "블로그", u: "article-minwon.html" },
    { t: "외국인 체류자격 변경", k: "블로그", u: "article-stay.html" },
    { t: "행정사에게 어떤 업무를 맡길 수 있나요?", k: "FAQ", u: "info.html" },
    { t: "상황별 상담", k: "안내", u: "find.html" }
  ];

  function renderHits(q) {
    if (!searchHits) return;
    var s = (q || "").trim();
    if (!s) {
      searchHits.innerHTML = "<p style='font-size:14px;color:#667085'>업무·사례·FAQ에서 찾습니다. 자동 법률 답변이 아닙니다.</p>";
      return;
    }
    var hits = catalog.filter(function (item) {
      return item.t.indexOf(s) !== -1 || item.k.indexOf(s) !== -1;
    });
    if (!hits.length) {
      searchHits.innerHTML = "<p style='font-size:14px;color:#667085'>없습니다. 상담에서 상황을 적어 주십시오.</p>";
      return;
    }
    searchHits.innerHTML = hits.map(function (item) {
      return "<a href='" + item.u + "'><small>" + item.k + "</small>" + item.t + "</a>";
    }).join("");
  }

  function openSearch() {
    if (!searchScrim) return;
    searchScrim.classList.add("open");
    renderHits("");
    if (searchInput) searchInput.focus();
  }
  function closeSearch() {
    if (searchScrim) searchScrim.classList.remove("open");
  }
  if (searchOpen) searchOpen.addEventListener("click", openSearch);
  if (searchScrim) {
    searchScrim.addEventListener("click", function (e) {
      if (e.target === searchScrim) closeSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderHits(searchInput.value);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMobile();
      closeMega();
      closeSearch();
    }
  });

  var hoursEl = document.getElementById("hoursLive");
  if (hoursEl) {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Seoul",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = map.weekday;
      var hour = parseInt(map.hour, 10);
      var weekend = day === "Sat" || day === "Sun";
      var open = !weekend && hour >= 9 && hour < 18;
      hoursEl.textContent = open
        ? "지금은 상담 시간입니다 · 평일 09:00–18:00"
        : "지금은 업무 시간이 아닙니다 · 평일 09:00–18:00";
    } catch (err) {}
  }

  document.querySelectorAll("[data-files]").forEach(function (input) {
    var out = document.getElementById(input.getAttribute("data-files"));
    input.addEventListener("change", function () {
      if (!out) return;
      var names = [];
      for (var i = 0; i < input.files.length; i++) names.push(input.files[i].name);
      out.textContent = names.length
        ? "이 브라우저에만 표시: " + names.join(", ")
        : "";
    });
  });

  var form = document.getElementById("cf");
  if (form) {
    var hint = document.getElementById("unkHint");
    form.querySelectorAll("[name='need']").forEach(function (r) {
      r.addEventListener("change", function () {
        if (hint) hint.classList.toggle("show", r.value === "모름" && r.checked);
      });
    });
    var params = new URLSearchParams(location.search);
    ["need"].forEach(function (name) {
      var v = params.get(name);
      if (!v) return;
      form.querySelectorAll("[name='" + name + "']").forEach(function (r) {
        if (r.value === v) r.checked = true;
      });
      if (hint && v === "모름") hint.classList.add("show");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      if (msg) msg.classList.add("show");
    });
  }

  var filters = document.getElementById("caseFilters");
  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      filters.querySelectorAll("button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.getAttribute("data-f");
      document.querySelectorAll("#caseList a").forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.hidden = !show;
      });
    });
  }

  var quiz = document.getElementById("quiz");
  if (quiz) {
    var step = 0;
    var pick = "";
    var out = document.getElementById("quizOut");
    quiz.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (step === 0) {
        pick = btn.getAttribute("data-q");
        step = 1;
        var next = {
          개인: [["민원 제기", "민원"], ["처분 대응", "구제"], ["잘 모름", "모름"]],
          사업: [["허가·신고", "허가"], ["인증·조달", "기업"], ["법인", "법인"]],
          기업: [["인허가", "허가"], ["기업지원", "기업"], ["잘 모름", "모름"]],
          외국인: [["체류·사증", "출입국"], ["출입국 민원", "출입국"]],
          처분: [["이의·심판", "구제"], ["거부 대응", "구제"]],
          모름: [["상황 상담", "모름"]]
        };
        var list = next[pick] || next["모름"];
        quiz.innerHTML = list.map(function (row) {
          return "<button type='button' data-next='" + row[1] + "'>" + row[0] + "</button>";
        }).join("");
        return;
      }
      var n = btn.getAttribute("data-next");
      var map = {
        민원: "consult.html?need=민원",
        허가: "consult.html?need=인허가",
        구제: "consult.html?need=행정심판",
        출입국: "consult.html?need=출입국",
        기업: "consult.html?need=기업행정",
        법인: "consult.html?need=법인",
        모름: "consult.html?need=모름"
      };
      if (out) {
        out.classList.add("show");
        out.innerHTML = "<p>자동 판단이 아닙니다. 상담에서 사실관계를 확인합니다.</p><p><a class='btn btn-navy' href='" + (map[n] || "consult.html") + "'>이 방향으로 상담하기 →</a></p>";
      }
    });
  }
})();
