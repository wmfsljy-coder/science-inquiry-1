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
function meter(ctx, x, y, w, h, f, c) {
  ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = "rgba(200,210,255,.22)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.stroke();
  f = clamp(f, 0, 1); if (f <= 0) return;
  var g = ctx.createLinearGradient(x, 0, x + w * f, 0); g.addColorStop(0, shade(c, .55)); g.addColorStop(1, c);
  ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.fillStyle = g;
  ctx.beginPath(); ctx.roundRect(x, y, Math.max(h, w * f), h, h / 2); ctx.fill(); ctx.restore();
}
function playBtn(id, onLabel, offLabel, get, set) {
  var b = $(id); if (!b) return;
  function lab() { b.textContent = get() ? onLabel : offLabel; }
  b.addEventListener("click", function () { set(!get()); lab(); }); lab();
}
/* 유리 판 */
function glass(ctx, x, y, w, h, c, r) {
  var g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, rgba(c, .20)); g.addColorStop(1, rgba(c, .05));
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 12 : r); ctx.fill();
  ctx.strokeStyle = rgba(c, .40); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 12 : r); ctx.stroke();
}
/* 귀뚜라미: (x, y) 몸 가운데, s 크기 */
function cricket(ctx, x, y, s, wing) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = "#a07a4a"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-10, 6); ctx.lineTo(-26, -10); ctx.lineTo(-34, 14); ctx.stroke();      /* 뒷다리 */
  ctx.beginPath(); ctx.moveTo(6, 8); ctx.lineTo(10, 16); ctx.moveTo(14, 8); ctx.lineTo(20, 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(24, -4); ctx.quadraticCurveTo(44, -30, 60, -26); ctx.moveTo(24, -2); ctx.quadraticCurveTo(46, -18, 62, -8); ctx.stroke();   /* 더듬이 */
  var bg = ctx.createLinearGradient(0, -10, 0, 10); bg.addColorStop(0, "#6b4a2a"); bg.addColorStop(1, "#2a1a0e");
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, 24, 9, 0, 0, 6.2832); ctx.fill();
  var hg = ctx.createRadialGradient(18, -3, 1, 22, 0, 9); hg.addColorStop(0, "#8a6238"); hg.addColorStop(1, "#2a1a0e");
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(22, 0, 8, 0, 6.2832); ctx.fill();
  ctx.fillStyle = "#ffe9b0"; ctx.beginPath(); ctx.arc(25, -3, 1.4, 0, 6.2832); ctx.fill();
  ctx.save(); ctx.rotate(-(wing || 0) * .18);
  var wg = ctx.createLinearGradient(-20, -10, 10, 0); wg.addColorStop(0, "rgba(200,170,120,.75)"); wg.addColorStop(1, "rgba(120,90,60,.55)");
  ctx.fillStyle = wg; ctx.beginPath(); ctx.ellipse(-4, -5, 20, 6, -.05, 0, 6.2832); ctx.fill(); ctx.restore();
  ctx.restore();
}
/* 울음 소리 물결 */
function chirpWaves(ctx, x, y, ph, col) {
  for (var i = 0; i < 3; i++) {
    var u = (ph + i / 3) % 1;
    ctx.strokeStyle = rgba(col, (1 - u) * .8); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 14 + u * 46, -0.7, 0.7); ctx.stroke();
  }
}
/* 유리 온도계 */
function thermo(ctx, x, y, h, f) {
  var gg = ctx.createLinearGradient(x - 8, 0, x + 8, 0); gg.addColorStop(0, "rgba(255,255,255,.10)"); gg.addColorStop(.5, "rgba(255,255,255,.28)"); gg.addColorStop(1, "rgba(255,255,255,.08)");
  ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(x - 7, y, 14, h, 7); ctx.fill();
  ctx.strokeStyle = "rgba(220,230,255,.45)"; ctx.lineWidth = 1.2; ctx.stroke();
  var lh = (h - 8) * clamp(f, 0, 1), lg = ctx.createLinearGradient(x - 4, 0, x + 4, 0); lg.addColorStop(0, "#c2283f"); lg.addColorStop(.5, "#ff6b81"); lg.addColorStop(1, "#b01f36");
  ctx.fillStyle = lg; ctx.fillRect(x - 3, y + h - lh, 6, lh + 4);
  ctx.save(); ctx.shadowColor = "#ff6b81"; ctx.shadowBlur = 10; K.planet(ctx, x, y + h + 8, 11, "#ff6b81", "#8a1428"); ctx.restore();
}

/* ---- 스튜디오 + 블록 모형 공용 도구 (_tools/STUDIO_GUIDE.md) ---- */
var LT = K.LT;
/* 움직이지 않는 부분(블록·지형)은 숨은 캔버스에 한 번 그려 두고 붙인다. 글자는 늘 바깥(본 캔버스)에 쓴다 */
function layer(canvas) {
  var off = null, key = null;
  return function (ctx, k, paint) {
    if (!off || key !== k || off.width !== canvas.width) {
      off = off || document.createElement("canvas");
      off.width = canvas.width; off.height = canvas.height; off._w = canvas._w; off._h = canvas._h;
      var c = off.getContext("2d"), dpr = canvas.width / canvas._w;
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, canvas._w, canvas._h);
      paint(c); key = k;
    }
    ctx.drawImage(off, 0, 0, canvas._w, canvas._h);
  };
}
function fitFont(c, s, size, w, maxW) { var z = size; c.font = (w || "900") + " " + z + "px " + FONT; while (c.measureText(s).width > maxW && z > 10) { z -= 0.5; c.font = (w || "900") + " " + z + "px " + FONT; } return z; }
/* 오른쪽 흰 판정 카드: o = { title, head, headCol, sub, rows: [[이름, 값, 색]], gap, bar: [비율, 색, 왼쪽 글, 오른쪽 글, 눈금 비율], tip: [글, 좋음], foot: [글…] } */
function judgeCard(c, x, y, w, h, o) {
  K.card(c, x, y, w, h, o.title || "판정");
  var px = x + 18, pr = x + w - 18, yy = y + 62;
  if (o.head) { var hs = fitFont(c, o.head, o.headS || 21, "900", pr - px); K.t(c, o.head, px, yy, { s: hs, w: "900", c: o.headCol || LT.ink }); yy += 8; }
  if (o.sub) { K.t(c, o.sub, px, yy + 14, { s: 11.5, w: "700", c: LT.mute }); yy += 18; }
  yy += 28;
  (o.rows || []).forEach(function (r) { K.row(c, r[0], r[1], px, pr, yy, r[2]); yy += o.gap || 27; });
  if (o.bar) {
    yy -= 6; K.bar(c, px, yy, pr - px, o.bar[0], o.bar[1]);
    if (o.bar[4] != null) { var mx = px + (pr - px) * o.bar[4]; c.strokeStyle = LT.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(mx, yy - 4); c.lineTo(mx, yy + 14); c.stroke(); }
    if (o.bar[2]) K.t(c, o.bar[2], px, yy + 26, { s: 10.5, w: "600", c: LT.mute });
    if (o.bar[3]) K.t(c, o.bar[3], pr, yy + 26, { s: 10.5, w: "600", a: "right", c: LT.mute });
    yy += 40;
  }
  if (o.tip) {
    var good = o.tip[1], tw = pr - px + 12;
    c.fillStyle = good ? "#e7f7f0" : (good === false ? "#fdeee4" : "#eef1f5"); c.beginPath(); c.roundRect(px - 6, yy, tw, 32, 10); c.fill();
    var ts = fitFont(c, o.tip[0], 12, "800", tw - 18);
    K.t(c, o.tip[0], px + 4, yy + 21, { s: ts, w: "800", c: good ? "#0f766e" : (good === false ? "#b4400c" : LT.mute) });
    yy += 46;
  }
  (o.foot || []).forEach(function (s) { K.t(c, s, px, yy + 10, { s: 11, w: "600", c: LT.mute }); yy += 18; });
  return yy;
}
/* 밝은 바탕용 유리 온도계(나무 말뚝에 꽂힘): (x, y) 관 꼭대기, h 관 길이, f 0~1 */
function thermoLT(c, x, y, h, f) {
  var sg = c.createLinearGradient(x - 4, 0, x + 4, 0); sg.addColorStop(0, "#8a6440"); sg.addColorStop(1, "#5a3d26");
  c.fillStyle = sg; c.fillRect(x - 4, y + h + 14, 8, 22);
  c.fillStyle = "rgba(0,0,0,.18)"; c.beginPath(); c.ellipse(x + 6, y + h + 36, 12, 3.5, 0, 0, 6.2832); c.fill();
  var pg = c.createLinearGradient(x - 14, 0, x + 14, 0); pg.addColorStop(0, "#f3efe6"); pg.addColorStop(1, "#cfc6b4");
  c.fillStyle = pg; c.beginPath(); c.roundRect(x - 14, y - 8, 28, h + 34, 6); c.fill(); c.strokeStyle = "rgba(90,70,40,.45)"; c.lineWidth = 1; c.stroke();
  c.strokeStyle = "rgba(60,50,40,.55)"; c.lineWidth = 1;
  for (var i = 0; i <= 7; i++) { var ty = y + h - (h - 6) * i / 7; c.beginPath(); c.moveTo(x - 12, ty); c.lineTo(x - (i % 2 ? 8 : 6), ty); c.stroke(); }
  var gg = c.createLinearGradient(x - 5, 0, x + 5, 0); gg.addColorStop(0, "rgba(255,255,255,.95)"); gg.addColorStop(.5, "rgba(225,235,245,.9)"); gg.addColorStop(1, "rgba(170,185,205,.95)");
  c.fillStyle = gg; c.beginPath(); c.roundRect(x - 5, y, 10, h + 4, 5); c.fill(); c.strokeStyle = "rgba(60,80,110,.55)"; c.stroke();
  var lh = (h - 6) * clamp(f, 0, 1), lg = c.createLinearGradient(x - 3, 0, x + 3, 0); lg.addColorStop(0, "#a5172e"); lg.addColorStop(.5, "#ef4058"); lg.addColorStop(1, "#a5172e");
  c.fillStyle = lg; c.fillRect(x - 2.5, y + h - lh, 5, lh + 6);
  K.planet(c, x, y + h + 8, 8, "#ff5a70", "#8a1428");
}
/* 풀밭 블록(야영장 땅을 잘라 낸 모형). frost 면 서리 내린 추운 밤 */
function grassBlock(c, I, Z, frost) {
  var L = I.L, D = I.D, i;
  ["front", "right"].forEach(function (side) {
    I.face(c, side, function (Lw) {
      var g = c.createLinearGradient(0, 0, 0, Z); g.addColorStop(0, "#6b4a2e"); g.addColorStop(1, "#9a7148");
      c.fillStyle = g; c.fillRect(0, 0, Lw, Z);
      c.fillStyle = "#3f2a18"; c.fillRect(0, Z - 7, Lw, 7);
      var R = K.rng(side === "front" ? 5 : 9);
      for (i = 0; i < Lw * 0.6; i++) { c.fillStyle = R() > .5 ? "rgba(255,235,200,.35)" : "rgba(40,25,10,.35)"; c.fillRect(R() * Lw, R() * (Z - 8), 1.6, 1.6); }
      c.strokeStyle = "rgba(235,215,175,.55)"; c.lineWidth = 0.9;
      for (i = 0; i < Lw / 22; i++) { var u = R() * Lw; c.beginPath(); c.moveTo(u, Z - 6); c.quadraticCurveTo(u + 4, Z - 14, u + (R() - .5) * 10, Z - 16 - R() * 10); c.stroke(); }
      for (i = 0; i < Lw / 30; i++) K.planet(c, R() * Lw, 3 + R() * (Z - 14), 1.6 + R() * 1.8, "#c9c1b3", "#6d655a");
    });
  });
  I.shade(c, "front", function () { return Z; }); I.shade(c, "right", function () { return Z; });
  I.top(c, function () { return Z; }, function (k) { return frost ? (k % 2 ? "#a9c2bc" : "#b3cbc5") : (k % 2 ? "#5d9c43" : "#64a448"); }, 24);
  var R2 = K.rng(frost ? 77 : 71);
  for (i = 0; i < 230; i++) {
    var p = I.P(4 + R2() * (L - 8), 4 + R2() * (D - 8), Z), hh = 4 + R2() * 7;
    c.strokeStyle = frost ? (R2() > .5 ? "rgba(235,245,250,.9)" : "rgba(120,150,150,.8)") : (R2() > .5 ? "#3f7f2c" : "#86c35a");
    c.lineWidth = 1.1; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + (R2() - .5) * 4, p.y - hh); c.stroke();
  }
  if (frost) for (i = 0; i < 60; i++) { var q = I.P(R2() * L, R2() * D, Z); c.fillStyle = "rgba(255,255,255,.95)"; c.fillRect(q.x, q.y - 2, 1.8, 1.8); }
  I.edges(c, Z, Z);
}
/* 작은 텐트(삼각 기둥): x0~x1 방향으로 용마루 */
function tent(c, I, x0, x1, y0, y1, z, h, col) {
  var ym = (y0 + y1) / 2, a = I.P(x0, y1, z), b = I.P(x1, y1, z), r1 = I.P(x1, ym, z + h), r0 = I.P(x0, ym, z + h), e = I.P(x1, y0, z);
  c.fillStyle = "rgba(0,0,0,.16)"; c.beginPath(); c.moveTo(a.x + 6, a.y + 2); c.lineTo(b.x + 10, b.y + 2); c.lineTo(e.x + 8, e.y + 2); c.closePath(); c.fill();
  I.quad(c, a, b, r1, r0, col);
  c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(e.x, e.y); c.lineTo(r1.x, r1.y); c.closePath(); c.fillStyle = K.tint(col, 0.72); c.fill();
  var d0 = I.P(x1, ym - (ym - y0) * 0.45, z), d1 = I.P(x1, ym + (y1 - ym) * 0.45, z), dt = I.P(x1, ym, z + h * 0.62);
  c.beginPath(); c.moveTo(d0.x, d0.y); c.lineTo(d1.x, d1.y); c.lineTo(dt.x, dt.y); c.closePath(); c.fillStyle = "#3a2a20"; c.fill();
  c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(r0.x, r0.y); c.lineTo(r1.x, r1.y); c.stroke();
}
/* 밝은 바탕용 입체 막대(앞면·윗면·옆면) */
function bar3(c, x, top, w, bottom, col, dx, dy) {
  dx = dx == null ? 9 : dx; dy = dy == null ? 6 : dy;
  if (bottom - top < 0.5) top = bottom - 0.5;
  c.fillStyle = K.tint(col, 0.62); c.beginPath(); c.moveTo(x + w, top); c.lineTo(x + w + dx, top - dy); c.lineTo(x + w + dx, bottom - dy); c.lineTo(x + w, bottom); c.closePath(); c.fill();
  c.fillStyle = K.tint(col, 1.25); c.beginPath(); c.moveTo(x, top); c.lineTo(x + dx, top - dy); c.lineTo(x + w + dx, top - dy); c.lineTo(x + w, top); c.closePath(); c.fill();
  var g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, K.tint(col, 1.08)); g.addColorStop(1, K.tint(col, 0.88));
  c.fillStyle = g; c.fillRect(x, top, w, bottom - top);
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
    var ph = 0, playing = !REDUCE;
    /* 오른쪽: 야영장 풀밭을 잘라 낸 블록(텐트·온도계·귀뚤라미) / 왼쪽: 밝은 기록 그래프 / 맨 오른쪽: 판정 카드 */
    var LS = 690, I = K.iso({ ox: 552, oy: 196, s: 0.72, L: 220, D: 150 }), ZG = 30, bgL = layer(canvas);
    function scenery(c) {
      var f = I.P(I.L, I.D, 0);
      K.studio(c, 0, 0, LS, H, { x: f.x - 50, y: f.y - 10, rx: 220, ry: 46 });
      c.save(); c.beginPath(); c.roundRect(0, 0, LS, H, 14); c.clip();
      grassBlock(c, I, ZG, false);
      tent(c, I, 18, 96, 12, 74, ZG, 46, "#f08a3c");
      I.box(c, 120, 18, ZG, 168, 46, ZG + 3, "#d9b47c", "#a8834f", "#8a6a3c");          /* 기록하는 나무 상판 */
      I.box(c, 124, 22, ZG + 3, 146, 40, ZG + 4.5, "#fbfaf4", "#e6e2d6", "#cfc9b8");    /* 기록장 */
      c.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, e = err(n, b), ok = n >= 8 && b === 5, last = n - 1;
      bgL(ctx, "g", scenery);
      /* ── 왼쪽: 기록 그래프 ── */
      var g = K.chart(ctx, { x: 0, y: 100, w: 438, h: H - 100, pl: 52, pt: 16, pb: 40, pr: 12, x0: 0, x1: 30, y0: 0, y1: 35, xt: 3, yt: 7, light: true, xf: function (q) { return q + "번"; }, yf: function (q) { return q + "°"; }, xl: "8초 동안 우는 횟수", yl: "기온(°C)" });
      var xe = Math.min(30, 35 - b);
      for (i = 0; i < n; i++) K.line(ctx, { x: g.X(N[i]), y: g.Y(T[i]) }, { x: g.X(N[i]), y: g.Y(N[i] + b) }, LT.red, 1.4, [3, 3]);
      K.plot(ctx, g, [[0, b], [xe, xe + b]], ok ? LT.green : LT.yellow, { w: 3.2, light: true });
      for (i = 0; i < n; i++) { ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(g.X(N[i]), g.Y(T[i]), 5.5, 0, 6.2832); ctx.fill(); K.planet(ctx, g.X(N[i]), g.Y(T[i]), 4.4, "#3fcf9a", "#0b6b4c"); }
      ctx.strokeStyle = LT.green; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(g.X(N[last]), g.Y(T[last]), 10, 0, 6.2832); ctx.stroke();
      K.pill(ctx, "━ 우는 횟수 + " + b + " = 기온", g.L + 10, g.T + 22, { s: 12, c: ok ? "#7cf0b5" : "#ffd35a" });
      K.pill(ctx, "● 관찰한 밤  ┇ 규칙과의 어긋남", g.R - 4, g.B - 12, { s: 11, a: "right", c: "#e8ecff" });
      /* ── 오른쪽: 그날 밤의 온도계와 귀뚤라미 ── */
      var tp = I.P(196, 34, ZG); thermoLT(ctx, tp.x, tp.y - 132, 96, T[last] / 35);
      var cp = I.P(112, 116, ZG);
      ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(cp.x + 4, cp.y + 4, 32, 6, 0, 0, 6.2832); ctx.fill();
      chirpWaves(ctx, cp.x + 48, cp.y - 14, ph, "#e8590c");
      cricket(ctx, cp.x, cp.y - 8, 1.1, Math.sin(ph * 6.2832 * 3));
      var box = [0, LS];
      I.label(ctx, 100, 120, ZG + 4, "귀뚤라미 · 8초에 " + N[last] + "번", -30, 62, "#ffd35a", box);
      var lp = { x: tp.x - 14, y: tp.y - 104 }; ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(lp.x - 18, lp.y - 14); ctx.stroke();
      K.pill(ctx, "온도계 " + T[last].toFixed(1) + " °C", lp.x - 20, lp.y - 10, { s: 12, a: "right", c: "#ffb0bc", box: box });
      /* 큰 글자 */
      K.bigText(ctx, ok ? "규칙 찾음 · 어긋남 " + e.toFixed(2) + " °C" : "평균 어긋남 " + e.toFixed(2) + " °C", 18, 48, 25, ok ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, (last + 1) + "번째 밤까지 · 우는 횟수 + " + b + " = 기온", 18, 80, 17, "#ffd35a");
      K.warn(ctx, LS - 14, H - 14, "⚠ 블록·생물 크기는 실제 비율이 아님", "right");
      /* 판정 카드 */
      judgeCard(ctx, 700, 0, W - 700, H, {
        head: ok ? "규칙을 찾았다" : (n < 8 ? "자료가 부족하다" : "□를 더 맞추자"), headCol: ok ? LT.green : (n < 8 ? LT.dim : LT.orange),
        rows: [["관찰한 밤", n + " / 12밤", n >= 8 ? LT.green : LT.ink], ["규칙", "횟수 + " + b], ["평균 어긋남", e.toFixed(2) + " °C", ok ? LT.green : LT.red], ["이번 밤", N[last] + "번 · " + T[last].toFixed(1) + "°C"]],
        bar: [n / 12, n >= 8 ? LT.green : LT.yellow, "0밤", "12밤 (│ = 8밤)", 8 / 12],
        tip: [ok ? "8밤 넘는 자료에 고르게 맞음" : (n < 8 ? "밤을 8밤 이상으로 늘리기" : "점과 직선을 가깝게"), ok ? true : null],
        foot: ["점 = 한 밤의 관찰", "점선 = 규칙과의 어긋남"]
      });
      readout(e, ok);
      return ok;
    }
    function readout(e, ok) {
      put("a-cr-read",
        "<span class='k'>관찰한 밤</span><span class='v b'>" + n + "밤</span>" +
        "<span class='k'>규칙</span><span class='v y'>횟수 + " + b + " = 기온</span>" +
        "<span class='k'>평균 어긋남</span><span class='v " + (ok ? "g" : "r") + "'>" + e.toFixed(2) + " °C</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "8밤 이상의 자료에 고르게 맞습니다" : (n < 8 ? "자료가 아직 적어요 · 밤을 늘려 보세요" : "자료는 충분 · □를 더 맞춰 보세요")) + "</span>");
    }
    function update() {
      var ok = draw(), e = err(n, b);
      put("a-cr-info", n + "밤의 자료에서 규칙 ‘우는 횟수 + " + b + " = 기온’의 평균 어긋남은 " + e.toFixed(2) + " °C입니다. "
        + (ok ? "✅ 8밤 이상의 자료에 고르게 잘 맞습니다. 여러 관찰에서 공통된 규칙을 이끌어 냈습니다." : (n < 8 ? "관찰한 밤이 적으면 우연히 잘 맞는 규칙이 여러 개 나올 수 있습니다. 밤의 수를 늘려 보세요." : "점들과 직선이 가장 가까워지는 □ 를 찾아보세요.")));
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
    playBtn("a-cr-play", "⏸ 울음소리 멈추기", "▶ 울음소리 듣기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) { if (playing) { ph = (ph + dt / 1000 * N[n - 1] / 24) % 1; draw();   /* 물결 하나 = 울음 한 번 (실제 빠르기) */ } });
    $("a-n").addEventListener("input", function (ev) { n = +ev.target.value; $("a-n-val").textContent = n + "밤"; update(); });
    $("a-b").addEventListener("input", function (ev) { b = +ev.target.value; $("a-b-val").textContent = "□ = " + b; update(); });
    window.sthPick({
      mount: "a-cr-pick",
      q: "첫째 밤 하나만 보면 ‘우는 횟수 + 4.5 = 기온’이 딱 맞습니다. 그런데도 여러 밤을 관찰해야 하는 까닭은?",
      options: ["한 번의 관찰에는 우연한 오차가 섞여 있어, 여러 번 관찰해야 공통된 규칙인지 믿을 수 있기 때문에", "관찰을 많이 하면 규칙이 저절로 바뀌기 때문에", "한 밤의 관찰은 과학적이지 않은 방법이기 때문에"],
      answer: 0,
      why: ["한 번 딱 맞은 것이 우연인지 규칙인지는 관찰을 늘려야 가릴 수 있습니다. 귀납적 탐구에서는 관찰의 수와 다양성이 결론의 믿음직함을 정합니다.", "규칙은 바뀌지 않습니다. 우리가 규칙을 더 정확히 알게 될 뿐입니다.", "한 번의 관찰도 과학적인 자료입니다. 다만 그것만으로 일반화하기에는 부족합니다."],
      onDone: function () { got.q = true; window.sthState("crGot", got); mission(); }
    });
    update(); mission();
  })();

  /* 장면 3 — 규칙이 통하지 않는 밤 */
  (function () {
    var canvas = $("a-c-lim"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, t = 24;
    var got = window.sthState("limGot") || { a: false, q: false };
    function chirp(tt) { return tt < 13 ? 0 : Math.round(tt - 5); }
    var ph = 0, playing = !REDUCE;
    /* 왼쪽: 입체 기온 눈금 막대 / 가운데: 그날 밤의 풀밭 블록(추우면 서리) / 오른쪽: 판정 카드 */
    var LS = 690, I = K.iso({ ox: 552, oy: 186, s: 0.72, L: 220, D: 150 }), ZG = 30, bgL = layer(canvas);
    function scenery(c, frost) {
      var f = I.P(I.L, I.D, 0);
      K.studio(c, 0, 0, LS, H, { x: f.x - 50, y: f.y - 10, rx: 220, ry: 46 });
      c.save(); c.beginPath(); c.roundRect(0, 0, LS, H, 14); c.clip();
      grassBlock(c, I, ZG, frost);
      tent(c, I, 18, 96, 12, 74, ZG, 46, frost ? "#7da0c8" : "#f08a3c");
      c.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var x0 = 40, x1 = 400, y = 268, i;
      function X(tt) { return x0 + (tt - 0) / 36 * (x1 - x0); }
      var c = chirp(t), pred = c + 5, bad = t < 13, out = t < 15.5 || t > 29.5;
      bgL(ctx, bad ? "f" : "g", function (cc) { scenery(cc, bad); });
      /* ── 왼쪽: 입체 기온 눈금 막대 ── */
      ctx.fillStyle = "rgba(20,30,50,.16)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, y + 22, (x1 - x0) / 2 + 20, 9, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(46,139,87,.14)"; ctx.beginPath(); ctx.roundRect(X(15.5), y - 46, X(29.5) - X(15.5), 70, 10); ctx.fill();
      ctx.strokeStyle = LT.green; ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.roundRect(X(15.5), y - 46, X(29.5) - X(15.5), 70, 10); ctx.stroke(); ctx.setLineDash([]);
      K.t(ctx, "관찰한 범위 15.5~29.5 °C", (X(15.5) + X(29.5)) / 2, y - 56, { s: 12, w: "900", a: "center", c: LT.green });
      ctx.fillStyle = "#8a96a8"; ctx.beginPath(); ctx.moveTo(x0, y + 7); ctx.lineTo(x1, y + 7); ctx.lineTo(x1 + 8, y + 1); ctx.lineTo(x1 + 8, y - 13); ctx.lineTo(x1, y - 7); ctx.closePath(); ctx.fill();
      var tg = ctx.createLinearGradient(x0, 0, x1, 0); tg.addColorStop(0, "#2f6fe0"); tg.addColorStop(.45, "#5cc0f0"); tg.addColorStop(.7, "#f6c445"); tg.addColorStop(1, "#e8504a");
      ctx.fillStyle = tg; ctx.beginPath(); ctx.roundRect(x0, y - 7, x1 - x0, 14, 3); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x0 + 2, y - 6, x1 - x0 - 4, 3);
      ctx.strokeStyle = LT.line; ctx.lineWidth = 1.4;
      for (i = 0; i <= 36; i += 2) { ctx.beginPath(); ctx.moveTo(X(i), y + 10); ctx.lineTo(X(i), y + (i % 10 === 0 ? 19 : 14)); ctx.stroke(); }
      [0, 10, 20, 30].forEach(function (tt) { K.t(ctx, tt + "°C", X(tt), y + 34, { s: 11, a: "center", c: LT.mute, w: "700" }); });
      /* 실제 기온(위 삼각표)과 규칙이 맞힌 기온(아래 삼각표) */
      ctx.fillStyle = LT.ink; ctx.beginPath(); ctx.moveTo(X(t), y - 9); ctx.lineTo(X(t) - 8, y - 23); ctx.lineTo(X(t) + 8, y - 23); ctx.closePath(); ctx.fill();
      K.pill(ctx, "실제 " + t + "°C", X(t), y - 30, { s: 12, a: "center", c: "#ffffff", box: [0, 440] });
      ctx.fillStyle = bad ? LT.red : LT.blue; ctx.beginPath(); ctx.moveTo(X(pred), y + 40); ctx.lineTo(X(pred) - 8, y + 54); ctx.lineTo(X(pred) + 8, y + 54); ctx.closePath(); ctx.fill();
      K.pill(ctx, (bad ? "울음 없음 → 규칙은 " : "규칙이 맞힌 ") + pred + "°C", X(pred), y + 76, { s: 12, a: "center", c: bad ? "#ffb0bc" : "#bfe6ff", box: [0, 440] });
      /* ── 가운데: 그날 밤 ── */
      var tp = I.P(196, 34, ZG); thermoLT(ctx, tp.x, tp.y - 132, 96, t / 36);
      var cp = I.P(112, 116, ZG);
      ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(cp.x + 4, cp.y + 4, 32, 6, 0, 0, 6.2832); ctx.fill();
      if (c > 0) chirpWaves(ctx, cp.x + 48, cp.y - 14, ph, "#e8590c");
      cricket(ctx, cp.x, cp.y - 8, 1.1, c > 0 ? Math.sin(ph * 6.2832 * 3) : 0);
      var box = [0, LS];
      I.label(ctx, 100, 120, ZG + 4, c > 0 ? "귀뚜라미 · 8초에 " + c + "번" : "귀뚜라미 · 울지 않음", -10, 66, c > 0 ? "#ffd35a" : "#ffb0bc", box);
      var lp = { x: tp.x - 14, y: tp.y - 104 }; ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(lp.x - 18, lp.y - 14); ctx.stroke();
      K.pill(ctx, "온도계 " + t + " °C", lp.x - 20, lp.y - 10, { s: 12, a: "right", c: "#ffb0bc", box: box });
      /* 큰 글자 */
      K.bigText(ctx, bad ? "울지 않는 밤 — 규칙 고장" : "규칙이 맞힌 기온 " + pred + " °C", 18, 48, 25, bad ? "#ff9aac" : "#ffffff");
      K.bigText(ctx, "실제 " + t + " °C · 어긋남 " + Math.abs(t - pred) + " °C", 18, 80, 17, "#ffd35a");
      K.warn(ctx, LS - 14, H - 14, "⚠ 블록·생물 크기는 실제 비율이 아님", "right");
      /* 판정 카드 */
      judgeCard(ctx, 700, 0, W - 700, H, {
        head: bad ? "규칙이 안 통한다" : "규칙이 맞는다", headCol: bad ? LT.red : LT.green,
        rows: [["실제 기온", t + " °C"], ["귀뚜라미", c > 0 ? "8초에 " + c + "번" : "울지 않음", c > 0 ? LT.ink : LT.red], ["규칙의 답", pred + " °C", bad ? LT.red : LT.blue], ["어긋남", Math.abs(t - pred) + " °C", bad || Math.abs(t - pred) > 2 ? LT.red : LT.green]],
        bar: [t / 36, bad ? LT.blue : (out ? LT.yellow : LT.green), "0 °C", "36 °C"],
        tip: [bad ? "관찰 안 한 범위에서 깨짐" : (out ? "범위 밖 · 더 추운 밤은?" : "관찰한 범위 안"), bad ? true : null],
        foot: ["울지 않으면 횟수 0", "→ 규칙은 늘 5 °C"]
      });
      readout(c, pred, bad);
      return bad;
    }
    function readout(c, pred, bad) {
      put("a-lim-read",
        "<span class='k'>실제 기온</span><span class='v y'>" + t + " °C</span>" +
        "<span class='k'>귀뚜라미</span><span class='v b'>" + (c > 0 ? "8초에 " + c + "번" : "울지 않음") + "</span>" +
        "<span class='k'>규칙의 답</span><span class='v " + (bad ? "r" : "g") + "'>" + pred + " °C</span>" +
        "<span class='sub'>" + (bad ? "울지 않으면 늘 5 °C · 어긋남 " : "어긋남 ") + Math.abs(t - pred) + " °C" + "</span>" +
        "<span class='ok " + (bad ? "r" : "g") + "'>" + (bad ? "규칙이 통하지 않는 밤" : "규칙이 아직 맞습니다") + "</span>");
    }
    function update() {
      var bad = draw(), c = chirp(t);
      put("a-lim-info", "실제 기온 " + t + " °C 인 밤, 귀뚜라미는 " + (c > 0 ? "8초에 " + c + "번 울고 규칙은 " + (c + 5) + " °C라고 알려 줍니다." : "<b>울지 않습니다</b>. 규칙은 늘 5 °C라고 알려 줄 뿐입니다.")
        + (bad ? " ✅ 규칙이 통하지 않는 밤입니다. 귀뚜라미는 약 13 °C 아래에서는 울지 않습니다. 관찰하지 않은 범위였습니다." : (t < 15.5 || t > 29.5 ? " 관찰한 범위 밖이지만 아직은 맞습니다. 더 추운 밤은 어떨까요?" : " 관찰한 범위 안에서는 잘 맞습니다.")));
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
    playBtn("a-lim-play", "⏸ 울음소리 멈추기", "▶ 울음소리 듣기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) { if (playing && chirp(t) > 0) { ph = (ph + dt / 1000 * chirp(t) / 24) % 1; draw(); } });
    $("a-t").addEventListener("input", function (ev) { t = +ev.target.value; $("a-t-val").textContent = t + " °C"; update(); });
    window.sthPick({
      mount: "a-lim-pick",
      q: "귀납적 탐구로 얻은 규칙에 대한 설명으로 가장 알맞은 것은?",
      options: ["관찰을 12번이나 했으니 어떤 상황에서도 반드시 맞는다", "관찰한 범위 안에서는 믿을 만하지만, 새로운 관찰이 나오면 틀릴 수 있어 고쳐질 수 있다", "한 번이라도 틀리면 쓸모없는 규칙이므로 버려야 한다"],
      answer: 1,
      why: ["아무리 많이 관찰해도 관찰하지 않은 경우까지 보장하지는 못합니다. 흰 백조만 보던 유럽 사람들은 호주에서 검은 백조를 만났습니다.", "귀납의 결론은 확률적이고 잠정적입니다. 규칙에 ‘13 °C 이상에서’라는 조건을 붙여 고치면 됩니다.", "틀린 경우를 알게 되면 규칙이 통하는 조건을 더 정확히 적어 고칩니다. 버리는 것이 아닙니다."],
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
      { t: "케플러는 튀코 브라헤가 수십 년 동안 모은 화성 관측 자료에서 행성이 타원 궤도를 돈다는 규칙을 찾았다", a: "ind", why: "많은 관찰 자료에서 규칙을 발견했습니다. (실제로 케플러는 여러 가설을 세워 자료에 맞는지 시험하는 연역도 함께 썼습니다.)", hint: "규칙이 먼저인가요, 관찰이 먼저인가요?" },
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
    /* 오른쪽: '가설 시험대' — 병동 바닥 한 칸을 잘라 낸 블록 위에, 1병동에서 바꾼 조건(종·침대·세면대)의 입체 모형 */
    var LS = 690, I = K.iso({ ox: 556, oy: 200, s: 1, L: 150, D: 116 }), ZF = 14, bgL = layer(canvas);
    function floorBlock(c) {
      var f = I.P(I.L, I.D, 0);
      K.studio(c, 0, 0, LS, H, { x: f.x - 50, y: f.y - 8, rx: 200, ry: 44 });
      ["front", "right"].forEach(function (side) {
        I.face(c, side, function (Lw) {
          var g = c.createLinearGradient(0, 0, 0, ZF); g.addColorStop(0, "#8d8f94"); g.addColorStop(1, "#b9bbc0"); c.fillStyle = g; c.fillRect(0, 0, Lw, ZF);
          c.strokeStyle = "rgba(60,60,70,.35)"; c.lineWidth = 1; for (var u = 18; u < Lw; u += 26) { c.beginPath(); c.moveTo(u, 0); c.lineTo(u, ZF); c.stroke(); }
        });
      });
      I.shade(c, "front", function () { return ZF; }); I.shade(c, "right", function () { return ZF; });
      for (var i = 0; i < 6; i++) for (var j = 0; j < 5; j++) I.plane(c, ZF, (i + j) % 2 ? "#e9e3d6" : "#d8cfbd", null, i * 25, i * 25 + 25, j * 23.2, j * 23.2 + 23.2);
      I.box(c, 0, 0, ZF, I.L, 5, ZF + 70, "#e7e1d4", "#f3eee4", "#d2cabb");          /* 뒷벽 */
      I.edges(c, ZF, ZF);
    }
    function bell3(c, x, y, s) {
      var bg = c.createLinearGradient(x - s, 0, x + s, 0); bg.addColorStop(0, "#7a4e10"); bg.addColorStop(.4, "#f2cf72"); bg.addColorStop(1, "#8a5c18");
      c.fillStyle = bg; c.beginPath(); c.moveTo(x - s, y + s * 1.4); c.quadraticCurveTo(x - s * .85, y, x, y - s * .15); c.quadraticCurveTo(x + s * .85, y, x + s, y + s * 1.4); c.closePath(); c.fill();
      c.fillStyle = "#a8781f"; c.beginPath(); c.ellipse(x, y + s * 1.4, s * 1.04, s * .26, 0, 0, 6.2832); c.fill();
      c.fillStyle = "#4a3208"; c.beginPath(); c.ellipse(x, y + s * 1.42, s * .8, s * .16, 0, 0, 6.2832); c.fill();
      K.planet(c, x, y + s * 1.55, s * .2, "#e9c46a", "#5a3a08");
    }
    function prop(c) {
      var p, i;
      if (hyp === "bell") {
        I.box(c, 40, 54, ZF, 48, 62, ZF + 92, "#9a6a3c", "#8a5a30", "#6a4426"); I.box(c, 104, 54, ZF, 112, 62, ZF + 92, "#9a6a3c", "#8a5a30", "#6a4426");
        I.box(c, 36, 54, ZF + 92, 116, 62, ZF + 100, "#b07a45", "#8a5a30", "#6a4426");
        p = I.P(76, 58, ZF + 92); c.strokeStyle = "#5a3a20"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, p.y + 10); c.stroke();
        bell3(c, p.x, p.y + 14, 20);
        c.strokeStyle = "rgba(200,140,20,.6)"; c.lineWidth = 2;
        [1, 2].forEach(function (k) { c.beginPath(); c.arc(p.x, p.y + 30, 26 + k * 12, -0.5, 0.5); c.stroke(); c.beginPath(); c.arc(p.x, p.y + 30, 26 + k * 12, Math.PI - 0.5, Math.PI + 0.5); c.stroke(); });
        return [76, 58, ZF + 100];
      }
      if (hyp === "pose") {
        I.box(c, 22, 30, ZF, 28, 92, ZF + 46, "#6b7486", "#5b6474", "#4a5262");
        [[30, 30], [128, 30], [30, 86], [128, 86]].forEach(function (q) { I.box(c, q[0], q[1], ZF, q[0] + 5, q[1] + 5, ZF + 20, "#6b7486", "#5b6474", "#4a5262"); });
        I.box(c, 28, 30, ZF + 20, 134, 92, ZF + 30, "#f7f7f2", "#d9dee6", "#bfc6d2");
        I.box(c, 32, 36, ZF + 30, 52, 86, ZF + 35, "#ffffff", "#e7e9ee", "#d3d7df");
        I.box(c, 54, 32, ZF + 30, 132, 90, ZF + 40, "#9fb6d6", "#7f97ba", "#6a819f");
        I.box(c, 70, 44, ZF + 40, 120, 78, ZF + 47, "#a9c0de", "#869fc2", "#728aa8");
        p = I.P(42, 58, ZF + 38); K.planet(c, p.x, p.y, 8, "#f3c7a2", "#8a5636");
        return [80, 60, ZF + 47];
      }
      I.box(c, 52, 40, ZF, 110, 84, ZF + 52, "#b88a58", "#8a5e36", "#6a4628");
      I.box(c, 50, 38, ZF + 52, 112, 86, ZF + 56, "#d9b47c", "#a8834f", "#8a6a3c");
      p = I.P(80, 62, ZF + 57);
      c.fillStyle = "#f4f6f8"; c.beginPath(); c.ellipse(p.x, p.y, 30, 15, 0, 0, 6.2832); c.fill(); c.strokeStyle = "#9aa3ae"; c.lineWidth = 1.4; c.stroke();
      var wg = c.createLinearGradient(0, p.y - 10, 0, p.y + 10); wg.addColorStop(0, "#bfe9f5"); wg.addColorStop(1, "#4fb0cf");
      c.fillStyle = wg; c.beginPath(); c.ellipse(p.x, p.y + 1, 24, 11, 0, 0, 6.2832); c.fill();
      [-1, 1].forEach(function (sd) {
        var hx = p.x + sd * 10, sk = c.createLinearGradient(hx - 7, 0, hx + 7, 0); sk.addColorStop(0, "#d9976f"); sk.addColorStop(.5, "#f6cfae"); sk.addColorStop(1, "#cf8a62");
        c.fillStyle = sk; c.beginPath(); c.roundRect(hx - 6, p.y - 34, 12, 30, 6); c.fill();
      });
      for (i = 0; i < 5; i++) { c.fillStyle = "rgba(120,200,235,.9)"; c.beginPath(); c.arc(p.x - 14 + i * 7, p.y - 2 + (i % 2) * 4, 1.8, 0, 6.2832); c.fill(); }
      var j0 = I.P(100, 46, ZF + 56);
      var jg = c.createLinearGradient(j0.x - 8, 0, j0.x + 8, 0); jg.addColorStop(0, "#c9ced6"); jg.addColorStop(.5, "#ffffff"); jg.addColorStop(1, "#9aa3b0");
      c.fillStyle = jg; c.beginPath(); c.roundRect(j0.x - 8, j0.y - 26, 16, 26, 4); c.fill(); c.strokeStyle = "#8a929e"; c.lineWidth = 1; c.stroke();
      return [80, 62, ZF + 64];
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var a1 = avg(w1), a2 = avg(w2), ok = hyp === "hand" && m >= 6, hit = Math.abs(a1 - a2) < 1.5;
      bgL(ctx, "f", floorBlock);
      /* ── 왼쪽: 달마다의 사망률(밝은 그래프) ── */
      var g = K.chart(ctx, { x: 0, y: 100, w: 440, h: H - 100, pl: 50, pt: 16, pb: 34, pr: 12, x0: 0, x1: 18, y0: 0, y1: 14, xt: 6, yt: 7, light: true, xf: function () { return ""; }, yf: function (q) { return q + "%"; } });
      function X(i) { return g.X(i + 0.5); }
      ctx.save(); ctx.strokeStyle = LT.yellow; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(X(5.5), g.T); ctx.lineTo(X(5.5), g.B); ctx.stroke(); ctx.restore();
      K.pill(ctx, "조건을 바꾼 때", X(5.5) + 8, g.T + 20, { s: 11, c: "#ffd35a" });
      K.t(ctx, "바꾸기 전 6달", X(2.5), g.B + 18, { s: 11, w: "700", a: "center", c: LT.mute });
      K.t(ctx, "바꾼 뒤 " + m + "달", X(6 + (m - 1) / 2), g.B + 18, { s: 11, w: "700", a: "center", c: LT.mute });
      function path(fPre, fPost, col) {
        var pts = [];
        for (var i = 0; i < 6 + m; i++) pts.push([i + 0.5, i < 6 ? fPre(i) : fPost(i - 6)]);
        K.plot(ctx, g, pts, col, { w: 2.6, light: true });
        pts.forEach(function (p) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(g.X(p[0]), g.Y(p[1]), 4.2, 0, 6.2832); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(g.X(p[0]), g.Y(p[1]), 3, 0, 6.2832); ctx.fill(); });
      }
      path(function (i) { return 10 + PRE[i]; }, w1, LT.red);
      path(function (i) { return 3.2 + PRE[i] * 0.3; }, w2, LT.green);
      var lb = K.pill(ctx, "● 2병동(조산사)", g.R - 4, g.B - 10, { s: 11, a: "right", c: "#7cf0b5" });
      K.pill(ctx, "● 1병동(의사)", lb.x - 10, g.B - 10, { s: 11, a: "right", c: "#ff9aac" });
      /* ── 오른쪽: 시험대 위의 조건 ── */
      var top = prop(ctx);
      I.label(ctx, top[0], top[1], top[2], "1병동에서 바꾼 조건", 34, -22, "#ffffff", [0, LS]);
      K.pill(ctx, NAME[hyp], I.P(I.L / 2, I.D, 0).x + 30, H - 16, { s: 12, a: "center", c: "#ffd35a", box: [446, LS] });
      /* 큰 글자 */
      K.bigText(ctx, ok ? "예측 적중 — 가설을 지지" : (hit ? "예측대로 떨어졌다" : "예측이 빗나갔다"), 18, 48, 25, ok ? "#7cf0b5" : (hit ? "#ffffff" : "#ff9aac"));
      K.bigText(ctx, "1병동 " + a1.toFixed(1) + "% · 2병동 " + a2.toFixed(1) + "% · 바꾼 뒤 " + m + "달", 18, 80, 17, "#ffd35a");
      /* 판정 카드 */
      judgeCard(ctx, 700, 0, W - 700, H, {
        head: ok ? "가설 지지" : (hit ? "더 지켜보자" : "가설을 버린다"), headCol: ok ? LT.green : (hit ? LT.orange : LT.red),
        rows: [["1병동 평균", a1.toFixed(1) + "%", LT.red], ["2병동 평균", a2.toFixed(1) + "%", LT.green], ["차이", Math.abs(a1 - a2).toFixed(1) + "%p"], ["지켜본 달", m + "달", m >= 6 ? LT.green : LT.ink]],
        bar: [m / 12, m >= 6 ? LT.green : LT.yellow, "1달", "12달 (│ = 6달)", 6 / 12],
        tip: [ok ? "예측대로 · 6달 넘게 이어짐" : (hit ? "예측대로 · 아직 짧다" : "예측이 빗나갔다"), ok ? true : (hit ? null : false)],
        foot: ["예측: 1병동도 2병동처럼", "약 3%로 떨어질 것"]
      });
      readout(a1, a2, ok, hit);
      return ok;
    }
    function readout(a1, a2, ok, hit) {
      put("b-hyp-read",
        "<span class='k'>1병동 평균</span><span class='v r'>" + a1.toFixed(1) + "%</span>" +
        "<span class='k'>2병동 평균</span><span class='v g'>" + a2.toFixed(1) + "%</span>" +
        "<span class='sub'>바꾼 뒤 " + m + "달 동안 · 차이 " + Math.abs(a1 - a2).toFixed(1) + "%p</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "예측대로 떨어졌고 6달 넘게 이어졌습니다" : (hit ? "예측대로지만 아직 짧습니다" : "예측이 빗나갔습니다")) + "</span>");
    }
    function update() {
      var ok = draw(), a1 = avg(w1), a2 = avg(w2), hit = Math.abs(a1 - a2) < 1.5;
      put("b-hyp-info", "‘" + NAME[hyp] + "’ 뒤 " + m + "달 동안 1병동 평균 사망률은 " + a1.toFixed(1) + "%, 2병동은 " + a2.toFixed(1) + "%입니다. "
        + (ok ? "✅ 가설에서 이끌어 낸 예측대로 1병동의 사망률이 2병동 수준으로 떨어졌고, 6달 넘게 이어졌습니다." : (hit ? "예측대로 떨어졌지만 아직 몇 달 안 되었습니다. 우연이 아닌지 6달 이상 지켜보세요." : "예측대로라면 2병동 수준으로 떨어져야 하는데 그대로입니다. 이 가설은 지지되지 않습니다.")));
      if (ok && !got.a) { got.a = true; window.sthState("hypGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m2-2a"); if (got.q) done("m2-2b");
      if (got.a && got.q) {
        window.sthState("hypBest", "손 씻기 → 1병동 사망률 약 10%에서 3%로");
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

  /* 장면 3 — 공정한 비교 (두 병동을 잘라 본 블록 모형 + 조건 비교표) */
  (function () {
    var canvas = $("b-c-fair"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var wash = "1", season = "w", n = 80;
    var got = window.sthState("fairGot") || { a: false, q: false };
    var REF = { wash: "0", season: "s", n: 160 };
    var ph = 0, playing = !REDUCE;
    function diffs() {
      return { wash: wash !== REF.wash, season: season !== REF.season, n: n !== REF.n };
    }
    /* 블록 모형: 병동 하나 = 앞벽·옆벽을 잘라 낸 방. x 오른쪽 아래, y 왼쪽 아래, z 위 */
    var DH = 420, L = 250, D = 150, WH = 86, S = 0.92;
    var IA = K.iso({ ox: 150, oy: 215, s: S, L: L, D: D }), IB = K.iso({ ox: 590, oy: 215, s: S, L: L, D: D });
    function rowIcon(k, val, x, y) {
      var i;
      if (k === "wash") {
        var on = val === "소독수로 씻음";
        ctx.save(); if (on) { ctx.shadowColor = KC.blue; ctx.shadowBlur = 10; }
        var dg = ctx.createLinearGradient(x - 7, y - 10, x + 7, y + 8); dg.addColorStop(0, on ? "#d8f4ff" : "#6f7fb0"); dg.addColorStop(1, on ? "#2f86e0" : "#2a3358");
        ctx.fillStyle = dg; ctx.beginPath(); ctx.moveTo(x, y - 11); ctx.quadraticCurveTo(x + 9, y, x + 7, y + 4); ctx.arc(x, y + 3, 7, 0.15, Math.PI - 0.15); ctx.quadraticCurveTo(x - 9, y, x, y - 11); ctx.fill(); ctx.restore();
        if (!on) { ctx.strokeStyle = KC.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 9, y - 9); ctx.lineTo(x + 9, y + 9); ctx.stroke(); }
      } else if (k === "season") {
        if (val === "여름") K.sun(ctx, x, y, 5);
        else { ctx.strokeStyle = "#3b82c4"; ctx.lineWidth = 1.8; for (i = 0; i < 3; i++) { var a = i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 9, y - Math.sin(a) * 9); ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); ctx.stroke(); } K.glow(ctx, x, y, 1.6, "rgba(220,240,255,.9)", 3); }
      } else {
        K.planet(ctx, x - 4, y - 3, 4.5, "#f3c7a2", "#8a5636"); K.planet(ctx, x + 5, y + 2, 4.5, "#f3c7a2", "#8a5636");
      }
    }
    /* 벽의 창문: side "y" 는 뒷벽(y = 6), "x" 는 옆벽(x = 6) 안쪽 면 */
    function win(I, side, a0, a1, z0, z1, summer, seed) {
      function M(u, v) { var a = a0 + (a1 - a0) * u, z = z0 + (z1 - z0) * v; return side === "y" ? I.P(a, 6.5, z) : I.P(6.5, a, z); }
      var p00 = M(0, 0), p10 = M(1, 0), p11 = M(1, 1), p01 = M(0, 1), i;
      function quad() { ctx.beginPath(); ctx.moveTo(p00.x, p00.y); ctx.lineTo(p10.x, p10.y); ctx.lineTo(p11.x, p11.y); ctx.lineTo(p01.x, p01.y); ctx.closePath(); }
      ctx.save(); quad();
      var g = ctx.createLinearGradient(0, Math.min(p01.y, p11.y), 0, Math.max(p00.y, p10.y));
      if (summer) { g.addColorStop(0, "#4fb0f2"); g.addColorStop(1, "#d6efff"); } else { g.addColorStop(0, "#7f8ca0"); g.addColorStop(1, "#dfe5ec"); }
      ctx.fillStyle = g; ctx.fill(); ctx.clip();
      if (summer) {
        var sp = M(0.72, 0.76); K.glow(ctx, sp.x, sp.y, 4.5, "rgba(255,236,150,.98)", 4 + Math.sin(ph * 2) * 0.4);
        for (i = 0; i < 6; i++) { var tp = M(0.05 + i * 0.19, 0.06); ctx.fillStyle = i % 2 ? "#3f8f3a" : "#5aa845"; ctx.beginPath(); ctx.arc(tp.x, tp.y, 7 + (i % 2) * 2 + Math.sin(ph * 1.5 + i) * 0.7, 0, 6.2832); ctx.fill(); }
      } else {
        var s0 = M(0, 0), s1 = M(1, 0), s2 = M(1, 0.18), s3 = M(0, 0.18);
        ctx.fillStyle = "#f4f7fb"; ctx.beginPath(); ctx.moveTo(s0.x, s0.y); ctx.lineTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.lineTo(s3.x, s3.y); ctx.closePath(); ctx.fill();
        var R = K.rng(seed);
        for (i = 0; i < 16; i++) {
          var u = R(), v0 = R(), sp2 = 0.6 + R() * 0.6, vv = 1 - ((v0 + ph * 0.12 * sp2) % 1);
          var q = M(u + Math.sin(ph + i) * 0.02, vv);
          ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(q.x, q.y, 1.5, 0, 6.2832); ctx.fill();
        }
      }
      ctx.restore();
      ctx.strokeStyle = "#7a5a3a"; ctx.lineWidth = 3; quad(); ctx.stroke();
      ctx.lineWidth = 1.8;
      var m0 = M(0.5, 0), m1 = M(0.5, 1), m2 = M(0, 0.5), m3 = M(1, 0.5);
      ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.lineTo(m1.x, m1.y); ctx.moveTo(m2.x, m2.y); ctx.lineTo(m3.x, m3.y); ctx.stroke();
    }
    function bedXs(cnt) {
      var cols = Math.ceil(cnt / 2), sp = 176 / cols, bw = Math.min(22, sp - 5), out = [], i;
      for (i = 0; i < cnt; i++) out.push({ x: 66 + (i % cols) * sp + (sp - bw) / 2, y: i < cols ? 10 : 82, w: bw });
      return out;
    }
    function room(I, isWash, summer, num, seed) {
      var i;
      /* 바닥 판 */
      I.box(ctx, 0, 0, -10, L, D, 0, "#c9a57a", "#9c7a52", "#7d5f3e");
      ctx.strokeStyle = "rgba(90,60,30,.22)"; ctx.lineWidth = 1;
      for (i = 15; i < D; i += 15) { var f0 = I.P(6, i, 0), f1 = I.P(L, i, 0); ctx.beginPath(); ctx.moveTo(f0.x, f0.y); ctx.lineTo(f1.x, f1.y); ctx.stroke(); }
      /* 벽 두 장(앞벽·오른쪽 벽은 잘라 냄) */
      I.box(ctx, 0, 0, 0, L, 6, WH, "#e3ddd2", "#f4efe6", "#cfc7b9");
      I.box(ctx, 0, 0, 0, 6, D, WH, "#e3ddd2", "#d8d0c2", "#ece6dc");
      I.quad(ctx, I.P(6, 6.2, 0), I.P(L, 6.2, 0), I.P(L, 6.2, 20), I.P(6, 6.2, 20), "#a9bdb5");
      I.quad(ctx, I.P(6.2, 6, 0), I.P(6.2, D, 0), I.P(6.2, D, 20), I.P(6.2, 6, 20), "#9fb3ab");
      win(I, "y", 118, 188, 30, 72, summer, seed);
      win(I, "x", 36, 92, 30, 72, summer, seed + 7);
      /* 여름 햇살 / 겨울 찬 기운 */
      if (summer) I.quad(ctx, I.P(116, 14, 0.3), I.P(192, 14, 0.3), I.P(214, 74, 0.3), I.P(138, 74, 0.3), "rgba(255,226,140,.30)");
      else I.quad(ctx, I.P(6, 6, 0.3), I.P(L, 6, 0.3), I.P(L, D, 0.3), I.P(6, D, 0.3), "rgba(150,180,230,.13)");
      /* 깊이 순서대로 그릴 것들 */
      var items = [];
      bedXs(Math.round(num / 20)).forEach(function (b) {
        items.push({ d: b.x + b.y + 30, f: function () {
          var x0 = b.x, y0 = b.y, x1 = b.x + b.w;
          I.box(ctx, x0, y0, 0, x0 + 2, y0 + 3, 24, "#6b7486", "#5b6474", "#4a5262");
          I.box(ctx, x1 - 2, y0, 0, x1, y0 + 3, 24, "#6b7486", "#5b6474", "#4a5262");
          I.box(ctx, x0, y0 + 1, 18, x1, y0 + 3, 22, "#7b8496", "#5b6474", "#4a5262");
          I.box(ctx, x0, y0 + 3, 0, x1, y0 + 42, 11, "#f7f7f2", "#d9dee6", "#bfc6d2");
          I.box(ctx, x0 + 1, y0 + 16, 11, x1 - 1, y0 + 42, 14, "#9fb6d6", "#7f97ba", "#6a819f");
          I.box(ctx, x0 + 3, y0 + 5, 11, x1 - 3, y0 + 13, 14, "#ffffff", "#e7e9ee", "#d3d7df");
          var hp = I.P(b.x + b.w / 2, y0 + 10, 17.5);
          K.planet(ctx, hp.x, hp.y, 3.6, "#f3c7a2", "#8a5636");
        } });
      });
      items.push({ d: 28 + 120, f: function () {
        I.box(ctx, 21, 113, 0, 35, 127, 30, "#eef0f3", "#cfd5dd", "#b5bdc8");
        I.box(ctx, 6, 117, 50, 22, 121, 53, "#a8b0bb", "#8a929e", "#737b86");
        var c = I.P(28, 120, 31);
        ctx.fillStyle = "#f7f8fa"; ctx.beginPath(); ctx.ellipse(c.x, c.y, 13 * S, 6.5 * S, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#9aa3ae"; ctx.lineWidth = 1.2; ctx.stroke();
        if (isWash) {
          ctx.save(); ctx.shadowColor = "#4fc3ff"; ctx.shadowBlur = 10;
          ctx.fillStyle = "rgba(110,200,235,.92)"; ctx.beginPath(); ctx.ellipse(c.x, c.y + 0.5, 10 * S, 4.8 * S, 0, 0, 6.2832); ctx.fill(); ctx.restore();
          var a = I.P(22, 119, 51), bt = I.P(26, 119, 33);
          for (var k = 0; k < 3; k++) { var t = (ph * 1.4 + k / 3) % 1; ctx.fillStyle = "rgba(120,210,255,.95)"; ctx.beginPath(); ctx.arc(a.x + (bt.x - a.x) * t, a.y + (bt.y - a.y) * t, 1.7, 0, 6.2832); ctx.fill(); }
        } else {
          ctx.fillStyle = "rgba(160,150,130,.35)"; ctx.beginPath(); ctx.ellipse(c.x, c.y + 0.5, 10 * S, 4.8 * S, 0, 0, 6.2832); ctx.fill();
          ctx.strokeStyle = "#e5485f"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(c.x - 7, c.y - 9); ctx.lineTo(c.x + 7, c.y + 3); ctx.moveTo(c.x + 7, c.y - 9); ctx.lineTo(c.x - 7, c.y + 3); ctx.stroke();
        }
      } });
      items.push({ d: 46 + 136, f: function () { I.person(ctx, 46, 136, 0, "#2f3542", 1.8); } });
      items.sort(function (p, q) { return p.d - q.d; });
      items.forEach(function (it) { it.f(); });
      I.edges(ctx, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var d = diffs(), keys = ["wash", "season", "n"];
      var other = (d.season ? 1 : 0) + (d.n ? 1 : 0), ok = d.wash && other === 0;
      var mix = []; if (d.season) mix.push("계절"); if (d.n) mix.push("산모 수");
      /* ── 위: 두 병동 블록 모형 ── */
      K.studio(ctx, 0, 0, W, DH, { x: 450, y: 392, rx: 420, ry: 40 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      room(IA, false, true, REF.n, 11);
      room(IB, wash === "1", season === "s", n, 23);
      ctx.restore();
      var box = [0, W];
      function col(k, isB) { if (!isB || !d[k]) return "#eef1ff"; return k === "wash" ? "#9fd8ff" : "#ff9aac"; }
      [[IA, false], [IB, true]].forEach(function (pr) {
        var I = pr[0], isB = pr[1], tp = I.P(0, 0, WH);
        K.pill(ctx, isB ? "나 병동 (새 방법)" : "가 병동 (비교 기준)", tp.x, tp.y - 12, { s: 12.5, a: "center", c: isB ? KC.blue : KC.violet, box: box });
        var ws = isB ? (wash === "1" ? "소독수로 씻음" : "씻지 않음") : "씻지 않음";
        var ss = isB ? (season === "s" ? "여름" : "겨울") : "여름";
        var ns = isB ? n : REF.n;
        I.label(ctx, 160, 6, 74, "계절: " + ss, 34, -24, col("season", isB), box);
        I.label(ctx, 28, 120, 36, "손 씻기: " + ws, -16, 66, col("wash", isB), box);
        var bs = bedXs(Math.round(ns / 20)), lb = bs[bs.length - 1];
        I.label(ctx, lb.x + lb.w / 2, lb.y + 40, 14, "산모 " + ns + "명/달", 22, 22, col("n", isB), box);
      });
      if (ok) { K.bigText(ctx, "공정한 비교 완성", 22, 48, 28, "#7cf0b5"); K.bigText(ctx, "손 씻기 말고는 두 병동이 같다", 22, 82, 18, "#ffffff"); }
      else if (!d.wash) { K.bigText(ctx, "비교할 차이가 없다", 22, 48, 28, "#ffffff"); K.bigText(ctx, "두 병동 모두 손을 씻지 않는다", 22, 82, 18, "#ffd35a"); }
      else { K.bigText(ctx, "다른 조건이 섞였다", 22, 48, 28, "#ff9aac"); K.bigText(ctx, mix.join("·") + "까지 두 병동이 다르다", 22, 82, 18, "#ffffff"); }
      K.pill(ctx, "파랑 = 일부러 바꾼 조건", W - 14, 30, { s: 11, a: "right", c: KC.blue });
      K.pill(ctx, "빨강 = 섞인 다른 조건", W - 14, 56, { s: 11, a: "right", c: KC.red });
      K.warn(ctx, W - 14, 84, "⚠ 병동을 잘라서 줄인 모형 · 침대 1개 = 산모 20명", "right");

      /* ── 아래: 조건 비교표(흰 판정 카드) ── */
      var Y0 = DH + 10, rowsY = [Y0 + 70, Y0 + 104, Y0 + 138];
      var lab = ["손 씻기", "실험하는 계절", "한 달 산모 수"];
      var a = ["씻지 않음", "여름", REF.n + "명"], b = [wash === "1" ? "소독수로 씻음" : "씻지 않음", season === "s" ? "여름" : "겨울", n + "명"];
      K.card(ctx, 0, Y0, W, H - Y0, "두 병동의 조건 비교표");
      K.t(ctx, "가 병동 (비교 기준)", 186, Y0 + 30, { s: 12, w: "900", c: LT.violet });
      K.t(ctx, "나 병동 (새 방법)", 426, Y0 + 30, { s: 12, w: "900", c: LT.blue });
      keys.forEach(function (k, i) {
        var hc = k === "wash" ? "#1c7ed6" : "#e03131";
        if (d[k]) {
          ctx.fillStyle = rgba(hc, .10); ctx.beginPath(); ctx.roundRect(170, rowsY[i] - 18, 470, 30, 8); ctx.fill();
          ctx.strokeStyle = rgba(hc, .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.roundRect(170, rowsY[i] - 18, 470, 30, 8); ctx.stroke();
        } else { ctx.fillStyle = "#eef1f5"; ctx.beginPath(); ctx.roundRect(170, rowsY[i] - 18, 470, 30, 8); ctx.fill(); }
        K.t(ctx, lab[i], 24, rowsY[i] + 2, { s: 12.5, w: "700", c: LT.mute });
        rowIcon(k, a[i], 196, rowsY[i] - 3); K.t(ctx, a[i], 214, rowsY[i] + 2, { s: 13.5, w: "800", c: LT.ink });
        rowIcon(k, b[i], 436, rowsY[i] - 3); K.t(ctx, b[i], 454, rowsY[i] + 2, { s: 13.5, w: "800", c: LT.ink });
      });
      var vx = 660, vw = W - vx - 18, good = ok;
      ctx.fillStyle = good ? "#e7f7f0" : "#fdeee4"; ctx.beginPath(); ctx.roundRect(vx, rowsY[0] - 18, vw, rowsY[2] - rowsY[0] + 30, 12); ctx.fill();
      K.t(ctx, ok ? "✔ 공정한 비교" : "✘ 공정하지 않다", vx + 14, rowsY[0] + 10, { s: 16, w: "900", c: ok ? "#0f766e" : "#b4400c" });
      K.t(ctx, ok ? "손 씻기만 다르다" : (d.wash ? "다른 조건 " + other + "개가 섞였다" : "비교할 차이가 없다"), vx + 14, rowsY[0] + 34, { s: 12.5, w: "800", c: ok ? "#0f766e" : "#b4400c" });
      K.t(ctx, "파란 칸 = 일부러 바꾼 조건", vx + 14, rowsY[0] + 58, { s: 11, w: "700", c: LT.mute });
      K.t(ctx, "빨간 칸 = 섞인 다른 조건", vx + 14, rowsY[0] + 76, { s: 11, w: "700", c: LT.mute });
      return ok;
    }
    function update() {
      var ok = draw(), d = diffs();
      var mix = []; if (d.season) mix.push("계절"); if (d.n) mix.push("산모 수");
      put("b-fair-info", ok ? "✅ 두 병동은 손 씻기만 다르고 계절과 산모 수가 같습니다. 사망률에 차이가 나면 손 씻기 때문이라고 말할 수 있습니다."
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
    playBtn("b-fair-play", "⏸ 움직임 멈추기", "▶ 움직임 보기", function () { return playing; }, function (x) { playing = x; });
    K.animate(canvas, function (dt) { if (!playing) return; ph += dt / 1000; draw(); }, 24);
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
    function ok() { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>가설이 탐구의 방향을 정하고, 변인 통제가 결론을 믿을 만하게 만듭니다. 결과가 예측과 다르면 가설을 고쳐 다시 이 순서를 밟습니다."); ep.clear(3); ep.clear(4); }
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
    var TOK = { "--brand": "blue", "--teal": "green", "--amber-700": "yellow", "--coral-700": "red", "--green-700": "green", "--rose-700": "violet" };
    function kc(t) { return KC[TOK[t] || "blue"]; }
    var GNAME = { bar: "막대그래프", line: "선그래프", pie: "원그래프", sc: "산점도" };
    var LCOL = { "--brand": LT.blue, "--amber-700": LT.yellow, "--coral-700": LT.red };
    /* 나이팅게일의 등불(접는 천 등롱) 입체 미니어처 */
    function lamp(c, x, y) {
      c.fillStyle = "rgba(20,30,50,.18)"; c.beginPath(); c.ellipse(x + 4, y + 40, 26, 6, 0, 0, 6.2832); c.fill();
      K.glow(c, x, y, 10, "rgba(255,196,96,.95)", 4);
      var cg = c.createLinearGradient(x - 18, 0, x + 18, 0); cg.addColorStop(0, "rgba(240,200,130,.85)"); cg.addColorStop(.5, "rgba(255,244,214,.95)"); cg.addColorStop(1, "rgba(220,170,100,.85)");
      c.fillStyle = cg; c.beginPath(); c.ellipse(x, y, 18, 26, 0, 0, 6.2832); c.fill();
      c.strokeStyle = "rgba(170,120,50,.6)"; c.lineWidth = 1; for (var k = -2; k <= 2; k++) { c.beginPath(); c.ellipse(x, y + k * 9, 18 * Math.sqrt(1 - Math.pow(k * 9 / 26, 2)), 3, 0, 0, Math.PI); c.stroke(); }
      var br = c.createLinearGradient(x - 20, 0, x + 20, 0); br.addColorStop(0, "#6a4a1a"); br.addColorStop(.5, "#f0cd80"); br.addColorStop(1, "#6a4a1a");
      c.fillStyle = br; c.beginPath(); c.ellipse(x, y - 27, 15, 5, 0, 0, 6.2832); c.fill(); c.fillRect(x - 15, y - 33, 30, 6); c.beginPath(); c.ellipse(x, y - 33, 15, 5, 0, 0, 6.2832); c.fill();
      c.beginPath(); c.ellipse(x, y + 28, 17, 5.5, 0, 0, 6.2832); c.fill(); c.fillRect(x - 17, y + 28, 34, 6); c.beginPath(); c.ellipse(x, y + 34, 17, 5.5, 0, 0, 6.2832); c.fill();
      c.strokeStyle = "#8a6424"; c.lineWidth = 2.4; c.beginPath(); c.arc(x, y - 38, 10, Math.PI, 0); c.stroke();
    }
    function pie3(d, tot) {
      var cx = 340, cy = 246, rx = 150, ry = 78, th = 26, a0 = -Math.PI / 2, sl = [];
      d.forEach(function (row, i) { var a1 = a0 + row[1] / tot * Math.PI * 2; sl.push([a0, a1, q === "1" ? LCOL[row[2]] : (i % 2 ? "#1c7ed6" : "#5f9fe0"), row, i]); a0 = a1; });
      ctx.fillStyle = "rgba(20,30,50,.22)"; ctx.beginPath(); ctx.ellipse(cx + 8, cy + th + 14, rx + 10, ry * .7, 0, 0, 6.2832); ctx.fill();
      sl.forEach(function (s) {                                   /* 앞쪽 옆면(0 ~ π 구간) */
        var lo = Math.max(s[0], 0), hi = Math.min(s[1], Math.PI);
        [[lo, hi], [Math.max(s[0], 2 * Math.PI), Math.min(s[1], 3 * Math.PI)]].forEach(function (r) {
          if (r[1] <= r[0]) return;
          ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, r[0], r[1]); ctx.lineTo(cx + rx * Math.cos(r[1]), cy + ry * Math.sin(r[1]) + th); ctx.ellipse(cx, cy + th, rx, ry, 0, r[1], r[0], true); ctx.closePath();
          ctx.fillStyle = K.tint(s[2], 0.7); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.stroke();
        });
      });
      sl.forEach(function (s) {
        var rg = ctx.createRadialGradient(cx - 50, cy - 30, 10, cx, cy, rx); rg.addColorStop(0, K.tint(s[2], 1.25)); rg.addColorStop(1, s[2]);
        ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.ellipse(cx, cy, rx, ry, 0, s[0], s[1]); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.4; ctx.stroke();
      });
      sl.forEach(function (s) {
        var row = s[3]; if (row[1] / tot <= 0.04) return;
        var am = (s[0] + s[1]) / 2, lx = cx + Math.cos(am) * (rx + 44), ly = cy + Math.sin(am) * (ry + 26) + (Math.sin(am) > 0 ? th : 0) + 4, lab = row[0] + " " + Math.round(row[1] / tot * 100) + "%";
        if (q === "1") K.pill(ctx, lab, lx, ly, { s: 12, a: "center", c: "#ffffff", box: [0, 690] });
        else K.t(ctx, lab, lx, ly, { s: 10.5, w: "800", a: "center", c: LT.ink });
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var d = data(), max = q === "1" ? 12000 : 3000, LS = 690, tot = 0;
      d.forEach(function (row) { tot += row[1]; });
      K.studio(ctx, 0, 0, LS, H, g === "pie" ? { x: 348, y: 300, rx: 220, ry: 50 } : null);
      if (g === "pie") pie3(d, tot);
      else {
        var gx = K.chart(ctx, { x: 0, y: 100, w: 680, h: H - 100, pl: 58, pt: 16, pb: 36, pr: 16, x0: 0, x1: d.length, y0: 0, y1: max, xt: d.length, yt: q === "1" ? 4 : 3, light: true, xf: function () { return ""; }, yf: function (v) { return v >= 1000 ? (v / 1000) + "천" : String(v); } });
        var X = function (i) { return gx.X(i + 0.5); };
        d.forEach(function (row, i) { K.t(ctx, row[0], X(i), gx.B + 18, { s: q === "1" ? 12 : 10.5, a: "center", c: LT.mute, w: "700" }); });
        K.t(ctx, "단위: 명", gx.R, gx.T - 4, { s: 11, w: "700", a: "right", c: LT.mute });
        if (g === "bar") d.forEach(function (row, i) {
          var bw = (gx.R - gx.L) / d.length * 0.56, col = q === "1" ? LCOL[row[2]] : LT.blue;
          bar3(ctx, X(i) - bw / 2, gx.Y(row[1]), bw, gx.B, col, q === "1" ? 12 : 7, q === "1" ? 8 : 5);
        });
        if (g === "line") {
          K.plot(ctx, gx, d.map(function (row, i) { return [i + 0.5, row[1]]; }), LT.blue, { w: 3.2, light: true });
          d.forEach(function (row, i) { K.planet(ctx, X(i), gx.Y(row[1]), 4.6, "#4dabf7", "#0b4f9c"); });
        }
        if (g === "sc") d.forEach(function (row, i) { ctx.fillStyle = "rgba(20,30,50,.15)"; ctx.beginPath(); ctx.ellipse(X(i) + 3, gx.Y(row[1]) + 6, 6, 2, 0, 0, 6.2832); ctx.fill(); K.planet(ctx, X(i), gx.Y(row[1]), 5.5, "#38d9a9", "#087f5b"); });
      }
      var ok = (q === "1" && g === "pie") || (q === "2" && g === "line");
      K.bigText(ctx, ok ? "질문에 딱 맞는 그래프" : "질문과 어긋난 그래프", 18, 48, 25, ok ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, (q === "1" ? "① 사망 원인의 비율 (1854.4~1855.3 합계)" : "② 달마다 병으로 죽은 병사 수") + " · " + GNAME[g], 18, 80, 17, "#ffd35a");
      /* ── 오른쪽: 장관에게 올릴 보고(판정 카드) + 등불 ── */
      judgeCard(ctx, 700, 0, W - 700, H, {
        title: "장관에게 올릴 보고",
        head: ok ? "✔ 딱 맞는다" : "✘ 어긋난다", headCol: ok ? LT.green : LT.red,
        rows: [["질문 ①", got.a ? "✔ 원그래프" : "○ 아직", got.a ? LT.green : LT.dim], ["질문 ②", got.b ? "✔ 선그래프" : "○ 아직", got.b ? LT.green : LT.dim], ["고른 그래프", GNAME[g]]],
        tip: [q === "1" ? "전체 가운데 비율을 묻는다" : "시간에 따른 흐름을 묻는다", ok ? true : null]
      });
      lamp(ctx, 800, 312);
      K.t(ctx, "나이팅게일의 등불", 800, H - 12, { s: 11, w: "700", a: "center", c: LT.mute });
      return ok;
    }
    var MSG = {
      "1bar": "막대로 크기는 비교되지만, ‘전체 가운데 얼마나’인지는 한눈에 들어오지 않습니다.",
      "1line": "선그래프는 시간처럼 이어지는 변화에 씁니다. 원인은 순서가 없는 범주라 선으로 잇는 것이 뜻이 없습니다.",
      "1pie": "✅ 원그래프 — 병으로 죽은 병사가 전체의 84%라는 것이 한눈에 보입니다.",
      "1sc": "산점도는 두 변인의 관계를 볼 때 씁니다. 원인은 수치 변인이 아닙니다.",
      "2bar": "막대로도 달마다의 값은 정확히 비교할 수 있어 틀린 그래프는 아닙니다. 다만 장관이 물은 것은 늘고 줄어드는 흐름이라, 점을 이은 선그래프가 그 흐름을 더 잘 보여 줍니다.",
      "2line": "✅ 선그래프 — 겨울로 갈수록 병으로 죽은 병사가 급격히 늘어 1월에 가장 많았다가 2월부터 줄어드는 흐름이 보입니다.",
      "2pie": "열두 달을 조각으로 나누면 달마다의 변화 순서가 보이지 않습니다.",
      "2sc": "점만 찍으면 변화의 흐름을 따라가기 어렵습니다. 시간에 따른 변화는 점을 이은 선그래프로 그립니다."
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
    function bars(x, w, lo, title, tc, cut) {
      var g = K.chart(ctx, { x: x, y: 112, w: w, h: H - 112, pl: 50, pt: 22, pb: 38, pr: 16, x0: 0, x1: 2, y0: lo, y1: 100, xt: 2, yt: 2, light: true, xf: function () { return ""; }, yf: function (q) { return q + "%"; } });
      K.t(ctx, title, x + w / 2 + 16, 106, { s: 12.5, w: "900", a: "center", c: tc });
      [[96, "옛 병원 96%", LT.violet], [98, "새 병원 98%", LT.blue]].forEach(function (b, i) {
        var cx = g.X(i + 0.5), bw = (g.R - g.L) * 0.26;
        bar3(ctx, cx - bw / 2, g.Y(b[0]), bw, g.B, b[2], 12, 8);
        K.t(ctx, b[1], cx, g.B + 20, { s: 12, a: "center", c: LT.ink, w: "800" });
      });
      if (cut) {
        /* 축이 0에서 시작하지 않음을 나타내는 물결 표시 */
        ctx.fillStyle = "#f3f6fa"; ctx.fillRect(g.L - 9, g.B - 30, 18, 24);
        ctx.strokeStyle = LT.red; ctx.lineWidth = 2.2; ctx.beginPath();
        for (var k = 0; k <= 4; k++) { var yy = g.B - 8 - k * 5, xx = g.L + (k % 2 ? 7 : -7); if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
        ctx.stroke();
      }
      return g;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var ratio = (98 - s0) / (96 - s0), ok = s0 === 0, LS = 690;
      K.studio(ctx, 0, 0, LS, H, null);
      bars(0, 340, s0, "제안된 그래프 · 세로축 " + s0 + "%부터", ok ? LT.green : LT.red, s0 > 0);
      bars(346, 340, 0, "정직한 그래프 · 세로축 0%부터", LT.green, false);
      K.bigText(ctx, "보이는 높이 " + ratio.toFixed(2) + " 배", 18, 48, 27, ratio > 1.2 ? "#ff9aac" : "#7cf0b5");
      K.bigText(ctx, "실제 회복률의 비는 98 ÷ 96 = 1.02 배", 18, 80, 17, "#ffd35a");
      judgeCard(ctx, 700, 0, W - 700, H, {
        head: ok ? "정직한 그래프" : (ratio > 1.2 ? "차이를 부풀렸다" : "축이 0이 아니다"), headCol: ok ? LT.green : (ratio > 1.2 ? LT.red : LT.orange),
        rows: [["세로축 시작", s0 + "%"], ["보이는 높이 비", ratio.toFixed(2) + " 배", ratio > 1.2 ? LT.red : LT.green], ["실제 값의 비", "1.02 배", LT.blue]],
        bar: [(ratio - 1) / 2, ratio > 1.2 ? LT.red : LT.green, "1배", "3배"],
        tip: [ok ? "막대 길이 = 실제 크기" : "막대는 0부터 그려야 정직", ok ? true : false],
        foot: ["보이는 높이 비", "(98−시작)÷(96−시작)"]
      });
      readout(ratio, ok);
      return ok;
    }
    function readout(ratio, ok) {
      put("c-ax-read",
        "<span class='k'>보이는 막대 높이의 비</span><span class='v " + (ratio > 1.2 ? "r" : "g") + "'>" + ratio.toFixed(2) + " 배</span>" +
        "<span class='k'>실제 회복률의 비</span><span class='v b'>" + (98 / 96).toFixed(2) + " 배</span>" +
        "<span class='sub'>98 ÷ 96</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "정직한 그래프" : (ratio > 1.2 ? "차이를 부풀린 그래프" : "거의 정직하지만 축이 0에서 시작하지 않음")) + "</span>");
    }
    function update() {
      var ok = draw(), ratio = (98 - s0) / (96 - s0);
      put("c-ax-info", "세로축을 " + s0 + "%에서 시작하면 새 병원 막대가 옛 병원의 " + ratio.toFixed(2) + " 배로 보입니다. 실제 회복률은 1.02 배 차이입니다. "
        + (ok ? "✅ 세로축을 0에서 시작하니 막대의 길이가 실제 크기의 비를 그대로 보여 줍니다." : "막대그래프는 길이로 크기를 비교하므로, 세로축은 0에서 시작해야 정직합니다."));
      if (ok && !got.a) { got.a = true; window.sthState("axGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-3a"); if (got.q) done("m3-3b");
      if (got.a && got.q) {
        window.sthState("axBest", "축을 95%에서 시작하면 1.02 배 차이가 3 배로 보인다");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("axBest") + ". 그래프를 읽을 때는 먼저 축의 눈금부터 확인하세요. 다만 같은 자료를 사망률(4% → 2%)로 보면 절반이 된 것이니, 무엇을 비교하는지도 함께 따져야 합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("c-ax").addEventListener("input", function (ev) { s0 = +ev.target.value; $("c-ax-val").textContent = s0 + "%"; update(); });
    window.sthPick({
      mount: "c-ax-pick",
      q: "세로축을 95%에서 시작한 그래프에서, 새 병원(98%) 막대는 옛 병원(96%) 막대의 몇 배 높이로 보일까요?",
      options: ["약 1.02 배", "약 2 배", "약 3 배", "약 10 배"],
      answer: 2,
      why: ["실제 값의 비입니다. 그래프에서는 달라 보입니다.", "95 위로 올라온 부분은 3과 1입니다.", "보이는 막대는 98 − 95 = 3과 96 − 95 = 1, 곧 3 배입니다. 1.02 배의 차이가 3 배로 부풀려졌습니다.", "그렇게까지는 아닙니다. 95 위로 올라온 부분을 비교해 보세요."],
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
