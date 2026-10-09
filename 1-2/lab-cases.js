/* 과학탐구실험1 Ⅰ-2 과학 탐구의 과정과 절차 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

function isPrime(x) { if (x < 2) return false; for (var d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; }
function factor(x) { for (var d = 2; d * d <= x; d++) if (x % d === 0) return d + " × " + (x / d); return ""; }

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 비료 실험 설계 */
  {
    id: "c1", tag: "연역적 탐구 · 변인 통제와 반복", title: "새 비료, 정말 효과가 있을까", short: "비료 실험",
    who: "🍅", name: "학교 텃밭 동아리",
    say: "“새 비료를 주면 토마토 모종이 더 잘 자란다는 가설을 시험하려고요. 모종은 같은 품종이라도 한 그루마다 키가 ± 3 cm 쯤 들쭉날쭉해요. 화분 수, 비교 모둠, 화분 위치를 정해서 <b>비료의 효과만</b> 뚜렷하게 드러나는 실험을 설계해 주세요.”",
    predict: {
      q: "비료를 준 화분만 창가에 두고, 비료를 주지 않은 화분은 복도에 두었다면 결과를 어떻게 해석해야 할까요?",
      options: ["㉠ 비료 모둠이 더 크면 비료의 효과다", "㉡ 빛이라는 다른 변인이 섞여, 차이가 비료 때문인지 빛 때문인지 가릴 수 없다", "㉢ 위치는 결과에 영향을 주지 않는다"],
      answer: 1
    },
    task: "비교 모둠·화분 위치·화분 수를 정해 <b>비료만 다르고</b>, 차이의 범위(± 2 × 오차)의 <b>아래 끝이 0보다 크게</b>(범위에 0이 들어가지 않게) 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W;
      var ctrl = "no", place = "split", n = 2, EFFECT = 4, SUN = 3;
      function se() { return 3 * Math.sqrt(2 / n); }
      function diff() { return EFFECT + (place === "split" ? SUN : 0); }
      function draw() {
        H.paper(ctx, W, cv.H);
        H.text(ctx, "🪟 창가", 40, 28, { s: 12, w: "800", c: H.v("--amber-700") });
        H.text(ctx, "🚪 복도", 40, 158, { s: 12, w: "800", c: H.v("--mist") });
        H.box(ctx, 30, 36, 520, 100, H.v("--amber-700"), 0.08);
        var i, fy = 118, cy = ctrl === "no" ? -1 : (place === "same" ? 118 : 248);
        for (i = 0; i < n; i++) H.text(ctx, "🌱", 60 + i * 26, fy - (ctrl === "yes" && place === "same" ? 30 : 0), { s: 20 });
        H.text(ctx, "비료 O " + n + "개", 330, fy - (ctrl === "yes" && place === "same" ? 30 : 0) - 4, { s: 11.5, w: "800", c: H.v("--green-700") });
        if (ctrl === "yes") {
          for (i = 0; i < n; i++) H.text(ctx, "🌱", 60 + i * 26, cy, { s: 20 });
          H.text(ctx, "비료 X " + n + "개", 330, cy - 4, { s: 11.5, w: "800", c: H.v("--mist") });
        }
        var ok = false;
        if (ctrl === "yes") {
          var d = diff(), e = 2 * se();
          ok = place === "same" && d - e > 0;
          H.rows(ctx, 610, 46, [
            ["키 차이 (비료 O − 비료 X)", d.toFixed(1) + " cm"],
            ["차이의 범위", (d - e).toFixed(1) + " ~ " + (d + e).toFixed(1) + " cm", d - e > 0 ? "--green-700" : "--rose-700"],
            ["판정", ok ? "비료의 효과가 드러난다" : (place === "split" ? "빛이 섞였다" : "오차에 묻힌다"), ok ? "--green-700" : "--rose-700", true]
          ], 64);
        } else {
          H.rows(ctx, 610, 60, [["비교할 대상", "없음", "--rose-700", true], ["알 수 있는 것", "비료를 준 모종의 키뿐"]], 70);
        }
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "비교 모둠", value: "no", options: [{ v: "no", t: "모두 비료를 준다" }, { v: "yes", t: "비료를 주지 않은 모둠도 둔다" }], onPick: function (x) { ctrl = x; draw(); } });
      api.seg({ label: "화분 위치", value: "split", options: [{ v: "split", t: "비료 모둠만 창가" }, { v: "same", t: "두 모둠 모두 창가" }], onPick: function (x) { place = x; draw(); } });
      api.slider({ label: "모둠마다 화분 수", min: 1, max: 10, step: 1, value: 2, fmt: function (x) { return x + "개"; }, onInput: function (x) { n = x; draw(); } });
      api.info("모둠마다 화분이 많을수록 평균 키의 오차가 줄어듭니다(오차 ∝ 1/√화분 수). 창가는 복도보다 빛이 많아요.");
      draw();
      return {
        judge: function () {
          if (ctrl !== "yes") return { ok: false, msg: "비료를 주지 않은 비교 모둠(대조군)이 없으면, 모종이 원래 그만큼 자라는지 비료 덕분인지 알 수 없습니다." };
          if (place !== "same") return { ok: false, msg: "비료 모둠만 창가에 두면 빛이라는 변인이 섞입니다. 비료 말고는 모두 같게 하세요." };
          var d = diff(), e = 2 * se();
          if (d - e <= 0) return { ok: false, msg: "차이 " + d + " cm가 들쭉날쭉한 오차(± " + e.toFixed(1) + " cm)에 묻힙니다. 화분 수를 늘려 되풀이하세요." };
          return { ok: true, msg: "비료만 다르게, 화분 " + n + "개씩 → 차이 " + (d - e).toFixed(1) + " ~ " + (d + e).toFixed(1) + " cm. 비료의 효과가 뚜렷합니다." };
        }
      };
    },
    hints: [
      "먼저 비료를 주지 않은 비교 모둠을 두고, 두 모둠을 같은 곳에 놓으세요.",
      "오차의 2배(6 × √(2/화분 수))가 4 cm보다 작아야 합니다. 화분이 5개 이상이면 됩니다."
    ],
    solution: "<b>비료를 주지 않은 모둠도 둔다</b>, <b>두 모둠 모두 창가</b>, 모둠마다 화분 <b>5개 이상</b>.",
    why: "가설을 시험하려면 <b>조작 변인(비료)</b>만 다르게 하고 빛·물·흙·품종 같은 <b>통제 변인</b>은 같게 해야 합니다. 비교 모둠(대조군)이 있어야 ‘원래 자라는 만큼’과 비교할 수 있고, 여러 개를 되풀이해 재야 개체 사이의 들쭉날쭉함(오차)보다 큰 차이인지 가릴 수 있습니다.<br>" +
      "비료 모둠만 창가에 두면 차이가 7 cm로 더 커 보이지만, 그중 3 cm는 빛 때문입니다. 섞인 변인은 효과를 부풀리기도, 감추기도 합니다. ※ 수업용으로 단순화한 값입니다."
  },

  /* ------------------------------------------------------------------ 2. 귀납의 함정 */
  {
    id: "c2", tag: "귀납적 탐구 · 반례 하나의 힘", title: "마흔 번 맞은 규칙", short: "소수 규칙",
    who: "🔢", name: "수학 동아리",
    say: "“n에 0, 1, 2, 3 … 을 넣어 <b>n² + n + 41</b>을 계산해 보면 41, 43, 47, 53, 61 … 모두 소수(1보다 큰 자연수 가운데 1과 자기 자신으로만 나누어떨어지는 수)예요! 오일러가 소개한 식이지요. 계속 넣어 봐도 소수만 나오니 ‘이 식은 언제나 소수’라고 해도 될까요? n을 늘려 가며 <b>처음으로 규칙이 깨지는 n</b>을 찾아 주세요.”",
    predict: {
      q: "처음 몇십 개의 값이 모두 소수였다면, 그다음 값도 소수라고 확신할 수 있을까요?",
      options: ["㉠ 40번이나 맞았으니 확신할 수 있다", "㉡ 확신할 수 없다 — 아직 확인하지 않은 경우에서 반례가 나올 수 있다", "㉢ 짝수 번째라서 반드시 소수가 아니다"],
      answer: 1
    },
    task: "n을 바꿔 가며 <b>n² + n + 41이 처음으로 소수가 아닌 n</b>을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, n = 0;
      function f(k) { return k * k + k + 41; }
      function first() { for (var k = 0; k < 100; k++) if (!isPrime(f(k))) return k; return -1; }
      function draw() {
        H.paper(ctx, W, cv.H);
        H.text(ctx, "n = 0부터 확인한 값 (초록 = 소수, 빨강 = 소수 아님)", 30, 26, { s: 12.5, w: "900" });
        for (var k = 0; k <= 60; k++) {
          var x = 30 + (k % 31) * 27, y = 44 + Math.floor(k / 31) * 40;
          var col = k > n ? "--line" : (isPrime(f(k)) ? "--green-700" : "--rose-700");
          H.box(ctx, x, y, 23, 28, H.v(col), k > n ? 0.25 : 0.75);
          H.text(ctx, k, x + 11.5, y + 18, { s: 10, w: "800", a: "center", c: k > n ? H.v("--mist") : "#fff" });
        }
        var val = f(n), p = isPrime(val);
        H.text(ctx, "n = " + n + " → " + n + "² + " + n + " + 41 = " + val, 30, 160, { s: 16, w: "900" });
        H.text(ctx, p ? "소수" : "소수가 아님 : " + factor(val), 30, 190, { s: 15, w: "900", c: p ? H.v("--green-700") : H.v("--rose-700") });
        var cnt = 0; for (var j = 0; j <= n; j++) if (isPrime(f(j))) cnt++;
        H.text(ctx, "지금까지 " + (n + 1) + "개 중 소수 " + cnt + "개", 30, 222, { s: 12, w: "700", c: H.v("--mist") });
        return n === first();
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "n", min: 0, max: 60, step: 1, value: 0, fmt: function (x) { return String(x); }, onInput: function (x) { n = x; draw(); } });
      api.info("슬라이더를 오른쪽으로 옮길수록 확인한 값이 늘어납니다. 소수가 아니면 어떤 두 수의 곱인지도 보여 줍니다.");
      draw();
      return {
        judge: function () {
          var fk = first();
          if (n < fk) return { ok: false, msg: "n = " + n + " 까지는 모두 소수입니다. 더 큰 n을 확인해 보세요." };
          if (n > fk) return { ok: false, msg: "n = " + n + " 보다 앞에서 이미 규칙이 깨졌습니다. 처음으로 깨지는 n을 찾으세요." };
          return { ok: true, msg: "n = 40 → 1681 = 41 × 41. 40번 맞은 규칙이 41번째에서 깨졌습니다. 반례 하나로 ‘언제나’는 무너집니다." };
        }
      };
    },
    hints: [
      "n = 30을 넘어서도 계속 소수가 나옵니다. 끝까지 확인해 보세요.",
      "n = 40을 넣으면 40² + 40 + 41 = 40 × 41 + 41 = 41 × 41이 됩니다."
    ],
    solution: "<b>n = 40</b> (40² + 40 + 41 = 1681 = 41 × 41).",
    why: "귀납적 탐구는 많은 사례에서 규칙을 이끌어 내지만, 사례를 아무리 많이 모아도 <b>확인하지 않은 경우</b>까지 보장하지는 못합니다. 40개의 맞는 사례보다 반례 하나가 더 힘이 셉니다.<br>" +
      "그래서 수학에서는 귀납으로 찾은 규칙을 증명으로 확인하고, 과학에서는 귀납으로 얻은 규칙을 새 관찰로 계속 시험하며 ‘잠정적인 지식’으로 다룹니다. 귀뚜라미 규칙이 추운 밤에 깨진 것과 같은 이치입니다."
  },

  /* ------------------------------------------------------------------ 3. 가짜 약과 눈가림 */
  {
    id: "c3", tag: "변인 통제 · 믿음과 기대도 변인이다", title: "달리기가 빨라지는 음료?", short: "눈가림 실험",
    who: "🥤", name: "체육 교사",
    say: "“‘마시면 100 m 기록이 좋아지는 음료’라는 광고를 시험해 보려고요. 그런데 학생들은 ‘좋은 걸 마셨다’고 믿기만 해도 더 힘을 내고, 기록을 재는 사람이 누가 마셨는지 알면 무심코 초시계를 다르게 누를 수 있어요. 기록은 한 사람마다 ± 2.5% 쯤 들쭉날쭉합니다. <b>음료 자체의 효과만</b> 잴 수 있는 실험을 설계해 주세요.”",
    predict: {
      q: "비교 모둠에게 아무것도 주지 않는 것보다, 맛과 색이 같은 가짜 음료를 주는 것이 나은 까닭은?",
      options: ["㉠ 가짜 음료가 더 싸기 때문에", "㉡ 두 모둠 모두 ‘무언가 마셨다’고 믿게 해, 믿음이라는 변인을 같게 만들기 때문에", "㉢ 차이가 없다"],
      answer: 1
    },
    task: "비교 모둠의 음료·기록 재는 사람·인원을 정해 <b>믿음과 기대를 통제</b>하고, 효과의 범위(± 2 × 오차)가 <b>± 2% 안</b>에 들게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W;
      var ctrl = "none", rec = "coach", n = 4, TRUE = 0, PLACEBO = 3, BIAS = 2;
      function se() { return 2.5 * Math.sqrt(2 / n); }
      function meas() { return TRUE + (ctrl === "none" ? PLACEBO : 0) + (rec === "coach" ? BIAS : 0); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var m = meas(), e = 2 * se(), x0 = 60, x1 = 540, y = 150;
        function X(p) { return x0 + (p + 6) / 16 * (x1 - x0); }
        H.text(ctx, "잰 효과 = 음료 모둠 기록 향상 − 비교 모둠 기록 향상", 30, 26, { s: 13, w: "900" });
        H.text(ctx, "🥤 × " + n + "명", 60, 64, { s: 14, w: "800", c: H.v("--brand-700") });
        H.text(ctx, (ctrl === "none" ? "🚫" : "🥤") + " × " + n + "명 (" + (ctrl === "none" ? "안 마심" : "가짜 음료") + ")", 220, 64, { s: 14, w: "800", c: H.v("--mist") });
        H.text(ctx, rec === "coach" ? "⏱️ 음료를 아는 코치" : "⏱️ 모르는 기록원", 450, 64, { s: 13, w: "800" });
        H.axes(ctx, x0, y - 50, x1, y);
        [-6, -4, -2, 0, 2, 4, 6, 8, 10].forEach(function (p) { H.text(ctx, (p > 0 ? "+" : "") + p + "%", X(p), y + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        H.dash(ctx, X(0), y - 60, X(0), y, H.v("--mist"), 1.5);
        var L = Math.max(x0, X(m - e)), R = Math.min(x1, X(m + e));
        H.box(ctx, L, y - 34, R - L, 14, H.v("--brand"), 0.35);
        H.dot(ctx, X(m), y - 27, 6, H.v("--brand"));
        H.text(ctx, "잰 효과 " + (m > 0 ? "+" : "") + m.toFixed(1) + "%", X(m), y - 42, { s: 11.5, w: "800", a: "center" });
        var parts = [];
        if (ctrl === "none") parts.push("믿음 +3%");
        if (rec === "coach") parts.push("기록원의 기대 +2%");
        H.rows(ctx, 610, 50, [
          ["섞인 변인", parts.length ? parts.join(", ") : "없음", parts.length ? "--rose-700" : "--green-700"],
          ["효과의 범위", (m - e).toFixed(1) + " ~ " + (m + e).toFixed(1) + "%"],
          ["범위의 폭", "± " + e.toFixed(1) + "%", e <= 2 ? "--green-700" : "--amber-700", true]
        ], 62);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "비교 모둠", value: "none", options: [{ v: "none", t: "아무것도 마시지 않음" }, { v: "fake", t: "맛·색이 같은 가짜 음료" }], onPick: function (x) { ctrl = x; draw(); } });
      api.seg({ label: "기록 재는 사람", value: "coach", options: [{ v: "coach", t: "누가 마셨는지 아는 코치" }, { v: "blind", t: "모르는 기록원" }], onPick: function (x) { rec = x; draw(); } });
      api.slider({ label: "모둠마다 인원", min: 2, max: 20, step: 2, value: 4, fmt: function (x) { return x + "명"; }, onInput: function (x) { n = x; draw(); } });
      api.info("‘좋은 걸 마셨다’는 믿음만으로 기록이 약 3% 좋아지고(위약 효과), 아는 사람이 재면 약 2% 좋게 기록됩니다. 인원이 많을수록 들쭉날쭉함이 줍니다.");
      draw();
      return {
        judge: function () {
          if (ctrl !== "fake") return { ok: false, msg: "비교 모둠이 아무것도 마시지 않으면 ‘마셨다는 믿음’의 효과(약 3%)가 음료 효과처럼 섞입니다." };
          if (rec !== "blind") return { ok: false, msg: "누가 마셨는지 아는 코치가 재면 기대가 기록에 섞입니다(약 2%)." };
          var e = 2 * se();
          if (e > 2) return { ok: false, msg: "섞인 변인은 없지만 범위가 ± " + e.toFixed(1) + "%로 너무 넓습니다. 인원을 늘리세요." };
          return { ok: true, msg: "이중 눈가림, 모둠마다 " + n + "명 → 잰 효과 0.0 ± " + e.toFixed(1) + "%. 음료 자체의 효과는 거의 없었습니다. 광고의 ‘효과’는 믿음과 기대였습니다." };
        }
      };
    },
    hints: [
      "믿음과 기대도 결과에 영향을 주는 변인입니다. 두 가지를 모두 같게(모르게) 만드세요.",
      "범위의 폭은 5 × √(2/인원)입니다. 2% 이하가 되려면 모둠마다 14명 이상이 필요합니다."
    ],
    solution: "<b>가짜 음료</b>, <b>모르는 기록원</b>, 모둠마다 <b>14명 이상</b>.",
    why: "사람을 대상으로 한 실험에서는 ‘효과가 있을 것’이라는 참가자의 <b>믿음</b>(위약 효과)과 재는 사람의 <b>기대</b>도 결과를 바꾸는 변인입니다. 가짜 약(위약)을 주고, 참가자도 기록원도 누가 무엇을 받았는지 모르게 하는 <b>이중 눈가림</b>으로 이 변인들을 통제합니다.<br>" +
      "눈가림 없이 재면 음료가 기록을 5%나 좋게 한 것처럼 보이지만, 모두 통제하니 효과는 0 이었습니다. 신약의 임상 시험이 이 방법을 쓰는 까닭입니다. ※ 수업용으로 단순화한 값입니다."
  }
  ]
});
})();
