/* 과학탐구실험1 Ⅰ-1 과학의 본성과 역사 속의 과학 탐구 — 이야기 두 편
   01 빛보다 빠른 중성미자 / 02 보름달 금성
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("gt1-1-1");

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
   이야기 ① 빛보다 빠른 중성미자
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "nature1", title: "기자의 첫 판단",
    question: "‘빛보다 빠른 입자’ 발표를 들은 과학자들이 가장 먼저 해야 할 일은 무엇일까요?",
    options: ["㉠ 유명한 연구소의 발표이니 교과서를 고친다", "㉡ 다른 연구팀이 같은 측정을 되풀이하고, 측정 과정의 오류를 찾아본다", "㉢ 상대성 이론은 확실하므로 발표를 무시한다", "㉣ 과학자들이 투표로 정한다"],
    onPick: function (i) { window.sthState("nature1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 60 나노초의 수수께끼 */
  (function () {
    var canvas = $("a-c-nu"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, e = 0;
    var got = window.sthState("nuGot") || { a: false, q: false };
    var L = 730, C = 299792.458, TL = L / C * 1e9, EARLY = 60;   // 빛이 걸리는 시간(ns)
    function ratio() { var tn = TL - EARLY + e; return TL / tn; }   // v/c
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 830, y = 70;
      text(ctx, "CERN (스위스)", x0, y - 24, { s: 12, w: "800" });
      text(ctx, "그란사소 (이탈리아)", x1, y - 24, { s: 12, w: "800", a: "right" });
      text(ctx, "730 km", (x0 + x1) / 2, y - 24, { s: 11.5, w: "700", a: "center", c: v("--mist") });
      seg(ctx, x0, y, x1, y, v("--line"), 3);
      dot(ctx, x0, y, 7, v("--ink")); dot(ctx, x1, y, 7, v("--ink"));
      // 도착 시각 비교 (확대 눈금: 결승선 근처 ±100 ns)
      var bx0 = 140, bx1 = 760, by = 150;
      function X(ns) { return bx0 + (ns + 100) / 200 * (bx1 - bx0); }
      text(ctx, "결승선 근처를 1억 배 확대 (빛의 도착 = 0 ns)", bx0, by - 30, { s: 11.5, w: "700", c: v("--mist") });
      seg(ctx, bx0, by, bx1, by, v("--line"), 1.5);
      [-100, -50, 0, 50, 100].forEach(function (t) {
        seg(ctx, X(t), by - 5, X(t), by + 5, v("--line"), 1.5);
        text(ctx, (t > 0 ? "+" : "") + t + " ns", X(t), by + 20, { s: 10.5, a: "center", c: v("--mist") });
      });
      seg(ctx, X(0), by - 22, X(0), by + 8, v("--amber-700"), 2.5, true);
      text(ctx, "빛", X(0), by - 26, { s: 12, w: "800", a: "center", c: v("--amber-700") });
      var nuT = -EARLY + e, fast = nuT < -0.5;
      dot(ctx, X(nuT), by, 9, fast ? v("--coral-700") : v("--green-700"));
      text(ctx, "중성미자", X(nuT), by + 40, { s: 12, w: "800", a: "center", c: fast ? v("--coral-700") : v("--green-700") });
      if (e > 0) {
        ctx.save(); ctx.strokeStyle = v("--brand"); ctx.fillStyle = v("--brand"); ctx.lineWidth = 2;
        window.drawArrow(ctx, X(-EARLY), by + 58, X(nuT), by + 58, 8); ctx.restore();
        text(ctx, "장비 오차 " + e + " ns 를 바로잡으면", (X(-EARLY) + X(nuT)) / 2, by + 76, { s: 11, w: "700", a: "center", c: v("--brand-700") });
      }
      var r = ratio(), ex = (r - 1) * 1e5;
      text(ctx, "속력 ÷ 빛의 속력 = " + r.toFixed(7), 70, 262, { s: 13.5, w: "900", c: Math.abs(ex) < 0.05 ? v("--green-700") : v("--ink") });
      text(ctx, "빛과 60 ns 차이 = 거리로 약 18 m", 520, 262, { s: 12, w: "700", c: v("--mist") });
      return e === EARLY;
    }
    function update() {
      var ok = draw(), r = ratio();
      put("a-nu-info", "빛은 730 km 를 약 " + (TL / 1e6).toFixed(3) + " ms 에 갑니다. 장비 오차를 " + e + " ns 로 바로잡으면 중성미자는 빛보다 "
        + (Math.abs(EARLY - e) < 1 ? "빠르지도 느리지도 않습니다" : ((EARLY - e) > 0 ? (EARLY - e) + " ns 먼저 도착합니다" : (e - EARLY) + " ns 늦게 도착합니다"))
        + " (속력 비 " + r.toFixed(7) + "). " + (ok ? "✅ 시계가 60 나노초만 어긋나도 ‘빛보다 빠른’ 결과가 나옵니다." : "속력 비가 정확히 1 이 되는 오차를 찾아보세요."));
      if (ok && !got.a) { got.a = true; window.sthState("nuGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("nuBest", "장비 오차 60 ns 면 속력 비 1 (빛과 같다)");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("nuBest") + ". 2.4 밀리초 중 60 나노초, 4만분의 1 도 안 되는 오차가 결론을 뒤집을 수 있습니다. 그래서 과학자들은 결과를 다른 이들에게 검증받습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("a-e").addEventListener("input", function (ev) { e = +ev.target.value; $("a-e-val").textContent = e + " ns"; update(); });
    window.sthPick({
      mount: "a-nu-pick",
      q: "연구팀이 결과를 발표하면서 다른 과학자들에게 검토와 재측정을 요청한 가장 중요한 까닭은?",
      options: ["자기 팀의 실력을 자랑하려고", "스스로 찾지 못한 오류가 있을 수 있어, 독립적인 확인을 거쳐야 과학 지식으로 인정받을 수 있기 때문에", "상대성 이론이 틀렸다는 것을 이미 확신했기 때문에"],
      answer: 1,
      why: ["자랑이 목적이었다면 검토를 요청하지 않았겠지요.", "과학 지식은 한 팀의 주장만으로 확정되지 않습니다. 다른 과학자들의 검토와 재현을 거치는 사회적 합의 과정이 필요합니다.", "연구팀도 오류를 찾지 못했을 뿐 확신하지 않았습니다. 그래서 검토를 부탁했지요."],
      onDone: function () { got.q = true; window.sthState("nuGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 동료 검토 시뮬레이터 */
  (function () {
    var canvas = $("a-c-pr"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 1;
    var got = window.sthState("prGot") || { a: false, q: false };
    var P_MISS = 0.7;
    function P(k) { return 1 - Math.pow(P_MISS, k); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 560, y0 = 30, y1 = 220;
      function X(k) { return x0 + (k - 0.5) / 20 * (x1 - x0); }
      function Y(p) { return y1 - p * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      text(ctx, "적어도 한 명이 오류를 찾을 확률", x0 + 6, y0 - 12, { s: 11, w: "700", c: v("--mist") });
      [0, 0.5, 1].forEach(function (p) { text(ctx, (p * 100) + "%", x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      seg(ctx, x0, Y(0.95), x1, Y(0.95), v("--amber-700"), 1.5, true);
      text(ctx, "95%", x1 + 4, Y(0.95) + 4, { s: 10.5, w: "800", c: v("--amber-700") });
      for (var k = 1; k <= 20; k++) {
        var bw = (x1 - x0) / 20 * 0.7, on = k === n;
        ctx.fillStyle = on ? v("--brand") : (k <= n ? A(v("--brand"), 0.35) : A(v("--mist"), 0.2));
        ctx.fillRect(X(k) - bw / 2, Y(P(k)), bw, y1 - Y(P(k)));
        if (k % 5 === 0 || k === 1) text(ctx, k + "명", X(k), y1 + 16, { s: 10, a: "center", c: v("--mist") });
      }
      // 오른쪽: 검토자 얼굴
      var gx = 610, gy = 50;
      text(ctx, "검토자 " + n + "명", gx, gy - 12, { s: 14, w: "900" });
      for (var i = 0; i < n; i++) {
        var cx = gx + 14 + (i % 5) * 50, cy = gy + 20 + Math.floor(i / 5) * 36;
        dot(ctx, cx, cy, 12, A(v("--teal"), 0.75));
        text(ctx, "🧑‍🔬", cx, cy + 5, { s: 14, a: "center" });
      }
      var p = P(n), ok = p >= 0.95;
      text(ctx, "찾을 확률 " + (p * 100).toFixed(1) + "%", gx, 222, { s: 15, w: "900", c: ok ? v("--green-700") : v("--ink") });
      text(ctx, "놓칠 확률 0.7의 " + n + "제곱 = " + (Math.pow(P_MISS, n) * 100).toFixed(1) + "%", gx, 244, { s: 11.5, w: "700", c: v("--mist") });
      return ok && !(P(n - 1) >= 0.95);
    }
    function update() {
      var ok = draw();
      put("a-pr-info", "검토자 " + n + "명이 따로 검토하면 오류를 적어도 한 명이 찾을 확률은 1 − 0.7<sup>" + n + "</sup> = " + (P(n) * 100).toFixed(1) + "% 입니다. "
        + (ok ? "✅ 95% 를 넘기는 가장 적은 수입니다. 한 사람은 30% 밖에 못 찾아도, 여럿이 독립적으로 보면 오류가 걸러집니다." : (P(n) >= 0.95 ? "95% 는 넘었지만 더 적은 수로도 됩니다." : "아직 95% 에 못 미칩니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("prGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.q) done("m1-3b");
      if (got.a && got.q) {
        window.sthState("prBest", "검토자 9명 → 오류 발견 96%");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("prBest") + ". 과학 지식은 개인의 천재성보다 공동체의 비판과 검증을 통해 믿을 만해집니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("a-pr-n").addEventListener("input", function (ev) { n = +ev.target.value; $("a-pr-n-val").textContent = n; update(); });
    window.sthPick({
      mount: "a-pr-pick",
      q: "검토자가 5명이면 오류를 적어도 한 명이 찾을 확률은 대략 얼마일까요? (0.7⁵ ≈ 0.17)",
      options: ["약 30%", "약 50%", "약 83%", "100%"],
      answer: 2,
      why: ["한 명일 때의 확률입니다.", "두 명일 때(51%)에 가깝습니다.", "1 − 0.7⁵ = 1 − 0.168 ≈ 0.83, 약 83% 입니다.", "검토자가 아무리 많아도 놓칠 확률은 0 이 되지 않습니다. 과학 지식이 잠정적인 까닭 하나입니다."],
      onDone: function () { got.q = true; window.sthState("prGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 4 — 과학의 본성 분류 */
  window.sthSort({
    mount: "a-sort",
    buckets: [{ id: "emp", label: "🔬 경험적 증거에 기초", sub: "관찰·측정한 자료가 판단의 근거" }, { id: "ten", label: "⏳ 잠정적 지식", sub: "새 증거가 나오면 고쳐질 수 있다" }, { id: "soc", label: "👥 사회적 합의 과정", sub: "검토·재현을 거쳐 인정받는다" }, { id: "div", label: "🧭 다양한 탐구 방법", sub: "관찰·실험·모형·계산 등" }],
    items: [
      { t: "연구팀은 1만 6천 번 넘는 중성미자 도착 시각을 측정해 결론을 냈다", a: "emp", why: "주장의 근거는 측정 자료입니다." },
      { t: "상대성 이론이 틀렸는지는 누가 더 유명한지가 아니라 측정값으로 가려야 한다", a: "emp", why: "권위가 아니라 증거가 판단 기준입니다." },
      { t: "상대성 이론도 언젠가 더 나은 이론으로 바뀔 가능성이 있다", a: "ten", why: "과학 지식은 늘 고쳐질 수 있는 상태로 남습니다." },
      { t: "‘빛보다 빠르다’던 결론은 케이블 문제가 밝혀지자 철회되었다", a: "ten", why: "새 증거가 나오자 결론이 바뀌었습니다.", hint: "결론이 어떻게 되었나요?" },
      { t: "연구팀은 다른 과학자들에게 결과를 검토해 달라고 요청했다", a: "soc", why: "공동체의 비판과 검토를 거칩니다." },
      { t: "ICARUS 팀이 같은 경로로 독립적인 측정을 해 결과를 확인했다", a: "soc", why: "다른 팀의 재현이 있어야 인정받습니다." },
      { t: "연구팀은 중성미자 빔을 아주 짧은 묶음으로 바꾸는 다른 측정 방식으로도 다시 재어 보았다", a: "div", why: "같은 질문을 다른 측정 방법으로 다시 확인했습니다." },
      { t: "이론 물리학자들은 계산으로, 실험가들은 새 장비로 같은 문제를 파고들었다", a: "div", why: "계산과 실험, 서로 다른 방법으로 탐구합니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>증거에 기초하고, 고쳐질 수 있으며, 공동체의 검증을 거치고, 여러 방법으로 탐구한다. 한 사건에 과학의 본성 네 가지가 모두 들어 있습니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("nuBest") || "") + " / " + (window.sthState("prBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("nature1") || "기록 없음") + "<br><b>60 나노초</b> " + (window.sthState("nuBest") || "-") + "<br><b>동료 검토</b> " + (window.sthState("prBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험1 Ⅰ-1] 이야기 ① 빛보다 빠른 중성미자",
    items: [
      { id: "w2", label: "과학의 본성 한 가지", hint: "중성미자 사건에서 가장 잘 드러난 과학의 본성 하나를 골라, 사건 속 장면을 근거로 설명하세요.", ph: "고른 본성: (       ) / 근거가 된 장면: …" },
      { id: "e1a", label: "내가 기자라면 쓸 제목", hint: "2011년 발표 당일 신문에 실을 제목을, 과학의 본성을 지키는 방향으로 다시 지어 보고 그 까닭을 한 문장으로 덧붙이세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 보름달 금성
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "para1", title: "해설사의 첫 답",
    question: "과학의 역사에서 세계를 보는 틀(패러다임)이 바뀐 가장 큰 원동력은 무엇이었을까요?",
    options: ["㉠ 왕이나 교회 같은 권력의 명령", "㉡ 기존 설명으로는 풀리지 않는 관측·실험 결과가 쌓인 것", "㉢ 유행이 바뀌어 사람들이 새로운 생각을 좋아하게 된 것", "㉣ 우연히 떠오른 한 사람의 영감"],
    onPick: function (i) { window.sthState("para1OK", i === 1 ? "맞음" : "어긋남"); ep.clear(0); }
  });

  /* 장면 2 — 금성의 위상 */
  (function () {
    var canvas = $("b-c-ven"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, model = "p", t = 60;
    var got = window.sthState("venGot") || { a: false, q: false };
    var SYN = 584;
    function pos() {
      var th = 2 * Math.PI * t / SYN;
      if (model === "h") {
        // 지구 고정 좌표에서 태양 둘레 금성(0.723 AU)의 상대 운동
        return { s: { x: 0, y: 0 }, e: { x: 1, y: 0 }, p: { x: 0.723 * Math.cos(th), y: 0.723 * Math.sin(th) } };
      }
      // 천동설: 주전원 중심(0.4, 0), 반지름 0.25 — 늘 지구와 태양 사이
      return { s: { x: 0, y: 0 }, e: { x: 1, y: 0 }, p: { x: 0.4 + 0.25 * Math.cos(th), y: 0.25 * Math.sin(th) } };
    }
    function lit() {
      var q = pos(), sx = q.s.x - q.p.x, sy = q.s.y - q.p.y, ex = q.e.x - q.p.x, ey = q.e.y - q.p.y;
      var c = (sx * ex + sy * ey) / Math.sqrt((sx * sx + sy * sy) * (ex * ex + ey * ey));
      return (1 + c) / 2;
    }
    function draw() {
      paper(ctx, W, H);
      var q = pos(), cx = 60, cy = 150, S = 240;
      function X(x) { return cx + (x + 0.8) / 1.9 * S * 1.6; }
      function Y(y) { return cy - y * S * 0.55; }
      text(ctx, model === "p" ? "천동설 — 금성은 지구·태양 사이의 주전원" : "지동설 — 금성은 태양 둘레를 돈다", 30, 24, { s: 12.5, w: "800" });
      if (model === "p") {
        ctx.strokeStyle = A(v("--mist"), 0.5); ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.ellipse(X(0.4), Y(0), (X(0.65) - X(0.4)), (Y(-0.25) - Y(0)), 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        seg(ctx, X(1), Y(0), X(0), Y(0), A(v("--mist"), 0.5), 1, true);
      } else {
        ctx.strokeStyle = A(v("--mist"), 0.5); ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.ellipse(X(0), Y(0), X(0.723) - X(0), Y(-0.723) - Y(0), 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      dot(ctx, X(0), Y(0), 13, "#ffc93a"); text(ctx, "태양", X(0), Y(0) + 30, { s: 11, w: "800", a: "center", c: v("--amber-700") });
      dot(ctx, X(1), Y(0), 9, "#3a9bff"); text(ctx, "지구", X(1), Y(0) + 24, { s: 11, w: "800", a: "center", c: v("--brand-700") });
      dot(ctx, X(q.p.x), Y(q.p.y), 7, v("--ink")); text(ctx, "금성", X(q.p.x), Y(q.p.y) - 12, { s: 11, w: "800", a: "center" });
      seg(ctx, X(1), Y(0), X(q.p.x), Y(q.p.y), A(v("--brand"), 0.6), 1.5);
      // 망원경으로 본 금성
      var f = lit(), vx = 700, vy = 130, r = 60;
      text(ctx, "지구에서 망원경으로 본 금성", vx, 30, { s: 12, w: "800", a: "center", c: v("--mist") });
      ctx.fillStyle = "#1a1d2a"; ctx.beginPath(); ctx.arc(vx, vy, r, 0, Math.PI * 2); ctx.fill();
      // 밝은 부분: 오른쪽 반원 + 타원(터미네이터)
      var k = 2 * f - 1;
      ctx.fillStyle = "#f6e7b0"; ctx.beginPath();
      ctx.arc(vx, vy, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(vx, vy, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k < 0);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(vx, vy, r, 0, Math.PI * 2); ctx.stroke();
      text(ctx, "밝은 부분 " + (f * 100).toFixed(0) + "%", vx, vy + r + 26, { s: 14, w: "900", a: "center", c: f >= 0.9 ? v("--green-700") : v("--ink") });
      text(ctx, f >= 0.9 ? "거의 보름달 모양" : (f >= 0.55 ? "반달보다 볼록" : (f >= 0.45 ? "반달 모양" : "초승달 모양")), vx, vy + r + 48, { s: 11.5, w: "700", a: "center", c: v("--mist") });
      return f >= 0.9;
    }
    function update() {
      var ok = draw(), f = lit();
      put("b-ven-info", (model === "p" ? "천동설" : "지동설") + " 모형, " + t + "일째: 금성의 밝은 부분은 " + (f * 100).toFixed(0) + "% 입니다. "
        + (ok ? "✅ 갈릴레이가 본 ‘보름달에 가까운 금성’입니다. 금성이 태양 <b>너머</b>에 있을 때만 이렇게 보입니다(완전히 둥글 때는 태양 바로 뒤라 보이지 않습니다)." : (model === "p" ? "천동설에서는 날짜를 아무리 바꿔도 금성이 태양 너머로 가지 않습니다. 모형을 바꿔 보세요." : "금성이 태양 건너편으로 가는 날짜를 찾아보세요.")));
      if (ok && !got.a) { got.a = true; window.sthState("venGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q) {
        window.sthState("venBest", "천동설은 최대 22%(초승달)뿐, 지동설에서만 보름달 금성");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("venBest") + ". 한 모형이 ‘절대 나올 수 없다’고 예측한 관측이 실제로 나오면, 그 모형은 버려지거나 고쳐져야 합니다. 이것이 결정적 관측입니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    segWire("b-model", "data-v", function (x) { model = x; update(); });
    $("b-t").addEventListener("input", function (ev) { t = +ev.target.value; $("b-t-val").textContent = t + "일"; update(); });
    window.sthPick({
      mount: "b-ven-pick",
      q: "갈릴레이가 망원경으로 금성이 초승달부터 보름달 모양까지 차고 기우는 것을 관측했습니다. 이 관측의 의미는?",
      options: ["천동설과 지동설 모두와 잘 맞는다", "금성이 태양 너머로 갈 수 없는 천동설(프톨레마이오스)로는 설명할 수 없다", "금성이 스스로 빛을 낸다는 증거이다"],
      answer: 1,
      why: ["천동설 모형에서는 금성의 밝은 부분이 22% 를 넘지 못했습니다.", "천동설은 보름달 금성이 ‘나올 수 없다’고 예측했습니다. 예측과 어긋나는 관측이 천동설을 무너뜨린 결정적 증거가 되었습니다.", "금성이 스스로 빛난다면 차고 기우는 모양이 생기지 않습니다. 위상은 햇빛을 반사하기 때문에 생깁니다."],
      onDone: function () { got.q = true; window.sthState("venGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 허블의 그래프 */
  (function () {
    var canvas = $("b-c-hub"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, h = 40;
    var got = window.sthState("hubGot") || false;
    var D = [8, 15, 22, 35, 48, 60, 75, 90], NOISE = [-80, 120, -150, 200, -100, 150, -250, 100];
    var VEL = D.map(function (d, i) { return 70 * d + NOISE[i]; });
    function rms(k) { var s = 0; for (var i = 0; i < D.length; i++) { var e = VEL[i] - k * D[i]; s += e * e; } return Math.sqrt(s / D.length); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 70, x1 = 560, y0 = 26, y1 = 250;
      function X(d) { return x0 + d / 100 * (x1 - x0); }
      function Y(vv) { return y1 - vv / 8000 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 25, 50, 75, 100].forEach(function (d) { text(ctx, d, X(d), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      [0, 2000, 4000, 6000, 8000].forEach(function (vv) { text(ctx, vv, x0 - 6, Y(vv) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "은하까지 거리 (Mpc)", x1, y1 + 34, { s: 11, w: "700", a: "right", c: v("--mist") });
      text(ctx, "멀어지는 속력 (km/s)", x0 + 6, y0 - 8, { s: 11, w: "700", c: v("--mist") });
      var xe = Math.min(100, 8000 / h);
      for (var i = 0; i < D.length; i++) {
        seg(ctx, X(D[i]), Y(VEL[i]), X(D[i]), Y(Math.min(8000, h * D[i])), A(v("--coral-700"), 0.5), 1.2, true);
        dot(ctx, X(D[i]), Y(VEL[i]), 6, v("--teal"));
      }
      seg(ctx, X(0), Y(0), X(xe), Y(h * xe), v("--brand"), 3);
      var r = rms(h), ok = Math.abs(h - 70) <= 2;
      text(ctx, "속력 = " + h + " × 거리", 610, 60, { s: 15, w: "900" });
      text(ctx, "평균 어긋남 " + r.toFixed(0) + " km/s", 610, 92, { s: 13, w: "800", c: ok ? v("--green-700") : v("--ink") });
      text(ctx, "우주의 나이 어림 ≈ 1/H", 610, 140, { s: 11.5, w: "700", c: v("--mist") });
      text(ctx, "≈ " + (9778 / h).toFixed(0) + "억 년", 610, 164, { s: 14, w: "800", c: v("--brand-700") });
      return ok;
    }
    function update() {
      var ok = draw();
      put("b-hub-info", "기울기 H = " + h + " 일 때 직선과 은하 자료의 평균 어긋남은 " + rms(h).toFixed(0) + " km/s 입니다. "
        + (ok ? "✅ 자료에 가장 잘 맞는 기울기입니다. 먼 은하일수록 빨리 멀어진다는 것은 우주 전체가 팽창한다는 뜻입니다." : (h < 70 ? "직선이 먼 은하들 아래로 지나갑니다." : "직선이 먼 은하들 위로 지나갑니다.")));
      if (ok && !got) { got = true; window.sthState("hubGot", true); mission(); }
    }
    function mission() {
      if (got) {
        window.sthState("hubBest", "H ≈ 70 km/s/Mpc, 우주의 나이 약 140억 년");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("hubBest") + ". ‘변하지 않는 우주’라는 틀이 ‘팽창하는 우주’로 바뀌었습니다. 허블이 처음 얻은 값(약 500)은 거리 측정 오차로 훨씬 컸고, 뒤의 관측들이 이를 고쳐 왔습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("b-h").addEventListener("input", function (ev) { h = +ev.target.value; $("b-h-val").textContent = h; update(); });
    update(); mission();
  })();

  /* 장면 4 — 연표 */
  (function () {
    var STEPS = [
      "코페르니쿠스, 태양 중심설 발표 — 천동설에서 지동설로",
      "갈릴레이, 금성의 위상 관측 — 프톨레마이오스 천동설의 결정적 반박",
      "갈릴레이, 『새로운 두 과학』 — 무거운 물체가 더 빨리 떨어진다는 아리스토텔레스의 생각을 반박",
      "파스퇴르, 백조목 플라스크 실험 — 자연발생설 반박",
      "허블, 은하의 거리–속력 관계 — 팽창하는 우주의 발견",
      "해저 확장과 고지자기 연구 — 대륙 이동설에서 판구조론으로"
    ];
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>1543 → 1610 → 1638 → 1861 → 1929 → 1960년대. 어느 경우에도 권위나 유행이 아니라 새로운 관측과 실험이 세계관을 바꾸었습니다. 대륙 이동설은 1912년 베게너가 제안했지만 증거가 쌓인 1960년대에야 받아들여졌지요."); ep.clear(3); ep.clear(4); }
    if (ep.cleared(3)) { orderDone("b-order", STEPS); window.sthMission("m2-4", true); }
    else window.sthOrder({ mount: "b-order", steps: STEPS, onDone: ok });
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("venBest") || "") + " / " + (window.sthState("hubBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 답</b> " + (window.sthState("para1") || "기록 없음") + "<br><b>금성의 위상</b> " + (window.sthState("venBest") || "-") + "<br><b>허블의 그래프</b> " + (window.sthState("hubBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험1 Ⅰ-1] 이야기 ② 보름달 금성",
    items: [
      { id: "w1", label: "과학은 어떻게 바뀌는가", hint: "금성의 위상이나 허블의 그래프를 예로 들어, 새로운 증거가 기존의 설명을 어떻게 바꾸는지 두세 문장으로 쓰세요.", ph: "기존의 설명: … / 새로운 증거: … / 바뀐 설명: …" },
      { id: "e2a", label: "진열장 설명판 한 줄", hint: "특별전 진열장에 붙일 설명판 문장을 초등학생도 알 수 있게 한 줄로 쓰세요." }
    ]
  });
})();

/* ========================================================================= 05 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험1 Ⅰ-1] 과학의 본성과 역사 속의 과학 탐구 — 정리",
  recap: [
    { key: "r1", label: "① 빛보다 빠른 중성미자" },
    { key: "r2", label: "② 보름달 금성" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "두 사건을 꿰는 한 문장", hint: "중성미자와 금성, 두 이야기를 ‘증거’와 ‘과학 지식’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 06 우리 반 */
window.sthShare({
  mount: "share", unit: "gt1-1-1", unitLabel: "[과학탐구실험1 Ⅰ-1] 과학의 본성과 역사 속의 과학 탐구",
  rows: [
    { key: "r1", label: "① 빛보다 빠른 중성미자" },
    { key: "r2", label: "② 보름달 금성" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "두 사건을 꿰는 한 문장" }
});

})();
