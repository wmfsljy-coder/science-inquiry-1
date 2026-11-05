/* 과학탐구실험1 Ⅰ 과학의 본성과 역사 속의 과학 탐구 — 실제 자료
   r1 금성이 가장 둥글게 보일 때 — 지구에서 본 금성의 밝은 부분과 겉보기 지름(2025~2026)
   r2 금성의 진짜 지름 재기 — 겉보기 지름과 거리로 크기 구하기
   자료: data/venus-2025.js (NASA JPL Horizons 천체력) */
(function () {
"use strict";
var V = window.REAL_VENUS || { rows: [] };
var R = V.rows;                                      /* [날짜, 밝은 부분 %, 지름 ″, 거리 AU, 이각 °, T/L] */
var FULL = 0, NEAR = 0;
R.forEach(function (r, i) { if (r[4] < R[FULL][4]) FULL = i; if (r[2] > R[NEAR][2]) NEAR = i; });   /* FULL = 태양과 가장 가까운 날(외합) */
var AU = 149597871, ASEC = Math.PI / 648000;
function dia(r) { return r[2] * ASEC * r[3] * AU; }
var LAST = R.length - 1, DN = R.length ? dia(R[NEAR]) : 12104, DF = R.length ? dia(R[FULL]) : 12104;
var SRC = "<small>출처: 미국 항공우주국 제트추진연구소(NASA JPL) Horizons 천체력 — 지구 중심에서 본 금성, 2025년 1월 1일 ~ 2026년 7월 1일, 5일 간격(밝게 보이는 부분 %, 겉보기 지름 ″, 지구와의 거리 AU, 태양과 벌어진 각). 사본은 data/venus-2025.js.</small>";
function ko(d) { var p = d.split("-"); return p[0] + "년 " + (+p[1]) + "월 " + (+p[2]) + "일"; }

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
function card(ctx, RX, W, CH, title, head, headCol, rows, tip, good) {
  K.card(ctx, RX, 0, W - RX, CH, title);
  if (head) K.t(ctx, head, RX + 18, 60, { s: 19, w: "900", c: headCol || LT.ink });
  rows.forEach(function (r, i) { K.row(ctx, r[0], r[1], RX + 18, W - 18, 94 + i * 27, r[2]); });
  if (tip) K.tip(ctx, tip, RX + 12, CH - 46, W - RX - 24, good);
}
/* 금성 입체 공: 오른쪽이 태양 쪽, k = 밝은 부분 비율 */
function vball(ctx, cx, cy, r, k) {
  ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(cx + r * .1, cy + r + 6, r * .8, Math.max(2, r * .14), 0, 0, 6.2832); ctx.fill();
  var ng = ctx.createRadialGradient(cx + r * .3, cy - r * .2, r * .1, cx, cy, r); ng.addColorStop(0, "#3c4258"); ng.addColorStop(1, "#0e111b");
  ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
  var kk = 2 * k - 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
  ctx.ellipse(cx, cy, Math.max(Math.abs(kk) * r, 0.01), r, 0, Math.PI / 2, -Math.PI / 2, kk < 0); ctx.closePath();
  var g = ctx.createRadialGradient(cx + r * .35, cy - r * .35, r * .05, cx, cy, r * 1.05);
  g.addColorStop(0, "#fffbe8"); g.addColorStop(.55, "#f1d68a"); g.addColorStop(1, "#b8893a");
  ctx.fillStyle = g; ctx.fill();
}
function chart(H, ctx, W, CH, pick) {
  ctx.clearRect(0, 0, W, CH);
  K.studio(ctx, 0, 0, 560, CH);
  var g = K.chart(ctx, { x: 4, y: 26, w: 552, h: CH - 30, pl: 40, pb: 30, pt: 14, pr: 40, x0: 0, x1: Math.max(1, R.length - 1), y0: 0, y1: 65, xt: 1, yt: 5, light: true,
    xf: function () { return ""; }, yf: function (q) { return Math.round(q) + "″"; } });
  function X(i) { return g.X(i); }
  function Yp(v) { return g.Y(v / 100 * 65); }
  [0, 50, 100].forEach(function (v) { K.t(ctx, v + "%", g.R + 6, Yp(v) + 4, { s: 10, c: "#a85d00", w: "700" }); });
  R.forEach(function (r, i) { var mo = +r[0].slice(5, 7); if ((i === 0 || R[i - 1][0].slice(5, 7) !== r[0].slice(5, 7)) && mo % 3 === 1) K.t(ctx, r[0].slice(0, 7), X(i), g.B + 15, { s: 10, a: "center", c: LT.mute, w: "600" }); });
  K.plot(ctx, g, R.map(function (r, i) { return [i, r[2]]; }), LT.blue, { w: 2.6, light: true });
  K.plot(ctx, g, R.map(function (r, i) { return [i, r[1] / 100 * 65]; }), LT.orange, { w: 2.6, light: true });
  note(ctx, "파랑: 겉보기 지름(″, 왼쪽 눈금)   주황: 밝게 보이는 부분(%, 오른쪽 눈금)", 10, 18, { s: 11 });
  if (pick != null) {
    K.line(ctx, { x: X(pick), y: g.T }, { x: X(pick), y: g.B }, "rgba(20,40,90,.55)", 1.4);
    [[R[pick][2], LT.blue], [R[pick][1] / 100 * 65, LT.orange]].forEach(function (q) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X(pick), g.Y(q[0]), 6, 0, 6.2832); ctx.fill(); ctx.fillStyle = q[1]; ctx.beginPath(); ctx.arc(X(pick), g.Y(q[0]), 4, 0, 6.2832); ctx.fill(); });
  }
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 금성의 위상 변화가 지동설의 증거가 되는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "02", tag: "실제 자료 · 금성의 위상", title: "금성이 가장 둥글게 보일 때", short: "보름달 금성",
    who: "🔭", name: "과학관 천문 해설사",
    say: "“갈릴레이는 망원경으로 금성이 달처럼 차고 기우는 것을 보았어요. 아래는 NASA가 계산한 <b>2025~2026년 금성</b>의 실제 모습입니다. 금성이 <b>가장 둥글게(보름달꼴)</b> 보이는 날을 찾고, 그때 금성이 <b>태양의 어느 쪽</b>에 있는지 골라 주세요.”",
    predict: {
      q: "금성이 보름달처럼 둥글게 보일 때, 금성은 지구에서 가까울까요, 멀까요?",
      options: ["㉠ 가장 가깝다", "㉡ 가장 멀다", "㉢ 거리는 늘 같다"],
      answer: 1
    },
    task: "날짜를 옮겨 밝은 부분이 가장 큰 날을 고르고, 그때 금성의 자리를 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, i = 0, side = "none";
      function draw() {
        chart(H, ctx, W, cv.H, i);
        var r = R[i] || ["2025-01-01", 0, 0, 0, 0, "T"], CH = cv.H, RX = 568;
        K.card(ctx, RX, 0, W - RX, CH, "고른 날의 금성 (망원경 속, 같은 배율)");
        var vx = RX + 112, vy = 132;
        ctx.fillStyle = "#0b0f24"; ctx.beginPath(); ctx.arc(vx, vy, 84, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#8a93a3"; ctx.lineWidth = 6; ctx.stroke();
        vball(ctx, vx, vy, Math.max(6, r[2] * 1.3), r[1] / 100);
        note(ctx, "태양 쪽 →", vx + 80, vy + 100, { s: 10.5, a: "right" });
        var x0 = RX + 214;
        note(ctx, ko(r[0]), x0, 70, { s: 12, w: "900", c: LT.ink });
        note(ctx, "밝은 부분", x0, 100); K.t(ctx, r[1].toFixed(1) + "%", x0, 120, { s: 16, w: "900", c: LT.orange });
        note(ctx, "겉보기 지름", x0, 148); K.t(ctx, r[2].toFixed(1) + "″", x0, 168, { s: 16, w: "900", c: LT.blue });
        note(ctx, "지구와의 거리", x0, 196); K.t(ctx, r[3].toFixed(2) + " AU", x0, 216, { s: 16, w: "900", c: LT.ink });
        K.tip(ctx, r[1] >= 90 ? "둥글고 작게 보이는 때" : (r[1] <= 30 ? "가늘고 크게 보이는 때" : "모양과 크기가 함께 바뀝니다"), RX + 12, CH - 46, W - RX - 24, null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "날짜", min: 0, max: Math.max(0, R.length - 1), step: 1, value: 0, fmt: function (x) { return R[x] ? ko(R[x][0]) : ""; }, onInput: function (x) { i = x; api.changed(); draw(); } });
      api.seg({ label: "그때 금성의 자리", value: "none", options: [{ v: "front", t: "태양 앞쪽(지구와 태양 사이)" }, { v: "back", t: "태양 뒤쪽(태양 너머)" }, { v: "side", t: "태양 옆, 지구와 같은 거리" }], onPick: function (x) { side = x; api.changed(); } });
      api.info("오른쪽 그림은 고른 날 금성을 같은 배율로 그린 것입니다(크기 = 겉보기 지름). 보름달꼴에 가까운 날에는 태양과 거의 같은 방향이라 실제로는 햇빛에 묻혀 보기 어려워요. " + SRC
        + "<div data-link='{\"id\":\"nasa-eyes\",\"title\":\"NASA Eyes on the Solar System\",\"src\":\"미국 항공우주국\",\"url\":\"https://eyes.nasa.gov/apps/solar-system/#/venus\",\"ask\":\"오늘 날짜에서 태양·지구·금성의 자리를 위에서 내려다보고, 지금 금성이 지구에서 보아 태양의 앞쪽에 가까운지 뒤쪽에 가까운지 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (!R[i] || R[i][1] < R[FULL][1] - 0.15) return { ok: false, msg: (R[i] ? ko(R[i][0]) : "") + "의 밝은 부분은 " + (R[i] ? R[i][1].toFixed(1) : 0) + "%입니다. 더 둥근 날이 있습니다." };
          if (side !== "back") return { ok: false, msg: "날은 맞았습니다. 그때 겉보기 지름이 " + R[FULL][2].toFixed(1) + "″ 로 가장 작아요. 지구에서 가장 멀다면 금성은 어디에 있을까요?" };
          return { ok: true, msg: ko(R[FULL][0]) + " 밝은 부분 " + R[FULL][1].toFixed(1) + "%, 지름 " + R[FULL][2].toFixed(1) + "″, 거리 " + R[FULL][3].toFixed(2) + " AU — 태양 너머에 있을 때 둥글고 작게 보입니다. 가장 크게 보인 " + ko(R[NEAR][0]) + "(" + R[NEAR][2].toFixed(1) + "″)에는 밝은 부분이 " + R[NEAR][1].toFixed(1) + "% 인 가는 초승달이었어요." };
        }
      };
    },
    hints: ["주황 선이 가장 높은 곳으로 날짜를 옮기세요. 그날 파랑 선은 어떤가요?", "가장 작게 보인다 = 가장 멀다. 지구에서 가장 먼 금성의 자리는 태양 너머입니다."],
    solution: "<b>" + (R[FULL] ? ko(R[FULL][0]) : "2026년 1월") + " 무렵</b>, 금성은 <b>태양 뒤쪽</b>에 있다.",
    why: "천동설(프톨레마이오스)에서는 금성이 늘 지구와 태양 사이에서 맴돌아, 지구에서는 초승달 모양만 보여야 합니다. 그런데 갈릴레이는 1610년, 금성이 작을 때는 둥글고 클 때는 가는 초승달이 되는 것을 보았습니다. 금성이 태양 둘레를 돌아 태양 너머로도 간다는 뜻입니다. 프톨레마이오스의 천동설로는 설명할 수 없는 관측이었고(태양 둘레를 도는 금성을 인정한 튀코 브라헤의 체계로는 설명되어 지동설의 완전한 증명은 아니었어요), 지동설 쪽으로 무게를 크게 옮겨 놓았습니다.<br>"
      + "실제 자료에서도 둥근 금성(약 100%)은 지름이 약 10″ 로 가장 작고, 가는 초승달 금성은 약 60″ 로 여섯 배쯤 큽니다. 모양과 크기가 함께 바뀐다는 것이 핵심입니다."
  },
  {
    id: "r2", sec: "02", tag: "실제 자료 · 크기 재기", title: "금성의 진짜 지름 재기", short: "금성의 지름",
    who: "📐", name: "천문대 연구원",
    say: "“멀리 있는 물체의 진짜 크기는 <b>겉보기 지름(각)</b>과 <b>거리</b>로 구해요. 금성이 가장 크게 보인 날의 값으로 <b>금성의 진짜 지름</b>을 구해 주세요. 지름 = (겉보기 지름 ″ ÷ 206,265) × 거리(km), 1 AU = 1억 4960만 km.”",
    predict: {
      q: "금성이 가장 크게 보인 날과 가장 작게 보인 날의 값으로 각각 지름을 구하면 어떻게 될까요?",
      options: ["㉠ 가장 크게 보인 날의 지름이 더 크다", "㉡ 두 값이 거의 같다", "㉢ 가장 작게 보인 날의 지름이 더 크다"],
      answer: 1
    },
    task: "금성의 지름을 슬라이더로 맞추세요(± 300 km).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, g = 8000;
      var n = R[NEAR] || ["", 1, 59.5, 0.281], f = R[FULL] || ["", 100, 9.8, 1.711];
      function draw() {
        var CH = cv.H, ok = Math.abs(g - DN) <= 300;
        ctx.clearRect(0, 0, W, CH);
        K.studio(ctx, 0, 0, 470, CH, { x: 220, y: 206, rx: 200, ry: 20 });
        /* 입체 미니어처: 받침대 위에 같은 배율로 놓은 두 날의 금성 */
        [[120, n, "가장 크게 보인 날"], [330, f, "가장 작게 보인 날"]].forEach(function (b) {
          cube(ctx, b[0] - 46, 196, 80, 14, 30, "#d9dee6", "#f3f5f8", "#aab2be");
          vball(ctx, b[0], 196 - 8 - b[1][2] * 1.2, b[1][2] * 1.2, b[1][1] / 100);
          lpill(ctx, b[2] + " · " + b[1][2].toFixed(1) + "″", b[0], 236, { s: 10.5, a: "center", c: LT.ink, box: [0, 470] });
        });
        K.bigText(ctx, "같은 금성, 거리만 다르다", 16, 32, 19, "#ffffff");
        /* 거리 띠: 지구에서 두 날의 금성까지 (AU) */
        var RX = 478;
        card(ctx, RX, W, CH, "두 날의 값 (NASA JPL)", "내 답 " + g.toLocaleString() + " km", ok ? LT.green : LT.blue, [
          ["크게 보인 날 " + ko(n[0]), n[2].toFixed(1) + "″ · " + n[3].toFixed(3) + " AU"],
          ["작게 보인 날 " + ko(f[0]), f[2].toFixed(1) + "″ · " + f[3].toFixed(3) + " AU"]
        ], null);
        var lx0 = RX + 30, lx1 = W - 30, ly = 172, sc = (lx1 - lx0) / 1.8;
        K.line(ctx, { x: lx0, y: ly }, { x: lx1, y: ly }, LT.line, 1.5);
        K.earth(ctx, lx0, ly, 7);
        K.planet(ctx, lx0 + n[3] * sc, ly, 5, "#fff3c4", "#b8893a"); K.planet(ctx, lx0 + f[3] * sc, ly, 5, "#fff3c4", "#b8893a");
        note(ctx, "지구", lx0, ly + 22, { s: 10, a: "center" });
        note(ctx, n[3].toFixed(2) + " AU", lx0 + n[3] * sc, ly - 12, { s: 10, a: "center", c: LT.blue });
        note(ctx, f[3].toFixed(2) + " AU", lx0 + f[3] * sc, ly - 12, { s: 10, a: "center", c: LT.blue });
        note(ctx, "지름 = (각″ ÷ 206,265) × 거리(km)", RX + 18, 214, { s: 10.5 });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "금성의 지름", min: 4000, max: 20000, step: 100, value: 8000, fmt: function (x) { return x.toLocaleString() + " km"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("206,265는 1 라디안을 초(″)로 나타낸 수입니다. 각이 아주 작을 때는 지름 ≈ 각(라디안) × 거리 로 어림할 수 있습니다. " + SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - DN) <= 300) return { ok: true, msg: "(" + n[2].toFixed(1) + " ÷ 206,265) × " + n[3].toFixed(3) + " × 1억 4960만 ≈ " + Math.round(DN).toLocaleString() + " km. 가장 작게 보인 날 값으로 구해도 " + Math.round(DF).toLocaleString() + " km — 거의 같습니다. 크기가 달라 보인 것은 거리가 달랐기 때문입니다." };
          return { ok: false, msg: g.toLocaleString() + " km는 " + (g < DN ? "작습니다" : "큽니다") + ". 거리를 km로 바꾼 뒤 각(라디안)을 곱하세요." };
        }
      };
    },
    hints: ["거리 = " + (R[NEAR] ? R[NEAR][3].toFixed(3) : "0.281") + " × 149,600,000 km ≈ " + Math.round((R[NEAR] ? R[NEAR][3] : 0.281) * 149.6) + "00만 km 쯤입니다.", "각 = " + (R[NEAR] ? R[NEAR][2].toFixed(1) : "59.5") + " ÷ 206,265 ≈ " + ((R[NEAR] ? R[NEAR][2] : 59.5) / 206265).toExponential(2) + " 라디안. 둘을 곱하세요."],
    solution: "약 <b>" + Math.round(DN / 100) * 100 + " km</b>(실제 금성 지름 약 12,104 km).",
    why: "같은 물체라도 가까우면 크게, 멀면 작게 보입니다. 겉보기 지름(각)과 거리를 함께 알면 진짜 크기를 구할 수 있고, 두 날의 자료로 구한 지름이 같다는 것은 ‘금성의 크기는 그대로인데 거리가 바뀐다’는 해석이 맞다는 확인이 됩니다.<br>"
      + "금성은 지름이 지구(약 12,742 km)와 거의 같아 ‘지구의 쌍둥이 행성’이라 불리지만, 두꺼운 이산화 탄소 대기 때문에 표면 온도가 약 460 °C나 됩니다."
  }
  ]
});
})();
