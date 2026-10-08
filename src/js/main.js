      const deck = document.getElementById("deck"),
        slides = [...document.querySelectorAll(".slide")];
      const N = slides.length;
      let cur = 0,
        timerOn = false,
        t0 = null,
        tick = null;
      const cum = [];
      slides.reduce((a, s, i) => {
        a += +s.dataset.t || 0;
        cum[i] = a;
        return a;
      }, 0);

      function fit() {
        const s = Math.min(innerWidth / 1920, innerHeight / 1080);
        deck.style.transform = "scale(" + s + ")";
      }
      addEventListener("resize", fit);
      fit();
      if (window.ResizeObserver)
        new ResizeObserver(fit).observe(document.documentElement);
      setInterval(fit, 700); // 일부 환경에서 resize 이벤트가 오지 않을 때를 대비

      function countUp(root) {
        root.querySelectorAll(".count").forEach((el) => {
          const to = +el.dataset.to,
            dec = +(el.dataset.dec || 0),
            dur = 1400,
            st = performance.now();
          const step = (now) => {
            const p = Math.min(1, (now - st - 500) / dur);
            const e = p <= 0 ? 0 : 1 - Math.pow(1 - p, 3);
            el.textContent = (to * e).toFixed(dec);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = to.toFixed(dec);
          };
          requestAnimationFrame(step);
        });
      }
      function show(i) {
        i = Math.max(0, Math.min(N - 1, i));
        cur = i;
        slides.forEach((s, k) => s.classList.toggle("active", k === i));
        // 애니메이션 재생을 위해 활성 슬라이드를 다시 그린다
        const s = slides[i];
        s.style.display = "none";
        void s.offsetHeight;
        s.style.display = "";
        s.querySelectorAll(".pg").forEach(
          (p) => (p.textContent = i + 1 + " / " + N),
        );
        document.getElementById("progress").style.width =
          ((i + 1) / N) * 100 + "%";
        countUp(s);
        location.hash = "#" + (i + 1);
        renderNotes();
        document.title =
          "Sentinel 발표 — " + (i + 1) + "/" + N + " " + s.dataset.title;
      }
      function go(d) {
        show(cur + d);
      }
      function renderNotes() {
        const t = +slides[cur].dataset.t || 0;
        document.getElementById("notesBody").innerHTML =
          '<span class="t">' +
          (cur + 1) +
          "/" +
          N +
          " · " +
          slides[cur].dataset.title +
          " · 권장 " +
          (t ? t + "초" : "질의응답") +
          " · 누적 목표 " +
          fmt(cum[cur]) +
          "</span><br>" +
          (NOTES[cur] || "");
      }
      const fmt = (s) =>
        String(Math.floor(s / 60)).padStart(2, "0") +
        ":" +
        String(s % 60).padStart(2, "0");
      function toggleNotes() {
        document.getElementById("notes").classList.toggle("on");
      }
      function toggleTimer() {
        const el = document.getElementById("timer");
        timerOn = !timerOn;
        el.classList.toggle("on", timerOn);
        if (timerOn) {
          t0 = Date.now();
          tick = setInterval(() => {
            const e = Math.floor((Date.now() - t0) / 1000);
            el.textContent =
              "경과 " +
              fmt(e) +
              " / 목표 " +
              fmt(cum[N - 1]) +
              " (이 슬라이드 목표 누적 " +
              fmt(cum[cur]) +
              ")";
          }, 500);
        } else clearInterval(tick);
      }
      function toggleFS() {
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen();
      }
      function toggleOverview() {
        const o = document.getElementById("overview");
        o.classList.toggle("on");
        if (o.classList.contains("on")) {
          document.getElementById("ovList").innerHTML = slides
            .map(
              (s, i) =>
                '<div class="it' +
                (i === cur ? " cur" : "") +
                '" onclick="show(' +
                i +
                ');toggleOverview()"><span>' +
                (i + 1) +
                "</span>" +
                s.dataset.title +
                "<em>" +
                (s.dataset.sec || "") +
                "</em></div>",
            )
            .join("");
        }
      }
      addEventListener("keydown", (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const k = e.key;
        if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) {
          e.preventDefault();
          go(1);
        } else if (
          ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)
        ) {
          e.preventDefault();
          go(-1);
        } else if (k === "Home") show(0);
        else if (k === "End") show(N - 1);
        else if (k === "n" || k === "N") toggleNotes();
        else if (k === "t" || k === "T") toggleTimer();
        else if (k === "f" || k === "F") toggleFS();
        else if (k === "o" || k === "O") toggleOverview();
        else if (k === "Escape")
          document.getElementById("overview").classList.remove("on");
      });
      deck.addEventListener("click", (e) => {
        if (e.clientX < innerWidth * 0.28) go(-1);
        else go(1);
      });

