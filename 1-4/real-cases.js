/* 과학탐구실험1 Ⅱ 과학 탐구의 과정과 절차 — 실제 자료
   r1 서울은 얼마나 더워졌나 — 1981~1990년과 2015~2024년의 한 해 평균 기온
   r2 추운 겨울의 반론 — 가장 추운 1월이 온난화를 뒤집을까
   r3 평균이 감춘 것 — 창원(155)의 여름은 더워지고 겨울은 추워졌다
   자료: data/seoul-temp.js (NASA POWER), data/cw155.js (기상청 창원 155) */
(function () {
"use strict";
var T = window.REAL_SEOUL || { annual: [], monthly: [] };
var A = {}; T.annual.forEach(function (r) { A[r[0]] = r[1]; });
function avg(a, b) { var s = 0, n = 0; for (var y = a; y <= b; y++) if (A[y] != null) { s += A[y]; n++; } return n ? s / n : 0; }
var M1 = avg(1981, 1990), M2 = avg(2015, 2024), D = M2 - M1;
var JAN = T.monthly.filter(function (r) { return r[1] === 1; });
var J = {}; JAN.forEach(function (r) { J[r[0]] = r[2]; });
var COLD = 2001; for (var y = 2001; y <= 2024; y++) if (J[y] != null && J[y] < J[COLD]) COLD = y;
var DEC = avg(COLD, COLD + 9);
var SRC = "<small>출처: 미국 항공우주국(NASA) POWER 자료 서비스 — 서울(북위 37.57°, 동경 126.98°) 지상 2 m 기온의 해 평균·달 평균, 1981~2024. 위성·관측을 합친 약 50 km 격자 평균이라 도심의 서울 관측소 값보다 1~2 °C 낮게 나옵니다. 변화의 크기를 보는 데 쓰세요. 사본은 data/seoul-temp.js.</small>";
var CWD = window.REAL_CW155 || { rows: [], season: [] };
var CWSE = (CWD.season || []).filter(function (r) { return r[0] >= 1987 && r[0] <= 2025 && r[2] != null; });   /* [연도, 여름(6~8월) 평균, 겨울(앞해 12월~2월) 평균] */
var CWR = (CWD.rows || []).filter(function (r) { return r[0] >= 1987 && r[0] <= 2025; });
function cwM(a, j) { var s = 0; a.forEach(function (r) { s += r[j]; }); return a.length ? s / a.length : 0; }
var CW_S0 = cwM(CWSE.slice(0, 10), 1), CW_S1 = cwM(CWSE.slice(-10), 1), CW_W0 = cwM(CWSE.slice(0, 10), 2), CW_W1 = cwM(CWSE.slice(-10), 2);
var CW_A0 = cwM(CWR.slice(0, 10), 1), CW_A1 = cwM(CWR.slice(-10), 1), CW_DS = CW_S1 - CW_S0;
var CW_COLD = CWSE.slice().sort(function (a, b) { return a[2] - b[2]; }).slice(0, 4).map(function (r) { return r[0]; }).sort();
var CW_Y0 = CWSE.length ? CWSE[0][0] : 1987, CW_YL = CWSE.length ? CWSE[CWSE.length - 1][0] : 2025;
var SRC_CW = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료, 창원(155) 일평균 기온으로 해마다 여름(6 ~ 8월)·겨울(앞해 12월 ~ 그해 2월) 평균을 냈습니다(" + CW_Y0 + " ~ " + CW_YL + "). 위 서울 자료(격자 값)와 달리 관측소 한 곳의 실제 관측입니다. 사본은 data/cw155.js.</small>";

/* ---- 밝은 스튜디오 · 입체 미니어처 도구 (kit.js) ---- */
var K = window.sthKit, LT = K.LT;
function kShadow(ctx, x, y, rx, ry, a) {
  var g = ctx.createRadialGradient(x, y, 1, x, y, rx);
  g.addColorStop(0, "rgba(20,30,50," + (a == null ? .26 : a) + ")"); g.addColorStop(1, "rgba(20,30,50,0)");
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.fill(); ctx.restore();
}
function kTag(ctx, px, py, txt, dx, dy, col, box) {
  var q = { x: px + dx, y: py + dy };
  ctx.strokeStyle = "rgba(20,25,40,.75)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(q.x, q.y); ctx.stroke();
  ctx.fillStyle = "#111622"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 6.283); ctx.fill();
  return K.pill(ctx, txt, q.x + (dx < 0 ? -4 : 4), q.y + 4, { s: 11.5, a: dx < 0 ? "right" : "left", c: col || "#e8ecff", box: box });
}
function kRows(ctx, x0, x1, y, list, gap) { list.forEach(function (r, i) { K.row(ctx, r[0], r[1], x0, x1, y + i * (gap || 28), r[2]); }); }
/* 유리 원기둥(시험관·병·비커) */
function kGlass(ctx, cx, by, r, h, lh, liq, o) {
  o = o || {}; var e = o.e || .3, ry = r * e, ty = by - h, ly = by - lh;
  if (!o.noShadow) kShadow(ctx, cx + r * .3, by + ry * .5, r * 1.6, ry * 1.6, .24);
  ctx.fillStyle = "rgba(205,222,245,.3)"; ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.ellipse(cx, ty, r, ry, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill();
  if (lh > 0 && liq) {
    ctx.fillStyle = liq; ctx.beginPath(); ctx.moveTo(cx - r + 1.5, ly); ctx.lineTo(cx - r + 1.5, by); ctx.ellipse(cx, by, r - 1.5, ry - .5, 0, Math.PI, 0, true); ctx.lineTo(cx + r - 1.5, ly); ctx.closePath(); ctx.fill();
    var sh = ctx.createLinearGradient(cx - r, 0, cx + r, 0); sh.addColorStop(0, "rgba(0,0,30,.22)"); sh.addColorStop(.35, "rgba(255,255,255,.12)"); sh.addColorStop(1, "rgba(0,0,30,.28)"); ctx.fillStyle = sh; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(cx, ly, r - 1.5, ry - .5, 0, 0, 6.2832); ctx.fill();
  }
  if (o.inside) o.inside(ly, ry);
  ctx.strokeStyle = "rgba(80,110,150,.78)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - r, ty); ctx.lineTo(cx - r, by); ctx.ellipse(cx, by, r, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + r, ty); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, ty, r, ry, 0, 0, 6.2832); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(cx - r * .66, ty + ry + 4, r * .18, Math.max(0, h - ry - 10));
}
/* 작은 도시 블록(관측소 백엽상 포함): o.snow 눈 덮임, o.sun 해 */
function kCity(ctx, ox, oy, s, o) {
  o = o || {}; var I = K.iso({ ox: ox, oy: oy, s: s, L: 160, D: 110 });
  I.box(ctx, 0, 0, -14, 160, 110, 0, o.snow ? "#eef3f7" : "#8fbf73", "#8a6a4a", "#6d523a");
  I.box(ctx, 0, 54, 0, 160, 68, .6, "#8d8f94", "#7a7c82", "#6b6d72");
  [[12, 8, 34, 34, 74], [42, 10, 62, 32, 46], [94, 6, 118, 34, 96], [124, 10, 150, 34, 58], [18, 78, 42, 102, 42], [112, 80, 140, 104, 66]].forEach(function (b) {
    I.box(ctx, b[0], b[1], 0, b[2], b[3], b[4], o.snow ? "#ffffff" : "#dde2ea", "#c3cad5", "#9ea7b5");
    for (var z = 10; z < b[4] - 6; z += 12) for (var x = b[0] + 4; x < b[2] - 4; x += 7) I.quad(ctx, I.P(x, b[3], z), I.P(x + 3.5, b[3], z), I.P(x + 3.5, b[3], z + 6), I.P(x, b[3], z + 6), o.night ? "#ffd86b" : "#7d95b8");
  });
  I.tree(ctx, 80, 92, 0, .7); I.tree(ctx, 150, 92, 0, .6);
  [[66, 80], [72, 80], [66, 86], [72, 86]].forEach(function (q) { I.box(ctx, q[0], q[1], 0, q[0] + 1.5, q[1] + 1.5, 16, "#f4f4f0", "#d8d8d2", "#bdbdb6"); });
  I.box(ctx, 64, 78, 16, 76, 90, 28, "#ffffff", "#eceeea", "#cfd3cc");
  if (o.sun) K.sun(ctx, ox + 70 * s, oy - 70 * s, 7);
  return I;
}

function chart(H, ctx, W, CH, pts, lo, hi, pick, shade, label) {
  H.paper(ctx, W, CH);
  var g = K.chart(ctx, { x: 4, y: 8, w: 596, h: CH - 12, pl: 46, pt: 26, pb: 30, pr: 14, x0: 1980.5, x1: 2024.5, y0: lo, y1: hi, xt: 4, yt: hi - lo > 6 ? Math.round((hi - lo) / 2) : hi - lo, light: true, xf: function () { return ""; }, yf: function (v) { return Math.round(v) + "°"; } });
  function X(y) { return g.X(y); }
  function Y(v) { return g.Y(v); }
  if (shade) shade.forEach(function (s) { ctx.fillStyle = "rgba(245,159,0,.13)"; ctx.fillRect(X(s[0] - 0.5), g.T, X(s[1] + 0.5) - X(s[0] - 0.5), g.B - g.T); });
  [1985, 1995, 2005, 2015].forEach(function (y) { K.t(ctx, String(y), X(y), g.B + 15, { s: 10.5, w: "700", a: "center", c: LT.mute }); });
  pts.forEach(function (p) {
    var x = X(p[0]) - 4.5, top = Y(p.length > 2 ? p[2] : p[1]), w = 9, on = pick === p[0], c = on ? "#f59f00" : "#4f8fd6";
    ctx.fillStyle = on ? "#b86e00" : "#2f6aac"; ctx.beginPath(); ctx.moveTo(x + w, top); ctx.lineTo(x + w + 4, top - 3); ctx.lineTo(x + w + 4, g.B - 3); ctx.lineTo(x + w, g.B); ctx.closePath(); ctx.fill();
    ctx.fillStyle = on ? "#ffd27a" : "#9cc3ef"; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + 4, top - 3); ctx.lineTo(x + w + 4, top - 3); ctx.lineTo(x + w, top); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c; ctx.fillRect(x, top, w, g.B - top);
  });
  K.t(ctx, label, g.L + 4, 20, { s: 11.5, w: "800", c: LT.mute });
  return { X: X, Y: Y };
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 ‘추세’와 ‘한 번의 예외’를 구별해야 하는 까닭을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "03", tag: "실제 자료 · 기온 추세", title: "서울은 얼마나 더워졌나", short: "10년 평균",
    who: "🌡️", name: "기후 자료 분석팀",
    say: "“해마다 기온은 오르락내리락해서 한 해만 보면 추세를 알기 어려워요. 그래서 <b>10년씩 묶어 평균</b>을 냅니다. 서울의 <b>1981~1990년</b> 평균과 <b>2015~2024년</b> 평균을 견주어, <b>몇 °C 올랐는지</b> 구해 주세요.”",
    predict: {
      q: "한 해의 기온이 아니라 10년 평균을 비교하는 까닭은 무엇일까요?",
      options: ["㉠ 계산이 쉬워서", "㉡ 해마다 생기는 우연한 오르내림을 줄이고 추세를 보려고", "㉢ 10년마다만 기온을 재서"],
      answer: 1
    },
    task: "두 기간 평균의 차이를 슬라이더로 맞추세요(± 0.2 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 0;
      function draw() {
        var c = chart(H, ctx, W, cv.H, T.annual, 9, 14, null, [[1981, 1990], [2015, 2024]], "서울의 한 해 평균 기온 (°C) — 세로축은 9 °C부터");
        K.line(ctx, { x: c.X(1980.5), y: c.Y(M1) }, { x: c.X(1990.5), y: c.Y(M1) }, LT.ink, 2.2, [5, 4]);
        K.line(ctx, { x: c.X(2014.5), y: c.Y(M2) }, { x: c.X(2024.5), y: c.Y(M2) }, LT.ink, 2.2, [5, 4]);
        var RX = 610, px = RX + 18, xr = W - 18;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "두 기간의 평균");
        K.row(ctx, "1981~1990 평균", M1.toFixed(2) + " °C", px, xr, 60);
        K.row(ctx, "2015~2024 평균", M2.toFixed(2) + " °C", px, xr, 86);
        K.row(ctx, "내 답 (오른 정도)", "+" + g.toFixed(1) + " °C", px, xr, 116, LT.orange);
        kCity(ctx, RX + 128, 170, .42, { sun: true });
        K.t(ctx, "서울 · 도심 관측소", RX + 146, cv.H - 18, { s: 10.5, w: "700", a: "center", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "오른 기온", min: 0, max: 3, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " °C"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("점선이 두 기간의 평균입니다. " + SRC
        + "<div data-link='{\"id\":\"climate-go\",\"title\":\"기후정보포털 — 지점별 관측자료\",\"src\":\"기상청\",\"url\":\"https://www.climate.go.kr/home/CCS/contents_2021/37_2_past_analysis_recent.php\",\"ask\":\"요소는 ‘평균기온’, 지역은 ‘지점별’에서 서울을 고르고, 비교 기간을 ‘임의 기간’으로 바꿔 1981~1990년과 2015~2024년을 넣어 조회하세요. 두 기간 서울 평균 기온이 몇 °C 다른지 읽어, 이 사례의 값과 비교해 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - D) <= 0.2 + 1e-9) return { ok: true, msg: M2.toFixed(2) + " − " + M1.toFixed(2) + " ≈ +" + D.toFixed(2) + " °C — 30여 년 만에 1 °C 넘게 올랐습니다." };
          return { ok: false, msg: "+" + g.toFixed(1) + " °C는 맞지 않습니다. 오른쪽 두 평균의 차이를 구하세요." };
        }
      };
    },
    hints: ["오른쪽 판에 두 평균이 있습니다.", M2.toFixed(2) + " − " + M1.toFixed(2) + " = ?"],
    solution: "약 <b>+" + D.toFixed(1) + " °C</b>.",
    why: "기온은 엘니뇨, 화산 폭발, 그해 날씨 같은 까닭으로 해마다 0.5 °C 넘게 오르내립니다. 이런 ‘잡음’ 속에서 추세를 보려면 여러 해를 묶어 평균을 내야 합니다. 서울은 지구 평균(같은 기간 약 0.7~0.8 °C)보다 빨리 더워졌는데, 육지가 바다보다 빨리 데워지기 때문으로 봅니다(도심 관측소 값에는 도시 열섬 효과가 더해집니다).<br>"
      + "변화를 말할 때는 비교한 기간과 방법을 함께 밝혀야 다른 사람이 같은 결론에 이르는지 확인할 수 있습니다."
  },
  {
    id: "r2", sec: "03", tag: "실제 자료 · 반론 검토", title: "추운 겨울의 반론", short: "가장 추운 1월",
    who: "❄️", name: "토론 동아리",
    say: "“‘이번 겨울이 이렇게 추운데 무슨 온난화냐!’라는 반론이 있어요. 2001년 이후 서울의 <b>1월 평균 기온</b> 가운데 <b>가장 추웠던 해</b>를 찾고, 그해부터 <b>10년 평균 기온</b>이 1981~1990년 평균(" + M1.toFixed(2) + " °C)보다 높은지 낮은지 골라 주세요.”",
    predict: {
      q: "아주 추운 겨울이 한 번 왔다면 온난화가 틀렸다는 증거일까요?",
      options: ["㉠ 그렇다, 한 번이라도 추우면 틀린 것이다", "㉡ 아니다, 한 해의 날씨와 여러 해의 기후 추세는 다르다", "㉢ 추운 겨울은 생길 수 없다"],
      answer: 1
    },
    task: "가장 추운 1월의 해를 고르고, 그해부터 10년 평균을 1980년대와 비교하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, y = 2001, cmp = "none";
      function draw() {
        chart(H, ctx, W, cv.H, JAN, -9, 2, y, [[2001, 2024]], "서울의 1월 평균 기온 (°C) — 막대가 짧을수록 추운 1월");
        var RX = 610, px = RX + 18, xr = W - 18;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "고른 해의 기록");
        K.row(ctx, "고른 해", y + "년 1월", px, xr, 60, "#b86e00");
        K.row(ctx, "1월 평균", (J[y] != null ? J[y].toFixed(1) : "-") + " °C", px, xr, 86, LT.blue);
        K.row(ctx, "그해 한 해 평균", (A[y] != null ? A[y].toFixed(2) : "-") + " °C", px, xr, 112);
        kCity(ctx, RX + 128, 170, .42, { snow: true });
        K.t(ctx, "눈 덮인 1월의 서울", RX + 146, cv.H - 18, { s: 10.5, w: "700", a: "center", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "연도", min: 2001, max: 2024, step: 1, value: 2001, fmt: function (x) { return x + "년"; }, onInput: function (x) { y = x; api.changed(); draw(); } });
      api.seg({ label: "그해부터 10년 평균은 1981~1990년보다", value: "none", options: [{ v: "hi", t: "높다" }, { v: "lo", t: "낮다" }, { v: "eq", t: "같다" }], onPick: function (x) { cmp = x; api.changed(); } });
      api.info("막대는 −9 °C를 바닥으로 위로 올라갑니다 — 추운 1월일수록 막대가 짧습니다. 오른쪽 숫자로 확인하세요. 연도를 옮기면 오른쪽에 그해 한 해 평균이 나옵니다. 10년치를 더해 10으로 나누세요. " + SRC);
      draw();
      return {
        judge: function () {
          if (y !== COLD) return { ok: false, msg: y + "년 1월은 " + (J[y] != null ? J[y].toFixed(1) : "-") + " °C입니다. 더 추운 1월이 있습니다." };
          var want = DEC > M1 ? "hi" : "lo";
          if (cmp !== want) return { ok: false, msg: "해는 맞았습니다. " + COLD + " ~ " + (COLD + 9) + "년의 한 해 평균 기온을 더해 10으로 나누어 " + M1.toFixed(2) + " °C와 견주세요." };
          return { ok: true, msg: COLD + "년 1월 " + J[COLD].toFixed(1) + " °C — 2001년 이후 가장 추웠고, 그해 한 해 평균(" + A[COLD].toFixed(2) + " °C)도 낮았습니다. 그러나 " + COLD + " ~ " + (COLD + 9) + "년 10년 평균은 " + DEC.toFixed(2) + " °C로 1980년대보다 " + (DEC - M1).toFixed(2) + " °C 높아요." };
        }
      };
    },
    hints: ["막대가 가장 짧은(값이 가장 작은) 해를 찾으세요.", "그해부터 10년 평균 ≈ " + DEC.toFixed(1) + " °C. 1981~1990년 평균은 " + M1.toFixed(2) + " °C."],
    solution: "<b>" + COLD + "년</b>, 그해부터 10년 평균은 1980년대보다 <b>높다</b>.",
    why: "날씨는 하루하루, 한 해 한 해의 대기 상태이고, 기후는 30년쯤의 평균적인 상태입니다. 온난화가 진행되어도 북극의 찬 공기가 내려오는 해에는 몹시 추운 겨울이 올 수 있습니다. 한 해, 한 달의 예외는 추세를 뒤집는 증거가 되지 못하고, 반론을 검토할 때는 같은 기준(여러 해의 평균)으로 비교해야 합니다.<br>"
      + "과학 탐구에서 반론은 소중합니다. 다만 반론도 증거로 시험해야 하며, 이 경우 증거는 ‘추세는 그대로’라는 쪽을 가리킵니다."
  },
  {
    id: "r3", sec: "03", tag: "실제 자료 · 우리 동네 기온", title: "평균이 감춘 것 — 창원의 여름과 겨울", short: "여름과 겨울",
    who: "📍", name: "창원기상대(기상청)",
    say: "“진해와 가까운 <b>창원기상대</b>의 한 해 평균 기온은 처음 10년(" + CW_Y0 + " ~ " + (CW_Y0 + 9) + ") " + CW_A0.toFixed(1) + " °C, 마지막 10년(" + (CW_YL - 9) + " ~ " + CW_YL + ") " + CW_A1.toFixed(1) + " °C로 거의 그대로예요. 그런데 계절로 나눠 보면 이야기가 달라집니다. 빨간 선은 해마다 <b>여름(6 ~ 8월)</b> 평균, 파란 선은 <b>겨울(12 ~ 2월)</b> 평균이에요. 여름 평균은 처음 10년보다 마지막 10년이 몇 °C 달라졌는지 구해 주세요.”",
    predict: {
      q: "한 해 평균이 거의 그대로인 곳에서 여름과 겨울은 어떻게 되었을까요?",
      options: ["㉠ 둘 다 거의 그대로다", "㉡ 여름은 더워지고 겨울은 오히려 조금 추워져서, 평균에서는 서로 지워졌다", "㉢ 겨울만 크게 따뜻해졌다"],
      answer: 1
    },
    task: "오른쪽 두 기간의 여름 평균을 읽고 <b>마지막 10년 − 처음 10년</b>을 슬라이더로 맞추세요(± 0.1 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, dt = 0;
      var x0 = 50, x1 = 630, y0 = 20, y1 = 262;
      function X(y) { return x0 + (y - (CW_Y0 - 1)) / (CW_YL - CW_Y0 + 2) * (x1 - x0); }
      var top = [22, 28], bot = [0, 6];        /* 위: 여름 °C, 아래: 겨울 °C */
      function YS(t) { return y0 + (top[1] - t) / (top[1] - top[0]) * 110; }
      function YW(t) { return y1 - 10 - (t - bot[0]) / (bot[1] - bot[0]) * 100; }
      function draw() {
        H.paper(ctx, W, cv.H);
        ctx.fillStyle = "rgba(255,255,255,.72)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.strokeStyle = LT.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
        [23, 25, 27].forEach(function (t) { K.t(ctx, t + "°", x0 - 8, YS(t) + 4, { s: 10.5, w: "700", a: "right", c: LT.red }); K.line(ctx, { x: x0, y: YS(t) }, { x: x1, y: YS(t) }, LT.grid, 1); });
        [1, 3, 5].forEach(function (t) { K.t(ctx, t + "°", x0 - 8, YW(t) + 4, { s: 10.5, w: "700", a: "right", c: LT.blue }); K.line(ctx, { x: x0, y: YW(t) }, { x: x1, y: YW(t) }, LT.grid, 1); });
        K.t(ctx, "여름 6 ~ 8월", x0 + 6, y0 + 14, { s: 11.5, w: "900", c: LT.red });
        K.t(ctx, "겨울 12 ~ 2월", x0 + 6, YW(bot[1]) + 4, { s: 11.5, w: "900", c: LT.blue });
        K.plot(ctx, { X: function (v) { return v; }, Y: function (v) { return v; } }, CWSE.map(function (r) { return [X(r[0]), YS(r[1])]; }), LT.red, { w: 2.2, light: true });
        K.plot(ctx, { X: function (v) { return v; }, Y: function (v) { return v; } }, CWSE.map(function (r) { return [X(r[0]), YW(r[2])]; }), LT.blue, { w: 2.2, light: true });
        [[CW_Y0, CW_Y0 + 9], [CW_YL - 9, CW_YL]].forEach(function (p, i) {
          var s = i ? CW_S1 : CW_S0, w = i ? CW_W1 : CW_W0;
          K.line(ctx, { x: X(p[0]), y: YS(s) }, { x: X(p[1]), y: YS(s) }, LT.ink, 3.2);
          K.line(ctx, { x: X(p[0]), y: YW(w) }, { x: X(p[1]), y: YW(w) }, LT.ink, 3.2);
        });
        [1990, 2000, 2010, 2020].forEach(function (y) { K.t(ctx, String(y), X(y), y1 + 15, { s: 10.5, w: "700", a: "center", c: LT.mute }); });
        var RX = 652, px = RX + 16, xr = W - 16;
        K.card(ctx, RX, 8, W - RX - 8, cv.H - 16, "창원기상대 · 10년 평균");
        K.row(ctx, "여름 처음→마지막", CW_S0.toFixed(2) + "→" + CW_S1.toFixed(2), px, xr, 58, LT.red);
        K.row(ctx, "겨울 처음→마지막", CW_W0.toFixed(2) + "→" + CW_W1.toFixed(2), px, xr, 84, LT.blue);
        K.row(ctx, "검은 막대", "10년 평균", px, xr, 110);
        K.row(ctx, "내 답 (여름)", (dt >= 0 ? "+" : "") + dt.toFixed(2) + " °C", px, xr, 136, LT.orange);
        kCity(ctx, RX + 62, 204, .3, { sun: true });
        kCity(ctx, RX + 168, 204, .3, { snow: true });
        K.t(ctx, "여름은 더 덥게 · 겨울은 조금 춥게", RX + 120, cv.H - 16, { s: 10.5, w: "700", a: "center", c: LT.mute });
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "여름 평균의 변화", min: -1.5, max: 1.5, step: 0.05, value: 0, fmt: function (x) { return (x >= 0 ? "+" : "") + x.toFixed(2) + " °C"; }, onInput: function (x) { dt = x; api.changed(); draw(); } });
      api.info("나중 값 − 처음 값. 오르면 +, 내리면 − 입니다. 겨울도 같은 방법으로 구해 보세요. " + SRC_CW);
      draw();
      return {
        judge: function () {
          if (Math.abs(dt - CW_DS) <= 0.1) return { ok: true, msg: "여름은 " + (CW_DS >= 0 ? "+" : "") + CW_DS.toFixed(2) + " °C, 겨울은 " + (CW_W1 - CW_W0 >= 0 ? "+" : "") + (CW_W1 - CW_W0).toFixed(2) + " °C — 둘이 서로를 지워 한 해 평균은 " + (CW_A1 - CW_A0 >= 0 ? "+" : "") + (CW_A1 - CW_A0).toFixed(2) + " °C밖에 안 바뀌었습니다." };
          if (Math.abs(dt + CW_DS) <= 0.1) return { ok: false, msg: "부호가 거꾸로입니다. 마지막 10년 값에서 처음 10년 값을 빼세요." };
          return { ok: false, msg: (dt >= 0 ? "+" : "") + dt.toFixed(2) + " °C는 " + (dt < CW_DS ? "작습니다" : "큽니다") + ". 오른쪽 여름 두 값의 차이를 구하세요." };
        }
      };
    },
    hints: ["여름: " + CW_S1.toFixed(2) + " − " + CW_S0.toFixed(2) + " = ?", "같은 방법으로 겨울도: " + CW_W1.toFixed(2) + " − " + CW_W0.toFixed(2)],
    solution: "여름 " + CW_S1.toFixed(2) + " − " + CW_S0.toFixed(2) + " = <b>" + (CW_DS >= 0 ? "+" : "") + CW_DS.toFixed(2) + " °C</b> (겨울은 " + (CW_W1 - CW_W0).toFixed(2) + " °C).",
    why: "평균 하나는 많은 것을 감춥니다. 창원의 여름은 " + CW_DS.toFixed(1) + " °C쯤 더워졌는데(폭염일도 크게 늘었습니다), 겨울은 오히려 " + (CW_W0 - CW_W1).toFixed(1) + " °C쯤 추워져서 한 해 평균에서는 둘이 거의 지워졌습니다. 겨울이 가장 추웠던 해는 " + CW_COLD.join("·") + "년으로, 모두 마지막 15년 안에 있습니다.<br>"
      + "그렇다면 ‘창원은 온난화가 없다’고 말할 수 있을까요? 위의 ‘추운 겨울의 반론’에서 본 것처럼, 추운 겨울 몇 해로 지구 전체의 추세를 뒤집을 수는 없습니다. 관측소 한 곳의 기록은 그 둘레의 땅 이용 변화나 해마다의 날씨에도 크게 흔들립니다. 이런 자료를 볼 때 탐구자는 ① 계절·극단으로 나눠 보고 ② 비교 기간을 바꿔 보고 ③ 다른 관측소와 견주어 보아야 합니다."
  }
  ]
});
})();
