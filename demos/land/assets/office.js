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

  var diag = document.getElementById("diagForm");
  if (diag) {
    function sendDiag(e) {
      if (e) e.preventDefault();
      var q = new URLSearchParams();
      ["si", "dong", "lot", "purpose", "stage", "type"].forEach(function (name) {
        var el = diag.elements[name];
        if (!el) return;
        var val = "";
        if (el.length && el[0] && el[0].type === "radio") {
          var checked = diag.querySelector("[name='" + name + "']:checked");
          val = checked ? checked.value : "";
        } else {
          val = el.value || "";
        }
        if (val) q.set(name, val);
      });
      q.set("from", "diagnose");
      window.location.assign("consult.html?" + q.toString());
    }
    diag.addEventListener("submit", sendDiag);
    var submitBtn = diag.querySelector("[type=submit]");
    if (submitBtn) submitBtn.addEventListener("click", sendDiag);
  }

  document.querySelectorAll("[data-files]").forEach(function (input) {
    var out = document.getElementById(input.getAttribute("data-files"));
    input.addEventListener("change", function () {
      if (!out) return;
      var names = [];
      for (var i = 0; i < input.files.length; i++) names.push(input.files[i].name);
      out.textContent = names.length
        ? "이 브라우저에만 표시: " + names.join(", ") + " (서버로 올라가지 않습니다)"
        : "";
    });
  });

  var form = document.getElementById("cf");
  if (form) {
    var draftKey = "daol-land-consult";
    try {
      var draft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      Object.keys(draft).forEach(function (name) {
        var el = form.elements[name];
        if (!el || el.type === "checkbox" || el.type === "file") return;
        if (el.type === "radio") {
          form.querySelectorAll("[name='" + name + "']").forEach(function (r) {
            r.checked = r.value === draft[name];
          });
        } else {
          el.value = draft[name];
        }
      });
    } catch (err) {}
    var params = new URLSearchParams(location.search);
    ["si", "dong", "lot", "purpose", "stage", "type"].forEach(function (name) {
      var v = params.get(name);
      if (!v || !form.elements[name]) return;
      var el = form.elements[name];
      if (el.type === "radio" || (el.length && el[0] && el[0].type === "radio")) {
        form.querySelectorAll("[name='" + name + "']").forEach(function (r) {
          if (r.value === v) r.checked = true;
        });
      } else {
        el.value = v;
      }
    });
    form.addEventListener("input", function () {
      var data = {};
      ["name", "contact", "message", "type", "si", "dong", "lot", "purpose", "stage"].forEach(function (name) {
        var el = form.elements[name];
        if (!el) return;
        if (el.type === "radio") {
          var checked = form.querySelector("[name='" + name + "']:checked");
          data[name] = checked ? checked.value : "";
        } else if (el.type !== "file") {
          data[name] = el.value;
        }
      });
      try { localStorage.setItem(draftKey, JSON.stringify(data)); } catch (err) {}
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      if (msg) msg.classList.add("show");
    });
  }
})();
