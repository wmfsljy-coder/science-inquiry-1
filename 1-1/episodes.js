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

/* ---- 무대 그림 도구 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function rgbOf(c) {
  c = String(c || "#888").trim();
  if (c.charAt(0) === "#") { if (c.length === 4) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  var m = /(\d+)\D+(\d+)\D+(\d+)/.exec(c); return m ? [+m[1], +m[2], +m[3]] : [200, 210, 255];
}
function rgba(c, a) { var r = rgbOf(c); return "rgba(" + r[0] + "," + r[1] + "," + r[2] + "," + a + ")"; }
function shade(c, k) { var r = rgbOf(c); return "rgb(" + Math.round(r[0] * k) + "," + Math.round(r[1] * k) + "," + Math.round(r[2] * k) + ")"; }
/* 빛나는 막대 */
function meter(ctx, x, y, w, h, f, c) {
  ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = "rgba(200,210,255,.22)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.stroke();
  f = clamp(f, 0, 1); if (f <= 0) return;
  var g = ctx.createLinearGradient(x, 0, x + w * f, 0); g.addColorStop(0, shade(c, .55)); g.addColorStop(1, c);
  ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.fillStyle = g;
  ctx.beginPath(); ctx.roundRect(x, y, Math.max(h, w * f), h, h / 2); ctx.fill(); ctx.restore();
}
/* ⏸ 멈추기 단추 */
function playBtn(id, onLabel, offLabel, get, set) {
  var b = $(id); if (!b) return;
  function lab() { b.textContent = get() ? onLabel : offLabel; }
  b.addEventListener("click", function () { set(!get()); lab(); }); lab();
}

/* ---- 스튜디오 + 블록 모형 공용 도구 (지침 _tools/STUDIO_GUIDE.md) ---- */
var LT = K.LT;
function lpill(ctx, s, x, y, o) { o = o || {}; o.bg = o.bg || "rgba(255,255,255,.94)"; o.line = o.line || "rgba(20,40,90,.16)"; o.c = o.c || LT.ink; return K.pill(ctx, s, x, y, o); }
function note(ctx, s, x, y, o) { o = o || {}; K.t(ctx, s, x, y, { s: o.s || 11.5, w: o.w || "700", a: o.a, c: o.c || LT.mute }); }
/* 입체 상자(정면 + 윗면 + 오른쪽 면): 정면 왼쪽 위 (x, y), 폭 w, 높이 h, 깊이 d */
function cube(ctx, x, y, w, h, d, cF, cT, cR) {
  var dx = d * .7, dy = d * .5;
  ctx.fillStyle = cT; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y - dy); ctx.lineTo(x + w + dx, y - dy); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cR; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + dx, y - dy); ctx.lineTo(x + w + dx, y + h - dy); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cF; ctx.fillRect(x, y, w, h);
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
    var ph = 0, playing = !REDUCE;
    function ratio() { var tn = TL - EARLY + e; return TL / tn; }   // v/c
    function surf(x) { var u = (x - 450) / 420; return 64 - 26 * (1 - u * u); }   // 땅 표면(굽음 과장)
    /* ── 블록 모형: x = CERN(왼쪽 위) → 그란사소(오른쪽 아래). 앞면(y = D)을 따라 중성미자가 바위 속을 지난다 ── */
    var TH = 420;
    var I = K.iso({ ox: 380, oy: 104, s: 0.6, L: 760, D: 150 });
    var LL = I.L, DD = I.D, XC = 52, XG = LL - 64;
    function arch(x) { var u = x / LL; return 92 + 170 * u * (1 - u); }          /* 지구의 굽음(크게 과장) */
    function zOf(x, y) {
      var z = arch(x) + 3 * Math.sin(x / 37) * Math.cos(y / 29);
      z += 34 * Math.exp(-Math.pow((x - 230) / 70, 2) - Math.pow((y - 70) / 60, 2));   /* 알프스 */
      z += 60 * Math.exp(-Math.pow((x - XG) / 48, 2) - Math.pow((y - 90) / 55, 2));    /* 그란사소 산 */
      return z;
    }
    var ZC = zOf(XC, DD) - 16, ZG = arch(XG) - 10;                                     /* 빔 출발점, 지하 실험실 */
    function colOf(x, y, z, light) {
      var c = z > 156 ? "#eef1f5" : (z > 140 ? "#8d8173" : (z > 128 ? "#7f9a5a" : ((Math.sin(x / 23) + Math.cos(y / 17)) > 0 ? "#6f9e4c" : "#5d8f43")));
      return K.tint(c, light);
    }
    function rockFace(side) {
      var zf = side === "front" ? function (u) { return zOf(u, DD); } : function (u) { return zOf(LL, u); };
      I.face(ctx, side, function (Lw) {
        I.profile(ctx, side, zf, 0);
        var g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, "#2c1d14"); g.addColorStop(.6, "#5a3f2a"); g.addColorStop(1, "#7a5a3c");
        ctx.fillStyle = g; ctx.fill();
        ctx.save(); I.profile(ctx, side, zf, 0); ctx.clip();
        ctx.strokeStyle = "rgba(255,220,180,.13)"; ctx.lineWidth = 1;
        [18, 40, 64, 88].forEach(function (k) { ctx.beginPath(); for (var u = 0; u <= Lw; u += 8) { var zz = zf(u) - k - 4 * Math.sin(u / 60 + k); if (u) ctx.lineTo(u, zz); else ctx.moveTo(u, zz); } ctx.stroke(); });
        var R = K.rng(side === "front" ? 41 : 43);
        for (var i = 0; i < Lw * 1.2; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.12)" : "rgba(20,10,5,.25)"; ctx.fillRect(R() * Lw, R() * 170, 1.5, 1.5); }
        ctx.restore();
      });
    }
    function sat(x, y) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "#3d6fb8"; ctx.fillRect(-26, -5, 17, 10); ctx.fillRect(9, -5, 17, 10);
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.strokeRect(-26, -5, 17, 10); ctx.strokeRect(9, -5, 17, 10);
      var b = ctx.createLinearGradient(-8, 0, 8, 0); b.addColorStop(0, "#c9a24a"); b.addColorStop(1, "#7a5a1e");
      ctx.fillStyle = b; ctx.fillRect(-8, -8, 16, 16); ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, d = e - EARLY, box = [0, W];
      /* ── 위: 알프스 아래 730 km를 잘라 낸 블록 ── */
      K.studio(ctx, 0, 0, W, TH, { x: 560, y: 345, rx: 320, ry: 56 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, TH, 14); ctx.clip();
      I.field(ctx, zOf, colOf, 84, 18);
      rockFace("front"); rockFace("right");
      I.shade(ctx, "front", function (u) { return zOf(u, DD); });
      I.shade(ctx, "right", function (u) { return zOf(LL, u); });
      I.edges(ctx, zOf(LL, DD), zOf(LL, DD));
      [[150, 40], [320, 120], [410, 60], [470, 130], [560, 30], [120, 110]].forEach(function (t, k) { I.tree(ctx, t[0], t[1], zOf(t[0], t[1]), .8 + (k % 3) * .1); });
      /* CERN: 가속기 고리와 건물, 빔이 내려가는 굴 */
      var ring = [];
      for (i = 0; i <= 40; i++) { var a = i / 40 * 6.2832, rx = XC + 36 + 34 * Math.cos(a), ry = DD - 52 + 26 * Math.sin(a); ring.push(I.P(rx, ry, zOf(rx, ry) + 1)); }
      ctx.save(); ctx.shadowColor = "#7fd3ff"; ctx.shadowBlur = 10; ctx.strokeStyle = "#5ab8ff"; ctx.lineWidth = 2.6;
      ctx.beginPath(); ring.forEach(function (p, k) { if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke(); ctx.restore();
      I.house(ctx, XC + 18, DD - 22, zOf(XC + 24, DD - 16), 14, 12, 10, "#3f6fb5");
      var s0 = I.P(XC, DD, zOf(XC, DD)), s1 = I.P(XC, DD, ZC);
      K.line(ctx, s0, s1, "rgba(220,230,255,.75)", 3);
      /* 그란사소 지하 실험실(앞면 단면) */
      var q0 = I.P(XG - 30, DD, ZG - 11), q1 = I.P(XG + 26, DD, ZG - 11), q2 = I.P(XG + 26, DD, ZG + 13), q3 = I.P(XG - 30, DD, ZG + 13);
      I.quad(ctx, q0, q1, q2, q3, "#16233f", "rgba(160,200,255,.6)");
      for (i = 1; i < 7; i++) { var a0 = I.P(XG - 30 + i * 8, DD, ZG - 8), a1 = I.P(XG - 30 + i * 8, DD, ZG + 10); K.line(ctx, a0, a1, "rgba(150,190,255,.55)", 1.6); }
      /* 빔 길과 중성미자 */
      var B0 = I.P(XC, DD, ZC), B1 = I.P(XG - 30, DD, ZG);
      K.line(ctx, B0, B1, "rgba(255,150,170,.75)", 1.8, [6, 5]);
      var hit = false;
      for (i = 0; i < 3; i++) {
        var u = (ph + i / 3) % 1; if (u > .95) hit = true;
        K.glow(ctx, B0.x + (B1.x - B0.x) * u, B0.y + (B1.y - B0.y) * u, 3.4, "rgba(255,140,160,.95)", 4.4);
      }
      var lc = I.P(XG, DD, ZG);
      K.glow(ctx, lc.x, lc.y, hit ? 6 : 3, hit ? "rgba(160,235,255,.98)" : "rgba(160,235,255,.7)", hit ? 5 : 3.5);
      /* 두 곳의 시계를 맞추는 GPS */
      var gA = { x: 70, y: 150 }, gB = { x: 842, y: 120 }, cA = I.P(XC + 24, DD - 16, zOf(XC + 24, DD - 16) + 12), cB = I.P(XG + 40, DD - 6, zOf(XG + 40, DD - 6) + 2);
      K.line(ctx, gA, cA, "rgba(40,90,170,.55)", 1.4, [4, 4]); K.line(ctx, gB, cB, "rgba(40,90,170,.55)", 1.4, [4, 4]);
      sat(gA.x, gA.y); sat(gB.x, gB.y);
      /* 길이 표시(앞 아래 모서리와 나란히) */
      var m0 = I.P(XC, DD + 40, 0), m1 = I.P(XG, DD + 40, 0);
      K.line(ctx, m0, m1, "rgba(30,40,70,.6)", 1.4, [5, 4]);
      K.line(ctx, I.P(XC, DD + 30, 0), I.P(XC, DD + 50, 0), "rgba(30,40,70,.7)", 1.6);
      K.line(ctx, I.P(XG, DD + 30, 0), I.P(XG, DD + 50, 0), "rgba(30,40,70,.7)", 1.6);
      ctx.restore();
      /* 이름표 */
      I.label(ctx, XC, DD - 52, zOf(XC, DD - 52) + 2, "CERN (스위스) · 중성미자를 쏜다", -24, 58, "#bfe6ff", box);
      I.label(ctx, 230, 70, zOf(230, 70) + 2, "알프스", -22, -28, "#f4f0e6", box);
      I.label(ctx, XG, DD, ZG, "그란사소 지하 실험실 ⏱", 34, 50, "#ffe08a", box);
      K.pill(ctx, "중성미자는 바위를 거의 그대로 뚫고 지나갑니다", (B0.x + B1.x) / 2 + 6, (B0.y + B1.y) / 2 + 26, { s: 11, a: "center", c: "#ffc2cc", box: box });
      K.pill(ctx, "730 km · 빛이라면 약 2.435 ms", (m0.x + m1.x) / 2 - 10, (m0.y + m1.y) / 2 + 20, { s: 11.5, a: "center", c: "#e8ecff", box: box });
      K.pill(ctx, "GPS 위성 신호로 두 곳의 시계를 맞춥니다", W - 14, 158, { s: 11, a: "right", c: "#bfe6ff", box: box });
      K.warn(ctx, W - 14, 30, "⚠ 땅의 굽음과 깊이는 크게 과장 (실제 가장 깊은 곳 약 11 km)", "right");
      /* 큰 글자 */
      if (Math.abs(d) < 1) { K.bigText(ctx, "빛과 같은 순간에 도착", 22, 52, 27, "#ffd35a"); K.bigText(ctx, "빛보다 빠르지 않다", 22, 86, 18, "#ffffff"); }
      else if (e === 0) { K.bigText(ctx, "빛보다 60 ns 빨랐다?", 22, 52, 27, "#ffffff"); K.bigText(ctx, "730 km 경주의 승자는", 22, 86, 18, "#ffd35a"); }
      else if (d < 0) { K.bigText(ctx, "아직 빛보다 " + (-d) + " ns 빠르다", 22, 52, 27, "#ffffff"); K.bigText(ctx, "오차 " + e + " ns를 바로잡음", 22, 86, 18, "#ffd35a"); }
      else { K.bigText(ctx, "이번엔 빛보다 " + d + " ns 늦다", 22, 52, 27, "#ff9aac"); K.bigText(ctx, "오차를 너무 많이 뺐다", 22, 86, 18, "#ffffff"); }

      /* ── 아래: 결승선 확대 — 밝은 스튜디오 위 입체 경주로 + 오른쪽 흰 판정 카드 ── */
      var Y0 = TH + 8, CW = 628, nuT = -EARLY + e, same = Math.abs(nuT) < 1, fast = nuT < -0.5;
      K.studio(ctx, 0, Y0, CW, H - Y0, { x: 320, y: H - 22, rx: 280, ry: 18 });
      lpill(ctx, "결승선 근처를 1억 배 확대 (빛의 도착 = 0 ns)", 16, Y0 + 26, { s: 12, c: LT.blue, box: [0, CW] });
      var bx0 = 84, bx1 = 566, ly = Y0 + 102;
      function X(ns) { return bx0 + (ns + 100) / 200 * (bx1 - bx0); }
      /* 경주로 두 줄: 뒤 = 빛, 앞 = 중성미자 (입체 판) */
      cube(ctx, bx0 + 12, ly - 32, bx1 - bx0, 12, 22, "#f3d27a", "#ffe9ae", "#c99a2a");
      cube(ctx, bx0, ly, bx1 - bx0, 12, 22, "#f5a3b4", "#ffd3dc", "#c4566d");
      K.t(ctx, "빛", bx0 + 6, ly - 34, { s: 11, w: "900", a: "right", c: "#a07000" });
      K.t(ctx, "중성미자", bx0 - 6, ly + 10, { s: 11, w: "900", a: "right", c: "#b02a4a" });
      [-100, -50, 0, 50, 100].forEach(function (tq) {
        K.line(ctx, { x: X(tq), y: ly }, { x: X(tq), y: ly + 12 }, "rgba(20,40,90,.55)", 1.4);
        K.t(ctx, (tq > 0 ? "+" : "") + tq + " ns", X(tq), ly + 28, { s: 10.5, a: "center", c: LT.mute, w: "700" });
      });
      /* 결승 문(빛이 닿는 순간) */
      var gx = X(0);
      ctx.save(); ctx.strokeStyle = "#e8a300"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(gx + 2, ly + 2); ctx.lineTo(gx + 2, ly - 52); ctx.moveTo(gx + 26, ly - 30); ctx.lineTo(gx + 26, ly - 84); ctx.stroke();
      ctx.fillStyle = "#ffd35a"; ctx.beginPath(); ctx.moveTo(gx + 2, ly - 52); ctx.lineTo(gx + 26, ly - 84); ctx.lineTo(gx + 26, ly - 72); ctx.lineTo(gx + 2, ly - 40); ctx.closePath(); ctx.fill(); ctx.restore();
      K.glow(ctx, gx + 20, ly - 36, 4.5, "rgba(255,214,90,.98)", 3);
      lpill(ctx, "빛 도착 (0 ns)", gx + 34, ly - 70, { s: 11.5, c: "#a07000", box: [0, CW] });
      /* 중성미자 공 */
      var nx = X(nuT) + 8;
      ctx.fillStyle = "rgba(20,30,50,.2)"; ctx.beginPath(); ctx.ellipse(nx + 2, ly - 3, 9, 3, 0, 0, 6.2832); ctx.fill();
      K.glow(ctx, nx, ly - 12, 6, same ? "rgba(63,211,163,.98)" : "rgba(255,110,140,.98)", 3);
      K.planet(ctx, nx, ly - 12, 6, same ? "#7ff0c4" : "#ff9aac", same ? "#0b6e52" : "#a01c3c");
      lpill(ctx, "중성미자 " + (nuT > 0 ? "+" : "") + nuT + " ns", nx, ly - 26, { s: 11.5, a: "center", c: same ? LT.green : LT.red, box: [0, CW] });
      if (e > 0) {
        K.arrow(ctx, { x: X(-EARLY) + 8, y: ly + 42 }, { x: X(nuT) + 8, y: ly + 42 }, LT.blue, 2.6, 9);
        lpill(ctx, "장비 오차 " + e + " ns를 바로잡으면", (X(-EARLY) + X(nuT)) / 2 + 8, ly + 64, { s: 11, a: "center", c: LT.blue, box: [0, CW] });
      }
      /* 오른쪽 흰 판정 카드 */
      var RX = CW + 8, x0 = RX + 18, x1 = W - 18;
      K.card(ctx, RX, Y0, W - RX, H - Y0, "결승선 판정");
      K.t(ctx, same ? "빛과 같은 순간 도착" : (fast ? "빛보다 " + (-nuT) + " ns 먼저" : "빛보다 " + nuT + " ns 늦게"), x0, Y0 + 56, { s: 17, w: "900", c: same ? LT.green : (fast ? LT.red : LT.orange) });
      K.row(ctx, "바로잡은 장비 오차", e + " ns", x0, x1, Y0 + 84, LT.blue);
      K.row(ctx, "속력 ÷ 빛의 속력", ratio().toFixed(7), x0, x1, Y0 + 108);
      note(ctx, "60 ns 차이 = 빛이 약 18 m 가는 시간", x0, Y0 + 130, { s: 10.5 });
      K.tip(ctx, same ? "빛보다 빠르지 않습니다" : (fast ? "빛보다 빠르다? 오차부터 의심" : "오차를 너무 많이 뺐습니다"), x0 - 6, H - 44, x1 - x0 + 12, same);
      readout();
      return e === EARLY;
    }
    function readout() {
      var r = ratio(), d = e - EARLY, same = Math.abs(d) < 1;
      put("a-nu-read",
        "<span class='k'>도착 시각 차</span><span class='v " + (same ? "g" : (d < 0 ? "r" : "y")) + "'>" + (same ? "0 ns" : (d > 0 ? "+" : "−") + Math.abs(d) + " ns") + "</span>" +
        "<span class='sub'>" + (same ? "빛과 같은 순간에 도착" : (d < 0 ? "빛보다 먼저 도착" : "빛보다 늦게 도착")) + "</span>" +
        "<span class='k'>속력 ÷ 빛의 속력</span><span class='v b'>" + r.toFixed(7) + "</span>" +
        "<span class='ok " + (same ? "g" : "r") + "'>" + (same ? "빛보다 빠르지 않습니다 · 상대성 이론과 맞음" : (d < 0 ? "빛보다 빠르다? · 오차부터 의심해 보세요" : "오차를 너무 많이 뺐습니다")) + "</span>");
    }
    function update() {
      var ok = draw(), r = ratio();
      put("a-nu-info", "빛은 730 km를 약 " + (TL / 1e6).toFixed(3) + " ms에 갑니다. 장비 오차를 " + e + " ns로 바로잡으면 중성미자는 빛보다 "
        + (Math.abs(EARLY - e) < 1 ? "빠르지도 느리지도 않습니다" : ((EARLY - e) > 0 ? (EARLY - e) + " ns 먼저 도착합니다" : (e - EARLY) + " ns 늦게 도착합니다"))
        + " (속력 비 " + r.toFixed(7) + "). " + (ok ? "✅ 시계가 60 나노초만 어긋나도 ‘빛보다 빠른’ 결과가 나옵니다." : "속력 비가 정확히 1이 되는 오차를 찾아보세요."));
      if (ok && !got.a) { got.a = true; window.sthState("nuGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-2a"); if (got.q) done("m1-2b");
      if (got.a && got.q) {
        window.sthState("nuBest", "장비 오차 60 ns면 속력 비 1 (빛과 같다)");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("nuBest") + ". 2.4 밀리초 중 60 나노초, 4만분의 1도 안 되는 오차가 결론을 뒤집을 수 있습니다. 그래서 과학자들은 결과를 다른 이들에게 검증받습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    playBtn("a-nu-play", "⏸ 중성미자 멈추기", "▶ 중성미자 움직이기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) { if (playing) { ph = (ph + dt / 2600) % 1; draw(); } });
    $("a-e").addEventListener("input", function (ev) { e = +ev.target.value; $("a-e-val").textContent = e + " ns"; update(); });
    window.sthPick({
      mount: "a-nu-pick",
      q: "연구팀이 결과를 발표하면서 다른 과학자들에게 검토와 재측정을 요청한 가장 중요한 까닭은?",
      options: ["자기 팀의 실력을 자랑하려고", "스스로 찾지 못한 오류가 있을 수 있어, 독립적인 확인을 거쳐야 과학 지식으로 인정받을 수 있기 때문에", "상대성 이론이 틀렸다는 것을 이미 확신했기 때문에"],
      answer: 1,
      why: ["자랑이 목적이었다면 검토를 요청하지 않았겠지요.", "과학 지식은 한 팀의 주장만으로 확정되지 않습니다. 다른 과학자들의 검토와 재현을 거치는 사회적 합의 과정이 필요합니다.", "연구팀도 오류를 찾지 못했을 뿐 확신하지 않았습니다. 그래서 검토를 부탁했습니다."],
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
    function sup(k) { var S = "⁰¹²³⁴⁵⁶⁷⁸⁹"; return String(k).split("").map(function (c) { return S.charAt(+c); }).join(""); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 검토자 수에 따른 확률 (밝은 카드 그래프 + 입체 막대) ── */
      var LW = 548, k, p = P(n), okNow = p >= 0.95;
      K.studio(ctx, 0, 0, LW, H, { x: 280, y: H - 12, rx: 250, ry: 14 });
      var g = K.chart(ctx, { x: 0, y: 0, w: LW, h: H, pl: 56, pt: 62, pb: 38, pr: 24, x0: 0.5, x1: 20.5, y0: 0, y1: 100, xt: 4, yt: 4, light: true, xf: function () { return ""; }, yf: function (q) { return q + "%"; }, xl: "검토자 수" });
      var bw = (g.X(1.5) - g.X(0.5)) * 0.6;
      for (k = 1; k <= 20; k++) {
        var top = g.Y(P(k) * 100), cc = k === n ? (okNow ? LT.green : LT.blue) : (k < n ? "#8fb8e6" : "#d3dae4");
        cube(ctx, g.X(k) - bw / 2 - 3, top, bw, g.B - top, 8, cc, K.tint(cc, 1.15), K.tint(cc, 0.78));
        if (k % 5 === 0 || k === 1) K.t(ctx, k + "명", g.X(k), g.B + 16, { s: 10.5, a: "center", c: k === n ? LT.ink : LT.mute, w: k === n ? "900" : "600" });
      }
      K.line(ctx, { x: g.L, y: g.Y(95) }, { x: g.R, y: g.Y(95) }, LT.yellow, 2, [6, 4]);
      lpill(ctx, "목표 95%", g.L + 10, g.Y(95) + 20, { s: 11, c: "#a85d00" });
      lpill(ctx, (p * 100).toFixed(1) + "%", g.X(n), g.Y(p * 100) - 12, { s: 11.5, a: "center", c: okNow ? LT.green : LT.blue, box: [g.L, LW] });
      K.bigText(ctx, "검토자 " + n + "명 → " + (p * 100).toFixed(1) + "%", 16, 36, 21, okNow ? "#8ce99a" : "#ffffff");

      /* ── 오른쪽: 책상 위 논문과 따로 읽는 검토자들 (입체 미니어처) ── */
      var RX = LW + 8, RW = W - RX;
      K.studio(ctx, RX, 0, RW, H, { x: RX + 170, y: 214, rx: 160, ry: 22 });
      lpill(ctx, "검토자 " + n + "명이 따로 읽는 논문", RX + 16, 28, { s: 12.5, c: LT.blue, box: [RX, W] });
      /* 나무 책상 */
      ctx.fillStyle = "#7a5233"; ctx.fillRect(RX + 26, 174, 7, 34); ctx.fillRect(RX + 150, 174, 7, 34); ctx.fillRect(RX + 70, 160, 6, 30); ctx.fillRect(RX + 190, 160, 6, 30);
      cube(ctx, RX + 18, 160, 150, 14, 62, "#b47c4a", "#d7a06a", "#8a5a33");
      /* 논문 한 장(윗면에 놓인 종이) */
      var ax = RX + 40, ay = 156, pw = 96, dx = 30, dy = 22;
      ctx.save(); ctx.shadowColor = "rgba(20,30,50,.25)"; ctx.shadowBlur = 6;
      ctx.fillStyle = "#fbf8f0"; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + pw, ay); ctx.lineTo(ax + pw + dx, ay - dy); ctx.lineTo(ax + dx, ay - dy); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(60,60,80,.45)"; ctx.lineWidth = 1.4;
      for (k = 1; k <= 6; k++) { var f2 = k / 7, sx0 = ax + dx * f2 + 10, sy0 = ay - dy * f2; ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.lineTo(sx0 + (k % 3 === 2 ? 46 : 70), sy0); ctx.stroke(); }
      ctx.strokeStyle = LT.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ax + 62, ay - 11, 20, 5, 0, 0, 6.2832); ctx.stroke();
      lpill(ctx, "숨은 오류", RX + 26, 112, { s: 11, c: LT.red, box: [RX, W] });
      /* 검토자 20명 (켜진 사람 = 지금 읽는 검토자) */
      for (k = 0; k < 20; k++) {
        var cx = RX + 222 + (k % 4) * 30, cy = 62 + Math.floor(k / 4) * 28, act = k < n;
        ctx.globalAlpha = act ? 1 : 0.28;
        ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(cx + 2, cy + 17, 9, 2.6, 0, 0, 6.2832); ctx.fill();
        var coat = ctx.createLinearGradient(cx - 9, 0, cx + 9, 0); coat.addColorStop(0, act ? "#4f8fd6" : "#9aa3b0"); coat.addColorStop(.5, act ? "#a9d0ff" : "#d9dee5"); coat.addColorStop(1, act ? "#2f6aac" : "#8a93a0");
        ctx.fillStyle = coat; ctx.beginPath(); ctx.roundRect(cx - 8, cy + 3, 16, 14, [7, 7, 3, 3]); ctx.fill();
        K.planet(ctx, cx, cy - 2, 6, "#f3c7a2", "#8a5636");
        ctx.globalAlpha = 1;
      }
      /* 찾음 · 놓침 막대 */
      var mx = RX + 18, my = 228, mw = RW - 36;
      ctx.fillStyle = "rgba(240,90,100,.35)"; ctx.beginPath(); ctx.roundRect(mx, my, mw, 10, 5); ctx.fill();
      ctx.fillStyle = p >= 0.95 ? LT.green : LT.blue; ctx.beginPath(); ctx.roundRect(mx, my, Math.max(5, mw * p), 10, 5); ctx.fill();
      lpill(ctx, "찾음 " + (p * 100).toFixed(1) + "%", mx, my + 34, { s: 11.5, c: p >= 0.95 ? LT.green : LT.blue, box: [RX, W] });
      lpill(ctx, "놓침 0.7" + sup(n) + " = " + (Math.pow(P_MISS, n) * 100).toFixed(1) + "%", mx + mw, my + 34, { s: 11.5, a: "right", c: LT.red, box: [RX, W] });
      readout(p);
      return okNow && !(P(n - 1) >= 0.95);
    }
    function readout(p) {
      var first = p >= 0.95 && !(P(n - 1) >= 0.95);
      put("a-pr-read",
        "<span class='k'>찾을 확률</span><span class='v " + (p >= 0.95 ? "g" : "b") + "'>1 − 0.7" + sup(n) + " = " + (p * 100).toFixed(1) + "%</span>" +
        "<span class='k'>놓칠 확률</span><span class='v r'>0.7" + sup(n) + " = " + (Math.pow(P_MISS, n) * 100).toFixed(1) + "%</span>" +
        "<span class='sub'>한 명이 놓칠 확률 0.7을 " + n + "번 곱함</span>" +
        "<span class='ok " + (first ? "g" : "r") + "'>" + (first ? "95%를 넘기는 가장 적은 수" : (p >= 0.95 ? "95%는 넘었지만 더 적어도 됩니다" : "아직 95%에 못 미칩니다")) + "</span>");
    }
    function update() {
      var ok = draw();
      put("a-pr-info", "검토자 " + n + "명이 따로 검토하면 오류를 적어도 한 명이 찾을 확률은 1 − 0.7<sup>" + n + "</sup> = " + (P(n) * 100).toFixed(1) + "%입니다. "
        + (ok ? "✅ 95%를 넘기는 가장 적은 수입니다. 한 사람은 30% 밖에 못 찾아도, 여럿이 독립적으로 보면 오류가 걸러집니다." : (P(n) >= 0.95 ? "95%는 넘었지만 더 적은 수로도 됩니다." : "아직 95%에 못 미칩니다.")));
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
      why: ["한 명일 때의 확률입니다.", "두 명일 때(51%)에 가깝습니다.", "1 − 0.7⁵ = 1 − 0.168 ≈ 0.83, 약 83%입니다.", "검토자가 아무리 많아도 놓칠 확률은 0이 되지 않습니다. 과학 지식이 잠정적인 까닭 하나입니다."],
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
      { t: "연구팀은 측정 방식 자체를 바꿔(중성미자 빔을 아주 짧은 묶음으로 쏘아) 같은 질문을 새 방법으로 확인했다", a: "div", why: "같은 질문을 다른 측정 방법으로 다시 확인했습니다. 같은 방법을 되풀이한 재현과는 다릅니다." },
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
    function shape(f) { return f >= 0.9 ? "거의 보름달 모양" : (f >= 0.55 ? "반달보다 볼록" : (f >= 0.45 ? "반달 모양" : "초승달 모양")); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var q = pos(), LW = 520;
      function X(x) { return 40 + (x + 0.8) / 1.9 * 440; }
      function Y(y) { return 200 - y * 100; }                    /* 궤도면을 비스듬히 내려다본 모습 */
      /* ── 왼쪽: 우주 무대 위 궤도판 (입체) ── */
      K.stage(ctx, 0, 0, LW, H, "space", { seed: 23 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var pcx = X(0.1), prx = X(1.08) - X(0), pry = 108;
      ctx.fillStyle = "rgba(20,24,60,.85)"; ctx.beginPath(); ctx.ellipse(pcx, Y(0) + 7, prx, pry, 0, 0, Math.PI); ctx.fill();
      var pgr = ctx.createRadialGradient(pcx, Y(0), 10, pcx, Y(0), prx);
      pgr.addColorStop(0, "rgba(140,150,255,.20)"); pgr.addColorStop(1, "rgba(90,100,220,.07)");
      ctx.fillStyle = pgr; ctx.beginPath(); ctx.ellipse(pcx, Y(0), prx, pry, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(170,185,255,.45)"; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.strokeStyle = "rgba(200,210,255,.5)"; ctx.lineWidth = 1.4; ctx.setLineDash([5, 5]);
      if (model === "p") {
        ctx.beginPath(); ctx.ellipse(X(0.4), Y(0), X(0.65) - X(0.4), 25, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        K.line(ctx, { x: X(1), y: Y(0) }, { x: X(0), y: Y(0) }, "rgba(255,211,107,.5)", 1.2, [3, 4]);
        ctx.fillStyle = KC.orange; ctx.beginPath(); ctx.arc(X(0.4), Y(0), 2.5, 0, 6.2832); ctx.fill();
      } else {
        ctx.beginPath(); ctx.ellipse(X(0), Y(0), X(0.723) - X(0), 72.3, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "rgba(127,211,255,.32)"; ctx.beginPath(); ctx.ellipse(X(0), Y(0), X(1) - X(0), 100, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
      var vxp = X(q.p.x), vyp = Y(q.p.y), ex = X(1), ey = Y(0), sx = X(0), sy = Y(0);
      /* 판 위 그림자와 받침선(천체는 판 위로 조금 떠 있다) */
      [[sx, sy, 16, 18], [ex, ey, 9, 12], [vxp, vyp, 8, 12]].forEach(function (b) {
        ctx.fillStyle = "rgba(0,0,10,.45)"; ctx.beginPath(); ctx.ellipse(b[0], b[1], b[2], b[2] * .35, 0, 0, 6.2832); ctx.fill();
        K.line(ctx, { x: b[0], y: b[1] }, { x: b[0], y: b[1] - b[3] }, "rgba(200,210,255,.35)", 1);
      });
      sy -= 18; ey -= 12; vyp -= 12;
      K.line(ctx, { x: ex, y: ey }, { x: vxp, y: vyp }, "rgba(127,211,255,.85)", 1.6);
      K.sun(ctx, sx, sy, 15);
      K.earth(ctx, ex, ey, 9);
      K.planet(ctx, vxp, vyp, 8, "#f6e2a8", "#8a6a2e");
      var aS = Math.atan2(sy - vyp, sx - vxp);
      ctx.fillStyle = "rgba(8,10,30,.82)"; ctx.beginPath(); ctx.arc(vxp, vyp, 8.4, aS + Math.PI / 2, aS + Math.PI * 1.5); ctx.closePath(); ctx.fill();
      K.pill(ctx, "태양", sx, sy + 36, { s: 11.5, a: "center", c: KC.yellow });
      K.pill(ctx, "지구", ex, ey + 32, { s: 11.5, a: "center", c: KC.blue, box: [0, LW] });
      K.pill(ctx, "금성", vxp, vyp - 16, { s: 11.5, a: "center", c: "#fff1c8", box: [0, LW] });
      K.bigText(ctx, model === "p" ? "천동설 (프톨레마이오스)" : "지동설 (코페르니쿠스)", 16, 40, 23, model === "p" ? "#ffd35a" : "#9fd8ff");
      K.bigText(ctx, model === "p" ? "주전원의 중심은 늘 지구–태양 선 위" : "금성은 태양 둘레를 돈다 (0.72 AU)", 16, 68, 14, "#ffffff");
      K.warn(ctx, LW - 14, H - 14, "⚠ 크기는 실제 비율이 아님", "right");

      /* ── 오른쪽 흰 판정 카드: 망원경 접안렌즈 속 금성 ── */
      var RX = LW + 8, f = lit(), vx = RX + (W - RX) / 2, vy = 138, R = 86, x0 = RX + 18, x1 = W - 18;
      K.card(ctx, RX, 0, W - RX, H, "지구에서 망원경으로 본 금성");
      ctx.strokeStyle = "#8a93a3"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(vx, vy, R + 4, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = "#dfe4eb"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(vx, vy, R + 7, 0, 6.2832); ctx.stroke();
      var eg = ctx.createRadialGradient(vx, vy, 10, vx, vy, R); eg.addColorStop(0, "#0d1236"); eg.addColorStop(1, "#02030c");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(vx, vy, R, 0, 6.2832); ctx.fill();
      var dist = Math.sqrt(Math.pow(q.p.x - 1, 2) + Math.pow(q.p.y, 2)), r = clamp(30 / dist, 18, 72);
      ctx.fillStyle = "#151826"; ctx.beginPath(); ctx.arc(vx, vy, r, 0, Math.PI * 2); ctx.fill();
      var k = 2 * f - 1, lg = ctx.createLinearGradient(vx - r, vy - r, vx + r, vy + r);
      lg.addColorStop(0, "#fff8dc"); lg.addColorStop(.6, "#f3dc9a"); lg.addColorStop(1, "#c9a55a");
      ctx.save(); ctx.shadowColor = "rgba(255,236,180,.8)"; ctx.shadowBlur = 16;
      ctx.fillStyle = lg; ctx.beginPath();
      ctx.arc(vx, vy, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(vx, vy, Math.max(0.01, Math.abs(k) * r), r, 0, Math.PI / 2, -Math.PI / 2, k < 0);
      ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(200,210,255,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(vx, vy, r, 0, Math.PI * 2); ctx.stroke();
      K.row(ctx, "밝은 부분", (f * 100).toFixed(0) + "%", x0, x1, 254, f >= 0.9 ? LT.green : LT.orange);
      K.row(ctx, "모양", shape(f), x0, x1, 276);
      K.tip(ctx, f >= 0.9 ? "보름달에 가까운 금성" : (model === "p" ? "이 모형에서는 초승달만 나옵니다" : "태양 너머로 가는 날을 찾아보세요"), x0 - 6, 290, x1 - x0 + 12, f >= 0.9);
      readout(f);
      return f >= 0.9;
    }
    function readout(f) {
      put("b-ven-read",
        "<span class='k'>밝은 부분</span><span class='v " + (f >= 0.9 ? "g" : "y") + "'>" + (f * 100).toFixed(0) + "%</span>" +
        "<span class='sub'>" + shape(f) + "</span>" +
        "<span class='k'>모형</span><span class='v b'>" + (model === "p" ? "천동설" : "지동설") + " · " + t + "일째</span>" +
        "<span class='ok " + (f >= 0.9 ? "g" : "r") + "'>" + (f >= 0.9 ? "보름달에 가까운 금성" : (model === "p" ? "이 모형에서는 초승달만 나옵니다" : "금성이 태양 너머로 가는 날을 찾아 보세요")) + "</span>");
    }
    function update() {
      var ok = draw(), f = lit();
      put("b-ven-info", (model === "p" ? "천동설" : "지동설") + " 모형, " + t + "일째: 금성의 밝은 부분은 " + (f * 100).toFixed(0) + "%입니다. "
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
      why: ["천동설 모형에서는 금성의 밝은 부분이 22%를 넘지 못했습니다.", "천동설은 보름달 금성이 ‘나올 수 없다’고 예측했습니다. 예측과 어긋나는 관측이 천동설을 무너뜨린 결정적 증거가 되었습니다.", "금성이 스스로 빛난다면 차고 기우는 모양이 생기지 않습니다. 위상은 햇빛을 반사하기 때문에 생깁니다."],
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
    var ex = 0.4, playing = !REDUCE;
    var GAL = (function () { var R = K.rng(77), out = [], i; for (i = 0; i < 16; i++) { var a = R() * 6.2832, d = 0.25 + R() * 0.75; out.push({ a: a, d: d, tilt: R() * 3, s: 0.7 + R() * 0.6 }); } return out; })();
    function galaxy(x, y, s, tilt, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(tilt);
      var gg = ctx.createRadialGradient(0, 0, 0, 0, 0, 9 * s); gg.addColorStop(0, "rgba(255,240,210,.95)"); gg.addColorStop(.35, "rgba(200,180,255,.55)"); gg.addColorStop(1, "rgba(140,120,255,0)");
      ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(0, 0, 10 * s, 4.2 * s, 0, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      /* ── 왼쪽: 허블의 그래프 (밝은 카드 그래프) ── */
      var LW = 560, i;
      K.studio(ctx, 0, 0, LW, H, { x: 290, y: H - 10, rx: 260, ry: 12 });
      var g = K.chart(ctx, { x: 0, y: 0, w: LW, h: H, pl: 60, pt: 26, pb: 40, pr: 20, x0: 0, x1: 100, y0: 0, y1: 8000, xt: 4, yt: 4, light: true, xl: "은하까지 거리 (Mpc)", yl: "멀어지는 속력 (km/s)" });
      var xe = Math.min(100, 8000 / h), r = rms(h), ok = Math.abs(h - 70) <= 2;
      for (i = 0; i < D.length; i++) K.line(ctx, { x: g.X(D[i]), y: g.Y(VEL[i]) }, { x: g.X(D[i]), y: g.Y(Math.min(8000, h * D[i])) }, "rgba(224,49,49,.75)", 1.5, [3, 3]);
      K.plot(ctx, g, [[0, 0], [xe, h * xe]], ok ? LT.green : LT.orange, { w: 3.2, light: true });
      for (i = 0; i < D.length; i++) {
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(g.X(D[i]), g.Y(VEL[i]), 7, 0, 6.2832); ctx.fill();
        K.planet(ctx, g.X(D[i]), g.Y(VEL[i]), 5.5, "#7cc0ff", "#174a8c");
      }
      K.bigText(ctx, "H = " + h, g.L + 14, g.T + 38, 26, ok ? "#8ce99a" : "#ffffff");
      K.bigText(ctx, "평균 어긋남 " + r.toFixed(0) + " km/s", g.L + 14, g.T + 64, 15, "#ffd35a");
      lpill(ctx, "━ 속력 = " + h + " × 거리", g.R - 4, g.B - 40, { s: 11.5, a: "right", c: ok ? LT.green : LT.orange });
      lpill(ctx, "● 은하 자료   ┇ 직선과의 어긋남", g.R - 4, g.B - 12, { s: 11, a: "right", c: LT.mute });

      /* ── 오른쪽: 우주 무대 위 늘어나는 격자 (입체) — 은하는 격자에 붙어 있고 격자 전체가 커진다 ── */
      var RX = LW + 8, RW = W - RX, cx = RX + RW / 2, cy = 152, sc = 1 + 0.35 * ex, fade = ex > 0.85 ? (1 - ex) / 0.15 : (ex < 0.1 ? ex / 0.1 : 1), s0 = 29 * sc;
      K.stage(ctx, RX, 0, RW, H, "space", { seed: 43 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(RX, 0, RW, H, 14); ctx.clip();
      function GP(u, w2) { return { x: cx + (u - w2) * 0.87 * s0, y: cy + (u + w2) * 0.42 * s0 }; }
      var c0 = GP(-2.4, -2.4), c1 = GP(2.4, -2.4), c2 = GP(2.4, 2.4), c3 = GP(-2.4, 2.4);
      ctx.fillStyle = "rgba(110,120,230,.12)"; ctx.beginPath(); ctx.moveTo(c0.x, c0.y); ctx.lineTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(160,175,255,.35)"; ctx.lineWidth = 1;
      for (i = -2; i <= 2; i++) {
        var a1 = GP(i, -2.4), a2 = GP(i, 2.4), b1 = GP(-2.4, i), b2 = GP(2.4, i);
        ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.stroke();
      }
      var al = clamp(fade, 0, 1), RG = K.rng(17);
      for (var u = -2; u <= 2; u++) for (var w2 = -2; w2 <= 2; w2++) {
        if (!u && !w2) continue;
        var p = GP(u + (RG() - .5) * .4, w2 + (RG() - .5) * .4), dd = Math.hypot(p.x - cx, p.y - cy) / s0;
        var ux = (p.x - cx) / (dd * s0 || 1), uy = (p.y - cy) / (dd * s0 || 1), Lr = 7 * dd;
        K.arrow(ctx, { x: p.x + ux * 8, y: p.y + uy * 8 }, { x: p.x + ux * (8 + Lr), y: p.y + uy * (8 + Lr) }, rgba(KC.red, .8 * al), 1.6, 6);
        galaxy(p.x, p.y, 0.75 + RG() * .4, RG() * 3, al);
      }
      ctx.restore();
      galaxy(cx, cy, 1.5, .4, 1);
      K.pill(ctx, "우리 은하", cx, cy + 26, { s: 11, a: "center", c: KC.ink });
      K.pill(ctx, "우리 은하에서 본 이웃 은하들", RX + 16, 28, { s: 12.5, c: KC.blue, box: [RX, W] });
      K.pill(ctx, "격자 전체가 늘어나 멀수록 화살표(속력)가 길다", cx, H - 14, { s: 11, a: "center", c: KC.red, box: [RX, W] });
      readout(r, ok);
      return ok;
    }
    function readout(r, ok) {
      put("b-hub-read",
        "<span class='k'>기울기</span><span class='v " + (ok ? "g" : "y") + "'>H = " + h + " km/s/Mpc</span>" +
        "<span class='k'>평균 어긋남</span><span class='v r'>" + r.toFixed(0) + " km/s</span>" +
        "<span class='k'>우주의 나이 ≈ 1/H</span><span class='v b'>≈ " + (9778 / h).toFixed(0) + "억 년</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "자료에 가장 잘 맞는 기울기" : (h < 70 ? "직선이 먼 은하들 아래로 지납니다" : "직선이 먼 은하들 위로 지납니다")) + "</span>");
    }
    function update() {
      var ok = draw();
      put("b-hub-info", "기울기 H = " + h + " 일 때 직선과 은하 자료의 평균 어긋남은 " + rms(h).toFixed(0) + " km/s입니다. "
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
    playBtn("b-hub-play", "⏸ 팽창 멈추기", "▶ 팽창 보기", function () { return playing; }, function (q) { playing = q; });
    if (REDUCE) ex = 0.5;
    K.animate(canvas, function (dt) { if (playing) { ex = (ex + dt / 6000) % 1; draw(); } });
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
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>1543 → 1610 → 1638 → 1861 → 1929 → 1960년대. 어느 경우에도 권위나 유행이 아니라 새로운 관측과 실험이 세계관을 바꾸었습니다. 대륙 이동설은 1912년 베게너가 제안했지만 증거가 쌓인 1960년대에야 받아들여졌습니다."); ep.clear(3); ep.clear(4); }
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
    { key: "rInq", label: "교과서 실험" },
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
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "두 사건을 꿰는 한 문장" }
});

})();
