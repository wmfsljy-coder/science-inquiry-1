/* 과학탐구실험1 Ⅱ 과학 탐구의 과정과 절차 — 실제 자료
   r1 서울은 얼마나 더워졌나 — 1981 ~ 1990년과 2015 ~ 2024년의 한 해 평균 기온
   r2 추운 겨울의 반론 — 가장 추운 1월이 온난화를 뒤집을까
   자료: data/seoul-temp.js (NASA POWER) */
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
var SRC = "<small>출처: 미국 항공우주국(NASA) POWER 자료 서비스 — 서울(북위 37.57°, 동경 126.98°) 지상 2 m 기온의 해 평균·달 평균, 1981 ~ 2024. 위성·관측을 합친 약 50 km 격자 평균이라 도심의 서울 관측소 값보다 1 ~ 2 °C 낮게 나옵니다. 변화의 크기를 보는 데 쓰세요. 사본은 data/seoul-temp.js.</small>";

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
    say: "“해마다 기온은 오르락내리락해서 한 해만 보면 추세를 알기 어려워요. 그래서 <b>10년씩 묶어 평균</b>을 냅니다. 서울의 <b>1981 ~ 1990년</b> 평균과 <b>2015 ~ 2024년</b> 평균을 견주어, <b>몇 °C 올랐는지</b> 구해 주세요.”",
    predict: {
      q: "한 해의 기온이 아니라 10년 평균을 비교하는 까닭은 무엇일까요?",
      options: ["㉠ 계산이 쉬워서", "㉡ 해마다 생기는 우연한 오르내림을 줄이고 추세를 보려고", "㉢ 10년마다만 기온을 재서"],
      answer: 1
    },
    task: "두 기간 평균의 차이를 슬라이더로 맞추세요(± 0.2 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 0;
      function draw() {
        var c = chart(H, ctx, W, cv.H, T.annual, 9, 14, null, [[1981, 1990], [2015, 2024]], "서울의 한 해 평균 기온 (°C) — 세로축은 9 °C 부터");
        H.dash(ctx, c.X(1980.5), c.Y(M1), c.X(1990.5), c.Y(M1), H.v("--ink"), 2);
        H.dash(ctx, c.X(2014.5), c.Y(M2), c.X(2024.5), c.Y(M2), H.v("--ink"), 2);
        H.rows(ctx, 640, 40, [["1981 ~ 1990 평균", M1.toFixed(2) + " °C"], ["2015 ~ 2024 평균", M2.toFixed(2) + " °C"], ["내 답 (오른 정도)", "+" + g.toFixed(1) + " °C", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "오른 기온", min: 0, max: 3, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " °C"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("점선이 두 기간의 평균입니다. " + SRC
        + "<div data-link='{\"id\":\"climate-go\",\"title\":\"기후정보포털\",\"src\":\"기상청\",\"url\":\"https://www.climate.go.kr/\",\"ask\":\"기후정보포털에서 우리 지역(또는 서울)의 기온 변화 자료를 찾아, 1980년대와 최근 10년의 평균 기온이 얼마나 다른지 적어 오세요. 이 사례의 값과 비교해 보세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - D) <= 0.2 + 1e-9) return { ok: true, msg: M2.toFixed(2) + " − " + M1.toFixed(2) + " ≈ +" + D.toFixed(2) + " °C — 30여 년 만에 1 °C 넘게 올랐습니다." };
          return { ok: false, msg: "+" + g.toFixed(1) + " °C 는 맞지 않습니다. 오른쪽 두 평균의 차이를 구하세요." };
        }
      };
    },
    hints: ["오른쪽 판에 두 평균이 있습니다.", M2.toFixed(2) + " − " + M1.toFixed(2) + " = ?"],
    solution: "약 <b>+" + D.toFixed(1) + " °C</b>.",
    why: "기온은 엘니뇨, 화산 폭발, 그해 날씨 같은 까닭으로 해마다 0.5 °C 넘게 오르내립니다. 이런 ‘잡음’ 속에서 추세를 보려면 여러 해를 묶어 평균을 내야 해요. 서울은 지구 평균(같은 기간 약 0.7 ~ 0.8 °C)보다 빨리 더워졌는데, 육지가 바다보다 빨리 데워지기 때문으로 봅니다(도심 관측소 값에는 도시 열섬 효과가 더해집니다).<br>"
      + "변화를 말할 때는 비교한 기간과 방법을 함께 밝혀야 다른 사람이 같은 결론에 이르는지 확인할 수 있습니다."
  },
  {
    id: "r2", tag: "실제 자료 · 반론 검토", title: "추운 겨울의 반론", short: "가장 추운 1월",
    who: "❄️", name: "토론 동아리",
    say: "“‘이번 겨울이 이렇게 추운데 무슨 온난화냐!’라는 반론이 있어요. 2001년 이후 서울의 <b>1월 평균 기온</b> 가운데 <b>가장 추웠던 해</b>를 찾고, 그해부터 <b>10년 평균 기온</b>이 1981 ~ 1990년 평균(" + M1.toFixed(2) + " °C)보다 높은지 낮은지 골라 주세요.”",
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
      api.seg({ label: "그해부터 10년 평균은 1981 ~ 1990년보다", value: "none", options: [{ v: "hi", t: "높다" }, { v: "lo", t: "낮다" }, { v: "eq", t: "같다" }], onPick: function (x) { cmp = x; api.changed(); } });
      api.info("막대는 −9 °C 를 바닥으로 위로 올라갑니다 — 추운 1월일수록 막대가 짧아요. 오른쪽 숫자로 확인하세요. 연도를 옮기면 오른쪽에 그해 한 해 평균이 나옵니다. 10년치를 더해 10 으로 나누세요. " + SRC);
      draw();
      return {
        judge: function () {
          if (y !== COLD) return { ok: false, msg: y + "년 1월은 " + (J[y] != null ? J[y].toFixed(1) : "-") + " °C 입니다. 더 추운 1월이 있어요." };
          var want = DEC > M1 ? "hi" : "lo";
          if (cmp !== want) return { ok: false, msg: "해는 맞았습니다. " + COLD + " ~ " + (COLD + 9) + "년의 한 해 평균 기온을 더해 10 으로 나누어 " + M1.toFixed(2) + " °C 와 견주세요." };
          return { ok: true, msg: COLD + "년 1월 " + J[COLD].toFixed(1) + " °C — 2001년 이후 가장 추웠고, 그해 한 해 평균(" + A[COLD].toFixed(2) + " °C)도 낮았습니다. 그러나 " + COLD + " ~ " + (COLD + 9) + "년 10년 평균은 " + DEC.toFixed(2) + " °C 로 1980년대보다 " + (DEC - M1).toFixed(2) + " °C 높아요." };
        }
      };
    },
    hints: ["막대가 가장 짧은(값이 가장 작은) 해를 찾으세요.", "그해부터 10년 평균 ≈ " + DEC.toFixed(1) + " °C. 1981 ~ 1990년 평균은 " + M1.toFixed(2) + " °C."],
    solution: "<b>" + COLD + "년</b>, 그해부터 10년 평균은 1980년대보다 <b>높다</b>.",
    why: "날씨는 하루하루, 한 해 한 해의 대기 상태이고, 기후는 30년쯤의 평균적인 상태입니다. 온난화가 진행되어도 북극의 찬 공기가 내려오는 해에는 몹시 추운 겨울이 올 수 있어요. 한 해, 한 달의 예외는 추세를 뒤집는 증거가 되지 못하고, 반론을 검토할 때는 같은 기준(여러 해의 평균)으로 비교해야 합니다.<br>"
      + "과학 탐구에서 반론은 소중합니다. 다만 반론도 증거로 시험해야 하며, 이 경우 증거는 ‘추세는 그대로’라는 쪽을 가리킵니다."
  }
  ]
});
})();
