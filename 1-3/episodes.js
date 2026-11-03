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
    function ballAt(ctx, x, y, rr, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      if (ball === "iron") K.planet(ctx, x, y, rr, "#c9d2e0", "#2a3040"); else K.planet(ctx, x, y, rr, "#e0a868", "#5a3416");
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 600, x0 = 40, y0 = 250, len = 520, r = ang * Math.PI / 180, k;
      var sc = Math.min(1, 180 / (len * Math.sin(r)));
      var dx = len * Math.cos(r) * sc, dy = len * Math.sin(r) * sc;
      var topX = x0, topY = y0 - dy, botX = x0 + dx, botY = y0;
      var t = tRoll(ang), err = 0.1 / t * 100, ok = err <= 4;
      var nx = Math.sin(r), ny = -Math.cos(r);
      /* ── 왼쪽: 빗면 ── */
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 45, title: "갈릴레이의 빗면 · 같은 시간 간격마다 찍은 공의 자리" });
      var fl = ctx.createLinearGradient(0, y0, 0, H); fl.addColorStop(0, "#4a3626"); fl.addColorStop(1, "#1c140e");
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip(); ctx.fillStyle = fl; ctx.fillRect(0, y0, LW, H - y0); ctx.restore();
      wood(ctx, function () { ctx.beginPath(); ctx.moveTo(topX, topY); ctx.lineTo(botX, botY); ctx.lineTo(topX, botY); ctx.closePath(); }, topX, topY, botX, botY);
      ctx.strokeStyle = "rgba(255,225,180,.75)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(topX, topY); ctx.lineTo(botX, botY); ctx.stroke();
      K.wedge(ctx, botX, botY, -Math.PI, -Math.PI + r, 46, "rgba(255,211,107,.25)", KC.yellow);
      K.pill(ctx, "기울기 " + ang + "°", botX - 58, botY - 14, { s: 12, a: "right", c: KC.yellow, box: [0, LW] });
      for (k = 0; k <= 4; k++) {
        var f = (k / 4) * (k / 4), px = topX + dx * f, py = topY + dy * f;
        ballAt(ctx, px + nx * 9, py + ny * 9, 8, k === 4 ? .9 : .32 + k * .1);
        var up = k % 2 === 0, lx = px + nx * (up ? 30 : -20), ly = py + ny * (up ? 30 : -20) + 4;
        K.pill(ctx, (t * k / 4).toFixed(2) + "초", lx, ly, { s: 10.5, a: "center", c: up ? KC.ink : "#ffe3c2", box: [0, LW] });
      }
      /* 실제로 굴러가는 공 (실제 시간) */
      var tt = tA / 1000, fr = tt >= t ? 1 : (tt / t) * (tt / t);
      ballAt(ctx, topX + dx * fr + nx * 9, topY + dy * fr + ny * 9, 9, 1);
      K.pill(ctx, (ball === "iron" ? "무거운 쇠공 3 kg" : "가벼운 나무공 1 kg") + " · 빗면 5 m", LW - 16, 62, { s: 12, a: "right", c: ball === "iron" ? "#dfe6f2" : "#ffcf9a" });

      /* ── 오른쪽: 물시계 ── */
      var RX = LW + 8, RW = W - RX, run = tt < t;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 47, title: "물시계 · 흘러나온 물로 시간 재기" });
      var tx = RX + 36, ty = 54, tw = 96, th = 66;
      glass(ctx, tx, ty, tw, th, KC.blue, 8);
      var wl = ctx.createLinearGradient(0, ty + 14, 0, ty + th); wl.addColorStop(0, "rgba(127,211,255,.7)"); wl.addColorStop(1, "rgba(40,110,200,.85)");
      ctx.fillStyle = wl; ctx.fillRect(tx + 3, ty + 16, tw - 6, th - 19);
      ctx.fillStyle = "#8a93a8"; ctx.fillRect(tx + tw / 2 - 3, ty + th, 6, 8);
      var cyT = 190, cupH = 70, filled = clamp(Math.min(tt, t) / 5, 0, 1);
      if (run) { ctx.save(); ctx.shadowColor = KC.blue; ctx.shadowBlur = 8; ctx.strokeStyle = "rgba(127,211,255,.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx + tw / 2, ty + th + 8); ctx.lineTo(tx + tw / 2, cyT + cupH - 4 - filled * (cupH - 8)); ctx.stroke(); ctx.restore(); }
      glass(ctx, tx + 16, cyT, tw - 32, cupH, KC.blue, 6);
      ctx.fillStyle = wl; ctx.fillRect(tx + 19, cyT + cupH - 3 - filled * (cupH - 8), tw - 38, filled * (cupH - 8));
      var ix = RX + 150;
      K.pill(ctx, "굴러 내려온 시간", ix, 78, { s: 11, c: KC.mute, box: [RX, W] });
      K.pill(ctx, t.toFixed(2) + " 초", ix, 104, { s: 15, c: KC.yellow, box: [RX, W] });
      K.pill(ctx, "오차 ±0.1초 → " + err.toFixed(1) + "%", ix, 146, { s: 11.5, c: ok ? KC.green : KC.red, box: [RX, W] });
      meter(ctx, ix, 158, RW - (ix - RX) - 16, 10, clamp(err / 10, 0, 1), ok ? KC.green : KC.red);
      ctx.strokeStyle = KC.yellow; ctx.lineWidth = 2; var x4 = ix + (RW - (ix - RX) - 16) * 0.4; ctx.beginPath(); ctx.moveTo(x4, 154); ctx.lineTo(x4, 172); ctx.stroke();
      K.t(ctx, "4%", x4, 186, { s: 10, a: "center", c: KC.yellow });
      K.pill(ctx, (got.iron ? "✔" : "○") + " 쇠공", ix, 222, { s: 11.5, c: got.iron ? KC.green : KC.mute, box: [RX, W] });
      K.pill(ctx, (got.wood ? "✔" : "○") + " 나무공", ix, 250, { s: 11.5, c: got.wood ? KC.green : KC.mute, box: [RX, W] });
      readout(t, err, ok);
      return ok;
    }
    function readout(t, err, ok) {
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
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var p = POS[rule], x0 = 50, x1 = 850, max = 16, TH = 130;
      function X(u) { return x0 + u / max * (x1 - x0); }
      function Yp(u) { return 74 + u / max * 24; }
      /* ── 위: 빗면과 종 ── */
      K.stage(ctx, 0, 0, W, TH, "lab", { seed: 49, title: "빗면 (출발점 → 아래쪽, 16칸)" });
      wood(ctx, function () { ctx.beginPath(); ctx.moveTo(x0 - 10, Yp(0)); ctx.lineTo(x1 + 10, Yp(max)); ctx.lineTo(x1 + 10, Yp(max) + 12); ctx.lineTo(x0 - 10, Yp(0) + 12); ctx.closePath(); }, x0, 70, x0, 120);
      ctx.strokeStyle = "rgba(255,225,180,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 10, Yp(0)); ctx.lineTo(x1 + 10, Yp(max)); ctx.stroke();
      var tb = bt / BEAT, u = tb >= 4 ? max : max * (tb / 4) * (tb / 4);
      p.forEach(function (q, i) {
        bell(ctx, X(q), Yp(q) - 30, 8, flash[i]);
        K.t(ctx, q + "칸", X(q), Yp(q) + 26, { s: 10.5, a: "center", c: KC.mute, w: "700" });
      });
      K.planet(ctx, X(u), Yp(u) - 8, 8, "#c9d2e0", "#2a3040");
      /* ── 아래: 종이 울리는 때 ── */
      var Y0 = TH + 8, ts = times(), tx0 = 50, tx1 = 850, ty = Y0 + 68;
      K.stage(ctx, 0, Y0, W, H - Y0, "night", { seed: 51, title: "종이 울리는 때 (첫 종까지 걸린 시간 = 1박자)" });
      function T(s) { return tx0 + s / 4.2 * (tx1 - tx0); }
      ctx.strokeStyle = KC.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke();
      for (var b = 0; b <= 4; b++) { ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(T(b), ty - 6); ctx.lineTo(T(b), ty + 6); ctx.stroke(); K.t(ctx, b + "박", T(b), ty + 22, { s: 10.5, a: "center", c: KC.mute, w: "600" }); }
      var iv = [], prev = 0;
      ts.forEach(function (s, i) { K.glow(ctx, T(s), ty, 4.5 + flash[i] * 2, "rgba(255,211,107,.95)", 3 + flash[i] * 2); iv.push(s - prev); prev = s; });
      if (bt > 0 && tb < 4.2) { ctx.strokeStyle = rgba(KC.blue, .8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(T(tb), ty - 16); ctx.lineTo(T(tb), ty + 8); ctx.stroke(); }
      var even = iv.every(function (d) { return Math.abs(d - iv[0]) < 0.02; });
      K.pill(ctx, "종과 종 사이: " + iv.map(function (d) { return d.toFixed(2); }).join(" · ") + " 박", tx0, H - 14, { s: 12.5, c: even ? KC.green : KC.ink });
      K.pill(ctx, even ? "✔ 고른 박자 ♪" : "✘ 박자가 고르지 않다", tx1, H - 14, { s: 13, a: "right", c: even ? KC.green : KC.red });
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
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 470, cx = 236, by = 252, s = 7, rt = d / 2 * s, h = depth() * s, i;
      var mm = depth() * 10, ok = Math.abs(mm - 30) < 0.5;
      /* ── 왼쪽: 비 내리는 마당의 그릇 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 53, title: "☔ 내린 비 30 mm · 마당에 둔 그릇" });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      var gr = ctx.createLinearGradient(0, by, 0, H); gr.addColorStop(0, "#3a3a48"); gr.addColorStop(1, "#16161e"); ctx.fillStyle = gr; ctx.fillRect(0, by, LW, H - by);
      var Rr = K.rng(61);
      ctx.strokeStyle = "rgba(160,200,255,.45)"; ctx.lineWidth = 1.3;
      for (i = 0; i < 46; i++) { var rx = Rr() * LW, sp = .7 + Rr() * .5, yy = ((ph * sp + Rr()) % 1) * (by + 30) - 20; ctx.beginPath(); ctx.moveTo(rx, yy); ctx.lineTo(rx - 3, yy + 12); ctx.stroke(); }
      ctx.restore();
      /* 그릇 모양 */
      var Hc, outline, waterPath;
      if (shape === "cyl") {
        Hc = 26 * s;
        outline = function () { ctx.beginPath(); ctx.moveTo(cx - rt, by - Hc); ctx.lineTo(cx - rt, by); ctx.lineTo(cx + rt, by); ctx.lineTo(cx + rt, by - Hc); };
        waterPath = function () { ctx.beginPath(); ctx.rect(cx - rt, by - h, 2 * rt, h); };
      } else if (shape === "bottle") {
        Hc = 20 * s; var rb = 2 * rt, neck = 5 * s;
        outline = function () { ctx.beginPath(); ctx.moveTo(cx - rt, by - Hc - neck); ctx.lineTo(cx - rt, by - Hc); ctx.lineTo(cx - rb, by - Hc + 20); ctx.lineTo(cx - rb, by); ctx.lineTo(cx + rb, by); ctx.lineTo(cx + rb, by - Hc + 20); ctx.lineTo(cx + rt, by - Hc); ctx.lineTo(cx + rt, by - Hc - neck); };
        waterPath = function () { ctx.beginPath(); ctx.rect(cx - rb, by - h, 2 * rb, h); };
      } else {
        Hc = 0.6 * d * s; var rb2 = 0.4 * rt, rh = rb2 + (rt - rb2) * h / Hc;
        outline = function () { ctx.beginPath(); ctx.moveTo(cx - rt, by - Hc); ctx.lineTo(cx - rb2, by); ctx.lineTo(cx + rb2, by); ctx.lineTo(cx + rt, by - Hc); };
        waterPath = function () { ctx.beginPath(); ctx.moveTo(cx - rb2, by); ctx.lineTo(cx + rb2, by); ctx.lineTo(cx + rh, by - h); ctx.lineTo(cx - rh, by - h); ctx.closePath(); };
      }
      outline(); ctx.closePath(); ctx.fillStyle = "rgba(200,220,255,.07)"; ctx.fill();
      var wg = ctx.createLinearGradient(0, by - h, 0, by); wg.addColorStop(0, "rgba(127,211,255,.85)"); wg.addColorStop(1, "rgba(30,90,190,.9)");
      waterPath(); ctx.fillStyle = wg; ctx.fill();
      var mg = ctx.createLinearGradient(cx - 200, 0, cx + 200, 0); mg.addColorStop(0, "#6b5a44"); mg.addColorStop(.5, "#d9c39a"); mg.addColorStop(1, "#6b5a44");
      outline(); ctx.strokeStyle = mg; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.stroke();
      var bx = cx + (shape === "bottle" ? 2 * rt : rt) + 16;
      ctx.strokeStyle = KC.red; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx - 5, by); ctx.lineTo(bx + 5, by); ctx.moveTo(bx, by); ctx.lineTo(bx, by - h); ctx.moveTo(bx - 5, by - h); ctx.lineTo(bx + 5, by - h); ctx.stroke();
      K.pill(ctx, mm.toFixed(0) + " mm", bx + 10, by - h / 2 + 5, { s: 12, c: KC.red, box: [0, LW] });

      /* ── 오른쪽: 자로 잰 깊이 ── */
      var RX = LW + 8, RW = W - RX, rx0 = RX + 70, ry = 244, sc = 2.6;
      K.stage(ctx, RX, 0, RW, H, "lab", { seed: 55, title: "자(주척)로 잰 깊이" });
      var rl = ctx.createLinearGradient(rx0 - 26, 0, rx0, 0); rl.addColorStop(0, "#c9a46a"); rl.addColorStop(1, "#8a6a3a");
      ctx.fillStyle = rl; ctx.fillRect(rx0 - 26, ry - 70 * sc - 4, 26, 70 * sc + 8);
      ctx.strokeStyle = "#3a2a14"; ctx.lineWidth = 1;
      for (i = 0; i <= 70; i += 5) { ctx.beginPath(); ctx.moveTo(rx0, ry - i * sc); ctx.lineTo(rx0 - (i % 10 ? 7 : 14), ry - i * sc); ctx.stroke(); if (i % 10 === 0) K.t(ctx, String(i), rx0 - 32, ry - i * sc + 4, { s: 10, a: "right", c: KC.mute, w: "600" }); }
      K.t(ctx, "mm", rx0 - 32, ry + 20, { s: 10, a: "right", c: KC.mute });
      function col(x, val, c, lab) {
        var top = ry - Math.min(70, val) * sc, cg = ctx.createLinearGradient(0, top, 0, ry); cg.addColorStop(0, c); cg.addColorStop(1, shade(c, .35));
        ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(x, top, 56, ry - top, [5, 5, 0, 0]); ctx.fill(); ctx.restore();
        K.pill(ctx, lab, x + 28, H - 12, { s: 11, a: "center", c: c, box: [RX, W] });
      }
      col(rx0 + 30, 30, KC.blue, "내린 비 30");
      col(rx0 + 150, mm, ok ? KC.green : KC.red, "고인 물 " + mm.toFixed(0));
      ctx.save(); ctx.strokeStyle = KC.yellow; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx0, ry - 30 * sc); ctx.lineTo(RX + RW - 20, ry - 30 * sc); ctx.stroke(); ctx.restore();
      K.pill(ctx, "원통으로 잰 지름: " + (got.ds.length ? got.ds.join(", ") + " cm" : "아직 없음"), RX + RW - 14, 62, { s: 11, a: "right", c: KC.mute, box: [RX, W] });
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
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var x0 = 70, x1 = 830, y = 70;
      K.stage(ctx, 0, 0, W, H, "night", { seed: 57, title: "길이의 기준은 어떻게 바뀌었나" });
      ctx.strokeStyle = "rgba(160,175,255,.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      var xe = x0 + era / (ERAS.length - 1) * (x1 - x0);
      ctx.save(); ctx.shadowColor = KC.green; ctx.shadowBlur = 10; ctx.strokeStyle = KC.green; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke(); ctx.restore();
      ERAS.forEach(function (e, i) {
        var x = x0 + i / (ERAS.length - 1) * (x1 - x0), on = i === era;
        if (on) { K.glow(ctx, x, y, 7, "rgba(127,211,255,.95)", 3.2); ctx.strokeStyle = KC.blue; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.2832); ctx.stroke(); }
        else if (i < era) K.glow(ctx, x, y, 4.5, "rgba(63,211,163,.95)", 2.6);
        else { ctx.fillStyle = "rgba(160,175,255,.35)"; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.2832); ctx.fill(); }
        K.t(ctx, e.y, x, y + 28, { s: on ? 11.5 : 10, w: on ? "800" : "600", a: "center", c: on ? KC.ink : KC.mute });
      });
      var e = ERAS[era];
      glass(ctx, 30, 108, W - 60, 132, era >= 5 ? KC.green : KC.blue, 14);
      var ig = ctx.createRadialGradient(96, 168, 4, 96, 168, 46); ig.addColorStop(0, "rgba(255,240,200,.35)"); ig.addColorStop(1, "rgba(255,240,200,0)");
      ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(96, 168, 46, 0, 6.2832); ctx.fill();
      K.t(ctx, e.ico, 96, 184, { s: 44, a: "center" });
      K.pill(ctx, e.n + " · " + e.y, 158, 142, { s: 15, c: KC.ink });
      K.pill(ctx, "기준: " + e.base, 158, 172, { s: 12.5, c: KC.blue });
      K.pill(ctx, "누가 똑같이 만들 수 있나: " + e.who, 158, 200, { s: 12, c: era >= 5 ? KC.green : KC.mute });
      var cx = 158;
      CHAIN.forEach(function (c, i) {
        var on = CI[era] === i, past = i < CI[era];
        var b = K.pill(ctx, c, cx, 229, { s: 11, c: on ? KC.yellow : (past ? KC.green : KC.dim), bg: on ? "rgba(60,40,0,.7)" : null, line: on ? "rgba(255,211,107,.6)" : null });
        cx = b.x + b.w + 6;
        if (i < CHAIN.length - 1) { K.t(ctx, "→", cx + 6, 229, { s: 11, c: KC.dim }); cx += 26; }
      });
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
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var ok = aligned(w);
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 59, title: "원자량 순서로 늘어놓은 원소 카드 · 한 줄에 " + w + "장" });
      var rows = Math.ceil(EL.length / w), cw = Math.min(78, 820 / w), ch = Math.min(50, (H - 96) / rows - 6), x0 = (W - cw * w) / 2, y0 = 48;
      EL.forEach(function (e, i) {
        var r = Math.floor(i / w), c = i % w, x = x0 + c * cw + 3, y = y0 + r * (ch + 6), col = FAM[i % 8], bw = cw - 6;
        var tg = ctx.createLinearGradient(x, y, x, y + ch); tg.addColorStop(0, col); tg.addColorStop(1, shade(col, .45));
        ctx.save(); if (ok) { ctx.shadowColor = col; ctx.shadowBlur = 12; }
        ctx.fillStyle = tg; ctx.beginPath(); ctx.roundRect(x, y, bw, ch, 8); ctx.fill(); ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.roundRect(x + 3, y + 3, bw - 6, ch * .32, 6); ctx.fill();
        K.t(ctx, e[0], x + bw / 2, y + ch * 0.5, { s: ch < 40 ? 14 : 16, w: "900", a: "center", c: "#fff" });
        K.t(ctx, e[1].toFixed(1), x + bw / 2, y + ch * 0.86, { s: 10.5, w: "700", a: "center", c: "rgba(255,255,255,.92)" });
      });
      K.pill(ctx, ok ? "✔ 같은 가족이 세로로 나란히!" : "✘ 같은 색이 흩어져 있다", W / 2, H - 14, { s: 13.5, a: "center", c: ok ? KC.green : KC.red, bg: ok ? "rgba(20,70,50,.6)" : "rgba(80,20,30,.6)" });
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
      var LW = 440, x0 = 28, y0 = 48, cw = 124, ch = 60, ok = Math.abs(m - 72.6) <= 1.5;
      /* ── 왼쪽: 주기율표의 빈칸 ── */
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 63, title: "주기율표의 빈칸과 이웃 넷" });
      for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
        var e = GRID[r][c], x = x0 + c * (cw + 8), y = y0 + r * (ch + 8), mid = e[0] === "?", nb = (r === 1) !== (c === 1);
        var tc = mid ? KC.yellow : (nb ? KC.green : KC.dim);
        glass(ctx, x, y, cw, ch, tc, 10);
        if (mid) {
          ctx.save(); ctx.shadowColor = KC.yellow; ctx.shadowBlur = ok ? 18 : 8; ctx.strokeStyle = KC.yellow; ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]);
          ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 10); ctx.stroke(); ctx.restore();
        }
        K.t(ctx, mid ? "에카규소" : e[0], x + cw / 2, y + 27, { s: mid ? 14 : 18, w: "900", a: "center", c: mid ? KC.yellow : KC.ink });
        K.t(ctx, mid ? m.toFixed(1) + " ?" : e[1].toFixed(1), x + cw / 2, y + 48, { s: 12, w: "800", a: "center", c: mid ? KC.yellow : (nb ? KC.green : KC.mute) });
      }
      /* ── 오른쪽: 원자량 수직선 ── */
      var RX = LW + 8, RW = W - RX, nx0 = RX + 34, nx1 = W - 30, ny = 160;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 65, title: "원자량 수직선에 놓아 보기" });
      function NX(q) { return nx0 + (q - 20) / 110 * (nx1 - nx0); }
      ctx.strokeStyle = KC.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nx0, ny); ctx.lineTo(nx1, ny); ctx.stroke();
      for (var q = 20; q <= 130; q += 10) { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(NX(q), ny - 4); ctx.lineTo(NX(q), ny + 4); ctx.stroke(); if (q % 20 === 0) K.t(ctx, String(q), NX(q), ny + 46, { s: 10, a: "center", c: KC.dim, w: "600" }); }
      [["Si", 28.1, -1], ["Ga", 69.7, -1], ["As", 74.9, 1], ["Sn", 118.7, -1]].forEach(function (p) {
        K.glow(ctx, NX(p[1]), ny, 3.6, "rgba(63,211,163,.95)", 3);
        K.pill(ctx, p[0] + " " + p[1], NX(p[1]), ny + (p[2] < 0 ? -16 : 28), { s: 10.5, a: "center", c: KC.green, box: [RX, W] });
      });
      K.glow(ctx, NX(m), ny, 5.5, "rgba(255,211,107,.98)", 3.4);
      ctx.strokeStyle = KC.yellow; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(NX(m), ny + 8); ctx.lineTo(NX(m), ny + 58); ctx.stroke();
      K.pill(ctx, "내 예측 " + m.toFixed(1), NX(m), ny + 76, { s: 12.5, a: "center", c: ok ? KC.green : KC.yellow, box: [RX, W] });
      if (ok) K.pill(ctx, "1886년 게르마늄 발견: 72.6", NX(72.6), ny - 46, { s: 11.5, a: "center", c: KC.green, box: [RX, W] });
      K.pill(ctx, "위·아래 평균 " + ((28.1 + 118.7) / 2).toFixed(1) + "  ·  왼·오른쪽 평균 " + ((69.7 + 74.9) / 2).toFixed(1), RX + 16, 66, { s: 11, c: KC.mute });
      K.t(ctx, "※ 갈륨은 1875년 발견", W - 16, 30, { s: 10.5, a: "right", c: KC.dim });
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
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var c = CASES[idx], pl = 70, pr = 60, t0 = c.r[0], t1 = c.r[1];
      function X(y) { return pl + (y - t0) / (t1 - t0) * (W - pl - pr); }
      K.stage(ctx, 0, 0, W, H, "night", { seed: 67 + idx, title: "동시 발견 · " + c.t });
      K.pill(ctx, "살펴본 사례 " + got.seen.length + " / 4", W - 16, 28, { s: 11.5, a: "right", c: got.seen.length >= 4 ? KC.green : KC.mute });
      var step = Math.max(1, Math.round((t1 - t0) / 6));
      ctx.strokeStyle = KC.grid; ctx.lineWidth = 1;
      for (var yy = Math.ceil(t0 / step) * step; yy <= t1; yy += step) {
        ctx.beginPath(); ctx.moveTo(X(yy), 50); ctx.lineTo(X(yy), H - 30); ctx.stroke();
        K.t(ctx, String(yy), X(yy), H - 12, { s: 10.5, a: "center", c: KC.mute, w: "600" });
      }
      var lanes = [[c.a, 100, KC.red], [c.b, 190, KC.blue]];
      lanes.forEach(function (ln) {
        var p = ln[0], y = ln[1], col = ln[2];
        K.pill(ctx, p.n, pl - 40, y - 34, { s: 12, c: col });
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.strokeStyle = rgba(col, .55); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(X(t0), y); ctx.lineTo(X(t1), y); ctx.stroke(); ctx.restore();
        p.e.forEach(function (ev, k) {
          K.glow(ctx, X(ev[0]), y, 4.5, rgba(col, .95), 3);
          var oy = [-12, 24, -36][k % 3];
          K.pill(ctx, Math.floor(ev[0]) + " " + ev[1], X(ev[0]), y + oy, { s: 10.5, a: "center", c: KC.ink, box: [0, W] });
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
