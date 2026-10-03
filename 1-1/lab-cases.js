/* 과학탐구실험1 Ⅰ-1 과학의 본성과 역사 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 독립 재현 */
  {
    id: "c1", tag: "과학의 본성 · 사회적 합의와 재현", title: "‘감기가 하루 만에 낫는 약’을 믿어도 될까", short: "독립 재현",
    who: "💊", name: "의약품 심사 위원",
    say: "“한 연구팀이 ‘새 감기약이 효과가 있다’는 실험 결과를 냈어요. 그런데 약이 사실 효과가 없어도, 실험 한 번이 우연히 ‘효과 있음’으로 나올 확률이 5% 는 됩니다. 연구팀의 장비나 방법에 숨은 실수가 있었을 수도 있고요. 거짓 결론이 끝까지 살아남을 확률을 <b>1% 아래</b>로 낮추도록 재현 실험을 계획해 주세요. 연구비가 한 번에 한 팀분뿐이라 재현 실험은 차례로 해야 하고, 한 번에 6개월이 걸리며, <b>1년 6개월 안에</b> 결론을 내야 합니다.”",
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
      function draw() {
        H.paper(ctx, W, cv.H);
        H.text(ctx, mode === "ind" ? "서로 다른 연구팀이 따로 재현" : "처음 연구팀이 같은 장비로 되풀이", 40, 28, { s: 13.5, w: "900" });
        var cols = ["--coral-700", "--brand", "--teal", "--amber-700", "--green-700", "--rose-700", "--brand-700"];
        H.text(ctx, "🧪", 60, 84, { s: 26, a: "center" });
        H.text(ctx, "처음 실험", 60, 110, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        for (var i = 0; i < k; i++) {
          var x = 130 + i * 58;
          H.dot(ctx, x, 74, 20, H.v(mode === "ind" ? cols[(i + 1) % cols.length] : cols[0]));
          H.text(ctx, "🧑‍🔬", x, 81, { s: 18, a: "center" });
          H.text(ctx, (i + 1) + "차", x, 110, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        }
        var p = survive(), x0 = 60, x1 = 500, y = 170;
        function X(q) { return x0 + (H.log10(Math.max(q, 1e-7)) + 7) / 7 * (x1 - x0); }
        H.axes(ctx, x0, y - 30, x1, y);
        [1e-6, 1e-4, 1e-2, 1].forEach(function (q) { H.text(ctx, q >= 0.01 ? (q * 100) + "%" : (q * 100).toExponential(0).replace("e-", "×10⁻") + "%", X(q), y + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        H.dash(ctx, X(0.01), y - 40, X(0.01), y, H.v("--amber-700"), 2);
        H.text(ctx, "1%", X(0.01), y - 44, { s: 10.5, w: "800", a: "center", c: H.v("--amber-700") });
        H.box(ctx, x0, y - 22, X(p) - x0, 16, H.v(p < 0.01 ? "--green-700" : "--coral-700"), 0.75);
        H.text(ctx, "거짓 결론이 살아남을 확률 (눈금은 10배씩)", x0, y + 40, { s: 11, w: "700", c: H.v("--mist") });
        var ok = p < 0.01 && months() <= 18;
        H.rows(ctx, 600, 60, [
          ["살아남을 확률", (p * 100 < 0.01 ? (p * 100).toExponential(1) : (p * 100).toFixed(2)) + " %", p < 0.01 ? "--green-700" : "--rose-700", true],
          ["걸리는 기간", months() + " 개월", months() <= 18 ? "--green-700" : "--rose-700"],
          ["판정", ok ? "믿을 만함" : "아직 부족", ok ? "--green-700" : "--amber-700"]
        ], 58);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "재현 방식", value: "same", options: [{ v: "same", t: "같은 팀이 되풀이" }, { v: "ind", t: "다른 팀들이 따로" }], onPick: function (x) { mode = x; draw(); } });
      api.slider({ label: "재현 실험 횟수", min: 1, max: 6, step: 1, value: 1, fmt: function (x) { return x + "번"; }, onInput: function (x) { k = x; draw(); } });
      api.info("거짓 결론이 나온 까닭은 반은 우연, 반은 연구팀의 숨은 실수라고 가정합니다. 우연은 되풀이할 때마다 5% 로 걸러지지만, 숨은 실수는 <b>같은 팀이 같은 방법으로 하면 그대로 되풀이</b>됩니다.");
      draw();
      return {
        judge: function () {
          var p = survive();
          if (mode !== "ind") return { ok: false, msg: "같은 팀이 되풀이하면 숨은 실수가 그대로 남아 확률이 50% 아래로 내려가지 않습니다." };
          if (months() > 18) return { ok: false, msg: k + "번이면 " + months() + "개월이 걸려 기한을 넘깁니다. 더 적은 횟수로도 1% 아래가 됩니다." };
          if (p >= 0.01) return { ok: false, msg: "살아남을 확률 " + (p * 100).toFixed(1) + "% — 아직 1% 를 넘습니다." };
          return { ok: true, msg: "다른 팀 " + k + "번 재현 → 거짓 결론이 살아남을 확률 " + (p * 100).toFixed(3) + "%, " + months() + "개월. 독립적인 재현이 과학 지식을 믿을 만하게 만듭니다." };
        }
      };
    },
    hints: [
      "먼저 재현 방식을 바꿔 보세요. 같은 팀이 되풀이하면 숨은 실수가 걸러지지 않습니다.",
      "다른 팀이 따로 하면 살아남을 확률은 0.05 × 0.05 × … 로 줄어듭니다. 1% 아래가 되는 가장 적은 횟수는?"
    ],
    solution: "<b>다른 팀들이 따로</b>, 재현 <b>2 ~ 3번</b>.",
    why: "과학 지식은 한 연구팀의 결과만으로 확정되지 않고, 다른 과학자들이 <b>독립적으로 재현</b>해 확인하는 <b>사회적 합의 과정</b>을 거칩니다. 같은 팀이 되풀이하면 우연은 걸러져도 그 팀만의 실수(장비, 방법, 기대에 따른 해석)는 걸러지지 않아요.<br>" +
      "‘빛보다 빠른 중성미자’도 OPERA 팀이 장비를 다시 점검해 결함을 찾았고, 다른 팀(ICARUS)의 독립 측정이 이를 확인했습니다. 의약품 허가에서 여러 기관의 임상 시험을 요구하는 것도 같은 까닭입니다. ※ 수업용으로 단순화한 모형입니다."
  },

  /* ------------------------------------------------------------------ 2. 연주 시차 */
  {
    id: "c2", tag: "역사 속 과학 탐구 · 예측과 측정의 한계", title: "300년 동안 보이지 않던 증거", short: "연주 시차",
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
        H.paper(ctx, W, cv.H);
        var p = par(), e = PREC[pi], ok = p >= 2 * e;
        H.text(ctx, "연주 시차 — 지구 공전 궤도의 양 끝에서 본 별의 위치 차이", 30, 26, { s: 13, w: "900" });
        var sx = 120, sy = 200, R = 60;
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.ellipse(sx, sy, R, R * 0.4, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        H.dot(ctx, sx, sy, 10, "#ffc93a");
        H.dot(ctx, sx - R, sy, 6, "#3a9bff"); H.dot(ctx, sx + R, sy, 6, "#3a9bff");
        H.text(ctx, "봄", sx - R, sy + 22, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        H.text(ctx, "가을", sx + R, sy + 22, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        var tx = sx, ty = 70;
        H.text(ctx, "★", tx, ty + 5, { s: 18, a: "center", c: H.v("--amber-700") });
        H.text(ctx, STAR[star].n + " (" + STAR[star].ly + " 광년)", tx + 16, ty - 8, { s: 11, w: "800" });
        H.dash(ctx, sx - R, sy, tx, ty, H.v("--brand"), 1.5); H.dash(ctx, sx + R, sy, tx, ty, H.v("--brand"), 1.5);
        H.text(ctx, "(그림은 크게 과장)", 30, 286, { s: 10, c: H.v("--mist") });
        /* 측정 눈금: 0 과 시차값, 오차 막대 */
        var x0 = 320, x1 = 560, y = 170, span = Math.max(1.6, 4 * e);
        function X(a) { return x0 + (a + span / 2) / span * (x1 - x0); }
        H.axes(ctx, x0, y - 60, x1, y);
        H.text(ctx, "잰 시차 (″, 1″ = 1/3600 도)", x0, y - 70, { s: 11, w: "700", c: H.v("--mist") });
        H.dash(ctx, X(0), y - 60, X(0), y, H.v("--mist"), 1.5);
        H.text(ctx, "0 (움직임 없음)", X(0), y + 16, { s: 10, a: "center", c: H.v("--mist") });
        H.box(ctx, X(p - e), y - 36, Math.max(2, X(p + e) - X(p - e)), 12, H.v(ok ? "--green-700" : "--coral-700"), 0.35);
        H.dot(ctx, X(p), y - 30, 5, H.v(ok ? "--green-700" : "--coral-700"));
        H.text(ctx, "± 오차", X(p), y - 44, { s: 10, w: "700", a: "center", c: H.v("--mist") });
        H.rows(ctx, 620, 50, [
          ["실제 연주 시차", p.toFixed(3) + " ″"],
          ["측정 오차", "± " + e + " ″"],
          ["판정", ok ? "시차가 보인다" : "오차에 묻힌다", ok ? "--green-700" : "--rose-700", true]
        ], 60);
        if (WHO[pi]) H.text(ctx, WHO[pi], 620, 250, { s: 11, w: "700", c: H.v("--brand-700") });
        return ok;
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "별", value: "veg", options: [{ v: "cen", t: "알파 센타우리" }, { v: "cyg", t: "백조자리 61번" }, { v: "veg", t: "베가" }], onPick: function (x) { star = x; draw(); } });
      api.slider({ label: "망원경의 측정 오차", min: 0, max: 9, step: 1, value: 0, fmt: function (x) { return "± " + PREC[x] + " ″"; }, onInput: function (x) { pi = x; draw(); } });
      api.info("거리가 1 파섹(3.26 광년)인 별의 연주 시차가 1″ 입니다. 별이 멀수록 시차는 작아져요. 튀코 브라헤의 기구는 약 1′(60″)까지 잴 수 있었습니다.");
      draw();
      return {
        judge: function () {
          var p = par(), e = PREC[pi];
          if (star !== "cyg") return { ok: false, msg: "베셀이 처음 잰 별은 백조자리 61번 별입니다. 그 별로 맞춰 보세요." };
          if (p < 2 * e) return { ok: false, msg: "시차 " + p.toFixed(3) + "″ 가 측정 오차 ± " + e + "″ 에 묻힙니다. 오차의 2배 이상이 되어야 뚜렷하게 보여요." };
          return { ok: true, msg: "오차 ± " + e + "″ 로 시차 " + p.toFixed(3) + "″ 를 잡아냈습니다. 튀코 브라헤의 기구보다 약 " + Math.round(60 / e) + "배 정밀해야 했어요." };
        }
      };
    },
    hints: [
      "백조자리 61번 별의 연주 시차는 약 0.29″ 입니다. 오차가 그 절반보다 작아야 합니다.",
      "오차 ± 0.1″ 이하의 망원경이 필요합니다."
    ],
    solution: "<b>백조자리 61번 별</b>, 측정 오차 <b>± 0.1″ 또는 ± 0.05″</b>.",
    why: "지동설은 연주 시차를 예측했지만, 별이 너무 멀어서 시차가 1″ 도 되지 않았습니다. 튀코 브라헤의 기구보다 수백 배 정밀한 망원경이 나온 1838년에야 베셀이 그 증거를 찾았지요.<br>" +
      "증거가 <b>보이지 않는 것</b>과 증거가 <b>없는 것</b>은 다릅니다. 과학 지식은 측정 기술의 발전과 함께 확인되고 고쳐지며, 새로운 도구가 새로운 증거를 엽니다. ※ 오차 2배 판정은 수업용 기준입니다."
  },

  /* ------------------------------------------------------------------ 3. 일식 관측 설계 */
  {
    id: "c3", tag: "결정적 관측 · 두 이론 가르기", title: "1919년 일식, 뉴턴이냐 아인슈타인이냐", short: "일식 관측",
    who: "🌑", name: "일식 관측대",
    say: "“태양 가까이 지나는 별빛이 태양의 중력 때문에 휘어진다면, 일식 때 태양 옆 별의 위치가 조금 밀려 보입니다. <b>뉴턴 역학</b>으로 계산하면 1.75″ 의 절반인 <b>0.87″</b>, 아인슈타인의 <b>일반 상대성 이론</b>으로는 <b>1.75″</b> 예요. 별 사진 하나하나에는 측정 오차가 있어서, 여러 별을 재어 평균을 내야 합니다. 두 이론 가운데 하나를 확실히 가를 수 있게 관측을 설계해 주세요.”",
    predict: {
      q: "잰 별의 수를 4배로 늘리면, 평균값의 오차는 어떻게 될까요?",
      options: ["㉠ 4배로 커진다", "㉡ 절반으로 줄어든다", "㉢ 4분의 1 로 줄어든다", "㉣ 변하지 않는다"],
      answer: 1
    },
    task: "망원경과 잴 별의 수를 정해, 측정 범위(평균 ± 2 × 오차)가 <b>아인슈타인의 예측은 포함하고 뉴턴의 예측은 벗어나게</b> 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W;
      var tel = "a", N = 2, SIG = { a: 1.6, b: 0.9 }, FIELD = 7, MEAN = 1.75;
      function se() { return SIG[tel] / Math.sqrt(N); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var s = se(), lo = MEAN - 2 * s, hi = MEAN + 2 * s, over = tel === "b" && N > FIELD, ok = lo > 0.87 && !over;
        H.text(ctx, "태양 옆 별빛이 휘어진 각도 — 측정 범위(평균 ± 2 × 평균의 오차)", 30, 26, { s: 13, w: "900" });
        var x0 = 60, x1 = 560, y = 150;
        function X(a) { return x0 + (a + 0.5) / 4 * (x1 - x0); }
        H.axes(ctx, x0, y - 70, x1, y);
        [0, 1, 2, 3].forEach(function (a) { H.text(ctx, a + "″", X(a), y + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        H.dash(ctx, X(0.87), y - 80, X(0.87), y, H.v("--coral-700"), 2);
        H.text(ctx, "뉴턴 0.87″", X(0.87), y - 84, { s: 11, w: "800", a: "center", c: H.v("--coral-700") });
        H.dash(ctx, X(1.75), y - 80, X(1.75), y, H.v("--brand"), 2);
        H.text(ctx, "아인슈타인 1.75″", X(1.75) + 8, y - 84, { s: 11, w: "800", c: H.v("--brand-700") });
        var L = Math.max(x0, X(lo)), R = Math.min(x1, X(hi));
        H.box(ctx, L, y - 44, R - L, 16, H.v(ok ? "--green-700" : "--amber-700"), 0.4);
        H.dot(ctx, X(MEAN), y - 36, 6, H.v(ok ? "--green-700" : "--amber-700"));
        H.text(ctx, "잰 범위 " + lo.toFixed(2) + " ~ " + hi.toFixed(2) + "″", X(MEAN), y - 54, { s: 11, w: "800", a: "center" });
        for (var i = 0; i < N; i++) H.text(ctx, "★", 70 + (i % 20) * 24, 210, { s: 14, c: H.v(tel === "b" && i >= FIELD ? "--line" : "--amber-700") });
        H.text(ctx, "잰 별 " + N + "개" + (over ? " — 큰 망원경의 좁은 시야에는 밝은 별이 " + FIELD + "개뿐" : ""), 70, 244, { s: 11, w: "700", c: H.v(over ? "--rose-700" : "--mist") });
        H.rows(ctx, 620, 56, [
          ["별 하나의 측정 오차", "± " + SIG[tel] + " ″"],
          ["평균의 오차", "± " + s.toFixed(2) + " ″"],
          ["판정", ok ? "두 이론을 가른다" : (over ? "별이 모자란다" : "뉴턴도 범위 안"), ok ? "--green-700" : "--rose-700", true]
        ], 60);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "망원경", value: "a", options: [{ v: "a", t: "넓게 찍는 작은 망원경 (별 하나 ± 1.6″)" }, { v: "b", t: "정밀하지만 시야가 좁은 큰 망원경 (별 하나 ± 0.9″)" }], onPick: function (x) { tel = x; draw(); } });
      api.slider({ label: "잰 별의 수", min: 1, max: 20, step: 1, value: 2, fmt: function (x) { return x + "개"; }, onInput: function (x) { N = x; draw(); } });
      api.info("평균의 오차는 별 하나의 오차 ÷ √(잰 별의 수) 입니다. 큰 망원경은 시야가 좁아 태양 옆 밝은 별을 7개까지만 담을 수 있어요. 모의 관측의 평균은 1.75″ 로 두었습니다.");
      draw();
      return {
        judge: function () {
          var s = se(), lo = MEAN - 2 * s;
          if (tel === "b" && N > FIELD) return { ok: false, msg: "큰 망원경의 좁은 시야에는 태양 옆 밝은 별이 " + FIELD + "개뿐이라 " + N + "개를 잴 수 없습니다." };
          if (lo <= 0.87) return { ok: false, msg: "측정 범위가 " + lo.toFixed(2) + "″ 까지 내려가 뉴턴의 예측 0.87″ 도 들어갑니다. 이 관측으로는 두 이론을 가를 수 없어요." };
          return { ok: true, msg: "평균의 오차 ± " + s.toFixed(2) + "″ → 범위 " + lo.toFixed(2) + " ~ " + (MEAN + 2 * s).toFixed(2) + "″. 뉴턴의 예측을 벗어나 두 이론을 가르는 결정적 관측이 됩니다." };
        }
      };
    },
    hints: [
      "범위의 아래쪽 끝(1.75 − 2 × 평균의 오차)이 0.87 보다 커야 합니다. 평균의 오차가 0.44″ 보다 작아야 해요.",
      "작은 망원경(± 1.6″)이면 별 14개 이상, 큰 망원경(± 0.9″)이면 5개 이상이 필요합니다. 큰 망원경은 7개가 한계예요."
    ],
    solution: "작은 망원경이면 별 <b>14 ~ 20개</b>, 큰 망원경이면 별 <b>5 ~ 7개</b>.",
    why: "결정적 관측은 두 이론이 <b>서로 다른 값을 예측</b>하고, 측정의 정밀도가 그 차이를 가를 만큼 충분할 때 성립합니다. 한 번의 측정은 오차가 커도 여러 번 재어 평균을 내면 오차가 √N 분의 1 로 줄어들어요.<br>" +
      "1919년 에딩턴의 관측대는 일식 사진으로 아인슈타인의 예측에 가까운 값을 얻었고, 이 결과는 뉴턴 역학에서 일반 상대성 이론으로 넘어가는 계기가 되었습니다. 다만 당시 자료의 오차가 커서 논란이 이어졌고, 뒤에 더 정밀한 전파 관측이 결론을 굳혔습니다. ※ 오차 값은 수업용으로 단순화했습니다."
  }
  ]
});
})();
