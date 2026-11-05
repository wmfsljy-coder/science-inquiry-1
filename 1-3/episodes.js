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
function glass(ctx, x, y, w, h, c, r) {
  var g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, rgba(c, .22)); g.addColorStop(1, rgba(c, .06));
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 12 : r); ctx.fill();
  ctx.strokeStyle = rgba(c, .45); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 12 : r); ctx.stroke();
}
/* 나무결 판 */
function wood(ctx, path, x0, y0, x1, y1) {
  var g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, "#b07a45"); g.addColorStop(.5, "#8a5a30"); g.addColorStop(1, "#5e3b1d");
  ctx.fillStyle = g; path(); ctx.fill();
}
/* 놀랫게 빛나는 종: (x, y) 종 머리, s 크기, lit 0~1 */
function bell(ctx, x, y, s, lit) {
  if (lit > 0) K.glow(ctx, x, y + s, s * .6, "rgba(255,220,120," + (.9 * lit) + ")", 3 + lit * 2);
  var bg = ctx.createLinearGradient(x - s, 0, x + s, 0); bg.addColorStop(0, "#8a5a12"); bg.addColorStop(.45, lit > 0 ? "#fff2b0" : "#ffd36b"); bg.addColorStop(1, "#9a6a1a");
  ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - s, y + s * 1.5); ctx.quadraticCurveTo(x - s * .9, y, x, y - s * .1); ctx.quadraticCurveTo(x + s * .9, y, x + s, y + s * 1.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#c8932e"; ctx.beginPath(); ctx.ellipse(x, y + s * 1.5, s * 1.05, s * .22, 0, 0, 6.2832); ctx.fill();
  ctx.strokeStyle = "#a8843c"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y - s * .1); ctx.lineTo(x, y - s * .8); ctx.stroke();
}

/* ---- 스튜디오 + 입체 미니어처 공용 도구 (_tools/STUDIO_GUIDE.md) ---- */
var LT = K.LT;
/* 움직이지 않는 부분은 숨은 캔버스에 한 번 그려 두고 붙인다. 글자는 늘 본 캔버스에 쓴다 */
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
/* 글을 폭에 맞춰 여러 줄로 */
function wrapText(c, s, x, y, maxW, o) {
  o = o || {}; c.font = (o.w || "700") + " " + (o.s || 12) + "px " + FONT;
  var words = String(s).split(" "), line = "", n = 0, lh = o.lh || 17;
  words.forEach(function (wd) {
    var t = line ? line + " " + wd : wd;
    if (c.measureText(t).width > maxW && line) { K.t(c, line, x, y + n * lh, o); n++; line = wd; } else line = t;
  });
  if (line) { K.t(c, line, x, y + n * lh, o); n++; }
  return y + n * lh;
}
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
/* 입체 막대·카드(앞면·윗면·오른쪽 면). col 은 #hex */
function bar3(c, x, top, w, bottom, col, dx, dy) {
  dx = dx == null ? 9 : dx; dy = dy == null ? 6 : dy;
  if (bottom - top < 0.5) top = bottom - 0.5;
  c.fillStyle = K.tint(col, 0.62); c.beginPath(); c.moveTo(x + w, top); c.lineTo(x + w + dx, top - dy); c.lineTo(x + w + dx, bottom - dy); c.lineTo(x + w, bottom); c.closePath(); c.fill();
  c.fillStyle = K.tint(col, 1.25); c.beginPath(); c.moveTo(x, top); c.lineTo(x + dx, top - dy); c.lineTo(x + w + dx, top - dy); c.lineTo(x + w, top); c.closePath(); c.fill();
  var g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, K.tint(col, 1.08)); g.addColorStop(1, K.tint(col, 0.88));
  c.fillStyle = g; c.fillRect(x, top, w, bottom - top);
}
/* 두께 있는 카드 한 장(원소 카드·표의 칸) */
function tile3(c, x, y, w, h, col, glow) {
  c.fillStyle = "rgba(20,30,50,.18)"; c.beginPath(); c.roundRect(x + 4, y + 6, w, h, 7); c.fill();
  c.fillStyle = K.tint(col, 0.6); c.beginPath(); c.roundRect(x + 4, y - 4, w, h, 7); c.fill();
  if (glow) { c.save(); c.shadowColor = glow; c.shadowBlur = 16; }
  var g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, K.tint(col, 1.18)); g.addColorStop(1, K.tint(col, 0.86));
  c.fillStyle = g; c.beginPath(); c.roundRect(x, y, w, h, 7); c.fill();
  if (glow) c.restore();
  c.fillStyle = "rgba(255,255,255,.22)"; c.beginPath(); c.roundRect(x + 3, y + 3, w - 6, h * .3, 5); c.fill();
}
/* 나무판(진열대·책상 윗면) */
function board(c, x, y, w, h, d) {
  d = d || 12;
  c.fillStyle = "rgba(20,30,50,.18)"; c.beginPath(); c.ellipse(x + w / 2, y + h + d + 8, w / 2 + 16, 12, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#6e4626"; c.fillRect(x, y + h, w, d);
  var g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, "#d9b07a"); g.addColorStop(1, "#b98a52");
  c.fillStyle = g; c.fillRect(x, y, w, h);
  c.strokeStyle = "rgba(110,70,30,.18)"; c.lineWidth = 1;
  for (var i = 1; i < 9; i++) { var yy = y + h * i / 9; c.beginPath(); c.moveTo(x, yy); c.bezierCurveTo(x + w * .3, yy + 3, x + w * .6, yy - 3, x + w, yy + 1); c.stroke(); }
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
    var tA = 0, playing = !REDUCE;
    /* ── 잘라 보는 작업장 블록: 빗면 받침(나무) + 물시계(통·받는 그릇) + 갈릴레이 ── */
    var I = K.iso({ ox: 330, oy: 112, s: 0.72, L: 700, D: 200 });
    var FZ = 18, XB = 520, Y0 = 72, Y1 = 126, YM = 99, LWL = 440, PL = 6;
    function geo() {
      var r = ang * Math.PI / 180, sc = Math.min(1, 210 / (LWL * Math.sin(r)));
      var dx = LWL * Math.cos(r) * sc, hz = LWL * Math.sin(r) * sc;
      return { r: r, dx: dx, hz: hz, xa: XB - dx, xb: XB };
    }
    function zOn(g, x) { return FZ + PL + g.hz * (g.xb - x) / g.dx; }
    function poly(pts, fill, stroke) {
      ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    }
    function ballAt(x, z, rr, alpha) {
      var p = I.P(x, YM, z);
      ctx.save(); ctx.globalAlpha = alpha;
      if (ball === "iron") K.planet(ctx, p.x, p.y - rr, rr, "#c9d2e0", "#2a3040"); else K.planet(ctx, p.x, p.y - rr, rr, "#e0a868", "#5a3416");
      ctx.restore();
      return { x: p.x, y: p.y - rr };
    }
    function glassBox(x0, y0, z0, x1, y1, z1) {
      I.box(ctx, x0, y0, z0, x1, y1, z1, "rgba(220,240,255,.18)", "rgba(200,230,255,.20)", "rgba(170,205,240,.24)");
      var e = "rgba(255,255,255,.85)"; ctx.strokeStyle = e; ctx.lineWidth = 1.2;
      [[I.P(x0, y1, z0), I.P(x1, y1, z0), I.P(x1, y0, z0)], [I.P(x0, y1, z1), I.P(x1, y1, z1), I.P(x1, y0, z1), I.P(x0, y0, z1), I.P(x0, y1, z1)],
       [I.P(x0, y1, z0), I.P(x0, y1, z1)], [I.P(x1, y1, z0), I.P(x1, y1, z1)], [I.P(x1, y0, z0), I.P(x1, y0, z1)]].forEach(function (s) {
        ctx.beginPath(); s.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var g = geo(), t = tRoll(ang), err = 0.1 / t * 100, ok = err <= 4, k;
      var tt = tA / 1000, run = tt < t, filled = clamp(Math.min(tt, t) / 5, 0, 1);
      var box = [0, 760];
      K.studio(ctx, 0, 0, W, H, { x: 470, y: 330, rx: 360, ry: 66 });
      /* 바닥 판(벽돌 타일) */
      I.box(ctx, 0, 0, 0, I.L, I.D, FZ, "#cfae86", "#8f6a4a", "#6f5038");
      ctx.strokeStyle = "rgba(110,75,45,.28)"; ctx.lineWidth = 1;
      for (k = 70; k < I.L; k += 70) { var a1 = I.P(k, 0, FZ), b1 = I.P(k, I.D, FZ); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); }
      for (k = 50; k < I.D; k += 50) { var a2 = I.P(0, k, FZ), b2 = I.P(I.L, k, FZ); ctx.beginPath(); ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y); ctx.stroke(); }
      /* 빗면 받침: 쐐기 모양 나무 (앞면·오른쪽 면·비탈 윗면) */
      var zt = zOn(g, g.xa), zb = FZ + PL;
      var fA = I.P(g.xa, Y1, FZ), fB = I.P(g.xb, Y1, FZ), fC = I.P(g.xb, Y1, zb), fD = I.P(g.xa, Y1, zt);
      var wg = ctx.createLinearGradient(fA.x, fD.y, fB.x, fB.y); wg.addColorStop(0, "#9a6a3c"); wg.addColorStop(1, "#6e4626");
      poly([fA, fB, fC, fD], wg);
      ctx.save(); poly([fA, fB, fC, fD]); ctx.clip(); ctx.strokeStyle = "rgba(60,35,15,.30)"; ctx.lineWidth = 1;
      for (k = 1; k < 9; k++) { var f0 = k / 9, q1 = I.P(g.xa, Y1, FZ + (zt - FZ) * f0), q2 = I.P(g.xb, Y1, FZ + (zb - FZ) * f0); ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke(); }
      ctx.restore();
      poly([I.P(g.xb, Y0, FZ), I.P(g.xb, Y1, FZ), I.P(g.xb, Y1, zb), I.P(g.xb, Y0, zb)], "#5a3a20");
      var tg = ctx.createLinearGradient(fD.x, fD.y, fC.x, fC.y); tg.addColorStop(0, "#e2b984"); tg.addColorStop(1, "#c48f58");
      poly([I.P(g.xa, Y0, zt), I.P(g.xb, Y0, zb), I.P(g.xb, Y1, zb), I.P(g.xa, Y1, zt)], tg, "rgba(90,55,25,.5)");
      /* 공이 굴러가는 홈 */
      var h1 = I.P(g.xa, YM, zt), h2 = I.P(g.xb, YM, zb);
      ctx.strokeStyle = "rgba(80,45,15,.75)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(h1.x, h1.y); ctx.lineTo(h2.x, h2.y); ctx.stroke();
      ctx.strokeStyle = "rgba(255,235,200,.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(h1.x, h1.y + 2.5); ctx.lineTo(h2.x, h2.y + 2.5); ctx.stroke();
      /* 기울기 각: 앞면(y = Y1) 위의 부채꼴 */
      var R0 = 64, arc = [I.P(g.xb, Y1, FZ)], j;
      for (j = 0; j <= 16; j++) { var ph = Math.PI - g.r * j / 16; arc.push(I.P(g.xb + R0 * Math.cos(ph), Y1, FZ + R0 * Math.sin(ph) * (g.hz / g.dx) / Math.tan(g.r))); }
      poly(arc, "rgba(255,211,107,.35)", KC.yellow);
      /* 같은 시간 간격마다 찍은 공의 자리 + 시각 */
      var ghosts = [];
      for (k = 0; k <= 4; k++) {
        var f = (k / 4) * (k / 4), gx = g.xa + g.dx * f;
        ghosts.push(ballAt(gx, zOn(g, gx), 8, k === 4 ? .9 : .3 + k * .1));
      }
      var sl = Math.hypot(h2.x - h1.x, h2.y - h1.y) || 1, px = (h2.y - h1.y) / sl, py = -(h2.x - h1.x) / sl;   /* 비탈에 수직(오른쪽 위) */
      for (k = 0; k <= 4; k++) {
        var up = k === 0 || k === 2, gp = ghosts[k];   /* 마지막 자리는 물시계에 가리지 않게 왼쪽 아래 */
        var sd = up ? 1 : -1, ax = gp.x + px * 30 * sd, ay = gp.y + py * 30 * sd;
        K.pill(ctx, (t * k / 4).toFixed(2) + "초", ax + (up ? 4 : -4), ay + 5, { s: 10.5, a: up ? "left" : "right", c: up ? KC.ink : "#ffe3c2", box: box });
      }
      /* 물시계: 받침대 위 물통 → 꼭지 → 받는 그릇 */
      I.box(ctx, 575, 25, FZ, 625, 75, FZ + 110, "#b88a58", "#8a5e36", "#6a4628");
      var wTop = FZ + 112 + 52 * (1 - 0.6 * filled);
      I.box(ctx, 577, 27, FZ + 112, 623, 73, wTop, "rgba(110,190,240,.85)", "rgba(40,120,200,.82)", "rgba(30,95,170,.86)");
      glassBox(575, 25, FZ + 110, 625, 75, FZ + 170);
      I.box(ctx, 625, 47, FZ + 114, 640, 53, FZ + 120, "#c9ced6", "#9aa3b0", "#7d8796");
      var cTop = FZ + 3 + filled * 46;
      if (filled > 0.005) I.box(ctx, 630, 34, FZ + 2, 670, 66, cTop, "rgba(110,190,240,.85)", "rgba(40,120,200,.82)", "rgba(30,95,170,.86)");
      if (run && tt > 0) {
        var s1 = I.P(638, 50, FZ + 114), s2 = I.P(638, 50, cTop);
        ctx.save(); ctx.shadowColor = KC.blue; ctx.shadowBlur = 6; ctx.strokeStyle = "rgba(90,180,240,.95)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke(); ctx.restore();
      }
      glassBox(628, 32, FZ, 672, 68, FZ + 56);
      I.person(ctx, 600, 140, FZ, "#7a2a3a", 2.3);
      /* 실제로 굴러가는 공 (실제 시간) */
      var fr = tt >= t ? 1 : (tt / t) * (tt / t), lx = g.xa + g.dx * fr;
      ballAt(lx, zOn(g, lx), 9, 1);
      /* 이름표 */
      I.label(ctx, g.xa + 20, Y1, FZ + 3, "빗면 · 길이 5 m", -46, 40, "#ffe3c2", box);
      K.pill(ctx, "기울기 " + ang + "°", fB.x - 70, fB.y + 26, { s: 12, a: "right", c: KC.yellow, box: box });
      I.label(ctx, 600, 25, FZ + 170, "물시계 · 흘러나온 물 = 시간", -10, -34, "#bfe6ff", box);
      I.label(ctx, 672, 50, FZ + 30, "받는 그릇", 26, 30, "#bfe6ff", box);
      K.pill(ctx, "흐린 공 = 같은 시간 간격마다 찍은 공의 자리", 16, H - 18, { s: 11, c: KC.ink });
      K.warn(ctx, W - 14, 30, "⚠ 빗면·물시계 크기는 실제 비율이 아님", "right");
      /* 큰 제목 */
      var both = got.iron && got.wood;
      K.bigText(ctx, !ok ? "너무 빨라 잴 수 없다" : (both ? "무거워도 가벼워도 같은 시간" : "낙하를 느린 화면으로"), 22, 50, 28, !ok ? "#ffffff" : "#ffd35a");
      K.bigText(ctx, (ball === "iron" ? "쇠공 3 kg" : "나무공 1 kg") + " · 기울기 " + ang + "° · " + t.toFixed(2) + "초", 22, 84, 17, !ok ? "#ffd35a" : "#ffffff");
      /* 오른쪽 흰 판정 카드 */
      var cx = 764, cy = 108, cw = 130;
      K.card(ctx, cx, cy, cw, 226, "굴러 내려온 시간");
      K.t(ctx, t.toFixed(2) + " 초", cx + 14, cy + 60, { s: 24, w: "900", c: LT.blue });
      K.t(ctx, "물시계 오차 ±0.1초", cx + 14, cy + 88, { s: 11, w: "700", c: LT.mute });
      K.t(ctx, err.toFixed(1) + "%", cx + 14, cy + 114, { s: 19, w: "900", c: ok ? LT.green : LT.red });
      K.bar(ctx, cx + 14, cy + 124, cw - 28, clamp(err / 10, 0, 1), ok ? LT.green : LT.red);
      var x4 = cx + 14 + (cw - 28) * 0.4; ctx.strokeStyle = LT.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x4, cy + 120); ctx.lineTo(x4, cy + 138); ctx.stroke();
      K.t(ctx, "4%", x4, cy + 152, { s: 10.5, w: "800", a: "center", c: LT.ink });
      K.t(ctx, (got.iron ? "✔" : "○") + " 쇠공", cx + 14, cy + 184, { s: 12.5, w: "800", c: got.iron ? LT.green : LT.dim });
      K.t(ctx, (got.wood ? "✔" : "○") + " 나무공", cx + 14, cy + 208, { s: 12.5, w: "800", c: got.wood ? LT.green : LT.dim });
      readout(t, err, ok);
      return ok;
    }    function readout(t, err, ok) {
      put("a-inc-read",
        "<span class='k'>굴러 내려온 시간</span><span class='v b'>" + t.toFixed(2) + " 초</span>" +
        "<span class='sub'>" + (ball === "iron" ? "쇠공 3 kg" : "나무공 1 kg") + " · 무게와 상관없이 같은 시간</span>" +
        "<span class='k'>물시계 오차</span><span class='v " + (ok ? "g" : "r") + "'>±0.1 초 → " + err.toFixed(1) + "%</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "4% 안으로 잴 수 있습니다" : "너무 빨라 오차가 큽니다 · 기울기를 줄여 보세요") + "</span>");
    }
    function update() {
      var ok = draw(), t = tRoll(ang);
      if (ok) { if (!got[ball]) { got[ball] = true; window.sthState("incGot", got); draw(); } }
      put("a-inc-info", "기울기 " + ang + "°에서 " + (ball === "iron" ? "쇠공" : "나무공") + "이 5 m를 굴러 내려오는 데 " + t.toFixed(2) + " 초. 공의 무게를 바꿔도 시간은 그대로입니다. "
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
    if (REDUCE) tA = 99999;
    playBtn("a-inc-play", "⏸ 공 멈추기", "▶ 공 굴리기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) { if (playing) { tA += dt; if (tA > tRoll(ang) * 1000 + 1000) tA = 0; draw(); } });
    $("a-ang").addEventListener("input", function (ev) { ang = +ev.target.value; $("a-ang-val").textContent = ang + "°"; tA = 0; update(); });
    segWire("a-ball", "data-v", function (x) { ball = x; tA = 0; update(); });
    update();
  })();

  /* 장면 3 — 고르게 울리는 종 */
  (function () {
    var canvas = $("a-c-bell"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, rule = "lin";
    var got = window.sthState("bellGot") || { a: false, q: false };
    var POS = { lin: [1, 2, 3, 4], dbl: [1, 2, 4, 8], sq: [1, 4, 9, 16] };
    function times() { return POS[rule].map(function (x) { return Math.sqrt(x); }); }
    var bt = 0, playing = !REDUCE, flash = [0, 0, 0, 0], BEAT = 700;
    /* 나무 빗면 미니어처(돌바닥 위) + 종 넷 + 굴러가는 쇠공 / 오른쪽: 박자 판정 카드 */
    var LS = 640, LR = 700, DR = 64, ZT = 112, ZB = 20, I = K.iso({ ox: 250, oy: 150, s: 0.5, L: LR, D: DR }), bgL = layer(canvas);
    function zr(x) { return ZB + (ZT - ZB) * (1 - x / LR); }
    function xr(u) { return 24 + u / 16 * (LR - 48); }
    function ramp(c) {
      var f = I.P(LR, DR, 0);
      K.studio(c, 0, 0, LS, H, { x: f.x - 170, y: f.y - 30, rx: 300, ry: 50 });
      I.box(c, -16, -14, -12, LR + 16, DR + 14, 0, "#cbbfa8", "#a29580", "#857a68");      /* 돌바닥 */
      I.face(c, "front", function (Lw) {                                                    /* 쐐기 앞면(나무) */
        c.beginPath(); c.moveTo(0, 0); for (var u = 0; u <= Lw; u += 10) c.lineTo(u, zr(u)); c.lineTo(Lw, 0); c.closePath();
        var g = c.createLinearGradient(0, 0, Lw, 0); g.addColorStop(0, "#9a6a3c"); g.addColorStop(1, "#7a4e2a"); c.fillStyle = g; c.fill();
        c.save(); c.clip(); c.strokeStyle = "rgba(60,35,15,.28)"; c.lineWidth = 1;
        for (var k = 1; k < 8; k++) { c.beginPath(); c.moveTo(0, ZT * k / 8); c.lineTo(Lw, ZB * k / 8); c.stroke(); }
        c.restore();
      });
      I.box(c, LR - 1, 0, 0, LR, DR, ZB, "#8a5a30", "#7a4e2a", "#5a3a20");
      var a = I.P(0, 0, zr(0)), b = I.P(LR, 0, zr(LR)), cc = I.P(LR, DR, zr(LR)), d = I.P(0, DR, zr(0));
      var tg = c.createLinearGradient(a.x, a.y, cc.x, cc.y); tg.addColorStop(0, "#e2b984"); tg.addColorStop(1, "#c48f58");
      I.quad(c, a, b, cc, d, tg, "rgba(90,55,25,.5)");
      var h1 = I.P(0, DR / 2, zr(0)), h2 = I.P(LR, DR / 2, zr(LR));                           /* 공이 구르는 홈 */
      c.strokeStyle = "rgba(80,45,15,.75)"; c.lineWidth = 3.5; c.beginPath(); c.moveTo(h1.x, h1.y); c.lineTo(h2.x, h2.y); c.stroke();
      for (var u = 0; u <= 16; u++) { var q0 = I.P(xr(u), DR, zr(xr(u))), q1 = I.P(xr(u), DR, zr(xr(u)) - (u % 4 ? 5 : 10)); c.strokeStyle = "rgba(255,240,210,.85)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(q0.x, q0.y); c.lineTo(q1.x, q1.y); c.stroke(); }
      I.edges(c, ZB, ZB);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var p = POS[rule], i;
      bgL(ctx, "r", ramp);
      var tb = bt / BEAT, u = tb >= 4 ? 16 : 16 * (tb / 4) * (tb / 4);
      /* 종: 빗면 뒤쪽 기둥에 매단다 */
      p.forEach(function (q, k) {
        var x = xr(q), z = zr(x), b0 = I.P(x, -4, z), b1 = I.P(x, -4, z + 46), b2 = I.P(x, DR / 2, z + 46);
        ctx.strokeStyle = "#6a4426"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.stroke();
        bell(ctx, b2.x, b2.y + 7, 9, flash[k]);
        if (flash[k] > 0.05) { ctx.strokeStyle = "rgba(232,89,12," + (flash[k] * .8).toFixed(2) + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(b2.x, b2.y + 14, 14 + (1 - flash[k]) * 16, -0.6, 0.6); ctx.stroke(); }
      });
      var bx = xr(u), bp = I.P(bx, DR / 2, zr(bx));
      ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(bp.x + 2, bp.y, 8, 3, 0, 0, 6.2832); ctx.fill();
      K.planet(ctx, bp.x, bp.y - 7, 7.5, "#c9d2e0", "#2a3040");
      /* 종 아래 칸 수 */
      p.forEach(function (q) { var lp = I.P(xr(q), DR, zr(xr(q))); K.t(ctx, String(q), lp.x - 6, lp.y + 22, { s: 12, w: "900", a: "center", c: LT.ink }); });
      var st = I.P(0, DR, zr(0)); K.pill(ctx, "출발점", st.x - 10, st.y + 24, { s: 11.5, a: "right", c: "#ffffff", box: [0, LS] });
      var en = I.P(LR, DR, zr(LR)); if (p.indexOf(16) < 0) K.pill(ctx, "16칸", en.x - 8, en.y + 26, { s: 11.5, a: "center", c: "#ffffff", box: [0, LS] });
      K.t(ctx, "빗면 앞면의 숫자 = 출발점에서 종까지의 칸 수", 18, H - 16, { s: 11.5, w: "700", c: LT.mute });
      /* 박자 */
      var ts = times(), iv = [], prev = 0;
      ts.forEach(function (s) { iv.push(s - prev); prev = s; });
      var even = iv.every(function (d) { return Math.abs(d - iv[0]) < 0.02; });
      K.bigText(ctx, even ? "딩 · 딩 · 딩 · 딩 고른 박자" : "박자가 고르지 않다", 18, 48, 25, even ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, "종 자리 " + p.join(", ") + " 칸", 18, 80, 17, "#ffd35a");
      K.warn(ctx, LS - 14, 30, "⚠ 빗면·종 크기는 실제 비율이 아님", "right");
      /* 판정 카드 + 박자 띠 */
      var yy = judgeCard(ctx, 650, 0, W - 650, H, {
        head: even ? "고른 박자 ♪" : "박자가 고르지 않다", headCol: even ? LT.green : LT.red,
        rows: [["종과 종 사이(박)", ""]], gap: 22
      });
      var px = 668, pr = W - 18;
      K.t(ctx, iv.map(function (d) { return d.toFixed(2); }).join(" · "), px, yy - 2, { s: 15, w: "900", c: even ? LT.green : LT.red });
      var ty = yy + 44; function T(s) { return px + s / 4.2 * (pr - px); }
      ctx.fillStyle = "#eef1f5"; ctx.beginPath(); ctx.roundRect(px - 6, ty - 26, pr - px + 12, 70, 10); ctx.fill();
      K.t(ctx, "종이 울리는 때", px, ty - 10, { s: 11, w: "800", c: LT.mute });
      ctx.strokeStyle = LT.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, ty + 8); ctx.lineTo(pr, ty + 8); ctx.stroke();
      for (var b = 0; b <= 4; b++) { ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(T(b), ty + 3); ctx.lineTo(T(b), ty + 13); ctx.stroke(); K.t(ctx, b + "박", T(b), ty + 30, { s: 10.5, w: "700", a: "center", c: LT.mute }); }
      ts.forEach(function (s, k) { K.planet(ctx, T(s), ty + 8, 5 + flash[k] * 2, "#ffd36b", "#a8781f"); });
      if (bt > 0 && tb < 4.2) { ctx.strokeStyle = LT.blue; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(T(tb), ty - 2); ctx.lineTo(T(tb), ty + 18); ctx.stroke(); }
      var tipY = ty + 60;
      ctx.fillStyle = even ? "#e7f7f0" : "#fdeee4"; ctx.beginPath(); ctx.roundRect(px - 6, tipY, pr - px + 12, 32, 10); ctx.fill();
      var tip = even ? "같은 시간에 1·3·5·7칸" : (rule === "lin" ? "점점 빨리 울린다" : "뒤로 갈수록 늘어진다");
      K.t(ctx, tip, px + 4, tipY + 21, { s: fitFont(ctx, tip, 12, "800", pr - px - 6), w: "800", c: even ? "#0f766e" : "#b4400c" });
      K.t(ctx, "1박 = 첫 종까지 걸린 시간", px, tipY + 56, { s: 11, w: "600", c: LT.mute });
      return even;
    }
    function update() {
      var ok = draw();
      put("a-bell-info", ok ? "✅ 종을 1, 4, 9, 16 칸에 달자 딩-딩-딩-딩 고른 박자로 울립니다. 같은 시간 동안 간 거리가 1, 3, 5, 7 칸으로 늘어나니, 공은 점점 빨라지고 있습니다. 간 거리는 시간의 제곱에 비례합니다."
        : (rule === "lin" ? "같은 간격으로 달면 종소리가 점점 빨라집니다. 공이 내려갈수록 빨라지기 때문입니다." : "두 배씩 벌리면 뒤로 갈수록 박자가 늘어집니다."));
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
    playBtn("a-bell-play", "⏸ 공 멈추기", "▶ 공 굴려 종 울리기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) {
      if (!playing) return;
      var before = bt / BEAT; bt += dt; var now = bt / BEAT, ts = times();
      ts.forEach(function (s, i) { if (before < s && now >= s) flash[i] = 1; });
      for (var i = 0; i < 4; i++) flash[i] = Math.max(0, flash[i] - dt / 450);
      if (bt > BEAT * 5.2) bt = 0;
      draw();
    });
    segWire("a-rule", "data-v", function (x) { rule = x; bt = 0; update(); });
    window.sthPick({
      mount: "a-bell-pick",
      q: "처음 1박자 동안 공이 1칸 갔다면, 처음 3박자 동안에는 모두 몇 칸 갈까요?",
      options: ["3칸", "6칸", "9칸", "27칸"],
      answer: 2,
      why: ["속력이 일정하다면 그렇겠지만 공은 점점 빨라집니다.", "1 + 2 + 3이 아니라 1 + 3 + 5입니다.", "1 + 3 + 5 = 9칸 = 3². 간 거리는 시간의 제곱에 비례합니다.", "시간의 세제곱이 아니라 제곱입니다."],
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
      { t: "운동은 시간과 거리를 수로 재기보다, 물체의 본성(제자리로 가려는 성질)으로 설명해야 한다", a: "ari", why: "아리스토텔레스는 꼼꼼히 관찰했지만, 운동을 수학으로 재기보다 본성과 목적으로 설명했습니다.", hint: "운동을 ‘재어서 수로’ 나타낸 사람은 누구일까요?" },
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
    var ph = 0, playing = !REDUCE;
    /* 가운데: 돌 받침(측우대) 위에 놓인 놋쇠 그릇의 입체 미니어처(앞쪽 벽을 반쯤 비쳐 고인 물이 보이게) / 오른쪽: 판정 카드 */
    var LS = 690, I = K.iso({ ox: 330, oy: 222, s: 1, L: 150, D: 150 }), ZS = 50, SC = 4, bgL = layer(canvas);
    var SNAME = { bowl: "위가 넓은 사발", bottle: "위가 좁은 병", cyl: "곧은 원통" };
    function stand(c) {
      var f = I.P(I.L, I.D, 0);
      K.studio(c, 0, 0, LS, H, { x: f.x - 20, y: f.y - 14, rx: 230, ry: 44 });
      ["front", "right"].forEach(function (side) {
        I.face(c, side, function (Lw) {
          var g = c.createLinearGradient(0, 0, 0, ZS); g.addColorStop(0, "#9b9a95"); g.addColorStop(1, "#cfccc4"); c.fillStyle = g; c.fillRect(0, 0, Lw, ZS);
          var R = K.rng(side === "front" ? 13 : 17);
          for (var i = 0; i < Lw * 2.2; i++) { c.fillStyle = R() > .5 ? "rgba(255,255,255,.35)" : "rgba(40,40,40,.25)"; c.fillRect(R() * Lw, R() * ZS, 1.3, 1.3); }
          c.strokeStyle = "rgba(70,70,70,.35)"; c.lineWidth = 1; c.strokeRect(8, 8, Lw - 16, ZS - 16);
        });
      });
      I.shade(c, "front", function () { return ZS; }); I.shade(c, "right", function () { return ZS; });
      I.plane(c, ZS, "#dedbd2", "rgba(90,90,90,.35)");
      var q = I.P(I.L / 2, I.D / 2, ZS); c.fillStyle = "#c9c5ba"; c.beginPath(); c.ellipse(q.x, q.y, 92, 46, 0, 0, 6.2832); c.fill();   /* 그릇 자리 홈 */
      I.edges(c, ZS, ZS);
    }
    /* 그릇의 반지름(cm)을 바닥에서 잰 높이 h(cm) 에 따라 */
    function prof() {
      var rt = d / 2;
      if (shape === "cyl") return { H: 26, r: function () { return rt; } };
      if (shape === "bottle") return { H: 25, r: function (h) { return h <= 17 ? 2 * rt : (h <= 20 ? 2 * rt - rt * (h - 17) / 3 : rt); } };
      var Hc = 0.6 * d, rb = 0.4 * rt;
      return { H: Hc, r: function (h) { return rb + (rt - rb) * h / Hc; } };
    }
    function vessel(c, wh) {
      var pr = prof(), base = I.P(I.L / 2, I.D / 2, ZS), cx = base.x, by = base.y, E = 0.36, n = 40, k;
      function sil(h0, h1) {                                   /* h0 ~ h1 사이 옆모습 */
        c.beginPath();
        for (k = 0; k <= n; k++) { var h = h0 + (h1 - h0) * k / n; c.lineTo(cx - pr.r(h) * SC, by - h * SC); }
        c.ellipse(cx, by - h1 * SC, pr.r(h1) * SC, pr.r(h1) * SC * E, 0, Math.PI, 0, false);
        for (k = n; k >= 0; k--) { var h2 = h0 + (h1 - h0) * k / n; c.lineTo(cx + pr.r(h2) * SC, by - h2 * SC); }
        c.ellipse(cx, by - h0 * SC, pr.r(h0) * SC, pr.r(h0) * SC * E, 0, 0, Math.PI, false);
        c.closePath();
      }
      c.fillStyle = "rgba(20,30,50,.25)"; c.beginPath(); c.ellipse(cx + 6, by + 4, pr.r(0) * SC + 10, pr.r(0) * SC * E + 5, 0, 0, 6.2832); c.fill();
      sil(0, pr.H); c.fillStyle = "#5b3d1c"; c.fill();                      /* 안쪽 벽(어둡게) */
      if (wh > 0.02) {
        sil(0, wh); var wg = c.createLinearGradient(0, by - wh * SC, 0, by); wg.addColorStop(0, "#6cc4ee"); wg.addColorStop(1, "#1f6fb8"); c.fillStyle = wg; c.fill();
        var rw = pr.r(wh) * SC; c.fillStyle = "rgba(190,235,255,.95)"; c.beginPath(); c.ellipse(cx, by - wh * SC, rw, rw * E, 0, 0, 6.2832); c.fill();
        c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = 1; c.beginPath(); c.ellipse(cx, by - wh * SC, rw * .6, rw * E * .5, 0, 0.3, 2.4); c.stroke();
      }
      sil(0, pr.H);                                                          /* 앞쪽 벽(놋쇠, 반쯤 비침) */
      var mg = c.createLinearGradient(cx - 2 * d / 2 * SC, 0, cx + 2 * d / 2 * SC, 0);
      mg.addColorStop(0, "rgba(120,80,30,.55)"); mg.addColorStop(.35, "rgba(240,200,120,.42)"); mg.addColorStop(.6, "rgba(200,150,70,.38)"); mg.addColorStop(1, "rgba(100,65,25,.6)");
      c.fillStyle = mg; c.fill(); c.strokeStyle = "#7a5420"; c.lineWidth = 1.6; c.stroke();
      var rt = pr.r(pr.H) * SC;
      c.strokeStyle = "#d8b06a"; c.lineWidth = 3.5; c.beginPath(); c.ellipse(cx, by - pr.H * SC, rt, rt * E, 0, 0, 6.2832); c.stroke();
      c.strokeStyle = "#7a5420"; c.lineWidth = 1; c.beginPath(); c.ellipse(cx, by - pr.H * SC, rt + 2, rt * E + 1, 0, 0, 6.2832); c.stroke();
      return { cx: cx, by: by, top: by - pr.H * SC, rt: rt, rMax: Math.max(pr.r(0), pr.r(pr.H / 2), pr.r(pr.H)) * SC };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var mm = depth() * 10, ok = Math.abs(mm - 30) < 0.5, i;
      bgL(ctx, "s", stand);
      /* 비 */
      var Rr = K.rng(61); ctx.strokeStyle = "rgba(70,110,170,.45)"; ctx.lineWidth = 1.3;
      for (i = 0; i < 54; i++) { var rx = 10 + Rr() * (LS - 20), sp = .7 + Rr() * .5, yy = ((ph * sp + Rr()) % 1) * (H - 40); ctx.beginPath(); ctx.moveTo(rx, yy); ctx.lineTo(rx - 3, yy + 12); ctx.stroke(); }
      var v = vessel(ctx, depth());
      /* 고인 물 깊이 괄호 */
      var bx = v.cx + v.rMax + 18, wy = v.by - depth() * SC;
      ctx.strokeStyle = LT.red; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(bx - 5, v.by); ctx.lineTo(bx + 5, v.by); ctx.moveTo(bx, v.by); ctx.lineTo(bx, wy); ctx.moveTo(bx - 5, wy); ctx.lineTo(bx + 5, wy); ctx.stroke();
      K.pill(ctx, "고인 물 " + mm.toFixed(0) + " mm", bx + 10, (v.by + wy) / 2 + 5, { s: 12, c: "#ffb0bc", box: [0, LS] });
      K.pill(ctx, "입구 지름 " + d + " cm", v.cx, v.top - 14, { s: 12, a: "center", c: "#ffffff", box: [0, LS] });
      I.label(ctx, 20, I.D, ZS * 0.5, "돌 받침(측우대)", -30, 40, "#f4f0e6", [0, LS]);
      K.bigText(ctx, "고인 물 " + mm.toFixed(0) + " mm", 18, 48, 27, ok ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, "내린 비 30 mm · " + (ok ? "그대로 보여 준다" : (mm > 30 ? "실제보다 깊게 보인다" : "실제보다 얕게 보인다")), 18, 80, 17, "#ffd35a");
      K.warn(ctx, LS - 14, H - 14, "⚠ 그릇과 받침의 크기는 실제 비율이 아님", "right");
      judgeCard(ctx, 700, 0, W - 700, H, {
        head: ok ? "비의 양 그대로" : (mm > 30 ? "실제보다 깊다" : "실제보다 얕다"), headCol: ok ? LT.green : LT.red,
        rows: [["그릇", SNAME[shape]], ["입구 지름", d + " cm"], ["고인 물", mm.toFixed(1) + " mm", ok ? LT.green : LT.red], ["내린 비", "30 mm", LT.blue]],
        bar: [mm / 70, ok ? LT.green : LT.red, "0", "70 mm (│ = 30)", 30 / 70],
        tip: [shape === "cyl" ? (got.ds.length >= 2 ? "크기가 달라도 늘 30 mm" : "지름을 한 번 더 바꿔 보자") : (shape === "bowl" ? "좁은 바닥에 모여 깊어짐" : "넓은 몸통에 퍼져 얕아짐"), shape === "cyl" ? true : false],
        foot: ["원통으로 잰 지름", got.ds.length ? got.ds.join(", ") + " cm" : "아직 없음"]
      });
      readout(mm, ok);
      return ok;
    }
    function readout(mm, ok) {
      put("b-rain-read",
        "<span class='k'>고인 물의 깊이</span><span class='v " + (ok ? "g" : "r") + "'>" + mm.toFixed(1) + " mm</span>" +
        "<span class='k'>실제 내린 비</span><span class='v b'>30 mm</span>" +
        "<span class='sub'>" + (shape === "cyl" ? "곧은 원통" : (shape === "bottle" ? "위가 좁은 병" : "위가 넓은 사발")) + " · 입구 " + d + " cm</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "내린 비와 같은 깊이" : (mm > 30 ? "실제보다 깊게 보입니다" : "실제보다 얕게 보입니다")) + "</span>");
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
    playBtn("b-rain-play", "⏸ 비 멈추기", "▶ 비 내리기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) { if (playing) { ph = (ph + dt / 1400) % 1000; draw(); } });
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

  /* 장면 3 — 1 m의 역사 */
  (function () {
    var canvas = $("b-c-era"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, era = 0;
    var got = window.sthState("eraGot") || { a: false, q: false };
    var ERAS = [
      { n: "고대 이집트", y: "약 BC 3000", ico: "💪", base: "파라오의 팔(왕실 큐빗)", who: "이집트 안에서만", d: "팔꿈치에서 가운뎃손가락 끝까지의 길이를 큐빗으로 정하고, 돌로 만든 표준 막대로 관리했습니다. 사람마다 팔 길이가 달라 기준 막대가 꼭 필요했습니다." },
      { n: "중국 진(秦)", y: "BC 221", ico: "⚖️", base: "나라가 정한 자·되·저울", who: "통일된 중국 안에서", d: "진시황이 나라마다 달랐던 자·되·저울을 하나로 통일했습니다. 세금과 거래, 수레바퀴 폭까지 같아졌습니다." },
      { n: "조선 세종", y: "1430~1440년대", ico: "🎐", base: "황종척·주척 등 표준 자", who: "조선 전국에서", d: "음악의 기준음을 내는 피리(황종관)의 길이로 자의 기준을 삼고, 여러 자를 정비해 측우기와 함께 전국에 보냈습니다." },
      { n: "프랑스 혁명", y: "1799", ico: "🌍", base: "북극~적도 자오선 거리의 1000만분의 1", who: "누구나 (원리상)", d: "북극에서 적도까지 거리의 1000만분의 1을 1 m로 정했습니다. 한 사람의 몸이 아닌 ‘자연’에서 기준을 가져오려 했습니다." },
      { n: "미터 협약", y: "1875 / 1889", ico: "📏", base: "백금-이리듐 국제 미터원기", who: "원기를 비교할 수 있는 나라", d: "1875년 17개 나라가 미터 협약을 맺고, 1889년 백금-이리듐 막대(국제 미터원기)를 1 m의 기준으로 삼았습니다. 복사본을 나누어 가진 나라들은 가끔 원기와 비교해야 했습니다." },
      { n: "빛의 속력으로", y: "1983", ico: "💡", base: "빛이 1/299 792 458 초 동안 가는 거리", who: "어디서나 누구나", d: "빛의 속력을 정확한 값으로 정하고, 이것으로 1 m를 정의했습니다. 막대가 없어도 어느 실험실에서나 1 m를 재현할 수 있습니다." },
      { n: "SI 재정의", y: "2019", ico: "⚛️", base: "플랑크 상수 등 자연 상수", who: "어디서나 누구나", d: "마지막까지 금속 덩어리(국제 킬로그램 원기)였던 킬로그램도 플랑크 상수로 다시 정의되어, 모든 기본 단위가 자연 상수를 기준으로 삼게 되었습니다." }
    ];
    var CHAIN = ["몸", "나라", "지구", "금속 원기", "자연 상수"], CI = [0, 1, 1, 2, 3, 4, 4];
    /* 박물관 진열대(대리석 받침) 위에 그 시대 길이·질량 기준의 입체 미니어처 / 위: 연표 / 오른쪽: 판정 카드 */
    var LS = 690, I = K.iso({ ox: 344, oy: 236, s: 1, L: 150, D: 110 }), ZP = 44, bgL = layer(canvas);
    function pedestal(c) {
      var f = I.P(I.L, I.D, 0);
      K.studio(c, 0, 0, LS, H, { x: f.x - 30, y: f.y - 12, rx: 230, ry: 42 });
      ["front", "right"].forEach(function (side) {
        I.face(c, side, function (Lw) {
          var g = c.createLinearGradient(0, 0, 0, ZP); g.addColorStop(0, "#c9ccd2"); g.addColorStop(1, "#f2f3f5"); c.fillStyle = g; c.fillRect(0, 0, Lw, ZP);
          c.strokeStyle = "rgba(150,155,165,.45)"; c.lineWidth = 1; c.beginPath(); c.moveTo(0, ZP - 6); c.lineTo(Lw, ZP - 6); c.moveTo(0, 6); c.lineTo(Lw, 6); c.stroke();
        });
      });
      I.shade(c, "front", function () { return ZP; }); I.shade(c, "right", function () { return ZP; });
      I.plane(c, ZP, "#f7f7f9", "rgba(150,155,165,.5)");
      I.plane(c, ZP + 0.5, "#2f3a52", null, 14, 136, 12, 98);                /* 검은 진열 천 */
      I.edges(c, ZP, ZP);
    }
    function cyl(c, x, y, len, r, col, vertical) {     /* 눕힌(또는 세운) 원기둥 */
      var g;
      if (vertical) {
        g = c.createLinearGradient(x - r, 0, x + r, 0); g.addColorStop(0, K.tint(col, .7)); g.addColorStop(.4, K.tint(col, 1.3)); g.addColorStop(1, K.tint(col, .6));
        c.fillStyle = g; c.fillRect(x - r, y - len, 2 * r, len); c.beginPath(); c.ellipse(x, y, r, r * .35, 0, 0, Math.PI); c.fill();
        c.fillStyle = K.tint(col, 1.15); c.beginPath(); c.ellipse(x, y - len, r, r * .35, 0, 0, 6.2832); c.fill();
      } else {
        g = c.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, K.tint(col, 1.3)); g.addColorStop(.5, col); g.addColorStop(1, K.tint(col, .6));
        c.fillStyle = g; c.fillRect(x, y - r, len, 2 * r);
        c.fillStyle = K.tint(col, .85); c.beginPath(); c.ellipse(x + len, y, r * .4, r, 0, 0, 6.2832); c.fill();
      }
    }
    function artifact(c) {
      var p = I.P(75, 55, ZP), k;
      if (era === 0) {                       /* 왕실 큐빗 돌 막대 */
        I.box(c, 14, 44, ZP, 136, 62, ZP + 10, "#5a5f6a", "#40444d", "#2e3138");
        for (k = 1; k < 7; k++) { var a = I.P(14 + k * 17.4, 62, ZP + 10), b = I.P(14 + k * 17.4, 62, ZP + 4); c.strokeStyle = "#d8c27a"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
        return [75, 53, ZP + 10];
      }
      if (era === 1) {                       /* 청동 되(부피)와 저울추(무게) */
        I.box(c, 26, 30, ZP, 76, 80, ZP + 30, "#b8873e", "#8f6a2a", "#6e521f");
        I.box(c, 30, 34, ZP + 30, 72, 76, ZP + 30.5, "#3a2a10", "#3a2a10", "#3a2a10");
        var w = I.P(110, 60, ZP); K.planet(c, w.x, w.y - 16, 16, "#d0a050", "#5a3a10"); cyl(c, w.x, w.y - 30, 8, 4, "#b8873e", true);
        return [51, 55, ZP + 30];
      }
      if (era === 2) {                       /* 황종관(대나무 피리)과 주척(나무 자) */
        I.box(c, 16, 68, ZP, 134, 80, ZP + 4, "#d9b47c", "#a8834f", "#8a6a3c");
        for (k = 1; k < 10; k++) { var r0 = I.P(16 + k * 11.8, 80, ZP + 4), r1 = I.P(16 + k * 11.8, 74, ZP + 4); c.strokeStyle = "#5a3a20"; c.lineWidth = 1; c.beginPath(); c.moveTo(r0.x, r0.y); c.lineTo(r1.x, r1.y); c.stroke(); }
        var a0 = I.P(24, 34, ZP + 8), a1 = I.P(126, 34, ZP + 8);
        c.strokeStyle = "#8fa84a"; c.lineCap = "round"; c.lineWidth = 15; c.beginPath(); c.moveTo(a0.x, a0.y); c.lineTo(a1.x, a1.y); c.stroke();
        c.strokeStyle = "#c7d98a"; c.lineWidth = 5; c.beginPath(); c.moveTo(a0.x, a0.y - 4); c.lineTo(a1.x, a1.y - 4); c.stroke(); c.lineCap = "butt";
        [0.3, 0.62].forEach(function (f) { var q = I.P(24 + 102 * f, 34, ZP + 8); c.strokeStyle = "#6a7f2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(q.x - 3, q.y - 7); c.lineTo(q.x + 3, q.y + 7); c.stroke(); });
        return [75, 34, ZP + 15];
      }
      if (era === 3) {                       /* 지구본과 북극~적도 자오선 */
        cyl(c, p.x, p.y - 2, 22, 4, "#9a7a4a", true);
        var gx = p.x, gy = p.y - 56, R = 34;
        K.earth(c, gx, gy, R);
        c.save(); c.shadowColor = "#f59f00"; c.shadowBlur = 8; c.strokeStyle = "#f59f00"; c.lineWidth = 3.5;
        c.beginPath(); c.ellipse(gx, gy, R * .45, R, 0, -Math.PI / 2, 0); c.stroke(); c.restore();
        K.planet(c, gx, gy - R, 3.5, "#ffffff", "#888"); K.planet(c, gx + R * .45, gy, 3.5, "#ffd35a", "#a8781f");
        return null;
      }
      if (era === 4) {                       /* 백금-이리듐 X자 단면 막대 */
        I.box(c, 10, 46, ZP + 2, 140, 64, ZP + 14, "#e9edf2", "#bcc4cf", "#8f98a6");
        var e0 = I.P(140, 55, ZP + 8);
        c.fillStyle = "#5b6370"; c.beginPath();
        [[-7, -6], [-2, -6], [0, -2], [2, -6], [7, -6], [3, 0], [7, 6], [2, 6], [0, 2], [-2, 6], [-7, 6], [-3, 0]].forEach(function (q, i) { var px = e0.x + q[0] * .9, py = e0.y + q[1]; if (i) c.lineTo(px, py); else c.moveTo(px, py); });
        c.closePath(); c.fill();
        [22, 128].forEach(function (x) { var q0 = I.P(x, 64, ZP + 14), q1 = I.P(x, 46, ZP + 14); c.strokeStyle = "#222"; c.lineWidth = 1.4; c.beginPath(); c.moveTo(q0.x, q0.y); c.lineTo(q1.x, q1.y); c.stroke(); });
        return [75, 55, ZP + 14];
      }
      if (era === 5) {                       /* 레이저와 거울: 빛이 간 거리 */
        I.box(c, 12, 40, ZP, 46, 70, ZP + 22, "#3d4a5c", "#2b3546", "#1e2633");
        I.box(c, 128, 44, ZP, 136, 66, ZP + 30, "#d0d8e2", "#aab4c2", "#8a95a6");
        var l0 = I.P(46, 55, ZP + 12), l1 = I.P(128, 55, ZP + 12);
        c.save(); c.shadowColor = "#ff2d2d"; c.shadowBlur = 10; c.strokeStyle = "#ff3b3b"; c.lineWidth = 2.6; c.beginPath(); c.moveTo(l0.x, l0.y); c.lineTo(l1.x, l1.y); c.stroke(); c.restore();
        K.glow(c, l0.x, l0.y, 2.5, "rgba(255,80,80,.95)", 3);
        return [87, 55, ZP + 12];
      }
      /* 키블 저울(전자기 힘으로 질량을 재는 장치) */
      I.box(c, 26, 40, ZP, 36, 70, ZP + 62, "#8a95a6", "#6b7686", "#56606e");
      I.box(c, 114, 40, ZP, 124, 70, ZP + 62, "#8a95a6", "#6b7686", "#56606e");
      I.box(c, 22, 40, ZP + 62, 128, 70, ZP + 70, "#aab4c2", "#8a95a6", "#6b7686");
      var wh = I.P(75, 55, ZP + 74); K.planet(c, wh.x, wh.y - 10, 12, "#e9edf2", "#5b6370");
      var cl = I.P(75, 55, ZP + 30);
      c.strokeStyle = "#5b6370"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(wh.x, wh.y - 4); c.lineTo(cl.x, cl.y - 26); c.stroke();
      c.strokeStyle = "#c2410c"; c.lineWidth = 5; c.beginPath(); c.ellipse(cl.x, cl.y - 20, 18, 6, 0, 0, 6.2832); c.stroke();
      c.fillStyle = "#e3c06a"; c.beginPath(); c.ellipse(cl.x, cl.y + 4, 16, 5, 0, 0, 6.2832); c.fill();
      K.planet(c, cl.x, cl.y - 4, 7, "#f4f6f8", "#6b7686");
      return [75, 55, ZP + 70];
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var x0 = 40, x1 = 650, y = 120, e = ERAS[era];
      bgL(ctx, "p", pedestal);
      /* 연표 띠 */
      ctx.fillStyle = "#e3e9f1"; ctx.beginPath(); ctx.roundRect(x0, y - 4, x1 - x0, 8, 4); ctx.fill();
      var xe = x0 + era / (ERAS.length - 1) * (x1 - x0);
      ctx.fillStyle = LT.green; ctx.beginPath(); ctx.roundRect(x0, y - 4, Math.max(8, xe - x0), 8, 4); ctx.fill();
      ERAS.forEach(function (q, i) {
        var x = x0 + i / (ERAS.length - 1) * (x1 - x0), on = i === era;
        K.planet(ctx, x, y, on ? 9 : 6, on ? "#4dabf7" : (i < era ? "#38d9a9" : "#ced4da"), on ? "#0b4f9c" : (i < era ? "#087f5b" : "#868e96"));
        K.t(ctx, q.y, x, y + 26, { s: on ? 11.5 : 10.5, w: on ? "900" : "700", a: "center", c: on ? LT.ink : LT.mute });
      });
      var top = artifact(ctx);
      var ALBL = ["왕실 큐빗 돌 막대", "청동 되와 저울추", "황종관(피리)과 주척(자)", "", "국제 미터원기 · X자 단면", "레이저 빛이 가는 거리", "키블 저울 · 플랑크 상수로 질량"];
      if (top) I.label(ctx, top[0], top[1], top[2], ALBL[era], -40, -24, "#ffffff", [0, LS]);
      else K.pill(ctx, "북극 → 적도 거리의 1000만분의 1", 140, 236, { s: 12, a: "center", c: "#ffd35a", box: [0, LS] });
      /* 기준이 바뀐 길 */
      var cx = 18;
      CHAIN.forEach(function (ch, i) {
        var on = CI[era] === i, past = i < CI[era];
        var b = K.pill(ctx, ch, cx, H - 16, { s: 11.5, c: on ? "#ffd35a" : (past ? "#7cf0b5" : "#9fb0e0"), line: on ? "rgba(255,211,107,.8)" : null });
        cx = b.x + b.w + 4;
        if (i < CHAIN.length - 1) { K.t(ctx, "→", cx + 4, H - 16, { s: 12, w: "900", c: LT.mute }); cx += 22; }
      });
      K.bigText(ctx, e.n, 18, 48, 27, era >= 5 ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, e.y + " · 기준은 " + CHAIN[CI[era]], 18, 80, 17, "#ffd35a");
      /* 판정 카드 */
      K.card(ctx, 700, 0, W - 700, H, "길이·질량의 기준");
      var px = 718, pw = W - 718 - 18, yy;
      K.t(ctx, e.n, px, 62, { s: fitFont(ctx, e.n, 20, "900", pw), w: "900", c: era >= 5 ? LT.green : LT.ink });
      K.t(ctx, "기준", px, 96, { s: 12, w: "800", c: LT.mute });
      yy = wrapText(ctx, e.base, px, 116, pw, { s: 13, w: "900", c: LT.ink, lh: 18 });
      K.t(ctx, "누가 똑같이 만들 수 있나", px, yy + 14, { s: 12, w: "800", c: LT.mute });
      yy = wrapText(ctx, e.who, px, yy + 34, pw, { s: 13, w: "900", c: era >= 5 ? LT.green : LT.ink, lh: 18 });
      K.bar(ctx, px, yy + 8, pw, CI[era] / 4, era >= 5 ? LT.green : LT.yellow);
      K.t(ctx, "몸", px, yy + 34, { s: 10.5, w: "600", c: LT.mute }); K.t(ctx, "자연 상수", px + pw, yy + 34, { s: 10.5, w: "600", a: "right", c: LT.mute });
      var good = era === ERAS.length - 1;
      ctx.fillStyle = good ? "#e7f7f0" : "#eef1f5"; ctx.beginPath(); ctx.roundRect(px - 6, yy + 50, pw + 12, 32, 10); ctx.fill();
      var tip = good ? "모든 기본 단위가 자연 상수로" : "시대를 끝까지 따라가 보자";
      K.t(ctx, tip, px + 4, yy + 71, { s: fitFont(ctx, tip, 12, "800", pw - 6), w: "800", c: good ? "#0f766e" : LT.mute });
      return good;
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
      why: ["값이 문제가 아니었습니다.", "실제로 국제 킬로그램 원기와 복사본들의 질량이 100여 년 동안 수십 마이크로그램씩 벌어졌습니다. 변하지 않고 어디서나 재현할 수 있는 기준이 필요했습니다.", "외우기 쉬운 값은 아닙니다. 변하지 않는다는 것이 중요합니다."],
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
    function fams() { var n = 0; for (var c = 0; c < w; c++) { var fs = {}; for (var i = c; i < EL.length; i += w) fs[i % 8] = 1; if (Object.keys(fs).length === 1) n++; } return n; }   /* 한 가족만 모인 세로줄 수 */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var ok = aligned(w), LS = 690, nf = fams();
      K.studio(ctx, 0, 0, LS, H, null);
      /* 나무 책상 위에 두께 있는 원소 카드를 줄지어 놓는다 */
      var rows = Math.ceil(EL.length / w), cw = Math.min(64, 610 / w), ch = Math.min(46, 250 / rows - 9), gw = cw * w, x0 = (LS - gw) / 2, y0 = 112;
      board(ctx, x0 - 22, y0 - 18, gw + 44, rows * (ch + 9) + 22, 12);
      EL.forEach(function (e, i) {
        var r = Math.floor(i / w), c = i % w, x = x0 + c * cw + 3, y = y0 + r * (ch + 9), col = FAM[i % 8], bw = cw - 10;
        tile3(ctx, x, y, bw, ch, col, ok ? col : null);
        K.t(ctx, e[0], x + bw / 2, y + ch * 0.52, { s: ch < 38 ? 14 : 16, w: "900", a: "center", c: "#fff" });
        K.t(ctx, e[1].toFixed(1), x + bw / 2, y + ch * 0.88, { s: 10.5, w: "800", a: "center", c: "rgba(255,255,255,.95)" });
      });
      K.bigText(ctx, ok ? "같은 가족이 세로로 나란히!" : "같은 색이 흩어져 있다", 18, 48, 25, ok ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, "원자량 순서 · 한 줄에 " + w + "장 · " + rows + "줄", 18, 80, 17, "#ffd35a");
      var yy = judgeCard(ctx, 700, 0, W - 700, H, {
        head: ok ? "주기성 발견" : "아직 흩어짐", headCol: ok ? LT.green : LT.red,
        rows: [["한 줄 카드 수", w + "장"], ["한 가족뿐인 세로줄", nf + " / " + w, ok ? LT.green : LT.orange]],
        bar: [nf / w, ok ? LT.green : LT.yellow, "0", w + "줄"],
        tip: [ok ? "성질이 주기적으로 되풀이" : "줄 길이를 바꿔 보자", ok ? true : null]
      });
      FNAME.forEach(function (nm, i) {
        var cx = 714 + (i % 2) * 84, cy = yy + 8 + Math.floor(i / 2) * 22;
        ctx.fillStyle = FAM[i]; ctx.beginPath(); ctx.roundRect(cx, cy - 10, 12, 12, 3); ctx.fill();
        K.t(ctx, nm, cx + 16, cy, { s: 10, w: "700", c: LT.mute });
      });
      return ok;
    }
    function update() {
      var ok = draw();
      put("c-tab-info", "한 줄에 " + w + "장씩 놓았습니다. " + (ok ? "✅ 8장씩 끊자 성질이 비슷한 원소 가족(" + FNAME.join(", ") + ")이 세로줄마다 모였습니다. 원소의 성질이 원자량 순서에 따라 <b>주기적으로</b> 되풀이됩니다. (아르곤과 칼륨은 원자량 순서가 뒤바뀌어 있지만 성질에 맞게 놓았습니다.)" : "같은 색 카드가 한 세로줄에 모이도록 줄 길이를 바꿔 보세요."));
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
      ctx.clearRect(0, 0, W, H);
      var LS = 690, x0 = 30, y0 = 122, cw = 100, ch = 62, ok = Math.abs(m - 72.6) <= 1.5, r, c;
      K.studio(ctx, 0, 0, LS, H, { x: 190, y: 352, rx: 200, ry: 26 });
      /* ── 왼쪽: 나무판 위 주기율표 조각(빈칸과 이웃 넷) ── */
      board(ctx, x0 - 16, y0 - 16, 3 * (cw + 10) + 22, 3 * (ch + 10) + 16, 12);
      for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) {
        var e = GRID[r][c], x = x0 + c * (cw + 10), y = y0 + r * (ch + 10), mid = e[0] === "?", nb = (r === 1) !== (c === 1);
        tile3(ctx, x, y, cw, ch, mid ? "#f59f00" : (nb ? "#0f9f76" : "#8a96a8"), mid && ok ? "#f59f00" : null);
        if (mid) { ctx.save(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.roundRect(x + 4, y + 4, cw - 8, ch - 8, 6); ctx.stroke(); ctx.restore(); }
        K.t(ctx, mid ? "에카규소" : e[0], x + cw / 2, y + 29, { s: mid ? 15 : 19, w: "900", a: "center", c: "#ffffff" });
        K.t(ctx, mid ? m.toFixed(1) + " ?" : e[1].toFixed(1), x + cw / 2, y + 50, { s: 12.5, w: "800", a: "center", c: "rgba(255,255,255,.95)" });
      }
      /* ── 오른쪽: 입체 원자량 눈금 막대 ── */
      var nx0 = 372, nx1 = 670, ny = 262;
      function NX(q) { return nx0 + (q - 20) / 110 * (nx1 - nx0); }
      ctx.fillStyle = "rgba(20,30,50,.14)"; ctx.beginPath(); ctx.ellipse((nx0 + nx1) / 2, ny + 22, (nx1 - nx0) / 2 + 10, 7, 0, 0, 6.2832); ctx.fill();
      bar3(ctx, nx0, ny - 6, nx1 - nx0, ny + 6, "#c9d2de", 7, 5);
      ctx.strokeStyle = LT.line; ctx.lineWidth = 1.2;
      for (var q = 20; q <= 130; q += 10) { ctx.beginPath(); ctx.moveTo(NX(q), ny + 8); ctx.lineTo(NX(q), ny + (q % 20 === 0 ? 17 : 13)); ctx.stroke(); if (q % 20 === 0) K.t(ctx, String(q), NX(q), ny + 32, { s: 10.5, a: "center", c: LT.mute, w: "700" }); }
      [["Si", 28.1, -1], ["Ga", 69.7, -1], ["As", 74.9, 1], ["Sn", 118.7, -1]].forEach(function (p) {
        K.planet(ctx, NX(p[1]), ny - 2, 5, "#38d9a9", "#087f5b");
        K.pill(ctx, p[0] + " " + p[1], NX(p[1]), ny + (p[2] < 0 ? -18 : 54), { s: 11, a: "center", c: "#7cf0b5", box: [360, LS] });
      });
      ctx.strokeStyle = LT.yellow; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(NX(m), ny + 4); ctx.lineTo(NX(m), ny + 66); ctx.stroke();
      K.planet(ctx, NX(m), ny - 2, 7, "#ffd36b", "#a8781f");
      K.pill(ctx, "내 예측 " + m.toFixed(1), NX(m), ny + 86, { s: 12.5, a: "center", c: ok ? "#7cf0b5" : "#ffd35a", box: [360, LS] });
      if (ok) {
        K.pill(ctx, "1886년 게르마늄 72.6", NX(72.6), ny - 52, { s: 12, a: "center", c: "#7cf0b5", box: [360, LS] });
        var gx = 640, gy = 176;                                     /* 회색 금속 광택의 게르마늄 덩어리 */
        ctx.fillStyle = "rgba(20,30,50,.2)"; ctx.beginPath(); ctx.ellipse(gx + 4, gy + 18, 26, 6, 0, 0, 6.2832); ctx.fill();
        var gg = ctx.createLinearGradient(gx - 22, gy - 20, gx + 22, gy + 18); gg.addColorStop(0, "#f1f3f5"); gg.addColorStop(.45, "#8a929e"); gg.addColorStop(1, "#495057");
        ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(gx - 22, gy + 12); ctx.lineTo(gx - 14, gy - 14); ctx.lineTo(gx + 4, gy - 22); ctx.lineTo(gx + 22, gy - 6); ctx.lineTo(gx + 18, gy + 16); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.moveTo(gx - 14, gy - 14); ctx.lineTo(gx + 4, gy - 22); ctx.lineTo(gx - 2, gy - 4); ctx.closePath(); ctx.fill();
      }
      K.t(ctx, "원자량 눈금", nx0, ny - 74, { s: 12, w: "900", c: LT.mute });
      K.bigText(ctx, ok ? "예측 적중 — 게르마늄 72.6" : "예측한 원자량 " + m.toFixed(1), 18, 48, 25, ok ? "#7cf0b5" : "#ffffff");
      K.bigText(ctx, "위·아래 평균 " + ((28.1 + 118.7) / 2).toFixed(1) + " · 왼·오른쪽 평균 " + ((69.7 + 74.9) / 2).toFixed(1), 18, 80, 17, "#ffd35a");
      judgeCard(ctx, 700, 0, W - 700, H, {
        head: ok ? "거의 같다" : "아직 멀다", headCol: ok ? LT.green : LT.orange,
        rows: [["내 예측", m.toFixed(1), ok ? LT.green : LT.yellow], ["위·아래 평균", ((28.1 + 118.7) / 2).toFixed(1)], ["왼·오른쪽 평균", ((69.7 + 74.9) / 2).toFixed(1)], ["1886년 실제", ok ? "72.6" : "?", ok ? LT.green : LT.dim]],
        tip: [ok ? "예측이 검증되었다" : "이웃들 사이의 값을 찾자", ok ? true : null],
        foot: ["※ 갈륨은 1875년 발견"]
      });
      readout(ok);
      return ok;
    }
    function readout(ok) {
      put("c-eka-read",
        "<span class='k'>내 예측 원자량</span><span class='v " + (ok ? "g" : "y") + "'>" + m.toFixed(1) + "</span>" +
        "<span class='sub'>이웃 넷: Si 28.1 · Ga 69.7 · As 74.9 · Sn 118.7</span>" +
        "<span class='k'>이웃의 평균</span><span class='v b'>" + ((28.1 + 118.7) / 2).toFixed(1) + " / " + ((69.7 + 74.9) / 2).toFixed(1) + "</span>" +
        "<span class='sub'>위·아래 / 왼·오른쪽</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "1886년에 발견된 게르마늄 72.6과 거의 같다" : "아직 멀었습니다 · 이웃들 사이의 값을 찾아 보세요") + "</span>");
    }
    function update() {
      var ok = draw();
      put("c-eka-info", "예측한 원자량 " + m.toFixed(1) + ". " + (ok ? "✅ 1886년에 발견된 게르마늄의 원자량 72.6과 거의 같습니다. 멘델레예프가 1871년에 예측한 값(약 72)도 이 근처였습니다." : "주기율표에서 원소의 성질은 이웃들 사이에서 차례로 변합니다. 이웃 넷의 원자량을 참고해 보세요."));
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
      why: ["예측이 맞은 뒤로 오히려 크게 주목받았습니다.", "아직 발견되지 않은 것을 맞힌 예측은 이론을 믿을 강력한 증거가 됩니다. 마이어보다 멘델레예프가 더 널리 알려진 까닭이기도 합니다.", "원자량, 밀도 같은 성질까지 매우 가깝게 맞았습니다."],
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
    /* 사례마다 작은 입체 소품: 0 책과 깃펜 · 1 탐사선 · 2 초기 전화기 · 3 증류 플라스크 */
    function prop(c, i, x, y) {
      c.fillStyle = "rgba(20,30,50,.18)"; c.beginPath(); c.ellipse(x + 4, y + 4, 44, 8, 0, 0, 6.2832); c.fill();
      if (i === 0) {
        c.fillStyle = "#7a2e2e"; c.beginPath(); c.moveTo(x - 44, y); c.lineTo(x, y + 6); c.lineTo(x + 44, y); c.lineTo(x + 40, y - 6); c.lineTo(x, y); c.lineTo(x - 40, y - 6); c.closePath(); c.fill();
        c.fillStyle = "#fbf6e8"; c.beginPath(); c.moveTo(x - 40, y - 6); c.quadraticCurveTo(x - 20, y - 14, x, y - 4); c.quadraticCurveTo(x + 20, y - 14, x + 40, y - 6); c.lineTo(x, y); c.closePath(); c.fill();
        c.strokeStyle = "rgba(90,70,40,.5)"; c.lineWidth = 1; for (var k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x - 32, y - 7 + k * 2); c.lineTo(x - 8, y - 4 + k * 2); c.stroke(); }
        c.strokeStyle = "#e9ecef"; c.lineWidth = 5; c.beginPath(); c.moveTo(x + 14, y - 6); c.quadraticCurveTo(x + 30, y - 40, x + 46, y - 56); c.stroke();
        c.strokeStyle = "#495057"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + 14, y - 6); c.lineTo(x + 46, y - 56); c.stroke();
      } else if (i === 1) {
        c.fillStyle = "#6e4626"; c.beginPath(); c.moveTo(x - 44, y - 12); c.lineTo(x + 44, y - 12); c.lineTo(x + 34, y + 2); c.lineTo(x - 36, y + 2); c.closePath(); c.fill();
        c.fillStyle = "#c98f5a"; c.fillRect(x - 44, y - 16, 88, 4);
        c.strokeStyle = "#5a3a20"; c.lineWidth = 2; [-18, 10].forEach(function (mx) { c.beginPath(); c.moveTo(x + mx, y - 16); c.lineTo(x + mx, y - 60); c.stroke(); });
        c.fillStyle = "#f8f4ea"; [-18, 10].forEach(function (mx) { c.beginPath(); c.moveTo(x + mx + 2, y - 58); c.quadraticCurveTo(x + mx + 20, y - 40, x + mx + 2, y - 22); c.closePath(); c.fill(); });
      } else if (i === 2) {
        var g = c.createLinearGradient(x - 20, 0, x + 20, 0); g.addColorStop(0, "#2b2b2b"); g.addColorStop(.5, "#6b6b6b"); g.addColorStop(1, "#1f1f1f");
        c.fillStyle = g; c.beginPath(); c.ellipse(x, y, 22, 7, 0, 0, 6.2832); c.fill(); c.fillRect(x - 4, y - 50, 8, 50);
        c.fillStyle = "#d4a24a"; c.beginPath(); c.ellipse(x, y - 54, 11, 6, 0, 0, 6.2832); c.fill();
        c.fillStyle = "#3a3a3a"; c.fillRect(x + 22, y - 44, 7, 26); c.fillStyle = "#d4a24a"; c.beginPath(); c.ellipse(x + 25.5, y - 46, 6, 3, 0, 0, 6.2832); c.fill();
        c.strokeStyle = "#5a3a20"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + 25, y - 18); c.quadraticCurveTo(x + 30, y + 2, x + 10, y + 2); c.stroke();
      } else {
        K.glow(c, x - 6, y - 18, 5, "rgba(170,220,255,.9)", 3);
        var fg = c.createRadialGradient(x - 12, y - 26, 2, x - 6, y - 18, 22); fg.addColorStop(0, "rgba(255,255,255,.9)"); fg.addColorStop(1, "rgba(160,200,230,.55)");
        c.fillStyle = fg; c.beginPath(); c.arc(x - 6, y - 18, 20, 0, 6.2832); c.fill(); c.strokeStyle = "rgba(60,90,120,.6)"; c.lineWidth = 1.2; c.stroke();
        c.strokeStyle = "rgba(120,160,200,.85)"; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 8, y - 32); c.lineTo(x + 44, y - 50); c.stroke();
        c.fillStyle = "#c0392b"; c.beginPath(); c.ellipse(x - 6, y - 8, 12, 5, 0, 0, 6.2832); c.fill();
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var c = CASES[idx], pl = 64, pr = 60, t0 = c.r[0], t1 = c.r[1], i;
      function X(y) { return pl + (y - t0) / (t1 - t0) * (W - pl - pr); }
      K.studio(ctx, 0, 0, W, H, null);
      K.bigText(ctx, "동시 발견 · " + c.t, 18, 48, 26, "#ffffff");
      K.bigText(ctx, "서로 다른 사람이 비슷한 때 같은 결론에", 18, 80, 17, "#ffd35a");
      prop(ctx, idx, 560, 92);
      /* 살펴본 사례 카드 */
      K.card(ctx, 700, 10, 186, 92, "살펴본 사례");
      K.t(ctx, got.seen.length + " / 4", 718, 70, { s: 22, w: "900", c: got.seen.length >= 4 ? LT.green : LT.ink });
      for (i = 0; i < 4; i++) K.planet(ctx, 800 + i * 20, 63, 7, got.seen.indexOf(i) >= 0 ? "#38d9a9" : "#ced4da", got.seen.indexOf(i) >= 0 ? "#087f5b" : "#868e96");
      /* 해(연도) 눈금 — 바닥에 놓인 자 */
      var by = H - 40;
      bar3(ctx, pl - 20, by - 5, W - pl - pr + 40, by + 5, "#d9b47c", 6, 4);
      var step = Math.max(1, Math.round((t1 - t0) / 6));
      for (var yy = Math.ceil(t0 / step) * step; yy <= t1; yy += step) {
        ctx.strokeStyle = LT.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(yy), 132); ctx.lineTo(X(yy), by - 6); ctx.stroke();
        K.t(ctx, String(yy), X(yy), by + 24, { s: 11, a: "center", c: LT.mute, w: "800" });
      }
      /* 두 사람의 길: 입체 레일 + 사건 받침 */
      var lanes = [[c.a, 190, "#e03131"], [c.b, 290, "#1c7ed6"]], lx = 18;
      lanes.forEach(function (ln) {
        var p = ln[0], y = ln[1], col = ln[2];
        K.planet(ctx, lx + 6, 108, 6, col, K.tint(col, .5));
        var nw = fitFont(ctx, p.n, 13, "900", 250); K.t(ctx, p.n, lx + 18, 113, { s: nw, w: "900", c: col });
        lx += 24 + ctx.measureText(p.n).width + 18;
        bar3(ctx, X(t0), y - 4, X(t1) - X(t0), y + 4, col, 5, 4);
        p.e.forEach(function (ev, k) {
          var ex = X(ev[0]);
          bar3(ctx, ex - 7, y - 14, 14, y - 2, "#ffd36b", 5, 4);
          var oy = [-28, 28, -50][k % 3];
          ctx.strokeStyle = "rgba(20,25,40,.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ex, y - 12); ctx.lineTo(ex, y + oy + (oy < 0 ? 4 : -14)); ctx.stroke();
          K.pill(ctx, Math.floor(ev[0]) + " " + ev[1], ex, y + oy, { s: 11, a: "center", c: "#ffffff", box: [0, W] });
        });
      });
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
      why: ["네 사례 모두 서로 독립적으로 연구했습니다.", "앞선 수학 연구, 탐사 기록, 전기 기술, 기체 실험 기구처럼 필요한 것이 갖추어지면 여러 사람이 같은 곳에 다다릅니다. 과학 지식이 사회·문화적 맥락 속에서 만들어진다는 뜻입니다.", "그렇다면 같은 발견이 여러 곳에서 동시에 나오기 어렵겠지요."],
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
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
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
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "세 일지를 꿰는 한 문장" }
});

})();
