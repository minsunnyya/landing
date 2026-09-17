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
    var draftKey = "daol-civil-consult";
    try {
      var draft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      Object.keys(draft).forEach(function (name) {
        var el = form.elements[name];
        if (!el || el.type === "file" || el.type === "checkbox") return;
        if (el.type === "radio" || (el[0] && el[0].type === "radio")) {
          form.querySelectorAll("[name='" + name + "']").forEach(function (r) {
            r.checked = r.value === draft[name];
          });
        } else {
          el.value = draft[name];
        }
      });
    } catch (err) {}
    var params = new URLSearchParams(location.search);
    ["problem", "org", "type"].forEach(function (name) {
      var v = params.get(name);
      if (!v) return;
      if (form.elements[name]) {
        var nodes = form.querySelectorAll("[name='" + name + "']");
        if (nodes.length && nodes[0].type === "radio") {
          nodes.forEach(function (r) { if (r.value === v) r.checked = true; });
        } else {
          form.elements[name].value = v;
        }
      }
    });
    form.addEventListener("input", function () {
      var data = {};
      ["name", "contact", "message", "problem", "org"].forEach(function (name) {
        var el = form.elements[name];
        if (!el) return;
        if (el.type === "radio" || (el[0] && el[0].type === "radio")) {
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

  var search = document.getElementById("searchHero");
  if (search) {
    var routes = [
      { keys: ["발급", "증명", "서류"], href: "types.html" },
      { keys: ["진정", "제기", "신문고", "민원"], href: "petition.html" },
      { keys: ["거부", "불허"], href: "refused.html" },
      { keys: ["처분", "이의", "심판"], href: "disposition.html" },
      { keys: ["지연", "안 되고", "안되고"], href: "delayed.html" },
      { keys: ["창구", "어디", "기관"], href: "agency.html" },
      { keys: ["대행", "대신"], href: "consult.html" }
    ];
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (document.getElementById("searchHeroQ").value || "").trim();
      var href = "find.html";
      var i, r, k;
      for (i = 0; i < routes.length; i++) {
        r = routes[i];
        for (k = 0; k < r.keys.length; k++) {
          if (q.indexOf(r.keys[k]) !== -1) {
            href = r.href;
            i = routes.length;
            break;
          }
        }
      }
      var hint = document.getElementById("searchHint");
      if (hint) {
        hint.hidden = false;
        hint.textContent = q
          ? "안내 페이지로 이동합니다. 해결을 판정하지 않습니다."
          : "상황을 고르거나 단어를 입력해 주십시오.";
      }
      if (q) location.href = href;
    });
  }
})();
