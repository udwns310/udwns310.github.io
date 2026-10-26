      // 문제제기 슬라이드 → 문제 정의 슬라이드로 넘어갈 때, 질문 문구가 제목 자리로 줄어들며 이동(모핑)한다.
      (() => {
        const baseShow = show;
        const qIdx = slides.findIndex((s) => s.id === "question");
        const target = qIdx >= 0 ? slides[qIdx + 1].querySelector("h2") : null;
        const others = target
          ? [...target.parentElement.querySelectorAll(".r")].filter((e) => e !== target)
          : [];
        const resetTarget = () => {
          others.forEach((e) => (e.style.animationDelay = ""));
          if (target) {
            target.style.animation = "";
            target.style.opacity = "";
          }
        };
        show = function (i) {
          const from = cur;
          const morph = target && from === qIdx && i === qIdx + 1;
          resetTarget();
          if (!morph) return baseShow(i);
          const q = slides[qIdx].querySelector(".q-text");
          const dk = deck.getBoundingClientRect();
          const sc = dk.width / 1920;
          const a = q.getBoundingClientRect();
          const sub = slides[qIdx].querySelector(".q-sub");
          const c = sub.getBoundingClientRect();
          const clone = q.cloneNode(true);
          clone.classList.remove("r", "fade");
          clone.style.cssText =
            "position:absolute;z-index:60;margin:0;transform-origin:0 0;opacity:1;animation:none;" +
            "left:" + (a.left - dk.left) / sc + "px;top:" + (a.top - dk.top) / sc + "px;";
          target.style.animation = "none";
          target.style.opacity = "0";
          // 제목이 자리 잡은 뒤에 나머지 내용이 올라오도록 늦춘다
          others.forEach((e) => (e.style.animationDelay = "calc(var(--d, 0) * 1ms + 700ms)"));
          baseShow(i);
          const b = target.getBoundingClientRect();
          const k = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(q).fontSize);
          deck.appendChild(clone);
          const subClone = sub.cloneNode(true);
          subClone.classList.remove("r", "fade");
          subClone.style.cssText =
            "position:absolute;z-index:60;margin:0;opacity:1;animation:none;" +
            "left:" + (c.left - dk.left) / sc + "px;top:" + (c.top - dk.top) / sc + "px;";
          deck.appendChild(subClone);
          subClone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: "forwards" }).onfinish = () => subClone.remove();
          const move = clone.animate(
            [
              { transform: "translate(0,0) scale(1)" },
              { transform: "translate(" + (b.left - a.left) / sc + "px," + (b.top - a.top) / sc + "px) scale(" + k + ")" },
            ],
            { duration: 1000, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" },
          );
          const done = () => {
            target.style.opacity = "1";
            clone.remove();
          };
          move.onfinish = done;
          move.oncancel = done;
        };
      })();
