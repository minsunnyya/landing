(function () {
  var header = document.querySelector("header");
  var bb = document.getElementById("bb");
  var mp = document.getElementById("mp");

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

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobile();
  });

  var hoursEl = document.getElementById("hoursLive");
  if (hoursEl) {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Seoul",
        weekday: "short",
        hour: "numeric",
        hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var weekend = map.weekday === "Sat" || map.weekday === "Sun";
      var hour = parseInt(map.hour, 10);
      var open = !weekend && hour >= 9 && hour < 18;
      hoursEl.textContent = open
        ? "지금은 상담 시간입니다 · 평일 09:00–18:00"
        : "지금은 업무 시간이 아닙니다 · 평일 09:00–18:00";
    } catch (err) {}
  }

  var routes = {
    buy: { t: "자동차 이전등록", d: "매매로 산 경우 이전을 검토합니다. 기한은 관할 안내가 앞섭니다.", u: "transfer.html" },
    family: { t: "증여·가족 이전", d: "가족 간 명의는 매매와 서류가 다릅니다.", u: "transfer.html?kind=gift" },
    inherit: { t: "자동차 상속 이전", d: "소유자 사망이면 상속관계부터 봅니다.", u: "inherit.html" },
    scrap: { t: "말소등록", d: "폐차·수출·도난 등 원인부터 가릅니다.", u: "cancel.html" },
    lien: { t: "압류·저당", d: "이전 가능 여부는 원부와 관할에서 확인합니다.", u: "lien.html" },
    corp: { t: "법인 차량", d: "법인 명의는 개인과 서류가 다릅니다.", u: "corporate.html" },
    record: { t: "등록원부", d: "소유권·압류·저당 확인이 필요할 때.", u: "record.html" },
    plate: { t: "번호판", d: "재발급·변경은 관할 기준입니다.", u: "plate.html" }
  };

  function showRoute(key, out) {
    var r = routes[key];
    if (!r || !out) return;
    out.classList.add("show");
    out.innerHTML = "<p><strong>" + r.t + "</strong>을 검토해볼 수 있습니다. " + r.d + " 완료를 보장하지 않습니다.</p><p><a class='btn btn-navy' href='" + r.u + "'>안내 보기 →</a> <a class='btn btn-line' href='consult.html?type=" + encodeURIComponent(r.t) + "'>상담</a></p>";
  }

  var quick = document.getElementById("quick");
  if (quick) {
    var qOut = document.getElementById("quickOut");
    quick.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (!btn) return;
      quick.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b === btn); });
      showRoute(btn.getAttribute("data-q"), qOut);
    });
  }

  var finder = document.getElementById("finder");
  if (finder) {
    var out = document.getElementById("finderOut");
    var lab = document.getElementById("finderLabel");
    var step = 0;
    var sit = "";
    var own = "";
    finder.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (step === 0) {
        sit = btn.getAttribute("data-q");
        step = 1;
        if (lab) lab.textContent = "Step 2 · 차량 소유자는 누구인가요?";
        finder.innerHTML = "<button type='button' data-o='본인'>본인 명의</button><button type='button' data-o='가족'>가족</button><button type='button' data-o='법인'>법인</button>";
        return;
      }
      if (step === 1) {
        own = btn.getAttribute("data-o");
        step = 2;
        if (lab) lab.textContent = "Step 3 · 어떤 업무인가요?";
        finder.innerHTML = "<button type='button' data-w='이전'>이전등록</button><button type='button' data-w='말소'>말소</button><button type='button' data-w='원부'>등록원부</button><button type='button' data-w='기타'>기타·모름</button>";
        return;
      }
      if (step === 2) {
        var w = btn.getAttribute("data-w");
        step = 3;
        finder.setAttribute("data-w", w);
        if (lab) lab.textContent = "Step 4 · 현재 문제가 있나요?";
        finder.innerHTML = "<button type='button' data-p='일반'>특별한 문제 없음</button><button type='button' data-p='압류'>압류 있음</button><button type='button' data-p='저당'>저당 있음</button><button type='button' data-p='모름'>모름</button>";
        return;
      }
      var p = btn.getAttribute("data-p");
      var w2 = finder.getAttribute("data-w");
      var rec = routes.buy;
      if (sit === "inherit" || w2 === "이전" && own === "가족" && sit === "inherit") rec = routes.inherit;
      else if (sit === "inherit") rec = routes.inherit;
      else if (sit === "scrap" || w2 === "말소") rec = routes.scrap;
      else if (sit === "lien" || p === "압류" || p === "저당") rec = routes.lien;
      else if (own === "법인" || sit === "corp") rec = routes.corp;
      else if (w2 === "원부") rec = routes.record;
      else if (sit === "family") rec = routes.family;
      else if (sit === "plate") rec = routes.plate;
      if (out) {
        if (lab) lab.textContent = "추천 업무";
        out.classList.add("show");
        out.innerHTML = "<p><strong>" + rec.t + " 상담</strong>을 권합니다. 소유자: " + own + ". 자동 완료 판정이 아닙니다.</p><p><a class='btn btn-lime' href='" + rec.u + "'>업무 안내 →</a> <a class='btn btn-navy' href='consult.html?type=" + encodeURIComponent(rec.t) + "&amp;owner=" + encodeURIComponent(own) + "&amp;state=" + encodeURIComponent(p) + "'>이 내용으로 상담</a></p>";
      }
    });
  }

  var kind = document.getElementById("docKind");
  var lists = document.querySelectorAll("[data-docs]");
  function showDocs() {
    var v = kind ? kind.value : "개인";
    lists.forEach(function (el) {
      el.hidden = el.getAttribute("data-docs") !== v;
    });
  }
  if (kind) {
    kind.addEventListener("change", showDocs);
    showDocs();
  }

  document.querySelectorAll("[data-check]").forEach(function (list) {
    var key = "daol-car-" + list.getAttribute("data-check");
    var boxes = list.querySelectorAll("input[type='checkbox']");
    try {
      var saved = JSON.parse(localStorage.getItem(key) || "[]");
      boxes.forEach(function (box, i) { box.checked = !!saved[i]; });
    } catch (err) {}
    list.addEventListener("change", function () {
      var state = [];
      boxes.forEach(function (box) { state.push(box.checked); });
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
    });
  });

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

  var form = document.getElementById("cf");
  if (form) {
    var params = new URLSearchParams(location.search);
    ["type", "owner", "state", "plate"].forEach(function (name) {
      var v = params.get(name);
      if (!v || !form.elements[name]) return;
      var el = form.elements[name];
      if (el.type === "radio" || (el.length && el[0] && el[0].type === "radio")) {
        form.querySelectorAll("[name='" + name + "']").forEach(function (r) {
          if (r.value === v) r.checked = true;
        });
      } else {
        if (el.tagName === "SELECT") {
          var ok = false;
          Array.prototype.forEach.call(el.options, function (o) { if (o.value === v) ok = true; });
          if (!ok) {
            var opt = document.createElement("option");
            opt.value = v;
            opt.textContent = v;
            el.appendChild(opt);
          }
        }
        el.value = v;
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      if (msg) msg.classList.add("show");
    });
  }
})();
