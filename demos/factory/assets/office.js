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

  function closeDrops() {
    document.querySelectorAll(".drop").forEach(function (d) {
      d.classList.remove("open");
      var btn = d.querySelector("button");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
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

  document.querySelectorAll(".drop").forEach(function (drop) {
    var btn = drop.querySelector("button");
    if (!btn) return;
    var timer;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var was = drop.classList.contains("open");
      closeDrops();
      if (!was) {
        drop.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
    drop.addEventListener("mouseenter", function () {
      if (window.matchMedia("(max-width:1100px)").matches) return;
      clearTimeout(timer);
      closeDrops();
      drop.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    });
    drop.addEventListener("mouseleave", function () {
      timer = setTimeout(closeDrops, 160);
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".drop")) closeDrops();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDrops();
      closeMobile();
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

  document.querySelectorAll("[data-check]").forEach(function (list) {
    var key = "daol-fact-check-" + list.getAttribute("data-check");
    var boxes = list.querySelectorAll("input[type='checkbox']");
    try {
      var saved = JSON.parse(localStorage.getItem(key) || "[]");
      boxes.forEach(function (box, i) { box.checked = !!saved[i]; });
    } catch (err) {}
    list.addEventListener("change", function () {
      var state = [];
      boxes.forEach(function (box) { state.push(box.checked); });
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (err) {}
    });
  });

  function setOn(group, btn) {
    group.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("on", b === btn);
    });
  }

  var find = document.getElementById("findBiz");
  if (find) {
    var st = { need: "", region: "", size: "" };
    var out = document.getElementById("findOut");
    find.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-k]");
      if (!btn) return;
      var k = btn.getAttribute("data-k");
      st[k] = btn.getAttribute("data-v");
      setOn(btn.parentElement, btn);
      if (!st.need || !st.region || !st.size) return;
      var href = "consult.html";
      var title = "상담에서 절차를 가릅니다.";
      var note = "허가·등록 가능 여부를 이 화면에서 단정하지 않습니다.";
      if (st.need === "new") {
        href = "factory-site.html";
        title = "공장설립부터 검토합니다.";
        note = "지역·업종·규모에 따라 길이 갈립니다. 설립 안내에서 체크를 이어 가세요.";
      } else if (st.need === "change") {
        href = "factory-change.html";
        title = "변경등록·사업내용 변경을 봅니다.";
        note = "등록증과 현장이 같은지부터입니다.";
      } else if (st.need === "permit") {
        href = "factory-permit.html";
        title = "사업 관련 인허가를 가릅니다.";
        note = "업종마다 창구가 다릅니다. 한 장의 허가로 단정하지 않습니다.";
      } else if (st.need === "corp") {
        href = "corporate.html";
        title = "기업 운영 행정을 봅니다.";
        note = "신고·민원·심판은 공장과 별 갈래입니다.";
      }
      out.classList.add("show");
      out.innerHTML = "<b>" + title + "</b><p>" + note + " 선택: " + st.region + " · " + st.size + ".</p>" +
        '<a class="btn btn-navy" href="' + href + '">안내 보기</a> ' +
        '<a class="btn btn-line" href="consult.html?need=' + encodeURIComponent(st.need) + '">상담</a>';
    });
  }

  var est = document.getElementById("estCheck");
  if (est) {
    var es = { region: "", use: "", build: "", land: "" };
    var eout = document.getElementById("estOut");
    est.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-k]");
      if (!btn) return;
      es[btn.getAttribute("data-k")] = btn.getAttribute("data-v");
      setOn(btn.parentElement, btn);
      if (!es.region || !es.use || !es.build || !es.land) return;
      eout.classList.add("show");
      eout.innerHTML = "<b>추가 입지·인허가 검토가 필요한 상황입니다.</b><p>선택값만으로 설립 가능 여부를 판정하지 않습니다. 관할·업종·규모를 상담에서 맞춥니다.</p>" +
        '<a class="btn btn-navy" href="consult.html?need=new">전문가 상담</a>';
    });
  }

  var cases = document.querySelectorAll("[data-case]");
  function applyCaseFilter() {
    var ind = document.querySelector("[data-filter='ind'] button.on");
    var reg = document.querySelector("[data-filter='reg'] button.on");
    var work = document.querySelector("[data-filter='work'] button.on");
    var iv = ind ? ind.getAttribute("data-v") : "all";
    var rv = reg ? reg.getAttribute("data-v") : "all";
    var wv = work ? work.getAttribute("data-v") : "all";
    cases.forEach(function (card) {
      var ok = (iv === "all" || card.getAttribute("data-ind") === iv) &&
        (rv === "all" || card.getAttribute("data-reg") === rv) &&
        (wv === "all" || card.getAttribute("data-work") === wv);
      card.hidden = !ok;
    });
  }
  document.querySelectorAll("[data-filter]").forEach(function (row) {
    row.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-v]");
      if (!btn) return;
      setOn(row, btn);
      applyCaseFilter();
    });
  });

  var sim = document.getElementById("simForm");
  if (sim) {
    sim.addEventListener("submit", function (e) {
      e.preventDefault();
      var ind = sim.ind.value;
      var reg = sim.reg.value;
      var work = sim.work.value;
      var box = document.getElementById("simOut");
      var n = 0;
      cases.forEach(function (card) {
        var ok = (!ind || card.getAttribute("data-ind") === ind) &&
          (!reg || card.getAttribute("data-reg") === reg) &&
          (!work || card.getAttribute("data-work") === work);
        card.hidden = !ok;
        if (ok) n += 1;
      });
      if (box) {
        box.classList.add("show");
        box.innerHTML = "<b>유사 사례 " + n + "건</b><p>데모 시나리오입니다. 같은 결과를 약속하지 않습니다.</p>";
      }
      var indBtn = document.querySelector("[data-filter='ind'] button[data-v='" + (ind || "all") + "']");
      var regBtn = document.querySelector("[data-filter='reg'] button[data-v='" + (reg || "all") + "']");
      var workBtn = document.querySelector("[data-filter='work'] button[data-v='" + (work || "all") + "']");
      if (indBtn) setOn(indBtn.parentElement, indBtn);
      if (regBtn) setOn(regBtn.parentElement, regBtn);
      if (workBtn) setOn(workBtn.parentElement, workBtn);
    });
  }

  var form = document.getElementById("cf");
  if (form) {
    var params = new URLSearchParams(location.search);
    var need = params.get("need");
    if (need) {
      var radio = form.querySelector('input[name="need"][value="' + need + '"]');
      if (radio) radio.checked = true;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var file = form.querySelector('input[type="file"]');
      if (file) file.value = "";
      var msg = form.querySelector(".form-msg");
      if (msg) msg.classList.add("show");
    });
  }
})();
