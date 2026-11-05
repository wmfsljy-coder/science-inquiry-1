/* 과학탐구실험1 Ⅰ-3 역사 속의 과학 탐구 — 응용 실험실
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

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 진자시계 */
  {
    id: "c1", about: "01", tag: "갈릴레이의 또 다른 발견 · 변인을 하나씩", title: "성당의 샹들리에와 진자시계", short: "진자시계",
    who: "🕰️", name: "시계 장인",
    say: "“갈릴레이는 성당에서 흔들리는 샹들리에를 맥박으로 재어 보고 진자의 성질을 알아냈다고 전해져요(제자 비비아니의 기록). 흔드는 폭이 작으면 한 번 왕복하는 시간이 거의 같다는 성질로 진자시계를 만들려고 합니다. 한 번 왕복에 <b>정확히 2초</b>(± 0.02초)가 걸리는 진자를 만들어 주세요. 추의 무게, 흔드는 폭, 실의 길이 가운데 무엇이 시간을 정하는지부터 알아내야겠지요.”",
    predict: {
      q: "추를 두 배 무거운 것으로 바꾸면 진자가 한 번 왕복하는 시간은?",
      options: ["㉠ 길어진다", "㉡ 짧아진다", "㉢ 변하지 않는다"],
      answer: 2
    },
    task: "추·흔드는 폭·실의 길이를 정해 <b>왕복 시간 2.00 ± 0.02 초</b>인 진자를 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var L = 0.5, mass = "light", amp = 10;
      function T() { var th = amp * Math.PI / 180; return 2 * Math.PI * Math.sqrt(L / 9.8) * (1 + th * th / 16); }
      /* 나무 받침 블록 위 진자 틀(기둥 둘 + 가로대) 미니어처. 진자는 앞에서 본 모습 */
      var I = K.iso({ ox: 300, oy: 150, s: 0.7, L: 260, D: 70 });
      function draw() {
        H.paper(ctx, W, cv.H);
        I.box(ctx, 0, 0, 0, I.L, I.D, 14, "#d9b47c", "#a8834f", "#8a6a3c");
        I.box(ctx, 20, 28, 14, 30, 38, 200, "#9a6a3c", "#8a5a30", "#6a4426");
        I.box(ctx, 230, 28, 14, 240, 38, 200, "#9a6a3c", "#8a5a30", "#6a4426");
        I.box(ctx, 14, 26, 200, 246, 40, 210, "#b07a45", "#8a5a30", "#6a4426");
        var pv = I.P(130, 33, 200), px = pv.x, py = pv.y + 4, len = 30 + L * 55, th = amp * Math.PI / 180, r = mass === "heavy" ? 14 : 9;
        ctx.save(); ctx.strokeStyle = "rgba(20,40,90,.35)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + len + 10); ctx.stroke(); ctx.restore();
        ctx.fillStyle = "rgba(255,211,107,.28)"; ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, len, Math.PI / 2 - th, Math.PI / 2 + th); ctx.closePath(); ctx.fill();
        [-1, 1].forEach(function (sg) {
          var bx = px + Math.sin(sg * th) * len, by = py + Math.cos(th) * len;
          ctx.globalAlpha = sg > 0 ? 1 : 0.35;
          ctx.strokeStyle = "#495057"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
          K.planet(ctx, bx, by, r, mass === "heavy" ? "#adb5bd" : "#f0c060", mass === "heavy" ? "#343a40" : "#8a5a10");
          ctx.globalAlpha = 1;
        });
        K.planet(ctx, px, py, 3.5, "#e9ecef", "#495057");
        var t = T(), ok = Math.abs(t - 2) <= 0.02;
        K.bigText(ctx, "왕복 " + t.toFixed(3) + " 초", 18, 38, 24, ok ? "#7cf0b5" : "#ffffff");
        H.text(ctx, "실 " + L.toFixed(2) + " m · 폭 " + amp + "°", 18, 64, { s: 13, w: "900", c: H.v("--mist") });
        K.warn(ctx, 16, cv.H - 12, "⚠ 실의 길이는 그림에서 줄여 그림");
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [
          ["한 번 왕복하는 시간", t.toFixed(3) + " 초", ok ? "--green-700" : "--rose-700", true],
          ["추", mass === "heavy" ? "무거운 추 (200 g)" : "가벼운 추 (50 g)"],
          ["목표", "2.00 ± 0.02 초"]
        ], 66);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "추", value: "light", options: [{ v: "light", t: "가벼운 추 (50 g)" }, { v: "heavy", t: "무거운 추 (200 g)" }], onPick: function (x) { mass = x; draw(); } });
      api.slider({ label: "흔드는 폭", min: 5, max: 30, step: 5, value: 10, fmt: function (x) { return x + "°"; }, onInput: function (x) { amp = x; draw(); } });
      api.slider({ label: "실의 길이", min: 0.2, max: 2, step: 0.05, value: 0.5, fmt: function (x) { return x.toFixed(2) + " m"; }, onInput: function (x) { L = x; draw(); } });
      api.info("한 번에 하나씩만 바꿔 보세요. 무엇을 바꿀 때 시간이 달라지나요? (흔드는 폭이 아주 크면 시간이 아주 조금 길어집니다.)");
      draw();
      return {
        judge: function () {
          var t = T();
          if (Math.abs(t - 2) <= 0.02) return { ok: true, msg: "실 " + L.toFixed(2) + " m → 왕복 " + t.toFixed(3) + " 초. 시간을 정하는 것은 추의 무게가 아니라 실의 길이였습니다." };
          return { ok: false, msg: "왕복 " + t.toFixed(3) + " 초 — " + (t > 2 ? "너무 깁니다." : "너무 짧습니다.") + " 추나 폭을 바꿔 보았나요? 시간을 크게 바꾸는 변인은 하나뿐이에요." };
        }
      };
    },
    hints: [
      "추를 바꿔도, 폭을 조금 바꿔도 시간은 거의 그대로입니다. 실의 길이를 바꿔 보세요.",
      "왕복 시간은 실 길이의 제곱근에 비례합니다. 약 1 m 근처를 찾아보세요."
    ],
    solution: "실의 길이 <b>약 1 m</b> (1.00 m에서 흔드는 폭 5~15°, 추는 아무것이나). 0.95 m·30°처럼 큰 폭으로 맞추는 것도 되지만 정석은 아닙니다.",
    why: "진자의 왕복 시간은 추의 무게와 상관없고, 폭이 작을 때는 폭과도 거의 상관없이 <b>실의 길이</b>로 정해집니다(T = 2π√(L/g)). 갈릴레이가 1580년대에 발견했다고 전해지는(1602년 편지에 기록)이 ‘진자의 등시성’으로 1656년 하위헌스가 진자시계를 만들어, 하루 오차가 15분에서 15초로 줄었습니다.<br>" +
      "한 번에 한 변인만 바꾸며 시간을 재야 무엇이 원인인지 가릴 수 있습니다. 빗면 실험과 같은 방법입니다. 정확한 시계는 다시 더 정밀한 실험을 가능하게 했습니다. ※ 폭에 따른 보정은 근삿값입니다."
  },

  /* ------------------------------------------------------------------ 2. 에라토스테네스 */
  {
    id: "c2", about: "02", tag: "역사 속 측정 · 그림자로 지구를 재다", title: "막대기 하나로 잰 지구 둘레", short: "지구 둘레",
    who: "📐", name: "알렉산드리아 도서관장 에라토스테네스",
    say: "“하짓날 정오, 남쪽 도시 시에네에서는 깊은 우물 바닥까지 햇빛이 비쳐 막대의 그림자가 없어요. 같은 날 알렉산드리아에서는 막대의 그림자가 7.2° 기울어집니다. 두 도시 사이는 낙타 대상으로 <b>50일</b>, 하루에 <b>16 km</b> 쯤 갑니다. 재는 때와 거리를 정해 지구 둘레를 <b>40 000 km의 ± 5%</b> 안으로 구해 주세요.”",
    predict: {
      q: "만약 지구가 평평하고 태양이 아주 멀리 있다면, 같은 시각 두 도시의 막대 그림자는 어떨까요?",
      options: ["㉠ 두 도시에서 그림자 각도가 같다", "㉡ 북쪽 도시의 그림자가 더 기울어진다", "㉢ 남쪽 도시의 그림자가 더 기울어진다"],
      answer: 0
    },
    task: "재는 때와 두 도시 사이의 거리를 정해 <b>지구 둘레 38 000~42 000 km</b>를 구하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var when = "pm", dist = 600;
      function ang() { return when === "noon" ? 7.2 : 7.2 + 30; }   /* 오후 3시에 재면 태양이 기울어 각도가 달라진다 */
      function circ() { return dist * 360 / ang(); }
      /* 둥근 지구의 윗부분(입체 공) 위에 선 두 막대와 그림자 */
      function stick(a, cx, cy, R, label, shadowDeg) {
        var x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, ux = Math.cos(a), uy = Math.sin(a), h = 42;
        var tx = x + ux * h, ty = y + uy * h, nx = -uy, ny = ux;
        if (shadowDeg > 0) {                                 /* 그림자: 햇빛(아래로) 방향으로 막대 끝을 땅에 비춘 자리까지 */
          var sl = h * Math.tan(shadowDeg * Math.PI / 180);
          ctx.strokeStyle = "rgba(20,30,50,.55)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + nx * sl * (nx > 0 ? 1 : -1) * -1, y + ny * sl * (nx > 0 ? 1 : -1) * -1); ctx.stroke(); ctx.lineCap = "butt";
        }
        ctx.fillStyle = "#c9a46c"; ctx.beginPath(); ctx.moveTo(x + nx * 4, y + ny * 4); ctx.lineTo(tx + nx * 1.5, ty + ny * 1.5); ctx.lineTo(tx - nx * 1.5, ty - ny * 1.5); ctx.lineTo(x - nx * 4, y - ny * 4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#8a6a3c"; ctx.beginPath(); ctx.moveTo(x + nx * 4, y + ny * 4); ctx.lineTo(tx + nx * 1.5, ty + ny * 1.5); ctx.lineTo(tx, ty); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
        K.pill(ctx, label, tx, ty - 10, { s: 11.5, a: "center", c: "#ffffff", box: [0, 600] });
        return { x: x, y: y, tx: tx, ty: ty };
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 300, cy = 470, R = 330, aS = -Math.PI / 2, aA = -Math.PI / 2 - 0.35;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 606, cv.H); ctx.clip();
        var eg = ctx.createRadialGradient(cx - 110, cy - 300, 20, cx, cy, R); eg.addColorStop(0, "#d6ecff"); eg.addColorStop(.35, "#7fb6e8"); eg.addColorStop(.75, "#2f6fb0"); eg.addColorStop(1, "#173d73");
        ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(214,180,120,.85)"; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.32, Math.PI * 1.58); ctx.arc(cx, cy, R - 26, Math.PI * 1.58, Math.PI * 1.32, true); ctx.closePath(); ctx.fill();   /* 이집트 땅 */
        ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        ctx.restore();
        for (var i = 0; i < 5; i++) { var rx = 60 + i * 120; H.arrow(ctx, rx, 6, rx, 66, "#f59f00", 2, 7); }
        K.sun(ctx, 560, 18, 7);
        H.text(ctx, "☀ 햇빛 (평행)", 434, 40, { s: 11.5, w: "800", c: H.v("--amber-700") });
        var s1 = stick(aS, cx, cy, R, "시에네", 0);
        var wl = { x: s1.x + 18, y: s1.y + 2 }; ctx.fillStyle = "#1b1f2a"; ctx.beginPath(); ctx.ellipse(wl.x, wl.y, 7, 3, 0, 0, 6.2832); ctx.fill(); K.glow(ctx, wl.x, wl.y, 1.5, "rgba(255,236,150,.95)", 2.5);
        var s2 = stick(aA, cx, cy, R, "알렉산드리아", 20);
        ctx.strokeStyle = "rgba(245,159,0,.85)"; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(s2.tx, s2.ty - 40); ctx.lineTo(s2.tx, s2.ty + 30); ctx.stroke(); ctx.setLineDash([]);
        K.wedge(ctx, s2.tx, s2.ty, Math.PI / 2, Math.PI / 2 - 0.35, 26, "rgba(245,159,0,.35)", "#f59f00");
        var c = circ(), ok = when === "noon" && c >= 38000 && c <= 42000;
        K.bigText(ctx, "둘레 " + Math.round(c).toLocaleString() + " km", 18, cv.H - 40, 24, ok ? "#7cf0b5" : "#ffffff");
        K.warn(ctx, 16, cv.H - 12, "⚠ 두 도시 사이 각도와 막대 길이는 크게 과장");
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [
          ["알렉산드리아 그림자 각도", ang().toFixed(1) + "°" + (when === "noon" ? "" : " (정오 아님)"), when === "noon" ? null : "--rose-700"],
          ["두 도시 사이 거리", dist + " km"],
          ["둘레 = 거리 × 360 ÷ 각도", Math.round(c).toLocaleString() + " km", ok ? "--green-700" : "--rose-700", true]
        ], 70);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "재는 때", value: "pm", options: [{ v: "pm", t: "알렉산드리아만 오후 3시에" }, { v: "noon", t: "두 도시 모두 하짓날 정오에" }], onPick: function (x) { when = x; draw(); } });
      api.slider({ label: "두 도시 사이 거리", min: 400, max: 1200, step: 50, value: 600, fmt: function (x) { return x + " km"; }, onInput: function (x) { dist = x; draw(); } });
      api.info("햇빛은 아주 멀리서 오므로 나란히 들어옵니다. 두 도시의 그림자 각도 차이가 곧 두 도시가 지구 중심에서 벌어진 각도입니다.");
      draw();
      return {
        judge: function () {
          if (when !== "noon") return { ok: false, msg: "재는 시각이 다르면 태양의 높이가 달라져, 각도 차이가 지구가 둥근 정도만 나타내지 않습니다. 같은 때 재야 합니다." };
          var c = circ();
          if (c < 38000 || c > 42000) return { ok: false, msg: "지구 둘레 " + Math.round(c).toLocaleString() + " km. 낙타 대상의 날수와 하루 거리로 두 도시 사이를 다시 계산해 보세요." };
          return { ok: true, msg: "거리 " + dist + " km × 360 ÷ 7.2 = " + Math.round(c).toLocaleString() + " km. 오늘날 값(약 40 000 km)과 거의 같습니다." };
        }
      };
    },
    hints: [
      "재는 시각은 두 도시가 같아야 합니다. 시에네의 그림자가 0 인 하짓날 정오가 기준입니다.",
      "거리 = 50일 × 16 km = 800 km. 각도 7.2°는 한 바퀴(360°)의 50분의 1입니다."
    ],
    solution: "<b>두 도시 모두 하짓날 정오</b>, 거리 <b>800 km</b> → 40 000 km.",
    why: "기원전 240년쯤 에라토스테네스는 ‘지구가 둥글고 햇빛은 나란하다’는 가정 아래, 두 도시의 그림자 각도 차이와 거리만으로 지구 둘레를 계산했습니다. 평평한 지구라면 두 도시의 그림자가 같아야 하니, 다른 그림자는 지구가 둥글다는 증거이기도 했습니다.<br>" +
      "정확한 결과를 얻으려면 같은 때에 같은 방법으로 재야 하고, 거리를 재는 단위(스타디아)도 정해져 있어야 했습니다. 그가 쓴 스타디아의 정확한 길이는 지금도 논란이 있어, 실제 오차가 얼마였는지는 분명하지 않습니다."
  },

  /* ------------------------------------------------------------------ 3. 화성 기후 궤도선 */
  {
    id: "c3", about: "02", tag: "표준 단위 · 단위가 섞이면", title: "화성 궤도선은 왜 사라졌을까", short: "단위 혼동",
    who: "🛰️", name: "우주 항법 팀",
    say: "“1999년 화성 기후 궤도선이 화성에 너무 가까이 들어가 사라졌어요. 조사해 보니 한 회사가 만든 추진 자료는 <b>파운드힘·초(lbf·s)</b>였는데, 항법 프로그램은 이 값을 <b>뉴턴·초(N·s)</b>로 알고 계산했습니다. 자료를 바르게 환산해, 궤도선이 계획대로 화성 위 <b>150 km 근처(145 km 이상)</b>를 지나게 해 주세요.”",
    predict: {
      q: "1 파운드힘(lbf)은 약 몇 뉴턴(N)일까요?",
      options: ["㉠ 약 0.45 N", "㉡ 약 4.45 N", "㉢ 약 9.8 N", "㉣ 정확히 1 N"],
      answer: 1
    },
    task: "추진 자료의 처리 방법과 환산 계수를 정해 <b>화성 위 145 km 이상</b>을 지나게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W;
      var mode = "raw", f = 1, KLB = 4.448;                      /* 1 lbf·s = 4.448 N·s */
      function used() { return mode === "raw" ? 1 : f; }
      function alt() { return 150 - 120 * Math.abs(KLB - used()) / KLB; }
      /* 궤도선 미니어처: 금빛 상자 몸체 + 태양 전지판 + 접시 안테나 */
      function orbiter(x, y, s) {
        ctx.fillStyle = "#1c3d7a"; ctx.fillRect(x - 30 * s, y - 5 * s, 18 * s, 10 * s);
        ctx.strokeStyle = "rgba(160,200,255,.7)"; ctx.lineWidth = 0.8; for (var k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x - 30 * s + k * 6 * s, y - 5 * s); ctx.lineTo(x - 30 * s + k * 6 * s, y + 5 * s); ctx.stroke(); }
        bar3(ctx, x - 10 * s, y - 8 * s, 16 * s, y + 8 * s, "#e0b04a", 5 * s, 4 * s);
        ctx.fillStyle = "#f1f3f5"; ctx.beginPath(); ctx.ellipse(x + 12 * s, y - 12 * s, 6 * s, 3 * s, -0.4, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#868e96"; ctx.stroke();
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 270, cy = 168, R = 82, a = alt(), ok = a >= 145;
        var hz = ctx.createRadialGradient(cx, cy, R, cx, cy, R + 34); hz.addColorStop(0, "rgba(255,160,110,.55)"); hz.addColorStop(1, "rgba(255,160,110,0)");
        ctx.fillStyle = hz; ctx.beginPath(); ctx.arc(cx, cy, R + 34, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(cx + 10, cy + R + 16, R, 10, 0, 0, 6.2832); ctx.fill();
        K.planet(ctx, cx, cy, R, "#e8743b", "#5a1e08");
        ctx.fillStyle = "rgba(90,30,10,.25)"; [[-20, -10, 18, 8], [24, 22, 22, 9], [-34, 34, 14, 6]].forEach(function (q) { ctx.beginPath(); ctx.ellipse(cx + q[0], cy + q[1], q[2], q[3], 0.3, 0, 6.2832); ctx.fill(); });
        ctx.save(); ctx.strokeStyle = "rgba(193,68,14,0.5)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, R + 80 * 0.35, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        H.text(ctx, "대기 (약 80 km)", cx + R + 34, cy + 4, { s: 11, w: "800", c: H.v("--mist") });
        var r2 = R + Math.max(4, a) * 0.35, ye = cy - r2 + 70;
        ctx.save(); ctx.strokeStyle = ok ? "#0f9f76" : (a < 80 ? "#e03131" : "#f08c00"); ctx.lineWidth = 3; ctx.setLineDash([8, 5]);
        ctx.beginPath(); ctx.moveTo(cx - 240, ye); ctx.quadraticCurveTo(cx, 2 * (cy - r2) - ye, cx + 240, ye); ctx.stroke(); ctx.restore();
        orbiter(cx, cy - r2, 1.1);
        K.bigText(ctx, "가장 낮은 높이 " + a.toFixed(0) + " km", 18, 38, 22, ok ? "#7cf0b5" : "#ff9aac");
        K.warn(ctx, 16, cv.H - 12, "⚠ 높이와 궤도선 크기는 보기 쉽게 과장");
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [
          ["항법이 쓴 값", mode === "raw" ? "lbf·s 숫자를 그대로 N·s로" : "lbf·s × " + f.toFixed(2)],
          ["화성 위 가장 가까운 높이", a.toFixed(0) + " km", ok ? "--green-700" : "--rose-700", true],
          ["결과", ok ? "계획대로 궤도 진입" : (a < 80 ? "대기에 부딪혀 사라짐" : "너무 낮다 — 위험"), ok ? "--green-700" : "--rose-700"]
        ], 70);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "추진 자료 처리", value: "raw", options: [{ v: "raw", t: "숫자를 그대로 쓴다" }, { v: "conv", t: "N·s로 환산해 쓴다" }], onPick: function (x) { mode = x; draw(); } });
      api.slider({ label: "환산 계수 (1 lbf·s = ? N·s)", min: 1, max: 6, step: 0.05, value: 1, fmt: function (x) { return x.toFixed(2); }, onInput: function (x) { f = x; draw(); } });
      api.info("추진 자료를 실제보다 작게 읽으면, 항법 팀은 작은 궤도 수정이 많이 쌓인 효과를 놓쳐 궤도선이 점점 화성 쪽으로 파고드는 것을 알아채지 못합니다.");
      draw();
      return {
        judge: function () {
          var a = alt();
          if (mode === "raw") return { ok: false, msg: "숫자를 그대로 쓰면 추진 효과를 4.45분의 1로 읽어, 궤도선이 화성 위 " + a.toFixed(0) + " km까지 내려가 대기에 부딪힙니다. 실제 사고가 이랬습니다." };
          if (a < 145) return { ok: false, msg: "환산 계수 " + f.toFixed(2) + " → 화성 위 " + a.toFixed(0) + " km. 1 lbf가 몇 N 인지 다시 생각해 보세요." };
          return { ok: true, msg: "1 lbf·s = " + f.toFixed(2) + " N·s로 환산 → 화성 위 " + a.toFixed(0) + " km. 단위만 맞췄을 뿐인데 1억 2500만 달러짜리 궤도선을 지켰습니다." };
        }
      };
    },
    hints: [
      "먼저 ‘환산해 쓴다’를 고르세요. 숫자를 그대로 쓰면 단위가 섞입니다.",
      "1 lbf는 약 0.4536 kg의 물체에 작용하는 중력, 곧 0.4536 × 9.8 ≈ 4.45 N입니다."
    ],
    solution: "<b>N·s로 환산</b>, 환산 계수 <b>4.30~4.60</b> (정확한 값 4.448).",
    why: "1999년 9월 화성 기후 궤도선은 화성 위 약 150 km를 지나도록 계획되었지만, 실제로는 약 57 km까지 내려가 사라졌습니다. 한 팀은 영국식 단위(파운드힘), 다른 팀은 국제단위계(뉴턴)를 썼기 때문입니다.<br>" +
      "여러 사람이 함께 만드는 과학과 기술에서는 모두가 <b>같은 단위와 기준</b>을 써야 자료를 이어 붙일 수 있습니다. 측우기와 주척을 전국에 나누어 준 까닭, 국제단위계가 필요한 까닭이 여기에 있습니다. ※ 궤도 높이 계산은 수업용으로 단순화했습니다."
  }
  ]
});
})();
