/* 과학탐구실험1 Ⅰ-4 과학 탐구의 과정과 절차 — 이야기 네 편
   01 목이 휜 플라스크 / 02 두 번째 프리즘 / 03 추운 겨울의 반론 / 04 마늘 대 세균
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt1-1-4");

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
   이야기 ① 목이 휜 플라스크
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "탐구 보고서 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "biogen", title: "조수의 첫 판단",
    question: "끓여 식힌 고기즙을 열어 두었더니 사흘 뒤 미생물이 가득했습니다. 이 결과는 무엇을 보여 줄까요?",
    options: ["㉠ 생물은 무생물에서 저절로 생겨난다", "㉡ 공기 속의 무언가가 들어가 자랐을 수도 있으니, 아직 원인을 단정할 수 없다", "㉢ 고기즙을 충분히 끓이지 않았다", "㉣ 고기즙은 원래 상하는 물질이다"],
    onPick: function (i) { window.sthState("biogenOK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 백조는 모두 흰색일까 */
  (function () {
    var canvas = $("a-c-swan"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var got = window.sthState("swanGot") || { n: 0, black: false, q: false };
    function swan(x, y, col, line) {
      ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = line; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(x, y, 13, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 9, y - 3); ctx.quadraticCurveTo(x + 16, y - 18, x + 8, y - 20); ctx.lineWidth = 3.5; ctx.strokeStyle = col; ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 8, y - 20, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f08a24"; ctx.beginPath(); ctx.moveTo(x + 5, y - 21); ctx.lineTo(x, y - 19); ctx.lineTo(x + 5, y - 18); ctx.fill();
      ctx.restore();
    }
    function draw() {
      paper(ctx, W, H);
      text(ctx, "유럽에서 관찰한 백조 " + got.n + "마리", 24, 24, { s: 13, w: "900" });
      var shown = Math.min(got.n, 60);
      for (var i = 0; i < shown; i++) swan(40 + (i % 20) * 42, 62 + Math.floor(i / 20) * 42, "#ffffff", "#9aa3ad");
      if (got.n > 60) text(ctx, "… 외 " + (got.n - 60) + "마리", 860, 200, { s: 11, a: "right", c: v("--mist") });
      if (got.black) {
        ctx.fillStyle = A(v("--rose-700"), 0.12); ctx.fillRect(640, 150, 240, 64);
        swan(680, 190, "#15171c", "#15171c");
        text(ctx, "1697년 오스트레일리아", 710, 176, { s: 11.5, w: "800", c: v("--rose-700") });
        text(ctx, "검은 백조 발견!", 710, 198, { s: 13, w: "900", c: v("--rose-700") });
      }
    }
    function update() {
      draw();
      $("a-black").disabled = got.n < 20 || got.black;
      put("a-swan-info", got.black ? "✅ 수천 년의 ‘흰 백조’ 관찰이 검은 백조 한 마리로 무너졌습니다. 관찰한 사례가 아무리 많아도, 관찰하지 않은 사례까지 보장하지는 못합니다."
        : (got.n >= 20 ? "관찰한 " + got.n + "마리가 모두 흰색입니다. 귀납적 결론: ‘모든 백조는 희다.’ 이제 1697년의 소식을 확인해 보세요." : "관찰한 백조 " + got.n + "마리. 모두 흰색이에요. 20마리 이상 관찰해 결론을 내려 보세요."));
      mission();
    }
    function mission() {
      if (got.n >= 20) done("m1-2a"); if (got.black) done("m1-2b"); if (got.q) done("m1-2c");
      if (got.n >= 20 && got.black && got.q && !ep.cleared(1)) {
        window.sthState("swanBest", "흰 백조 " + got.n + "마리 → 검은 백조 1마리로 결론이 무너짐");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("swanBest") + ". ‘열어 둔 고기즙은 언제나 상했다’는 관찰을 쌓아도, 그 원인이 무엇인지까지 알려 주지는 않습니다.");
        ep.clear(1);
      } else if (got.n >= 20 && got.black && got.q) window.sthMission("m1-2", true);
    }
    function add(k) { got.n += k; window.sthState("swanGot", got); update(); }
    $("a-add").addEventListener("click", function () { add(1); });
    $("a-add5").addEventListener("click", function () { add(5); });
    $("a-black").addEventListener("click", function () { if (got.n >= 20) { got.black = true; window.sthState("swanGot", got); update(); } });
    canvas._redraw = draw;
    window.sthPick({
      mount: "a-swan-pick",
      q: "백조 이야기에서 알 수 있는 귀납적 결론의 특징은?",
      options: ["관찰을 충분히 쌓으면 결론은 절대 틀리지 않는다", "많은 관찰로 얻은 결론도 새로운 관찰 하나로 뒤집힐 수 있어, 늘 잠정적이다", "귀납은 과학에서 쓸모없는 방법이다"],
      answer: 1,
      why: ["수천 년의 관찰도 검은 백조 한 마리를 막지 못했습니다.", "귀납적 결론은 지금까지의 관찰로 가장 그럴듯한 것일 뿐, 새로운 관찰에 열려 있습니다.", "귀납은 규칙을 찾는 데 꼭 필요합니다. 다만 결론을 늘 시험해야 할 뿐이에요."],
      onDone: function () { got.q = true; window.sthState("swanGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 백조목 플라스크 */
  (function () {
    var canvas = $("a-c-flask"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, neck = "straight", day = 0;
    var got = window.sthState("flaskGot") || { a: false, b: false, q: false };
    var NAME = { straight: "곧은 목", swan: "S자 백조목", tilt: "백조목 — 기울여 굽은 곳을 적심", broken: "백조목 — 목을 부러뜨림" };
    function murk() { return neck === "swan" || day < 2 ? 0 : Math.min(1, (day - 1) / 4); }
    function draw() {
      paper(ctx, W, H);
      var cx = 240, cy = 210, r = 72, m = murk();
      var col = "rgb(" + Math.round(236 - 90 * m) + "," + Math.round(196 - 70 * m) + "," + Math.round(120 - 50 * m) + ")";
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, 0.15 * Math.PI, 0.85 * Math.PI); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy - r + 4);
      var tipX, tipY, trapX = null, trapY = null;
      if (neck === "straight") { ctx.lineTo(cx, cy - r - 90); tipX = cx; tipY = cy - r - 90; }
      else if (neck === "broken") { ctx.lineTo(cx, cy - r - 22); tipX = cx; tipY = cy - r - 22; }
      else { ctx.bezierCurveTo(cx, cy - r - 60, cx + 110, cy - r + 10, cx + 130, cy - r - 60); tipX = cx + 130; tipY = cy - r - 60; trapX = cx + 70; trapY = cy - r - 18; }
      ctx.stroke(); ctx.strokeStyle = v("--panel"); ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
      /* 먼지 */
      var n = Math.min(24, day * 2 + 4);
      for (var i = 0; i < n; i++) {
        var fx = tipX - 30 + (i * 37) % 60, fy = tipY - 16 - (i * 23) % 40;
        dot(ctx, fx, fy, 2.2, A(v("--mist"), 0.9));
      }
      if (trapX !== null && day > 0) for (var k = 0; k < Math.min(14, day + 2); k++) dot(ctx, trapX - 12 + k * 2, trapY + 4 - (k % 3), 2.2, neck === "tilt" && day >= 1 ? A(v("--coral-700"), 0.9) : A(v("--mist"), 0.9));
      if (m > 0) for (var j = 0; j < Math.round(m * 30); j++) dot(ctx, cx - 50 + (j * 29) % 100, cy + 10 + (j * 17) % 40, 1.8, A("#4a3a10", 0.8));
      text(ctx, "공기 ⇄", tipX + 20, tipY - 4, { s: 11, w: "800", c: v("--brand-700") });
      if (trapX !== null) text(ctx, neck === "tilt" ? "먼지를 고기즙이 적심" : "먼지가 굽은 곳에 걸림", trapX + 14, trapY + 36, { s: 10.5, w: "700", c: neck === "tilt" ? v("--coral-700") : v("--mist") });
      text(ctx, NAME[neck], 520, 60, { s: 14, w: "900" });
      text(ctx, day + "일째", 520, 92, { s: 13, w: "800", c: v("--mist") });
      text(ctx, m === 0 ? "맑음 — 미생물 없음" : (m < 0.5 ? "흐려지기 시작" : "뿌옇게 상함 — 미생물 가득"), 520, 124, { s: 15, w: "900", c: m === 0 ? v("--green-700") : v("--rose-700") });
      text(ctx, "공기가 드나드나? 예", 520, 160, { s: 12, w: "700", c: v("--mist") });
      text(ctx, "먼지가 고기즙에 닿나? " + (neck === "swan" ? "아니요" : "예"), 520, 184, { s: 12, w: "700", c: v("--mist") });
    }
    function update() {
      draw();
      var m = murk();
      if (neck === "swan" && day >= 14 && !got.a) { got.a = true; window.sthState("flaskGot", got); }
      if ((neck === "tilt" || neck === "broken") && day >= 3 && !got.b) { got.b = true; window.sthState("flaskGot", got); }
      put("a-flask-info", NAME[neck] + ", " + day + "일째: " + (m === 0 ? "고기즙이 맑습니다." : "고기즙이 흐려졌습니다.") + " "
        + (neck === "swan" ? (day >= 14 ? "✅ 공기는 자유롭게 드나드는데도 14일 동안 맑습니다. 먼지 속 미생물이 굽은 목에 걸렸기 때문이에요." : "며칠 더 지켜보세요.")
          : (neck === "straight" ? "곧은 목으로는 먼지가 곧장 떨어져 들어갑니다." : (day >= 3 ? "✅ 같은 백조목이라도 먼지가 고기즙에 닿자 곧 상했습니다. 원인은 공기가 아니라 먼지 속 미생물입니다." : "며칠 지켜보세요."))));
      mission();
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.b) done("m1-3b"); if (got.q) done("m1-3c");
      if (got.a && got.b && got.q && !ep.cleared(2)) {
        window.sthState("flaskBest", "백조목 14일 맑음, 목을 부러뜨리거나 적시면 상함");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("flaskBest") + ". 목 모양(먼지가 닿는지)만 다르게 한 대조 실험이 원인을 가려냈습니다.");
        ep.clear(2);
      } else if (got.a && got.b && got.q) window.sthMission("m1-3", true);
    }
    canvas._redraw = draw;
    segWire("a-neck", "data-v", function (x) { neck = x; update(); });
    $("a-day").addEventListener("input", function (ev) { day = +ev.target.value; $("a-day-val").textContent = day + "일"; update(); });
    window.sthPick({
      mount: "a-flask-pick",
      q: "백조목 플라스크 실험이 자연발생설을 무너뜨린 결정적 실험이 된 까닭은?",
      options: ["플라스크 모양이 아름다워 사람들의 관심을 끌었기 때문에", "공기는 드나들게 해 ‘생명력 있는 공기’라는 자연발생설의 조건을 채우면서, 먼지 속 미생물만 막아 두 설명의 예측이 갈렸기 때문에", "고기즙을 더 오래 끓였기 때문에"],
      answer: 1,
      why: ["모양이 아니라 실험의 논리가 핵심이었습니다.", "입구를 막으면 자연발생설 쪽은 ‘공기가 없어서’라고 반박할 수 있었습니다. 공기는 통하게 하면서 미생물만 막아, 한쪽 예측만 맞게 만든 것이 결정적이었어요.", "끓이는 시간은 곧은 목 플라스크와 같았습니다. 다른 조건은 같게, 목 모양만 달랐지요."],
      onDone: function () { got.q = true; window.sthState("flaskGot", got); mission(); }
    });
    update();
  })();

  /* 장면 4 — 두 설명의 예측 가르기 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "both", label: "🤢 두 설명 모두 ‘상한다’", sub: "결과로는 가를 수 없다" }, { id: "none", label: "🙂 두 설명 모두 ‘상하지 않는다’", sub: "결과로는 가를 수 없다" }, { id: "split", label: "⚖️ 예측이 갈린다", sub: "결정적 실험이 될 수 있다" }],
    items: [
      { t: "끓이지 않은 고기즙을 입구를 연 채 둔다", a: "both", why: "미생물이 이미 있으니 두 설명 모두 상한다고 예측합니다." },
      { t: "끓인 고기즙을 곧은 목 플라스크에 두고 입구를 연다", a: "both", why: "생명력 있는 공기도, 먼지도 들어갑니다." },
      { t: "끓인 뒤 백조목을 부러뜨린다", a: "both", why: "공기와 먼지가 모두 들어갑니다." },
      { t: "끓인 뒤 백조목을 기울여 굽은 곳의 먼지를 적신다", a: "both", why: "먼지 속 미생물이 고기즙에 닿습니다." },
      { t: "끓인 뒤 플라스크 입구를 불에 녹여 완전히 막는다", a: "none", why: "자연발생설 쪽도 ‘공기가 없어서’라며 상하지 않는다고 예측합니다. 그래서 이 실험으로는 논쟁이 끝나지 않았어요.", hint: "자연발생설은 무엇이 있어야 생물이 생긴다고 했나요?" },
      { t: "끓인 뒤 입구를 막고 얼음 창고에 둔다", a: "none", why: "공기도 먼지도 들어가지 않습니다." },
      { t: "끓인 고기즙을 S자 백조목 플라스크에 둔다", a: "split", why: "공기는 들어가니 자연발생설은 ‘상한다’, 먼지는 막히니 생물속생설은 ‘상하지 않는다’고 예측합니다." },
      { t: "끓인 뒤 입구를 솜마개로 막는다 (공기는 통하고 먼지는 걸러짐)", a: "split", why: "백조목과 같은 논리입니다. 공기는 통하고 미생물만 걸러집니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>두 가설의 예측이 서로 다른 실험이어야 결정적 실험이 됩니다. 입구를 녹여 막는 실험(스팔란차니, 1768)으로 논쟁이 끝나지 않았던 까닭이에요."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("swanBest") || "") + " / " + (window.sthState("flaskBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("biogen") || "기록 없음") + "<br><b>백조 관찰</b> " + (window.sthState("swanBest") || "-") + "<br><b>백조목 플라스크</b> " + (window.sthState("flaskBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험1 Ⅰ-4] 이야기 ① 목이 휜 플라스크",
    items: [
      { id: "w2", label: "가설이 갖추어야 할 조건", hint: "파스퇴르의 백조목 실험에서 검증된 가설을 한 문장으로 쓰고, 그 가설이 왜 “검증 가능한” 가설인지 설명하세요.", ph: "가설: … / 검증 가능한 까닭: …" },
      { id: "w3", label: "통제해야 했던 변인", hint: "그 실험에서 무엇을 같게 두고 무엇만 다르게 두었는지 쓰세요.", ph: "같게 둔 것: … / 다르게 둔 것: …" }
    ]
  });
})();

/* =========================================================================
   이야기 ② 두 번째 프리즘
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "탐구 보고서 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "prism1", title: "조수의 첫 제안",
    question: "‘유리가 흰빛을 물들여 색을 만든다’와 ‘흰빛 속에 원래 여러 색이 있다’ 가운데 무엇이 옳은지 가리려면?",
    options: ["㉠ 프리즘을 더 많이 늘어놓아 더 넓은 무지개를 만든다", "㉡ 한 가지 색만 골라 두 번째 프리즘에 통과시켜, 새로운 색이 생기는지 본다", "㉢ 프리즘을 깨끗이 닦는다", "㉣ 무지개의 색 수를 센다"],
    onPick: function (i) { window.sthState("prism1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  var GL = { crown: { r: 1.514, g: 1.522, v: 1.532, n: "보통 유리" }, flint: { r: 1.612, g: 1.628, v: 1.652, n: "납 유리" } };
  function dev(n, i) {
    var Ap = 60 * Math.PI / 180, ii = i * Math.PI / 180, r1 = Math.asin(Math.sin(ii) / n), r2 = Ap - r1, s = n * Math.sin(r2);
    if (s >= 1) return null;
    return (ii + Math.asin(s) - Ap) * 180 / Math.PI;
  }
  function prism(ctx, cx, cy, sz, flip) {
    var h = sz * 0.866, s = flip ? -1 : 1;
    ctx.save(); ctx.fillStyle = A(v("--brand"), 0.12); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy - s * h * 0.6); ctx.lineTo(cx - sz / 2, cy + s * h * 0.4); ctx.lineTo(cx + sz / 2, cy + s * h * 0.4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  var SPEC = ["#ff3b30", "#ff9500", "#ffd60a", "#34c759", "#0a84ff", "#5e5ce6", "#af52de"];

  /* 장면 2 — 빛을 펼치기 */
  (function () {
    var canvas = $("b-c-disp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, glass = "crown", inc = 60;
    var got = window.sthState("dispGot") || false;
    function draw() {
      paper(ctx, W, H);
      var g = GL[glass], dr = dev(g.r, inc), dv = dev(g.v, inc), px = 330, py = 160;
      prism(ctx, px, py, 150, false);
      var ia = (inc - 30) * Math.PI / 180 * 0.8;
      var sx = px - 260, sy = py + 30 - Math.tan(ia) * 180;
      seg(ctx, sx, sy, px - 40, py + 20, "#f5f5f5", 5); seg(ctx, sx, sy, px - 40, py + 20, v("--line"), 1);
      text(ctx, "흰빛 (들어가는 각 " + inc + "°)", sx, sy - 12, { s: 11, w: "800" });
      if (dr === null || dv === null) {
        text(ctx, "빛이 프리즘 안에서 전반사되어 나오지 못함", px + 100, py + 10, { s: 13, w: "900", c: v("--rose-700") });
      } else {
        var spread = dv - dr;
        for (var k = 0; k < 7; k++) {
          var a = (dr + (dv - dr) * k / 6 - 40) * 3 * Math.PI / 180 + 0.25;
          seg(ctx, px + 40, py + 20, px + 40 + Math.cos(a) * 420, py + 20 + Math.sin(a) * 420, SPEC[k], 3);
        }
        text(ctx, "빨강이 꺾인 각 " + dr.toFixed(1) + "°, 보라 " + dv.toFixed(1) + "°", 560, 40, { s: 12.5, w: "800" });
        text(ctx, "벌어진 각 " + spread.toFixed(2) + "°", 560, 68, { s: 16, w: "900", c: spread >= 3 ? v("--green-700") : v("--ink") });
      }
      text(ctx, GL[glass].n + " · 꼭지각 60° · 퍼짐은 3배로 과장", 20, H - 12, { s: 10.5, c: v("--mist") });
      return dr !== null && dv !== null && dv - dr >= 3;
    }
    function update() {
      var ok = draw(), g = GL[glass], dr = dev(g.r, inc), dv = dev(g.v, inc);
      put("b-disp-info", (dr === null || dv === null) ? "빛이 첫 면에 너무 곧게 들어가, 두 번째 면에 비스듬히 닿아 빠져나오지 못하고 전부 반사됩니다. 들어가는 각을 키워 보세요."
        : g.n + ", 들어가는 각 " + inc + "°: 빨강과 보라가 " + (dv - dr).toFixed(2) + "° 벌어집니다. " + (ok ? "✅ 색을 하나씩 골라낼 만큼 넓게 펼쳐졌습니다. 납 유리는 색에 따른 굴절률 차이가 더 커요." : "아직 좁습니다. 유리 종류와 각도를 바꿔 보세요."));
      if (ok && !got) { got = true; window.sthState("dispGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("dispBest", "납 유리로 빨강·보라를 3° 넘게 펼침");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("dispBest") + ". 색마다 굴절률이 달라 꺾이는 정도가 다릅니다(빨강 < 보라).");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    segWire("b-glass", "data-v", function (x) { glass = x; update(); });
    $("b-i").addEventListener("input", function (ev) { inc = +ev.target.value; $("b-i-val").textContent = inc + "°"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 결정적 실험 */
  (function () {
    var canvas = $("b-c-crux"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, slit = "all", p2 = "none";
    var got = window.sthState("cruxGot") || { cols: [], rec: false, q: false };
    if (!got.cols) got.cols = [];
    var CI = { red: 0, green: 3, violet: 6 }, CN = { red: "빨강", green: "초록", violet: "보라" };
    function draw() {
      paper(ctx, W, H);
      var p1x = 150, py = 140;
      seg(ctx, 10, py - 10, p1x - 30, py + 4, "#f5f5f5", 5); seg(ctx, 10, py - 10, p1x - 30, py + 4, v("--line"), 1);
      prism(ctx, p1x, py, 100, false);
      var bx = 400;
      ctx.fillStyle = v("--ink"); ctx.fillRect(bx, 40, 8, 200);
      var ys = SPEC.map(function (c, k) { return 80 + k * 20; });
      SPEC.forEach(function (c, k) { if (slit === "all" || CI[slit] === k) seg(ctx, p1x + 30, py + 4, bx, ys[k], c, 3); else seg(ctx, p1x + 30, py + 4, bx, ys[k], A(c, 0.35), 2); });
      text(ctx, "판자", bx + 4, 30, { s: 11, w: "800", a: "center", c: v("--mist") });
      var p2x = 560, out = [];
      if (slit === "all") {
        if (p2 === "none") SPEC.forEach(function (c, k) { seg(ctx, bx + 8, ys[k], 860, 60 + k * 28, c, 3); out = SPEC; });
        else {
          prism(ctx, p2x, 140, 110, p2 === "flip");
          SPEC.forEach(function (c, k) { seg(ctx, bx + 8, ys[k], p2x - 30, 140, c, 2.5); });
          if (p2 === "flip") { seg(ctx, p2x + 30, 140, 860, 140, "#f5f5f5", 6); seg(ctx, p2x + 30, 140, 860, 140, v("--line"), 1); }
          else SPEC.forEach(function (c, k) { seg(ctx, p2x + 30, 140, 860, 20 + k * 40, c, 3); });
        }
      } else {
        var k0 = CI[slit], c0 = SPEC[k0];
        if (p2 === "none") seg(ctx, bx + 8, ys[k0], 860, ys[k0], c0, 4);
        else { prism(ctx, p2x, 140, 110, p2 === "flip"); seg(ctx, bx + 8, ys[k0], p2x - 30, 140, c0, 4); seg(ctx, p2x + 30, 140, 860, p2 === "flip" ? 100 : 190, c0, 4); }
      }
      var res = slit === "all" ? (p2 === "flip" ? "다시 흰빛이 되었다" : (p2 === "same" ? "더 넓게 펼쳐진 무지개" : "무지개 띠")) : (p2 === "none" ? CN[slit] + " 한 줄기" : CN[slit] + " 그대로 — 새 색이 생기지 않았다");
      text(ctx, "화면: " + res, 620, 262, { s: 13, w: "900", a: "center", c: (slit !== "all" && p2 !== "none") || (slit === "all" && p2 === "flip") ? v("--green-700") : v("--ink") });
    }
    function update() {
      draw();
      if (slit !== "all" && p2 !== "none" && got.cols.indexOf(slit) < 0) { got.cols.push(slit); window.sthState("cruxGot", got); }
      if (slit === "all" && p2 === "flip" && !got.rec) { got.rec = true; window.sthState("cruxGot", got); }
      put("b-crux-info", slit === "all"
        ? (p2 === "flip" ? "✅ 흩어진 모든 색을 뒤집은 프리즘에 모으자 다시 흰빛이 되었습니다. 흰빛은 여러 색이 섞인 것이에요." : (p2 === "same" ? "같은 방향의 프리즘을 한 번 더 지나 더 넓게 펼쳐졌습니다." : "첫 번째 프리즘이 흰빛을 무지개로 펼쳤습니다. 판자 구멍으로 색을 하나 골라 보세요."))
        : (p2 === "none" ? CN[slit] + "빛 한 줄기만 판자를 지났습니다. 두 번째 프리즘에 보내 보세요." : "✅ " + CN[slit] + "빛은 두 번째 프리즘에서 꺾이기만 하고 색은 그대로입니다. 유리가 색을 만든다면 새 색이 생겨야 했어요.")
        + " <span style='color:var(--mist)'>(골라 본 색: " + (got.cols.length ? got.cols.map(function (c) { return CN[c]; }).join(", ") : "없음") + ")</span>");
      mission();
    }
    function mission() {
      var a = got.cols.length >= 2;
      if (a) done("m2-3a"); if (got.rec) done("m2-3b"); if (got.q) done("m2-3c");
      if (a && got.rec && got.q && !ep.cleared(2)) {
        window.sthState("cruxBest", "한 가지 색은 두 번째 프리즘에서도 그대로, 모두 모으면 흰빛");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("cruxBest") + ". ‘유리가 색을 만든다’는 설명의 예측이 빗나가고, 뉴턴의 예측이 맞았습니다.");
        ep.clear(2);
      } else if (a && got.rec && got.q) window.sthMission("m2-3", true);
    }
    canvas._redraw = draw;
    segWire("b-slit", "data-v", function (x) { slit = x; update(); });
    segWire("b-p2", "data-v", function (x) { p2 = x; update(); });
    window.sthPick({
      mount: "b-crux-pick",
      q: "두 번째 프리즘 실험에서 끌어낼 수 있는 결론은?",
      options: ["프리즘의 유리가 흰빛에 색을 입힌다", "색은 흰빛 속에 원래 들어 있고, 프리즘은 색마다 다르게 꺾어 나눌 뿐이다", "빛은 프리즘을 지나면 사라진다"],
      answer: 1,
      why: ["그렇다면 한 가지 색도 두 번째 프리즘에서 또 다른 색으로 바뀌어야 했습니다.", "한 가지 색은 더 나뉘지 않고, 모두 모으면 흰빛으로 돌아옵니다. 가설이 예측한 두 결과가 모두 나왔어요.", "빛은 꺾일 뿐 사라지지 않았습니다."],
      onDone: function () { got.q = true; window.sthState("cruxGot", got); mission(); }
    });
    update();
  })();

  /* 장면 4 — 뉴턴의 실험 노트 */
  window.sthSort({
    mount: "b-sort",
    buckets: [{ id: "hyp", label: "💡 가설" }, { id: "pre", label: "🔮 예측" }, { id: "res", label: "🔬 결과" }, { id: "con", label: "✅ 결론" }],
    items: [
      { t: "(실험 전 추측) 흰빛 속에는 여러 색의 빛이 원래 섞여 있을 것이다", a: "hyp", why: "실험하기 전에 내놓은, 문제에 대한 잠정적인 답입니다." },
      { t: "(실험 전 추측) 색마다 유리에서 꺾이는 정도가 다를 것이다", a: "hyp", why: "색이 나뉘는 까닭에 대한 잠정적인 답입니다." },
      { t: "가설이 옳다면 한 가지 색만 두 번째 프리즘에 보내도 새 색이 생기지 않을 것이다", a: "pre", why: "가설에서 이끌어 낸, 시험할 수 있는 예측입니다." },
      { t: "가설이 옳다면 흩어진 빛을 다시 모을 때 흰빛이 될 것이다", a: "pre", why: "‘~라면 ~일 것이다’ 꼴의 예측입니다." },
      { t: "빨간빛은 두 번째 프리즘을 지나도 빨간색 그대로였다", a: "res", why: "실험에서 실제로 관찰한 것입니다." },
      { t: "뒤집은 프리즘을 지난 빛은 다시 흰색이 되었다", a: "res", why: "실험에서 관찰한 것입니다." },
      { t: "유리가 빛에 색을 입히는 것이 아니다", a: "con", why: "결과를 바탕으로 한 판단입니다.", hint: "관찰한 사실인가요, 관찰에서 내린 판단인가요?" },
      { t: "예측이 모두 맞았으므로, 흰빛은 여러 색의 빛이 섞인 것이라고 판단한다", a: "con", why: "결과를 보고 가설을 받아들인 판단입니다. 같은 생각도 실험 전에는 가설, 결과로 확인한 뒤에는 결론이에요." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>가설 → 예측 → 결과 → 결론. 예측과 결과가 맞으면 가설을 받아들이고, 어긋나면 고칩니다. 연역적 탐구의 뼈대예요."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("dispBest") || "") + " / " + (window.sthState("cruxBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 제안</b> " + (window.sthState("prism1") || "기록 없음") + "<br><b>빛 펼치기</b> " + (window.sthState("dispBest") || "-") + "<br><b>결정적 실험</b> " + (window.sthState("cruxBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험1 Ⅰ-4] 이야기 ② 두 번째 프리즘",
    items: [
      { id: "e2a", label: "결정적 실험이 된 까닭", hint: "두 번째 프리즘 실험에서 두 설명(유리가 색을 만든다 / 흰빛 속에 색이 있다)이 각각 무엇을 예측했는지 쓰고, 실제 결과로 어느 쪽을 받아들였는지 쓰세요.", ph: "유리가 색을 만든다면 … / 흰빛 속에 색이 있다면 … / 결과는 …" },
      { id: "e2b", label: "손전등으로 다시 해 보기", hint: "교실에서 손전등과 프리즘으로 이 실험을 재현한다면 무엇을 준비하고 어떻게 할지 간단히 계획을 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 추운 겨울의 반론
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "탐구 보고서 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "clim1", title: "기자의 첫 판단",
    question: "기후가 변하고 있는지 판단하려면 무엇을 봐야 할까요?",
    options: ["㉠ 올겨울 가장 추운 날의 기온", "㉡ 수십 년 동안의 평균 기온 자료와 그 추세", "㉢ 댓글의 좋아요 수", "㉣ 지난주 일기 예보"],
    onPick: function (i) { window.sthState("clim1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  function hash(i) { var x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }
  var Y0 = 1974, TMP = [];
  for (var y = 1974; y <= 2023; y++) TMP.push(+(12.3 + (y - 1974) * 0.028 + (hash(y - 1974) - 0.5) * 1.1).toFixed(2));
  var MEAN = TMP.reduce(function (s, t) { return s + t; }, 0) / TMP.length;
  function fit(a, b) {
    var n = b - a + 1, sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (var i = a; i <= b; i++) { sx += i; sy += TMP[i]; sxx += i * i; sxy += i * TMP[i]; }
    var m = (n * sxy - sx * sy) / (n * sxx - sx * sx); return { m: m, c: (sy - m * sx) / n };
  }

  /* 장면 2 — 구간 추세 */
  (function () {
    var canvas = $("c-c-tr"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, s = 1990, e = 2000;
    var got = window.sthState("trGot") || { a: false, b: false, q: false };
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 860, y0 = 20, y1 = 260;
      function X(i) { return x0 + i / 49 * (x1 - x0); }
      function Y(t) { return y1 - (t - 11.5) / 3 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [12, 13, 14].forEach(function (t) { text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [1974, 1984, 1994, 2004, 2014, 2023].forEach(function (yy) { text(ctx, yy, X(yy - Y0), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      var a = s - Y0, b = e - Y0;
      if (b > a) { ctx.fillStyle = A(v("--amber-700"), 0.12); ctx.fillRect(X(a), y0, X(b) - X(a), y1 - y0); }
      TMP.forEach(function (t, i) { dot(ctx, X(i), Y(t), 3.5, i >= a && i <= b ? v("--ink") : A(v("--mist"), 0.6)); });
      if (b - a >= 2) {
        var f = fit(a, b), neg = f.m < 0;
        seg(ctx, X(a), Y(f.m * a + f.c), X(b), Y(f.m * b + f.c), neg ? v("--brand") : v("--coral-700"), 3);
        text(ctx, "추세 " + (f.m * 10 >= 0 ? "+" : "") + (f.m * 10).toFixed(2) + " °C / 10년", 70, 36, { s: 14, w: "900", c: neg ? v("--brand-700") : v("--coral-700") });
        text(ctx, s + " ~ " + e + " (" + (b - a + 1) + "년)", 70, 58, { s: 12, w: "700", c: v("--mist") });
      } else text(ctx, "끝 연도가 시작보다 2년 이상 뒤여야 추세를 그릴 수 있어요", 70, 36, { s: 12.5, w: "800", c: v("--rose-700") });
    }
    function update() {
      draw();
      var a = s - Y0, b = e - Y0, msg;
      if (b - a < 2) msg = "구간이 너무 짧거나 거꾸로입니다.";
      else {
        var f = fit(a, b);
        if (b - a <= 9 && f.m < 0 && !got.a) { got.a = true; window.sthState("trGot", got); }
        if (a === 0 && b === 49 && !got.b) { got.b = true; window.sthState("trGot", got); }
        msg = s + " ~ " + e + "년의 추세는 10년에 " + (f.m * 10).toFixed(2) + " °C. "
          + (a === 0 && b === 49 ? "✅ 50년 전체로 보면 뚜렷하게 오르고 있습니다." : (b - a <= 9 && f.m < 0 ? "✅ 짧은 구간만 골라 보면 기온이 내려가는 것처럼 보입니다. 댓글이 본 것이 이런 ‘부분’이에요." : (b - a <= 9 ? "짧은 구간은 해마다의 오르내림에 크게 흔들립니다." : "")));
      }
      put("c-tr-info", msg);
      mission();
    }
    function mission() {
      if (got.a) done("m3-2a"); if (got.b) done("m3-2b"); if (got.q) done("m3-2c");
      if (got.a && got.b && got.q && !ep.cleared(1)) {
        window.sthState("trBest", "짧은 구간은 하강도 보이지만 50년 추세는 +0.29 °C / 10년");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("trBest") + ". 원하는 결론에 맞는 구간만 고르는 것을 ‘체리 피킹’이라고 합니다.");
        ep.clear(1);
      } else if (got.a && got.b && got.q) window.sthMission("m3-2", true);
    }
    canvas._redraw = draw;
    $("c-s").addEventListener("input", function (ev) { s = +ev.target.value; $("c-s-val").textContent = s; update(); });
    $("c-e").addEventListener("input", function (ev) { e = +ev.target.value; $("c-e-val").textContent = e; update(); });
    $("c-s-val").textContent = s; $("c-e-val").textContent = e;
    $("c-all").addEventListener("click", function () { s = 1974; e = 2023; $("c-s").value = s; $("c-e").value = e; $("c-s-val").textContent = s; $("c-e-val").textContent = e; update(); });
    window.sthPick({
      mount: "c-tr-pick",
      q: "이 자료에서 끌어낼 수 있는 가장 알맞은 결론은?",
      options: ["기온이 내려간 구간이 있으니 온난화는 거짓이다", "해마다 오르내림은 있지만, 50년 동안 10년에 약 0.3 °C 씩 오르는 경향이 뚜렷하다", "해마다 기온이 똑같이 조금씩 올랐다", "자료가 들쭉날쭉하니 아무 결론도 낼 수 없다"],
      answer: 1,
      why: ["짧은 구간의 하강은 해마다의 자연스러운 오르내림입니다. 전체 경향과 다릅니다.", "긴 기간의 추세선은 해마다의 오르내림을 넘어선 경향을 보여 줍니다. 기후는 이렇게 판단합니다.", "추웠던 해도 더웠던 해도 있습니다. ‘경향’이 오른 것이에요.", "들쭉날쭉한 자료도 충분히 길면 경향을 읽을 수 있습니다."],
      onDone: function () { got.q = true; window.sthState("trGot", got); mission(); }
    });
    update();
  })();

  /* 장면 3 — 세 가지 표상 */
  (function () {
    var canvas = $("c-c-rep"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, rep = "pts";
    var got = window.sthState("repGot") || { seen: [], q: false };
    if (!got.seen) got.seen = [];
    var DEC = [0, 1, 2, 3, 4].map(function (d) { var sum = 0; for (var k = 0; k < 10; k++) sum += TMP[d * 10 + k]; return sum / 10; });
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 860, y0 = 20, y1 = 240;
      if (rep === "str") {
        var bw = (x1 - x0) / 50;
        TMP.forEach(function (t, i) {
          var d = Math.max(-1, Math.min(1, (t - MEAN) / 0.9));
          var col = d < 0 ? "rgb(" + Math.round(255 + d * 200) + "," + Math.round(255 + d * 130) + ",255)" : "rgb(255," + Math.round(255 - d * 190) + "," + Math.round(255 - d * 210) + ")";
          ctx.fillStyle = col; ctx.fillRect(x0 + i * bw, y0, bw + 0.5, y1 - y0);
        });
        [1974, 1984, 1994, 2004, 2014, 2023].forEach(function (yy) { text(ctx, yy, x0 + (yy - Y0 + 0.5) * bw, y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
        text(ctx, "파랑 = 50년 평균보다 추운 해 · 빨강 = 더운 해", x0, y1 + 34, { s: 11, w: "700", c: v("--mist") });
        return;
      }
      function Y(t) { return y1 - (t - 11.5) / 3 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [12, 13, 14].forEach(function (t) { text(ctx, t + "°C", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      if (rep === "pts") {
        function X(i) { return x0 + i / 49 * (x1 - x0); }
        TMP.forEach(function (t, i) { dot(ctx, X(i), Y(t), 3.5, v("--ink")); });
        var f = fit(0, 49); seg(ctx, X(0), Y(f.c), X(49), Y(f.m * 49 + f.c), v("--coral-700"), 3);
        [1974, 1984, 1994, 2004, 2014, 2023].forEach(function (yy) { text(ctx, yy, X(yy - Y0), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      } else {
        var names = ["1974~83", "1984~93", "1994~2003", "2004~13", "2014~23"], w = (x1 - x0) / 5;
        DEC.forEach(function (m, d) {
          ctx.fillStyle = A(v("--coral-700"), 0.35 + d * 0.13); ctx.fillRect(x0 + d * w + w * 0.2, Y(m), w * 0.6, y1 - Y(m));
          text(ctx, m.toFixed(2) + "°C", x0 + d * w + w / 2, Y(m) - 6, { s: 11.5, w: "800", a: "center" });
          text(ctx, names[d], x0 + d * w + w / 2, y1 + 16, { s: 10, a: "center", c: v("--mist") });
        });
        text(ctx, "※ 세로축은 11.5 °C 에서 시작", x1, y0 + 4, { s: 10, a: "right", c: v("--mist") });
      }
    }
    var MSG = {
      pts: "<b>연도별 점과 추세선</b> — 해마다의 오르내림과 전체 경향을 함께 볼 수 있습니다. 과학자들이 분석할 때 주로 씁니다.",
      dec: "<b>10년 평균 막대</b> — 해마다의 들쭉날쭉함을 평균으로 눌러, 시대별 차이를 숫자로 비교하기 좋습니다.",
      str: "<b>기후 줄무늬</b> — 숫자 없이 색만으로 ‘점점 빨개진다’는 흐름을 한눈에 전합니다. 포스터나 캠페인에 쓰기 좋아요."
    };
    function update() {
      if (got.seen.indexOf(rep) < 0) { got.seen.push(rep); window.sthState("repGot", got); }
      draw();
      put("c-rep-info", MSG[rep] + (got.seen.length >= 3 ? " ✅ 세 가지 모두 그려 보았습니다." : " <span style='color:var(--mist)'>(" + got.seen.length + " / 3)</span>"));
      mission();
    }
    function mission() {
      if (got.seen.length >= 3) done("m3-3a"); if (got.q) done("m3-3b");
      if (got.seen.length >= 3 && got.q && !ep.cleared(2)) {
        window.sthState("repBest", "10년 평균: 1974~83년 12.5 °C → 2014~23년 13.6 °C (약 1.1 °C 상승)");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("repBest") + ". 같은 자료라도 누구에게 무엇을 전할지에 따라 알맞은 표상이 다릅니다.");
        ep.clear(2);
      } else if (got.seen.length >= 3 && got.q) window.sthMission("m3-3", true);
    }
    canvas._redraw = draw;
    segWire("c-rep", "data-v", function (x) { rep = x; update(); });
    window.sthPick({
      mount: "c-rep-pick",
      q: "10년 평균 막대에서 1974 ~ 83년과 2014 ~ 23년의 평균 기온 차이는 대략 얼마일까요?",
      options: ["약 0.3 °C", "약 1.1 °C", "약 3 °C", "약 11 °C"],
      answer: 1,
      why: ["10년마다의 상승률에 가깝습니다. 40년 차이를 보세요.", "13.61 − 12.52 ≈ 1.1 °C. 평균을 내면 해마다의 들쭉날쭉함이 줄어 차이가 분명해집니다.", "그렇게까지 크지는 않습니다.", "막대의 높이 전체가 아니라 차이를 읽어야 해요."],
      onDone: function () { got.q = true; window.sthState("repGot", got); mission(); }
    });
    update();
  })();

  /* 장면 4 — 정량적 / 정성적 자료 */
  window.sthSort({
    mount: "c-sort",
    buckets: [{ id: "qn", label: "🔢 정량적 자료", sub: "숫자로 잰 것" }, { id: "ql", label: "💬 정성적 자료", sub: "말·그림·특징" }],
    items: [
      { t: "2023년 한반도 연평균 기온 13.7 °C", a: "qn", why: "온도계로 잰 숫자입니다." },
      { t: "서울의 연 강수량 1400 mm", a: "qn", why: "측우기(우량계)로 잰 숫자입니다." },
      { t: "벚꽃 개화일이 50년 동안 약 10일 빨라졌다", a: "qn", why: "날짜를 세어 잰 값입니다.", hint: "숫자로 나타낼 수 있나요?" },
      { t: "여름철 폭염 일수 한 해 16일", a: "qn", why: "하루 최고 기온 33 °C 이상인 날을 센 값입니다." },
      { t: "할머니의 “예전에는 겨울마다 강이 꽁꽁 얼었다”는 기억", a: "ql", why: "경험을 말로 나타낸 자료입니다." },
      { t: "제주 농가의 “귤 대신 망고를 심기 시작했다”는 인터뷰", a: "ql", why: "변화를 말로 전한 자료입니다." },
      { t: "“요즘 단풍 색이 칙칙해졌다”는 관찰 기록", a: "ql", why: "특징을 말로 나타냈습니다." },
      { t: "바닷가 마을 사진 속 모래사장이 좁아진 모습", a: "ql", why: "그림(사진)으로 나타낸 자료입니다." }
    ],
    onDone: function () { window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>정량적 자료는 비교와 계산에, 정성적 자료는 변화의 모습과 의미를 전하는 데 강합니다. 좋은 기사는 둘을 함께 씁니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m3-4", true);

  function finish() { window.sthState("r3", "완성 · " + (window.sthState("trBest") || "") + " / " + (window.sthState("repBest") || "")); }
  function vs() {
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("clim1") || "기록 없음") + "<br><b>구간과 추세</b> " + (window.sthState("trBest") || "-") + "<br><b>세 가지 그림</b> " + (window.sthState("repBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[과학탐구실험1 Ⅰ-4] 이야기 ③ 추운 겨울의 반론",
    items: [
      { id: "e3a", label: "댓글에 다는 답글", hint: "‘올겨울이 추우니 온난화는 거짓’이라는 댓글에, 이 장면의 자료 분석을 근거로 두세 문장의 답글을 쓰세요." },
      { id: "e3b", label: "내가 고른 그림과 까닭", hint: "학교 신문 기사에 세 가지 그림 가운데 무엇을 넣을지 고르고, 읽는 사람을 생각해 그 까닭을 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 마늘 대 세균
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "탐구 보고서 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "coop1", title: "부원의 첫 제안",
    question: "생명과학 동아리와 화학 동아리가 잘 협력하려면 무엇부터 정해야 할까요?",
    options: ["㉠ 목소리가 큰 쪽의 방식대로 한다", "㉡ 함께 풀 연구 질문과 역할 분담, 같은 실험 설계를 먼저 정한다", "㉢ 각자 따로 실험하고 결과만 합친다", "㉣ 선생님께 모두 맡긴다"],
    onPick: function (i) { window.sthState("coop1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 디스크 확산법 */
  (function () {
    var canvas = $("d-c-disk"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, plant = "garlic", conc = 30, hrs = 12;
    var got = window.sthState("diskGot") || { ctrl: false, sets: {}, b: false };
    if (!got.sets) got.sets = {};
    var EFF = { garlic: 1.0, cypress: 0.7, tea: 0.5, control: 0 };
    var NM = { garlic: "마늘", cypress: "편백", tea: "녹차", control: "대조군" };
    function zone(p, c, t) { return 6 + 18 * EFF[p] * Math.sqrt(c / 100) * Math.min(1, t / 24); }
    function hash(i) { var x = Math.sin(i * 78.233) * 43758.5453; return x - Math.floor(x); }
    function draw() {
      paper(ctx, W, H);
      var cx = 180, cy = 150, R = 125, z = zone(plant, conc, hrs), rz = z / 2 / 45 * R;
      ctx.fillStyle = A("#f4e6b0", 0.9); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 2; ctx.stroke();
      var dens = Math.min(1, hrs / 24);
      for (var i = 0; i < Math.round(700 * dens); i++) {
        var ang = hash(i) * Math.PI * 2, rr = Math.sqrt(hash(i + 500)) * (R - 6), x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
        if (rr > rz) dot(ctx, x, y, 1.2, A("#9a7b2c", 0.8));
      }
      if (z > 6.05) { ctx.strokeStyle = A(v("--brand"), 0.6); ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, rz, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }
      dot(ctx, cx, cy, 6 / 2 / 45 * R, "#ffffff"); ctx.strokeStyle = v("--ink"); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 6 / 2 / 45 * R, 0, Math.PI * 2); ctx.stroke();
      text(ctx, NM[plant] + " · " + (plant === "control" ? "에탄올만" : conc + "%") + " · " + hrs + "시간", 360, 40, { s: 14, w: "900" });
      text(ctx, "억제대 지름 " + z.toFixed(1) + " mm" + (z <= 6.05 ? " (디스크만 — 억제대 없음)" : ""), 360, 70, { s: 14, w: "800", c: z > 6.05 ? v("--brand-700") : v("--mist") });
      /* 같은 조건 기록표 */
      var key = conc + "|" + hrs, rec = got.sets[key] || {};
      text(ctx, "같은 조건(" + conc + "% · " + hrs + "시간)의 기록", 360, 120, { s: 12, w: "800", c: v("--mist") });
      ["garlic", "cypress", "tea", "control"].forEach(function (p, k) {
        var y = 146 + k * 30, val = rec[p];
        text(ctx, NM[p], 370, y, { s: 12.5, w: "800" });
        if (val != null) { ctx.fillStyle = A(v(p === "control" ? "--mist" : "--brand"), 0.6); ctx.fillRect(440, y - 12, (val - 6) * 14 + 3, 14); text(ctx, val.toFixed(1) + " mm", 450 + (val - 6) * 14, y, { s: 11.5, w: "800" }); }
        else text(ctx, "—", 440, y, { s: 12, c: v("--mist") });
      });
    }
    function update() {
      var z = zone(plant, conc, hrs), key = conc + "|" + hrs;
      if (hrs >= 12) { got.sets[key] = got.sets[key] || {}; got.sets[key][plant] = z; }
      if (plant === "control" && hrs >= 24) got.ctrl = true;
      if (!got.b) for (var k in got.sets) { var p = k.split("|"), r = got.sets[k]; if (+p[0] >= 50 && +p[1] >= 24 && r.garlic != null && r.cypress != null && r.tea != null) got.b = true; }
      window.sthState("diskGot", got);
      draw();
      put("d-disk-info", NM[plant] + (plant === "control" ? "(에탄올만 적신 디스크)" : " 추출물 " + conc + "%") + ", " + hrs + "시간 배양: 억제대 지름 " + z.toFixed(1) + " mm. "
        + (plant === "control" ? (hrs >= 24 ? "✅ 대조군에는 억제대가 없습니다. 억제대는 에탄올이 아니라 추출물 때문이에요." : "세균이 충분히 자라도록 24시간 이상 배양해 확인하세요.") : (hrs < 24 ? "배양 시간이 짧아 세균이 아직 덜 자랐습니다." : (conc < 50 ? "농도를 50% 이상으로 해 비교해 보세요." : "같은 조건에서 다른 추출물도 재어 보세요.")))
        + (got.b ? " ✅ 세 추출물을 같은 조건에서 비교했습니다: 마늘 > 편백 > 녹차." : ""));
      mission();
    }
    function mission() {
      if (got.ctrl) done("m4-2a"); if (got.b) done("m4-2b");
      if (got.ctrl && got.b && !ep.cleared(1)) {
        window.sthState("diskBest", "같은 조건에서 억제대 마늘 > 편백 > 녹차, 대조군은 없음");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("diskBest") + ". 추출물 종류만 다르게, 농도·시간은 같게 한 비교였습니다.");
        ep.clear(1);
      } else if (got.ctrl && got.b) window.sthMission("m4-2", true);
    }
    canvas._redraw = draw;
    segWire("d-plant", "data-v", function (x) { plant = x; update(); });
    $("d-c").addEventListener("input", function (ev) { conc = +ev.target.value; $("d-c-val").textContent = conc + "%"; update(); });
    $("d-t").addEventListener("input", function (ev) { hrs = +ev.target.value; $("d-t-val").textContent = hrs + "시간"; update(); });
    update();
  })();

  /* 장면 3 — BTB 마술 */
  (function () {
    var canvas = $("d-c-btb"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var got = window.sthState("btbGot") || { seen: [], q: false };
    if (!got.seen) got.seen = [];
    var ph = 7.0;
    function colr() { return ph < 6 ? "y" : (ph <= 7.6 ? "g" : "b"); }
    var CC = { y: "#f2d024", g: "#39a845", b: "#2f6fd6" }, CN = { y: "노랑 (산성)", g: "초록 (중성)", b: "파랑 (염기성)" };
    function draw() {
      paper(ctx, W, H);
      var cx = 200, by = 230;
      ctx.fillStyle = A(CC[colr()], 0.85); ctx.beginPath(); ctx.moveTo(cx - 70, by - 120); ctx.lineTo(cx - 60, by); ctx.lineTo(cx + 60, by); ctx.lineTo(cx + 70, by - 120); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = v("--ink"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 78, by - 170); ctx.lineTo(cx - 60, by); ctx.lineTo(cx + 60, by); ctx.lineTo(cx + 78, by - 170); ctx.stroke();
      text(ctx, "pH " + ph.toFixed(1), cx, by + 22, { s: 13, w: "900", a: "center" });
      var x0 = 420, x1 = 860, y = 90;
      for (var p = 4; p <= 10; p += 0.1) { var c = p < 6 ? CC.y : (p <= 7.6 ? CC.g : CC.b); ctx.fillStyle = c; ctx.fillRect(x0 + (p - 4) / 6 * (x1 - x0), y, (x1 - x0) / 60 + 1, 22); }
      [4, 6, 7, 8, 10].forEach(function (p) { text(ctx, p, x0 + (p - 4) / 6 * (x1 - x0), y + 40, { s: 10.5, a: "center", c: v("--mist") }); });
      seg(ctx, x0 + (ph - 4) / 6 * (x1 - x0), y - 10, x0 + (ph - 4) / 6 * (x1 - x0), y + 30, v("--ink"), 3);
      text(ctx, "지금 색: " + CN[colr()], x0, 50, { s: 15, w: "900", c: CC[colr()] });
      text(ctx, "보여 준 색: " + (got.seen.length ? got.seen.map(function (k) { return CN[k].split(" ")[0]; }).join(" → ") : "-"), x0, 170, { s: 13, w: "800" });
    }
    function update() {
      var c = colr();
      if (got.seen.indexOf(c) < 0) { got.seen.push(c); window.sthState("btbGot", got); }
      draw();
      put("d-btb-info", "용액이 " + CN[colr()] + " 입니다. " + (got.seen.length >= 3 ? "✅ 노랑·초록·파랑을 모두 보여 주었습니다. 관객들이 박수를 칩니다!" : "아직 보여 주지 않은 색이 있어요."));
      mission();
    }
    function mission() {
      if (got.seen.length >= 3) done("m4-3a"); if (got.q) done("m4-3b");
      if (got.seen.length >= 3 && got.q && !ep.cleared(2)) {
        window.sthState("btbBest", "숨(CO₂)으로 노랑, 베이킹소다로 파랑");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("btbBest") + ". 마술 같은 색 변화도 원리를 알면 탐구 주제가 됩니다.");
        ep.clear(2);
      } else if (got.seen.length >= 3 && got.q) window.sthMission("m4-3", true);
    }
    canvas._redraw = draw;
    $("d-breath").addEventListener("click", function () { ph = Math.max(4.0, +(ph - 1.5).toFixed(1)); update(); });
    $("d-soda").addEventListener("click", function () { ph = Math.min(10.0, +(ph + 2.0).toFixed(1)); update(); });
    $("d-reset").addEventListener("click", function () { ph = 7.0; update(); });
    window.sthPick({
      mount: "d-btb-pick",
      q: "숨을 불어넣으면 초록 BTB 용액이 노랗게 변하는 까닭은?",
      options: ["숨이 따뜻해서 용액이 데워지기 때문에", "날숨의 이산화 탄소가 물에 녹아 탄산이 되어 용액이 산성으로 바뀌기 때문에", "숨 속의 산소가 BTB를 태우기 때문에"],
      answer: 1,
      why: ["온도 때문이 아닙니다. 식은 날숨을 넣어도 같아요.", "BTB 는 용액의 산성·염기성(pH)에 따라 색이 바뀌는 지시약입니다. 이산화 탄소 → 탄산 → 산성 → 노랑.", "산소는 BTB 의 색을 바꾸지 않습니다."],
      onDone: function () { got.q = true; window.sthState("btbGot", got); mission(); }
    });
    update();
  })();

  /* 장면 4 — 협력 탐구의 순서 */
  (function () {
    var STEPS = [
      "두 동아리가 함께 연구 질문 정하기 — 우리 주변 식물에도 항생물질이 있을까?",
      "역할 나누기 — 화학 동아리는 추출물, 생명과학 동아리는 세균 배양",
      "실험 설계 공유하기 — 농도·배양 시간을 같게, 대조군(에탄올) 두기",
      "실험하고 결과를 공동 기록표에 적기",
      "서로의 자료를 검토하고, 이상한 값은 다시 실험하기",
      "과학 축제에서 발표하고 관객의 질문에 답하기"
    ];
    function ok() { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>역할은 나누되 설계와 자료는 함께. 서로의 결과를 검토하는 과정이 탐구를 믿을 만하게 만듭니다."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("d-order", STEPS); window.sthMission("m4-4", true); }
    else window.sthOrder({ mount: "d-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r4", "완성 · " + (window.sthState("diskBest") || "") + " / " + (window.sthState("btbBest") || "")); }
  function vs() {
    $("e4-vs").innerHTML = "<b>나의 첫 제안</b> " + (window.sthState("coop1") || "기록 없음") + "<br><b>디스크 확산법</b> " + (window.sthState("diskBest") || "-") + "<br><b>과학 마술</b> " + (window.sthState("btbBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[과학탐구실험1 Ⅰ-4] 이야기 ④ 마늘 대 세균",
    items: [
      { id: "e4a", label: "대조군이 필요한 까닭", hint: "에탄올만 적신 디스크를 함께 두지 않았다면 어떤 문제가 생겼을지 한두 문장으로 쓰세요." },
      { id: "e4b", label: "우리 반 협력 탐구 계획", hint: "다른 분야의 친구와 함께 해 보고 싶은 탐구 주제를 하나 정하고, 누가 무엇을 맡을지 적어 보세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험1 Ⅰ-4] 과학 탐구의 과정과 절차 — 정리",
  recap: [
    { key: "r1", label: "① 목이 휜 플라스크" },
    { key: "r2", label: "② 두 번째 프리즘" },
    { key: "r3", label: "③ 추운 겨울의 반론" },
    { key: "r4", label: "④ 마늘 대 세균" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 보고서를 꿰는 한 문장", hint: "플라스크, 프리즘, 기온 자료, 억제대. 네 이야기를 ‘가설’, ‘자료’, ‘협력’ 가운데 두 말 이상을 넣어 한 문장으로 이어 보세요." },
    { id: "w1", label: "귀납과 연역이 갈리는 지점", hint: "이 단원의 탐구 하나를 골라, 그것이 귀납적 탐구인지 연역적 탐구인지 판단하고 근거를 쓰세요.", ph: "내가 고른 탐구: …  /  판단: …  /  근거: …" },
    { id: "w4", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "gt1-1-4", unitLabel: "[과학탐구실험1 Ⅰ-4] 과학 탐구의 과정과 절차",
  rows: [
    { key: "r1", label: "① 목이 휜 플라스크" },
    { key: "r2", label: "② 두 번째 프리즘" },
    { key: "r3", label: "③ 추운 겨울의 반론" },
    { key: "r4", label: "④ 마늘 대 세균" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 보고서를 꿰는 한 문장" }
});

})();
