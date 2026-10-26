      // 한 단어가 다음 슬라이드의 제목 속 같은 단어 자리로 이동(모핑)한다.
      // src(보내는 슬라이드의 요소)와 dst(받는 슬라이드의 요소)는 슬라이드가 바로 이어질 때만 연결된다.
      function wordMorph(srcSel, dstSel, o = {}) {
        const src = document.querySelector(srcSel);
        const dst = document.querySelector(dstSel);
        const fromIdx = slides.indexOf(src.closest(".slide"));
        const toIdx = slides.indexOf(dst.closest(".slide"));
        const parent = dst.closest(".r") || dst.parentElement;
        const others = [...dst.closest(".slide").querySelectorAll(".r")].filter((e) => e !== parent);
        const textRect = (el) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          return r.getBoundingClientRect();
        };
        const reset = () => {
          dst.style.visibility = "";
          parent.style.animation = "";
          others.forEach((e) => (e.style.animationDelay = ""));
        };
        const baseShow = show;
        show = function (i) {
          const from = cur;
          reset();
          if (from !== fromIdx || i !== toIdx) return baseShow(i);
          const dk = deck.getBoundingClientRect();
          const sc = dk.width / 1920;
          const cs = getComputedStyle(src);
          const a = textRect(src);
          const bg = getComputedStyle(slides[fromIdx]);
          const clone = document.createElement("div");
          clone.textContent = src.textContent;
          clone.style.cssText =
            "position:absolute;z-index:60;margin:0;white-space:nowrap;width:max-content;left:0;top:0;" +
            "font-family:" + cs.fontFamily + ";font-size:" + cs.fontSize + ";font-weight:" + cs.fontWeight +
            ";letter-spacing:" + cs.letterSpacing + ";line-height:" + cs.lineHeight + ";color:" + cs.color + ";";
          deck.appendChild(clone);
          // 글자 영역이 원래 글자와 겹치도록 놓는다
          const c0 = textRect(clone);
          const cb = clone.getBoundingClientRect();
          clone.style.left = (a.left - c0.left) / sc + "px";
          clone.style.top = (a.top - c0.top) / sc + "px";
          clone.style.transformOrigin = (c0.left - cb.left) / sc + "px " + (c0.top - cb.top) / sc + "px";
          let ov = null;
          if (o.overlay) {
            ov = document.createElement("div");
            ov.style.cssText =
              "position:absolute;inset:0;z-index:55;background-image:" + bg.backgroundImage +
              ";background-color:" + bg.backgroundColor + ";";
            deck.insertBefore(ov, clone);
          }
          parent.style.animation = "none";
          dst.style.visibility = "hidden";
          baseShow(i);
          const b = textRect(dst);
          const k = b.width / a.width;
          const endColor = getComputedStyle(dst).color;
          parent.style.animation = "";
          others.forEach((e) => (e.style.animationDelay = "calc(var(--d, 0) * 1ms + 600ms)"));
          const move = clone.animate(
            [
              { transform: "translate(0,0) scale(1)", color: cs.color },
              { transform: "translate(" + (b.left - a.left) / sc + "px," + (b.top - a.top) / sc + "px) scale(" + k + ")", color: endColor },
            ],
            { duration: 1000, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" },
          );
          if (ov) ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: "ease-in-out", fill: "forwards" });
          const done = () => {
            dst.style.visibility = "";
            clone.remove();
            if (ov) ov.remove();
          };
          move.onfinish = done;
          move.oncancel = done;
        };
      }
      wordMorph("#mm-cover", "#mm-team", { overlay: true });
      wordMorph("#mm-answer", "#mm-demo");
