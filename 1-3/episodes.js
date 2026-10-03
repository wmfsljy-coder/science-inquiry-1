/* 과학탐구실험1 Ⅰ-3 역사 속의 과학 탐구 — 이야기 세 편
   01 빗면 위의 종소리 / 02 빗물을 재는 그릇 / 03 두 사람의 주기율표
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt1-1-3");

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

/* =========================================================================
   이야기 ① 빗면 위의 종소리
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "실험 일지 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "galileo", title: "조수의 첫 답",
    question: "갈릴레이가 <b>피사의 사탑에서 두 공을 떨어뜨린 실험</b>은 실제로 있었을까요?",
    options: ["㉠ 실제로 있었고 기록도 남아 있다", "㉡ 근거가 명확하지 않은 후대의 이야기다", "㉢ 다른 사람이 한 실험이다", "㉣ 실패한 실험이었다"],
    onPick: function (i) { window.sthState("galileoOK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  var L = 5, G = 9.8;
  function tRoll(deg) { return Math.sqrt(2 * L / (5 / 7 * G * Math.sin(deg * Math.PI / 180))); }

  /* 장면 2 — 빗면 실험 */
  (function () {
    var canvas = $("a-c-inc"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, ang = 40, ball = "iron";
    var got = window.sthState("incGot") || { iron: false, wood: false };
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, y0 = 260, len = 520, r = ang * Math.PI / 180;
      var sc = Math.min(1, 200 / (len * Math.sin(r)));
      var dx = len * Math.cos(r) * sc, dy = len * Math.sin(r) * sc;
      var topX = x0, topY = y0 - dy, botX = x0 + dx, botY = y0;
      ctx.fillStyle = A(v("--amber-700"), 0.18); ctx.beginPath(); ctx.moveTo(topX, topY); ctx.lineTo(botX, botY); ctx.lineTo(topX, botY); ctx.closePath(); ctx.fill();
      seg(ctx, topX, topY, botX, botY, v("--ink"), 3);
      text(ctx, ang + "°", botX - 46, botY - 8, { s: 12, w: "800", c: v("--amber-700") });
      var t = tRoll(ang);
      for (var k = 0; k <= 4; k++) {
        var f = (k / 4) * (k / 4), px = topX + dx * f, py = topY + dy * f;
        dot(ctx, px, py - 7, k === 4 ? 8 : 6, A(v(ball === "iron" ? "--ink" : "--amber-700"), k === 4 ? 1 : 0.35 + k * 0.12));
        text(ctx, (t * k / 4).toFixed(2) + "초", px + 8, py - 16, { s: 10, w: "700", c: v("--mist") });
      }
      var err = 0.1 / t * 100, ok = err <= 4;
      text(ctx, ball === "iron" ? "무거운 쇠공 3 kg" : "가벼운 나무공 1 kg", 640, 50, { s: 14, w: "900" });
      text(ctx, "굴러 내려온 시간 " + t.toFixed(2) + " 초", 640, 82, { s: 14, w: "800", c: v("--brand-700") });
      text(ctx, "물시계 오차 ± 0.1 초 → " + err.toFixed(1) + "%", 640, 110, { s: 13, w: "800", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "쇠공 " + (got.iron ? "✔ 잼" : "…") + "   나무공 " + (got.wood ? "✔ 잼" : "…"), 640, 146, { s: 12, w: "700", c: v("--mist") });
      text(ctx, "공 사이의 간격 = 같은 시간(¼)마다의 위치", 640, 180, { s: 11, c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), t = tRoll(ang);
      if (ok) { if (!got[ball]) { got[ball] = true; window.sthState("incGot", got); draw(); } }
      put("a-inc-info", "기울기 " + ang + "° 에서 " + (ball === "iron" ? "쇠공" : "나무공") + "이 5 m 를 굴러 내려오는 데 " + t.toFixed(2) + " 초. 공의 무게를 바꿔도 시간은 그대로입니다. "
        + (ok ? "✅ 시간이 길어져 물시계로도 4% 안으로 잴 수 있습니다." + (got.iron && got.wood ? " 두 공 모두 같은 시간이었어요!" : " 다른 공도 굴려 보세요.") : "너무 빨라 물시계의 0.1 초 오차가 큽니다. 기울기를 줄여 보세요."));
      mission();
    }
    function mission() {
      if (got.iron || got.wood) done("m1-2a"); if (got.iron && got.wood) done("m1-2b");
      if (got.iron && got.wood && !ep.cleared(1)) {
        window.sthState("incBest", "기울기 13° 이하 → 2.5 초 넘게, 무게와 상관없이 같은 시간");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("incBest") + ". 빗면은 중력의 효과를 줄여 낙하를 ‘느린 화면’으로 만들어 주었습니다.");
        ep.clear(1);
      } else if (got.iron && got.wood) window.sthMission("m1-2", true);
    }
    canvas._redraw = draw;
    $("a-ang").addEventListener("input", function (ev) { ang = +ev.target.value; $("a-ang-val").textContent = ang + "°"; update(); });
    segWire("a-ball", "data-v", function (x) { ball = x; update(); });
    update();
  })();

  /* 장면 3 — 고르게 울리는 종 */
  (function () {
    var canvas = $("a-c-bell"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, rule = "lin";
    var got = window.sthState("bellGot") || { a: false, q: false };
    var POS = { lin: [1, 2, 3, 4], dbl: [1, 2, 4, 8], sq: [1, 4, 9, 16] };
    function times() { return POS[rule].map(function (x) { return Math.sqrt(x); }); }
    function draw() {
      paper(ctx, W, H);
      var p = POS[rule], x0 = 50, x1 = 850, y = 70, max = 16;
      function X(u) { return x0 + u / max * (x1 - x0); }
      seg(ctx, x0, y, x1, y, v("--ink"), 3);
      text(ctx, "빗면 (출발점 → 아래쪽, 16칸)", x0, y - 30, { s: 11.5, w: "700", c: v("--mist") });
      dot(ctx, X(0), y - 8, 7, v("--ink"));
      p.forEach(function (u, i) { text(ctx, "🔔", X(u), y - 8, { s: 16, a: "center" }); text(ctx, u + "칸", X(u), y + 20, { s: 10.5, w: "700", a: "center", c: v("--mist") }); });
      var ts = times(), tx0 = 50, tx1 = 850, ty = 170;
      function T(s) { return tx0 + s / 4.2 * (tx1 - tx0); }
      text(ctx, "종이 울리는 때 (첫 종까지 걸린 시간 = 1박자)", tx0, ty - 30, { s: 11.5, w: "700", c: v("--mist") });
      seg(ctx, tx0, ty, tx1, ty, v("--line"), 2);
      for (var b = 0; b <= 4; b++) { seg(ctx, T(b), ty - 6, T(b), ty + 6, v("--line"), 1.5); text(ctx, b + "박", T(b), ty + 20, { s: 10, a: "center", c: v("--mist") }); }
      var iv = [], prev = 0;
      ts.forEach(function (s, i) { dot(ctx, T(s), ty, 7, v("--brand")); iv.push(s - prev); prev = s; });
      var even = iv.every(function (d) { return Math.abs(d - iv[0]) < 0.02; });
      text(ctx, "종과 종 사이 시간: " + iv.map(function (d) { return d.toFixed(2); }).join(" · ") + " 박", tx0, 236, { s: 13, w: "800", c: even ? v("--green-700") : v("--ink") });
      text(ctx, even ? "고른 박자 ♪" : "박자가 고르지 않다", 700, 236, { s: 14, w: "900", c: even ? v("--green-700") : v("--rose-700") });
      return even;
    }
    function update() {
      var ok = draw();
      put("a-bell-info", ok ? "✅ 종을 1, 4, 9, 16 칸에 달자 딩-딩-딩-딩 고른 박자로 울립니다. 같은 시간 동안 간 거리가 1, 3, 5, 7 칸으로 늘어나니, 공은 점점 빨라지고 있어요. 간 거리는 시간의 제곱에 비례합니다."
        : (rule === "lin" ? "같은 간격으로 달면 종소리가 점점 빨라집니다. 공이 내려갈수록 빨라지기 때문이에요." : "두 배씩 벌리면 뒤로 갈수록 박자가 늘어집니다."));
      if (ok && !got.a) { got.a = true; window.sthState("bellGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("bellBest", "종 1·4·9·16 칸 → 고른 박자, 거리 ∝ 시간²");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("bellBest") + ". 갈릴레이는 측정한 결과를 수학 규칙으로 나타냈습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("a-rule", "data-v", function (x) { rule = x; update(); });
    window.sthPick({
      mount: "a-bell-pick",
      q: "처음 1박자 동안 공이 1칸 갔다면, 처음 3박자 동안에는 모두 몇 칸 갈까요?",
      options: ["3칸", "6칸", "9칸", "27칸"],
      answer: 2,
      why: ["속력이 일정하다면 그렇겠지만 공은 점점 빨라집니다.", "1 + 2 + 3 이 아니라 1 + 3 + 5 입니다.", "1 + 3 + 5 = 9칸 = 3². 간 거리는 시간의 제곱에 비례합니다.", "시간의 세제곱이 아니라 제곱입니다."],
      onDone: function () { got.q = true; window.sthState("bellGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 누구의 생각일까 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "ari", label: "🏺 아리스토텔레스", sub: "옛 생각" }, { id: "gal", label: "🔭 갈릴레이", sub: "새 생각" }],
    items: [
      { t: "무거운 물체일수록 더 빨리 떨어진다", a: "ari", why: "2000년 동안 이어진 옛 생각입니다." },
      { t: "물체는 본래 제자리(땅)로 돌아가려는 성질 때문에 떨어진다", a: "ari", why: "목적과 본성으로 운동을 설명했습니다." },
      { t: "움직이는 물체는 계속 밀어 주어야 움직인다", a: "ari", why: "관성을 몰랐던 생각입니다." },
      { t: "눈으로 본 것을 논리로 설명하면 되며, 굳이 재어 볼 필요는 없다", a: "ari", why: "측정과 실험보다 관찰과 추론을 중시했습니다.", hint: "‘재어 보기’를 중시한 사람은 누구일까요?" },
      { t: "무거운 돌과 가벼운 돌을 묶으면 더 느려져야 하면서 더 빨라져야 한다 — 모순이다", a: "gal", why: "사고 실험으로 옛 생각의 모순을 드러냈습니다." },
      { t: "빗면으로 낙하를 늦추어 시간을 잰다", a: "gal", why: "측정할 수 있게 실험을 설계했습니다." },
      { t: "간 거리는 시간의 제곱에 비례한다", a: "gal", why: "측정 결과를 수학 규칙으로 나타냈습니다." },
      { t: "깃털이 늦게 떨어지는 것은 무게가 아니라 공기의 저항 때문이다", a: "gal", why: "공기 저항이라는 다른 변인을 가려냈습니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>사고 실험, 측정할 수 있는 실험 설계, 수학 규칙. 갈릴레이의 방법은 운동에 대한 생각의 틀 자체를 바꾸었습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("incBest") || "") + " / " + (window.sthState("bellBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 답</b> " + (window.sthState("galileo") || "기록 없음") + "<br><b>빗면 실험</b> " + (window.sthState("incBest") || "-") + "<br><b>종소리</b> " + (window.sthState("bellBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험1 Ⅰ-3] 이야기 ① 빗면 위의 종소리",
    items: [
      { id: "w1", label: "갈릴레이가 실제로 한 것", hint: "사탑 일화가 아니라면 갈릴레이는 무엇으로 결론을 얻었는지 쓰세요.", ph: "사고 실험: … / 빗면 실험: … / 찾아낸 규칙: …" },
      { id: "e1a", label: "빗면을 쓴 까닭", hint: "갈릴레이가 공을 그냥 떨어뜨리지 않고 빗면에서 굴린 까닭을, 측정 도구의 한계와 관련지어 한 문장으로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 빗물을 재는 그릇
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "실험 일지 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "rain1", title: "관리의 첫 제안",
    question: "온 나라의 비의 양을 서로 견줄 수 있게 하려면 어떻게 해야 할까요?",
    options: ["㉠ 흙이 더 깊이 젖은 고을에 비가 더 왔다고 본다", "㉡ 모든 고을이 같은 모양의 그릇과 같은 눈금의 자로 고인 빗물을 잰다", "㉢ 비가 온 시간만 기록한다", "㉣ 고을 원님의 느낌을 믿는다"],
    onPick: function (i) { window.sthState("rain1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 측우기 설계 */
  (function () {
    var canvas = $("b-c-rain"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, shape = "bowl", d = 14;
    var got = window.sthState("rainGot") || { a: false, q: false, ds: [] };
    if (!got.ds) got.ds = [];
    var R = 3; /* 내린 비 30 mm = 3 cm */
    function depth() {
      var rt = d / 2;
      if (shape === "cyl") return R;
      if (shape === "bottle") return R * (rt * rt) / (4 * rt * rt); /* 몸통 반지름 = 입구의 2배 */
      /* 사발: 바닥 반지름 = 입구의 0.4, 높이 0.6d — 부피가 같아질 때까지 물 깊이를 찾는다 */
      var Hc = 0.6 * d, rb = 0.4 * rt, Vt = Math.PI * rt * rt * R, lo = 0, hi = Hc;
      for (var k = 0; k < 40; k++) {
        var h = (lo + hi) / 2, rh = rb + (rt - rb) * h / Hc;
        var Vh = Math.PI * h / 3 * (rb * rb + rb * rh + rh * rh);
        if (Vh < Vt) lo = h; else hi = h;
      }
      return (lo + hi) / 2;
    }
    function draw() {
      paper(ctx, W, H);
      var cx = 250, by = 250, s = 7, rt = d / 2 * s, h = depth() * s;
      text(ctx, "☔ 내린 비 30 mm", cx, 26, { s: 13, w: "800", a: "center", c: v("--brand-700") });
      for (var i = 0; i < 9; i++) seg(ctx, cx - 100 + i * 25, 36, cx - 106 + i * 25, 52, A(v("--brand"), 0.6), 2);
      ctx.strokeStyle = v("--ink"); ctx.lineWidth = 3; ctx.fillStyle = A(v("--brand"), 0.35);
      var Hc;
      if (shape === "cyl") {
        Hc = 26 * s;
        ctx.fillRect(cx - rt, by - h, 2 * rt, h);
        ctx.beginPath(); ctx.moveTo(cx - rt, by - Hc); ctx.lineTo(cx - rt, by); ctx.lineTo(cx + rt, by); ctx.lineTo(cx + rt, by - Hc); ctx.stroke();
      } else if (shape === "bottle") {
        Hc = 20 * s; var rb = 2 * rt, neck = 5 * s;
        ctx.fillRect(cx - rb, by - h, 2 * rb, h);
        ctx.beginPath(); ctx.moveTo(cx - rt, by - Hc - neck); ctx.lineTo(cx - rt, by - Hc); ctx.lineTo(cx - rb, by - Hc + 20); ctx.lineTo(cx - rb, by); ctx.lineTo(cx + rb, by);
        ctx.lineTo(cx + rb, by - Hc + 20); ctx.lineTo(cx + rt, by - Hc); ctx.lineTo(cx + rt, by - Hc - neck); ctx.stroke();
      } else {
        Hc = 0.6 * d * s; var rb2 = 0.4 * rt, rh = rb2 + (rt - rb2) * h / Hc;
        ctx.beginPath(); ctx.moveTo(cx - rb2, by); ctx.lineTo(cx + rb2, by); ctx.lineTo(cx + rh, by - h); ctx.lineTo(cx - rh, by - h); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx - rt, by - Hc); ctx.lineTo(cx - rb2, by); ctx.lineTo(cx + rb2, by); ctx.lineTo(cx + rt, by - Hc); ctx.stroke();
      }
      seg(ctx, cx + (shape === "bottle" ? 2 * rt : rt) + 16, by, cx + (shape === "bottle" ? 2 * rt : rt) + 16, by - h, v("--coral-700"), 2.5);
      text(ctx, (depth() * 10).toFixed(0) + " mm", cx + (shape === "bottle" ? 2 * rt : rt) + 24, by - h / 2 + 4, { s: 12, w: "800", c: v("--coral-700") });
      var mm = depth() * 10, ok = Math.abs(mm - 30) < 0.5;
      text(ctx, "고인 물의 깊이 " + mm.toFixed(1) + " mm", 560, 70, { s: 15, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "실제 내린 비 30 mm", 560, 100, { s: 13, w: "800", c: v("--mist") });
      text(ctx, "원통으로 잰 지름: " + (got.ds.length ? got.ds.join(", ") + " cm" : "아직 없음"), 560, 140, { s: 12, w: "700", c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw(), mm = depth() * 10;
      if (shape === "cyl" && got.ds.indexOf(d) < 0) { got.ds.push(d); window.sthState("rainGot", got); draw(); }
      if (shape === "cyl" && got.ds.length >= 2 && !got.a) { got.a = true; window.sthState("rainGot", got); }
      put("b-rain-info", (shape === "cyl" ? "곧은 원통" : (shape === "bottle" ? "위가 좁은 병" : "위가 넓은 사발")) + ", 입구 지름 " + d + " cm: 고인 물의 깊이 " + mm.toFixed(1) + " mm. "
        + (shape === "cyl" ? (got.ds.length >= 2 ? "✅ 크기가 달라도 깊이가 늘 30 mm, 내린 비와 같습니다." : "크기를 한 번 더 바꿔 보세요.") : (shape === "bowl" ? "입구로 받은 물이 좁은 바닥에 모여 실제보다 깊게 보이고, 크기에 따라서도 달라집니다." : "좁은 입구로 받은 물이 넓은 몸통에 퍼져 실제보다 얕게 보입니다.")));
      mission();
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q && !ep.cleared(1)) {
        window.sthState("rainBest", "곧은 원통은 크기와 상관없이 깊이 = 내린 비");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("rainBest") + ". 측우기가 원통인 까닭입니다.");
        ep.clear(1);
      } else if (got.a && got.q) window.sthMission("m2-2", true);
    }
    canvas._redraw = draw;
    segWire("b-shape", "data-v", function (x) { shape = x; update(); });
    $("b-d").addEventListener("input", function (ev) { d = +ev.target.value; $("b-d-val").textContent = d + " cm"; update(); });
    window.sthPick({
      mount: "b-rain-pick",
      q: "조선은 측우기와 함께 깊이를 재는 자(주척)의 길이도 정해 전국에 보냈습니다. 그 까닭은?",
      options: ["자를 멋있게 만들고 싶어서", "그릇이 같아도 자의 눈금이 고을마다 다르면 잰 값을 서로 비교할 수 없기 때문에", "측우기가 무거워서 자로 받쳐야 했기 때문에"],
      answer: 1,
      why: ["모양보다 기준이 중요했습니다.", "측정 도구와 단위가 모두 같아야, 여러 곳에서 잰 자료를 모아 비교할 수 있습니다. 이것이 표준화입니다.", "자는 빗물의 깊이를 재는 도구였습니다."],
      onDone: function () { got.q = true; window.sthState("rainGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 1 m 의 역사 */
  (function () {
    var canvas = $("b-c-era"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, era = 0;
    var got = window.sthState("eraGot") || { a: false, q: false };
    var ERAS = [
      { n: "고대 이집트", y: "약 BC 3000", ico: "💪", base: "파라오의 팔(왕실 큐빗)", who: "이집트 안에서만", d: "팔꿈치에서 가운뎃손가락 끝까지의 길이를 큐빗으로 정하고, 돌로 만든 표준 막대로 관리했습니다. 사람마다 팔 길이가 달라 기준 막대가 꼭 필요했지요." },
      { n: "중국 진(秦)", y: "BC 221", ico: "⚖️", base: "나라가 정한 자·되·저울", who: "통일된 중국 안에서", d: "진시황이 나라마다 달랐던 자·되·저울을 하나로 통일했습니다. 세금과 거래, 수레바퀴 폭까지 같아졌습니다." },
      { n: "조선 세종", y: "1430 ~ 1440년대", ico: "🎐", base: "황종척·주척 등 표준 자", who: "조선 전국에서", d: "음악의 기준음을 내는 피리(황종관)의 길이로 자의 기준을 삼고, 여러 자를 정비해 측우기와 함께 전국에 보냈습니다." },
      { n: "프랑스 혁명", y: "1799", ico: "🌍", base: "북극~적도 자오선 거리의 1000만분의 1", who: "누구나 (원리상)", d: "북극에서 적도까지 거리의 1000만분의 1을 1 m 로 정했습니다. 한 사람의 몸이 아닌 ‘자연’에서 기준을 가져오려 했지요." },
      { n: "미터 협약", y: "1875 / 1889", ico: "📏", base: "백금-이리듐 국제 미터원기", who: "원기를 비교할 수 있는 나라", d: "1875년 17개 나라가 미터 협약을 맺고, 1889년 백금-이리듐 막대(국제 미터원기)를 1 m 의 기준으로 삼았습니다. 복사본을 나누어 가진 나라들은 가끔 원기와 비교해야 했습니다." },
      { n: "빛의 속력으로", y: "1983", ico: "💡", base: "빛이 1/299 792 458 초 동안 가는 거리", who: "어디서나 누구나", d: "빛의 속력을 정확한 값으로 정하고, 이것으로 1 m 를 정의했습니다. 막대가 없어도 어느 실험실에서나 1 m 를 재현할 수 있습니다." },
      { n: "SI 재정의", y: "2019", ico: "⚛️", base: "플랑크 상수 등 자연 상수", who: "어디서나 누구나", d: "마지막까지 금속 덩어리(국제 킬로그램 원기)였던 킬로그램도 플랑크 상수로 다시 정의되어, 모든 기본 단위가 자연 상수를 기준으로 삼게 되었습니다." }
    ];
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 840, y = 60;
      seg(ctx, x0, y, x1, y, v("--line"), 3);
      ERAS.forEach(function (e, i) {
        var x = x0 + i / (ERAS.length - 1) * (x1 - x0), on = i === era;
        dot(ctx, x, y, on ? 10 : 6, on ? v("--brand") : (i < era ? v("--teal") : v("--line")));
        text(ctx, e.y, x, y + 26, { s: on ? 11 : 9.5, w: on ? "800" : "600", a: "center", c: on ? v("--ink") : v("--mist") });
      });
      var e = ERAS[era];
      text(ctx, e.ico, 90, 170, { s: 48, a: "center" });
      text(ctx, e.n + " · " + e.y, 150, 130, { s: 16, w: "900" });
      text(ctx, "기준: " + e.base, 150, 162, { s: 13, w: "800", c: v("--brand-700") });
      text(ctx, "누가 그 기준을 똑같이 만들 수 있나: " + e.who, 150, 192, { s: 12.5, w: "700", c: era >= 5 ? v("--green-700") : v("--mist") });
      text(ctx, "몸 → 나라 → 지구 → 금속 원기 → 자연 상수", 150, 228, { s: 11.5, w: "700", c: v("--mist") });
      return era === ERAS.length - 1;
    }
    function update() {
      var ok = draw(), e = ERAS[era];
      $("b-era-val").textContent = e.n;
      put("b-era-info", "<b>" + e.n + " (" + e.y + ")</b> " + e.d + (ok ? " ✅ 오늘날까지 따라왔습니다." : ""));
      if (ok && !got.a) { got.a = true; window.sthState("eraGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-3a"); if (got.q) done("m2-3b");
      if (got.a && got.q) {
        window.sthState("eraBest", "사람의 몸 → 나라의 표준 → 지구(자오선) → 금속 원기 → 자연 상수");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("eraBest") + ". 기준은 점점 <b>누구나, 어디서나, 언제나</b> 똑같이 재현할 수 있는 쪽으로 바뀌었습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("b-era").addEventListener("input", function (ev) { era = +ev.target.value; update(); });
    window.sthPick({
      mount: "b-era-pick",
      q: "2019년 킬로그램을 금속 원기 대신 플랑크 상수로 다시 정의한 까닭으로 가장 알맞은 것은?",
      options: ["금속 원기가 너무 비싸서", "금속 원기는 오랜 세월 동안 질량이 아주 조금씩 달라질 수 있지만, 자연 상수는 언제 어디서나 같아 누구나 재현할 수 있기 때문에", "플랑크 상수가 더 외우기 쉬워서"],
      answer: 1,
      why: ["값이 문제가 아니었습니다.", "실제로 국제 킬로그램 원기와 복사본들의 질량이 100여 년 동안 수십 마이크로그램씩 벌어졌습니다. 변하지 않고 어디서나 재현할 수 있는 기준이 필요했지요.", "외우기 쉬운 값은 아닙니다. 변하지 않는다는 것이 중요합니다."],
      onDone: function () { got.q = true; window.sthState("eraGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 우리 선조의 과학 유산 */
  window.sthSort({
    mount: "b-sort",
    buckets: [{ id: "time", label: "⏰ 시간 알리기", sub: "해·물로 시각을 잰다" }, { id: "sky", label: "🔭 하늘·날씨 관측과 계산", sub: "재고, 기록하고, 계산한다" }, { id: "tech", label: "🛠️ 기술과 제작", sub: "만드는 기술" }],
    items: [
      { t: "앙부일구 — 그림자의 위치로 시각과 절기를 읽는 가마솥 모양 해시계", a: "time", why: "해의 그림자로 시각을 잽니다." },
      { t: "자격루 — 물의 흐름으로 스스로 종·북·징을 울리는 자동 물시계(1434)", a: "time", why: "물의 흐름으로 시각을 알립니다." },
      { t: "측우기 — 곧은 원통으로 강우량을 잰 표준 측정 도구(1441)", a: "sky", why: "날씨를 재어 기록했습니다." },
      { t: "혼천의 — 여러 고리로 해·달·별의 위치를 관측하는 천문 기구", a: "sky", why: "하늘을 관측합니다." },
      { t: "첨성대 — 신라 때 세운 천문 관측대", a: "sky", why: "하늘을 관측하던 곳입니다.", hint: "무엇을 보던 곳일까요?" },
      { t: "칠정산 — 서울을 기준으로 해와 달, 행성의 움직임을 계산한 역법(1442)", a: "sky", why: "관측 자료로 하늘의 움직임을 계산했습니다." },
      { t: "거북선 — 판옥선을 덮개로 덮어 적의 접근을 막은 전함", a: "tech", why: "배를 만드는 기술입니다." },
      { t: "직지 — 현존하는 가장 오래된 금속 활자 인쇄본(1377)", a: "tech", why: "금속 활자 주조와 인쇄 기술입니다." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>우리 선조들은 하늘과 날씨를 재고 기록하며, 그 자료로 우리 땅에 맞는 역법과 도구를 만들었습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("rainBest") || "") + " / " + (window.sthState("eraBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 제안</b> " + (window.sthState("rain1") || "기록 없음") + "<br><b>측우기 설계</b> " + (window.sthState("rainBest") || "-") + "<br><b>단위의 역사</b> " + (window.sthState("eraBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험1 Ⅰ-3] 이야기 ② 빗물을 재는 그릇",
    items: [
      { id: "e2a", label: "측우기가 원통인 까닭", hint: "사발이나 병이 아니라 곧은 원통이어야 하는 까닭을, 이 장면에서 잰 결과를 근거로 쓰세요." },
      { id: "e2b", label: "표준 단위가 과학에 필요한 까닭", hint: "여러 사람이 같은 기준으로 재는 것이 과학 지식을 만드는 데 왜 중요한지 한두 문장으로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 두 사람의 주기율표
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "실험 일지 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "multi1", title: "학생의 첫 추측",
    question: "서로 모르는 두 과학자가 같은 해에 거의 같은 주기율표를 만든 까닭은 무엇일까요?",
    options: ["㉠ 한 사람이 몰래 베꼈다", "㉡ 순전한 우연이다", "㉢ 그 시대에 원소 자료가 쌓이고, 여러 과학자가 같은 문제를 풀고 있었기 때문이다", "㉣ 두 사람 모두 천재였기 때문이다"],
    onPick: function (i) { window.sthState("multi1OK", i === 2 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 원소 카드 늘어놓기 */
  (function () {
    var canvas = $("c-c-tab"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, w = 6;
    var got = window.sthState("tabGot") || false;
    var EL = [["Li", 6.9], ["Be", 9.0], ["B", 10.8], ["C", 12.0], ["N", 14.0], ["O", 16.0], ["F", 19.0], ["Ne", 20.2],
              ["Na", 23.0], ["Mg", 24.3], ["Al", 27.0], ["Si", 28.1], ["P", 31.0], ["S", 32.1], ["Cl", 35.5], ["Ar", 39.9], ["K", 39.1], ["Ca", 40.1]];
    var FAM = ["#e4572e", "#f3a712", "#8aa63c", "#29a36a", "#1f8fbf", "#3a5fb0", "#9b5de5", "#d6589b"];
    var FNAME = ["알칼리 금속", "알칼리 토금속", "붕소족", "탄소족", "질소족", "산소족", "할로젠", "비활성 기체"];
    function aligned(k) {
      var col = {}, used = {};
      for (var i = 0; i < EL.length; i++) {
        var f = i % 8, c = i % k;
        if (col[f] == null) col[f] = c; else if (col[f] !== c) return false;
      }
      for (var f2 in col) { if (used[col[f2]]) return false; used[col[f2]] = true; }
      return true;
    }
    function draw() {
      paper(ctx, W, H);
      var rows = Math.ceil(EL.length / w), cw = Math.min(78, 820 / w), ch = Math.min(52, (H - 50) / rows - 6), x0 = (W - cw * w) / 2, y0 = 16;
      EL.forEach(function (e, i) {
        var r = Math.floor(i / w), c = i % w, x = x0 + c * cw, y = y0 + r * (ch + 6);
        ctx.fillStyle = FAM[i % 8]; ctx.fillRect(x + 2, y, cw - 4, ch);
        text(ctx, e[0], x + cw / 2, y + ch * 0.48, { s: ch < 46 ? 14 : 16, w: "900", a: "center", c: "#fff" });
        text(ctx, e[1].toFixed(1), x + cw / 2, y + ch * 0.84, { s: 10.5, w: "700", a: "center", c: "#fff" });
      });
      var ok = aligned(w);
      text(ctx, ok ? "같은 가족이 세로로 나란히!" : "같은 색이 흩어져 있다", W / 2, H - 12, { s: 14, w: "900", a: "center", c: ok ? v("--green-700") : v("--rose-700") });
      return ok;
    }
    function update() {
      var ok = draw();
      put("c-tab-info", "한 줄에 " + w + "장씩 놓았습니다. " + (ok ? "✅ 8장씩 끊자 성질이 비슷한 원소 가족(" + FNAME.join(", ") + ")이 세로줄마다 모였습니다. 원소의 성질이 원자량 순서에 따라 <b>주기적으로</b> 되풀이됩니다. (아르곤과 칼륨은 원자량 순서가 뒤바뀌어 있지만 성질에 맞게 놓았어요.)" : "같은 색 카드가 한 세로줄에 모이도록 줄 길이를 바꿔 보세요."));
      if (ok && !got) { got = true; window.sthState("tabGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("tabBest", "8장씩 끊으면 원소 가족이 세로로 — 주기성");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("tabBest") + ". 규칙성을 찾자, 규칙에서 벗어난 빈칸도 보이기 시작합니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("c-w").addEventListener("input", function (ev) { w = +ev.target.value; $("c-w-val").textContent = w + "장"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 에카규소 */
  (function () {
    var canvas = $("c-c-eka"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, m = 50;
    var got = window.sthState("ekaGot") || { a: false, q: false };
    var GRID = [[["Al", 27.0], ["Si", 28.1], ["P", 31.0]], [["Ga", 69.7], ["?", 0], ["As", 74.9]], [["In", 114.8], ["Sn", 118.7], ["Sb", 121.8]]];
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, y0 = 24, cw = 110, ch = 66;
      for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
        var e = GRID[r][c], x = x0 + c * (cw + 8), y = y0 + r * (ch + 8), mid = e[0] === "?", nb = (r === 1) !== (c === 1);
        ctx.fillStyle = mid ? A(v("--brand"), 0.2) : (nb ? A(v("--teal"), 0.3) : A(v("--mist"), 0.15));
        ctx.fillRect(x, y, cw, ch);
        if (mid) { ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.strokeRect(x, y, cw, ch); ctx.setLineDash([]); }
        text(ctx, mid ? "에카규소" : e[0], x + cw / 2, y + 28, { s: mid ? 14 : 18, w: "900", a: "center", c: mid ? v("--brand-700") : v("--ink") });
        text(ctx, mid ? m.toFixed(1) + " ?" : e[1].toFixed(1), x + cw / 2, y + 50, { s: 12, w: "800", a: "center", c: mid ? v("--brand-700") : v("--mist") });
      }
      var ok = Math.abs(m - 72.6) <= 1.5;
      text(ctx, "이웃 넷 (청록): Si · Ga · As · Sn", 470, 50, { s: 12.5, w: "800", c: v("--teal-700") });
      text(ctx, "위·아래 평균 " + ((28.1 + 118.7) / 2).toFixed(1), 470, 80, { s: 12, w: "700", c: v("--mist") });
      text(ctx, "왼쪽·오른쪽 평균 " + ((69.7 + 74.9) / 2).toFixed(1), 470, 104, { s: 12, w: "700", c: v("--mist") });
      text(ctx, "내 예측 " + m.toFixed(1), 470, 150, { s: 16, w: "900", c: ok ? v("--green-700") : v("--ink") });
      if (ok) text(ctx, "1886년 게르마늄 발견: 72.6", 470, 182, { s: 13, w: "800", c: v("--green-700") });
      text(ctx, "※ 갈륨은 1875년 발견", 470, 226, { s: 10.5, c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw();
      put("c-eka-info", "예측한 원자량 " + m.toFixed(1) + ". " + (ok ? "✅ 1886년에 발견된 게르마늄의 원자량 72.6 과 거의 같습니다. 멘델레예프가 1871년에 예측한 값(약 72)도 이 근처였어요." : "주기율표에서 원소의 성질은 이웃들 사이에서 차례로 변합니다. 이웃 넷의 원자량을 참고해 보세요."));
      if (ok && !got.a) { got.a = true; window.sthState("ekaGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-3a"); if (got.q) done("m3-3b");
      if (got.a && got.q) {
        window.sthState("ekaBest", "이웃의 평균으로 원자량 약 72 예측 → 게르마늄 72.6");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("ekaBest") + ". 앞날을 예측하고 그 예측이 검증되는 것, 이것이 과학 이론의 큰 힘입니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("c-m").addEventListener("input", function (ev) { m = +ev.target.value; $("c-m-val").textContent = m.toFixed(1); update(); });
    window.sthPick({
      mount: "c-eka-pick",
      q: "갈륨(1875)과 게르마늄(1886)이 멘델레예프의 예측대로 발견되자 어떤 일이 일어났을까요?",
      options: ["주기율표는 여전히 무시되었다", "예측이 검증되면서 과학자들이 주기율표를 널리 받아들이게 되었다", "멘델레예프의 예측이 틀렸음이 밝혀졌다"],
      answer: 1,
      why: ["예측이 맞은 뒤로 오히려 크게 주목받았습니다.", "아직 발견되지 않은 것을 맞힌 예측은 이론을 믿을 강력한 증거가 됩니다. 마이어보다 멘델레예프가 더 널리 알려진 까닭이기도 해요.", "원자량, 밀도 같은 성질까지 매우 가깝게 맞았습니다."],
      onDone: function () { got.q = true; window.sthState("ekaGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 동시 발견 */
  (function () {
    var canvas = $("c-c-sim"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, idx = 0;
    var got = window.sthState("simGot") || { seen: [], q: false };
    if (!got.seen) got.seen = [];
    var CASES = [
      { t: "미적분학", r: [1660, 1690],
        a: { n: "아이작 뉴턴 (영국)", e: [[1665, "미분 아이디어 착안"], [1666, "적분 정리"], [1687, "『프린키피아』 출간"]] },
        b: { n: "고트프리트 라이프니츠 (독일)", e: [[1675, "독자적으로 미적분 정리"], [1684, "미분 논문 첫 출판"], [1686, "적분 논문 출판"]] },
        note: "두 사람은 각자 독립적으로 미적분을 완성했습니다. ‘누가 먼저인가’를 두고 오랜 논쟁이 있었지만, 오늘날에는 각자의 독창적 발견으로 인정하며 라이프니츠의 기호(dx, ∫)가 지금도 쓰입니다." },
      { t: "자연선택설", r: [1830, 1862],
        a: { n: "찰스 다윈 (영국)", e: [[1831, "비글호 항해 시작"], [1838, "자연선택 아이디어 구상"], [1859, "『종의 기원』 출간"]] },
        b: { n: "앨프리드 러셀 월리스 (영국)", e: [[1848, "아마존 탐사"], [1854, "말레이 제도 탐사"], [1858, "다윈에게 자연선택 논문 편지"]] },
        note: "월리스가 거의 같은 결론의 논문을 보내오자, 1858년 린네 학회에서 두 사람의 이론이 함께 발표되었고 이듬해 다윈이 『종의 기원』을 펴냈습니다." },
      { t: "전화기", r: [1873, 1878],
        a: { n: "알렉산더 그레이엄 벨 (스코틀랜드 출신, 미국)", e: [[1875, "음성을 전기 신호로 바꾸는 실험"], [1876.12, "2월 14일 특허 출원"], [1876.2, "3월 첫 통화 성공"]] },
        b: { n: "일라이셔 그레이 (미국)", e: [[1874, "전화 관련 장치 연구"], [1876.12, "같은 날 특허 예고 제출"], [1877, "우선권 분쟁"]] },
        note: "벨과 그레이는 1876년 2월 14일 같은 날 같은 특허청에 전화 관련 서류를 냈습니다. 벨의 서류가 먼저 접수되었다고 전해지지만, 순서를 두고 지금도 논란이 있습니다." },
      { t: "산소의 발견", r: [1769, 1779],
        a: { n: "칼 빌헬름 셸레 (스웨덴)", e: [[1771, "산화수은을 가열해 ‘불의 공기’ 분리"], [1772, "실험 결과 기록"], [1777, "출판이 늦어져 뒤늦게 발표"]] },
        b: { n: "조지프 프리스틀리 (영국)", e: [[1774, "산화수은 가열로 기체 분리"], [1775.2, "편지로 발표"], [1775.4, "‘탈플로지스톤 공기’로 이름 붙임"]] },
        note: "셸레가 먼저 분리했지만 출판이 늦어 프리스틀리가 먼저 알려졌습니다. 뒤에 라부아지에가 이 기체에 ‘산소’라는 이름을 붙이고 연소를 새로 설명했습니다." }
    ];
    function draw() {
      paper(ctx, W, H);
      var c = CASES[idx], pl = 70, pr = 60, t0 = c.r[0], t1 = c.r[1];
      function X(y) { return pl + (y - t0) / (t1 - t0) * (W - pl - pr); }
      var lanes = [[c.a, 88, "--coral-700"], [c.b, 196, "--brand"]];
      lanes.forEach(function (ln) {
        var p = ln[0], y = ln[1], col = v(ln[2]);
        text(ctx, p.n, pl, y - 50, { s: 12.5, w: "900", c: col });
        seg(ctx, X(t0), y, X(t1), y, A(col, 0.35), 3);
        p.e.forEach(function (ev, k) {
          dot(ctx, X(ev[0]), y, 6, col);
          var oy = [-14, 22, -30][k % 3];
          text(ctx, Math.floor(ev[0]) + " " + ev[1], X(ev[0]), y + oy, { s: 10.5, w: "700", a: "center" });
        });
      });
      var step = Math.max(1, Math.round((t1 - t0) / 6));
      for (var yy = Math.ceil(t0 / step) * step; yy <= t1; yy += step) text(ctx, yy, X(yy), 250, { s: 10, a: "center", c: v("--mist") });
      text(ctx, "살펴본 사례 " + got.seen.length + " / 4", W - 20, 20, { s: 11.5, w: "800", a: "right", c: got.seen.length >= 4 ? v("--green-700") : v("--mist") });
    }
    function update() {
      if (got.seen.indexOf(idx) < 0) { got.seen.push(idx); window.sthState("simGot", got); }
      draw();
      put("c-sim-info", "<b>" + CASES[idx].t + "</b> — " + CASES[idx].note + (got.seen.length >= 4 ? " ✅ 네 사례를 모두 살펴보았습니다." : ""));
      mission();
    }
    function mission() {
      if (got.seen.length >= 4) done("m3-4a"); if (got.q) done("m3-4b");
      if (got.seen.length >= 4 && got.q && !ep.cleared(3)) {
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>필요한 지식과 도구가 쌓이면 여러 사람이 같은 발견에 이릅니다. 과학 지식은 시대와 공동체가 함께 만듭니다.");
        ep.clear(3); ep.clear(4);
      } else if (got.seen.length >= 4 && got.q) window.sthMission("m3-4", true);
    }
    canvas._redraw = draw;
    segWire("c-case", "data-v", function (x) { idx = +x; update(); });
    window.sthPick({
      mount: "c-sim-pick",
      q: "과학사에서 동시 발견이 자주 일어나는 까닭으로 가장 알맞은 것은?",
      options: ["과학자들이 서로의 연구를 몰래 베끼기 때문에", "그 시대에 쌓인 지식·자료·도구가 같은 발견을 할 수 있는 조건을 만들어 주기 때문에", "위대한 발견은 늘 한 사람의 천재성만으로 이루어지기 때문에"],
      answer: 1,
      why: ["네 사례 모두 서로 독립적으로 연구했습니다.", "앞선 수학 연구, 탐사 기록, 전기 기술, 기체 실험 기구처럼 필요한 것이 갖추어지면 여러 사람이 같은 곳에 다다릅니다. 과학 지식이 사회·문화적 맥락 속에서 만들어진다는 뜻이에요.", "그렇다면 같은 발견이 여러 곳에서 동시에 나오기 어렵겠지요."],
      onDone: function () { got.q = true; window.sthState("simGot", got); mission(); }
    });
    update();
  })();

  function finish() { window.sthState("r3", "완성 · " + (window.sthState("tabBest") || "") + " / " + (window.sthState("ekaBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 추측</b> " + (window.sthState("multi1") || "기록 없음") + "<br><b>원소 카드</b> " + (window.sthState("tabBest") || "-") + "<br><b>에카규소</b> " + (window.sthState("ekaBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학탐구실험1 Ⅰ-3] 이야기 ③ 두 사람의 주기율표",
    items: [
      { id: "w2", label: "같은 발견이 동시에", hint: "같은 시기에 여러 사람이 같은 것을 발견한 사례를 하나 들고, 왜 그런 일이 생기는지 생각을 쓰세요.", ph: "사례: … / 까닭: …" },
      { id: "e3a", label: "예측이 이론에 주는 힘", hint: "멘델레예프의 빈칸 예측이 맞은 일이 주기율표를 믿게 하는 데 왜 중요했는지 한 문장으로 쓰세요." }
    ]
  });
})();

/* ========================================================================= 06 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험1 Ⅰ-3] 역사 속의 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 빗면 위의 종소리" },
    { key: "r2", label: "② 빗물을 재는 그릇" },
    { key: "r3", label: "③ 두 사람의 주기율표" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" }
  ],
  items: [
    { id: "all", label: "세 일지를 꿰는 한 문장", hint: "빗면, 측우기, 주기율표. 세 이야기를 ‘측정’과 ‘과학 지식’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 07 우리 반 */
window.sthShare({
  mount: "share", unit: "gt1-1-3", unitLabel: "[과학탐구실험1 Ⅰ-3] 역사 속의 과학 탐구",
  rows: [
    { key: "r1", label: "① 빗면 위의 종소리" },
    { key: "r2", label: "② 빗물을 재는 그릇" },
    { key: "r3", label: "③ 두 사람의 주기율표" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" }
  ],
  line: { id: "all", label: "세 일지를 꿰는 한 문장" }
});

})();
