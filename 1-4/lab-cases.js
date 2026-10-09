/* 과학탐구실험1 Ⅰ-4 과학 탐구의 과정과 절차 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

function h(i) { var x = Math.sin(i * 91.7 + 3.3) * 43758.5453; return x - Math.floor(x); }

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 숨은 변인 */
  {
    id: "c1", tag: "자료 분석 · 상관과 원인", title: "아이스크림이 물놀이 사고를 부른다?", short: "숨은 변인",
    who: "🍦", name: "해수욕장 안전 요원",
    say: "“48일 동안 기록을 모아 보니 아이스크림이 많이 팔린 날일수록 물놀이 사고가 많았어요. 누가 ‘아이스크림을 팔지 말자’고 하네요. 정말 아이스크림이 원인일까요? 자료를 여러 기준으로 <b>무리 지어</b> 보고, 두 값을 함께 움직이게 한 <b>숨은 변인</b>을 찾아 주세요.”",
    predict: {
      q: "아이스크림 판매량과 물놀이 사고가 함께 늘어난다면?",
      options: ["㉠ 아이스크림을 먹으면 사고가 난다", "㉡ 두 값을 함께 늘리는 다른 원인이 있을 수 있어, 이것만으로는 원인이라 말할 수 없다", "㉢ 물놀이 사고가 아이스크림을 먹게 만든다"],
      answer: 1
    },
    task: "무리 짓는 기준과 간격을 정해, <b>같은 무리 안에서는 두 값의 관계가 크게 약해지는(|상관 계수| 0.45 미만)</b> 숨은 변인을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var D = [], i;
      for (i = 0; i < 48; i++) { var T = 10 + 24 * h(i); D.push({ T: T, ice: 40 + 8 * (T - 10) + (h(i + 100) - 0.5) * 60, dr: Math.max(0, Math.round(0.5 + 0.25 * (T - 10) + (h(i + 200) - 0.5) * 3.2)), wk: i % 2, sea: h(i + 300) > 0.5 ? 1 : 0 }); }
      var by = "none", bw = 10;
      function r(a) { var n = a.length; if (n < 3) return null; var mx = 0, my = 0; a.forEach(function (d) { mx += d.ice; my += d.dr; }); mx /= n; my /= n; var sxy = 0, sxx = 0, syy = 0; a.forEach(function (d) { sxy += (d.ice - mx) * (d.dr - my); sxx += (d.ice - mx) * (d.ice - mx); syy += (d.dr - my) * (d.dr - my); }); return sxy / Math.sqrt(sxx * syy); }
      function key(d) { return by === "temp" ? Math.floor((d.T - 10) / bw) : (by === "wk" ? d.wk : (by === "sea" ? d.sea : 0)); }
      function within() { var g = {}, s = 0, w = 0; D.forEach(function (d) { var k = key(d); (g[k] = g[k] || []).push(d); }); for (var k in g) { var rr = r(g[k]); if (rr !== null) { s += Math.abs(rr) * g[k].length; w += g[k].length; } } return w ? s / w : 1; }
      var COLS = ["#e4572e", "#f3a712", "#29a36a", "#1f8fbf", "#9b5de5", "#d6589b", "#3a5fb0"];
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 520, y0 = 20, y1 = 260;
        function X(v) { return x0 + (v - 20) / 260 * (x1 - x0); }
        function Y(v) { return y1 - (v + 1) / 9 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        H.text(ctx, "아이스크림 판매량 →", x1, y1 + 20, { s: 11, w: "700", a: "right", c: H.v("--mist") });
        H.text(ctx, "물놀이 사고 수", x0 + 6, y0 + 4, { s: 11, w: "700", c: H.v("--mist") });
        D.forEach(function (d) { H.dot(ctx, X(d.ice), Y(d.dr), 4.5, by === "none" ? H.v("--ink") : COLS[key(d) % COLS.length]); });
        var all = r(D), wi = within(), ok = by === "temp" && wi < 0.45;
        H.rows(ctx, 580, 50, [
          ["전체 상관 계수", all.toFixed(2)],
          ["같은 무리 안의 상관 (평균)", by === "none" ? "-" : wi.toFixed(2), by === "none" ? null : (wi < 0.45 ? "--green-700" : "--rose-700"), true],
          ["무리 기준", by === "none" ? "나누지 않음" : (by === "temp" ? "기온 " + bw + " °C 간격" : (by === "wk" ? "짝수 날 / 홀수 날" : "기록한 요원 A / B"))]
        ], 66);
        return ok;
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "무리 짓는 기준", value: "none", options: [{ v: "none", t: "나누지 않음" }, { v: "wk", t: "짝수 날 / 홀수 날" }, { v: "sea", t: "기록한 요원 A / B" }, { v: "temp", t: "그날의 기온" }], onPick: function (x) { by = x; draw(); } });
      api.slider({ label: "기온으로 나눌 때의 간격", min: 2, max: 12, step: 2, value: 10, fmt: function (x) { return x + " °C"; }, onInput: function (x) { bw = x; draw(); } });
      api.info("상관 계수는 −1~1 사이의 값으로, 1에 가까울수록 두 값이 함께 늘어납니다. 비슷한 날끼리 묶었을 때도 관계가 남는지 보세요.");
      draw();
      return {
        judge: function () {
          var wi = within();
          if (by === "none") return { ok: false, msg: "나누지 않으면 두 값은 강하게 함께 움직입니다(상관 0.85). 비슷한 날끼리 묶어 보세요." };
          if (by !== "temp") return { ok: false, msg: "이 기준으로 묶어도 무리 안의 상관이 " + wi.toFixed(2) + " 로 그대로입니다. 두 값을 함께 늘리는 원인이 아닙니다." };
          if (wi >= 0.45) return { ok: false, msg: "기온 간격 " + bw + " °C는 너무 넓어, 한 무리 안에서도 기온 차이가 큽니다(상관 " + wi.toFixed(2) + "). 더 좁게 나눠 보세요." };
          return { ok: true, msg: "기온이 비슷한 날끼리 묶자 상관이 " + wi.toFixed(2) + " 로 크게 약해졌습니다. 더운 날에 아이스크림도 많이 팔리고 물놀이도 많이 해서 생긴 관계였습니다." };
        }
      };
    },
    hints: [
      "아이스크림도, 물놀이도 많아지는 날은 어떤 날일까요?",
      "‘그날의 기온’으로 묶고, 간격을 8 °C 이하로 좁혀 보세요."
    ],
    solution: "<b>그날의 기온</b>으로 묶고 간격 <b>2~8 °C</b>.",
    why: "두 값이 함께 변한다(상관이 있다)고 해서 한쪽이 다른 쪽의 원인이라고 할 수는 없습니다. 여기서는 <b>기온</b>이라는 숨은 변인이 아이스크림 판매와 물놀이를 함께 늘렸습니다. 숨은 변인을 같게 묶어 보면(통제하면) 관계가 사라집니다.<br>" +
      "자료를 분석할 때는 ‘다른 원인은 없을까?’를 늘 물어야 합니다. 원인을 확인하려면 변인을 통제한 실험이 필요한 까닭입니다. ※ 자료는 원리를 보이기 위해 만든 값입니다."
  },

  /* ------------------------------------------------------------------ 2. 엥겔만의 실험 */
  {
    id: "c2", tag: "프리즘과 실험 설계 · 빛의 색과 광합성", title: "세균이 모인 곳의 빛", short: "빛의 색과 광합성",
    who: "🌿", name: "식물학자 엥겔만 (1882)",
    say: "“뉴턴처럼 프리즘으로 햇빛을 여러 색으로 나눠, 실 모양의 해캄에 비추었어요. 광합성으로 산소가 나오는 곳에는 산소를 좋아하는 세균이 모여들지요. 두 가지 빛을 골라 비추어, <b>광합성이 가장 활발한 두 색</b>(서로 다른 색 영역에서 하나씩)을 찾아 주세요.”",
    predict: {
      q: "잎이 초록색으로 보이는 까닭을 생각하면, 초록빛에서 광합성은 어떨까요?",
      options: ["㉠ 가장 활발하다", "㉡ 가장 약한 편이다 — 잎이 초록빛을 덜 흡수하고 더 많이 반사하기 때문에", "㉢ 모든 색에서 같다"],
      answer: 1
    },
    task: "빛 A와 빛 B의 파장을 골라, <b>산소 발생이 최고치의 70% 이상</b>인 두 색을 <b>서로 다른 색 영역</b>에서 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, la = 540, lb = 560;
      function rate(l) { return 0.1 + 0.9 * Math.exp(-Math.pow((l - 435) / 25, 2)) + 0.75 * Math.exp(-Math.pow((l - 665) / 22, 2)); }
      function band(l) { return l < 500 ? "파랑·보라" : (l < 580 ? "초록·노랑" : "주황·빨강"); }
      function colr(l) { if (l < 450) return "#6a4cff"; if (l < 490) return "#2f7de1"; if (l < 560) return "#2fb34a"; if (l < 590) return "#e2d12a"; if (l < 620) return "#f08a24"; return "#e2372b"; }
      function tube(x, l, name) {
        var rt = rate(l) / 0.965;
        ctx.fillStyle = colr(l); ctx.globalAlpha = 0.25; ctx.fillRect(x - 60, 40, 120, 170); ctx.globalAlpha = 1;
        ctx.strokeStyle = H.v("--ink"); ctx.lineWidth = 2; ctx.strokeRect(x - 60, 40, 120, 170);
        ctx.strokeStyle = "#2f8a3a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 50, 130); ctx.bezierCurveTo(x - 20, 110, x + 20, 150, x + 50, 130); ctx.stroke();
        var n = Math.round(rt * 40);
        for (var i = 0; i < n; i++) H.dot(ctx, x - 45 + (i * 23) % 90, 118 + ((i * 7) % 26), 2, H.v("--ink"));
        H.text(ctx, name + " · " + l + " nm", x, 30, { s: 12, w: "800", a: "center" });
        H.text(ctx, band(l), x, 228, { s: 11, w: "700", a: "center", c: H.v("--mist") });
        H.text(ctx, "산소 " + Math.round(rt * 100) + "%", x, 250, { s: 14, w: "900", a: "center", c: rt >= 0.7 ? H.v("--green-700") : H.v("--ink") });
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        tube(170, la, "빛 A"); tube(410, lb, "빛 B");
        H.text(ctx, "점 = 해캄 둘레에 모인 세균", 520, 60, { s: 11.5, w: "700", c: H.v("--mist") });
        H.text(ctx, "산소 % = 가장 활발한 빛을 100으로 둔 값", 520, 84, { s: 11.5, w: "700", c: H.v("--mist") });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "빛 A의 파장", min: 400, max: 700, step: 20, value: 540, fmt: function (x) { return x + " nm"; }, onInput: function (x) { la = x; draw(); } });
      api.slider({ label: "빛 B의 파장", min: 400, max: 700, step: 20, value: 560, fmt: function (x) { return x + " nm"; }, onInput: function (x) { lb = x; draw(); } });
      api.info("프리즘으로 나눈 빛은 파장이 짧은 쪽(약 400 nm)이 보라, 긴 쪽(약 700 nm)이 빨강입니다.");
      draw();
      return {
        judge: function () {
          var ra = rate(la) / 0.965, rb = rate(lb) / 0.965;
          if (band(la) === band(lb)) return { ok: false, msg: "두 빛이 같은 색 영역(" + band(la) + ")입니다. 서로 다른 색 영역에서 하나씩 찾으세요." };
          if (ra < 0.7 || rb < 0.7) return { ok: false, msg: "산소 발생이 " + Math.round(ra * 100) + "%, " + Math.round(rb * 100) + "% — 70%에 못 미치는 빛이 있습니다." };
          return { ok: true, msg: la + " nm와 " + lb + " nm에서 세균이 가장 많이 모였습니다. 엽록소는 파란빛과 빨간빛을 잘 흡수해 광합성에 씁니다." };
        }
      };
    },
    hints: [
      "초록·노랑 영역에서는 세균이 거의 모이지 않습니다. 양쪽 끝으로 가 보세요.",
      "파랑은 420~440 nm, 빨강은 660 nm 근처입니다."
    ],
    solution: "빛 하나는 <b>420~440 nm</b>(파랑·보라), 다른 하나는 <b>660 nm</b>(빨강).",
    why: "엥겔만은 프리즘으로 나눈 빛을 해캄 한 가닥에 비추고, 산소를 따라 모이는 세균의 분포로 광합성이 활발한 빛을 찾아냈습니다. 세균은 파란빛과 빨간빛이 닿은 곳에 모였고, 초록빛이 닿은 곳에는 거의 없었습니다. 잎이 초록으로 보이는 것은 초록빛을 덜 흡수하고 반사하기 때문입니다.<br>" +
      "뉴턴의 프리즘(물리)과 세균(생물), 광합성(화학)이 만난 이 실험은 분야를 넘나드는 탐구의 좋은 예입니다. ※ 산소 발생 곡선은 광합성 작용 스펙트럼을 단순화한 모형입니다."
  },

  /* ------------------------------------------------------------------ 3. 공동 관측망 */
  {
    id: "c3", tag: "협력적 탐구 · 같은 방법으로 재야 모을 수 있다", title: "다섯 학교 공동 기온 관측", short: "공동 관측",
    who: "🏫", name: "지역 과학 동아리 연합",
    say: "“다섯 학교가 함께 ‘도심이 변두리보다 더운가(열섬)’를 알아보기로 했어요. 도심 학교는 실제로 약 1 °C 더 따뜻합니다. 그런데 학교마다 온도계를 두는 곳과 재는 시각이 제각각이라, 자료를 모아도 1 °C 차이가 드러나지 않아요. <b>공동 관측 규칙</b>을 정해 도심과 변두리의 차이가 뚜렷이 드러나게 해 주세요.”",
    predict: {
      q: "한 학교는 햇볕이 드는 벽에, 다른 학교는 그늘진 곳에 온도계를 두었다면?",
      options: ["㉠ 두 값을 그대로 비교해도 된다", "㉡ 햇볕이 온도계를 데워, 두 학교의 차이가 장소 때문인지 설치 방법 때문인지 가릴 수 없다", "㉢ 온도계의 종류만 같으면 된다"],
      answer: 1
    },
    task: "설치 장소·높이·재는 시각을 정해, <b>설치 방법에서 오는 흔들림(± 오차)이 0.4 °C 이하</b>가 되어 도심과 변두리의 1 °C 차이가 드러나게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W;
      var place = "wall", ht = 0.5, when = "free";
      var NAMES = ["도심 학교", "변두리 가", "변두리 나", "변두리 다", "변두리 라"], TRUE = [26.0, 25.0, 25.0, 25.0, 25.0];
      function bias(i) {
        var b = 0;
        if (place === "wall") b += 0.8 + 2.6 * h(i + 11);
        b += Math.abs(ht - 1.5) * (1.0 + 2.0 * h(i + 21));
        if (when === "free") b += (h(i + 31) - 0.5) * 3.0;
        return b;
      }
      function spread() { var bs = [0, 1, 2, 3, 4].map(bias), m = bs.reduce(function (s, x) { return s + x; }, 0) / 5; return Math.max.apply(null, bs.map(function (x) { return Math.abs(x - m); })); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 70, x1 = 520, y0 = 30, y1 = 240;
        function Y(t) { return y1 - (t - 22) / 8 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [22, 24, 26, 28, 30].forEach(function (t) { H.text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        NAMES.forEach(function (n, i) {
          var x = x0 + 50 + i * 90, m = TRUE[i] + bias(i);
          H.box(ctx, x - 22, Y(m), 44, y1 - Y(m), H.v(i === 0 ? "--coral-700" : "--brand"), 0.7);
          H.text(ctx, m.toFixed(1), x, Y(m) - 6, { s: 11, w: "800", a: "center" });
          H.text(ctx, n, x, y1 + 16, { s: 10.5, a: "center", c: H.v("--mist") });
        });
        var sp = spread(), ok = sp <= 0.4;
        H.rows(ctx, 580, 50, [
          ["설치 방법에서 오는 흔들림", "± " + sp.toFixed(2) + " °C", ok ? "--green-700" : "--rose-700", true],
          ["도심 − 변두리 실제 차이", "1.0 °C"],
          ["판정", ok ? "열섬이 드러난다" : "차이가 설치 방법에 묻힌다", ok ? "--green-700" : "--rose-700"]
        ], 66);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "온도계를 두는 곳", value: "wall", options: [{ v: "wall", t: "학교마다 편한 곳 (햇볕 드는 벽 등)" }, { v: "box", t: "모두 그늘진 백엽상 안" }], onPick: function (x) { place = x; draw(); } });
      api.slider({ label: "땅에서의 높이", min: 0.5, max: 2.5, step: 0.25, value: 0.5, fmt: function (x) { return x.toFixed(2) + " m"; }, onInput: function (x) { ht = x; draw(); } });
      api.seg({ label: "재는 시각", value: "free", options: [{ v: "free", t: "학교마다 쉬는 시간에" }, { v: "same", t: "모두 같은 시각 (오후 2시)" }], onPick: function (x) { when = x; draw(); } });
      api.info("막대는 각 학교가 잰 기온입니다. 실제로는 도심 학교만 1 °C 더 따뜻하고 나머지 네 학교는 같습니다. 기상 관측에서는 땅의 열을 피하려고 온도계를 1.5 m 안팎 높이에 둡니다.");
      draw();
      return {
        judge: function () {
          var sp = spread();
          if (place !== "box") return { ok: false, msg: "햇볕을 받는 정도가 학교마다 달라 흔들림이 ± " + sp.toFixed(1) + " °C입니다. 모두 같은 장소 조건에 두세요." };
          if (when !== "same") return { ok: false, msg: "재는 시각이 다르면 하루 중 기온 변화가 섞입니다(± " + sp.toFixed(1) + " °C)." };
          if (sp > 0.4) return { ok: false, msg: "높이가 표준(1.5 m)과 달라 지면 상태에 따른 영향이 학교마다 달라집니다(± " + sp.toFixed(2) + " °C). 높이를 조정해 보세요." };
          return { ok: true, msg: "모두 백엽상, " + ht.toFixed(2) + " m, 오후 2시 → 흔들림 ± " + sp.toFixed(2) + " °C. 도심 학교가 1 °C 더 따뜻한 것이 뚜렷이 보입니다." };
        }
      };
    },
    hints: [
      "장소와 시각을 모든 학교가 똑같이 맞추는 것부터 하세요.",
      "높이는 기상 관측 표준(1.5 m) 근처로 맞추세요. 표준 높이와 다르면 지면 상태에 따른 영향이 학교마다 달라지니, 모두 표준 높이에 맞추세요."
    ],
    solution: "<b>모두 그늘진 백엽상</b>, 높이 <b>1.5 m 안팎</b>(1.0~2.0 m), <b>모두 같은 시각</b>.",
    why: "여러 모둠이 함께 자료를 모으는 협력적 탐구에서는 먼저 <b>같은 측정 방법(프로토콜)</b>을 정해야 합니다. 방법이 제각각이면 설치 방법의 차이가 진짜 차이(열섬 1 °C)보다 커서 결론을 낼 수 없습니다.<br>" +
      "세계 기상 기구(WMO)가 온도계의 설치 높이와 백엽상 같은 관측 표준을 정해 두는 것도, 전 세계의 관측소 자료를 모아 비교하기 위해서입니다. ※ 값은 수업용으로 단순화했습니다."
  }
  ]
});
})();
