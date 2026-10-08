      /* ---- 신뢰구간 차트 ---- */
      (function () {
        const data = [
          {
            n: "기준 모델 (Z-score)",
            v: 0.551,
            lo: 0.434,
            hi: 0.662,
            c: "#8a8985",
          },
          {
            n: "RandomForest 분류",
            v: 0.942,
            lo: 0.86,
            hi: 0.977,
            c: "#e08a2c",
          },
          { n: "GRU 회귀 → 분류", v: 0.884, lo: 0.788, hi: 0.94, c: "#05507d" },
        ];
        const svg = document.getElementById("ciChart"),
          L = 290,
          R = 960,
          x = (v) => L + ((v - 0.3) / (1.0 - 0.3)) * (R - L);
        let h = "";
        for (let t = 0.3; t <= 1.0001; t += 0.1) {
          h +=
            '<line x1="' +
            x(t) +
            '" x2="' +
            x(t) +
            '" y1="20" y2="300" stroke="#e5e5e3" stroke-width="2"/><text x="' +
            x(t) +
            '" y="335" text-anchor="middle" font-size="22" fill="#8a8985">' +
            t.toFixed(1) +
            "</text>";
        }
        data.forEach((d, i) => {
          const y = 70 + i * 95,
            cd = 0.8 + i * 0.35 + "s";
          h +=
            '<text x="' +
            (L - 22) +
            '" y="' +
            (y + 8) +
            '" text-anchor="end" font-size="26" fill="#000000">' +
            d.n +
            "</text>" +
            '<g class="ci" style="--cd:' +
            cd +
            '"><line class="rng" pathLength="1" x1="' +
            x(d.lo) +
            '" x2="' +
            x(d.hi) +
            '" y1="' +
            y +
            '" y2="' +
            y +
            '" stroke="' +
            d.c +
            '" stroke-width="10" stroke-linecap="round"/>' +
            '<circle class="dot" cx="' +
            x(d.v) +
            '" cy="' +
            y +
            '" r="15" fill="' +
            d.c +
            '" stroke="#fff" stroke-width="3"/>' +
            '<text class="dot" x="' +
            x(d.v) +
            '" y="' +
            (y - 26) +
            '" text-anchor="middle" font-size="24" font-weight="800" fill="#000000">' +
            d.v.toFixed(2) +
            "</text>" +
            '<text class="dot" x="' +
            x(d.hi) +
            '" y="' +
            (y + 46) +
            '" text-anchor="end" font-size="22" fill="#52514e">' +
            d.lo.toFixed(2) +
            " – " +
            d.hi.toFixed(2) +
            "</text></g>";
        });
        svg.innerHTML = h;
      })();

