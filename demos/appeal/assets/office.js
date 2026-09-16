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

  var known = document.getElementById("knownDate");
  var act = document.getElementById("actDate");
  if (known || act) {
    var c90 = document.getElementById("c90");
    var c180 = document.getElementById("c180");
    var box90 = document.getElementById("box90");
    var box180 = document.getElementById("box180");
    var clocks = document.getElementById("clocks");
    var note = document.getElementById("clockNote");
    try {
      if (known && localStorage.getItem("seum-known-date")) known.value = localStorage.getItem("seum-known-date");
      if (act && localStorage.getItem("seum-act-date")) act.value = localStorage.getItem("seum-act-date");
    } catch (err) {}
    function seoulToday() {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date());
    }
    function daysFrom(ymd) {
      if (!ymd) return null;
      var n = Math.round((Date.parse(seoulToday() + "T00:00:00+09:00") - Date.parse(ymd + "T00:00:00+09:00")) / 86400000);
      return isNaN(n) ? null : n;
    }
    function label(left) {
      if (left === null) return "날짜를 넣으면 계산";
      if (left < 0) return "계산상 " + Math.abs(left) + "일 지남";
      if (left === 0) return "계산상 오늘이 마지막";
      return "계산상 " + left + "일 남음";
    }
    function renderDeadline() {
      var k = known ? known.value : "";
      var a = act ? act.value : "";
      try {
        localStorage.setItem("seum-known-date", k || "");
        localStorage.setItem("seum-act-date", a || "");
      } catch (err) {}
      var usedK = daysFrom(k);
      var usedA = daysFrom(a);
      if (!clocks) return;
      if (usedK === null && usedA === null) {
        clocks.hidden = true;
        if (note) note.hidden = true;
        return;
      }
      clocks.hidden = false;
      if (note) note.hidden = false;
      var left90 = usedK === null ? null : 90 - usedK;
      var left180 = usedA === null ? null : 180 - usedA;
      if (c90) c90.textContent = label(left90);
      if (c180) c180.textContent = label(left180);
      if (box90) box90.classList.toggle("urgent", left90 !== null && left90 <= 14);
      if (box180) box180.classList.toggle("urgent", left180 !== null && left180 <= 14);
      if (note) {
        note.textContent = "보통 먼저 끝나는 쪽이 막습니다. 미안내·오안내는 예외 주장이 필요할 수 있습니다. 숫자는 참고이며 기한을 확정하지 않습니다.";
      }
    }
    if (known) {
      known.addEventListener("change", renderDeadline);
      known.addEventListener("input", renderDeadline);
    }
    if (act) {
      act.addEventListener("change", renderDeadline);
      act.addEventListener("input", renderDeadline);
    }
    renderDeadline();
  }

  var finder = document.getElementById("finder");
  if (finder) {
    var out = document.getElementById("finderOut");
    var lab = document.getElementById("finderLabel");
    var step = 0;
    var kind = "";
    var stage = "";
    finder.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (step === 0) {
        kind = btn.getAttribute("data-k");
        step = 1;
        if (lab) lab.textContent = "Step 2 · 지금은 어느 단계인가요?";
        finder.innerHTML = "<button type='button' data-s='사전'>사전통지를 받았다</button><button type='button' data-s='처분'>처분서를 받았다</button><button type='button' data-s='집행'>이미 집행이 시작됐다</button><button type='button' data-s='모름'>잘 모르겠다</button>";
        return;
      }
      if (step === 1) {
        stage = btn.getAttribute("data-s");
        step = 2;
        if (lab) lab.textContent = "Step 3 · 처분이 집행되면 지금 문을 닫습니까?";
        finder.innerHTML = "<button type='button' data-c='닫힘'>문을 닫거나 일을 멈춰야 한다</button><button type='button' data-c='금액'>금액·면허만 문제다</button><button type='button' data-c='모름'>아직 모르겠다</button>";
        return;
      }
      var close = btn.getAttribute("data-c");
      var title = "행정심판 본안";
      var href = "claim.html";
      var extra = "";
      if (stage === "사전") {
        title = "의견제출 검토";
        href = "objection.html";
      } else if (close === "닫힘") {
        title = "집행정지 검토 + 본안";
        href = "stay.html";
        extra = "심판만 청구해도 처분은 멈추지 않는 것이 원칙입니다. 집행정지는 따로 신청하고, 인용을 약속하지 않습니다.";
      }
      var typeMap = { biz: "영업정지", lic: "운전면허", fine: "과징금·과태료", permit: "허가·등록", etc: "기타 행정처분" };
      var type = typeMap[kind] || "기타 행정처분";
      if (lab) lab.textContent = "검토해볼 수 있는 길";
      if (out) {
        out.classList.add("show");
        out.innerHTML = "<p><strong>" + title + "</strong>을 상담에서 가립니다. 처분 유형: " + type + ". 자동 인용·정지가 아닙니다.</p><p>" + extra + "</p><p><a class='btn btn-navy' href='" + href + "'>안내 보기 →</a> <a class='btn btn-amber' href='consult.html?type=" + encodeURIComponent(type) + "'>이 내용으로 상담</a></p>";
      }
    });
  }

  document.querySelectorAll("[data-check]").forEach(function (list) {
    var key = "seum-check-" + list.getAttribute("data-check");
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

  var rulingQ = document.getElementById("rulingQ");
  if (rulingQ) {
    var list = document.getElementById("rulingList");
    function apply() {
      var v = rulingQ.value;
      list.querySelectorAll("[data-r]").forEach(function (el) {
        el.hidden = !(v === "all" || el.getAttribute("data-r") === v);
      });
    }
    rulingQ.addEventListener("change", apply);
    apply();
  }

  var form = document.getElementById("cf");
  if (form) {
    var params = new URLSearchParams(location.search);
    var type = params.get("type");
    if (type && form.elements.type) {
      var el = form.elements.type;
      if (el.length && el[0] && el[0].type === "radio") {
        form.querySelectorAll("[name='type']").forEach(function (r) {
          if (r.value === type) r.checked = true;
        });
      } else if (el.tagName === "SELECT") {
        var ok = false;
        Array.prototype.forEach.call(el.options, function (o) { if (o.value === type || o.text === type) ok = true; });
        if (!ok) {
          var opt = document.createElement("option");
          opt.value = type;
          opt.textContent = type;
          el.appendChild(opt);
        }
        el.value = type;
        Array.prototype.forEach.call(el.options, function (o) {
          if (o.text === type) el.value = o.value || type;
        });
      }
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var file = form.querySelector("input[type='file']");
      if (file && file.files && file.files.length) {
        file.value = "";
      }
      var msg = form.querySelector(".form-msg");
      if (msg) msg.classList.add("show");
    });
  }
})();
