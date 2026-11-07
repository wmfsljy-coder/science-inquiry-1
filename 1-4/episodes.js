/* 과학탐구실험1 Ⅱ-2 과학 탐구의 과정과 절차 — 이야기 네 편
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
function glassBox(ctx, x, y, w, h, c, r) {
  var g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, rgba(c, .22)); g.addColorStop(1, rgba(c, .06));
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 12 : r); ctx.fill();
  ctx.strokeStyle = rgba(c, .45); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 12 : r); ctx.stroke();
}
/* 빛줄기: 빛나는 선 */
function beam(ctx, x0, y0, x1, y1, c, w) {
  ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
  ctx.strokeStyle = rgba(c, .25); ctx.lineWidth = (w || 3) * 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.strokeStyle = rgba(c, .95); ctx.lineWidth = w || 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.restore();
}

/* ---- 밝은 스튜디오 · 입체 미니어처 도구 (본보기: earth-science-2/2-1 부정합, integrated-science-2/2-1 엘니뇨) ---- */
var LT = K.LT;
function tintC(c, k) { var r = rgbOf(c); return "rgb(" + r.map(function (q) { return Math.max(0, Math.min(255, Math.round(q * k))); }).join(",") + ")"; }
function floorShadow(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 1, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a == null ? .28 : a) + ")"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
/* 지시선 이름표(화면 좌표판 I.label) */
function tag(ctx, px, py, txt, dx, dy, col, box) {
  var q = { x: px + dx, y: py + dy };
  ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(q.x, q.y); ctx.stroke();
  ctx.fillStyle = "#111622"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 6.283); ctx.fill();
  return K.pill(ctx, txt, q.x + (dx < 0 ? -4 : 4), q.y + 4, { s: 12, a: dx < 0 ? "right" : "left", c: col || "#e8ecff", box: box });
}
/* 유리 원기둥(비커·시험관·병): 바닥 가운데 (cx, by), 반지름 r, 높이 h, 액체 높이 lh, 액체 색 liq. o.inside() 는 액체 다음·앞 유리 전에 그린다 */
function glassCyl(ctx, cx, by, r, h, lh, liq, o) {
  o = o || {};
  var e = o.e || 0.3, ry = r * e, ty = by - h, ly = by - lh;
  if (!o.noShadow) floorShadow(ctx, cx + r * .3, by + ry * .5, r * 1.6, ry * 1.6, .26);
  ctx.fillStyle = "rgba(205,222,245,.30)";
  ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.ellipse(cx, ty, r, ry, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill();
  if (lh > 0 && liq) {
    var g = ctx.createLinearGradient(cx - r, 0, cx + r, 0);
    g.addColorStop(0, shade(liq, .62)); g.addColorStop(.32, liq); g.addColorStop(.68, shade(liq, .92)); g.addColorStop(1, shade(liq, .55));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(cx - r + 1.5, ly); ctx.lineTo(cx - r + 1.5, by); ctx.ellipse(cx, by, r - 1.5, ry - .5, 0, Math.PI, 0, true); ctx.lineTo(cx + r - 1.5, ly); ctx.closePath(); ctx.fill();
    ctx.fillStyle = tintC(liq, 1.12); ctx.beginPath(); ctx.ellipse(cx, ly, r - 1.5, ry - .5, 0, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1; ctx.stroke();
  }
  if (o.inside) o.inside(ly, ry);
  ctx.strokeStyle = "rgba(80,110,150,.78)"; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.stroke();
  ctx.strokeStyle = "rgba(80,110,150,.65)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(cx, ty, r, ry, 0, 0, 6.2832); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, ty + .8, r - 2, ry - 1, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  var hg = ctx.createLinearGradient(cx - r * .72, 0, cx - r * .42, 0); hg.addColorStop(0, "rgba(255,255,255,0)"); hg.addColorStop(.5, "rgba(255,255,255,.7)"); hg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hg; ctx.fillRect(cx - r * .72, ty + ry + 4, r * .3, Math.max(0, h - ry - 8));
  ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(cx + r * .55, ty + ry + 8, r * .1, Math.max(0, h - ry - 20));
  if (o.ticks) { ctx.strokeStyle = "rgba(60,80,110,.5)"; ctx.lineWidth = 1; for (var k = 1; k <= o.ticks; k++) { var yy = by - h * k / (o.ticks + 1); ctx.beginPath(); ctx.moveTo(cx + r * .2, yy + ry * .9); ctx.lineTo(cx + r * .5, yy + ry * .75); ctx.stroke(); } }
}
function cardHead(ctx, s, x, y, col, size) { K.t(ctx, s, x, y, { s: size || 21, w: "900", c: col || LT.ink }); }

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
    /* 호수 블록 모형: 왼쪽 큰 블록 = 유럽의 호수, 오른쪽 작은 블록 = 1697년 오스트레일리아 */
    var LW = 600, IE = K.iso({ ox: 280, oy: 92, s: 0.6, L: 380, D: 240 }), IA = K.iso({ ox: 528, oy: 178, s: 0.5, L: 130, D: 100 });
    var SPOT = (function () {
      var R = K.rng(41), out = [], i;
      for (i = 0; i < 60; i++) { var c = i % 10, r = Math.floor(i / 10); out.push([44 + c * 31 + (R() - .5) * 12, 42 + r * 31 + (R() - .5) * 10, R()]); }
      return out.sort(function (a, b) { return a[2] - b[2]; });
    })();
    function lake(I, seed) {
      var L = I.L, D = I.D, m = Math.round(L * 0.07), ZG = 22, i;
      I.box(ctx, 0, 0, -ZG, L, D, 0, "#86b86e", "#8a6a4a", "#6d523a");
      I.face(ctx, "front", function (Lw) {
        var R = K.rng(seed), k, u;
        ctx.fillStyle = "rgba(60,40,20,.25)"; ctx.fillRect(0, -6, Lw, 6);
        for (k = 0; k < Lw * 0.5; k++) { ctx.fillStyle = R() > .5 ? "rgba(255,240,210,.25)" : "rgba(40,25,10,.25)"; ctx.fillRect(R() * Lw, -ZG + R() * (ZG - 2), 1.4, 1.4); }
        ctx.beginPath(); ctx.moveTo(m, 0);
        for (u = m; u <= L - m; u += 4) ctx.lineTo(u, -2 - (ZG - 7) * Math.sin(Math.PI * (u - m) / (L - 2 * m)));
        ctx.lineTo(L - m, 0); ctx.closePath();
        var wg = ctx.createLinearGradient(0, 0, 0, -ZG); wg.addColorStop(0, "#5fb2e6"); wg.addColorStop(1, "#1d5c9a");
        ctx.fillStyle = wg; ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(m, 0); ctx.lineTo(L - m, 0); ctx.stroke();
      });
      I.tree(ctx, L * .15, m * .45, 0, L > 200 ? .9 : .6); I.tree(ctx, L * .6, m * .45, 0, L > 200 ? .8 : .55); I.tree(ctx, L - m * .45, D * .4, 0, L > 200 ? .9 : .6);
      var a0 = I.P(m, m, 0), a1 = I.P(L - m, D, 0), sg = ctx.createLinearGradient(a0.x, a0.y, a1.x, a1.y);
      sg.addColorStop(0, "#a6dbf7"); sg.addColorStop(1, "#4d9fd8");
      I.plane(ctx, 0.3, sg, "rgba(255,255,255,.75)", m, L - m, m, D);
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1;
      for (i = 0; i < 7; i++) { var gx = m + ((i * 0.37) % 1) * (L - 2 * m - 20), gy = m + 10 + ((i * 0.61) % 1) * (D - m - 20), p0 = I.P(gx, gy, 0.3), p1 = I.P(gx + 18, gy, 0.3); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.quadraticCurveTo((p0.x + p1.x) / 2, p0.y - 2.5, p1.x, p1.y); ctx.stroke(); }
    }
    function swan(p, black, sc) {
      var x = p.x, y = p.y; sc = sc || 1;
      ctx.fillStyle = "rgba(20,40,80,.18)"; ctx.beginPath(); ctx.ellipse(x + 1, y + 1.5, 11 * sc, 3 * sc, 0, 0, 6.2832); ctx.fill();
      var bg = ctx.createRadialGradient(x - 3 * sc, y - 6 * sc, 1, x, y - 3 * sc, 11 * sc);
      if (black) { bg.addColorStop(0, "#5a6070"); bg.addColorStop(1, "#0b0c10"); } else { bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, "#b8c3d4"); }
      ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(x, y - 3 * sc, 10 * sc, 5 * sc, 0, 0, 6.2832); ctx.fill();
      if (!black) { ctx.strokeStyle = "rgba(110,130,160,.6)"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.strokeStyle = black ? "#16181e" : "#f4f7fc"; ctx.lineWidth = 2.8 * sc; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + 6 * sc, y - 5 * sc); ctx.quadraticCurveTo(x + 12 * sc, y - 16 * sc, x + 6 * sc, y - 18 * sc); ctx.stroke(); ctx.lineCap = "butt";
      ctx.fillStyle = black ? "#16181e" : "#f4f7fc"; ctx.beginPath(); ctx.arc(x + 6 * sc, y - 18 * sc, 2.8 * sc, 0, 6.2832); ctx.fill();
      ctx.fillStyle = black ? "#e0283c" : "#f08a24"; ctx.beginPath(); ctx.moveTo(x + 4 * sc, y - 19 * sc); ctx.lineTo(x - 1 * sc, y - 17.5 * sc); ctx.lineTo(x + 4 * sc, y - 16.5 * sc); ctx.fill();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var shown = Math.min(got.n, 60), fc = IE.P(IE.L * .55, IE.D * .6, 0), BX = [0, LW];
      K.studio(ctx, 0, 0, LW, H, { x: fc.x + 40, y: fc.y + 66, rx: 300, ry: 54 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      lake(IE, 3);
      SPOT.slice(0, shown).sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); }).forEach(function (q) { swan(IE.P(q[0], q[1], 0.3), false, .85); });
      ctx.globalAlpha = got.black ? 1 : 0.38; lake(IA, 9); ctx.globalAlpha = 1;
      if (got.black) swan(IA.P(66, 56, 0.3), true, 1.3);
      ctx.restore();
      if (shown) IE.label(ctx, IE.L * .62, IE.D * .78, 0.3, "관찰한 흰 백조 " + got.n + "마리", 60, 44, "#ffffff", BX);
      IE.label(ctx, IE.L * .22, IE.D, -8, "유럽의 호수", -24, 40, "#d9f7c8", BX);
      IA.label(ctx, 65, 0, 0, got.black ? "1697년 오스트레일리아" : "아직 모르는 대륙", 10, -34, got.black ? "#ffb3b3" : "#c7d0e0", BX);
      var hl = got.black ? ["검은 백조 한 마리!", "흰 백조 " + got.n + "마리의 결론이 무너졌다"] : (got.n >= 20 ? ["흰 백조 " + got.n + "마리", "그러니 모든 백조는 희다?"] : ["관찰한 백조 " + got.n + "마리", "20마리 넘게 모아 결론 내리기"]);
      K.bigText(ctx, hl[0], 18, 44, 25, got.black ? "#ff8a8a" : "#ffffff");
      K.bigText(ctx, hl[1], 18, 72, 15, "#ffd35a");
      K.warn(ctx, LW - 14, H - 14, "⚠ 백조·호수 크기는 실제 비율이 아님", "right");
      /* 오른쪽 판정 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18;
      K.card(ctx, RX, 0, W - RX, H, "판정");
      cardHead(ctx, got.black ? "결론이 무너짐" : (got.n >= 20 ? "모든 백조는 희다?" : "관찰 중"), px, 62, got.black ? LT.red : (got.n >= 20 ? LT.blue : LT.mute));
      K.row(ctx, "유럽에서 본 백조", got.n + "마리", px, xr, 100);
      K.row(ctx, "그 가운데 흰 백조", got.n + "마리", px, xr, 128);
      K.row(ctx, "1697년 검은 백조", got.black ? "1마리" : "아직 모름", px, xr, 156, got.black ? LT.red : LT.dim);
      K.bar(ctx, px, 170, xr - px, got.n / 20, got.n >= 20 ? LT.green : LT.yellow);
      K.t(ctx, "결론을 내릴 관찰 " + Math.min(got.n, 20) + " / 20", px, 198, { s: 11, w: "700", c: LT.mute });
      K.tip(ctx, got.black ? "관찰 하나가 결론을 뒤집었다" : (got.n >= 20 ? "귀납적 결론 · 늘 잠정적이다" : "백조를 더 관찰해 보세요"), px - 4, 212, xr - px + 8, got.black ? false : (got.n >= 20 ? true : null));
      K.t(ctx, got.black ? "관찰을 아무리 쌓아도" : "새 대륙에도 흰 백조만", px, 270, { s: 11.5, w: "800", c: "#1179a6" });
      K.t(ctx, got.black ? "보지 못한 사례까지 보장하지 못한다" : "살고 있을까?", px, 288, { s: 11.5, w: "800", c: "#1179a6" });
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
      why: ["수천 년의 관찰도 검은 백조 한 마리를 막지 못했습니다.", "귀납적 결론은 지금까지의 관찰로 가장 그럴듯한 것일 뿐, 새로운 관찰에 열려 있습니다.", "귀납은 규칙을 찾는 데 꼭 필요합니다. 다만 결론을 늘 시험해야 할 뿐입니다."],
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
    var ph = 0, playing = !REDUCE;
    var LW = 600, IB = K.iso({ ox: 300, oy: 196, s: 0.6, L: 300, D: 120 });
    var NS = { straight: "곧은 목", swan: "S자 백조목", tilt: "백조목 · 적심", broken: "백조목 · 부러뜨림" };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var m = murk(), i, base = IB.P(150, 60, 0), cx = base.x, r = 58, cy = base.y - r + 4, box = [0, LW], fl = IB.P(IB.L / 2, IB.D / 2, 0);
      K.studio(ctx, 0, 0, LW, H, { x: fl.x + 20, y: fl.y + 66, rx: 270, ry: 46 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      /* 나무 실험대 */
      IB.box(ctx, 0, 0, -16, IB.L, IB.D, 0, "#c99b66", "#9b6f43", "#7d5735");
      ctx.strokeStyle = "rgba(90,55,25,.16)"; ctx.lineWidth = 1;
      for (i = 1; i < 8; i++) { var w0 = IB.P(0, i * 15, 0), w1 = IB.P(IB.L, i * 15, 0); ctx.beginPath(); ctx.moveTo(w0.x, w0.y); ctx.lineTo(w1.x, w1.y); ctx.stroke(); }
      /* 알코올 램프(고기즙을 끓인 도구) */
      var lp = IB.P(36, 34, 0);
      glassCyl(ctx, lp.x, lp.y, 13, 20, 13, "#bfe3f2", { e: .35 });
      ctx.fillStyle = "#8a8f99"; ctx.fillRect(lp.x - 3, lp.y - 28, 6, 8);
      floorShadow(ctx, cx + 14, base.y + 2, 74, 16, .32);
      var tipX, tipY, trapX = null, trapY = null;
      function neckPath() {
        ctx.beginPath(); ctx.moveTo(cx, cy - r + 6);
        if (neck === "straight") { ctx.lineTo(cx, cy - r - 70); tipX = cx; tipY = cy - r - 70; }
        else if (neck === "broken") { ctx.lineTo(cx, cy - r - 22); tipX = cx; tipY = cy - r - 22; }
        else { ctx.bezierCurveTo(cx, cy - r - 60, cx + 110, cy - r + 10, cx + 130, cy - r - 60); tipX = cx + 130; tipY = cy - r - 60; trapX = cx + 70; trapY = cy - r - 18; }
      }
      /* 고기즙 */
      var b0 = [236, 196, 120], b1 = [150, 118, 64], bc = b0.map(function (q, k) { return Math.round(q + (b1[k] - q) * m); });
      var ly = cy + 6, hw = Math.sqrt(r * r - 36) - 2;
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - 2, 0, 6.2832); ctx.clip();
      var lg = ctx.createLinearGradient(cx - r, 0, cx + r, 0);
      lg.addColorStop(0, "rgba(" + bc.map(function (q) { return Math.round(q * .7); }).join(",") + ",.95)"); lg.addColorStop(.4, "rgba(" + bc.join(",") + "," + (.82 + m * .15) + ")"); lg.addColorStop(1, "rgba(" + bc.map(function (q) { return Math.round(q * .6); }).join(",") + ",.95)");
      ctx.fillStyle = lg; ctx.fillRect(cx - r, ly, 2 * r, r + 4);
      ctx.fillStyle = "rgba(" + bc.map(function (q) { return Math.min(255, q + 30); }).join(",") + ",.9)"; ctx.beginPath(); ctx.ellipse(cx, ly, hw, 6, 0, 0, 6.2832); ctx.fill();
      if (m > 0) {
        ctx.fillStyle = "rgba(110,90,50," + (m * .35).toFixed(3) + ")"; ctx.fillRect(cx - r, ly, 2 * r, r + 4);
        for (i = 0; i < Math.round(m * 46); i++) { ctx.fillStyle = "rgba(55,95,35,.85)"; ctx.beginPath(); ctx.arc(cx - 40 + (i * 29) % 80 + Math.sin(ph * 6 + i) * 2, ly + 8 + (i * 17) % 40 + Math.cos(ph * 5 + i) * 2, 1.4, 0, 6.2832); ctx.fill(); }
      }
      ctx.restore();
      /* 유리 */
      var gg = ctx.createRadialGradient(cx - 24, cy - 26, 4, cx, cy, r); gg.addColorStop(0, "rgba(255,255,255,.55)"); gg.addColorStop(.6, "rgba(215,232,250,.22)"); gg.addColorStop(1, "rgba(150,180,220,.32)");
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(80,110,150,.85)"; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r - 8, 1.1 * Math.PI, 1.38 * Math.PI); ctx.stroke();
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      neckPath(); ctx.strokeStyle = "rgba(80,110,150,.85)"; ctx.lineWidth = 14; ctx.stroke();
      neckPath(); ctx.strokeStyle = "rgba(236,244,253,.97)"; ctx.lineWidth = 9.5; ctx.stroke();
      neckPath(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
      if (neck === "broken") { ctx.strokeStyle = "rgba(80,110,150,.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 7, tipY); ctx.lineTo(cx - 3, tipY - 5); ctx.lineTo(cx + 1, tipY - 1); ctx.lineTo(cx + 5, tipY - 6); ctx.lineTo(cx + 7, tipY); ctx.stroke(); }
      ctx.restore();
      if (neck === "tilt") { ctx.fillStyle = "rgba(220,170,90,.95)"; ctx.beginPath(); ctx.ellipse(trapX, trapY + 3, 10, 4, 0, 0, 6.2832); ctx.fill(); }
      if (neck === "broken") {   /* 부러져 실험대에 놓인 목 조각 */
        var bp = IB.P(250, 34, 0);
        ctx.save(); ctx.lineCap = "round";
        [["rgba(80,110,150,.85)", 12], ["rgba(236,244,253,.97)", 8]].forEach(function (q) { ctx.strokeStyle = q[0]; ctx.lineWidth = q[1]; ctx.beginPath(); ctx.moveTo(bp.x - 36, bp.y - 2); ctx.quadraticCurveTo(bp.x, bp.y - 26, bp.x + 34, bp.y - 6); ctx.stroke(); });
        ctx.restore();
      }
      /* 먼지(미생물이 묻은) */
      var n = Math.min(24, day * 2 + 4);
      for (i = 0; i < n; i++) { ctx.fillStyle = "rgba(110,88,66,.85)"; ctx.beginPath(); ctx.arc(tipX - 30 + (i * 37) % 60 + Math.sin(ph * 2 + i) * 3, tipY - 10 - (i * 23) % 30 + Math.cos(ph * 1.6 + i * 1.3) * 2, 1.7, 0, 6.2832); ctx.fill(); }
      if (neck === "straight" || neck === "broken") for (i = 0; i < 3; i++) { var u = (ph * .5 + i / 3) % 1; ctx.fillStyle = "rgba(110,88,66,.9)"; ctx.beginPath(); ctx.arc(cx + Math.sin(u * 9 + i) * 2, tipY + (ly - tipY) * u, 1.8, 0, 6.2832); ctx.fill(); }
      if (trapX !== null && day > 0) for (var k2 = 0; k2 < Math.min(14, day + 2); k2++) { ctx.fillStyle = neck === "tilt" ? "rgba(200,60,70,.95)" : "rgba(110,88,66,.9)"; ctx.beginPath(); ctx.arc(trapX - 12 + k2 * 2, trapY + 2 - (k2 % 3), 1.8, 0, 6.2832); ctx.fill(); }
      K.arrow(ctx, { x: tipX + 20, y: tipY - 30 }, { x: tipX + 8, y: tipY - 8 }, LT.blue, 2, 8);
      K.arrow(ctx, { x: tipX - 8, y: tipY - 8 }, { x: tipX - 20, y: tipY - 30 }, LT.blue, 2, 8);
      ctx.restore();
      tag(ctx, tipX + 16, tipY - 26, "공기는 드나든다", 26, -16, "#bfe6ff", box);
      if (trapX !== null) tag(ctx, trapX, trapY + 4, neck === "tilt" ? "고기즙이 먼지를 적심" : "먼지가 굽은 곳에 걸림", 40, 40, neck === "tilt" ? "#ffb3b3" : "#f4e6c4", box);
      tag(ctx, cx - r * .5, ly + 22, "끓인 고기즙", -60, 30, "#f4e6c4", box);
      var hl = m === 0 ? (neck === "swan" ? (day >= 14 ? ["14일째에도 맑다", "공기는 통하는데 먼지만 걸렸다"] : [day + "일째 · 맑음", "S자 목이 먼지를 막을까?"]) : [day + "일째 · 아직 맑음", "며칠 더 지켜보세요"]) : [day + "일째 · 상했다", neck === "straight" ? "먼지가 곧장 떨어져 들어갔다" : "먼지가 고기즙에 닿자 상했다"];
      K.bigText(ctx, hl[0], 18, 44, 25, m === 0 ? "#ffffff" : "#ffb36b");
      K.bigText(ctx, hl[1], 18, 72, 15, "#ffd35a");
      K.warn(ctx, 18, H - 16, "⚠ 먼지 알갱이는 크게 그림");
      /* 오른쪽 판정 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18;
      K.card(ctx, RX, 0, W - RX, H, "판정 · " + day + "일째");
      cardHead(ctx, m === 0 ? "맑음 — 미생물 없음" : (m < .5 ? "흐려지기 시작" : "상함 — 미생물 가득"), px, 62, m === 0 ? LT.green : LT.red, 19);
      K.row(ctx, "플라스크", NS[neck], px, xr, 98);
      K.row(ctx, "공기가 드나드나?", "예", px, xr, 126, LT.blue);
      K.row(ctx, "먼지가 고기즙에 닿나?", neck === "swan" ? "아니요" : "예", px, xr, 154, neck === "swan" ? LT.green : LT.red);
      K.bar(ctx, px, 168, xr - px, day / 14, neck === "swan" ? LT.green : LT.orange);
      K.t(ctx, "지켜본 날 " + day + " / 14일", px, 196, { s: 11, w: "700", c: LT.mute });
      var mx = px + 46, my = 266, mr = 46;
      var mg = ctx.createRadialGradient(mx - 12, my - 14, 4, mx, my, mr); mg.addColorStop(0, "rgba(" + bc.map(function (q) { return Math.min(255, q + 25); }).join(",") + ",1)"); mg.addColorStop(1, "rgba(" + bc.map(function (q) { return Math.round(q * .62); }).join(",") + ",1)");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.2832); ctx.clip();
      var Rm = K.rng(5);
      for (i = 0; i < Math.round(m * 40); i++) {
        var bx = mx + (Rm() - .5) * mr * 1.8 + Math.sin(ph * 3 + i) * 2, by2 = my + (Rm() - .5) * mr * 1.8 + Math.cos(ph * 2.5 + i) * 2;
        ctx.save(); ctx.translate(bx, by2); ctx.rotate(Rm() * 3.14); ctx.fillStyle = "rgba(40,110,40,.9)"; ctx.beginPath(); ctx.roundRect(-5, -2, 10, 4, 2); ctx.fill(); ctx.restore();
      }
      ctx.restore();
      ctx.strokeStyle = "#5c6470"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(mx, my, mr + 2, 0, 6.2832); ctx.stroke();
      K.t(ctx, "현미경으로 본", mx + mr + 16, my - 12, { s: 11.5, w: "700", c: LT.mute });
      K.t(ctx, "고기즙 한 방울", mx + mr + 16, my + 6, { s: 11.5, w: "700", c: LT.mute });
      K.t(ctx, m === 0 ? "미생물 없음" : "미생물 우글우글", mx + mr + 16, my + 30, { s: 13, w: "900", c: m === 0 ? LT.green : LT.red });
    }
    function update() {
      draw();
      var m = murk();
      if (neck === "swan" && day >= 14 && !got.a) { got.a = true; window.sthState("flaskGot", got); }
      if ((neck === "tilt" || neck === "broken") && day >= 3 && !got.b) { got.b = true; window.sthState("flaskGot", got); }
      put("a-flask-info", NAME[neck] + ", " + day + "일째: " + (m === 0 ? "고기즙이 맑습니다." : "고기즙이 흐려졌습니다.") + " "
        + (neck === "swan" ? (day >= 14 ? "✅ 공기는 자유롭게 드나드는데도 14일 동안 맑습니다. 먼지 속 미생물이 굽은 목에 걸렸기 때문입니다." : "며칠 더 지켜보세요.")
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
    playBtn("a-flask-play", "⏸ 먼지 멈추기", "▶ 먼지 움직이기", function () { return playing; }, function (q) { playing = q; });
    K.animate(canvas, function (dt) { if (playing) { ph += dt / 1000; draw(); } });
    segWire("a-neck", "data-v", function (x) { neck = x; update(); });
    $("a-day").addEventListener("input", function (ev) { day = +ev.target.value; $("a-day-val").textContent = day + "일"; update(); });
    window.sthPick({
      mount: "a-flask-pick",
      q: "백조목 플라스크 실험이 자연발생설을 무너뜨린 결정적 실험이 된 까닭은?",
      options: ["플라스크 모양이 아름다워 사람들의 관심을 끌었기 때문에", "공기는 드나들게 해 ‘생명력 있는 공기’라는 자연발생설의 조건을 채우면서, 먼지 속 미생물만 막아 두 설명의 예측이 갈렸기 때문에", "고기즙을 더 오래 끓였기 때문에"],
      answer: 1,
      why: ["모양이 아니라 실험의 논리가 핵심이었습니다.", "입구를 막으면 자연발생설 쪽은 ‘공기가 없어서’라고 반박할 수 있었습니다. 공기는 통하게 하면서 미생물만 막아, 한쪽 예측만 맞게 만든 것이 결정적이었습니다.", "끓이는 시간은 곧은 목 플라스크와 같았습니다. 다른 조건은 같게, 목 모양만 달랐습니다."],
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
      { t: "끓인 뒤 플라스크 입구를 불에 녹여 완전히 막는다", a: "none", why: "자연발생설 쪽도 ‘공기가 없어서’라며 상하지 않는다고 예측합니다. 그래서 이 실험으로는 논쟁이 끝나지 않았습니다.", hint: "자연발생설은 무엇이 있어야 생물이 생긴다고 했나요?" },
      { t: "끓인 뒤 입구를 막고 얼음 창고에 둔다", a: "none", why: "공기도 먼지도 들어가지 않습니다." },
      { t: "끓인 고기즙을 S자 백조목 플라스크에 둔다", a: "split", why: "공기는 들어가니 자연발생설은 ‘상한다’, 먼지는 막히니 생물속생설은 ‘상하지 않는다’고 예측합니다." },
      { t: "끓인 뒤 입구를 솜마개로 막는다 (공기는 통하고 먼지는 걸러짐)", a: "split", why: "백조목과 같은 논리입니다. 공기는 통하고 미생물만 걸러집니다." }
    ],
    onDone: function () { window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>두 가설의 예측이 서로 다른 실험이어야 결정적 실험이 됩니다. 입구를 녹여 막는 실험(스팔란차니, 1768)으로 논쟁이 끝나지 않았던 까닭입니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m1-4", true);

  function finish() { window.sthState("r1", "완성 · " + (window.sthState("swanBest") || "") + " / " + (window.sthState("flaskBest") || "")); }
  function vs() {
    $("e1-vs").innerHTML = "<b>나의 첫 판단</b> " + (window.sthState("biogen") || "기록 없음") + "<br><b>백조 관찰</b> " + (window.sthState("swanBest") || "-") + "<br><b>백조목 플라스크</b> " + (window.sthState("flaskBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[과학탐구실험1 Ⅱ-2] 이야기 ① 목이 휜 플라스크",
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
    var h = sz * 0.866, s = flip ? -1 : 1, ty = cy - s * h * 0.6, by = cy + s * h * 0.4;
    ctx.save();
    var g = ctx.createLinearGradient(cx - sz / 2, ty, cx + sz / 2, by); g.addColorStop(0, "rgba(220,240,255,.34)"); g.addColorStop(.5, "rgba(150,190,255,.14)"); g.addColorStop(1, "rgba(200,225,255,.28)");
    ctx.fillStyle = g; ctx.strokeStyle = "rgba(220,235,255,.85)"; ctx.lineWidth = 1.8; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(cx, ty); ctx.lineTo(cx - sz / 2, by); ctx.lineTo(cx + sz / 2, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 4, ty + s * 14); ctx.lineTo(cx - sz / 2 + 14, by - s * 6); ctx.stroke();
    ctx.restore();
  }
  var SPEC = ["#ff3b30", "#ff9500", "#ffd60a", "#34c759", "#0a84ff", "#5e5ce6", "#af52de"];

  /* 장면 2 — 빛을 펼치기 */
  (function () {
    var canvas = $("b-c-disp"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, glass = "crown", inc = 60;
    var got = window.sthState("dispGot") || false;
    var LW = 600, IT = K.iso({ ox: 250, oy: 96, s: 0.72, L: 360, D: 290 }), ZB = 30, PH = 60;
    /* 실험대 위 평면 좌표 (u, v) 에서 스넬 법칙으로 빛길을 계산한다. 화면에는 180° 돌려 놓아 빛이 안쪽(뒤)으로 간다 */
    function V2(a, b) { return { u: a, v: b }; }
    function refr(d, N, eta) { var ci = -(N.u * d.u + N.v * d.v), s2 = eta * eta * (1 - ci * ci); if (s2 > 1) return null; var k = eta * ci - Math.sqrt(1 - s2); return V2(eta * d.u + k * N.u, eta * d.v + k * N.v); }
    function hitLine(p, d, a, b) { var ex = b.u - a.u, ey = b.v - a.v, den = d.u * ey - d.v * ex; if (Math.abs(den) < 1e-9) return null; var s = ((a.u - p.u) * ey - (a.v - p.v) * ex) / den; return V2(p.u + s * d.u, p.v + s * d.v); }
    var SD = 92, PA = V2(190, 120 - SD * .577), PB = V2(190 - SD / 2, 120 + SD * .289), PCc = V2(190 + SD / 2, 120 + SD * .289);
    var NIN = V2(-.866, -.5), NIX = V2(-.866, .5), M1 = V2((PA.u + PB.u) / 2, (PA.v + PB.v) / 2);
    function trace(n) {
      var a = (30 - inc) * Math.PI / 180, d = V2(Math.cos(a), Math.sin(a)), t1 = refr(d, NIN, 1 / n), x2 = hitLine(M1, t1, PA, PCc);
      return { d: d, t1: t1, x2: x2, t2: refr(t1, NIX, n) };
    }
    function Pz(p, z) { return IT.P(400 - p.u, 310 - p.v, z); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var g = GL[glass], dr = dev(g.r, inc), dv = dev(g.v, inc), tir = dr === null || dv === null, ok = !tir && dv - dr >= 3, i, k, box = [0, LW];
      var fl = IT.P(IT.L / 2, IT.D / 2, 0);
      K.studio(ctx, 0, 0, LW, H, { x: fl.x + 10, y: fl.y + 60, rx: 290, ry: 44 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, LW, H, 14); ctx.clip();
      /* 검은 실험대(어두운 방) */
      IT.box(ctx, 0, 0, -14, IT.L, IT.D, 0, "#1f2436", "#4a4f63", "#363a4c");
      ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1;
      for (i = 1; i < 9; i++) { var q0 = IT.P(i * 40, 0, 0), q1 = IT.P(i * 40, IT.D, 0); ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke(); }
      for (i = 1; i < 8; i++) { var q2 = IT.P(0, i * 40, 0), q3 = IT.P(IT.L, i * 40, 0); ctx.beginPath(); ctx.moveTo(q2.x, q2.y); ctx.lineTo(q3.x, q3.y); ctx.stroke(); }
      var outs = []; for (k = 0; k < 7; k++) outs.push(trace(g.r + (g.v - g.r) * k / 6));
      var tm = outs[3], xm = tm.x2, src = V2(M1.u - tm.d.u * 100, M1.v - tm.d.v * 100), scrTop = null;
      if (!tir) {
        var fr = Math.atan2(outs[0].t2.v, outs[0].t2.u), fv = Math.atan2(outs[6].t2.v, outs[6].t2.u), fm = (fr + fv) / 2;
        var sc0 = V2(xm.u + Math.cos(fm) * 150, xm.v + Math.sin(fm) * 150), qd = V2(-Math.sin(fm), Math.cos(fm)), HW = 60;
        var s1 = V2(sc0.u - qd.u * HW, sc0.v - qd.v * HW), s2 = V2(sc0.u + qd.u * HW, sc0.v + qd.v * HW);
        /* 흰 종이 화면(뒤쪽) */
        IT.quad(ctx, Pz(s1, 0), Pz(s2, 0), Pz(s2, 78), Pz(s1, 78), "#f4f6fa", "rgba(90,100,120,.7)");
        var hits = [];
        for (k = 0; k < 7; k++) { var o = outs[k], fk = Math.atan2(o.t2.v, o.t2.u), f3 = fm + (fk - fm) * 3; hits.push({ o: o, h: hitLine(o.x2, V2(Math.cos(f3), Math.sin(f3)), s1, s2) }); }
        var gu = (hits[6].h.u - hits[0].h.u) / 6, gv = (hits[6].h.v - hits[0].h.v) / 6;
        for (k = 0; k < 7; k++) { var hh = hits[k].h, c1 = V2(hh.u - gu * .55, hh.v - gv * .55), c2 = V2(hh.u + gu * .55, hh.v + gv * .55); IT.quad(ctx, Pz(c1, ZB - 16), Pz(c2, ZB - 16), Pz(c2, ZB + 16), Pz(c1, ZB + 16), rgba(SPEC[k], .92)); }
        for (k = 0; k < 7; k++) { var ra = Pz(hits[k].o.x2, ZB), rb = Pz(hits[k].h, ZB); beam(ctx, ra.x, ra.y, rb.x, rb.y, SPEC[k], 2.4); }
        scrTop = Pz(sc0, 78);
      }
      /* 프리즘 안에서 꺾인 빛 */
      var ia = Pz(M1, ZB), ib = Pz(xm, ZB);
      beam(ctx, ia.x, ia.y, ib.x, ib.y, "#fff4d6", 3);
      if (tir) {
        var t1 = tm.t1, dn = t1.u * .866 - t1.v * .5, rf = V2(t1.u - 1.732 * dn, t1.v + dn), xb = hitLine(xm, rf, PB, PCc);
        if (xb && (xb.u < PB.u || xb.u > PCc.u)) xb = hitLine(xm, rf, PA, PB);
        if (xb) { var eb = Pz(xb, ZB); beam(ctx, ib.x, ib.y, eb.x, eb.y, "#ffd0d0", 2.4); }
        K.glow(ctx, ib.x, ib.y, 5, "rgba(255,107,129,.95)", 3);
      }
      /* 유리 프리즘(꼭지각 60°) */
      [[PA, PB], [PB, PCc], [PCc, PA]].forEach(function (e) { IT.quad(ctx, Pz(e[0], 0), Pz(e[1], 0), Pz(e[1], PH), Pz(e[0], PH), "rgba(190,220,255,.16)", "rgba(220,238,255,.85)"); });
      var tp = [Pz(PA, PH), Pz(PB, PH), Pz(PCc, PH)];
      ctx.beginPath(); ctx.moveTo(tp[0].x, tp[0].y); ctx.lineTo(tp[1].x, tp[1].y); ctx.lineTo(tp[2].x, tp[2].y); ctx.closePath();
      ctx.fillStyle = "rgba(220,238,255,.32)"; ctx.fill(); ctx.strokeStyle = "rgba(240,248,255,.95)"; ctx.lineWidth = 1.4; ctx.stroke();
      /* 손전등(흰빛)과 들어가는 빛 */
      var sa = Pz(V2(src.u + tm.d.u * 16, src.v + tm.d.v * 16), ZB), sb = Pz(M1, ZB);
      beam(ctx, sa.x, sa.y, sb.x, sb.y, "#fffbe8", 5);
      var sw = 400 - src.u, sv = 310 - src.v;
      IT.box(ctx, sw - 14, sv - 14, 0, sw + 14, sv + 14, 48, "#d3d8e0", "#9aa1ad", "#7b8290");
      K.glow(ctx, sa.x, sa.y, 4, "rgba(255,250,230,.98)", 3);
      ctx.restore();
      tag(ctx, IT.P(sw, sv, 48).x, IT.P(sw, sv, 48).y, "손전등 · 흰빛 " + inc + "°로 비춤", 40, 34, "#fff4d6", box);
      tag(ctx, tp[0].x, tp[0].y, GL[glass].n + " 프리즘 · 꼭지각 60°", -40, 52, "#e8ecff", box);
      if (scrTop) tag(ctx, scrTop.x, scrTop.y, "흰 종이 화면", -50, -12, "#e8ecff", box);
      K.bigText(ctx, tir ? "빛이 프리즘에 갇혔다" : "벌어진 각 " + (dv - dr).toFixed(2) + "°", 18, 44, 25, tir ? "#ff8a8a" : (ok ? "#7ff0c0" : "#ffffff"));
      K.bigText(ctx, tir ? "두 번째 면에서 전반사 · 각을 키워 보세요" : (ok ? "빨강과 보라가 넓게 갈라졌다" : "3° 넘게 펼쳐 보세요"), 18, 72, 15, "#ffd35a");
      K.warn(ctx, LW - 14, 30, "⚠ 퍼지는 각은 3배로 과장", "right");
      /* 오른쪽 판정 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18;
      K.card(ctx, RX, 0, W - RX, H, "판정");
      cardHead(ctx, tir ? "전반사 — 못 나옴" : (ok ? "넓게 펼쳐짐" : "아직 좁음"), px, 62, tir ? LT.red : (ok ? LT.green : LT.orange));
      K.row(ctx, "프리즘 유리", g.n, px, xr, 100);
      K.row(ctx, "들어가는 각", inc + "°", px, xr, 128);
      K.row(ctx, "빨강이 꺾인 각", tir ? "—" : dr.toFixed(1) + "°", px, xr, 156, LT.red);
      K.row(ctx, "보라가 꺾인 각", tir ? "—" : dv.toFixed(1) + "°", px, xr, 184, LT.violet);
      K.row(ctx, "벌어진 각", tir ? "—" : (dv - dr).toFixed(2) + "°", px, xr, 212, ok ? LT.green : LT.ink);
      K.bar(ctx, px, 226, xr - px, tir ? 0 : (dv - dr) / 3, ok ? LT.green : LT.yellow);
      K.t(ctx, "3° 넘게 벌어지면 색을 하나씩 골라낸다", px, 254, { s: 10.5, w: "700", c: LT.mute });
      K.tip(ctx, tir ? "들어가는 각을 키워 보세요" : (ok ? "색마다 꺾이는 정도가 다르다" : "유리와 각도를 바꿔 보세요"), px - 4, 268, xr - px + 8, tir ? false : (ok ? true : null));
      K.t(ctx, "굴절률 빨강 " + g.r + " · 보라 " + g.v, px, 330, { s: 11, c: LT.mute });
      K.t(ctx, "빛길은 스넬 법칙으로 계산", px, 348, { s: 11, c: LT.mute });
      readout(dr, dv);
      return ok;
    }
    function readout(dr, dv) {
      var tir = dr === null || dv === null, ok = !tir && dv - dr >= 3;
      put("b-disp-read", tir
        ? "<span class='k'>상태</span><span class='v r'>전반사</span><span class='sub'>빛이 두 번째 면을 빠져나오지 못함</span><span class='ok r'>들어가는 각을 키워 보세요</span>"
        : "<span class='k'>꺾인 각</span><span class='v y'>빨강 " + dr.toFixed(1) + "° · 보라 " + dv.toFixed(1) + "°</span>" +
          "<span class='k'>벌어진 각</span><span class='v " + (ok ? "g" : "b") + "'>" + (dv - dr).toFixed(2) + "°</span>" +
          "<span class='sub'>" + GL[glass].n + " · 굴절률 빨강 " + GL[glass].r + " / 보라 " + GL[glass].v + "</span>" +
          "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "색을 하나씩 골라낼 만큼 넓음" : "아직 좁습니다 · 3° 넘게") + "</span>");
    }
    function update() {
      var ok = draw(), g = GL[glass], dr = dev(g.r, inc), dv = dev(g.v, inc);
      put("b-disp-info", (dr === null || dv === null) ? "빛이 첫 면에 너무 곧게 들어가, 두 번째 면에 비스듬히 닿아 빠져나오지 못하고 전부 반사됩니다. 들어가는 각을 키워 보세요."
        : g.n + ", 들어가는 각 " + inc + "°: 빨강과 보라가 " + (dv - dr).toFixed(2) + "° 벌어집니다. " + (ok ? "✅ 색을 하나씩 골라낼 만큼 넓게 펼쳐졌습니다. 납 유리는 색에 따른 굴절률 차이가 더 큽니다." : "아직 좁습니다. 유리 종류와 각도를 바꿔 보세요."));
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

  /* 장면 3 — 결정적 실험 : 뉴턴의 어두운 방을 블록처럼 잘라 본 아이소메트릭 모형(위) + 정면에서 본 벽(아래) */
  (function () {
    var canvas = $("b-c-crux"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, slit = "all", p2 = "none";
    var got = window.sthState("cruxGot") || { cols: [], rec: false, q: false };
    if (!got.cols) got.cols = [];
    var CI = { red: 0, green: 3, violet: 6 }, CN = { red: "빨강", green: "초록", violet: "보라" }, CJ = { red: "빨강은", green: "초록은", violet: "보라는" };
    /* 모형 좌표: x = 방의 길이(햇빛은 오른쪽 덧문에서 왼쪽 벽 쪽, −x 방향으로 간다), y = 깊이, z = 높이 */
    var DH = 432, ph = 0, playing = !REDUCE;
    var I = K.iso({ ox: 470, oy: 160, s: 0.58, L: 640, D: 220 });
    var L = I.L, D = I.D, HZ = 240, Y0 = 110, TZ = 70, WT = 12, YR = Y0 + 48;
    var HOLE = 196, P1 = 520, BX = 390, P2 = 230, ZC = 150, PA = 20, PY = 38;
    /* 첫 프리즘(꼭짓점이 아래)을 나온 뒤 색마다의 기울기 — 들어온 빛보다 모두 위로 꺾이고, 보라가 가장 많이 꺾인다(그림용 값) */
    var SL = SPEC.map(function (c, k) { return -0.19 + k * 0.04; });
    var IN_SL = (HOLE - ZC) / (L - (P1 + PA / 2));
    function zAt(k, x) { return ZC + (P1 - PA / 2 - x) * SL[k]; }
    function P(x, z, y) { return I.P(x, y == null ? Y0 : y, z); }
    function quad(a, b, c, d, fill, stroke) { I.quad(ctx, a, b, c, d, fill, stroke); }
    function tri(a, b, c, fill, stroke) {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke();
    }
    function flow(a, b, c) {
      if (!playing) return;
      var len = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.round(len / 46));
      for (var i = 0; i < n; i++) { var t = (ph * 0.55 + i / n) % 1; K.glow(ctx, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 1.6, rgba(c, .95), 2.2); }
    }
    function ray(s) { var a = P(s.x0, s.z0), b = P(s.x1, s.z1); beam(ctx, a.x, a.y, b.x, b.y, s.c, s.w); flow(a, b, s.c); }

    /* 지금 고른 판자 구멍·두 번째 프리즘으로 빛길을 정한다 */
    function rays() {
      var R = { a: [], b1: [], b2: [], board: [], wall: [], band: null, in2: null };
      var one = slit !== "all", k0 = one ? CI[slit] : -1, x1 = P1 - PA / 2, e2 = P2 + PA / 2, o2 = P2 - PA / 2;
      SPEC.forEach(function (c, k) {
        var zb = zAt(k, BX);
        R.a.push({ x0: x1, z0: ZC, x1: BX, z1: zb, c: c, w: 2.4 });
        if (one && k !== k0) R.board.push({ z: zb, c: c });
      });
      var pass = one ? [k0] : [0, 1, 2, 3, 4, 5, 6];
      if (p2 === "none") {
        pass.forEach(function (k) { var zw = zAt(k, 0); R.b2.push({ x0: BX - 7, z0: zAt(k, BX - 7), x1: 0, z1: zw, c: SPEC[k], w: one ? 3.4 : 2.4 }); R.wall.push({ z: zw, c: SPEC[k] }); });
        if (!one) R.band = [zAt(0, 0), zAt(6, 0)];
      } else {
        pass.forEach(function (k) { R.b1.push({ x0: BX - 7, z0: zAt(k, BX - 7), x1: e2, z1: ZC, c: SPEC[k], w: one ? 3.4 : 2.2 }); });
        R.in2 = one ? SPEC[k0] : "#fffbe8";
        if (!one && p2 === "flip") { R.b2.push({ x0: o2, z0: ZC, x1: 0, z1: ZC, c: "#fffbe8", w: 5 }); R.wall.push({ z: ZC, c: "#ffffff", white: true }); }
        else if (!one) { SPEC.forEach(function (c, k) { var zw = 60 + k * 28; R.b2.push({ x0: o2, z0: ZC, x1: 0, z1: zw, c: c, w: 2.4 }); R.wall.push({ z: zw, c: c }); }); R.band = [60, 228]; }
        else { var zw = p2 === "flip" ? 100 : 205; R.b2.push({ x0: o2, z0: ZC, x1: 0, z1: zw, c: SPEC[k0], w: 3.4 }); R.wall.push({ z: zw, c: SPEC[k0] }); }
      }
      return R;
    }

    function room() {
      var fl = I.P(L / 2, D, 0);
      K.studio(ctx, 0, 0, W, DH, { x: fl.x - 40, y: fl.y + 20, rx: 380, ry: 56 });
      /* 바닥 판(잘린 면은 회벽) */
      I.box(ctx, -WT, -WT, -16, L + WT, D, 0, "#4a3426", "#d7cbb6", "#bfb29b");
      ctx.strokeStyle = "rgba(0,0,0,.28)"; ctx.lineWidth = 1;
      for (var yy = 22; yy < D; yy += 22) { var a = I.P(0, yy, 0), b = I.P(L, yy, 0); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      /* 뒷벽·왼쪽 벽(안쪽 면은 어둡게 — 덧문을 닫은 방) */
      var bw = ctx.createLinearGradient(I.P(0, 0, HZ).x, 0, I.P(L, 0, HZ).x, 0); bw.addColorStop(0, "#1f2438"); bw.addColorStop(1, "#2c3350");
      quad(I.P(0, 0, 0), I.P(L, 0, 0), I.P(L, 0, HZ), I.P(0, 0, HZ), bw);
      quad(I.P(0, 0, 0), I.P(0, D, 0), I.P(0, D, HZ), I.P(0, 0, HZ), "#2a3150");
      quad(I.P(-WT, D, 0), I.P(0, D, 0), I.P(0, D, HZ), I.P(-WT, D, HZ), "#cfc3ad");
      quad(I.P(-WT, -WT, HZ), I.P(0, -WT, HZ), I.P(0, D, HZ), I.P(-WT, D, HZ), "#e6dcc8");
      quad(I.P(0, -WT, HZ), I.P(L, -WT, HZ), I.P(L, 0, HZ), I.P(0, 0, HZ), "#e6dcc8");
      ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1;
      [80, 160].forEach(function (z) { var a = I.P(0, 0, z), b = I.P(L, 0, z); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
    }
    function wallLight(R) {
      if (R.band) {
        var a = P(0, R.band[0]), b = P(0, R.band[1]), g = ctx.createLinearGradient(0, a.y, 0, b.y);
        SPEC.forEach(function (c, k) { g.addColorStop(k / 6, rgba(c, .55)); });
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        quad(P(0, R.band[0], Y0 - 12), P(0, R.band[0], Y0 + 12), P(0, R.band[1], Y0 + 12), P(0, R.band[1], Y0 - 12), g);
        ctx.restore();
      }
      R.wall.forEach(function (s) { var p = P(0, s.z); if (s.white) K.glow(ctx, p.x, p.y, 9, "rgba(255,255,250,.98)", 3.4); else K.glow(ctx, p.x, p.y, 4, rgba(s.c, .95), 3); });
    }
    function table() {
      var x0 = 160, x1 = 600, y0 = Y0 - 55, y1 = Y0 + 55;
      [[x0 + 6, y0 + 6], [x1 - 14, y0 + 6], [x0 + 6, y1 - 14], [x1 - 14, y1 - 14]].forEach(function (q) { I.box(ctx, q[0], q[1], 0, q[0] + 8, q[1] + 8, 62, "#7a4d2b", "#6b4426", "#553620"); });
      I.box(ctx, x0, y0, 62, x1, y1, TZ, "#8f5f36", "#6b4426", "#5a381f");
    }
    function stand(xc, ztop) {
      I.box(ctx, xc - 14, Y0 - 14, TZ, xc + 14, Y0 + 14, TZ + 4, "#b8bec7", "#9aa0a8", "#80868f");
      I.box(ctx, xc - 3, Y0 - 3, TZ + 4, xc + 3, Y0 + 3, ztop, "#c6ccd4", "#9aa0a8", "#6f757e");
    }
    /* 삼각 프리즘(축이 y 방향) — up 이면 꼭짓점이 위 */
    function prism3(xc, up, innerC) {
      var y0 = Y0 - PY, y1 = Y0 + PY, a = PA, b = PA, zc = ZC;
      stand(xc, zc - b);
      if (innerC) { var e = P(xc + a / 2, zc), o = P(xc - a / 2, zc); beam(ctx, e.x, e.y, o.x, o.y, innerC, 2.6); }
      var gF = "rgba(190,225,255,.30)", gT = "rgba(225,242,255,.40)", gE = "rgba(214,236,255,.45)", ed = "rgba(240,250,255,.95)";
      if (!up) {
        quad(P(xc, zc - b, y0), P(xc + a, zc + b, y0), P(xc + a, zc + b, y1), P(xc, zc - b, y1), gF, ed);
        quad(P(xc - a, zc + b, y0), P(xc + a, zc + b, y0), P(xc + a, zc + b, y1), P(xc - a, zc + b, y1), gT, ed);
        tri(P(xc, zc - b, y1), P(xc - a, zc + b, y1), P(xc + a, zc + b, y1), gE, ed);
      } else {
        quad(P(xc, zc + b, y0), P(xc + a, zc - b, y0), P(xc + a, zc - b, y1), P(xc, zc + b, y1), gF, ed);
        tri(P(xc, zc + b, y1), P(xc - a, zc - b, y1), P(xc + a, zc - b, y1), gE, ed);
      }
    }
    function board(R) {
      var y0 = Y0 - 58, y1 = Y0 + 58, z0 = TZ, z1 = 212, T = 7, one = slit !== "all";
      quad(P(BX - T, z0, y1), P(BX, z0, y1), P(BX, z1, y1), P(BX - T, z1, y1), "#5e3b1d");
      quad(P(BX - T, z1, y0), P(BX, z1, y0), P(BX, z1, y1), P(BX - T, z1, y1), "#b07a48");
      var hz0, hz1, hy0, hy1;
      if (one) { var zh = zAt(CI[slit], BX); hz0 = zh - 4; hz1 = zh + 4; hy0 = Y0 - 5; hy1 = Y0 + 5; }
      else { hz0 = 112; hz1 = 172; hy0 = Y0 - 34; hy1 = Y0 + 34; }
      var c = [P(BX, z0, y0), P(BX, z0, y1), P(BX, z1, y1), P(BX, z1, y0)], h = [P(BX, hz0, hy0), P(BX, hz1, hy0), P(BX, hz1, hy1), P(BX, hz0, hy1)];
      var g = ctx.createLinearGradient(c[3].x, c[3].y, c[1].x, c[1].y); g.addColorStop(0, "#a87244"); g.addColorStop(1, "#6e4726");
      ctx.beginPath(); c.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
      h.forEach(function (p, i) { if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath();
      ctx.fillStyle = g; ctx.fill("evenodd");
      ctx.strokeStyle = "rgba(40,22,8,.55)"; ctx.lineWidth = 1; ctx.stroke();
      R.board.forEach(function (s) { var p = P(BX, s.z); K.glow(ctx, p.x, p.y, 2.6, rgba(s.c, .95), 2.6); });
    }
    function shutterWall() {
      I.box(ctx, L, -WT, 0, L + WT, YR, HZ, "#e6dcc8", "#cfc3ad", "#d9cfbd");
      var X = L + WT;
      quad(P(X, HOLE - 46, Y0 - 38), P(X, HOLE - 46, Y0 + 38), P(X, HOLE + 40, Y0 + 38), P(X, HOLE + 40, Y0 - 38), "#7a5130", "rgba(40,22,8,.6)");
      ctx.strokeStyle = "rgba(40,22,8,.45)"; ctx.lineWidth = 1;
      var m0 = P(X, HOLE - 46, Y0 + 18), m1 = P(X, HOLE + 40, Y0 + 18); ctx.beginPath(); ctx.moveTo(m0.x, m0.y); ctx.lineTo(m1.x, m1.y); ctx.stroke();
      quad(P(X, HOLE - 4, Y0 - 4), P(X, HOLE - 4, Y0 + 4), P(X, HOLE + 4, Y0 + 4), P(X, HOLE + 4, Y0 - 4), "#05060c");
    }
    function headline() {
      var one = slit !== "all";
      if (!one) {
        if (p2 === "flip") return ["다시 흰빛이 되었다", "펼친 색을 모두 한데 모으자"];
        if (p2 === "same") return ["더 넓게 펼쳐졌다", "같은 방향으로 한 번 더 꺾이자"];
        return ["흰빛이 무지개로 펼쳐졌다", "판자 구멍으로 색을 골라 보세요"];
      }
      if (p2 === "none") return [CN[slit] + " 한 줄기만 지나갔다", "두 번째 프리즘에 보내 보세요"];
      return [CJ[slit] + " " + CN[slit] + " 그대로", "꺾이기만 하고 새 색은 없다"];
    }
    function result() {
      return slit === "all" ? (p2 === "flip" ? "다시 흰빛이 되었다" : (p2 === "same" ? "더 넓게 펼쳐진 무지개" : "무지개 띠")) : (p2 === "none" ? CN[slit] + " 한 줄기" : CN[slit] + " 그대로 — 새 색이 생기지 않았다");
    }
    function panel(R) {
      var y0 = DH + 8, h = H - y0, good = (slit !== "all" && p2 !== "none") || (slit === "all" && p2 === "flip");
      K.card(ctx, 0, y0, W, h, "정면에서 본 왼쪽 벽(화면)");
      var wx = 30, ww = 250, wy = y0 + 42, wh = h - 54, cx = wx + ww / 2;
      var wg = ctx.createLinearGradient(0, wy, 0, wy + wh); wg.addColorStop(0, "#2b3250"); wg.addColorStop(1, "#1b2034");
      ctx.fillStyle = wg; ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 8); ctx.fill();
      ctx.strokeStyle = "rgba(20,40,90,.35)"; ctx.lineWidth = 1; ctx.stroke();
      function zy(z) { return wy + wh - 6 - (z / HZ) * (wh - 12); }
      if (R.band) {
        var g = ctx.createLinearGradient(0, zy(R.band[0]), 0, zy(R.band[1]));
        SPEC.forEach(function (c, k) { g.addColorStop(k / 6, rgba(c, .6)); });
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(cx - 34, zy(R.band[1]) - 4, 68, zy(R.band[0]) - zy(R.band[1]) + 8, 8); ctx.fill();
        ctx.restore();
      }
      R.wall.forEach(function (s) { if (s.white) K.glow(ctx, cx, zy(s.z), 12, "rgba(255,255,250,.98)", 3); else K.glow(ctx, cx, zy(s.z), 5, rgba(s.c, .95), 3); });
      var rx = 320, ry = y0 + 62;
      K.t(ctx, "판자", rx, ry, { s: 12, c: LT.mute, w: "700" });
      K.t(ctx, slit === "all" ? "큰 구멍 — 흩어진 색이 모두 지나감" : "작은 구멍 — " + CN[slit] + "만 지나감", rx + 130, ry, { s: 14, w: "800", c: LT.ink });
      K.t(ctx, "두 번째 프리즘", rx, ry + 32, { s: 12, c: LT.mute, w: "700" });
      K.t(ctx, p2 === "none" ? "없음" : (p2 === "same" ? "첫 프리즘과 같은 방향" : "뒤집어서(꼭짓점이 위로)"), rx + 130, ry + 32, { s: 14, w: "800", c: LT.ink });
      K.t(ctx, "보내 본 단색", rx, ry + 64, { s: 12, c: LT.mute, w: "700" });
      K.t(ctx, got.cols.length ? got.cols.map(function (c) { return CN[c]; }).join(" · ") : "아직 없음", rx + 130, ry + 64, { s: 14, w: "800", c: got.cols.length >= 2 ? LT.green : LT.ink });
      K.tip(ctx, "화면: " + result(), rx - 4, H - 50, 540, good ? true : null);
    }
    function draw() {
      var R = rays(), one = slit !== "all", box = [0, W];
      ctx.clearRect(0, 0, W, H);
      room();
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      wallLight(R);
      table();
      R.b2.forEach(ray);
      if (p2 !== "none") prism3(P2, p2 === "flip", R.in2);
      R.b1.forEach(ray);
      I.person(ctx, 140, 200, 0, "#5b3f8c", 3);
      board(R);
      R.a.forEach(ray);
      prism3(P1, false, "#fffbe8");
      ray({ x0: L, z0: HOLE, x1: P1 + PA / 2, z1: ZC, c: "#fffbe8", w: 5 });
      shutterWall();
      var hs = P(L + WT, HOLE + WT * IN_SL), sun = P(L + WT + 210, HOLE + (WT + 210) * IN_SL);
      K.glow(ctx, sun.x, sun.y, 12, "rgba(255,236,170,.98)", 3.4);
      beam(ctx, sun.x, sun.y, hs.x, hs.y, "#fff3c8", 6); flow(sun, hs, "#fff3c8");
      K.glow(ctx, hs.x, hs.y, 4, "rgba(255,250,230,.98)", 3);
      ctx.restore();
      /* 이름표 */
      I.label(ctx, L + WT, Y0, HOLE, "덧문 구멍의 햇빛", 34, -62, "#fff4d6", box);
      I.label(ctx, P1, Y0 - PY, ZC + PA, "첫 번째 프리즘", 36, -82, "#e8ecff", box);
      I.label(ctx, BX, Y0 + 58, 212, one ? "판자 · 작은 구멍" : "판자 · 큰 구멍", 24, -62, "#f1d7b8", box);
      if (p2 !== "none") I.label(ctx, P2, Y0 - PY, ZC + PA, "두 번째 프리즘 · " + (p2 === "flip" ? "뒤집음" : "같은 방향"), 22, -96, "#e8ecff", box);
      I.label(ctx, 0, D - 40, 40, "벽(화면)", -36, 34, "#bfe6ff", box);
      var hl = headline();
      K.bigText(ctx, hl[0], 22, 50, 27, "#ffffff");
      K.bigText(ctx, hl[1], 22, 82, 17, "#ffd35a");
      K.warn(ctx, W - 14, 30, "⚠ 방·프리즘 크기와 빛이 퍼지는 각은 보기 쉽게 과장", "right");
      panel(R);
    }
    function update() {
      draw();
      if (slit !== "all" && p2 !== "none" && got.cols.indexOf(slit) < 0) { got.cols.push(slit); window.sthState("cruxGot", got); }
      if (slit === "all" && p2 === "flip" && !got.rec) { got.rec = true; window.sthState("cruxGot", got); }
      put("b-crux-info", slit === "all"
        ? (p2 === "flip" ? "✅ 흩어진 모든 색을 뒤집은 프리즘에 모으자 다시 흰빛이 되었습니다. 흰빛은 여러 색이 섞인 것입니다." : (p2 === "same" ? "같은 방향의 프리즘을 한 번 더 지나 더 넓게 펼쳐졌습니다." : "첫 번째 프리즘이 흰빛을 무지개로 펼쳤습니다. 판자 구멍으로 색을 하나 골라 보세요."))
        : (p2 === "none" ? CN[slit] + "빛 한 줄기만 판자를 지났습니다. 두 번째 프리즘에 보내 보세요." : "✅ " + CN[slit] + "빛은 두 번째 프리즘에서 꺾이기만 하고 색은 그대로입니다. 유리가 색을 만든다면 새 색이 생겨야 했습니다.")
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
    playBtn("b-crux-play", "⏸ 빛 흐름 멈추기", "▶ 빛 흐름 보기", function () { return playing; }, function (x) { playing = x; draw(); });
    K.animate(canvas, function (dt) { if (!playing) return; ph += dt / 1000; draw(); }, 24);
    segWire("b-slit", "data-v", function (x) { slit = x; update(); });
    segWire("b-p2", "data-v", function (x) { p2 = x; update(); });
    window.sthPick({
      mount: "b-crux-pick",
      q: "두 번째 프리즘 실험에서 끌어낼 수 있는 결론은?",
      options: ["프리즘의 유리가 흰빛에 색을 입힌다", "색은 흰빛 속에 원래 들어 있고, 프리즘은 색마다 다르게 꺾어 나눌 뿐이다", "빛은 프리즘을 지나면 사라진다"],
      answer: 1,
      why: ["그렇다면 한 가지 색도 두 번째 프리즘에서 또 다른 색으로 바뀌어야 했습니다.", "한 가지 색은 더 나뉘지 않고, 모두 모으면 흰빛으로 돌아옵니다. 가설이 예측한 두 결과가 모두 나왔습니다.", "빛은 꺾일 뿐 사라지지 않았습니다."],
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
      { t: "예측이 모두 맞았으므로, 흰빛은 여러 색의 빛이 섞인 것이라고 판단한다", a: "con", why: "결과를 보고 가설을 받아들인 판단입니다. 같은 생각도 실험 전에는 가설, 결과로 확인한 뒤에는 결론입니다." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>가설 → 예측 → 결과 → 결론. 예측과 결과가 맞으면 가설을 받아들이고, 어긋나면 고칩니다. 연역적 탐구의 뼈대입니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "완성 · " + (window.sthState("dispBest") || "") + " / " + (window.sthState("cruxBest") || "")); }
  function vs() {
    $("e2-vs").innerHTML = "<b>나의 첫 제안</b> " + (window.sthState("prism1") || "기록 없음") + "<br><b>빛 펼치기</b> " + (window.sthState("dispBest") || "-") + "<br><b>결정적 실험</b> " + (window.sthState("cruxBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[과학탐구실험1 Ⅱ-2] 이야기 ② 두 번째 프리즘",
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
    var LW = 600;
    /* 작은 모형: 풀밭 블록 위 백엽상 */
    function station(x, y) {
      var I = K.iso({ ox: x, oy: y, s: 0.5, L: 110, D: 80 });
      I.box(ctx, 0, 0, -16, 110, 80, 0, "#86b86e", "#8a6a4a", "#6d523a");
      I.tree(ctx, 96, 12, 0, .7);
      [[42, 30], [64, 30], [42, 48], [64, 48]].forEach(function (q) { I.box(ctx, q[0], q[1], 0, q[0] + 3, q[1] + 3, 32, "#f4f4f0", "#d8d8d2", "#bdbdb6"); });
      I.box(ctx, 38, 26, 32, 70, 54, 60, "#ffffff", "#eceeea", "#cfd3cc");
      ctx.strokeStyle = "rgba(40,50,60,.22)"; ctx.lineWidth = 1;
      for (var z = 36; z < 58; z += 4) { var a = I.P(38, 54, z), b = I.P(70, 54, z), c = I.P(70, 26, z); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.stroke(); }
      I.box(ctx, 35, 23, 60, 73, 57, 64, "#f8f8f6", "#e2e4e0", "#c8ccc6");
    }
    function thermo(x, y0, y1, f) {
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "rgba(60,80,110,.6)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.roundRect(x - 5, y0, 10, y1 - y0, 5); ctx.fill(); ctx.stroke();
      var fy = y1 - (y1 - y0 - 6) * clamp(f, 0, 1);
      ctx.fillStyle = "#e03131"; ctx.beginPath(); ctx.roundRect(x - 2.5, fy, 5, y1 - fy + 4, 2.5); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y1 + 6, 8, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "rgba(60,80,110,.6)"; ctx.stroke();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      K.studio(ctx, 0, 0, LW, H);
      var g = K.chart(ctx, { x: 6, y: 88, w: LW - 12, h: H - 94, pl: 48, pt: 8, pb: 30, pr: 16, x0: 0, x1: 50, y0: 11.5, y1: 14.5, xt: 5, yt: 6, light: true, xf: function () { return ""; }, yf: function (q) { return q + "°"; } });
      function X(i) { return g.X(i + 0.5); }
      [1974, 1984, 1994, 2004, 2014, 2023].forEach(function (yy) { K.t(ctx, String(yy), X(yy - Y0), g.B + 16, { s: 10.5, a: "center", c: LT.mute, w: "700" }); });
      var a = s - Y0, b = e - Y0, f = b - a >= 2 ? fit(a, b) : null, i;
      if (b > a) { ctx.fillStyle = "rgba(245,159,0,.13)"; ctx.fillRect(X(a) - 6, g.T, X(b) - X(a) + 12, g.B - g.T); ctx.save(); ctx.strokeStyle = "rgba(245,159,0,.7)"; ctx.setLineDash([4, 3]); ctx.strokeRect(X(a) - 6, g.T, X(b) - X(a) + 12, g.B - g.T); ctx.restore(); }
      TMP.forEach(function (t, j) { var on = j >= a && j <= b; ctx.fillStyle = on ? LT.ink : "rgba(92,112,134,.32)"; ctx.beginPath(); ctx.arc(X(j), g.Y(t), on ? 3.4 : 2.6, 0, 6.2832); ctx.fill(); });
      if (f) K.plot(ctx, { X: X, Y: g.Y }, [[a, f.m * a + f.c], [b, f.m * b + f.c]], f.m < 0 ? LT.blue : LT.red, { w: 3.2, light: true });
      if (f) { K.bigText(ctx, "추세 " + (f.m * 10 >= 0 ? "+" : "") + (f.m * 10).toFixed(2) + " °C / 10년", 18, 44, 25, f.m < 0 ? "#8fd3ff" : "#ff9a8a"); K.bigText(ctx, s + " ~ " + e + " · " + (b - a + 1) + "년의 자료 (예시)", 18, 74, 15, "#ffd35a"); }
      else { K.bigText(ctx, "구간이 너무 짧다", 18, 44, 25, "#ffffff"); K.bigText(ctx, "끝 연도를 시작보다 2년 이상 뒤로", 18, 74, 15, "#ffd35a"); }
      /* 오른쪽 판정 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18, full = a === 0 && b === 49, sn = f && b - a <= 9 && f.m < 0;
      K.card(ctx, RX, 0, W - RX, H, "판정");
      cardHead(ctx, !f ? "추세를 못 그림" : (full ? "뚜렷하게 오른다" : (sn ? "내려가는 것처럼 보임" : (f.m < 0 ? "내려가는 구간" : "오르는 구간"))), px, 62, !f ? LT.mute : (f.m < 0 ? LT.blue : LT.red), 19);
      K.row(ctx, "분석 구간", s + " ~ " + e, px, xr, 98);
      K.row(ctx, "자료 수", Math.max(0, b - a + 1) + "년", px, xr, 126);
      K.row(ctx, "이 구간의 추세", f ? (f.m * 10 >= 0 ? "+" : "") + (f.m * 10).toFixed(2) + " °C/10년" : "—", px, xr, 154, f ? (f.m < 0 ? LT.blue : LT.red) : LT.dim);
      K.tip(ctx, full ? "50년 전체 · 오르는 경향이 뚜렷" : (sn ? "짧은 구간은 오르내림에 흔들림" : (b - a <= 9 ? "10년 이하는 해마다 흔들림이 큼" : "50년 전체와 비교해 보세요")), px - 4, 170, xr - px + 8, full ? true : (sn ? false : null));
      var tm = 0, nn = 0; for (i = Math.max(0, a); i <= Math.min(49, b); i++) { tm += TMP[i]; nn++; } tm = nn ? tm / nn : MEAN;
      station(RX + 96, 262);
      thermo(RX + 196, 236, 300, (tm - 11.5) / 3);
      K.t(ctx, "구간 평균", RX + 214, 258, { s: 11, w: "700", c: LT.mute });
      K.t(ctx, tm.toFixed(2) + " °C", RX + 214, 278, { s: 14, w: "900", c: LT.ink });
      K.t(ctx, "관측소 백엽상", RX + 102, 334, { s: 10.5, w: "700", a: "center", c: LT.mute });
      readout(a, b);
    }
    function readout(a, b) {
      if (b - a < 2) { put("c-tr-read", "<span class='k'>구간</span><span class='v r'>" + s + " ~ " + e + "</span><span class='ok r'>구간이 너무 짧거나 거꾸로입니다</span>"); return; }
      var f = fit(a, b), full = a === 0 && b === 49, shortNeg = b - a <= 9 && f.m < 0;
      put("c-tr-read",
        "<span class='k'>구간</span><span class='v y'>" + s + " ~ " + e + "</span><span class='sub'>" + (b - a + 1) + "년</span>" +
        "<span class='k'>추세</span><span class='v " + (f.m < 0 ? "b" : "r") + "'>" + (f.m * 10 >= 0 ? "+" : "") + (f.m * 10).toFixed(2) + " °C / 10년</span>" +
        "<span class='ok " + (full ? "g" : "r") + "'>" + (full ? "50년 전체 · 뚜렷하게 오르는 경향" : (shortNeg ? "짧은 구간만 보면 내려가는 것처럼 보임" : (b - a <= 9 ? "짧은 구간은 해마다의 오르내림에 흔들림" : "부분 구간의 추세"))) + "</span>");
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
          + (a === 0 && b === 49 ? "✅ 50년 전체로 보면 뚜렷하게 오르고 있습니다." : (b - a <= 9 && f.m < 0 ? "✅ 짧은 구간만 골라 보면 기온이 내려가는 것처럼 보입니다. 댓글이 본 것이 이런 ‘부분’입니다." : (b - a <= 9 ? "짧은 구간은 해마다의 오르내림에 크게 흔들립니다." : "")));
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
      options: ["기온이 내려간 구간이 있으니 온난화는 거짓이다", "해마다 오르내림은 있지만, 50년 동안 10년에 약 0.3 °C씩 오르는 경향이 뚜렷하다", "해마다 기온이 똑같이 조금씩 올랐다", "자료가 들쭉날쭉하니 아무 결론도 낼 수 없다"],
      answer: 1,
      why: ["짧은 구간의 하강은 해마다의 자연스러운 오르내림입니다. 전체 경향과 다릅니다.", "긴 기간의 추세선은 해마다의 오르내림을 넘어선 경향을 보여 줍니다. 기후는 이렇게 판단합니다.", "추웠던 해도 더웠던 해도 있습니다. ‘경향’이 오른 것입니다.", "들쭉날쭉한 자료도 충분히 길면 경향을 읽을 수 있습니다."],
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
    function bar3(x, top, w, B, c) {
      var dx = 12, dy = -8;
      ctx.fillStyle = shade(c, .62); ctx.beginPath(); ctx.moveTo(x + w, top); ctx.lineTo(x + w + dx, top + dy); ctx.lineTo(x + w + dx, B + dy); ctx.lineTo(x + w, B); ctx.closePath(); ctx.fill();
      ctx.fillStyle = tintC(c, 1.25); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + dx, top + dy); ctx.lineTo(x + w + dx, top + dy); ctx.lineTo(x + w, top); ctx.closePath(); ctx.fill();
      var bg = ctx.createLinearGradient(x, 0, x + w, 0); bg.addColorStop(0, tintC(c, 1.08)); bg.addColorStop(1, shade(c, .85));
      ctx.fillStyle = bg; ctx.fillRect(x, top, w, B - top);
    }
    function scol(t) { var d = Math.max(-1, Math.min(1, (t - MEAN) / 0.9)); return d < 0 ? [Math.round(255 + d * 200), Math.round(255 + d * 130), 255] : [255, Math.round(255 - d * 190), Math.round(255 - d * 210)]; }
    var COLDI = 0, HOTI = 0; TMP.forEach(function (t, i) { if (t < TMP[COLDI]) COLDI = i; if (t > TMP[HOTI]) HOTI = i; });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 600, RX = LW + 10, px = RX + 18, xr = W - 18, f = fit(0, 49), hl;
      K.studio(ctx, 0, 0, LW, H);
      if (rep === "str") {
        var x0 = 50, x1 = 540, y0 = 140, y1 = 262, bw = (x1 - x0) / 50, dx = 34, dy = -26;
        floorShadow(ctx, (x0 + x1) / 2 + 24, y1 + 8, 300, 20, .3);
        TMP.forEach(function (t, i) {
          var c = scol(t), xa = x0 + i * bw;
          ctx.fillStyle = "rgb(" + c.map(function (q) { return Math.min(255, Math.round(q * 1.04 + 10)); }).join(",") + ")";
          ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xa + bw + .6, y0); ctx.lineTo(xa + bw + .6 + dx, y0 + dy); ctx.lineTo(xa + dx, y0 + dy); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgb(" + c.join(",") + ")"; ctx.fillRect(xa, y0, bw + .6, y1 - y0);
        });
        var cl = scol(TMP[49]); ctx.fillStyle = "rgb(" + cl.map(function (q) { return Math.round(q * .7); }).join(",") + ")";
        ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1 + dx, y0 + dy); ctx.lineTo(x1 + dx, y1 + dy); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill();
        var sh = ctx.createLinearGradient(0, y0, 0, y1); sh.addColorStop(0, "rgba(255,255,255,.14)"); sh.addColorStop(1, "rgba(0,0,20,.16)"); ctx.fillStyle = sh; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.strokeStyle = "rgba(20,40,90,.35)"; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        [1974, 1984, 1994, 2004, 2014, 2023].forEach(function (yy) { K.t(ctx, String(yy), x0 + (yy - Y0 + 0.5) * bw, y1 + 18, { s: 10.5, a: "center", c: LT.mute, w: "700" }); });
        K.t(ctx, "파랑 = 50년 평균보다 추운 해 · 빨강 = 더운 해", x0, y1 + 44, { s: 11.5, w: "700", c: LT.mute });
        hl = ["점점 빨개진다", "숫자 없이 색만으로 흐름을 전한다"];
      } else {
        var g = K.chart(ctx, { x: 6, y: 88, w: LW - 12, h: H - 94, pl: 48, pt: 8, pb: 30, pr: 16, x0: 0, x1: rep === "pts" ? 50 : 5, y0: 11.5, y1: 14.5, xt: 5, yt: 6, light: true, xf: function () { return ""; }, yf: function (q) { return q + "°"; } });
        if (rep === "pts") {
          var X = function (i) { return g.X(i + 0.5); };
          K.plot(ctx, { X: X, Y: g.Y }, [[0, f.c], [49, f.m * 49 + f.c]], LT.red, { w: 3, light: true });
          TMP.forEach(function (t, i) { ctx.fillStyle = LT.ink; ctx.beginPath(); ctx.arc(X(i), g.Y(t), 3.2, 0, 6.2832); ctx.fill(); });
          [1974, 1984, 1994, 2004, 2014, 2023].forEach(function (yy) { K.t(ctx, String(yy), X(yy - Y0), g.B + 16, { s: 10.5, a: "center", c: LT.mute, w: "700" }); });
          hl = ["추세 +" + (f.m * 10).toFixed(2) + " °C / 10년", "해마다의 오르내림과 전체 경향을 함께"];
        } else {
          var names = ["1974~83", "1984~93", "1994~2003", "2004~13", "2014~23"];
          DEC.forEach(function (m, d) {
            var cx = g.X(d + 0.5), bw2 = (g.R - g.L) / 5 * 0.5, top = g.Y(m);
            bar3(cx - bw2 / 2, top, bw2, g.B, d < 2 ? LT.orange : LT.red);
            K.t(ctx, m.toFixed(2) + "°C", cx + 6, top - 14, { s: 12, w: "900", a: "center", c: LT.ink });
            K.t(ctx, names[d], cx, g.B + 16, { s: 10.5, a: "center", c: LT.mute, w: "700" });
          });
          K.t(ctx, "※ 세로축은 11.5 °C에서 시작", g.L + 8, g.T + 16, { s: 10.5, w: "700", c: LT.orange });
          hl = ["+" + (DEC[4] - DEC[0]).toFixed(2) + " °C", "1974~83년 → 2014~23년 10년 평균"];
        }
      }
      K.bigText(ctx, hl[0], 18, 44, 25, "#ffffff");
      K.bigText(ctx, hl[1], 18, 74, 15, "#ffd35a");
      /* 오른쪽 카드 */
      var INFO = {
        pts: ["점과 추세선", LT.red, [["점", "해마다 하나씩 50개"], ["추세선", "+" + (f.m * 10).toFixed(2) + " °C/10년"]], "분석용 · 오르내림과 경향을 함께"],
        dec: ["10년 평균 막대", LT.orange, [["1974~83년", DEC[0].toFixed(2) + " °C"], ["2014~23년", DEC[4].toFixed(2) + " °C"]], "시대별 차이를 숫자로 비교"],
        str: ["기후 줄무늬", LT.violet, [["가장 추운 해", (Y0 + COLDI) + "년"], ["가장 더운 해", (Y0 + HOTI) + "년"]], "포스터용 · 한눈에 흐름 전하기"]
      }[rep];
      K.card(ctx, RX, 0, W - RX, H, "이 그림이 잘 보여 주는 것");
      cardHead(ctx, INFO[0], px, 62, INFO[1]);
      K.row(ctx, INFO[2][0][0], INFO[2][0][1], px, xr, 98);
      K.row(ctx, INFO[2][1][0], INFO[2][1][1], px, xr, 126);
      K.tip(ctx, INFO[3], px - 4, 142, xr - px + 8, true);
      K.t(ctx, "그려 본 방법 " + got.seen.length + " / 3", px, 214, { s: 12, w: "800", c: LT.mute });
      K.bar(ctx, px, 224, xr - px, got.seen.length / 3, got.seen.length >= 3 ? LT.green : LT.yellow);
      var cxp = px, NMS = { pts: "점·추세선", dec: "10년 막대", str: "줄무늬" };
      ["pts", "dec", "str"].forEach(function (k) { var on = got.seen.indexOf(k) >= 0, bb = K.pill(ctx, (on ? "✔ " : "") + NMS[k], cxp, 272, { s: 12, c: on ? "#0f766e" : LT.dim, bg: on ? "#e7f7f0" : "#eef1f5" }); cxp = bb.x + bb.w + 6; });
      K.t(ctx, "같은 50년 자료 · 예시 값", px, 322, { s: 11, c: LT.mute });
    }
    var MSG = {
      pts: "<b>연도별 점과 추세선</b> — 해마다의 오르내림과 전체 경향을 함께 볼 수 있습니다. 과학자들이 분석할 때 주로 씁니다.",
      dec: "<b>10년 평균 막대</b> — 해마다의 들쭉날쭉함을 평균으로 눌러, 시대별 차이를 숫자로 비교하기 좋습니다.",
      str: "<b>기후 줄무늬</b> — 숫자 없이 색만으로 ‘점점 빨개진다’는 흐름을 한눈에 전합니다. 포스터나 캠페인에 쓰기 좋습니다."
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
      q: "10년 평균 막대에서 1974~83년과 2014~23년의 평균 기온 차이는 대략 얼마일까요?",
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
    mount: "wk3", unitLabel: "[과학탐구실험1 Ⅱ-2] 이야기 ③ 추운 겨울의 반론",
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
    var LW = 560, XC = { garlic: "#efe3a0", cypress: "#d9a85b", tea: "#7fb24a", control: "#dfe9f3" };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var z = zone(plant, conc, hrs), cx = 262, cy = 196, rx = 168, ry = 86, fz = (z / 2) / 45, i, box = [0, LW];
      K.studio(ctx, 0, 0, LW, H, { x: cx + 10, y: cy + 46, rx: 250, ry: 46 });
      /* 유리 접시 바닥 */
      ctx.fillStyle = "rgba(190,210,235,.5)"; ctx.beginPath(); ctx.ellipse(cx, cy + 16, rx + 8, ry + 5, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(80,110,150,.55)"; ctx.lineWidth = 1.4; ctx.stroke();
      /* 배지(두께와 윗면) */
      ctx.fillStyle = "#c19b52"; ctx.beginPath(); ctx.ellipse(cx, cy + 7, rx, ry, 0, 0, 6.2832); ctx.fill();
      var ag = ctx.createRadialGradient(cx - 50, cy - 30, 10, cx, cy, rx); ag.addColorStop(0, "#f8ebbd"); ag.addColorStop(1, "#dcbf78");
      ctx.fillStyle = ag; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.fill();
      /* 세균 잔디 (억제대 안에는 자라지 못한다) */
      var dens = Math.min(1, hrs / 24);
      if (dens > 0) {
        ctx.fillStyle = "rgba(255,250,232," + (0.35 * dens).toFixed(3) + ")"; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.ellipse(cx, cy, fz * rx, fz * ry, 0, 0, 6.2832); ctx.fill("evenodd");
        for (i = 0; i < Math.round(1100 * dens); i++) {
          var an = hash(i) * 6.2832, rr = Math.sqrt(hash(i + 500)) * 0.97; if (rr <= fz) continue;
          var x = cx + Math.cos(an) * rr * rx, y = cy + Math.sin(an) * rr * ry;
          ctx.fillStyle = "rgba(120,92,40,.35)"; ctx.fillRect(x + .5, y + .6, 1.6, 1.2); ctx.fillStyle = "rgba(255,252,236,.95)"; ctx.fillRect(x, y, 1.6, 1.3);
        }
      }
      if (z > 6.05) { ctx.save(); ctx.strokeStyle = LT.blue; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.ellipse(cx, cy, fz * rx, fz * ry, 0, 0, 6.2832); ctx.stroke(); ctx.restore(); }
      /* 종이 디스크(6 mm) */
      var ddx = 3 / 45 * rx, ddy = 3 / 45 * ry;
      ctx.fillStyle = "#aab2c0"; ctx.beginPath(); ctx.ellipse(cx, cy + 2, ddx, ddy, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = plant === "control" ? "#ffffff" : tintC(XC[plant], 1.06); ctx.beginPath(); ctx.ellipse(cx, cy, ddx, ddy, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "rgba(60,70,90,.5)"; ctx.lineWidth = 1; ctx.stroke();
      /* 유리 테두리 */
      ctx.strokeStyle = "rgba(80,110,150,.75)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - 3, rx + 8, ry + 5, 0, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(cx, cy - 3, rx + 5, ry + 3, 0, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
      /* 자(mm): 접시 지름 90 mm */
      var ry0 = cy + ry + 28, mm = rx / 45;
      ctx.fillStyle = "#f6ecca"; ctx.strokeStyle = "rgba(120,100,50,.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.rect(cx - rx, ry0, 2 * rx, 18); ctx.fill(); ctx.stroke();
      for (i = 0; i <= 90; i += 5) { var tx = cx - rx + i * mm; ctx.strokeStyle = "rgba(60,50,30,.7)"; ctx.beginPath(); ctx.moveTo(tx, ry0); ctx.lineTo(tx, ry0 + (i % 10 ? 4 : 7)); ctx.stroke(); if (i % 30 === 0) K.t(ctx, String(i), tx + (i === 90 ? -2 : 2), ry0 + 16, { s: 9, w: "700", a: i === 90 ? "right" : "left", c: "#5c4a20" }); }
      if (z > 6.05) {
        [-1, 1].forEach(function (sg) { var tx = cx + sg * fz * rx; ctx.fillStyle = LT.blue; ctx.beginPath(); ctx.moveTo(tx, ry0 - 1); ctx.lineTo(tx - 5, ry0 - 9); ctx.lineTo(tx + 5, ry0 - 9); ctx.closePath(); ctx.fill(); });
        K.line(ctx, { x: cx - fz * rx, y: ry0 - 5 }, { x: cx + fz * rx, y: ry0 - 5 }, LT.blue, 1.5);
      }
      /* 추출물 병 */
      glassCyl(ctx, 486, 290, 22, 66, 38, plant === "control" ? "#d8e6f2" : XC[plant]);
      ctx.fillStyle = "#c2453e"; ctx.beginPath(); ctx.roundRect(476, 208, 20, 18, 7); ctx.fill();
      ctx.fillStyle = "#e7e9ee"; ctx.fillRect(480, 222, 12, 8);
      tag(ctx, cx + Math.max(fz, .07) * rx * .7, cy - Math.max(fz, .07) * ry * .7, z > 6.05 ? "억제대 — 세균이 못 자람" : "억제대 없음", 70, -62, "#bfe6ff", box);
      tag(ctx, cx - rx * .6, cy + ry * .35, hrs >= 12 ? "세균이 자란 배지" : "세균이 아직 덜 자람", -30, 54, "#f4e6c4", box);
      K.bigText(ctx, z > 6.05 ? "억제대 " + z.toFixed(1) + " mm" : "억제대 없음", 18, 44, 25, z > 6.05 ? "#8fd3ff" : "#ffffff");
      K.bigText(ctx, NM[plant] + (plant === "control" ? " · 에탄올만" : " · " + conc + "%") + " · " + hrs + "시간 배양", 18, 72, 15, "#ffd35a");
      K.warn(ctx, LW - 14, 30, "⚠ 억제대 크기는 원리를 보이는 모형 값", "right");
      /* 오른쪽 기록 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18, key = conc + "|" + hrs, rec = got.sets[key] || {};
      K.card(ctx, RX, 0, W - RX, H, "같은 조건(" + conc + "% · " + hrs + "시간)의 기록");
      var CC = { garlic: LT.green, cypress: LT.blue, tea: LT.violet, control: LT.dim };
      ["garlic", "cypress", "tea", "control"].forEach(function (p, k) {
        var y = 64 + k * 48, val = rec[p];
        K.row(ctx, (p === plant ? "▶ " : "") + NM[p], val != null ? val.toFixed(1) + " mm" : "—", px, xr, y, val != null ? LT.ink : LT.dim);
        K.bar(ctx, px, y + 10, xr - px, val != null ? (val - 6 + .4) / 20 : 0, CC[p]);
      });
      var good = got.ctrl && got.b;
      K.tip(ctx, good ? "마늘 > 편백 > 녹차 · 대조군은 없음" : (plant === "control" ? (hrs >= 24 ? "대조군에 억제대 없음 ✔" : "24시간 이상 배양해 확인") : (hrs < 24 ? "배양 시간이 아직 짧다" : (conc < 50 ? "농도를 50% 이상으로" : "다른 추출물도 같은 조건에서"))), px - 4, 258, xr - px + 8, good ? true : null);
      K.t(ctx, "막대 = 디스크(6 mm) 밖으로 넓어진 폭", px, 316, { s: 10.5, c: LT.mute });
      readout(z);
    }
    function readout(z) {
      var done2 = got.ctrl && got.b;
      put("d-disk-read",
        "<span class='k'>억제대 지름</span><span class='v " + (z > 6.05 ? "b" : "r") + "'>" + z.toFixed(1) + " mm</span>" +
        "<span class='sub'>" + NM[plant] + (plant === "control" ? " (에탄올만)" : " " + conc + "%") + " · " + hrs + "시간 · 디스크 6 mm 포함</span>" +
        "<span class='ok " + (done2 ? "g" : "r") + "'>" + (got.ctrl ? "✔ 대조군 확인" : "○ 대조군 24시간") + " · " + (got.b ? "✔ 세 추출물 비교" : "○ 50% 이상·24시간 이상에서 세 추출물") + "</span>");
    }
    function update() {
      var z = zone(plant, conc, hrs), key = conc + "|" + hrs;
      if (hrs >= 12) { got.sets[key] = got.sets[key] || {}; got.sets[key][plant] = z; }
      if (plant === "control" && hrs >= 24) got.ctrl = true;
      if (!got.b) for (var k in got.sets) { var p = k.split("|"), r = got.sets[k]; if (+p[0] >= 50 && +p[1] >= 24 && r.garlic != null && r.cypress != null && r.tea != null) got.b = true; }
      window.sthState("diskGot", got);
      draw();
      put("d-disk-info", NM[plant] + (plant === "control" ? "(에탄올만 적신 디스크)" : " 추출물 " + conc + "%") + ", " + hrs + "시간 배양: 억제대 지름 " + z.toFixed(1) + " mm. "
        + (plant === "control" ? (hrs >= 24 ? "✅ 대조군에는 억제대가 없습니다. 억제대는 에탄올이 아니라 추출물 때문입니다." : "세균이 충분히 자라도록 24시간 이상 배양해 확인하세요.") : (hrs < 24 ? "배양 시간이 짧아 세균이 아직 덜 자랐습니다." : (conc < 50 ? "농도를 50% 이상으로 해 비교해 보세요." : "같은 조건에서 다른 추출물도 재어 보세요.")))
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
    var fizz = 0, fizzKind = "";
    var TC = { y: "#a17d00", g: "#2b8a3e", b: "#1c64c4" };
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 560, cx = 200, by = 288, cc = CC[colr()], i, lh = 118, box = [0, LW];
      K.studio(ctx, 0, 0, LW, H, { x: cx + 120, y: by + 8, rx: 270, ry: 34 });
      glassCyl(ctx, cx, by, 74, 176, lh, cc, { ticks: 3, inside: function (ly, ry) {
        /* 빨대 */
        ctx.save(); ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(80,110,150,.6)"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(cx + 22, by - 26); ctx.lineTo(cx + 70, by - 230); ctx.stroke();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 7; ctx.stroke();
        ctx.strokeStyle = "#e8505b"; ctx.setLineDash([7, 7]); ctx.stroke(); ctx.restore();
        if (fizz > 0) {
          var Rb = K.rng(fizzKind === "b" ? 3 : 7);
          for (var j = 0; j < 26; j++) {
            var u = ((1 - fizz) * 1.6 + Rb()) % 1, rr = 1.5 + Rb() * 2.5;
            if (fizzKind === "a") { var bx = cx + 22 + (Rb() - .5) * 26, byy = by - 30 - u * (lh - 30); ctx.strokeStyle = "rgba(255,255,255," + (.9 * fizz).toFixed(3) + ")"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(bx, byy, rr, 0, 6.2832); ctx.stroke(); }
            else { var sx = cx - 40 + Rb() * 80; ctx.fillStyle = "rgba(255,255,255," + (.9 * fizz).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(sx, ly + 4 + u * (lh - 14), rr * .6, 0, 6.2832); ctx.fill(); }
          }
        }
      } });
      if (fizz > 0 && fizzKind === "b") {   /* 베이킹소다 숟가락 */
        ctx.fillStyle = "#b9c0cc"; ctx.beginPath(); ctx.ellipse(cx - 30, 96, 18, 8, -.3, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.ellipse(cx - 30, 94, 13, 5, -.3, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#9aa3b0"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - 14, 90); ctx.lineTo(cx + 40, 70); ctx.stroke(); ctx.lineCap = "butt";
        for (i = 0; i < 10; i++) { ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(cx - 34 + (i * 7) % 16, 106 + ((i * 13 + (1 - fizz) * 60) % 60), 1.6, 0, 6.2832); ctx.fill(); }
      }
      /* 비교용 표준 색 시험관과 꽂이 */
      var RXs = [404, 456, 508], keys = ["y", "g", "b"];
      ctx.fillStyle = "#b98a55"; ctx.fillRect(378, 196, 156, 10);
      RXs.forEach(function (x, k) { glassCyl(ctx, x, 282, 13, 96, 62, CC[keys[k]], { e: .35, noShadow: true }); });
      ctx.fillStyle = "#a87a48"; ctx.beginPath(); ctx.roundRect(372, 250, 168, 34, 5); ctx.fill();
      ctx.fillStyle = "#c99b66"; ctx.beginPath(); ctx.moveTo(372, 250); ctx.lineTo(382, 242); ctx.lineTo(550, 242); ctx.lineTo(540, 250); ctx.closePath(); ctx.fill();
      floorShadow(ctx, 460, 288, 110, 10, .22);
      RXs.forEach(function (x, k) {
        K.t(ctx, ["산성", "중성", "염기성"][k], x, 272, { s: 11, w: "900", a: "center", c: "#ffffff" });
        if (keys[k] === colr()) { ctx.strokeStyle = LT.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x - 20, 178, 40, 112, 10); ctx.stroke(); }
      });
      K.t(ctx, "비교용 표준 색", 456, 166, { s: 11.5, w: "800", a: "center", c: LT.mute });
      K.bigText(ctx, "pH " + ph.toFixed(1) + " · " + CN[colr()].split(" ")[0], 18, 44, 25, { y: "#ffe066", g: "#7ff0a0", b: "#8fc3ff" }[colr()]);
      K.bigText(ctx, got.seen.length >= 3 ? "세 가지 색을 모두 보여 주었다" : "노랑 · 초록 · 파랑 모두 보여 주기 (" + got.seen.length + "/3)", 18, 72, 15, "#ffd35a");
      /* 오른쪽 카드 */
      var RX = LW + 10, px = RX + 18, xr = W - 18, x0 = px, x1 = xr, y = 92;
      K.card(ctx, RX, 0, W - RX, H, "BTB의 색과 pH");
      cardHead(ctx, "지금 " + CN[colr()], px, 62, TC[colr()], 18);
      for (var p = 4; p <= 10; p += 0.1) { ctx.fillStyle = p < 6 ? CC.y : (p <= 7.6 ? CC.g : CC.b); ctx.fillRect(x0 + (p - 4) / 6 * (x1 - x0), y, (x1 - x0) / 60 + 1, 18); }
      [4, 6, 7, 8, 10].forEach(function (q) { K.t(ctx, String(q), x0 + (q - 4) / 6 * (x1 - x0), y + 34, { s: 10.5, a: "center", c: LT.mute, w: "700" }); });
      var mx = x0 + (ph - 4) / 6 * (x1 - x0);
      ctx.fillStyle = LT.ink; ctx.beginPath(); ctx.moveTo(mx, y - 1); ctx.lineTo(mx - 7, y - 12); ctx.lineTo(mx + 7, y - 12); ctx.closePath(); ctx.fill(); ctx.fillRect(mx - 1.2, y - 1, 2.4, 20);
      K.t(ctx, "산성", x0, y + 54, { s: 11, c: TC.y, w: "800" }); K.t(ctx, "중성", x0 + (6.8 - 4) / 6 * (x1 - x0), y + 54, { s: 11, a: "center", c: TC.g, w: "800" }); K.t(ctx, "염기성", x1, y + 54, { s: 11, a: "right", c: TC.b, w: "800" });
      K.t(ctx, "보여 준 색", px, 180, { s: 11.5, w: "700", c: LT.mute });
      var cx2 = px;
      if (!got.seen.length) K.pill(ctx, "아직 없음", cx2, 208, { s: 12, c: LT.dim, bg: "#eef1f5" });
      got.seen.forEach(function (k, j) {
        var bb = K.pill(ctx, CN[k].split(" ")[0], cx2, 208, { s: 12.5, c: k === "y" ? "#3a2a00" : "#ffffff", bg: CC[k] });
        cx2 = bb.x + bb.w + 6;
        if (j < got.seen.length - 1) { K.t(ctx, "→", cx2 + 2, 208, { s: 12, c: LT.dim }); cx2 += 22; }
      });
      K.tip(ctx, got.seen.length >= 3 ? "관객이 박수를 칩니다!" : "숨(CO₂) → 산성 · 소다 → 염기성", px - 4, 228, xr - px + 8, got.seen.length >= 3 ? true : null);
      K.t(ctx, "이산화 탄소가 물에 녹으면 산성", px, 290, { s: 11, c: LT.mute });
      K.t(ctx, "베이킹소다 물은 약한 염기성", px, 308, { s: 11, c: LT.mute });
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
    K.animate(canvas, function (dt) { if (fizz > 0) { fizz = Math.max(0, fizz - dt / 1600); draw(); } });
    $("d-breath").addEventListener("click", function () { ph = Math.max(4.0, +(ph - 1.5).toFixed(1)); if (!REDUCE) { fizz = 1; fizzKind = "a"; } update(); });
    $("d-soda").addEventListener("click", function () { ph = Math.min(10.0, +(ph + 2.0).toFixed(1)); if (!REDUCE) { fizz = 1; fizzKind = "b"; } update(); });
    $("d-reset").addEventListener("click", function () { ph = 7.0; update(); });
    window.sthPick({
      mount: "d-btb-pick",
      q: "숨을 불어넣으면 초록 BTB 용액이 노랗게 변하는 까닭은?",
      options: ["숨이 따뜻해서 용액이 데워지기 때문에", "날숨의 이산화 탄소가 물에 녹아 탄산이 되어 용액이 산성으로 바뀌기 때문에", "숨 속의 산소가 BTB를 태우기 때문에"],
      answer: 1,
      why: ["온도 때문이 아닙니다. 식은 날숨을 넣어도 같습니다.", "BTB는 용액의 산성·염기성(pH)에 따라 색이 바뀌는 지시약입니다. 이산화 탄소 → 탄산 → 산성 → 노랑.", "산소는 BTB의 색을 바꾸지 않습니다."],
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
    mount: "wk4", unitLabel: "[과학탐구실험1 Ⅱ-2] 이야기 ④ 마늘 대 세균",
    items: [
      { id: "e4a", label: "대조군이 필요한 까닭", hint: "에탄올만 적신 디스크를 함께 두지 않았다면 어떤 문제가 생겼을지 한두 문장으로 쓰세요." },
      { id: "e4b", label: "우리 반 협력 탐구 계획", hint: "다른 분야의 친구와 함께 해 보고 싶은 탐구 주제를 하나 정하고, 누가 무엇을 맡을지 적어 보세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[과학탐구실험1 Ⅱ-2] 과학 탐구의 과정과 절차 — 정리",
  recap: [
    { key: "r1", label: "① 목이 휜 플라스크" },
    { key: "r2", label: "② 두 번째 프리즘" },
    { key: "r3", label: "③ 추운 겨울의 반론" },
    { key: "r4", label: "④ 마늘 대 세균" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
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
  mount: "share", unit: "gt1-1-4", unitLabel: "[과학탐구실험1 Ⅱ-2] 과학 탐구의 과정과 절차",
  rows: [
    { key: "r1", label: "① 목이 휜 플라스크" },
    { key: "r2", label: "② 두 번째 프리즘" },
    { key: "r3", label: "③ 추운 겨울의 반론" },
    { key: "r4", label: "④ 마늘 대 세균" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rInq", label: "교과서 실험" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 보고서를 꿰는 한 문장" }
});

})();
