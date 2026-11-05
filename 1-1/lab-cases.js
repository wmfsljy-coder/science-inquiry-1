/* 과학탐구실험1 Ⅰ-1 과학의 본성과 역사 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

/* ---- 스튜디오 말투(밝은 바탕 + 입체 미니어처 + 흰 판정 카드) — window.sthKit (_tools/STUDIO_GUIDE.md) ---- */
var K = window.sthKit, LT = K.LT;
function lpill(ctx, s, x, y, o) { o = o || {}; o.bg = o.bg || "rgba(255,255,255,.94)"; o.line = o.line || "rgba(20,40,90,.16)"; o.c = o.c || LT.ink; return K.pill(ctx, s, x, y, o); }
function note(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 11, w: o.w || "700", a: o.a, c: o.c || LT.mute }); }
function cube(ctx, x, y, w, h, d, cF, cT, cR) {
  var dx = d * .7, dy = d * .5;
  ctx.fillStyle = cT; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y - dy); ctx.lineTo(x + w + dx, y - dy); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cR; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + dx, y - dy); ctx.lineTo(x + w + dx, y + h - dy); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cF; ctx.fillRect(x, y, w, h);
}
/* 오른쪽 흰 판정 카드: rows = [[이름, 값, 색], …] */
function card(ctx, RX, W, CH, title, head, headCol, rows, tip, good) {
  K.card(ctx, RX, 0, W - RX, CH, title);
  if (head) K.t(ctx, head, RX + 18, 60, { s: 19, w: "900", c: headCol || LT.ink });
  rows.forEach(function (r, i) { K.row(ctx, r[0], r[1], RX + 18, W - 18, 94 + i * 27, r[2]); });
  if (tip) K.tip(ctx, tip, RX + 12, CH - 46, W - RX - 24, good);
}
window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 독립 재현 */
  {
    id: "c1", about: "01", tag: "과학의 본성 · 사회적 합의와 재현", title: "‘감기가 하루 만에 낫는 약’을 믿어도 될까", short: "독립 재현",
    who: "💊", name: "의약품 심사 위원",
    say: "“한 연구팀이 ‘새 감기약이 효과가 있다’는 실험 결과를 냈어요. 그런데 약이 사실 효과가 없어도, 실험 한 번이 우연히 ‘효과 있음’으로 나올 확률이 5%는 됩니다. 연구팀의 장비나 방법에 숨은 실수가 있었을 수도 있고요. 거짓 결론이 끝까지 살아남을 확률을 <b>1% 아래</b>로 낮추도록 재현 실험을 계획해 주세요. 연구비가 한 번에 한 팀분뿐이라 재현 실험은 차례로 해야 하고, 한 번에 6개월이 걸리며, <b>1년 6개월 안에</b> 결론을 내야 합니다.”",
    predict: {
      q: "같은 연구팀이 같은 장비로 실험을 여러 번 되풀이하는 것과, 다른 연구팀들이 따로 실험하는 것 중 숨은 실수를 걸러 내는 데 더 나은 것은?",
      options: ["㉠ 같은 팀이 되풀이 — 실험에 가장 익숙하므로", "㉡ 다른 팀들이 따로 — 같은 실수를 되풀이하지 않으므로", "㉢ 둘은 차이가 없다"],
      answer: 1
    },
    task: "재현 방식과 횟수를 정해 <b>거짓 결론이 살아남을 확률 1% 미만</b>, <b>1년 6개월 안</b>을 함께 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W;
      var mode = "same", k = 1;
      /* 거짓 결론의 원인: 우연(50%) 또는 연구팀의 숨은 실수(50%). 같은 팀은 숨은 실수를 그대로 되풀이한다 */
      function survive() { return mode === "ind" ? Math.pow(0.05, k) : 0.5 * Math.pow(0.05, k) + 0.5; }
      function months() { return 6 * k; }
      var TEAM = ["#1c7ed6", "#e8590c", "#0f9f76", "#7048e8", "#f59f00", "#d6336c", "#0c8599"];
      function pct(p) { return (p * 100 < 0.01 ? (p * 100).toExponential(1) : (p * 100).toFixed(2)) + " %"; }
      function draw() {
        var CH = cv.H, p = survive(), ok = mode === "ind" && p < 0.01 && months() <= 18, i;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, 612, CH, { x: 300, y: 150, rx: 280, ry: 22 });
        K.bigText(ctx, "거짓 결론이 살아남을 확률 " + pct(p), 16, 34, 19, p < 0.01 ? "#8ce99a" : "#ffffff");
        /* 입체 미니어처: 실험대 줄 — 같은 색 = 같은 팀(같은 장비·방법) */
        for (i = 0; i <= k; i++) {
          var x = 26 + i * 82, col = i === 0 ? TEAM[0] : (mode === "ind" ? TEAM[i % TEAM.length] : TEAM[0]);
          ctx.fillStyle = "#7a5233"; ctx.fillRect(x + 4, 142, 5, 22); ctx.fillRect(x + 52, 142, 5, 22);
          cube(ctx, x, 132, 60, 10, 26, "#b47c4a", "#d7a06a", "#8a5a33");
          /* 삼각 플라스크 */
          var fx = x + 30, fy = 124;
          ctx.fillStyle = "rgba(225,240,255,.8)"; ctx.strokeStyle = "rgba(60,80,110,.6)"; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(fx - 4, fy - 30); ctx.lineTo(fx + 4, fy - 30); ctx.lineTo(fx + 4, fy - 18); ctx.lineTo(fx + 14, fy); ctx.lineTo(fx - 14, fy); ctx.lineTo(fx - 4, fy - 18); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(fx - 9, fy - 8); ctx.lineTo(fx + 9, fy - 8); ctx.lineTo(fx + 14, fy); ctx.lineTo(fx - 14, fy); ctx.closePath(); ctx.fill();
          K.planet(ctx, x + 48, 104, 6, "#f3c7a2", "#8a5636");
          ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x + 41, 110, 14, 14, [6, 6, 2, 2]); ctx.fill();
          lpill(ctx, i === 0 ? "처음 실험" : (i + "차 · " + (mode === "ind" ? "팀 " + "BCDEFG".charAt(i - 1) : "같은 팀")), x + 32, 186, { s: 10.5, a: "center", c: i === 0 ? LT.ink : col, box: [0, 612] });
        }
        /* 로그 막대: 살아남을 확률 */
        var x0 = 60, x1 = 560, y = 246;
        function X(q) { return x0 + (H.log10(Math.max(q, 1e-7)) + 7) / 7 * (x1 - x0); }
        K.line(ctx, { x: x0, y: y }, { x: x1, y: y }, LT.line, 1.5);
        [1e-6, 1e-4, 1e-2, 1].forEach(function (q) { K.t(ctx, q >= 0.01 ? (q * 100) + "%" : (q * 100).toExponential(0).replace("e-", "×10⁻") + "%", X(q), y + 16, { s: 10, a: "center", c: LT.mute, w: "600" }); });
        cube(ctx, x0, y - 18, Math.max(3, X(p) - x0), 14, 10, p < 0.01 ? LT.green : LT.orange, p < 0.01 ? "#5fd1a8" : "#ff9a5c", p < 0.01 ? "#0b7357" : "#b8430a");
        K.line(ctx, { x: X(0.01), y: y - 34 }, { x: X(0.01), y: y }, LT.red, 2, [4, 3]);
        lpill(ctx, "1%", X(0.01), y - 36, { s: 10.5, a: "center", c: LT.red });
        note(ctx, "눈금 한 칸 = 100배", x1, y - 26, { s: 10, a: "right" });
        card(ctx, 620, W, CH, "판정", ok ? "믿을 만함" : "아직 부족", ok ? LT.green : LT.orange, [
          ["살아남을 확률", pct(p), p < 0.01 ? LT.green : LT.red],
          ["걸리는 기간", months() + " 개월", months() <= 18 ? LT.green : LT.red],
          ["재현 방식", mode === "ind" ? "다른 팀들이 따로" : "같은 팀이 되풀이"]
        ], mode !== "ind" ? "숨은 실수가 그대로 남습니다" : (months() > 18 ? "기한 1년 6개월을 넘깁니다" : (p >= 0.01 ? "아직 1%를 넘습니다" : "독립 재현이 오류를 걸러 냄")), ok);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "재현 방식", value: "same", options: [{ v: "same", t: "같은 팀이 되풀이" }, { v: "ind", t: "다른 팀들이 따로" }], onPick: function (x) { mode = x; draw(); } });
      api.slider({ label: "재현 실험 횟수", min: 1, max: 6, step: 1, value: 1, fmt: function (x) { return x + "번"; }, onInput: function (x) { k = x; draw(); } });
      api.info("거짓 결론이 나온 까닭은 반은 우연, 반은 연구팀의 숨은 실수라고 가정합니다. 우연은 되풀이할 때마다 5%로 걸러지지만, 숨은 실수는 <b>같은 팀이 같은 방법으로 하면 그대로 되풀이</b>됩니다.");
      draw();
      return {
        judge: function () {
          var p = survive();
          if (mode !== "ind") return { ok: false, msg: "같은 팀이 되풀이하면 숨은 실수가 그대로 남아 확률이 50% 아래로 내려가지 않습니다." };
          if (months() > 18) return { ok: false, msg: k + "번이면 " + months() + "개월이 걸려 기한을 넘깁니다. 더 적은 횟수로도 1% 아래가 됩니다." };
          if (p >= 0.01) return { ok: false, msg: "살아남을 확률 " + (p * 100).toFixed(1) + "% — 아직 1%를 넘습니다." };
          return { ok: true, msg: "다른 팀 " + k + "번 재현 → 거짓 결론이 살아남을 확률 " + (p * 100).toFixed(3) + "%, " + months() + "개월. 독립적인 재현이 과학 지식을 믿을 만하게 만듭니다." };
        }
      };
    },
    hints: [
      "먼저 재현 방식을 바꿔 보세요. 같은 팀이 되풀이하면 숨은 실수가 걸러지지 않습니다.",
      "다른 팀이 따로 하면 살아남을 확률은 0.05 × 0.05 × … 로 줄어듭니다. 1% 아래가 되는 가장 적은 횟수는?"
    ],
    solution: "<b>다른 팀들이 따로</b>, 재현 <b>2~3번</b>.",
    why: "과학 지식은 한 연구팀의 결과만으로 확정되지 않고, 다른 과학자들이 <b>독립적으로 재현</b>해 확인하는 <b>사회적 합의 과정</b>을 거칩니다. 같은 팀이 되풀이하면 우연은 걸러져도 그 팀만의 실수(장비, 방법, 기대에 따른 해석)는 걸러지지 않습니다.<br>" +
      "‘빛보다 빠른 중성미자’도 OPERA 팀이 장비를 다시 점검해 결함을 찾았고, 다른 팀(ICARUS)의 독립 측정이 이를 확인했습니다. 의약품 허가에서 여러 기관의 임상 시험을 요구하는 것도 같은 까닭입니다. ※ 수업용으로 단순화한 모형입니다."
  },

  /* ------------------------------------------------------------------ 2. 연주 시차 */
  {
    id: "c2", about: "02", tag: "역사 속 과학 탐구 · 예측과 측정의 한계", title: "300년 동안 보이지 않던 증거", short: "연주 시차",
    who: "🔭", name: "천문대 연구원",
    say: "“지구가 태양 둘레를 돈다면, 봄과 가을에 가까운 별을 보면 먼 별들을 배경으로 위치가 아주 조금 달라져 보여야 해요(<b>연주 시차</b>). 16세기 튀코 브라헤는 이것이 안 보이니 지구는 움직이지 않는다고 주장했지요. 연주 시차는 1838년에야 베셀이 <b>백조자리 61번 별</b>에서 처음 쟀습니다. 망원경의 정밀도를 바꿔 가며 이 별의 연주 시차를 잴 수 있게 해 주세요.”",
    predict: {
      q: "튀코 브라헤가 연주 시차를 보지 못한 가장 큰 까닭은?",
      options: ["㉠ 지구가 정말로 움직이지 않기 때문에", "㉡ 별이 생각보다 훨씬 멀어서, 시차가 당시 측정 정밀도보다 작았기 때문에", "㉢ 별이 스스로 움직여 시차를 지웠기 때문에"],
      answer: 1
    },
    task: "별과 망원경 정밀도를 정해 <b>백조자리 61번 별의 연주 시차를 뚜렷하게(측정 오차의 2배 이상)</b> 잡아내세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var PREC = [60, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];
      var WHO = ["튀코 브라헤의 눈금 기구(1580년대)", "초기 망원경", "", "", "", "", "", "", "베셀의 태양의(1838년)", "현대 지상 망원경"];
      var STAR = { cen: { n: "알파 센타우리", ly: 4.37 }, cyg: { n: "백조자리 61번 별", ly: 11.4 }, veg: { n: "베가", ly: 25 } };
      var star = "veg", pi = 0;
      function par() { return 1 / (STAR[star].ly / 3.2616); }   /* 초(″) */
      function draw() {
        var CH = cv.H, p = par(), e = PREC[pi], ok = p >= 2 * e;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, 612, CH, { x: 150, y: 252, rx: 140, ry: 22 });
        K.bigText(ctx, ok ? "시차가 보인다" : "오차에 묻힌다", 16, 34, 22, ok ? "#8ce99a" : "#ffffff");
        /* 입체 미니어처: 비스듬히 본 공전 궤도판 + 봄·가을의 지구 + 가까운 별 */
        var sx = 150, sy = 222, R = 104;
        ctx.fillStyle = "rgba(60,80,120,.25)"; ctx.beginPath(); ctx.ellipse(sx, sy + 6, R + 8, 30, 0, 0, Math.PI); ctx.fill();
        var og = ctx.createRadialGradient(sx, sy, 8, sx, sy, R + 8); og.addColorStop(0, "#f4f8ff"); og.addColorStop(1, "#c5d3ea");
        ctx.fillStyle = og; ctx.beginPath(); ctx.ellipse(sx, sy, R + 8, 30, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(28,126,214,.5)"; ctx.lineWidth = 1.3; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.ellipse(sx, sy, R, 26, 0, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
        var tx = sx, ty = 70;
        K.line(ctx, { x: sx - R, y: sy - 8 }, { x: tx, y: ty }, LT.blue, 1.6, [5, 4]); K.line(ctx, { x: sx + R, y: sy - 8 }, { x: tx, y: ty }, LT.blue, 1.6, [5, 4]);
        K.wedge(ctx, tx, ty, Math.atan2(sy - ty, -R), Math.atan2(sy - ty, R), 30, "rgba(28,126,214,.18)", LT.blue);
        K.sun(ctx, sx, sy - 10, 9); K.planet(ctx, sx, sy - 10, 8, "#fff3c4", "#e08a00");
        K.earth(ctx, sx - R, sy - 8, 7); K.earth(ctx, sx + R, sy - 8, 7);
        K.glow(ctx, tx, ty, 4, "rgba(255,200,80,.98)", 3.2);
        var R2 = K.rng(9); for (var i = 0; i < 14; i++) { ctx.fillStyle = "rgba(20,40,90,.35)"; ctx.beginPath(); ctx.arc(30 + R2() * 240, 54 + R2() * 40, 1.3, 0, 6.2832); ctx.fill(); }
        lpill(ctx, STAR[star].n + " (" + STAR[star].ly + " 광년)", tx + 12, ty - 8, { s: 10.5, c: "#a85d00", box: [0, 300] });
        lpill(ctx, "봄", sx - R, sy + 26, { s: 10.5, a: "center", c: LT.blue, box: [0, 300] });
        lpill(ctx, "가을", sx + R, sy + 26, { s: 10.5, a: "center", c: LT.blue, box: [0, 300] });
        K.warn(ctx, 16, CH - 10, "⚠ 각은 크게 과장");
        /* 측정 눈금: 0과 잰 시차, 오차 막대 */
        var span = Math.max(1.6, 4 * e);
        var g = K.chart(ctx, { x: 306, y: 70, w: 300, h: 130, pl: 10, pr: 12, pt: 18, pb: 30, x0: -span / 2, x1: span / 2, y0: 0, y1: 1, xt: 4, yt: 1, light: true,
          xf: function (q) { return (Math.abs(q) < 1e-9 ? "0" : (span >= 4 ? q.toFixed(0) : (span >= 1.6 ? q.toFixed(1) : q.toFixed(2)))) + "″"; }, yf: function () { return ""; } });
        K.line(ctx, { x: g.X(0), y: g.T }, { x: g.X(0), y: g.B }, LT.mute, 1.5, [4, 3]);
        var c0 = ok ? LT.green : LT.orange, xl = Math.max(g.L, g.X(p - e)), xr = Math.min(g.R, g.X(p + e));
        cube(ctx, xl, g.Y(0.62), Math.max(2, xr - xl), 16, 10, ok ? "rgba(15,159,118,.45)" : "rgba(232,89,12,.4)", ok ? "rgba(15,159,118,.3)" : "rgba(232,89,12,.28)", ok ? "rgba(11,115,87,.45)" : "rgba(184,67,10,.4)");
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(g.X(p), g.Y(0.62) + 8, 6.5, 0, 6.2832); ctx.fill();
        ctx.fillStyle = c0; ctx.beginPath(); ctx.arc(g.X(p), g.Y(0.62) + 8, 4.5, 0, 6.2832); ctx.fill();
        lpill(ctx, "잰 시차 ± 오차", g.X(p), g.Y(0.62) - 14, { s: 10.5, a: "center", c: c0, box: [306, 606] });
        note(ctx, "0 = 움직임 없음", g.X(0) - 4, g.B - 6, { s: 10, a: "right" });
        note(ctx, "잰 시차 (″, 1″ = 1/3600도)", 312, 62, { s: 10.5 });
        card(ctx, 620, W, CH, "판정", ok ? "시차가 보인다" : "오차에 묻힌다", ok ? LT.green : LT.red, [
          ["실제 연주 시차", p.toFixed(3) + " ″"],
          ["측정 오차", "± " + e + " ″", LT.blue],
          ["시차 ÷ 오차", (p / e).toFixed(2) + " 배", ok ? LT.green : LT.red]
        ], ok ? "오차의 2배 이상 — 뚜렷함" : "오차의 2배 이상이어야 함", ok);
        if (WHO[pi]) note(ctx, WHO[pi], 638, 200, { s: 10.5, c: LT.blue, w: "800" });
        return ok;
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "별", value: "veg", options: [{ v: "cen", t: "알파 센타우리" }, { v: "cyg", t: "백조자리 61번" }, { v: "veg", t: "베가" }], onPick: function (x) { star = x; draw(); } });
      api.slider({ label: "망원경의 측정 오차", min: 0, max: 9, step: 1, value: 0, fmt: function (x) { return "± " + PREC[x] + " ″"; }, onInput: function (x) { pi = x; draw(); } });
      api.info("거리가 1 파섹(3.26 광년)인 별의 연주 시차가 1″ 입니다. 별이 멀수록 시차는 작아집니다. 튀코 브라헤의 기구는 약 1′(60″)까지 잴 수 있었습니다.");
      draw();
      return {
        judge: function () {
          var p = par(), e = PREC[pi];
          if (star !== "cyg") return { ok: false, msg: "베셀이 처음 잰 별은 백조자리 61번 별입니다. 그 별로 맞춰 보세요." };
          if (p < 2 * e) return { ok: false, msg: "시차 " + p.toFixed(3) + "″ 가 측정 오차 ± " + e + "″ 에 묻힙니다. 오차의 2배 이상이 되어야 뚜렷하게 보입니다." };
          return { ok: true, msg: "오차 ± " + e + "″ 로 시차 " + p.toFixed(3) + "″ 를 잡아냈습니다. 튀코 브라헤의 기구보다 약 " + Math.round(60 / e) + "배 정밀해야 했어요." };
        }
      };
    },
    hints: [
      "백조자리 61번 별의 연주 시차는 약 0.29″ 입니다. 오차가 그 절반보다 작아야 합니다.",
      "오차 ± 0.1″ 이하의 망원경이 필요합니다."
    ],
    solution: "<b>백조자리 61번 별</b>, 측정 오차 <b>± 0.1″ 또는 ± 0.05″</b>.",
    why: "지동설은 연주 시차를 예측했지만, 별이 너무 멀어서 시차가 1″ 도 되지 않았습니다. 튀코 브라헤의 기구보다 수백 배 정밀한 망원경이 나온 1838년에야 베셀이 그 증거를 찾았습니다.<br>" +
      "증거가 <b>보이지 않는 것</b>과 증거가 <b>없는 것</b>은 다릅니다. 과학 지식은 측정 기술의 발전과 함께 확인되고 고쳐지며, 새로운 도구가 새로운 증거를 엽니다. ※ 오차 2배 판정은 수업용 기준입니다."
  },

  /* ------------------------------------------------------------------ 3. 일식 관측 설계 */
  {
    id: "c3", about: "02", tag: "결정적 관측 · 두 이론 가르기", title: "1919년 일식, 뉴턴이냐 아인슈타인이냐", short: "일식 관측",
    who: "🌑", name: "일식 관측대",
    say: "“태양 가까이 지나는 별빛이 태양의 중력 때문에 휘어진다면, 일식 때 태양 옆 별의 위치가 조금 밀려 보입니다. <b>뉴턴 역학</b>으로 계산하면 1.75″ 의 절반인 <b>0.87″</b>, 아인슈타인의 <b>일반 상대성 이론</b>으로는 <b>1.75″</b>예요. 별 사진 하나하나에는 측정 오차가 있어서, 여러 별을 재어 평균을 내야 합니다. 두 이론 가운데 하나를 확실히 가를 수 있게 관측을 설계해 주세요.”",
    predict: {
      q: "잰 별의 수를 4배로 늘리면, 평균값의 오차는 어떻게 될까요?",
      options: ["㉠ 4배로 커진다", "㉡ 절반으로 줄어든다", "㉢ 4분의 1로 줄어든다", "㉣ 변하지 않는다"],
      answer: 1
    },
    task: "망원경과 잴 별의 수를 정해, 측정 범위(평균 ± 2 × 오차)가 <b>아인슈타인의 예측은 포함하고 뉴턴의 예측은 벗어나게</b> 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W;
      var tel = "a", N = 2, SIG = { a: 1.6, b: 0.9 }, FIELD = 7, MEAN = 1.75;
      function se() { return SIG[tel] / Math.sqrt(N); }
      function draw() {
        var CH = cv.H, s = se(), lo = MEAN - 2 * s, hi = MEAN + 2 * s, over = tel === "b" && N > FIELD, ok = lo > 0.87 && !over, i;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, 612, CH, { x: 130, y: 262, rx: 120, ry: 16 });
        K.bigText(ctx, "잰 범위 " + lo.toFixed(2) + " ~ " + hi.toFixed(2) + "″", 16, 34, 20, ok ? "#8ce99a" : "#ffffff");
        /* 입체 미니어처: 일식 사진 건판(유리판) — 검은 달 둘레의 코로나와 태양 옆 별들 */
        var px = 26, py = 66, pw = 200, ph = 176;
        cube(ctx, px, py, pw, ph, 14, "#141a2e", "#c9d1dc", "#4a5366");
        var cx = px + pw / 2, cy = py + ph / 2;
        var cg = ctx.createRadialGradient(cx, cy, 20, cx, cy, 62); cg.addColorStop(0, "rgba(255,250,230,.95)"); cg.addColorStop(.45, "rgba(255,236,190,.35)"); cg.addColorStop(1, "rgba(255,236,190,0)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 62, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#05070d"; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 6.2832); ctx.fill();
        var R2 = K.rng(31);
        for (i = 0; i < 20; i++) {
          var a = R2() * 6.2832, rr = 36 + R2() * 46, bx = cx + Math.cos(a) * rr * 1.05, by = cy + Math.sin(a) * rr * .88, on = i < N, dim = tel === "b" && i >= FIELD;
          if (!on) continue;
          if (!dim) { K.line(ctx, { x: bx, y: by }, { x: bx + Math.cos(a) * 7, y: by + Math.sin(a) * 7 }, "rgba(255,140,140,.9)", 1.4); }
          K.glow(ctx, bx, by, 1.7, dim ? "rgba(120,130,150,.6)" : "rgba(220,235,255,.98)", 2.6);
        }
        lpill(ctx, "1919년 일식 사진 (모형)", px + pw / 2, py + ph + 24, { s: 10.5, a: "center", c: LT.ink, box: [0, 250] });
        K.warn(ctx, px + pw / 2, py + ph - 10, "⚠ 밀림은 크게 과장", "center");
        /* 휘어진 각도의 측정 범위 */
        var g = K.chart(ctx, { x: 252, y: 70, w: 356, h: 150, pl: 14, pr: 14, pt: 30, pb: 30, x0: -0.5, x1: 3.5, y0: 0, y1: 1, xt: 4, yt: 1, light: true,
          xf: function (q) { return (Math.round(q * 10) / 10) + "″"; }, yf: function () { return ""; } });
        K.line(ctx, { x: g.X(0.87), y: g.T - 4 }, { x: g.X(0.87), y: g.B }, LT.red, 2, [5, 4]);
        K.line(ctx, { x: g.X(1.75), y: g.T - 4 }, { x: g.X(1.75), y: g.B }, LT.blue, 2, [5, 4]);
        lpill(ctx, "뉴턴 0.87″", g.X(0.87) - 4, g.T - 8, { s: 10.5, a: "right", c: LT.red, box: [252, 608] });
        lpill(ctx, "아인슈타인 1.75″", g.X(1.75) + 4, g.T - 8, { s: 10.5, c: LT.blue, box: [252, 608] });
        var L = Math.max(g.L, g.X(lo)), Rr = Math.min(g.R, g.X(hi)), c0 = ok ? LT.green : LT.orange;
        cube(ctx, L, g.Y(0.5) - 8, Math.max(2, Rr - L), 16, 10, ok ? "rgba(15,159,118,.45)" : "rgba(245,159,0,.45)", ok ? "rgba(15,159,118,.3)" : "rgba(245,159,0,.3)", ok ? "rgba(11,115,87,.45)" : "rgba(196,127,0,.45)");
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(g.X(MEAN), g.Y(0.5), 6.5, 0, 6.2832); ctx.fill();
        ctx.fillStyle = c0; ctx.beginPath(); ctx.arc(g.X(MEAN), g.Y(0.5), 4.5, 0, 6.2832); ctx.fill();
        note(ctx, "막대 = 평균 ± 2 × 평균의 오차", g.L + 4, g.B - 8, { s: 10 });
        note(ctx, "잰 별 " + N + "개" + (over ? " — 큰 망원경 시야에는 " + FIELD + "개뿐" : ""), 260, 250, { s: 11, c: over ? LT.red : LT.mute });
        card(ctx, 620, W, CH, "판정", ok ? "두 이론을 가른다" : (over ? "별이 모자란다" : "뉴턴도 범위 안"), ok ? LT.green : LT.red, [
          ["별 하나의 측정 오차", "± " + SIG[tel] + " ″"],
          ["평균의 오차", "± " + s.toFixed(2) + " ″", LT.blue],
          ["범위의 아래 끝", lo.toFixed(2) + " ″", lo > 0.87 ? LT.green : LT.red]
        ], ok ? "뉴턴의 예측을 벗어났습니다" : "아래 끝이 0.87″보다 커야 함", ok);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "망원경", value: "a", options: [{ v: "a", t: "넓게 찍는 작은 망원경 (별 하나 ± 1.6″)" }, { v: "b", t: "정밀하지만 시야가 좁은 큰 망원경 (별 하나 ± 0.9″)" }], onPick: function (x) { tel = x; draw(); } });
      api.slider({ label: "잰 별의 수", min: 1, max: 20, step: 1, value: 2, fmt: function (x) { return x + "개"; }, onInput: function (x) { N = x; draw(); } });
      api.info("평균의 오차는 별 하나의 오차 ÷ √(잰 별의 수)입니다. 큰 망원경은 시야가 좁아 태양 옆 밝은 별을 7개까지만 담을 수 있습니다. 모의 관측의 평균은 1.75″ 로 두었습니다.");
      draw();
      return {
        judge: function () {
          var s = se(), lo = MEAN - 2 * s;
          if (tel === "b" && N > FIELD) return { ok: false, msg: "큰 망원경의 좁은 시야에는 태양 옆 밝은 별이 " + FIELD + "개뿐이라 " + N + "개를 잴 수 없습니다." };
          if (lo <= 0.87) return { ok: false, msg: "측정 범위가 " + lo.toFixed(2) + "″ 까지 내려가 뉴턴의 예측 0.87″ 도 들어갑니다. 이 관측으로는 두 이론을 가를 수 없습니다." };
          return { ok: true, msg: "평균의 오차 ± " + s.toFixed(2) + "″ → 범위 " + lo.toFixed(2) + " ~ " + (MEAN + 2 * s).toFixed(2) + "″. 뉴턴의 예측을 벗어나 두 이론을 가르는 결정적 관측이 됩니다." };
        }
      };
    },
    hints: [
      "범위의 아래쪽 끝(1.75 − 2 × 평균의 오차)이 0.87보다 커야 합니다. 평균의 오차가 0.44″ 보다 작아야 합니다.",
      "작은 망원경(± 1.6″)이면 별 14개 이상, 큰 망원경(± 0.9″)이면 5개 이상이 필요합니다. 큰 망원경은 7개가 한계입니다."
    ],
    solution: "작은 망원경이면 별 <b>14~20개</b>, 큰 망원경이면 별 <b>5~7개</b>.",
    why: "결정적 관측은 두 이론이 <b>서로 다른 값을 예측</b>하고, 측정의 정밀도가 그 차이를 가를 만큼 충분할 때 성립합니다. 한 번의 측정은 오차가 커도 여러 번 재어 평균을 내면 오차가 √N 분의 1로 줄어듭니다.<br>" +
      "1919년 에딩턴의 관측대는 일식 사진으로 아인슈타인의 예측에 가까운 값을 얻었고, 이 결과는 뉴턴 역학에서 일반 상대성 이론으로 넘어가는 계기가 되었습니다. 다만 당시 자료의 오차가 커서 논란이 이어졌고, 뒤에 더 정밀한 전파 관측이 결론을 굳혔습니다. ※ 오차 값은 수업용으로 단순화했습니다."
  }
  ]
});
})();
