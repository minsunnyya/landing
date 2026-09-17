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

  /* Kinetic word on home hero */
  var kinetic = document.getElementById("kineticWord");
  if (kinetic && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var words = ["행정", "사업", "인허가", "출입국", "행정심판"];
    var wi = 0;
    setInterval(function () {
      wi = (wi + 1) % words.length;
      kinetic.textContent = words[wi];
    }, 2800);
  }

  /* Situation finder */
  var finder = document.getElementById("situationFinder");
  if (finder) {
    var paneEls = finder.querySelectorAll(".finder-pane");
    var progress = finder.querySelectorAll(".finder-progress li");
    var step2 = document.getElementById("finderStep2");
    var step2Title = document.getElementById("finderStep2Title");
    var prepEl = document.getElementById("finderPrep");
    var resultEl = document.getElementById("finderResult");
    var consultLink = document.getElementById("finderConsult");
    var state = { step: 0, branch: "", need: "", label: "" };

    var tree = {
      biz: {
        title: "어떤 사업인가요?",
        opts: [
          ["공장을 설립하려고 합니다", "인허가", "공장설립·등록 방향"],
          ["식당·영업을 시작하려고 합니다", "인허가", "영업 허가·신고 방향"],
          ["외국인을 고용하려고 합니다", "출입국", "외국인 고용·체류 방향"],
          ["허가·신고가 필요한 것 같습니다", "인허가", "인허가·신고 방향"]
        ],
        prep: ["사업 계획·업종 개요", "사업장 주소·도면(있으면)", "기존 허가·신고 서류(있으면)"]
      },
      disp: {
        title: "어떤 처분에 가깝나요?",
        opts: [
          ["영업정지·과태료 통지를 받았습니다", "행정심판", "영업정지·처분 대응"],
          ["운전면허 관련 처분입니다", "행정심판", "운전면허·행정처분"],
          ["신청이 거부·반려되었습니다", "행정심판", "거부·반려 대응"],
          ["이의·심판이 맞는지 모르겠습니다", "행정심판", "구제 절차 검토"]
        ],
        prep: ["처분서·통지서", "처분일·송달일 확인", "관련 신청 이력"]
      },
      visa: {
        title: "출입국 중 어디에 가깝나요?",
        opts: [
          ["체류자격 변경이 필요합니다", "출입국", "체류자격 변경"],
          ["비자·사증 신청입니다", "출입국", "비자·사증"],
          ["초청·동행이 필요합니다", "출입국", "초청·동행"],
          ["기업 출입국 업무입니다", "출입국", "기업 출입국"]
        ],
        prep: ["여권·외국인등록 정보", "체류자격·만료일", "초청·고용 관련 서류(있으면)"]
      },
      land: {
        title: "토지·건축 중 어디에 가깝나요?",
        opts: [
          ["개발행위·인허가가 필요합니다", "토지", "개발·인허가"],
          ["건축 관련 행정입니다", "토지", "건축 관련 행정"],
          ["토지 분할·이용 문제입니다", "토지", "토지 관련 행정"],
          ["잘 모르겠습니다", "모름", "상황 상담"]
        ],
        prep: ["지번·공부 자료", "도면·계획(있으면)", "관할 문의 이력(있으면)"]
      },
      car: {
        title: "자동차 업무 중 어디에 가깝나요?",
        opts: [
          ["이전등록이 필요합니다", "자동차", "이전등록"],
          ["상속·증여입니다", "자동차", "상속·증여"],
          ["말소·압류·저당입니다", "자동차", "말소·압류·저당"],
          ["잘 모르겠습니다", "모름", "상황 상담"]
        ],
        prep: ["자동차등록증", "소유자·상속 관계 서류", "압류·저당 관련 통지(있으면)"]
      },
      unk: {
        title: "조금 더 가까운 말을 고르세요",
        opts: [
          ["개인 민원·진정에 가깝습니다", "민원", "민원·진정"],
          ["사업·허가가 필요해 보입니다", "인허가", "인허가·신고"],
          ["기관 처분에 대응해야 합니다", "행정심판", "행정구제"],
          ["외국인·출입국입니다", "출입국", "출입국"],
          ["그래도 모르겠습니다", "모름", "상황 상담"]
        ],
        prep: ["지금 막힌 상황을 날짜 순으로 정리", "받은 서류·문자·메일", "원하는 결과(가능 범위 안에서)"]
      }
    };

    function showStep(n) {
      state.step = n;
      paneEls.forEach(function (p) {
        var i = parseInt(p.getAttribute("data-pane"), 10);
        p.hidden = i !== n;
        p.classList.toggle("is-on", i === n);
      });
      progress.forEach(function (li, idx) {
        li.classList.toggle("is-on", idx <= n);
      });
    }

    function fillStep2(branch) {
      var node = tree[branch];
      if (!node || !step2) return;
      if (step2Title) step2Title.textContent = node.title;
      step2.innerHTML = node.opts.map(function (row) {
        return "<button type='button' data-need='" + row[1] + "' data-label='" + row[2] + "'>" + row[0] + "</button>";
      }).join("");
    }

    function fillPrep(branch) {
      var node = tree[branch];
      if (!node || !prepEl) return;
      prepEl.innerHTML = node.prep.map(function (t) { return "<li>" + t + "</li>"; }).join("");
    }

    finder.addEventListener("click", function (e) {
      var back = e.target.closest("[data-back]");
      if (back) {
        if (state.step > 0) showStep(state.step - 1);
        return;
      }
      var nextPrep = e.target.closest("[data-next-prep]");
      if (nextPrep) {
        if (resultEl) {
          resultEl.textContent = "선택하신 방향: " + state.label + ". 상담에서 관할·요건·서류를 확인합니다.";
        }
        if (consultLink) consultLink.href = "consult.html?need=" + encodeURIComponent(state.need || "모름");
        showStep(3);
        return;
      }
      var branchBtn = e.target.closest("[data-branch]");
      if (branchBtn) {
        state.branch = branchBtn.getAttribute("data-branch");
        fillStep2(state.branch);
        showStep(1);
        return;
      }
      var needBtn = e.target.closest("[data-need]");
      if (needBtn && e.target.closest("#finderStep2")) {
        state.need = needBtn.getAttribute("data-need");
        state.label = needBtn.getAttribute("data-label") || state.need;
        fillPrep(state.branch);
        showStep(2);
      }
    });
  }

  /* Home FAQ search */
  var faqInput = document.getElementById("faqInput");
  var faqHits = document.getElementById("faqHits");
  var faqItems = [
    { q: "행정심판은 언제 신청하나요?", u: "info.html" },
    { q: "비자 변경에 필요한 서류는?", u: "consult.html?need=출입국" },
    { q: "공장설립 승인은 어디서 받나요?", u: "consult.html?need=인허가" },
    { q: "영업정지 통지를 받으면?", u: "consult.html?need=행정심판" },
    { q: "자동차 이전등록은?", u: "consult.html?need=자동차" }
  ];
  function renderFaq(q) {
    if (!faqHits) return;
    var s = (q || "").trim();
    if (!s) {
      faqHits.innerHTML = "";
      return;
    }
    var hits = faqItems.filter(function (item) { return item.q.indexOf(s) !== -1; });
    if (!hits.length) {
      faqHits.innerHTML = "<p style='font-size:14px;color:#64748B'>관련 안내가 없습니다. 상담에서 상황을 적어 주세요. <a class='go' href='consult.html'>문의하기 →</a></p>";
      return;
    }
    faqHits.innerHTML = hits.map(function (item) {
      return "<a href='" + item.u + "'>" + item.q + "</a>";
    }).join("");
  }
  if (faqInput) {
    faqInput.addEventListener("input", function () { renderFaq(faqInput.value); });
  }
  var faqRecent = document.getElementById("faqRecent");
  if (faqRecent && faqInput) {
    faqRecent.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-q]");
      if (!btn) return;
      faqInput.value = btn.getAttribute("data-q");
      renderFaq(faqInput.value);
      faqInput.focus();
    });
  }

  /* Reveal + timeline scroll */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  var timeline = document.getElementById("processTimeline");
  if (timeline && "IntersectionObserver" in window) {
    var items = timeline.querySelectorAll("li");
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("is-active");
      });
    }, { threshold: 0.45 });
    items.forEach(function (li) { tio.observe(li); });
  }

  /* Services sticky TOC highlight */
  var toc = document.querySelector(".svc-toc");
  var blocks = document.querySelectorAll(".svc-block[id]");
  if (toc && blocks.length && "IntersectionObserver" in window) {
    var tocLinks = toc.querySelectorAll("a[href^='#']");
    var map = {};
    tocLinks.forEach(function (a) {
      map[a.getAttribute("href").slice(1)] = a;
    });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        tocLinks.forEach(function (a) { a.classList.remove("is-on"); });
        if (map[id]) map[id].classList.add("is-on");
      });
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    blocks.forEach(function (b) { sio.observe(b); });
  }
})();
