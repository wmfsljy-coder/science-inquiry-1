/* 과학탐구실험1 Ⅰ 역사 속의 과학 탐구 — 실제 자료
   r1 멘델레예프의 빈칸 — 이웃 원소로 게르마늄(에카규소)의 원자량과 밀도를 예측하기
   r2 서울의 비는 언제 내리나 — 달마다 내린 비의 평균(1981~2024)
   r3 창원의 비는 언제 내리나 — 기상청 창원(155) 1991~2020 달별 강수, 서울과 비교
   자료: data/elements.js (PubChem 주기율표), data/seoul-rain.js (NASA POWER), data/cw155.js (기상청 창원 155) */
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
/* 측우기 미니어처: 화강암 받침(측우대) 위 놋쇠 원통, 안에 고인 빗물이 보이게 앞벽을 반쯤 비춘다. (x, y) 받침 윗면 가운데 */
function gauge(c, x, y, s) {
  var IG = K.iso({ ox: x, oy: y - 18 * s, s: s, L: 44, D: 44 });
  IG.box(c, 0, 0, 0, 44, 44, 26, "#dedbd2", "#c3bfb5", "#a29d92");
  var p = IG.P(22, 22, 26), r = 13 * s, h = 46 * s, wtr = 12 * s;
  c.fillStyle = "#5b3d1c"; c.fillRect(p.x - r, p.y - h, 2 * r, h); c.beginPath(); c.ellipse(p.x, p.y, r, r * .36, 0, 0, Math.PI); c.fill();
  var wg = c.createLinearGradient(0, p.y - wtr, 0, p.y); wg.addColorStop(0, "#6cc4ee"); wg.addColorStop(1, "#1f6fb8");
  c.fillStyle = wg; c.fillRect(p.x - r, p.y - wtr, 2 * r, wtr); c.beginPath(); c.ellipse(p.x, p.y, r, r * .36, 0, 0, Math.PI); c.fill();
  c.fillStyle = "rgba(190,235,255,.95)"; c.beginPath(); c.ellipse(p.x, p.y - wtr, r, r * .36, 0, 0, 6.2832); c.fill();
  var mg = c.createLinearGradient(p.x - r, 0, p.x + r, 0); mg.addColorStop(0, "rgba(120,80,30,.6)"); mg.addColorStop(.4, "rgba(240,200,120,.45)"); mg.addColorStop(1, "rgba(100,65,25,.65)");
  c.fillStyle = mg; c.fillRect(p.x - r, p.y - h, 2 * r, h); c.beginPath(); c.ellipse(p.x, p.y, r, r * .36, 0, 0, Math.PI); c.fill();
  c.strokeStyle = "#d8b06a"; c.lineWidth = 2.5; c.beginPath(); c.ellipse(p.x, p.y - h, r, r * .36, 0, 0, 6.2832); c.stroke();
  c.strokeStyle = "rgba(70,110,170,.55)"; c.lineWidth = 1.2;
  for (var k = 0; k < 6; k++) { var rx = p.x - 18 + k * 7, ry = p.y - h - 30 + (k % 3) * 8; c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 2, ry + 9); c.stroke(); }
}
var P = window.REAL_PT || { rows: [] }, RN = window.REAL_RAIN || { monthly: [] };
function el(s) { for (var i = 0; i < P.rows.length; i++) if (P.rows[i][0] === s) return P.rows[i]; return [s, s, 0, 0, 0, 0, ""]; }
var GE = el("Ge"), NB = [el("Si"), el("Sn"), el("Ga"), el("As")];
var AM = NB.reduce(function (s, e) { return s + e[3]; }, 0) / 4, AD = NB.reduce(function (s, e) { return s + e[4]; }, 0) / 4;
var YRS = {}; RN.monthly.forEach(function (r) { YRS[r[0]] = 1; });
var NY = Object.keys(YRS).length || 1;
var MAVG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (m) { return RN.monthly.filter(function (r) { return r[1] === m; }).reduce(function (s, r) { return s + r[2]; }, 0) / NY; });
var TOT = MAVG.reduce(function (s, v) { return s + v; }, 0), SUM = MAVG[5] + MAVG[6] + MAVG[7], SH = TOT ? SUM / TOT * 100 : 58;
var SRC1 = "<small>출처: 미국 국립보건원 PubChem 주기율표(원자량, 밀도 g/cm³). 멘델레예프의 예측값(1871): 원자량 72, 밀도 5.5 g/cm³. 사본은 data/elements.js.</small>";
var SRC2 = "<small>출처: 미국 항공우주국(NASA) POWER 자료 서비스 — 서울(북위 37.57°, 동경 126.98°) 달마다 내린 비의 양, 1981~2024년 " + NY + "년 평균. 위성·관측을 합친 약 50 km 격자 평균이라 서울 관측소 값(한 해 약 1,400 mm)보다 조금 적게 나옵니다. 사본은 data/seoul-rain.js.</small>";
var CWP = (window.REAL_CW155 || {}).monthP || [], CWH = (window.REAL_CW155 || {}).heavyM || [];   /* 1991~2020 달별 강수 평균 mm, 1986~2025 달별 호우일 */
var CW_TOT = CWP.reduce(function (s, v) { return s + v; }, 0), CW_SUM = (CWP[5] || 0) + (CWP[6] || 0) + (CWP[7] || 0), CW_SH = CW_TOT ? CW_SUM / CW_TOT * 100 : 51;
var CW_HT = CWH.reduce(function (s, v) { return s + v; }, 0), CW_HS = (CWH[5] || 0) + (CWH[6] || 0) + (CWH[7] || 0) + (CWH[8] || 0);
var SRC_CW = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료, 창원(155) 일강수량을 달마다 더해 1991 ~ 2020년 30년 평균을 냈습니다(한 해 합 " + Math.round(CW_TOT).toLocaleString() + " mm — 기상청 평년값 1,534.1 mm와 같음). 호우일(하루 80 mm 이상)은 1986 ~ 2025년. 사본은 data/cw155.js.</small>";

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 ‘예측하고 확인하는’ 과학 탐구와 ‘꾸준히 재는’ 과학 탐구를 비교해 보세요.",
  cases: [
  {
    id: "r1", sec: "03", tag: "실제 자료 · 주기율표", title: "멘델레예프의 빈칸", short: "에카규소",
    who: "🧪", name: "멘델레예프의 실험실",
    say: "“1871년 나는 주기율표에 빈칸을 남기고, 규소 아래에 올 원소 ‘에카규소’의 성질을 예측했어요. 빈칸 둘레 네 원소(위·아래·왼쪽·오른쪽)의 <b>실제 값</b>입니다. 네 이웃의 평균으로 빈칸 원소의 <b>원자량</b>과 <b>밀도</b>를 예측해 주세요. (1871년에는 왼쪽 갈륨 자리도 아직 빈칸이었어요. 여기서는 오늘날의 주기율표 값으로 해 봅니다.)”",
    predict: {
      q: "주기율표에서 빈칸 원소의 성질을 예측할 수 있는 까닭은 무엇일까요?",
      options: ["㉠ 원소의 성질이 아무렇게나 바뀌어서", "㉡ 원소의 성질이 주기적으로 되풀이되어, 이웃 원소 사이의 값을 갖기 쉬워서", "㉢ 모든 원소의 성질이 같아서"],
      answer: 1
    },
    task: "원자량(± 0.5)과 밀도(± 0.15 g/cm³)를 슬라이더로 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, m = 60, d = 3;
      function cell(e, x, y, q) {
        tile3(ctx, x, y, 110, 78, q ? "#f59f00" : (e[0] === "Si" || e[0] === "Sn" ? "#0f9f76" : "#1c7ed6"));
        if (q) { ctx.save(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.roundRect(x + 4, y + 4, 102, 70, 5); ctx.stroke(); ctx.restore(); }
        H.text(ctx, q ? "?" : e[0], x + 55, y + 30, { s: 22, w: "900", a: "center", c: "#fff" });
        H.text(ctx, q ? "원자량 " + m.toFixed(1) : "원자량 " + e[3].toFixed(2), x + 55, y + 51, { s: 11, w: "800", a: "center", c: "rgba(255,255,255,.95)" });
        H.text(ctx, q ? "밀도 " + d.toFixed(2) : "밀도 " + e[4].toFixed(2), x + 55, y + 68, { s: 11, w: "800", a: "center", c: "rgba(255,255,255,.95)" });
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        ctx.fillStyle = "rgba(20,30,50,.16)"; ctx.beginPath(); ctx.ellipse(205, 286, 200, 10, 0, 0, 6.2832); ctx.fill();
        bar3(ctx, 16, 6, 384, 276, "#c99a62", 10, 7);
        cell(NB[0], 150, 18, false); cell(NB[2], 30, 104, false); cell(GE, 150, 104, true); cell(NB[3], 270, 104, false); cell(NB[1], 150, 190, false);
        /* 회색 금속 광택 덩어리 — 1886년에 찾은 게르마늄 */
        var gx = 470, gy = 200;
        ctx.fillStyle = "rgba(20,30,50,.2)"; ctx.beginPath(); ctx.ellipse(gx + 4, gy + 22, 36, 8, 0, 0, 6.2832); ctx.fill();
        var gg = ctx.createLinearGradient(gx - 30, gy - 26, gx + 30, gy + 22); gg.addColorStop(0, "#f1f3f5"); gg.addColorStop(.45, "#8a929e"); gg.addColorStop(1, "#495057");
        ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(gx - 30, gy + 16); ctx.lineTo(gx - 20, gy - 18); ctx.lineTo(gx + 6, gy - 28); ctx.lineTo(gx + 30, gy - 8); ctx.lineTo(gx + 24, gy + 20); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.moveTo(gx - 20, gy - 18); ctx.lineTo(gx + 6, gy - 28); ctx.lineTo(gx - 2, gy - 6); ctx.closePath(); ctx.fill();
        K.pill(ctx, "1886년 빙클러가 찾은 금속", gx, gy + 52, { s: 11, a: "center", c: "#ffffff", box: [410, 606] });
        K.bigText(ctx, "에카규소 = ?", 420, 46, 22, "#ffd35a");
        card(H, ctx, 616, 12, 272, cv.H - 24, "내 예측", [["원자량", m.toFixed(1), null, true], ["밀도", d.toFixed(2) + " g/cm³", null, true]], 80);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "원자량", min: 60, max: 90, step: 0.1, value: 60, fmt: function (x) { return x.toFixed(1); }, onInput: function (x) { m = x; api.changed(); draw(); } });
      api.slider({ label: "밀도", min: 1, max: 9, step: 0.05, value: 3, fmt: function (x) { return x.toFixed(2) + " g/cm³"; }, onInput: function (x) { d = x; api.changed(); draw(); } });
      api.info("위 Si(규소), 아래 Sn(주석), 왼쪽 Ga(갈륨), 오른쪽 As(비소). 밀도 단위는 g/cm³. " + SRC1);
      draw();
      return {
        judge: function () {
          var okm = Math.abs(m - AM) <= 0.5, okd = Math.abs(d - AD) <= 0.15 + 1e-9;
          if (okm && okd) return { ok: true, msg: "네 이웃의 평균: 원자량 " + AM.toFixed(1) + ", 밀도 " + AD.toFixed(2) + ". 1886년 빙클러가 찾은 게르마늄(Ge)의 실제 값은 원자량 " + GE[3].toFixed(2) + ", 밀도 " + GE[4].toFixed(2) + " g/cm³ — 예측이 거의 맞았습니다." };
          if (!okm) return { ok: false, msg: "원자량 " + m.toFixed(1) + " 은 맞지 않습니다. 네 원소의 원자량을 더해 4로 나누세요." };
          return { ok: false, msg: "원자량은 맞았습니다. 밀도 " + d.toFixed(2) + " 도 같은 방법으로 평균을 구하세요." };
        }
      };
    },
    hints: ["원자량: (" + NB.map(function (e) { return e[3].toFixed(1); }).join(" + ") + ") ÷ 4.", "밀도: (" + NB.map(function (e) { return e[4].toFixed(2); }).join(" + ") + ") ÷ 4."],
    solution: "원자량 약 <b>" + AM.toFixed(1) + "</b>, 밀도 약 <b>" + AD.toFixed(2) + " g/cm³</b>.",
    why: "멘델레예프는 원소를 원자량 순으로 늘어놓되 성질이 비슷한 것끼리 같은 세로줄에 오도록 배열하고, 맞는 원소가 없는 자리는 비워 두었습니다. 그리고 빈칸의 성질을 이웃 원소로부터 예측했습니다. 1875년 갈륨(에카알루미늄), 1879년 스칸듐(에카붕소), 1886년 게르마늄(에카규소)이 발견되어 예측과 맞자, 주기율표는 널리 받아들여졌습니다.<br>"
      + "같은 무렵 독일의 마이어도 원자 부피의 주기성으로 비슷한 표를 만들었지만, 아직 발견되지 않은 원소를 대담하게 예측하고 그것이 확인된 점에서 멘델레예프의 표가 더 큰 힘을 얻었습니다. 시험할 수 있는 예측은 과학 이론의 큰 장점입니다."
  },
  {
    id: "r2", sec: "02", tag: "실제 자료 · 강수량", title: "서울의 비는 언제 내리나", short: "여름 비",
    who: "☔", name: "측우기 관측관",
    say: "“세종 때(1441년) 만든 측우기로 우리 조상은 비의 양을 꾸준히 재었어요. 오늘날 위성과 관측을 합친 <b>서울의 달마다 내린 비</b>를 44년 평균으로 보여 드립니다. 한 해 비 가운데 <b>여름(6~8월)</b>에 내리는 비는 <b>몇 %</b>일까요?”",
    predict: {
      q: "우리나라에서 한 해 가운데 비가 가장 많이 내리는 계절은 언제일까요?",
      options: ["㉠ 봄", "㉡ 여름 — 장마와 태풍", "㉢ 겨울"],
      answer: 1
    },
    task: "6~8월 비의 비율(%)을 슬라이더로 맞추세요(± 2%).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, g = 25;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 576, y0 = 30, y1 = cv.H - 40, bw = (x1 - x0) / 12, mx = Math.max.apply(null, MAVG) * 1.12 || 1;
        function Y(v) { return y1 - v / mx * (y1 - y0); }
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        H.axes(ctx, x0, y0, x1, y1);
        [0, 100, 200, 300].forEach(function (v) { if (v < mx) { H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10.5, w: "700", a: "right", c: H.v("--mist") }); if (v) H.dash(ctx, x0, Y(v), x1, Y(v), "rgba(20,40,90,.12)", 1); } });
        gauge(ctx, 116, 150, 1);
        MAVG.forEach(function (v, i) {
          bar3(ctx, x0 + i * bw + 6, Y(v), bw - 16, y1, i >= 5 && i <= 7 ? "#1c7ed6" : "#adb5bd", 6, 4);
          H.text(ctx, Math.round(v), x0 + i * bw + bw / 2, Y(v) - 8, { s: 10.5, w: "800", a: "center", c: H.v("--ink") });
          H.text(ctx, (i + 1) + "월", x0 + i * bw + bw / 2, y1 + 16, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "달마다 내린 비의 평균 (mm) — 파랑: 6~8월", x0 + 4, y0 - 12, { s: 11, w: "800", c: H.v("--mist") });
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [["한 해 합", Math.round(TOT).toLocaleString() + " mm"], ["6~8월 합", Math.round(SUM).toLocaleString() + " mm", "--brand"], ["내 답 (여름 비율)", g + "%", null, true]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "6~8월 비의 비율", min: 0, max: 100, step: 1, value: 25, fmt: function (x) { return x + "%"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("측우기는 지름이 일정한 원통이라, 고인 물의 깊이만 재면 비의 양을 비교할 수 있습니다. 오늘날 강수량도 ‘mm’(물이 고인 깊이)로 나타냅니다. " + SRC2
        + "<div data-map='{\"id\":\"kma-museum\",\"name\":\"국립기상박물관 (서울 종로구 송월동)\",\"lat\":37.5713,\"lng\":126.9658,\"zoom\":17,\"ask\":\"국립기상박물관과 바로 옆 서울기상관측소 둘레를 지도로 살펴보세요. 비를 재는 그릇은 둘레의 건물·나무 높이의 2배 이상 떨어진 빈터에 두는 것이 원칙입니다. 그런 빈터가 어디쯤 있는지 지도에서 찾아, 왜 떨어뜨려야 하는지 까닭과 함께 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - SH) <= 2) return { ok: true, msg: Math.round(SUM) + " ÷ " + Math.round(TOT) + " ≈ " + SH.toFixed(1) + "% — 한 해 비의 절반 넘는 양이 여름 석 달에 내립니다." };
          return { ok: false, msg: g + "%는 " + (g < SH ? "작습니다" : "큽니다") + ". (6월 + 7월 + 8월) ÷ 한 해 합 × 100." };
        }
      };
    },
    hints: ["6~8월 합 = " + Math.round(MAVG[5]) + " + " + Math.round(MAVG[6]) + " + " + Math.round(MAVG[7]) + " = " + Math.round(SUM) + " mm.", Math.round(SUM) + " ÷ " + Math.round(TOT) + " × 100 ≈ ?"],
    solution: "약 <b>" + Math.round(SH) + "%</b>.",
    why: "우리나라는 여름에 장마 전선과 태풍, 덥고 습한 공기 때문에 비가 몰려 내립니다. 그래서 여름에는 홍수, 봄에는 가뭄을 함께 대비해야 합니다. 조선은 측우기로 전국의 비를 꾸준히 재어 농사와 세금, 홍수 대비에 썼고, 서울의 강우 기록은 1777년부터 이어져 세계에서 가장 오래된 강우 기록 가운데 하나입니다.<br>"
      + "같은 그릇, 같은 방법으로 오랫동안 잰 기록이 있어야 기후가 바뀌는지를 알 수 있습니다. 측우기는 ‘표준화된 측정’의 좋은 예입니다."
  },
  {
    id: "r3", sec: "02", tag: "실제 자료 · 우리 동네 비", title: "창원의 비는 언제 내리나", short: "창원 비",
    who: "📍", name: "창원기상대(기상청)",
    say: "“위에서는 서울의 비를 보았지요. 이번에는 진해와 가까운 <b>창원기상대</b>(마산합포구 가포동)가 빗물받이로 직접 잰 기상청 기록입니다. 막대는 1991 ~ 2020년 30년 동안 달마다 내린 비의 평균, 막대 아래 숫자는 하루에 80 mm 넘게 쏟아진 <b>호우일</b>이 40년 동안 그 달에 며칠 있었는지예요. <b>6 ~ 8월에 내리는 비가 한 해 비의 몇 %</b>인지 구해 서울과 비교해 주세요.”",
    predict: {
      q: "남해안의 창원은 서울과 견주어 여름(6 ~ 8월)에 비가 몰리는 정도가 어떨까요?",
      options: ["㉠ 서울보다 더 여름에 몰린다", "㉡ 서울보다 덜 몰린다 — 봄비와 9월 비가 많아 한 해에 더 고르게 내린다", "㉢ 서울과 똑같다"],
      answer: 1
    },
    task: "막대 위 숫자로 <b>(6월 + 7월 + 8월) ÷ 한 해 합 × 100</b>을 구해 슬라이더로 맞추세요(± 3 %).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, p = 40;
      var x0 = 50, x1 = 600, y0 = 24, y1 = 240, bw = (x1 - x0) / 12;
      function Y(v) { return y1 - v / 340 * (y1 - y0); }
      function draw() {
        H.paper(ctx, W, cv.H);
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        H.axes(ctx, x0, y0, x1, y1);
        [0, 100, 200, 300].forEach(function (v) { H.text(ctx, v, x0 - 8, Y(v) + 4, { s: 10.5, w: "700", a: "right", c: H.v("--mist") }); if (v) H.dash(ctx, x0, Y(v), x1, Y(v), "rgba(20,40,90,.12)", 1); });
        H.text(ctx, "mm", x0 + 6, y0 - 8, { s: 11, w: "800", c: H.v("--mist") });
        gauge(ctx, 104, 130, 0.9);
        CWP.forEach(function (v, i) {
          var cx = x0 + i * bw, sum = i >= 5 && i <= 7;
          bar3(ctx, cx + 6, Y(v), bw - 16, y1, sum ? "#e03131" : "#1c7ed6", 6, 4);
          H.text(ctx, Math.round(v), cx + bw / 2, Y(v) - 8, { s: 11, w: "800", a: "center" });
          H.text(ctx, (i + 1) + "월", cx + bw / 2, y1 + 16, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
          H.text(ctx, CWH[i] || 0, cx + bw / 2, y1 + 34, { s: 11, w: "800", a: "center", c: H.v("--amber-700") });
        });
        H.text(ctx, "호우일", x0 - 8, y1 + 34, { s: 10, w: "800", a: "right", c: H.v("--amber-700") });
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [["창원 한 해 합", Math.round(CW_TOT).toLocaleString() + " mm"], ["서울(위 사례) 6 ~ 8월 몫", SH.toFixed(0) + " %", "--mist"], ["창원 6 ~ 8월 몫", p + " %", null, true]], 64);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "창원 6 ~ 8월 비의 몫", min: 20, max: 80, step: 1, value: 40, fmt: function (x) { return x + " %"; }, onInput: function (x) { p = x; api.changed(); draw(); } });
      api.info("빨간 막대 셋을 더하고 열두 막대 전체의 합으로 나누세요. " + SRC_CW
        + "<div data-link='{\"id\":\"kma-cw155\",\"title\":\"창원 과거 관측 일별 자료\",\"src\":\"기상청 날씨누리\",\"url\":\"https://www.weather.go.kr/w/weather/land/past-obs/obs-by-day.do?stn=155&obs=1\",\"ask\":\"올해 7월을 골라 비가 가장 많이 온 날과 그날의 강수량을 찾아 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(p - CW_SH) <= 3) return { ok: true, msg: Math.round(CW_SUM) + " ÷ " + Math.round(CW_TOT) + " ≈ " + CW_SH.toFixed(0) + " %. 서울(" + SH.toFixed(0) + " %)보다 여름에 덜 몰립니다." };
          return { ok: false, msg: p + " %는 " + (p < CW_SH ? "적습니다" : "많습니다") + ". 6·7·8월 막대 숫자를 더해 한 해 합으로 나눠 보세요." };
        }
      };
    },
    hints: ["6 ~ 8월: " + CWP.slice(5, 8).map(function (v) { return Math.round(v); }).join(" + ") + " = ?", "그 값 ÷ " + Math.round(CW_TOT) + " × 100"],
    solution: "(" + CWP.slice(5, 8).map(function (v) { return Math.round(v); }).join(" + ") + ") ÷ " + Math.round(CW_TOT) + " × 100 ≈ <b>" + CW_SH.toFixed(0) + " %</b>.",
    why: "창원도 7 ~ 8월에 비가 가장 많지만, 서울과 달리 <b>4 ~ 5월 봄비</b>(" + Math.round(CWP[3]) + " · " + Math.round(CWP[4]) + " mm)와 <b>9월 비</b>(" + Math.round(CWP[8]) + " mm)도 많아 여름에 몰리는 몫이 더 작습니다. 남쪽 바다에서 올라오는 축축한 공기를 먼저 맞는 남해안이기 때문입니다. 하루 80 mm 넘는 호우는 40년 동안 " + CW_HT + "일 있었는데, 그 가운데 " + CW_HS + "일(" + (CW_HT ? CW_HS / CW_HT * 100 : 0).toFixed(0) + " %)이 장마와 태풍이 오는 6 ~ 9월이었습니다.<br>"
      + "※ 서울 자료는 위성·관측을 합친 격자 값이고 창원은 관측소 한 곳의 빗물받이 기록이라, 재는 방법이 다릅니다. 두 자료를 견줄 때는 ‘몇 mm’보다 ‘한 해 가운데 몇 %’처럼 비율로 비교하는 편이 공정합니다."
  }
  ]
});
})();
