/* 과학탐구실험1 Ⅰ 탐구 방법과 절차 — 실제 자료
   r1 손 씻기 전과 뒤, 열두 달씩 — 빈 종합병원 제1병동의 달마다 산모 사망(1841~1849)
   r2 장미 도표가 말한 것 — 크림 전쟁 영국군 사망 원인(1854~1856)
   r3 병사가 가장 많이 죽은 달과 그 뒤 — 군인 1000명당 한 달 병 사망
   자료: data/semmelweis.js (제멜바이스 1861), data/nightingale.js (나이팅게일 1858) */
(function () {
"use strict";
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
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 50, x1 = 600, y0 = 26, y1 = cv.H - 40, a = 1841 * 12 + 1, b = 1849 * 12 + 3;
        function X(k) { return x0 + (k - a) / (b - a) * (x1 - x0); }
        function Y(v) { return y1 - v / 32 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        ctx.fillStyle = "rgba(90,140,255,.12)"; ctx.fillRect(X(K0 - 0.5), y0, X(K1 + 0.5) - X(K0 - 0.5), y1 - y0);
        ctx.fillStyle = "rgba(60,180,120,.14)"; ctx.fillRect(X(K2 - 0.5), y0, X(K3 + 0.5) - X(K2 - 0.5), y1 - y0);
        [0, 10, 20, 30].forEach(function (v) { H.text(ctx, v + "%", x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        for (var y = 1842; y <= 1849; y += 1) H.text(ctx, y, X(y * 12 + 1), y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
        M.forEach(function (r) { var v = r[2] ? r[3] / r[2] * 100 : 0; H.box(ctx, X(key(r)) - 2, Y(v), 4, y1 - Y(v), key(r) <= K1 ? H.v("--rose-700") : H.v("--green-700"), 0.85); });
        H.dash(ctx, X(K1 + 0.5), y0, X(K1 + 0.5), y1, H.v("--ink"), 1.4);
        H.text(ctx, "1847년 5월 손 씻기 시작", X(K1) - 6, y0 + 4, { s: 10.5, w: "800", a: "right" });
        H.text(ctx, "그달 산모 사망률(%) — 파란 띠: 전 12달, 초록 띠: 뒤 12달", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 640, 30, [["전 12달 출산 · 사망", BEF[0].toLocaleString() + " · " + BEF[1]], ["뒤 12달 출산 · 사망", AFT[0].toLocaleString() + " · " + AFT[1]], ["내 답 (몇 분의 1)", g.toFixed(1) + " 분의 1", null, true]], 62);
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
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, g = 30;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 50, x1 = 600, y0 = 26, y1 = cv.H - 40, bw = (x1 - x0) / Math.max(1, NR.length);
        function Y(v) { return y1 - v / 3200 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [0, 1000, 2000, 3000].forEach(function (v) { H.text(ctx, v.toLocaleString(), x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        NR.forEach(function (r, i) {
          var x = x0 + i * bw + 2, a = Y(r[2]), b = Y(r[2] + r[3]), c = Y(r[2] + r[3] + r[4]);
          H.box(ctx, x, a, bw - 4, y1 - a, H.v("--brand"), 0.85); H.box(ctx, x, b, bw - 4, a - b, H.v("--rose-700"), 0.85); H.box(ctx, x, c, bw - 4, b - c, H.v("--mist"), 0.7);
          if (r[0].slice(5, 7) === "01" || i === 0) H.text(ctx, r[0].slice(0, 7), x + bw / 2, y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "달마다 사망자 — 파랑: 병, 빨강: 부상, 회색: 기타", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 640, 30, [["병", TD.toLocaleString() + " 명"], ["부상", TW.toLocaleString() + " 명"], ["기타", TO.toLocaleString() + " 명"], ["내 답 (병의 비율)", g + "%", null, true]], 54);
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
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, i = 0, why = "none";
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 50, x1 = 600, y0 = 26, y1 = cv.H - 40;
        function X(j) { return x0 + (j + 0.5) / Math.max(1, NR.length) * (x1 - x0); }
        function Y(v) { return y1 - v / 100 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [0, 50, 100].forEach(function (v) { H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        NR.forEach(function (r, j) { if (r[0].slice(5, 7) === "01" || j === 0) H.text(ctx, r[0].slice(0, 7), X(j), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
        H.line(ctx, NR.map(function (r, j) { return [X(j), Y(rate(r))]; }), H.v("--brand"), 2.5);
        H.line(ctx, NR.map(function (r, j) { return [X(j), Y(r[1] ? r[3] / r[1] * 1000 : 0)]; }), H.v("--rose-700"), 2);
        H.dot(ctx, X(i), Y(rate(NR[i] || [0, 1, 0])), 6, H.v("--amber-700"));
        H.text(ctx, "군인 1000명당 한 달 사망 — 파랑: 병, 빨강: 부상", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        var r = NR[i] || ["1854-04", 1, 0, 0];
        H.rows(ctx, 640, 40, [["고른 달", nko(r[0]), "--amber-700"], ["군인 · 병 사망", r[1].toLocaleString() + " · " + r[2].toLocaleString()], ["1000명당 병 사망", rate(r).toFixed(1) + " 명", null, true]], 60);
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
