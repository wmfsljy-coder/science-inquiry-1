/* 과학탐구실험1 Ⅰ 역사 속의 과학 탐구 — 실제 자료
   r1 멘델레예프의 빈칸 — 이웃 원소로 게르마늄(에카규소)의 원자량과 밀도를 예측하기
   r2 서울의 비는 언제 내리나 — 달마다 내린 비의 평균(1981~2024)
   자료: data/elements.js (PubChem 주기율표), data/seoul-rain.js (NASA POWER) */
(function () {
"use strict";
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

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 ‘예측하고 확인하는’ 과학 탐구와 ‘꾸준히 재는’ 과학 탐구를 비교해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 주기율표", title: "멘델레예프의 빈칸", short: "에카규소",
    who: "🧪", name: "멘델레예프의 실험실",
    say: "“1871년 나는 주기율표에 빈칸을 남기고, 규소 아래에 올 원소 ‘에카규소’의 성질을 예측했어요. 빈칸 둘레 네 원소(위·아래·왼쪽·오른쪽)의 <b>실제 값</b>입니다. 네 이웃의 평균으로 빈칸 원소의 <b>원자량</b>과 <b>밀도</b>를 예측해 주세요. (1871년에는 왼쪽 갈륨 자리도 아직 빈칸이었어요. 여기서는 오늘날의 주기율표 값으로 해 봅니다.)”",
    predict: {
      q: "주기율표에서 빈칸 원소의 성질을 예측할 수 있는 까닭은 무엇일까요?",
      options: ["㉠ 원소의 성질이 아무렇게나 바뀌어서", "㉡ 원소의 성질이 주기적으로 되풀이되어, 이웃 원소 사이의 값을 갖기 쉬워서", "㉢ 모든 원소의 성질이 같아서"],
      answer: 1
    },
    task: "원자량(± 0.5)과 밀도(± 0.15 g/cm³)를 슬라이더로 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, m = 60, d = 3;
      function cell(e, x, y, q) {
        ctx.save(); ctx.strokeStyle = q ? H.v("--amber-700") : H.v("--line"); ctx.lineWidth = q ? 3 : 1.5; ctx.strokeRect(x, y, 110, 78); ctx.restore();
        H.text(ctx, q ? "?" : e[0], x + 55, y + 32, { s: 22, w: "900", a: "center", c: q ? H.v("--amber-700") : H.v("--ink") });
        H.text(ctx, q ? "원자량 " + m.toFixed(1) : "원자량 " + e[3].toFixed(2), x + 55, y + 52, { s: 10.5, a: "center", c: H.v("--mist") });
        H.text(ctx, q ? "밀도 " + d.toFixed(2) : "밀도 " + e[4].toFixed(2), x + 55, y + 68, { s: 10.5, a: "center", c: H.v("--mist") });
      }
      function draw() {
        H.paper(ctx, W, cv.H);
        cell(NB[0], 150, 14, false); cell(NB[2], 30, 98, false); cell(GE, 150, 98, true); cell(NB[3], 270, 98, false); cell(NB[1], 150, 182, false);
        H.rows(ctx, 450, 40, [["내 예측 원자량", m.toFixed(1), null, true], ["내 예측 밀도", d.toFixed(2) + " g/cm³", null, true]], 70);
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
    id: "r2", tag: "실제 자료 · 강수량", title: "서울의 비는 언제 내리나", short: "여름 비",
    who: "☔", name: "측우기 관측관",
    say: "“세종 때(1441년) 만든 측우기로 우리 조상은 비의 양을 꾸준히 재었어요. 오늘날 위성과 관측을 합친 <b>서울의 달마다 내린 비</b>를 44년 평균으로 보여 드립니다. 한 해 비 가운데 <b>여름(6~8월)</b>에 내리는 비는 <b>몇 %</b>일까요?”",
    predict: {
      q: "우리나라에서 한 해 가운데 비가 가장 많이 내리는 계절은 언제일까요?",
      options: ["㉠ 봄", "㉡ 여름 — 장마와 태풍", "㉢ 겨울"],
      answer: 1
    },
    task: "6~8월 비의 비율(%)을 슬라이더로 맞추세요(± 2%).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, g = 25;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 560, y0 = 30, y1 = cv.H - 40, bw = (x1 - x0) / 12, mx = Math.max.apply(null, MAVG) * 1.12 || 1;
        function Y(v) { return y1 - v / mx * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [0, 100, 200, 300].forEach(function (v) { if (v < mx) H.text(ctx, v, x0 - 6, Y(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        MAVG.forEach(function (v, i) {
          H.box(ctx, x0 + i * bw + 4, Y(v), bw - 8, y1 - Y(v), i >= 5 && i <= 7 ? H.v("--brand") : H.v("--mist"), 0.85);
          H.text(ctx, Math.round(v), x0 + i * bw + bw / 2, Y(v) - 5, { s: 10, a: "center", c: H.v("--mist") });
          H.text(ctx, (i + 1) + "월", x0 + i * bw + bw / 2, y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
        });
        H.text(ctx, "달마다 내린 비의 평균 (mm)", x0 + 6, y0 - 12, { s: 11, w: "700", c: H.v("--mist") });
        H.rows(ctx, 600, 40, [["한 해 합", Math.round(TOT).toLocaleString() + " mm"], ["6~8월 합", Math.round(SUM).toLocaleString() + " mm"], ["내 답 (여름 비율)", g + "%", null, true]], 62);
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
  }
  ]
});
})();
