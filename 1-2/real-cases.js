/* 과학탐구실험1 Ⅰ 탐구 방법과 절차 — 실제 자료
   r1 손 씻기 전과 뒤, 열두 달씩 — 빈 종합병원 제1병동의 달마다 산모 사망(1841~1849)
   r2 장미 도표가 말한 것 — 크림 전쟁 영국군 사망 원인(1854~1856)
   r3 병사가 가장 많이 죽은 달과 그 뒤 — 군인 1000명당 한 달 병 사망
   자료: data/semmelweis.js (제멜바이스 1861), data/nightingale.js (나이팅게일 1858) */
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
var S = window.REAL_SEMM || { monthly: [] }, N = window.REAL_NIGHT || { rows: [] };
var M = S.monthly;                                   /* [연도, 월, 출산, 사망] */
function key(r) { return r[0] * 12 + r[1]; }
function span(a, b) { var s = [0, 0]; M.forEach(function (r) { var k = key(r); if (k >= a && k <= b) { s[0] += r[2]; s[1] += r[3]; } }); return s; }
var K0 = 1846 * 12 + 6, K1 = 1847 * 12 + 5, K2 = 1847 * 12 + 6, K3 = 1848 * 12 + 5;
var BEF = span(K0, K1), AFT = span(K2, K3);
var RB = BEF[0] ? BEF[1] / BEF[0] * 100 : 10, RA = AFT[0] ? AFT[1] / AFT[0] * 100 : 2, FOLD = RB / RA;
var NR = N.rows;                                     /* [날짜, 군인, 병, 부상, 기타] */
var TD = NR.reduce(function (s, r) { return s + r[2]; }, 0), TW = NR.reduce(function (s, r) { return s + r[3]; }, 0), TO = NR.reduce(function (s, r) { return s + r[4]; }, 0);
var SHARE = TD + TW + TO ? TD / (TD + TW + TO) * 100 : 80;
function rate(r) { return r[1] ? r[2] / r[1] * 1000 : 0; }
var PEAK = 0; NR.forEach(function (r, i) { if (rate(r) > rate(NR[PEAK])) PEAK = i; });
var SRC1 = "<small>출처: 이그나츠 제멜바이스(1861) 『산욕열의 원인, 개념, 예방』의 표 — 빈 종합병원 산과 제1병동(의사·의대생이 아기를 받은 병동)의 달마다 출산 수와 산욕열 사망 수, 1841년 1월 ~ 1849년 3월(1841년 12월 빠짐). 위키백과(CC BY-SA)에 옮겨 적힌 값. 제멜바이스의 월별 표와 해마다 표는 출산 수를 세는 법이 달라 사망률이 조금 다르게 나옵니다. 사본은 data/semmelweis.js.</small>";
var SRC2 = "<small>출처: 플로렌스 나이팅게일(1858) — 크림 전쟁 동방 원정 영국군의 달마다 군인 수와 사망 원인(감염병 같은 ‘막을 수 있었던 병’, 부상, 기타), 1854년 4월 ~ 1856년 3월. R 패키지 HistData. 사본은 data/nightingale.js.</small>";
var MON = ["", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
function nko(d) { return d.slice(0, 4) + "년 " + (+d.slice(5, 7)) + "월"; }

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 제멜바이스와 나이팅게일이 숫자로 주장을 펼친 방법을 비교해 보세요.",
  cases: [
  {
    id: "r1", sec: "02", tag: "실제 자료 · 손 씻기", title: "손 씻기 전과 뒤, 열두 달씩", short: "손 씻기 전후",
    who: "🧼", name: "제멜바이스의 조수",
    say: "“1847년 5월 중순, 제멜바이스는 해부실에서 나온 의사와 의대생에게 <b>염소 표백 용액으로 손을 씻게</b> 했어요. 그가 남긴 <b>실제 기록</b>입니다. 손 씻기 <b>전 12달</b>(1846년 6월 ~ 1847년 5월)과 <b>뒤 12달</b>(1847년 6월 ~ 1848년 5월)의 사망률을 구해, 사망률이 <b>몇 분의 1</b>로 줄었는지 알려 주세요.”",
    predict: {
      q: "손 씻기의 효과를 보려면 어느 비교가 더 믿을 만할까요?",
      options: ["㉠ 손 씻기 바로 전 한 달과 바로 뒤 한 달", "㉡ 전과 뒤를 여러 달씩 묶어 사망률(사망 ÷ 출산)로", "㉢ 사망자 수만 비교"],
      answer: 1
    },
    task: "전 12달 사망률 ÷ 뒤 12달 사망률 을 슬라이더로 맞추세요(± 0.4).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, g = 1;
      /* 염소 소독수를 담은 세면대(입체 미니어처) */
      function basin(x, y) {
        ctx.fillStyle = "rgba(20,30,50,.2)"; ctx.beginPath(); ctx.ellipse(x + 4, y + 52, 30, 7, 0, 0, 6.2832); ctx.fill();
        bar3(ctx, x - 18, y + 8, 36, y + 50, "#a8783f", 10, 7);
        ctx.fillStyle = "#f4f6f8"; ctx.beginPath(); ctx.ellipse(x + 5, y + 2, 28, 10, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#9aa3ae"; ctx.lineWidth = 1.2; ctx.stroke();
        var wg = ctx.createLinearGradient(0, y - 4, 0, y + 8); wg.addColorStop(0, "#d3f9d8"); wg.addColorStop(1, "#63c7a8");
        ctx.fillStyle = wg; ctx.beginPath(); ctx.ellipse(x + 5, y + 3, 22, 7, 0, 0, 6.2832); ctx.fill();
        [-1, 1].forEach(function (sd) { var hx = x + 5 + sd * 8, sk = ctx.createLinearGradient(hx - 5, 0, hx + 5, 0); sk.addColorStop(0, "#d9976f"); sk.addColorStop(.5, "#f6cfae"); sk.addColorStop(1, "#cf8a62"); ctx.fillStyle = sk; ctx.beginPath(); ctx.roundRect(hx - 5, y - 24, 10, 24, 5); ctx.fill(); });
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 54, x1 = 596, y0 = 30, y1 = cv.H - 40, a = 1841 * 12 + 1, b = 1849 * 12 + 3;
        function X(k) { return x0 + (k - a) / (b - a) * (x1 - x0); }
        function Y(v) { return y1 - v / 32 * (y1 - y0); }
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.fillStyle = "rgba(90,140,255,.13)"; ctx.fillRect(X(K0 - 0.5), y0, X(K1 + 0.5) - X(K0 - 0.5), y1 - y0);
        ctx.fillStyle = "rgba(60,180,120,.15)"; ctx.fillRect(X(K2 - 0.5), y0, X(K3 + 0.5) - X(K2 - 0.5), y1 - y0);
        H.axes(ctx, x0, y0, x1, y1);
        [0, 10, 20, 30].forEach(function (v) { H.text(ctx, v + "%", x0 - 6, Y(v) + 4, { s: 10.5, w: "700", a: "right", c: H.v("--mist") }); if (v) H.dash(ctx, x0, Y(v), x1, Y(v), "rgba(20,40,90,.12)", 1); });
        for (var y = 1842; y <= 1849; y += 1) H.text(ctx, y, X(y * 12 + 1), y1 + 16, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        M.forEach(function (r) { var v = r[2] ? r[3] / r[2] * 100 : 0; bar3(ctx, X(key(r)) - 2.2, Y(v), 4.4, y1, key(r) <= K1 ? "#e03131" : "#0f9f76", 2, 2); });
        H.dash(ctx, X(K1 + 0.5), y0, X(K1 + 0.5), y1, H.v("--ink"), 1.6);
        K.pill(ctx, "1847년 5월 손 씻기 시작", X(K1) - 6, y0 + 18, { s: 11, a: "right", c: "#ffffff" });
        H.text(ctx, "그달 산모 사망률(%) — 파란 띠: 전 12달, 초록 띠: 뒤 12달", x0 + 4, y0 - 10, { s: 11, w: "800", c: H.v("--mist") });
        basin(548, 92);
        K.pill(ctx, "염소 소독수", 553, 166, { s: 11, a: "center", c: "#9ff0b5", box: [x0, x1] });
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [["전 12달 출산 · 사망", BEF[0].toLocaleString() + " · " + BEF[1]], ["뒤 12달 출산 · 사망", AFT[0].toLocaleString() + " · " + AFT[1]], ["내 답 (몇 분의 1)", g.toFixed(1) + " 분의 1", null, true]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "사망률이 몇 분의 1로 줄었나", min: 1, max: 10, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1); }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("사망률 = 사망 ÷ 출산 × 100. 1847년 초 몇 달은 손 씻기 전인데도 낮았어요 — 한두 달만 보면 잘못 판단하기 쉬운 까닭입니다. " + SRC1);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - FOLD) <= 0.4) return { ok: true, msg: "전 " + BEF[1] + " ÷ " + BEF[0].toLocaleString() + " ≈ " + RB.toFixed(1) + "%, 뒤 " + AFT[1] + " ÷ " + AFT[0].toLocaleString() + " ≈ " + RA.toFixed(1) + "% — 약 " + FOLD.toFixed(1) + " 분의 1로 줄었습니다." };
          return { ok: false, msg: g.toFixed(1) + " 는 맞지 않습니다. 두 기간의 사망률(%)을 각각 구해 나누세요." };
        }
      };
    },
    hints: ["전 12달 사망률 = " + BEF[1] + " ÷ " + BEF[0] + " × 100 ≈ " + RB.toFixed(1) + "%.", "뒤 12달 사망률 = " + AFT[1] + " ÷ " + AFT[0] + " × 100. 전 ÷ 뒤 = ?"],
    solution: "약 <b>" + FOLD.toFixed(1) + " 분의 1</b> (" + RB.toFixed(1) + "% → " + RA.toFixed(1) + "%).",
    why: "제멜바이스는 의사들이 시신을 해부한 손으로 아기를 받는 것이 산욕열의 원인이라는 가설을 세우고, 손 씻기라는 ‘처치’를 한 뒤 사망률을 비교해 가설을 시험했습니다. 사망자 수가 아니라 사망률로, 한 달이 아니라 열두 달씩 묶어 비교한 것이 중요해요 — 출산 수가 달마다 다르고, 사망률도 달마다 크게 흔들리기 때문입니다.<br>"
      + "그러나 세균이 병을 일으킨다는 것이 밝혀지기 전이라 많은 의사가 그의 주장을 받아들이지 않았고, 손 씻기가 널리 퍼진 것은 파스퇴르·리스터 이후였습니다."
  },
  {
    id: "r2", sec: "03", tag: "실제 자료 · 장미 도표", title: "장미 도표가 말한 것", short: "사망 원인",
    who: "🌹", name: "플로렌스 나이팅게일",
    say: "“크림 전쟁에 나간 영국군의 사망자를 나는 달마다, 원인별로 정리했어요. 2년 동안의 <b>실제 기록</b>으로, 전체 사망자 가운데 <b>병(감염병)으로 죽은 비율</b>을 구해 주세요.”",
    predict: {
      q: "크림 전쟁에서 가장 많은 영국 병사를 죽인 것은 무엇이었을까요?",
      options: ["㉠ 전투에서 입은 부상", "㉡ 콜레라·이질·티푸스 같은 감염병", "㉢ 추위"],
      answer: 1
    },
    task: "병으로 죽은 비율(%)을 슬라이더로 맞추세요(± 2%).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(300), ctx = cv.ctx, W = cv.W, g = 30;
      /* 나이팅게일의 등불(접는 천 등롱) */
      function lamp(x, y) {
        ctx.fillStyle = "rgba(20,30,50,.18)"; ctx.beginPath(); ctx.ellipse(x + 4, y + 36, 22, 5, 0, 0, 6.2832); ctx.fill();
        K.glow(ctx, x, y, 8, "rgba(255,196,96,.95)", 3.6);
        var cg = ctx.createLinearGradient(x - 15, 0, x + 15, 0); cg.addColorStop(0, "rgba(240,200,130,.9)"); cg.addColorStop(.5, "rgba(255,244,214,.95)"); cg.addColorStop(1, "rgba(220,170,100,.9)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(x, y, 15, 22, 0, 0, 6.2832); ctx.fill();
        var br = ctx.createLinearGradient(x - 16, 0, x + 16, 0); br.addColorStop(0, "#6a4a1a"); br.addColorStop(.5, "#f0cd80"); br.addColorStop(1, "#6a4a1a");
        ctx.fillStyle = br; ctx.fillRect(x - 13, y - 28, 26, 6); ctx.fillRect(x - 14, y + 22, 28, 6);
        ctx.strokeStyle = "#8a6424"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y - 32, 9, Math.PI, 0); ctx.stroke();
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 56, x1 = 596, y0 = 30, y1 = cv.H - 40, bw = (x1 - x0) / Math.max(1, NR.length);
        function Y(v) { return y1 - v / 3200 * (y1 - y0); }
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        H.axes(ctx, x0, y0, x1, y1);
        [0, 1000, 2000, 3000].forEach(function (v) { H.text(ctx, v.toLocaleString(), x0 - 6, Y(v) + 4, { s: 10.5, w: "700", a: "right", c: H.v("--mist") }); if (v) H.dash(ctx, x0, Y(v), x1, Y(v), "rgba(20,40,90,.12)", 1); });
        NR.forEach(function (r, i) {
          var x = x0 + i * bw + 3, a = Y(r[2]), b = Y(r[2] + r[3]), c = Y(r[2] + r[3] + r[4]);
          bar3(ctx, x, c, bw - 9, b, "#868e96", 4, 3); bar3(ctx, x, b, bw - 9, a, "#e03131", 4, 3); bar3(ctx, x, a, bw - 9, y1, "#1c7ed6", 4, 3);
          if (r[0].slice(5, 7) === "01" || i === 0) H.text(ctx, r[0].slice(0, 7), x + bw / 2, y1 + 16, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "달마다 사망자 — 파랑: 병, 빨강: 부상, 회색: 기타", x0 + 4, y0 - 10, { s: 11, w: "800", c: H.v("--mist") });
        lamp(560, 82);
        K.pill(ctx, "나이팅게일의 등불", 560, 140, { s: 11, a: "center", c: "#ffd8a8", box: [x0, x1] });
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [["병", TD.toLocaleString() + " 명", "--brand"], ["부상", TW.toLocaleString() + " 명", "--rose-700"], ["기타", TO.toLocaleString() + " 명"], ["내 답 (병의 비율)", g + "%", null, true]], 56);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "병으로 죽은 비율", min: 0, max: 100, step: 1, value: 30, fmt: function (x) { return x + "%"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("나이팅게일은 같은 자료를 부채꼴을 둘러 그린 ‘장미 도표’로 그려, 숫자에 익숙하지 않은 정치가들도 한눈에 알아보게 했습니다. " + SRC2
        + "<div data-map='{\"id\":\"scutari\",\"name\":\"셀리미예 병영 — 옛 스쿠타리 병원 (튀르키예 이스탄불)\",\"lat\":41.0036,\"lng\":29.0157,\"zoom\":16,\"ask\":\"나이팅게일이 일한 스쿠타리 병원 건물을 찾아보세요. 건물 모양과 바다와의 거리를 보고, 많은 환자를 한곳에 모았을 때 위생에서 어떤 점이 문제였을지 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - SHARE) <= 2) return { ok: true, msg: TD.toLocaleString() + " ÷ " + (TD + TW + TO).toLocaleString() + " ≈ " + SHARE.toFixed(1) + "% — 다섯 명 가운데 네 명이 부상이 아니라 막을 수 있었던 병으로 죽었습니다." };
          return { ok: false, msg: g + "%는 " + (g < SHARE ? "작습니다" : "큽니다") + ". 병 ÷ (병 + 부상 + 기타) × 100." };
        }
      };
    },
    hints: ["전체 = " + TD + " + " + TW + " + " + TO + " = " + (TD + TW + TO) + " 명.", TD + " ÷ " + (TD + TW + TO) + " × 100 ≈ ?"],
    solution: "약 <b>" + Math.round(SHARE) + "%</b>.",
    why: "나이팅게일은 간호사이면서 통계학자였습니다. 그는 사망 원인을 꼼꼼히 세어 대부분이 더러운 병원 환경에서 생긴 병이라는 것을 보이고, 정부를 설득해 위생 개혁을 이끌었습니다. 같은 사실도 숫자와 그림으로 보여 줄 때 힘을 얻는다는 것을 보여 준 사례입니다.<br>"
      + "그는 영국 왕립 통계학회(당시 런던 통계학회, 1858년)의 첫 여성 회원이 되었고, 그의 도표는 오늘날 ‘데이터 시각화’의 고전으로 꼽힙니다."
  },
  {
    id: "r3", sec: "03", tag: "실제 자료 · 위생 개혁", title: "병사가 가장 많이 죽은 달과 그 뒤", short: "가장 나쁜 달",
    who: "📈", name: "위생 위원회 조사관",
    say: "“군인 수가 달마다 달라서, 사망자 수보다 <b>군인 1000명 가운데 한 달에 병으로 죽은 사람</b>으로 봐야 공정해요. 이 값이 <b>가장 높았던 달</b>을 찾고, 그 뒤 크게 줄어든 <b>까닭</b>을 골라 주세요. 1855년 3월, 정부가 보낸 위생 위원회가 병원에 도착했습니다.”",
    predict: {
      q: "군인 수가 달마다 다를 때, 사망자 수를 그대로 비교하면 어떤 문제가 있을까요?",
      options: ["㉠ 문제없다", "㉡ 군인이 많은 달은 사망자도 많아 보여, 위험의 크기를 잘못 읽는다", "㉢ 사망자 수가 늘 더 정확하다"],
      answer: 1
    },
    task: "1000명당 병 사망이 가장 높은 달을 고르고, 그 뒤 줄어든 까닭을 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, i = 0, why = "none";
      /* 위생 위원회가 고친 막사 병원 미니어처: 환기창과 깨끗한 물통, 바닥 아래 하수관 */
      var IB = K.iso({ ox: 520, oy: 58, s: 0.62, L: 90, D: 60 });
      function barrack() {
        IB.box(ctx, -6, -6, -8, 96, 66, 0, "#a29580", "#857a68", "#6e6555");
        var p0 = IB.P(0, 66, -4), p1 = IB.P(90, 66, -4); ctx.strokeStyle = "#5c7086"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        IB.house(ctx, 6, 8, 0, 74, 46, 30, "#8d6e63");
        [16, 36, 56].forEach(function (x) { var a = IB.P(x, 54, 14), b = IB.P(x + 10, 54, 14), c = IB.P(x + 10, 54, 24), d = IB.P(x, 54, 24); IB.quad(ctx, a, b, c, d, "#9fd3f5", "#6e4626"); });
        var w = IB.P(88, 30, 0); ctx.fillStyle = "#4dabf7"; ctx.beginPath(); ctx.ellipse(w.x, w.y - 6, 5, 2, 0, 0, 6.2832); ctx.fill(); bar3(ctx, w.x - 5, w.y - 6, 10, w.y + 2, "#868e96", 3, 2);
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 56, x1 = 596, y0 = 30, y1 = cv.H - 40;
        function X(j) { return x0 + (j + 0.5) / Math.max(1, NR.length) * (x1 - x0); }
        function Y(v) { return y1 - v / 100 * (y1 - y0); }
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        H.axes(ctx, x0, y0, x1, y1);
        [0, 50, 100].forEach(function (v) { H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10.5, w: "700", a: "right", c: H.v("--mist") }); if (v) H.dash(ctx, x0, Y(v), x1, Y(v), "rgba(20,40,90,.12)", 1); });
        NR.forEach(function (r, j) { if (r[0].slice(5, 7) === "01" || j === 0) H.text(ctx, r[0].slice(0, 7), X(j), y1 + 16, { s: 10.5, w: "700", a: "center", c: H.v("--mist") }); });
        barrack();
        K.plot(ctx, { X: function (j) { return X(j); }, Y: Y }, NR.map(function (r, j) { return [j, rate(r)]; }), LT.blue, { w: 2.8, light: true });
        K.plot(ctx, { X: function (j) { return X(j); }, Y: Y }, NR.map(function (r, j) { return [j, r[1] ? r[3] / r[1] * 1000 : 0]; }), LT.red, { w: 2.2, light: true });
        ctx.strokeStyle = "rgba(245,159,0,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(i), y0); ctx.lineTo(X(i), y1); ctx.stroke();
        K.planet(ctx, X(i), Y(rate(NR[i] || [0, 1, 0])), 7, "#ffd36b", "#a8781f");
        H.text(ctx, "군인 1000명당 한 달 사망 — 파랑: 병, 빨강: 부상", x0 + 4, y0 - 10, { s: 11, w: "800", c: H.v("--mist") });
        var r = NR[i] || ["1854-04", 1, 0, 0];
        card(H, ctx, 616, 12, 272, cv.H - 24, "판정", [["고른 달", nko(r[0]), "--amber-700"], ["군인 · 병 사망", r[1].toLocaleString() + " · " + r[2].toLocaleString()], ["1000명당 병 사망", rate(r).toFixed(1) + " 명", null, true]], 66);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "달", min: 0, max: Math.max(0, NR.length - 1), step: 1, value: 0, fmt: function (x) { return NR[x] ? nko(NR[x][0]) : ""; }, onInput: function (x) { i = x; api.changed(); draw(); } });
      api.seg({ label: "그 뒤 줄어든 까닭", value: "none", options: [{ v: "san", t: "위생 위원회가 하수도·환기·물을 고쳐서" }, { v: "war", t: "전투가 끝나 부상자가 줄어서" }, { v: "few", t: "군인 수가 줄어서" }], onPick: function (x) { why = x; api.changed(); } });
      api.info("빨간 선(부상 사망)도 함께 보세요. " + SRC2);
      draw();
      return {
        judge: function () {
          if (i !== PEAK) return { ok: false, msg: (NR[i] ? nko(NR[i][0]) : "") + "은 " + (NR[i] ? rate(NR[i]).toFixed(1) : 0) + " 명입니다. 더 높은 달이 있습니다." };
          if (why !== "san") return { ok: false, msg: "달은 맞았습니다. " + (why === "war" ? "빨간 선을 보세요 — 부상 사망은 1855년 6월·9월에 오히려 늘었습니다. 전투는 계속되었습니다." : why === "few" ? "오른쪽 표를 보세요 — 그 뒤 군인 수는 오히려 늘었습니다." : "까닭을 골라 주세요.") };
          var last = NR[NR.length - 1];
          return { ok: true, msg: nko(NR[PEAK][0]) + " " + rate(NR[PEAK]).toFixed(1) + " 명 — 한 달에 군인 열두 명 가운데 한 명꼴로 병으로 죽었습니다. 위생 위원회가 온 뒤 줄어 " + nko(last[0]) + "에는 " + rate(last).toFixed(1) + " 명이 되었어요." };
        }
      };
    },
    hints: ["파란 선의 가장 높은 곳으로 달을 옮기세요.", "그 뒤 빨간 선(부상)과 군인 수가 어떻게 되었는지 보세요."],
    solution: "<b>" + (NR[PEAK] ? nko(NR[PEAK][0]) : "1855년 1월") + "</b>, 위생 위원회의 개혁 뒤로 줄었다.",
    why: "위생 위원회는 병원 밑의 막힌 하수도를 뚫고, 환기를 고치고, 물을 깨끗이 하고, 죽은 동물을 치웠습니다. 그 뒤 병으로 죽는 군인이 크게 줄었습니다. 같은 시기 전투는 계속되어 부상 사망은 줄지 않았으므로, ‘전쟁이 끝나서’는 설명이 되지 못합니다.<br>"
      + "나이팅게일은 이렇게 ‘비율’로 비교하고 다른 설명을 하나씩 지워 가며, 위생이 생명을 구한다는 주장을 숫자로 뒷받침했습니다. 다만 사망률은 위원회가 오기 전인 1855년 2월부터 이미 줄기 시작했으니, 보급·막사 개선이나 날씨가 풀린 것도 한몫했을 수 있습니다. 그래도 이듬해 겨울(1855~1856)에는 다시 늘지 않았습니다."
  }
  ]
});
})();
