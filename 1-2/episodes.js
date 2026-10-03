/* 과학탐구실험1 Ⅰ-2 과학 탐구의 과정과 절차 — 이야기 세 편
   01 귀뚜라미 온도계 / 02 손을 씻으시오 / 03 장미 도표
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt1-1-2");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function dot(ctx, x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function seg(ctx, x1, y1, x2, y2, c, w, dash) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function A(hex, a) {
  hex = String(hex || "#888").trim();
  if (hex.charAt(0) !== "#") return hex;
  if (hex.length === 4) hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return "rgba(" + parseInt(hex.substr(1, 2), 16) + "," + parseInt(hex.substr(3, 2), 16) + "," + parseInt(hex.substr(5, 2), 16) + "," + a + ")";
}
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}
function orderDone(mount, steps) {
  $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>";
}

/* =========================================================================
   이야기 ① 귀뚜라미 온도계
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "탐구 기록 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "induct1", title: "부원의 첫 판단",
    question: "귀뚜라미가 우는 빠르기와 기온 사이에 규칙이 있는지 알아보려면 무엇부터 해야 할까요?",
    options: ["㉠ 두 밤을 보았으니 충분하다. 바로 규칙을 정한다", "㉡ 여러 밤 동안 기온과 우는 빠르기를 재어, 공통된 규칙이 나타나는지 본다", "㉢ 귀뚜라미 한 마리를 잡아 해부해 본다", "㉣ 인터넷에 올라온 의견 가운데 가장 인기 있는 것을 따른다"],
    onPick: function (i) { window.sthState("induct1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  var N = [11, 13, 15, 17, 19, 20, 22, 24, 12, 16, 18, 21];
  var E = [-0.5, 0.6, -0.4, 0.9, -0.6, 0.3, -0.9, 0.5, 0.4, -0.3, 0.4, -0.5];
  var T = N.map(function (n, i) { return n + 5 + E[i]; });

  /* 장면 2 — 열두 밤의 기록 */
  (function () {
    var canvas = $("a-c-cr"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 2, b = 0;
    var got = window.sthState("crGot") || { a: false, q: false };
    function err(k, bb) { var s = 0; for (var i = 0; i < k; i++) s += Math.abs(T[i] - (N[i] + bb)); return s / k; }
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 540, y0 = 26, y1 = 250;
      function X(c) { return x0 + c / 30 * (x1 - x0); }
      function Y(t) { return y1 - t / 35 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 10, 20, 30].forEach(function (c) { text(ctx, c + "번", X(c), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      [0, 10, 20, 30].forEach(function (t) { text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "8초 동안 우는 횟수", x1, y1 + 34, { s: 11, w: "700", a: "right", c: v("--mist") });
      text(ctx, "기온", x0 + 6, y0 - 8, { s: 11, w: "700", c: v("--mist") });
      seg(ctx, X(0), Y(b), X(30), Y(30 + b > 35 ? 35 : 30 + b), v("--brand"), 3);
      for (var i = 0; i < n; i++) {
        seg(ctx, X(N[i]), Y(T[i]), X(N[i]), Y(N[i] + b), A(v("--coral-700"), 0.5), 1.2, true);
        dot(ctx, X(N[i]), Y(T[i]), 6, v("--teal"));
      }
      var e = err(n, b), ok = n >= 8 && b === 5;
      text(ctx, "관찰한 밤 " + n + "밤", 600, 60, { s: 15, w: "900" });
      text(ctx, "규칙: 우는 횟수 + " + b + " = 기온", 600, 92, { s: 13, w: "800", c: v("--brand-700") });
      text(ctx, "평균 어긋남 " + e.toFixed(2) + " °C", 600, 122, { s: 13, w: "800", c: ok ? v("--green-700") : v("--ink") });
      text(ctx, n < 8 ? "자료가 아직 적어요" : "자료가 충분합니다", 600, 156, { s: 11.5, w: "700", c: n < 8 ? v("--amber-700") : v("--green-700") });
      return ok;
    }
    function update() {
      var ok = draw(), e = err(n, b);
      put("a-cr-info", n + "밤의 자료에서 규칙 ‘우는 횟수 + " + b + " = 기온’의 평균 어긋남은 " + e.toFixed(2) + " °C 입니다. "
        + (ok ? "✅ 8밤 이상의 자료에 고르게 잘 맞습니다. 여러 관찰에서 공통된 규칙을 이끌어 냈어요." : (n < 8 ? "관찰한 밤이 적으면 우연히 잘 맞는 규칙이 여러 개 나올 수 있습니다. 밤의 수를 늘려 보세요." : "점들과 직선이 가장 가까워지는 □ 를 찾아보세요.")));
      if (ok && !got.a) { got.a = true; window.sthState("crGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("crBest", "8밤 이상 자료 → 우는 횟수 + 5 ≈ 기온");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("crBest") + ". 개별 관찰을 모아 일반적인 규칙을 이끌어 내는 것이 귀납적 탐구입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-n").addEventListener("input", function (ev) { n = +ev.target.value; $("a-n-val").textContent = n + "밤"; update(); });
    $("a-b").addEventListener("input", function (ev) { b = +ev.target.value; $("a-b-val").textContent = "□ = " + b; update(); });
    window.sthPick({
      mount: "a-cr-pick",
      q: "첫째 밤 하나만 보면 ‘우는 횟수 + 4.5 = 기온’이 딱 맞습니다. 그런데도 여러 밤을 관찰해야 하는 까닭은?",
      options: ["한 번의 관찰에는 우연한 오차가 섞여 있어, 여러 번 관찰해야 공통된 규칙인지 믿을 수 있기 때문에", "관찰을 많이 하면 규칙이 저절로 바뀌기 때문에", "한 밤의 관찰은 과학적이지 않은 방법이기 때문에"],
      answer: 0,
      why: ["한 번 딱 맞은 것이 우연인지 규칙인지는 관찰을 늘려야 가릴 수 있습니다. 귀납적 탐구에서는 관찰의 수와 다양성이 결론의 믿음직함을 정합니다.", "규칙은 바뀌지 않습니다. 우리가 규칙을 더 정확히 알게 될 뿐이에요.", "한 번의 관찰도 과학적인 자료입니다. 다만 그것만으로 일반화하기에는 부족하지요."],
      onDone: function () { got.q = true; window.sthState("crGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 규칙이 통하지 않는 밤 */
  (function () {
    var canvas = $("a-c-lim"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, t = 24;
    var got = window.sthState("limGot") || { a: false, q: false };
    function chirp(tt) { return tt < 13 ? 0 : Math.round(tt - 5); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y = 120;
      function X(tt) { return x0 + (tt - 0) / 36 * (x1 - x0); }
      text(ctx, "기온 눈금", x0, 40, { s: 11.5, w: "700", c: v("--mist") });
      ctx.fillStyle = A(v("--teal"), 0.2); ctx.fillRect(X(15.5), y - 26, X(29.5) - X(15.5), 52);
      text(ctx, "관찰한 범위 15.5 ~ 29.5 °C", (X(15.5) + X(29.5)) / 2, y - 34, { s: 11, w: "800", a: "center", c: v("--teal-700") });
      seg(ctx, x0, y, x1, y, v("--line"), 2);
      [0, 10, 20, 30].forEach(function (tt) { seg(ctx, X(tt), y - 5, X(tt), y + 5, v("--line"), 1.5); text(ctx, tt + "°C", X(tt), y + 20, { s: 10, a: "center", c: v("--mist") }); });
      var c = chirp(t), pred = c + 5, bad = t < 13;
      dot(ctx, X(t), y, 8, v("--ink"));
      text(ctx, "실제 " + t + "°C", X(t), y + 44, { s: 11.5, w: "800", a: "center" });
      if (!bad) dot(ctx, X(pred), y, 7, v("--brand"));
      if (!bad) text(ctx, "규칙이 맞힌 " + pred + "°C", X(pred), y - 50 < 20 ? 20 : y + 64, { s: 11.5, w: "800", a: "center", c: bad ? v("--coral-700") : v("--brand-700") });
      text(ctx, "🦗", 640, 90, { s: 34, a: "center" });
      text(ctx, c > 0 ? "8초에 " + c + "번 운다" : "울지 않는다", 700, 84, { s: 15, w: "900", c: c > 0 ? v("--ink") : v("--coral-700") });
      text(ctx, "규칙: " + c + " + 5 = " + pred + " °C", 700, 112, { s: 13, w: "800", c: v("--brand-700") });
      text(ctx, bad ? "울지 않아 규칙을 쓸 수 없음" : "어긋남 " + Math.abs(t - pred) + " °C", 700, 140, { s: 13, w: "800", c: bad ? v("--coral-700") : v("--green-700") });
      return bad;
    }
    function update() {
      var bad = draw(), c = chirp(t);
      put("a-lim-info", "실제 기온 " + t + " °C 인 밤, 귀뚜라미는 " + (c > 0 ? "8초에 " + c + "번 울고 규칙은 " + (c + 5) + " °C 라고 알려 줍니다." : "<b>울지 않습니다</b>. 규칙은 늘 5 °C 라고 알려 줄 뿐이에요.")
        + (bad ? " ✅ 규칙이 통하지 않는 밤입니다. 귀뚜라미는 약 13 °C 아래에서는 울지 않아요. 관찰하지 않은 범위였지요." : (t < 15.5 || t > 29.5 ? " 관찰한 범위 밖이지만 아직은 맞습니다. 더 추운 밤은 어떨까요?" : " 관찰한 범위 안에서는 잘 맞습니다.")));
      if (bad && !got.a) { got.a = true; window.sthState("limGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("limBest", "13 °C 아래에서는 울지 않아 규칙이 통하지 않는다");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("limBest") + ". 귀납으로 얻은 규칙은 관찰한 범위 안에서 믿을 만하고, 새로운 관찰이 나오면 고쳐집니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("a-t").addEventListener("input", function (ev) { t = +ev.target.value; $("a-t-val").textContent = t + " °C"; update(); });
    window.sthPick({
      mount: "a-lim-pick",
      q: "귀납적 탐구로 얻은 규칙에 대한 설명으로 가장 알맞은 것은?",
      options: ["관찰을 12번이나 했으니 어떤 상황에서도 반드시 맞는다", "관찰한 범위 안에서는 믿을 만하지만, 새로운 관찰이 나오면 틀릴 수 있어 고쳐질 수 있다", "한 번이라도 틀리면 쓸모없는 규칙이므로 버려야 한다"],
      answer: 1,
      why: ["아무리 많이 관찰해도 관찰하지 않은 경우까지 보장하지는 못합니다. 흰 백조만 보던 유럽 사람들은 호주에서 검은 백조를 만났지요.", "귀납의 결론은 확률적이고 잠정적입니다. 규칙에 ‘13 °C 이상에서’라는 조건을 붙여 고치면 됩니다.", "틀린 경우를 알게 되면 규칙이 통하는 조건을 더 정확히 적어 고칩니다. 버리는 것이 아니에요."],
      onDone: function () { got.q = true; window.sthState("limGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 귀납 / 연역 분류 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "ind", label: "🔍 귀납", sub: "여러 관찰 → 일반 규칙" }, { id: "ded", label: "📐 연역", sub: "일반 규칙·가설 → 구체적 예측" }],
    items: [
      { t: "열두 밤 관찰해 보니 기온이 높을수록 귀뚜라미가 빨리 울었다. 그러니 우는 빠르기는 기온에 따라 달라진다", a: "ind", why: "개별 관찰에서 규칙을 이끌어 냈습니다." },
      { t: "까마귀 100마리를 관찰했더니 모두 검었다. 그러므로 까마귀는 검다", a: "ind", why: "관찰한 사례들을 일반화했습니다." },
      { t: "구리, 철, 알루미늄을 가열해 보니 모두 늘어났다. 금속은 가열하면 팽창한다", a: "ind", why: "여러 사례에서 공통점을 찾았습니다." },
      { t: "케플러는 튀코 브라헤가 수십 년 동안 모은 화성 관측 자료에서 행성이 타원 궤도를 돈다는 규칙을 찾았다", a: "ind", why: "많은 관찰 자료에서 규칙을 발견했습니다.", hint: "규칙이 먼저인가요, 관찰이 먼저인가요?" },
      { t: "‘우는 횟수 + 5 = 기온’이므로, 8초에 20번 울면 기온은 약 25 °C 일 것이다", a: "ded", why: "이미 아는 규칙을 새 상황에 적용했습니다." },
      { t: "금속은 가열하면 팽창하므로, 이 철로도 여름에 늘어날 것이다. 그래서 이음새에 틈을 둔다", a: "ded", why: "일반 법칙에서 구체적인 결론을 이끌어 냈습니다." },
      { t: "만유인력 법칙으로 천왕성의 궤도를 계산해, 보이지 않는 행성(해왕성)의 위치를 예측했다", a: "ded", why: "이론에서 예측을 이끌어 내고 관측으로 확인했습니다." },
      { t: "‘손에 묻은 시체 입자가 원인’이라면, 손을 씻을 때 사망률이 줄어들 것이다", a: "ded", why: "가설에서 시험할 수 있는 예측을 이끌어 냈습니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>귀납은 관찰 → 규칙, 연역은 규칙·가설 → 예측. 실제 탐구에서는 귀납으로 얻은 규칙을 연역으로 시험하며 둘이 번갈아 쓰입니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("crBest") || "") + " / " + (window.sthState("limBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("induct1") || "기록 없음") + "<br><b>열두 밤의 기록</b> " + (window.sthState("crBest") || "-") + "<br><b>규칙의 한계</b> " + (window.sthState("limBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험1 Ⅰ-2] 이야기 ① 귀뚜라미 온도계",
    items: [
      { id: "w1", label: "귀납과 연역의 갈림길", hint: "두 방법이 갈리는 지점이 어디인지 한 문장으로 쓰세요. 귀뚜라미 이야기에서 각각의 예를 하나씩 들어도 좋아요.", ph: "귀납은 … 에서 출발하고, 연역은 … 에서 출발한다." },
      { id: "e1a", label: "우리 동네에서 해 볼 귀납 탐구", hint: "주변에서 여러 번 관찰해 규칙을 찾아볼 만한 현상을 하나 골라, 무엇을 몇 번 관찰할지 계획을 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 손을 씻으시오
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "탐구 기록 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "deduct1", title: "제멜바이스의 첫 걸음",
    question: "두 병동의 사망률 차이의 원인을 과학적으로 찾으려면 무엇부터 해야 할까요?",
    options: ["㉠ 1병동을 닫아 버린다", "㉡ 차이를 설명할 가설을 세우고, 가설이 옳다면 나타날 결과를 예측해 시험한다", "㉢ 1병동 산모들의 운이 나빴다고 본다", "㉣ 병원장의 의견을 그대로 따른다"],
    onPick: function (i) { window.sthState("deduct1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 가설 시험대 */
  (function () {
    var canvas = $("b-c-hyp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, hyp = "bell", m = 2;
    var got = window.sthState("hypGot") || { a: false, q: false };
    var PRE = [1.2, -0.8, 0.5, -1.4, 0.9, -0.4];
    var N1 = [1.8, -2.2, 0.9, -1.5, 2.4, -0.6, 1.2, -1.9, 0.4, -0.8, 1.6, -1.1];
    var N2 = [0.6, -0.4, 0.3, -0.7, 0.5, -0.2, 0.4, -0.5, 0.2, -0.3, 0.6, -0.4];
    var NAME = { bell: "신부가 돌아서 가게", pose: "옆으로 누워 분만", hand: "염소 소독수로 손 씻기" };
    function w1(i) { return hyp === "hand" ? 2.9 + N1[i] * 0.3 : 10 + N1[i]; }
    function w2(i) { return 3.2 + N2[i]; }
    function avg(f) { var s = 0; for (var i = 0; i < m; i++) s += f(i); return s / m; }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y0 = 30, y1 = 240;
      function X(i) { return x0 + (i + 0.5) / 18 * (x1 - x0); }
      function Y(p) { return y1 - p / 14 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 5, 10].forEach(function (p) { text(ctx, p + "%", x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "달마다 산모 사망률", x0 + 6, y0 - 10, { s: 11, w: "700", c: v("--mist") });
      seg(ctx, X(5.5), y0, X(5.5), y1, v("--amber-700"), 2, true);
      text(ctx, "조건을 바꾼 때", X(5.5) + 6, y0 + 12, { s: 10.5, w: "800", c: v("--amber-700") });
      text(ctx, "바꾸기 전 6달", X(2.5), y1 + 16, { s: 10, a: "center", c: v("--mist") });
      text(ctx, "바꾼 뒤 " + m + "달", X(6 + (m - 1) / 2), y1 + 16, { s: 10, a: "center", c: v("--mist") });
      function path(fPre, fPost, col) {
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var i = 0; i < 6 + m; i++) { var p = i < 6 ? fPre(i) : fPost(i - 6); if (i) ctx.lineTo(X(i), Y(p)); else ctx.moveTo(X(i), Y(p)); }
        ctx.stroke(); ctx.restore();
        for (var j = 0; j < 6 + m; j++) dot(ctx, X(j), Y(j < 6 ? fPre(j) : fPost(j - 6)), 3.5, col);
      }
      path(function (i) { return 10 + PRE[i]; }, w1, v("--coral-700"));
      path(function (i) { return 3.2 + PRE[i] * 0.3; }, w2, v("--teal"));
      var a1 = avg(w1), a2 = avg(w2), ok = hyp === "hand" && m >= 6;
      text(ctx, "1병동(의사)", 640, 50, { s: 12, w: "800", c: v("--coral-700") });
      text(ctx, "바꾼 뒤 평균 " + a1.toFixed(1) + "%", 640, 72, { s: 14, w: "900", c: v("--coral-700") });
      text(ctx, "2병동(조산사)", 640, 110, { s: 12, w: "800", c: v("--teal-700") });
      text(ctx, "같은 때 평균 " + a2.toFixed(1) + "%", 640, 132, { s: 14, w: "900", c: v("--teal-700") });
      text(ctx, "바꾼 조건: " + NAME[hyp], 640, 176, { s: 11.5, w: "700", c: v("--mist") });
      text(ctx, Math.abs(a1 - a2) < 1.5 ? "예측이 들어맞았다" : "예측이 빗나갔다", 640, 206, { s: 14, w: "900", c: Math.abs(a1 - a2) < 1.5 ? v("--green-700") : v("--rose-700") });
      return ok;
    }
    function update() {
      var ok = draw(), a1 = avg(w1), a2 = avg(w2), hit = Math.abs(a1 - a2) < 1.5;
      put("b-hyp-info", "‘" + NAME[hyp] + "’ 뒤 " + m + "달 동안 1병동 평균 사망률은 " + a1.toFixed(1) + "%, 2병동은 " + a2.toFixed(1) + "% 입니다. "
        + (ok ? "✅ 가설에서 이끌어 낸 예측대로 1병동의 사망률이 2병동 수준으로 떨어졌고, 6달 넘게 이어졌습니다." : (hit ? "예측대로 떨어졌지만 아직 몇 달 안 되었습니다. 우연이 아닌지 6달 이상 지켜보세요." : "예측대로라면 2병동 수준으로 떨어져야 하는데 그대로입니다. 이 가설은 지지되지 않습니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("hypGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q) {
        window.sthState("hypBest", "손 씻기 → 1병동 사망률 약 10% 에서 3% 로");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("hypBest") + ". 예측이 들어맞은 가설은 받아들이고, 빗나간 가설은 버립니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    segWire("b-hyp", "data-v", function (x) { hyp = x; update(); });
    $("b-m").addEventListener("input", function (ev) { m = +ev.target.value; $("b-m-val").textContent = m + "달"; update(); });
    window.sthPick({
      mount: "b-hyp-pick",
      q: "종소리 가설과 분만 자세 가설을 버린 까닭으로 가장 알맞은 것은?",
      options: ["제멜바이스가 두 가설을 싫어했기 때문에", "가설이 옳다면 나타나야 할 결과(사망률 감소)가 실제 실험에서 나타나지 않았기 때문에", "두 가설은 실험으로 시험할 수 없었기 때문에"],
      answer: 1,
      why: ["과학에서 가설을 받아들이고 버리는 기준은 개인의 좋고 싫음이 아니라 증거입니다.", "연역적 탐구에서는 가설에서 예측을 이끌어 내고, 실험 결과가 예측과 맞지 않으면 그 가설을 버립니다.", "두 가설 모두 조건을 바꿔 시험할 수 있었고, 실제로 시험해서 버린 것입니다."],
      onDone: function () { got.q = true; window.sthState("hypGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 공정한 비교 */
  (function () {
    var canvas = $("b-c-fair"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var wash = "1", season = "w", n = 80;
    var got = window.sthState("fairGot") || { a: false, q: false };
    var REF = { wash: "0", season: "s", n: 160 };
    function diffs() {
      return { wash: wash !== REF.wash, season: season !== REF.season, n: n !== REF.n };
    }
    function draw() {
      paper(ctx, W, H);
      var d = diffs(), rowsY = [92, 132, 172];
      var lab = ["손 씻기", "실험하는 계절", "한 달 산모 수"];
      var a = ["씻지 않음", "여름", REF.n + "명"], b = [wash === "1" ? "소독수로 씻음" : "씻지 않음", season === "s" ? "여름" : "겨울", n + "명"];
      var keys = ["wash", "season", "n"];
      function ward(x, title, vals) {
        ctx.fillStyle = v("--card"); ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.rect(x, 40, 250, 170); ctx.fill(); ctx.stroke();
        text(ctx, title, x + 16, 64, { s: 13.5, w: "900" });
        vals.forEach(function (s, i) { text(ctx, s, x + 16, rowsY[i] + 18, { s: 13, w: "800" }); });
      }
      ward(150, "가 병동 (비교 기준)", a);
      ward(460, "나 병동 (새 방법)", b);
      keys.forEach(function (k, i) {
        text(ctx, lab[i], 40, rowsY[i] + 18, { s: 11.5, w: "700", c: v("--mist") });
        if (d[k]) { ctx.fillStyle = A(k === "wash" ? v("--brand") : v("--rose-700"), 0.2); ctx.fillRect(152, rowsY[i], 556, 28); }
      });
      var other = (d.season ? 1 : 0) + (d.n ? 1 : 0), ok = d.wash && other === 0;
      text(ctx, ok ? "✔ 공정한 비교" : (d.wash ? "✘ 다른 조건 " + other + "개가 섞였다" : "✘ 비교할 차이가 없다"), 150, 236, { s: 14, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "파랑 = 일부러 바꾼 조건", 740, 140, { s: 11, w: "700", c: v("--brand-700") });
      text(ctx, "빨강 = 섞인 다른 조건", 740, 160, { s: 11, w: "700", c: v("--rose-700") });
      return ok;
    }
    function update() {
      var ok = draw(), d = diffs();
      var mix = []; if (d.season) mix.push("계절"); if (d.n) mix.push("산모 수");
      put("b-fair-info", ok ? "✅ 두 병동은 손 씻기만 다르고 계절과 산모 수가 같습니다. 사망률에 차이가 나면 손 씻기 때문이라고 말할 수 있어요."
        : (!d.wash ? "두 병동 모두 씻지 않으면 손 씻기의 효과를 알 수 없습니다." : mix.join("·") + "까지 다르면, 사망률이 달라져도 손 씻기 때문인지 " + mix.join("·") + " 때문인지 가릴 수 없습니다."));
      if (ok && !got.a) { got.a = true; window.sthState("fairGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.q) done("m2-3b");
      if (got.a && got.q) {
        window.sthState("fairBest", "손 씻기만 다르게, 계절·산모 수는 같게");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("fairBest") + ". 일부러 바꾸는 조건이 조작 변인, 같게 유지하는 조건이 통제 변인(둘을 합쳐 독립 변인), 그 결과로 재는 것이 종속 변인입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("b-f-wash", "data-v", function (x) { wash = x; update(); });
    segWire("b-f-season", "data-v", function (x) { season = x; update(); });
    $("b-f-n").addEventListener("input", function (ev) { n = +ev.target.value; $("b-f-n-val").textContent = n + "명"; update(); });
    window.sthPick({
      mount: "b-fair-pick",
      q: "이 검증 실험에서 종속 변인(결과로 재는 것)은 무엇일까요?",
      options: ["손 씻기를 하는지 하지 않는지", "실험하는 계절", "산모의 사망률"],
      answer: 2,
      why: ["일부러 다르게 한 조건, 조작 변인입니다.", "같게 유지한 조건, 통제 변인입니다.", "조작 변인(손 씻기)에 따라 달라지는지 재는 값이 종속 변인입니다."],
      onDone: function () { got.q = true; window.sthState("fairGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 연역적 탐구의 순서 */
  (function () {
    var STEPS = [
      "문제 인식 — 왜 1병동의 사망률만 높을까?",
      "가설 설정 — 해부실에서 온 의사의 손이 원인일 것이다",
      "탐구 설계 — 손 씻기만 다르게 하고 다른 조건은 같게(변인 통제)",
      "탐구 수행 — 염소 소독수로 손을 씻게 하고 달마다 사망률을 기록한다",
      "자료 해석 — 1병동 사망률이 2병동 수준으로 떨어졌다",
      "결론 도출 — 가설을 받아들이고, 다른 병원에서도 검증을 요청한다"
    ];
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>가설이 탐구의 방향을 정하고, 변인 통제가 결론을 믿을 만하게 만듭니다. 결과가 예측과 다르면 가설을 고쳐 다시 이 순서를 밟아요."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("b-order", STEPS); window.sthMission("m2-4", true); }
    else window.sthOrder({ mount: "b-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("hypBest") || "") + " / " + (window.sthState("fairBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 걸음</b> " + (window.sthState("deduct1") || "기록 없음") + "<br><b>가설 시험대</b> " + (window.sthState("hypBest") || "-") + "<br><b>공정한 비교</b> " + (window.sthState("fairBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험1 Ⅰ-2] 이야기 ② 손을 씻으시오",
    items: [
      { id: "w2", label: "좋은 가설의 조건", hint: "검증 가능한 가설과 그렇지 않은 가설을 하나씩 만들어 보고, 왜 그런지 쓰세요. (예: 종소리 가설은 시험할 수 있었나요?)", ph: "검증 가능한 가설: … / 검증할 수 없는 가설: … / 까닭: …" },
      { id: "e2a", label: "제멜바이스가 설득에 실패한 까닭", hint: "옳은 결론이었는데도 당시 의사들이 받아들이지 않은 까닭을, 과학 지식이 인정받는 과정과 관련지어 한두 문장으로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 장미 도표
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "탐구 기록 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "graph1", title: "조수의 첫 제안",
    question: "숫자가 빼곡한 표를 바쁜 장관들이 한눈에 알아보게 하려면 어떻게 해야 할까요?",
    options: ["㉠ 표를 더 자세하게 늘린다", "㉡ 장관이 묻는 질문에 맞는 그래프로 그려 한눈에 보이게 한다", "㉢ 가장 극적인 숫자 하나만 골라 말한다", "㉣ 숫자를 모두 외워 발표한다"],
    onPick: function (i) { window.sthState("graph1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 질문에 맞는 그래프 */
  (function () {
    var canvas = $("c-c-gr"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, q = "1", g = "bar";
    var got = window.sthState("grGot") || { a: false, b: false };
    var CAUSE = [["병(감염병)", 11157, "--brand"], ["기타", 1365, "--amber-700"], ["전투 부상", 772, "--coral-700"]];
    var MON = ["4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월", "3월"];
    var DIS = [1, 12, 11, 359, 828, 788, 503, 844, 1725, 2761, 2120, 1205];
    var COLS = ["--brand", "--teal", "--amber-700", "--coral-700", "--green-700", "--rose-700"];
    function data() { return q === "1" ? CAUSE.map(function (c) { return [c[0], c[1], c[2]]; }) : MON.map(function (m, i) { return [m, DIS[i], COLS[i % COLS.length]]; }); }
    function draw() {
      paper(ctx, W, H);
      var d = data(), x0 = 70, x1 = 560, y0 = 30, y1 = 250, max = 0;
      d.forEach(function (r) { max = Math.max(max, r[1]); });
      max = q === "1" ? 12000 : 3000;
      function Y(val) { return y1 - val / max * (y1 - y0); }
      function X(i) { return x0 + (i + 0.5) / d.length * (x1 - x0); }
      text(ctx, q === "1" ? "원인별 사망자 (1854.4 ~ 1855.3, 합계)" : "달마다 병으로 죽은 병사 수", x0, 20, { s: 12, w: "800" });
      if (g === "pie") {
        var tot = 0, a0 = -Math.PI / 2, cx = 300, cy = 168, r = 98;
        d.forEach(function (row) { tot += row[1]; });
        d.forEach(function (row) {
          var a1 = a0 + row[1] / tot * Math.PI * 2;
          ctx.fillStyle = A(v(row[2]), 0.8); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = v("--panel"); ctx.lineWidth = 1.5; ctx.stroke();
          if (row[1] / tot > 0.04) { var am = (a0 + a1) / 2; text(ctx, row[0] + " " + Math.round(row[1] / tot * 100) + "%", cx + Math.cos(am) * (r + 36), cy + Math.sin(am) * (r + 22) + 4, { s: 10.5, w: "800", a: "center" }); }
          a0 = a1;
        });
      } else {
        axes(ctx, x0, y0, x1, y1);
        [0, 0.5, 1].forEach(function (f) { text(ctx, Math.round(max * f), x0 - 6, Y(max * f) + 4, { s: 10, a: "right", c: v("--mist") }); });
        d.forEach(function (row, i) { text(ctx, row[0], X(i), y1 + 16, { s: q === "1" ? 11 : 9.5, a: "center", c: v("--mist") }); });
        if (g === "bar") d.forEach(function (row, i) { var bw = (x1 - x0) / d.length * 0.6; ctx.fillStyle = A(v(q === "1" ? row[2] : "--brand"), 0.8); ctx.fillRect(X(i) - bw / 2, Y(row[1]), bw, y1 - Y(row[1])); });
        if (g === "line") {
          ctx.save(); ctx.strokeStyle = v("--brand"); ctx.lineWidth = 3; ctx.beginPath();
          d.forEach(function (row, i) { if (i) ctx.lineTo(X(i), Y(row[1])); else ctx.moveTo(X(i), Y(row[1])); }); ctx.stroke(); ctx.restore();
          d.forEach(function (row, i) { dot(ctx, X(i), Y(row[1]), 4, v("--brand")); });
        }
        if (g === "sc") d.forEach(function (row, i) { dot(ctx, X(i), Y(row[1]), 5, v("--teal")); });
      }
      var ok = (q === "1" && g === "pie") || (q === "2" && g === "line");
      text(ctx, ok ? "질문에 딱 맞다" : "질문과 어긋난다", 640, 70, { s: 16, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "질문 ① " + (got.a ? "✔" : "…"), 640, 110, { s: 13, w: "800", c: got.a ? v("--green-700") : v("--mist") });
      text(ctx, "질문 ② " + (got.b ? "✔" : "…"), 640, 136, { s: 13, w: "800", c: got.b ? v("--green-700") : v("--mist") });
      return ok;
    }
    var MSG = {
      "1bar": "막대로 크기는 비교되지만, ‘전체 가운데 얼마나’인지는 한눈에 들어오지 않습니다.",
      "1line": "선그래프는 시간처럼 이어지는 변화에 씁니다. 원인은 순서가 없는 범주라 선으로 잇는 것이 뜻이 없어요.",
      "1pie": "✅ 원그래프 — 병으로 죽은 병사가 전체의 84% 라는 것이 한눈에 보입니다.",
      "1sc": "산점도는 두 변인의 관계를 볼 때 씁니다. 원인은 수치 변인이 아니에요.",
      "2bar": "달마다의 값은 보이지만, 늘고 줄어드는 흐름은 선그래프가 더 잘 보여 줍니다.",
      "2line": "✅ 선그래프 — 겨울로 갈수록 병으로 죽은 병사가 급격히 늘어 1월에 가장 많았다가 2월부터 줄어드는 흐름이 보입니다.",
      "2pie": "열두 달을 조각으로 나누면 달마다의 변화 순서가 보이지 않습니다.",
      "2sc": "점만 찍으면 변화의 흐름을 따라가기 어렵습니다. 시간에 따른 변화는 점을 이은 선그래프로 그려요."
    };
    function update() {
      var ok = draw();
      put("c-gr-info", MSG[q + g]);
      if (ok) {
        if (q === "1" && !got.a) { got.a = true; window.sthState("grGot", got); draw(); mission(); }
        if (q === "2" && !got.b) { got.b = true; window.sthState("grGot", got); draw(); mission(); }
      }
    }
    function mission() {
      if (got.a) done("m3-2a"); if (got.b) done("m3-2b");
      if (got.a && got.b) {
        window.sthState("grBest", "비율 → 원그래프, 달마다의 변화 → 선그래프");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("grBest") + ". 같은 자료라도 무엇을 묻느냐에 따라 알맞은 그래프가 달라집니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    segWire("c-q", "data-v", function (x) { q = x; update(); });
    segWire("c-g", "data-v", function (x) { g = x; update(); });
    update(); mission();
  })();

  /* 장면 3 — 축 속임수 */
  (function () {
    var canvas = $("c-c-ax"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, s0 = 95;
    var got = window.sthState("axGot") || { a: false, q: false };
    function draw() {
      paper(ctx, W, H);
      var x0 = 90, y0 = 30, y1 = 220, bw = 90;
      function Y(p) { return y1 - (p - s0) / (100 - s0) * (y1 - y0); }
      axes(ctx, x0, y0, x0 + 360, y1);
      [s0, (s0 + 100) / 2, 100].forEach(function (p) { text(ctx, p + "%", x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ctx.fillStyle = A(v("--mist"), 0.6); ctx.fillRect(x0 + 60, Y(96), bw, y1 - Y(96));
      ctx.fillStyle = A(v("--brand"), 0.85); ctx.fillRect(x0 + 210, Y(98), bw, y1 - Y(98));
      text(ctx, "옛 병원 96%", x0 + 60 + bw / 2, y1 + 18, { s: 11.5, w: "800", a: "center" });
      text(ctx, "새 병원 98%", x0 + 210 + bw / 2, y1 + 18, { s: 11.5, w: "800", a: "center" });
      var ratio = (98 - s0) / (96 - s0), ok = s0 === 0;
      text(ctx, "보이는 막대 높이의 비", 560, 60, { s: 12, w: "800", c: v("--mist") });
      text(ctx, ratio.toFixed(2) + " 배", 560, 88, { s: 20, w: "900", c: ratio > 1.2 ? v("--rose-700") : v("--green-700") });
      text(ctx, "실제 회복률의 비", 560, 128, { s: 12, w: "800", c: v("--mist") });
      text(ctx, (98 / 96).toFixed(2) + " 배", 560, 156, { s: 20, w: "900" });
      text(ctx, ok ? "정직한 그래프" : (ratio > 1.2 ? "차이를 부풀린 그래프" : "거의 정직함"), 560, 200, { s: 14, w: "900", c: ok ? v("--green-700") : (ratio > 1.2 ? v("--rose-700") : v("--amber-700")) });
      return ok;
    }
    function update() {
      var ok = draw(), ratio = (98 - s0) / (96 - s0);
      put("c-ax-info", "세로축을 " + s0 + "% 에서 시작하면 새 병원 막대가 옛 병원의 " + ratio.toFixed(2) + " 배로 보입니다. 실제 회복률은 1.02 배 차이예요. "
        + (ok ? "✅ 세로축을 0 에서 시작하니 막대의 길이가 실제 크기의 비를 그대로 보여 줍니다." : "막대그래프는 길이로 크기를 비교하므로, 세로축은 0 에서 시작해야 정직합니다."));
      if (ok && !got.a) { got.a = true; window.sthState("axGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-3a"); if (got.q) done("m3-3b");
      if (got.a && got.q) {
        window.sthState("axBest", "축을 95% 에서 시작하면 1.02 배 차이가 3 배로 보인다");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("axBest") + ". 그래프를 읽을 때는 먼저 축의 눈금부터 확인하세요. 다만 같은 자료를 사망률(4% → 2%)로 보면 절반이 된 것이니, 무엇을 비교하는지도 함께 따져야 합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("c-ax").addEventListener("input", function (ev) { s0 = +ev.target.value; $("c-ax-val").textContent = s0 + "%"; update(); });
    window.sthPick({
      mount: "c-ax-pick",
      q: "세로축을 95% 에서 시작한 그래프에서, 새 병원(98%) 막대는 옛 병원(96%) 막대의 몇 배 높이로 보일까요?",
      options: ["약 1.02 배", "약 2 배", "약 3 배", "약 10 배"],
      answer: 2,
      why: ["실제 값의 비입니다. 그래프에서는 달라 보여요.", "95 위로 올라온 부분은 3 과 1 입니다.", "보이는 막대는 98 − 95 = 3 과 96 − 95 = 1, 곧 3 배입니다. 1.02 배의 차이가 3 배로 부풀려졌어요.", "그렇게까지는 아닙니다. 95 위로 올라온 부분을 비교해 보세요."],
      onDone: function () { got.q = true; window.sthState("axGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 자료와 그래프 짝짓기 */
  window.sthSort({
    mount: "c-sort",
    buckets: [{ id: "cat", label: "📊 막대그래프", sub: "범주별 크기 비교" }, { id: "time", label: "📈 선그래프", sub: "시간에 따른 변화" }, { id: "rel", label: "⁘ 산점도", sub: "두 변인의 관계" }, { id: "ratio", label: "◔ 원그래프", sub: "전체에 대한 비율" }],
    items: [
      { t: "병원 다섯 곳의 침대 수 비교", a: "cat", why: "범주(병원)별 크기를 비교합니다." },
      { t: "설문에서 응답한 취미 종류별 응답자 수", a: "cat", why: "범주별 수량 비교입니다." },
      { t: "하루 동안 한 시간마다 잰 병실 온도", a: "time", why: "시간에 따라 이어지는 변화입니다." },
      { t: "한 달 동안 매일 잰 식물의 키", a: "time", why: "시간에 따른 변화입니다." },
      { t: "병사들의 하루 물 섭취량과 회복 기간 사이의 관계", a: "rel", why: "두 수치 변인의 관계를 봅니다." },
      { t: "공부 시간과 시험 점수 사이의 관계", a: "rel", why: "두 변인의 상관관계를 봅니다.", hint: "두 가지를 함께 잰 값인가요?" },
      { t: "병원 한 해 예산에서 약, 음식, 인건비가 차지하는 비중", a: "ratio", why: "전체에 대한 비율입니다." },
      { t: "학급 전체 학생 가운데 혈액형별 비율", a: "ratio", why: "전체를 나눈 비율입니다." }
    ],
    onDone: function () { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>비교는 막대, 변화는 선, 관계는 산점도, 비율은 원. 자료의 성격과 묻는 질문이 그래프를 정합니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m3-4", true);

  function finish() { window.sthState("r3", "완성 · " + (window.sthState("grBest") || "") + " / " + (window.sthState("axBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 제안</b> " + (window.sthState("graph1") || "기록 없음") + "<br><b>질문에 맞는 그래프</b> " + (window.sthState("grBest") || "-") + "<br><b>정직한 축</b> " + (window.sthState("axBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학탐구실험1 Ⅰ-2] 이야기 ③ 장미 도표",
    items: [
      { id: "e3a", label: "내 탐구 자료에 맞는 그래프", hint: "귀뚜라미 기록(우는 횟수와 기온)을 그래프로 나타낸다면 어떤 그래프가 알맞은지, 그 까닭과 함께 쓰세요." },
      { id: "e3b", label: "속이는 그래프를 알아보는 법", hint: "뉴스나 광고에서 그래프를 볼 때 확인해야 할 것을 두 가지 쓰세요." }
    ]
  });
})();

/* ========================================================================= 06 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험1 Ⅰ-2] 과학 탐구의 과정과 절차 — 정리",
  recap: [
    { key: "r1", label: "① 귀뚜라미 온도계" },
    { key: "r2", label: "② 손을 씻으시오" },
    { key: "r3", label: "③ 장미 도표" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "세 기록을 꿰는 한 문장", hint: "귀뚜라미, 손 씻기, 장미 도표. 세 이야기를 ‘관찰’, ‘가설’, ‘자료’라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 07 우리 반 */
window.sthShare({
  mount: "share", unit: "gt1-1-2", unitLabel: "[과학탐구실험1 Ⅰ-2] 과학 탐구의 과정과 절차",
  rows: [
    { key: "r1", label: "① 귀뚜라미 온도계" },
    { key: "r2", label: "② 손을 씻으시오" },
    { key: "r3", label: "③ 장미 도표" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "세 기록을 꿰는 한 문장" }
});

})();
