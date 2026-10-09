/* 과학탐구실험1 Ⅱ 과학 탐구의 과정과 절차 — 실제 자료
   r1 서울은 얼마나 더워졌나 — 1981~1990년과 2015~2024년의 한 해 평균 기온
   r2 추운 겨울의 반론 — 가장 추운 1월이 온난화를 뒤집을까
   r3 평균이 감춘 것 — 창원(155)의 여름은 더워지고 겨울은 추워졌다
   자료: data/seoul-temp.js (NASA POWER), data/cw155.js (기상청 창원 155) */
(function () {
"use strict";
var T = window.REAL_SEOUL || { annual: [], monthly: [] };
var A = {}; T.annual.forEach(function (r) { A[r[0]] = r[1]; });
function avg(a, b) { var s = 0, n = 0; for (var y = a; y <= b; y++) if (A[y] != null) { s += A[y]; n++; } return n ? s / n : 0; }
var M1 = avg(1981, 1990), M2 = avg(2015, 2024), D = M2 - M1;
var JAN = T.monthly.filter(function (r) { return r[1] === 1; });
var J = {}; JAN.forEach(function (r) { J[r[0]] = r[2]; });
var COLD = 2001; for (var y = 2001; y <= 2024; y++) if (J[y] != null && J[y] < J[COLD]) COLD = y;
var DEC = avg(COLD, COLD + 9);
var SRC = "<small>출처: 미국 항공우주국(NASA) POWER 자료 서비스 — 서울(북위 37.57°, 동경 126.98°) 지상 2 m 기온의 해 평균·달 평균, 1981~2024. 위성·관측을 합친 약 50 km 격자 평균이라 도심의 서울 관측소 값보다 1~2 °C 낮게 나옵니다. 변화의 크기를 보는 데 쓰세요. 사본은 data/seoul-temp.js.</small>";
var CWD = window.REAL_CW155 || { rows: [], season: [] };
var CWSE = (CWD.season || []).filter(function (r) { return r[0] >= 1987 && r[0] <= 2025 && r[2] != null; });   /* [연도, 여름(6~8월) 평균, 겨울(앞해 12월~2월) 평균] */
var CWR = (CWD.rows || []).filter(function (r) { return r[0] >= 1987 && r[0] <= 2025; });
function cwM(a, j) { var s = 0; a.forEach(function (r) { s += r[j]; }); return a.length ? s / a.length : 0; }
var CW_S0 = cwM(CWSE.slice(0, 10), 1), CW_S1 = cwM(CWSE.slice(-10), 1), CW_W0 = cwM(CWSE.slice(0, 10), 2), CW_W1 = cwM(CWSE.slice(-10), 2);
var CW_A0 = cwM(CWR.slice(0, 10), 1), CW_A1 = cwM(CWR.slice(-10), 1), CW_DS = CW_S1 - CW_S0;
var CW_COLD = CWSE.slice().sort(function (a, b) { return a[2] - b[2]; }).slice(0, 4).map(function (r) { return r[0]; }).sort();
var CW_Y0 = CWSE.length ? CWSE[0][0] : 1987, CW_YL = CWSE.length ? CWSE[CWSE.length - 1][0] : 2025;
var SRC_CW = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료, 창원(155) 일평균 기온으로 해마다 여름(6 ~ 8월)·겨울(앞해 12월 ~ 그해 2월) 평균을 냈습니다(" + CW_Y0 + " ~ " + CW_YL + "). 위 서울 자료(격자 값)와 달리 관측소 한 곳의 실제 관측입니다. 사본은 data/cw155.js.</small>";

function chart(H, ctx, W, CH, pts, lo, hi, pick, shade, label) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 600, y0 = 26, y1 = CH - 36;
  function X(y) { return x0 + (y - 1980.5) / 44 * (x1 - x0); }
  function Y(v) { return y1 - (v - lo) / (hi - lo) * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  if (shade) shade.forEach(function (s) { ctx.fillStyle = "rgba(255,190,60,.15)"; ctx.fillRect(X(s[0] - 0.5), y0, X(s[1] + 0.5) - X(s[0] - 0.5), y1 - y0); });
  for (var v = Math.ceil(lo); v <= hi; v += (hi - lo > 6 ? 2 : 1)) H.text(ctx, v + "°", x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") });
  [1985, 1995, 2005, 2015].forEach(function (y) { H.text(ctx, y, X(y), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
  pts.forEach(function (p) { H.box(ctx, X(p[0]) - 5, Y(p[1]), 10, y1 - Y(p[1]), pick === p[0] ? H.v("--amber-700") : H.v("--brand"), pick === p[0] ? 1 : 0.75); });
  H.text(ctx, label, x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
  return { X: X, Y: Y };
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 ‘추세’와 ‘한 번의 예외’를 구별해야 하는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 기온 추세", title: "서울은 얼마나 더워졌나", short: "10년 평균",
    who: "🌡️", name: "기후 자료 분석팀",
    say: "“해마다 기온은 오르락내리락해서 한 해만 보면 추세를 알기 어려워요. 그래서 <b>10년씩 묶어 평균</b>을 냅니다. 서울의 <b>1981~1990년</b> 평균과 <b>2015~2024년</b> 평균을 견주어, <b>몇 °C 올랐는지</b> 구해 주세요.”",
    predict: {
      q: "한 해의 기온이 아니라 10년 평균을 비교하는 까닭은 무엇일까요?",
      options: ["㉠ 계산이 쉬워서", "㉡ 해마다 생기는 우연한 오르내림을 줄이고 추세를 보려고", "㉢ 10년마다만 기온을 재서"],
      answer: 1
    },
    task: "두 기간 평균의 차이를 슬라이더로 맞추세요(± 0.2 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 0;
      function draw() {
        var c = chart(H, ctx, W, cv.H, T.annual, 9, 14, null, [[1981, 1990], [2015, 2024]], "서울의 한 해 평균 기온 (°C) — 세로축은 9 °C부터");
        H.dash(ctx, c.X(1980.5), c.Y(M1), c.X(1990.5), c.Y(M1), H.v("--ink"), 2);
        H.dash(ctx, c.X(2014.5), c.Y(M2), c.X(2024.5), c.Y(M2), H.v("--ink"), 2);
        H.rows(ctx, 640, 40, [["1981~1990 평균", M1.toFixed(2) + " °C"], ["2015~2024 평균", M2.toFixed(2) + " °C"], ["내 답 (오른 정도)", "+" + g.toFixed(1) + " °C", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "오른 기온", min: 0, max: 3, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " °C"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("점선이 두 기간의 평균입니다. " + SRC
        + "<div data-link='{\"id\":\"climate-go\",\"title\":\"기후정보포털\",\"src\":\"기상청\",\"url\":\"https://www.climate.go.kr/\",\"ask\":\"기후정보포털에서 ‘기온’ 그래프(우리 지역 또는 서울의 연평균 기온)를 찾아, 1980년대와 최근 10년의 평균 기온이 대략 얼마나 다른지 그래프에서 읽어 적어 오세요. 이 사례의 값과 비교해 보세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - D) <= 0.2 + 1e-9) return { ok: true, msg: M2.toFixed(2) + " − " + M1.toFixed(2) + " ≈ +" + D.toFixed(2) + " °C — 30여 년 만에 1 °C 넘게 올랐습니다." };
          return { ok: false, msg: "+" + g.toFixed(1) + " °C는 맞지 않습니다. 오른쪽 두 평균의 차이를 구하세요." };
        }
      };
    },
    hints: ["오른쪽 판에 두 평균이 있습니다.", M2.toFixed(2) + " − " + M1.toFixed(2) + " = ?"],
    solution: "약 <b>+" + D.toFixed(1) + " °C</b>.",
    why: "기온은 엘니뇨, 화산 폭발, 그해 날씨 같은 까닭으로 해마다 0.5 °C 넘게 오르내립니다. 이런 ‘잡음’ 속에서 추세를 보려면 여러 해를 묶어 평균을 내야 합니다. 서울은 지구 평균(같은 기간 약 0.7~0.8 °C)보다 빨리 더워졌는데, 육지가 바다보다 빨리 데워지기 때문으로 봅니다(도심 관측소 값에는 도시 열섬 효과가 더해집니다).<br>"
      + "변화를 말할 때는 비교한 기간과 방법을 함께 밝혀야 다른 사람이 같은 결론에 이르는지 확인할 수 있습니다."
  },
  {
    id: "r2", tag: "실제 자료 · 반론 검토", title: "추운 겨울의 반론", short: "가장 추운 1월",
    who: "❄️", name: "토론 동아리",
    say: "“‘이번 겨울이 이렇게 추운데 무슨 온난화냐!’라는 반론이 있어요. 2001년 이후 서울의 <b>1월 평균 기온</b> 가운데 <b>가장 추웠던 해</b>를 찾고, 그해부터 <b>10년 평균 기온</b>이 1981~1990년 평균(" + M1.toFixed(2) + " °C)보다 높은지 낮은지 골라 주세요.”",
    predict: {
      q: "아주 추운 겨울이 한 번 왔다면 온난화가 틀렸다는 증거일까요?",
      options: ["㉠ 그렇다, 한 번이라도 추우면 틀린 것이다", "㉡ 아니다, 한 해의 날씨와 여러 해의 기후 추세는 다르다", "㉢ 추운 겨울은 생길 수 없다"],
      answer: 1
    },
    task: "가장 추운 1월의 해를 고르고, 그해부터 10년 평균을 1980년대와 비교하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, y = 2001, cmp = "none";
      function draw() {
        chart(H, ctx, W, cv.H, JAN, -9, 2, y, [[2001, 2024]], "서울의 1월 평균 기온 (°C) — 막대가 짧을수록 추운 1월");
        H.rows(ctx, 640, 40, [["고른 해", y + "년 1월", "--amber-700"], ["1월 평균", (J[y] != null ? J[y].toFixed(1) : "-") + " °C", null, true], ["그해 한 해 평균", (A[y] != null ? A[y].toFixed(2) : "-") + " °C"]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "연도", min: 2001, max: 2024, step: 1, value: 2001, fmt: function (x) { return x + "년"; }, onInput: function (x) { y = x; api.changed(); draw(); } });
      api.seg({ label: "그해부터 10년 평균은 1981~1990년보다", value: "none", options: [{ v: "hi", t: "높다" }, { v: "lo", t: "낮다" }, { v: "eq", t: "같다" }], onPick: function (x) { cmp = x; api.changed(); } });
      api.info("막대는 −9 °C를 바닥으로 위로 올라갑니다 — 추운 1월일수록 막대가 짧습니다. 오른쪽 숫자로 확인하세요. 연도를 옮기면 오른쪽에 그해 한 해 평균이 나옵니다. 10년치를 더해 10으로 나누세요. " + SRC);
      draw();
      return {
        judge: function () {
          if (y !== COLD) return { ok: false, msg: y + "년 1월은 " + (J[y] != null ? J[y].toFixed(1) : "-") + " °C입니다. 더 추운 1월이 있습니다." };
          var want = DEC > M1 ? "hi" : "lo";
          if (cmp !== want) return { ok: false, msg: "해는 맞았습니다. " + COLD + " ~ " + (COLD + 9) + "년의 한 해 평균 기온을 더해 10으로 나누어 " + M1.toFixed(2) + " °C와 견주세요." };
          return { ok: true, msg: COLD + "년 1월 " + J[COLD].toFixed(1) + " °C — 2001년 이후 가장 추웠고, 그해 한 해 평균(" + A[COLD].toFixed(2) + " °C)도 낮았습니다. 그러나 " + COLD + " ~ " + (COLD + 9) + "년 10년 평균은 " + DEC.toFixed(2) + " °C로 1980년대보다 " + (DEC - M1).toFixed(2) + " °C 높아요." };
        }
      };
    },
    hints: ["막대가 가장 짧은(값이 가장 작은) 해를 찾으세요.", "그해부터 10년 평균 ≈ " + DEC.toFixed(1) + " °C. 1981~1990년 평균은 " + M1.toFixed(2) + " °C."],
    solution: "<b>" + COLD + "년</b>, 그해부터 10년 평균은 1980년대보다 <b>높다</b>.",
    why: "날씨는 하루하루, 한 해 한 해의 대기 상태이고, 기후는 30년쯤의 평균적인 상태입니다. 온난화가 진행되어도 북극의 찬 공기가 내려오는 해에는 몹시 추운 겨울이 올 수 있습니다. 한 해, 한 달의 예외는 추세를 뒤집는 증거가 되지 못하고, 반론을 검토할 때는 같은 기준(여러 해의 평균)으로 비교해야 합니다.<br>"
      + "과학 탐구에서 반론은 소중합니다. 다만 반론도 증거로 시험해야 하며, 이 경우 증거는 ‘추세는 그대로’라는 쪽을 가리킵니다."
  },
  {
    id: "r3", tag: "실제 자료 · 우리 동네 기온", title: "평균이 감춘 것 — 창원의 여름과 겨울", short: "여름과 겨울",
    who: "📍", name: "창원기상대(기상청)",
    say: "“진해와 가까운 <b>창원기상대</b>의 한 해 평균 기온은 처음 10년(" + CW_Y0 + " ~ " + (CW_Y0 + 9) + ") " + CW_A0.toFixed(1) + " °C, 마지막 10년(" + (CW_YL - 9) + " ~ " + CW_YL + ") " + CW_A1.toFixed(1) + " °C로 거의 그대로예요. 그런데 계절로 나눠 보면 이야기가 달라집니다. 빨간 선은 해마다 <b>여름(6 ~ 8월)</b> 평균, 파란 선은 <b>겨울(12 ~ 2월)</b> 평균이에요. 여름 평균은 처음 10년보다 마지막 10년이 몇 °C 달라졌는지 구해 주세요.”",
    predict: {
      q: "한 해 평균이 거의 그대로인 곳에서 여름과 겨울은 어떻게 되었을까요?",
      options: ["㉠ 둘 다 거의 그대로다", "㉡ 여름은 더워지고 겨울은 오히려 조금 추워져서, 평균에서는 서로 지워졌다", "㉢ 겨울만 크게 따뜻해졌다"],
      answer: 1
    },
    task: "오른쪽 두 기간의 여름 평균을 읽고 <b>마지막 10년 − 처음 10년</b>을 슬라이더로 맞추세요(± 0.1 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, dt = 0;
      var x0 = 50, x1 = 640, y0 = 20, y1 = 262;
      function X(y) { return x0 + (y - (CW_Y0 - 1)) / (CW_YL - CW_Y0 + 2) * (x1 - x0); }
      var top = [22, 28], bot = [0, 6];        /* 위: 여름 °C, 아래: 겨울 °C */
      function YS(t) { return y0 + (top[1] - t) / (top[1] - top[0]) * 110; }
      function YW(t) { return y1 - 10 - (t - bot[0]) / (bot[1] - bot[0]) * 100; }
      function draw() {
        H.paper(ctx, W, cv.H); H.axes(ctx, x0, y0, x1, y1);
        [23, 25, 27].forEach(function (t) { H.text(ctx, t + "°", x0 - 8, YS(t) + 4, { s: 10, a: "right", c: H.v("--coral-700") }); H.dash(ctx, x0, YS(t), x1, YS(t), H.v("--line"), 0.5); });
        [1, 3, 5].forEach(function (t) { H.text(ctx, t + "°", x0 - 8, YW(t) + 4, { s: 10, a: "right", c: H.v("--brand") }); H.dash(ctx, x0, YW(t), x1, YW(t), H.v("--line"), 0.5); });
        H.text(ctx, "여름 6 ~ 8월", x0 + 6, y0 + 12, { s: 11, w: "800", c: H.v("--coral-700") });
        H.text(ctx, "겨울 12 ~ 2월", x0 + 6, YW(bot[1]) + 4, { s: 11, w: "800", c: H.v("--brand") });
        H.line(ctx, CWSE.map(function (r) { return [X(r[0]), YS(r[1])]; }), H.v("--coral-700"), 2);
        H.line(ctx, CWSE.map(function (r) { return [X(r[0]), YW(r[2])]; }), H.v("--brand"), 2);
        [[CW_Y0, CW_Y0 + 9], [CW_YL - 9, CW_YL]].forEach(function (p, i) {
          var s = i ? CW_S1 : CW_S0, w = i ? CW_W1 : CW_W0;
          H.line(ctx, [[X(p[0]), YS(s)], [X(p[1]), YS(s)]], H.v("--ink"), 3);
          H.line(ctx, [[X(p[0]), YW(w)], [X(p[1]), YW(w)]], H.v("--ink"), 3);
        });
        [1990, 2000, 2010, 2020].forEach(function (y) { H.text(ctx, y, X(y), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        H.rows(ctx, 680, 34, [["여름 처음 → 마지막 10년", CW_S0.toFixed(2) + " → " + CW_S1.toFixed(2) + " °C", "--coral-700"], ["겨울 처음 → 마지막 10년", CW_W0.toFixed(2) + " → " + CW_W1.toFixed(2) + " °C", "--brand"], ["검은 막대", "10년 평균"], ["내 답 (여름)", (dt >= 0 ? "+" : "") + dt.toFixed(2) + " °C", null, true]], 54);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "여름 평균의 변화", min: -1.5, max: 1.5, step: 0.05, value: 0, fmt: function (x) { return (x >= 0 ? "+" : "") + x.toFixed(2) + " °C"; }, onInput: function (x) { dt = x; api.changed(); draw(); } });
      api.info("나중 값 − 처음 값. 오르면 +, 내리면 − 입니다. 겨울도 같은 방법으로 구해 보세요. " + SRC_CW);
      draw();
      return {
        judge: function () {
          if (Math.abs(dt - CW_DS) <= 0.1) return { ok: true, msg: "여름은 " + (CW_DS >= 0 ? "+" : "") + CW_DS.toFixed(2) + " °C, 겨울은 " + (CW_W1 - CW_W0 >= 0 ? "+" : "") + (CW_W1 - CW_W0).toFixed(2) + " °C — 둘이 서로를 지워 한 해 평균은 " + (CW_A1 - CW_A0 >= 0 ? "+" : "") + (CW_A1 - CW_A0).toFixed(2) + " °C밖에 안 바뀌었습니다." };
          if (Math.abs(dt + CW_DS) <= 0.1) return { ok: false, msg: "부호가 거꾸로입니다. 마지막 10년 값에서 처음 10년 값을 빼세요." };
          return { ok: false, msg: (dt >= 0 ? "+" : "") + dt.toFixed(2) + " °C는 " + (dt < CW_DS ? "작습니다" : "큽니다") + ". 오른쪽 여름 두 값의 차이를 구하세요." };
        }
      };
    },
    hints: ["여름: " + CW_S1.toFixed(2) + " − " + CW_S0.toFixed(2) + " = ?", "같은 방법으로 겨울도: " + CW_W1.toFixed(2) + " − " + CW_W0.toFixed(2)],
    solution: "여름 " + CW_S1.toFixed(2) + " − " + CW_S0.toFixed(2) + " = <b>" + (CW_DS >= 0 ? "+" : "") + CW_DS.toFixed(2) + " °C</b> (겨울은 " + (CW_W1 - CW_W0).toFixed(2) + " °C).",
    why: "평균 하나는 많은 것을 감춥니다. 창원의 여름은 " + CW_DS.toFixed(1) + " °C쯤 더워졌는데(폭염일도 크게 늘었습니다), 겨울은 오히려 " + (CW_W0 - CW_W1).toFixed(1) + " °C쯤 추워져서 한 해 평균에서는 둘이 거의 지워졌습니다. 겨울이 가장 추웠던 해는 " + CW_COLD.join("·") + "년으로, 모두 마지막 15년 안에 있습니다.<br>"
      + "그렇다면 ‘창원은 온난화가 없다’고 말할 수 있을까요? 위의 ‘추운 겨울의 반론’에서 본 것처럼, 추운 겨울 몇 해로 지구 전체의 추세를 뒤집을 수는 없습니다. 관측소 한 곳의 기록은 그 둘레의 땅 이용 변화나 해마다의 날씨에도 크게 흔들립니다. 이런 자료를 볼 때 탐구자는 ① 계절·극단으로 나눠 보고 ② 비교 기간을 바꿔 보고 ③ 다른 관측소와 견주어 보아야 합니다."
  }
  ]
});
})();
