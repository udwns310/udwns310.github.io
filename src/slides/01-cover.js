      // 한 단어(또는 글자)가 다음 슬라이드의 제목 속 같은 단어 자리로 이동(모핑)한다.
      // wordMorph(srcSel, dstSel, 옵션) 또는 wordMorph([[srcSel, dstSel], ...], 옵션)
      // 두 슬라이드가 바로 이어질 때만 연결된다(목록 이동·뒤로 가기는 평소처럼).
      function wordMorph(a0, b0, o0) {
        const multi = Array.isArray(a0);
        const o = (multi ? b0 : o0) || {};
        const items = (multi ? a0 : [[a0, b0]]).map(([s, d]) => ({
          src: document.querySelector(s),
          dst: document.querySelector(d),
        }));
        const fromSlide = items[0].src.closest(".slide");
        const toSlide = items[0].dst.closest(".slide");
        const fromIdx = slides.indexOf(fromSlide);
        const toIdx = slides.indexOf(toSlide);
        const parents = [...new Set(items.map((it) => it.dst.closest(".r") || it.dst.parentElement))];
        const others = [...toSlide.querySelectorAll(".r")].filter((e) => !parents.includes(e));
        const textRect = (el) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          return r.getBoundingClientRect();
        };
        const reset = () => {
          items.forEach((it) => (it.dst.style.visibility = ""));
          parents.forEach((p) => (p.style.animation = ""));
          others.forEach((e) => (e.style.animationDelay = ""));
        };
        const baseShow = show;
        show = function (i) {
          const from = cur;
          reset();
          if (from !== fromIdx || i !== toIdx) return baseShow(i);
          const dk = deck.getBoundingClientRect();
          const sc = dk.width / 1920;
          const bg = getComputedStyle(fromSlide);
          // 1) 보내는 쪽 글자 위에 같은 모양의 복사본을 겹쳐 놓는다
          items.forEach((it) => {
            const cs = getComputedStyle(it.src);
            it.cs = { color: cs.color, opacity: cs.opacity };
            it.a = textRect(it.src);
            const clone = document.createElement("div");
            clone.textContent = it.src.textContent;
            clone.style.cssText =
              "position:absolute;z-index:60;margin:0;white-space:nowrap;width:max-content;left:0;top:0;" +
              "font-family:" + cs.fontFamily + ";font-size:" + cs.fontSize + ";font-weight:" + cs.fontWeight +
              ";letter-spacing:" + cs.letterSpacing + ";line-height:" + cs.lineHeight + ";color:" + cs.color + ";";
            deck.appendChild(clone);
            const c0 = textRect(clone);
            const cb = clone.getBoundingClientRect();
            clone.style.left = (it.a.left - c0.left) / sc + "px";
            clone.style.top = (it.a.top - c0.top) / sc + "px";
            clone.style.transformOrigin = (c0.left - cb.left) / sc + "px " + (c0.top - cb.top) / sc + "px";
            it.clone = clone;
          });
          let ov = null;
          if (o.overlay) {
            ov = document.createElement("div");
            ov.style.cssText =
              "position:absolute;inset:0;z-index:55;background-image:" + bg.backgroundImage +
              ";background-color:" + bg.backgroundColor + ";";
            deck.insertBefore(ov, items[0].clone);
          }
          // 2) 받는 슬라이드를 띄우되 제목 애니메이션은 잠시 끄고 도착 자리를 잰다
          parents.forEach((p) => (p.style.animation = "none"));
          items.forEach((it) => (it.dst.style.visibility = "hidden"));
          baseShow(i);
          items.forEach((it) => {
            it.b = textRect(it.dst);
            it.end = { color: getComputedStyle(it.dst).color, opacity: getComputedStyle(it.dst).opacity };
          });
          parents.forEach((p) => (p.style.animation = ""));
          others.forEach((e) => (e.style.animationDelay = "calc(var(--d, 0) * 1ms + 600ms)"));
          // 3) 복사본을 도착 자리로 옮기고, 끝나면 진짜 글자를 보인다
          let left = items.length;
          items.forEach((it) => {
            const k = it.b.width / it.a.width;
            const move = it.clone.animate(
              [
                { transform: "translate(0,0) scale(1)", color: it.cs.color, opacity: it.cs.opacity },
                {
                  transform: "translate(" + (it.b.left - it.a.left) / sc + "px," + (it.b.top - it.a.top) / sc + "px) scale(" + k + ")",
                  color: it.end.color,
                  opacity: it.end.opacity,
                },
              ],
              { duration: 1000, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" },
            );
            const done = () => {
              it.dst.style.visibility = "";
              it.clone.remove();
              if (--left === 0 && ov) ov.remove();
            };
            move.onfinish = done;
            move.oncancel = done;
          });
          if (ov) ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: "ease-in-out", fill: "forwards" });
        };
      }
      wordMorph("#mm-cover", "#mm-team", { overlay: true });
      wordMorph("#mm-answer", "#mm-demo");
      wordMorph([["#sw-w", "#mm-w"], ["#sw-o", "#mm-o"]]);
