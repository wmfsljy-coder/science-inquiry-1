/* 과학탐구실험1 Ⅰ-2 과학 탐구의 과정과 절차 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";
/* ---- 스튜디오 + 입체 미니어처 도구 (_tools/STUDIO_GUIDE.md) ---- */
var K = window.sthKit, LT = K.LT;
/* 오른쪽 흰 판정 카드: 카드를 깔고 그 위에 엔진의 H.rows(이름 · 굵은 값)를 쓴다 */
function card(H, ctx, x, y, w, h, title, rows, gap) {
  K.card(ctx, x, y, w, h, title || "판정");
  var yy = y + 56;
  (rows || []).forEach(function (r) {      /* r = [이름, 값, 색 토큰, 큰 글씨] — 이름 아래에 굵은 값 */
    H.text(ctx, r[0], x + 18, yy, { s: 12, w: "800", c: LT.mute });
    var sz = r[3] ? 20 : 15, mw = w - 36; ctx.font = "900 " + sz + "px " + H.FONT; while (ctx.measureText(String(r[1])).width > mw && sz > 11) { sz -= 0.5; ctx.font = "900 " + sz + "px " + H.FONT; }
    H.text(ctx, r[1], x + 18, yy + (r[3] ? 26 : 22), { s: sz, w: "900", c: r[2] ? H.v(r[2]) : LT.ink });
    yy += gap || 56;
  });
}
function bar3(c, x, top, w, bottom, col, dx, dy) {
  dx = dx == null ? 8 : dx; dy = dy == null ? 5 : dy;
  if (bottom - top < 0.5) top = bottom - 0.5;
  c.fillStyle = K.tint(col, 0.62); c.beginPath(); c.moveTo(x + w, top); c.lineTo(x + w + dx, top - dy); c.lineTo(x + w + dx, bottom - dy); c.lineTo(x + w, bottom); c.closePath(); c.fill();
  c.fillStyle = K.tint(col, 1.25); c.beginPath(); c.moveTo(x, top); c.lineTo(x + dx, top - dy); c.lineTo(x + w + dx, top - dy); c.lineTo(x + w, top); c.closePath(); c.fill();
  var g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, K.tint(col, 1.08)); g.addColorStop(1, K.tint(col, 0.88));
  c.fillStyle = g; c.fillRect(x, top, w, bottom - top);
}
function tile3(c, x, y, w, h, col) {
  c.fillStyle = "rgba(20,30,50,.16)"; c.beginPath(); c.roundRect(x + 3, y + 5, w, h, 5); c.fill();
  c.fillStyle = K.tint(col, 0.6); c.beginPath(); c.roundRect(x + 3, y - 3, w, h, 5); c.fill();
  var g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, K.tint(col, 1.15)); g.addColorStop(1, K.tint(col, 0.88));
  c.fillStyle = g; c.beginPath(); c.roundRect(x, y, w, h, 5); c.fill();
}
/* 토분과 모종: (x, y) 화분 바닥 가운데, h 모종 키(px) */
function pot(c, x, y, s, h, tag) {
  c.fillStyle = "rgba(20,30,50,.2)"; c.beginPath(); c.ellipse(x + 3, y + 1, 9 * s, 3 * s, 0, 0, 6.2832); c.fill();
  var g = c.createLinearGradient(x - 8 * s, 0, x + 8 * s, 0); g.addColorStop(0, "#a0522d"); g.addColorStop(.45, "#e08a5a"); g.addColorStop(1, "#8a4422");
  c.fillStyle = g; c.beginPath(); c.moveTo(x - 8 * s, y - 14 * s); c.lineTo(x - 6 * s, y); c.lineTo(x + 6 * s, y); c.lineTo(x + 8 * s, y - 14 * s); c.closePath(); c.fill();
  c.fillStyle = "#5a3a20"; c.beginPath(); c.ellipse(x, y - 14 * s, 8 * s, 2.6 * s, 0, 0, 6.2832); c.fill();
  c.strokeStyle = "#2f7d32"; c.lineWidth = 1.6 * s; c.beginPath(); c.moveTo(x, y - 14 * s); c.lineTo(x, y - 14 * s - h); c.stroke();
  for (var k = 0; k < 3; k++) {
    var ly = y - 14 * s - h * (0.35 + k * 0.3), sd = k % 2 ? 1 : -1;
    c.fillStyle = k === 2 ? "#5cb85c" : "#3f9a42"; c.beginPath(); c.ellipse(x + sd * 4.5 * s, ly, 5 * s, 2.2 * s, sd * 0.5, 0, 6.2832); c.fill();
  }
  if (tag) { c.fillStyle = "#ffd43b"; c.fillRect(x + 4 * s, y - 12 * s, 5 * s, 6 * s); }
}

function isPrime(x) { if (x < 2) return false; for (var d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; }
function factor(x) { for (var d = 2; d * d <= x; d++) if (x % d === 0) return d + " × " + (x / d); return ""; }

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 비료 실험 설계 */
  {
    id: "c1", about: "02", tag: "연역적 탐구 · 변인 통제와 반복", title: "새 비료, 정말 효과가 있을까", short: "비료 실험",
    who: "🍅", name: "학교 텃밭 동아리",
    say: "“새 비료를 주면 토마토 모종이 더 잘 자란다는 가설을 시험하려고요. 모종은 같은 품종이라도 한 그루마다 키가 ± 3 cm 쯤 들쭉날쭉해요. 화분 수, 비교 모둠, 화분 위치를 정해서 <b>비료의 효과만</b> 뚜렷하게 드러나는 실험을 설계해 주세요.”",
    predict: {
      q: "비료를 준 화분만 창가에 두고, 비료를 주지 않은 화분은 복도에 두었다면 결과를 어떻게 해석해야 할까요?",
      options: ["㉠ 비료 모둠이 더 크면 비료의 효과다", "㉡ 빛이라는 다른 변인이 섞여, 차이가 비료 때문인지 빛 때문인지 가릴 수 없다", "㉢ 위치는 결과에 영향을 주지 않는다"],
      answer: 1
    },
    task: "비교 모둠·화분 위치·화분 수를 정해 <b>비료만 다르고</b>, 차이의 범위(± 2 × 오차)의 <b>아래 끝이 0보다 크게</b>(범위에 0이 들어가지 않게) 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W;
      var ctrl = "no", place = "split", n = 2, EFFECT = 4, SUN = 3;
      function se() { return 3 * Math.sqrt(2 / n); }
      function diff() { return EFFECT + (place === "split" ? SUN : 0); }
      /* 학교 텃밭 선반을 잘라 낸 블록: 왼쪽 절반 = 창가(햇빛), 오른쪽 절반 = 복도 */
      var I = K.iso({ ox: 250, oy: 112, s: 0.82, L: 340, D: 150 });
      function shelf() {
        I.box(ctx, 0, 0, -14, I.L, I.D, 0, "#d9b47c", "#a8834f", "#8a6a3c");
        I.plane(ctx, 0.2, "rgba(255,226,140,.45)", null, 0, 170, 0, I.D);
        I.plane(ctx, 0.2, "rgba(120,130,150,.18)", null, 170, I.L, 0, I.D);
        I.box(ctx, 0, 0, 0, I.L, 5, 96, "#ece6da", "#f6f1e8", "#d8d0c2");
        var w0 = I.P(30, 5.5, 24), w1 = I.P(140, 5.5, 24), w2 = I.P(140, 5.5, 84), w3 = I.P(30, 5.5, 84);
        I.quad(ctx, w0, w1, w2, w3, "#9fd3f5", "#7a5a3a");
        var m0 = I.P(85, 5.5, 24), m1 = I.P(85, 5.5, 84); ctx.strokeStyle = "#7a5a3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.lineTo(m1.x, m1.y); ctx.stroke();
        var sp = I.P(120, 5.5, 74); K.glow(ctx, sp.x, sp.y, 5, "rgba(255,236,150,.98)", 3.6);
        var d0 = I.P(220, 5.5, 0), d1 = I.P(275, 5.5, 0), d2 = I.P(275, 5.5, 78), d3 = I.P(220, 5.5, 78);
        I.quad(ctx, d0, d1, d2, d3, "#b98a52", "#6e4626");
        I.edges(ctx, 0, 0);
      }
      function row(y, cnt, inWin, fert, tall) {
        var x0 = inWin ? 14 : 184, sp = Math.min(17, 152 / Math.max(1, cnt));
        for (var i = 0; i < cnt; i++) { var p = I.P(x0 + i * sp + 6, y, 0); pot(ctx, p.x, p.y, 1.05, tall, fert); }
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        shelf();
        var fWin = true, cWin = place === "same";
        if (ctrl === "yes") row(52, n, cWin, false, 14 + (cWin ? SUN : 0) * 3);
        row(118, n, fWin, true, 14 + (EFFECT + SUN) * 3);
        var lb = [0, 600];
        I.label(ctx, 60, 5, 90, "🪟 창가 (햇빛 많음)", -10, -16, "#ffd35a", lb);
        I.label(ctx, 250, 5, 82, "🚪 복도", 20, -14, "#e8ecff", lb);
        I.label(ctx, 10 + n * 8, 118, 30, "비료 O " + n + "개 (노란 표)", -40, 74, "#9ff0b5", lb);
        if (ctrl === "yes") I.label(ctx, (cWin ? 14 : 184) + n * 8, 52, 30, "비료 X " + n + "개", 70, -60, "#e8ecff", lb);
        K.warn(ctx, 16, cv.H - 12, "⚠ 화분 크기·모종 키는 보기 쉽게 과장");
        var ok = false;
        if (ctrl === "yes") {
          var d = diff(), e = 2 * se();
          ok = place === "same" && d - e > 0;
          card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [
            ["키 차이 (비료 O − 비료 X)", d.toFixed(1) + " cm"],
            ["차이의 범위", (d - e).toFixed(1) + " ~ " + (d + e).toFixed(1) + " cm", d - e > 0 ? "--green-700" : "--rose-700"],
            ["판정", ok ? "비료의 효과가 드러난다" : (place === "split" ? "빛이 섞였다" : "오차에 묻힌다"), ok ? "--green-700" : "--rose-700", true]
          ], 70);
        } else {
          card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [["비교할 대상", "없음", "--rose-700", true], ["알 수 있는 것", "비료를 준 모종의 키뿐"]], 76);
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
    id: "c2", about: "01", tag: "귀납적 탐구 · 반례 하나의 힘", title: "마흔 번 맞은 규칙", short: "소수 규칙",
    who: "🔢", name: "수학 동아리",
    say: "“n에 0, 1, 2, 3 … 을 넣어 <b>n² + n + 41</b>을 계산해 보면 41, 43, 47, 53, 61 … 모두 소수(1보다 큰 자연수 가운데 1과 자기 자신으로만 나누어떨어지는 수)예요! 오일러가 소개한 식이지요. 계속 넣어 봐도 소수만 나오니 ‘이 식은 언제나 소수’라고 해도 될까요? n을 늘려 가며 <b>처음으로 규칙이 깨지는 n</b>을 찾아 주세요.”",
    predict: {
      q: "처음 몇십 개의 값이 모두 소수였다면, 그다음 값도 소수라고 확신할 수 있을까요?",
      options: ["㉠ 40번이나 맞았으니 확신할 수 있다", "㉡ 확신할 수 없다 — 아직 확인하지 않은 경우에서 반례가 나올 수 있다", "㉢ 짝수 번째라서 반드시 소수가 아니다"],
      answer: 1
    },
    task: "n을 바꿔 가며 <b>n² + n + 41이 처음으로 소수가 아닌 n</b>을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, n = 0;
      function f(k) { return k * k + k + 41; }
      function first() { for (var k = 0; k < 100; k++) if (!isPrime(f(k))) return k; return -1; }
      function draw() {
        H.paper(ctx, W, cv.H);
        /* 나무판 위에 n = 0~60 숫자 블록을 늘어놓는다(확인한 것만 색이 들어간다) */
        ctx.fillStyle = "rgba(20,30,50,.16)"; ctx.beginPath(); ctx.ellipse(300, 150, 300, 12, 0, 0, 6.2832); ctx.fill();
        bar3(ctx, 14, 52, 572, 140, "#c99a62", 8, 6);
        for (var k = 0; k <= 60; k++) {
          var x = 22 + (k % 31) * 18, y = 64 + Math.floor(k / 31) * 36;
          var col = k > n ? "#ced4da" : (isPrime(f(k)) ? "#12b886" : "#e03131");
          tile3(ctx, x, y, 14, 24, col);
          K.t(ctx, String(k), x + 7, y + 16, { s: 9, w: "800", a: "center", c: k > n ? "#868e96" : "#fff" });
        }
        var val = f(n), p = isPrime(val), cnt = 0; for (var j = 0; j <= n; j++) if (isPrime(f(j))) cnt++;
        K.bigText(ctx, "n = " + n + " → " + val, 18, 40, 22, p ? "#7cf0b5" : "#ff9aac");
        H.text(ctx, "초록 블록 = 소수 · 빨간 블록 = 소수 아님 · 회색 = 아직 확인 안 함", 18, 186, { s: 11.5, w: "700", c: H.v("--mist") });
        H.text(ctx, n + "² + " + n + " + 41 = " + val, 18, 222, { s: 16, w: "900" });
        H.text(ctx, p ? "소수" : "소수가 아님 : " + factor(val), 18, 252, { s: 15, w: "900", c: p ? H.v("--green-700") : H.v("--rose-700") });
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [
          ["확인한 값", (n + 1) + "개"], ["그 가운데 소수", cnt + "개", cnt === n + 1 ? "--green-700" : "--rose-700"],
          ["지금까지", cnt === n + 1 ? "모두 소수" : "반례가 나왔다", cnt === n + 1 ? "--green-700" : "--rose-700", true]
        ], 62);
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
    id: "c3", about: "02", tag: "변인 통제 · 믿음과 기대도 변인이다", title: "달리기가 빨라지는 음료?", short: "눈가림 실험",
    who: "🥤", name: "체육 교사",
    say: "“‘마시면 100 m 기록이 좋아지는 음료’라는 광고를 시험해 보려고요. 그런데 학생들은 ‘좋은 걸 마셨다’고 믿기만 해도 더 힘을 내고, 기록을 재는 사람이 누가 마셨는지 알면 무심코 초시계를 다르게 누를 수 있어요. 기록은 한 사람마다 ± 2.5% 쯤 들쭉날쭉합니다. <b>음료 자체의 효과만</b> 잴 수 있는 실험을 설계해 주세요.”",
    predict: {
      q: "비교 모둠에게 아무것도 주지 않는 것보다, 맛과 색이 같은 가짜 음료를 주는 것이 나은 까닭은?",
      options: ["㉠ 가짜 음료가 더 싸기 때문에", "㉡ 두 모둠 모두 ‘무언가 마셨다’고 믿게 해, 믿음이라는 변인을 같게 만들기 때문에", "㉢ 차이가 없다"],
      answer: 1
    },
    task: "비교 모둠의 음료·기록 재는 사람·인원을 정해 <b>믿음과 기대를 통제</b>하고, 효과의 범위(± 2 × 오차)가 <b>± 2% 안</b>에 들게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(320), ctx = cv.ctx, W = cv.W;
      var ctrl = "none", rec = "coach", n = 4, TRUE = 0, PLACEBO = 3, BIAS = 2;
      function se() { return 2.5 * Math.sqrt(2 / n); }
      function meas() { return TRUE + (ctrl === "none" ? PLACEBO : 0) + (rec === "coach" ? BIAS : 0); }
      /* 운동장 출발선 앞 탁자 블록: 뒷줄 = 음료 모둠 컵, 앞줄 = 비교 모둠 컵(가짜 음료면 같은 색), 오른쪽 끝 = 기록 재는 사람 */
      var I = K.iso({ ox: 150, oy: 70, s: 0.66, L: 330, D: 110 });
      function cup(x, y, z, col) {
        var p = I.P(x, y, z);
        ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(p.x + 2, p.y + 1, 5, 2, 0, 0, 6.2832); ctx.fill();
        var g = ctx.createLinearGradient(p.x - 4, 0, p.x + 4, 0); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(190,205,225,.9)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(p.x - 4.5, p.y - 13); ctx.lineTo(p.x - 3.5, p.y); ctx.lineTo(p.x + 3.5, p.y); ctx.lineTo(p.x + 4.5, p.y - 13); ctx.closePath(); ctx.fill();
        if (col) { ctx.fillStyle = col; ctx.fillRect(p.x - 3.6, p.y - 9, 7.2, 8.5); ctx.fillStyle = K.tint(col, 1.2); ctx.beginPath(); ctx.ellipse(p.x, p.y - 9, 3.8, 1.2, 0, 0, 6.2832); ctx.fill(); }
        ctx.strokeStyle = "rgba(90,110,140,.6)"; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(p.x, p.y - 13, 4.5, 1.4, 0, 0, 6.2832); ctx.stroke();
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        var m = meas(), e = 2 * se(), i;
        I.box(ctx, 0, 0, -10, I.L, I.D, 0, "#e8ecf2", "#c9ced6", "#9aa3b0");
        I.plane(ctx, 0.2, "#2f9e44", null, 0, I.L, 92, 96);
        var sp = Math.min(13, 250 / n);
        for (i = 0; i < n; i++) cup(16 + i * sp, 26, 0, "#f08c00");
        for (i = 0; i < n; i++) cup(16 + i * sp, 66, 0, ctrl === "none" ? null : "#f08c00");
        I.person(ctx, 300, 50, 0, rec === "coach" ? "#e8590c" : "#495057", 2.2);
        var hp = I.P(300, 50, 0);
        if (rec === "blind") { ctx.fillStyle = "#212529"; ctx.fillRect(hp.x - 6, hp.y - 30, 12, 3.5); }
        K.planet(ctx, hp.x + 9, hp.y - 18, 4.5, "#e9ecef", "#495057");
        var lb = [0, 600];
        I.label(ctx, 16 + (n - 1) * sp / 2, 26, 14, "음료 모둠 " + n + "명", -30, -14, "#ffd8a8", lb);
        I.label(ctx, 16 + (n - 1) * sp / 2, 66, 14, (ctrl === "none" ? "비교 모둠 · 빈 컵(안 마심)" : "비교 모둠 · 가짜 음료"), -40, 50, "#e8ecff", lb);
        I.label(ctx, 300, 50, 30, rec === "coach" ? "⏱ 누가 마셨는지 아는 코치" : "⏱ 모르는 기록원(눈가림)", 20, -18, rec === "coach" ? "#ffb0bc" : "#9ff0b5", lb);
        /* 아래: 잰 효과와 범위(밝은 수직선) */
        var x0 = 50, x1 = 560, y = 278;
        function X(p) { return x0 + (p + 6) / 16 * (x1 - x0); }
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x0 - 10, y - 50, x1 - x0 + 20, 62);
        ctx.strokeStyle = LT.line; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        [-6, -4, -2, 0, 2, 4, 6, 8, 10].forEach(function (p) { ctx.beginPath(); ctx.moveTo(X(p), y); ctx.lineTo(X(p), y + 5); ctx.stroke(); H.text(ctx, (p > 0 ? "+" : "") + p + "%", X(p), y + 18, { s: 10, a: "center", w: "700", c: H.v("--mist") }); });
        H.dash(ctx, X(0), y - 52, X(0), y, H.v("--mist"), 1.5);
        var L = Math.max(x0, X(m - e)), R = Math.min(x1, X(m + e));
        bar3(ctx, L, y - 30, R - L, y - 18, e <= 2 ? "#12b886" : "#4dabf7", 5, 4);
        K.planet(ctx, X(m), y - 24, 6, "#ffd36b", "#a8781f");
        H.text(ctx, "잰 효과 " + (m > 0 ? "+" : "") + m.toFixed(1) + "%", X(m), y - 38, { s: 11.5, w: "900", a: "center" });
        H.text(ctx, "잰 효과 = 음료 모둠 기록 향상 − 비교 모둠 기록 향상", 18, 20, { s: 12, w: "900", c: H.v("--mist") });
        var parts = [];
        if (ctrl === "none") parts.push("믿음 +3%");
        if (rec === "coach") parts.push("기대 +2%");
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [
          ["섞인 변인", parts.length ? parts.join(", ") : "없음", parts.length ? "--rose-700" : "--green-700"],
          ["효과의 범위", (m - e).toFixed(1) + " ~ " + (m + e).toFixed(1) + "%"],
          ["범위의 폭", "± " + e.toFixed(1) + "%", e <= 2 ? "--green-700" : "--amber-700", true]
        ], 66);
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
