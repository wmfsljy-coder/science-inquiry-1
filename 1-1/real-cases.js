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

function phase(H, ctx, cx, cy, r, k) {          /* 오른쪽이 태양 쪽, k = 밝은 부분 비율 */
  ctx.save();
  ctx.fillStyle = H.v("--line"); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = H.v("--amber-700"); ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); ctx.fill();
  var ex = Math.abs(2 * k - 1) * r;
  ctx.fillStyle = k >= 0.5 ? H.v("--amber-700") : H.v("--line");
  ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(ex, 0.01), r, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function chart(H, ctx, W, CH, pick) {
  H.paper(ctx, W, CH);
  var x0 = 50, x1 = 560, y0 = 26, y1 = CH - 40;
  function X(i) { return x0 + i / Math.max(1, R.length - 1) * (x1 - x0); }
  function Yd(v) { return y1 - v / 65 * (y1 - y0); }
  function Yp(v) { return y1 - v / 100 * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  [0, 20, 40, 60].forEach(function (v) { H.text(ctx, v + "″", x0 - 6, Yd(v) + 4, { s: 10, a: "right", c: H.v("--brand") }); });
  [0, 50, 100].forEach(function (v) { H.text(ctx, v + "%", x1 + 6, Yp(v) + 4, { s: 10, c: H.v("--amber-700") }); });
  R.forEach(function (r, i) { var mo = +r[0].slice(5, 7); if ((i === 0 || R[i - 1][0].slice(5, 7) !== r[0].slice(5, 7)) && mo % 3 === 1) H.text(ctx, r[0].slice(0, 7), X(i), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
  H.line(ctx, R.map(function (r, i) { return [X(i), Yd(r[2])]; }), H.v("--brand"), 2.5);
  H.line(ctx, R.map(function (r, i) { return [X(i), Yp(r[1])]; }), H.v("--amber-700"), 2.5);
  H.text(ctx, "파랑: 겉보기 지름(″)   주황: 밝게 보이는 부분(%)", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
  if (pick != null) H.dash(ctx, X(pick), y0, X(pick), y1, H.v("--ink"), 1.2);
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 금성의 위상 변화가 지동설의 증거가 되는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 금성의 위상", title: "금성이 가장 둥글게 보일 때", short: "보름달 금성",
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
        var r = R[i] || ["", 0, 0, 0, 0, "T"];
        phase(H, ctx, 735, 105, Math.max(6, r[2] * 1.3), r[1] / 100);
        H.text(ctx, "태양 쪽 →", 735, 200, { s: 10.5, a: "center", c: H.v("--mist") });
        H.rows(ctx, 640, 214, [[ko(r[0]), r[1].toFixed(1) + "% · " + r[2].toFixed(1) + "″", "--amber-700"]], 40);
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
    why: "천동설(프톨레마이오스)에서는 금성이 늘 지구와 태양 사이에서 맴돌아, 지구에서는 초승달 모양만 보여야 합니다. 그런데 갈릴레이는 1610년, 금성이 작을 때는 둥글고 클 때는 가는 초승달이 되는 것을 보았습니다. 금성이 태양 둘레를 돌아 태양 너머로도 간다는 뜻입니다. 프톨레마이오스의 천동설로는 설명할 수 없는 관측이었고(태양 둘레를 도는 금성을 인정한 티코 브라헤의 체계로는 설명되어 지동설의 완전한 증명은 아니었어요), 지동설 쪽으로 무게를 크게 옮겨 놓았습니다.<br>"
      + "실제 자료에서도 둥근 금성(약 100%)은 지름이 약 10″ 로 가장 작고, 가는 초승달 금성은 약 60″ 로 여섯 배쯤 큽니다. 모양과 크기가 함께 바뀐다는 것이 핵심입니다."
  },
  {
    id: "r2", tag: "실제 자료 · 크기 재기", title: "금성의 진짜 지름 재기", short: "금성의 지름",
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
        H.paper(ctx, W, cv.H);
        phase(H, ctx, 120, 120, n[2] * 1.4, n[1] / 100);
        phase(H, ctx, 290, 120, f[2] * 1.4, f[1] / 100);
        H.text(ctx, ko(n[0]), 120, 225, { s: 11, w: "800", a: "center", c: H.v("--mist") });
        H.text(ctx, ko(f[0]), 290, 225, { s: 11, w: "800", a: "center", c: H.v("--mist") });
        H.rows(ctx, 420, 30, [["가장 크게 보인 날", "지름 " + n[2].toFixed(1) + "″ · 거리 " + n[3].toFixed(3) + " AU"], ["비교: 가장 작게 보인 날", "지름 " + f[2].toFixed(1) + "″ · 거리 " + f[3].toFixed(3) + " AU"], ["내 답 (금성 지름)", g.toLocaleString() + " km", null, true]], 60);
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
