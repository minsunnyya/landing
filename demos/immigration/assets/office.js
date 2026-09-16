(function () {
  var EN = document.documentElement.lang === "en";
  var header = document.querySelector("header");
  var bb = document.getElementById("bb");
  var mp = document.getElementById("mp");
  var searchOpen = document.getElementById("searchOpen");
  var searchScrim = document.getElementById("searchScrim");
  var searchInput = document.getElementById("searchInput");
  var searchHits = document.getElementById("searchHits");

  function closeMobile() {
    if (!mp || !bb) return;
    mp.classList.remove("open");
    bb.classList.remove("open");
    bb.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-lock");
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

  var catalog = [
    { t: EN ? "E-7 Specialized Employment" : "E-7 특정활동", k: EN ? "Visa" : "비자", q: "e-7 e7 work chef cook it specialized 취업 요리사 특정활동", u: "visa-e7.html" },
    { t: EN ? "F-6 Marriage Immigration" : "F-6 결혼이민", k: EN ? "Visa" : "비자", q: "f-6 f6 marriage spouse 결혼 배우자 초청", u: "visa-f6.html" },
    { t: EN ? "F-4 Overseas Korean" : "F-4 재외동포", k: EN ? "Visa" : "비자", q: "f-4 f4 overseas korean 동포", u: "visa-f4.html" },
    { t: EN ? "F-5 Permanent Residence" : "F-5 영주", k: EN ? "Visa" : "비자", q: "f-5 f5 permanent 영주권", u: "visa-f5.html" },
    { t: EN ? "D-2 Student" : "D-2 유학", k: EN ? "Visa" : "비자", q: "d-2 d2 study student 유학 학생", u: "visa-d2.html" },
    { t: EN ? "D-10 Job Seeking" : "D-10 구직", k: EN ? "Visa" : "비자", q: "d-10 d10 job seeking graduate 구직 졸업", u: "visa-d10.html" },
    { t: EN ? "Stay extension" : "체류기간 연장", k: EN ? "Stay" : "체류", q: "extension expiry stay 연장 만료 체류", u: "visa-stay.html" },
    { t: EN ? "Hiring foreign talent" : "외국인 채용 기업", k: EN ? "Employers" : "기업", q: "hire hr e-7 employee 채용 직원", u: "corporate.html" },
    { t: EN ? "Find the Right Visa" : "비자 자가진단", k: EN ? "Guide" : "안내", q: "find check diagnosis 찾기 진단", u: "find.html" }
  ];

  function renderHits(q) {
    if (!searchHits) return;
    var s = (q || "").trim().toLowerCase().replace(/\s+/g, "");
    if (!s) {
      searchHits.innerHTML = EN
        ? "<p style='font-size:14px;color:#667085'>Try E-7, chef, marriage visa, permanent residence. This does not decide approval.</p>"
        : "<p style='font-size:14px;color:#667085'>예: E-7, 요리사, 결혼비자, 영주권. 자동 허가 판정이 아닙니다.</p>";
      return;
    }
    var hits = catalog.filter(function (item) {
      var hay = (item.t + item.k + item.q).toLowerCase().replace(/\s+/g, "");
      return hay.indexOf(s) !== -1 || item.t.indexOf(q.trim()) !== -1;
    });
    if (!hits.length) {
      searchHits.innerHTML = EN
        ? "<p style='font-size:14px;color:#667085'>No match. Describe your situation in consultation.</p>"
        : "<p style='font-size:14px;color:#667085'>없습니다. 상담에서 상황을 적어 주십시오.</p>";
      return;
    }
    searchHits.innerHTML = hits.map(function (item) {
      return "<a href='" + item.u + "'><small>" + item.k + "</small>" + item.t + "</a>";
    }).join("");
  }

  function openSearch(prefill) {
    if (!searchScrim) return;
    searchScrim.classList.add("open");
    renderHits(prefill || "");
    if (searchInput) {
      if (prefill) searchInput.value = prefill;
      searchInput.focus();
    }
  }
  function closeSearch() {
    if (searchScrim) searchScrim.classList.remove("open");
  }
  if (searchOpen) searchOpen.addEventListener("click", function () { openSearch(""); });
  document.querySelectorAll("[data-search]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      closeMobile();
      openSearch("");
    });
  });
  var searchHero = document.getElementById("searchHero");
  if (searchHero) {
    searchHero.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (document.getElementById("searchHeroQ") || {}).value || "";
      openSearch(v);
      renderHits(v);
    });
  }
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
      hoursEl.textContent = EN
        ? (open ? "Open now · weekdays 09:00–18:00" : "Closed now · weekdays 09:00–18:00")
        : (open ? "지금은 상담 시간입니다 · 평일 09:00–18:00" : "지금은 업무 시간이 아닙니다 · 평일 09:00–18:00");
    } catch (err) {}
  }

  document.querySelectorAll("[data-files]").forEach(function (input) {
    var out = document.getElementById(input.getAttribute("data-files"));
    input.addEventListener("change", function () {
      if (!out) return;
      var names = [];
      for (var i = 0; i < input.files.length; i++) names.push(input.files[i].name);
      out.textContent = names.length
        ? (EN ? "Shown in this browser only: " : "이 브라우저에만 표시: ") + names.join(", ")
        : "";
    });
  });

  function runDiag(rootId, outId) {
    var quiz = document.getElementById(rootId);
    if (!quiz) return;
    var step = 0;
    var purpose = "";
    var loc = "";
    var out = document.getElementById(outId);
    quiz.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (step === 0) {
        purpose = btn.getAttribute("data-p");
        step = 1;
        quiz.innerHTML = EN
          ? "<button type='button' data-l='kr'>I am in Korea</button><button type='button' data-l='abroad'>I am outside Korea</button>"
          : "<button type='button' data-l='kr'>한국에 있습니다</button><button type='button' data-l='abroad'>해외에 있습니다</button>";
        return;
      }
      if (step === 1) {
        loc = btn.getAttribute("data-l");
        step = 2;
        quiz.innerHTML = (EN
          ? [["D-2","D-2"],["D-4","D-4"],["E-7","E-7"],["F-6","F-6"],["F-4","F-4"],["F-5","F-5"],["없음","None"],["잘 모르겠습니다","Not sure"]]
          : [["D-2","D-2"],["D-4","D-4"],["E-7","E-7"],["F-6","F-6"],["F-4","F-4"],["F-5","F-5"],["없음","없음"],["잘 모르겠습니다","잘 모르겠습니다"]]
        ).map(function (pair) {
          return "<button type='button' data-s='" + pair[0] + "'>" + pair[1] + "</button>";
        }).join("");
        return;
      }
      var st = btn.getAttribute("data-s");
      var rec = { code: EN ? "Consult" : "상담", name: EN ? "We start from your situation." : "상황을 먼저 듣습니다", href: "consult.html?need=모름" };
      if (purpose === "결혼") rec = { code: "F-6", name: EN ? "Marriage immigration can be reviewed." : "결혼이민을 검토해볼 수 있습니다", href: "visa-f6.html" };
      else if (purpose === "영주") rec = { code: "F-5", name: EN ? "Permanent residence requirements can be reviewed." : "영주 요건을 검토해볼 수 있습니다", href: "visa-f5.html" };
      else if (purpose === "유학" && loc === "abroad") rec = { code: "D-2", name: EN ? "A student path can be reviewed." : "유학 경로를 검토해볼 수 있습니다", href: "visa-d2.html" };
      else if (purpose === "구직" || (purpose === "취업" && st === "D-2")) rec = { code: "D-10 · E-7", name: EN ? "Job-seeking or a change to work status can be reviewed." : "구직 또는 취업 변경을 검토해볼 수 있습니다", href: "visa-d10.html" };
      else if (purpose === "취업") rec = { code: "E-7", name: EN ? "E-7 eligibility can be reviewed." : "E-7 가능성을 검토해볼 수 있습니다", href: "visa-e7.html" };
      else if (purpose === "기업") rec = { code: EN ? "Employers" : "기업", name: EN ? "Hiring and stay management are reviewed in the employer consult." : "채용·체류관리를 기업 상담에서 봅니다", href: "corporate.html" };
      else if (purpose === "동포") rec = { code: "F-4", name: EN ? "Overseas Korean status can be reviewed." : "재외동포 해당 여부를 검토해볼 수 있습니다", href: "visa-f4.html" };
      if (out) {
        out.classList.add("show");
        out.innerHTML = EN
          ? "<p class='code' style='font-size:28px'>" + rec.code + "</p><p>" + rec.name + "</p><p class='warn' style='margin-top:12px'>This is a preliminary check. Whether an application is possible depends on education, career, job category, employment contract, family facts, and current immigration rules. We do not say you will be approved.</p><p><a class='btn btn-navy' href='" + rec.href + "'>Read the guide →</a> <a class='btn btn-line' href='consult.html'>Visa &amp; Immigration Consultation</a></p>"
          : "<p class='code' style='font-size:28px'>" + rec.code + "</p><p>" + rec.name + "</p><p class='warn' style='margin-top:12px'>아래 결과는 사전 검토용이며 실제 가능 여부는 학력·경력·직종·고용계약·가족관계 및 최신 출입국 기준에 따라 달라질 수 있습니다. 받을 수 있다고 단정하지 않습니다.</p><p><a class='btn btn-navy' href='" + rec.href + "'>관련 안내 보기 →</a> <a class='btn btn-line' href='consult.html'>상담 신청</a></p>";
      }
    });
  }
  runDiag("quiz", "quizOut");
  runDiag("heroQuiz", "heroQuizOut");

  var form = document.getElementById("cf");
  if (form) {
    var firm = document.getElementById("firmBlock");
    form.querySelectorAll("[name='who']").forEach(function (r) {
      r.addEventListener("change", function () {
        if (firm) firm.classList.toggle("show", r.value === "기업" && r.checked);
      });
    });
    var params = new URLSearchParams(location.search);
    ["who", "need", "purpose"].forEach(function (name) {
      var v = params.get(name);
      if (!v) return;
      form.querySelectorAll("[name='" + name + "']").forEach(function (r) {
        if (r.value === v) r.checked = true;
      });
      var sel = form.querySelector("[name='" + name + "']");
      if (sel && sel.tagName === "SELECT") sel.value = v;
      if (firm && name === "who" && v === "기업") firm.classList.add("show");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      if (msg) msg.classList.add("show");
    });
  }

  var KEY = "visaCompare";
  function getCmp() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function setCmp(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }
  document.querySelectorAll("[data-cmp]").forEach(function (cb) {
    var code = cb.getAttribute("data-cmp");
    var cur = getCmp();
    cb.checked = cur.indexOf(code) !== -1;
    cb.addEventListener("change", function () {
      var list = getCmp();
      if (cb.checked) {
        if (list.length >= 3) {
          cb.checked = false;
          alert(EN ? "Compare up to 3 statuses." : "비교는 최대 3개입니다.");
          return;
        }
        list.push(code);
      } else {
        list = list.filter(function (x) { return x !== code; });
      }
      setCmp(list);
    });
  });
  var cmpGo = document.getElementById("cmpGo");
  if (cmpGo) {
    cmpGo.addEventListener("click", function (e) {
      var list = getCmp();
      if (list.length < 2) {
        e.preventDefault();
        alert(EN ? "Select at least 2 statuses, then compare." : "2개 이상 고른 뒤 비교합니다.");
      } else {
        cmpGo.href = "compare.html?v=" + encodeURIComponent(list.join(","));
      }
    });
  }

  var cmpTable = document.getElementById("cmpTable");
  if (cmpTable) {
    var data = EN ? {
      e7: { code: "E-7", goal: "Work", job: "Required", who: "Specialized roles", href: "visa-e7.html" },
      d10: { code: "D-10", goal: "Job seeking", job: "Not required", who: "Job seekers", href: "visa-d10.html" },
      f6: { code: "F-6", goal: "Family", job: "Not required", who: "Spouse of a Korean national", href: "visa-f6.html" },
      f4: { code: "F-4", goal: "Overseas Korean stay", job: "Depends on status", who: "Overseas Koreans", href: "visa-f4.html" },
      f5: { code: "F-5", goal: "Permanent residence", job: "Not required", who: "Those who may meet F-5 rules", href: "visa-f5.html" },
      d2: { code: "D-2", goal: "Study", job: "Not required", who: "Students", href: "visa-d2.html" }
    } : {
      e7: { code: "E-7", goal: "취업", job: "필요", who: "전문인력·해당 직종", href: "visa-e7.html" },
      d10: { code: "D-10", goal: "구직", job: "해당 없음", who: "구직자", href: "visa-d10.html" },
      f6: { code: "F-6", goal: "결혼·가족", job: "해당 없음", who: "한국인 배우자 등", href: "visa-f6.html" },
      f4: { code: "F-4", goal: "동포 체류", job: "자격에 따름", who: "재외동포", href: "visa-f4.html" },
      f5: { code: "F-5", goal: "영주", job: "해당 없음", who: "영주 요건 해당자", href: "visa-f5.html" },
      d2: { code: "D-2", goal: "유학", job: "해당 없음", who: "학생", href: "visa-d2.html" }
    };
    var keys = (new URLSearchParams(location.search).get("v") || "").split(",").filter(Boolean);
    if (!keys.length) keys = getCmp();
    var rows = keys.map(function (k) { return data[k]; }).filter(Boolean);
    if (!rows.length) {
      cmpTable.innerHTML = EN
        ? "<p>Select statuses on the visa cards first. This is not an approval decision.</p>"
        : "<p>비교할 비자를 카드에서 고르십시오. 자동 허가 판정이 아닙니다.</p>";
    } else {
      var head = "<tr><th>" + (EN ? "Item" : "항목") + "</th>" + rows.map(function (r) { return "<th>" + r.code + "</th>"; }).join("") + "</tr>";
      var body = ["goal", "job", "who"].map(function (f, i) {
        var label = (EN ? ["Purpose", "Employment contract", "Who"] : ["목적", "고용계약", "대상"])[i];
        return "<tr><th>" + label + "</th>" + rows.map(function (r) { return "<td>" + r[f] + "</td>"; }).join("") + "</tr>";
      }).join("");
      var links = "<tr><th></th>" + rows.map(function (r) { return "<td><a class='go' href='" + r.href + "'>" + (EN ? "Guide →" : "안내 →") + "</a></td>"; }).join("") + "</tr>";
      cmpTable.innerHTML = "<table>" + head + body + links + "</table><p class='warn'>" + (EN ? "Individual facts and current rules apply. As of 15 Sep 2026." : "개인·최신 기준에 따라 달라집니다. 2026.09.15 참고.") + "</p>";
    }
  }

  var roadPick = document.getElementById("roadPick");
  var roadOut = document.getElementById("roadOut");
  var roads = EN ? {
    d2: "D-2 study → D-10 job seeking → E-7 work → (if eligible) residence / permanent residence review",
    f6: "F-6 marriage immigration → (if eligible) F-5 permanent residence → nationality review",
    e7: "E-7 work → (if eligible) residence / permanent residence review",
    f4: "F-4 overseas Korean → (if eligible) longer stay / permanent residence review"
  } : {
    d2: "D-2 유학 → D-10 구직 → E-7 취업 → (요건에 따라) 거주·영주 검토",
    f6: "F-6 결혼이민 → (요건에 따라) F-5 영주 → 국적 검토",
    e7: "E-7 취업 → (요건에 따라) 거주·영주 검토",
    f4: "F-4 재외동포 → (요건에 따라) 장기 체류·영주 검토"
  };
  if (roadPick && roadOut) {
    roadPick.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      roadPick.querySelectorAll("button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var k = btn.getAttribute("data-r");
      roadOut.innerHTML = "<p>" + roads[k] + "</p><p class='warn'>" + (EN ? "Possible paths depend on personal facts and rule changes. We do not say you will be approved." : "실제 가능 경로는 개인 조건과 제도 변경에 따라 다릅니다. 받을 수 있다고 단정하지 않습니다.") + "</p>";
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
        card.hidden = !(f === "all" || card.getAttribute("data-cat") === f);
      });
    });
  }

  var chkKey = location.pathname + "#chk";
  document.querySelectorAll("[data-chk]").forEach(function (box, i) {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(chkKey) || "{}"); } catch (e) {}
    if (saved[i]) box.checked = true;
    box.addEventListener("change", function () {
      var cur = {};
      try { cur = JSON.parse(localStorage.getItem(chkKey) || "{}"); } catch (err) {}
      cur[i] = box.checked;
      localStorage.setItem(chkKey, JSON.stringify(cur));
    });
  });
})();
