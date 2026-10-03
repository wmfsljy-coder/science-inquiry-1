/* 과학탐구실험1 Ⅰ-3 역사 속의 과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 진자시계 */
  {
    id: "c1", tag: "갈릴레이의 또 다른 발견 · 변인을 하나씩", title: "성당의 샹들리에와 진자시계", short: "진자시계",
    who: "🕰️", name: "시계 장인",
    say: "“갈릴레이는 성당에서 흔들리는 샹들리에를 맥박으로 재어 보고 진자의 성질을 알아냈다고 전해져요(제자 비비아니의 기록). 흔드는 폭이 작으면 한 번 왕복하는 시간이 거의 같다는 성질로 진자시계를 만들려고 합니다. 한 번 왕복에 <b>정확히 2초</b>(± 0.02초)가 걸리는 진자를 만들어 주세요. 추의 무게, 흔드는 폭, 실의 길이 가운데 무엇이 시간을 정하는지부터 알아내야겠지요.”",
    predict: {
      q: "추를 두 배 무거운 것으로 바꾸면 진자가 한 번 왕복하는 시간은?",
      options: ["㉠ 길어진다", "㉡ 짧아진다", "㉢ 변하지 않는다"],
      answer: 2
    },
    task: "추·흔드는 폭·실의 길이를 정해 <b>왕복 시간 2.00 ± 0.02 초</b>인 진자를 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W;
      var L = 0.5, mass = "light", amp = 10;
      function T() { var th = amp * Math.PI / 180; return 2 * Math.PI * Math.sqrt(L / 9.8) * (1 + th * th / 16); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var px = 250, py = 24, len = 40 + L * 105, th = amp * Math.PI / 180;
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + len); ctx.stroke(); ctx.restore();
        H.box(ctx, px - 60, py - 8, 120, 8, H.v("--ink"), 0.8);
        [-1, 1].forEach(function (sg) {
          var bx = px + Math.sin(sg * th) * len, by = py + Math.cos(th) * len;
          H.line(ctx, [[px, py], [bx, by]], H.v(sg > 0 ? "--ink" : "--line"), 2);
          H.dot(ctx, bx, by, mass === "heavy" ? 14 : 9, H.v(sg > 0 ? (mass === "heavy" ? "--ink" : "--amber-700") : "--line"));
        });
        H.text(ctx, "실 " + L.toFixed(2) + " m · 폭 " + amp + "°", 30, 40, { s: 12, w: "800" });
        var t = T(), ok = Math.abs(t - 2) <= 0.02;
        H.rows(ctx, 560, 56, [
          ["한 번 왕복하는 시간", t.toFixed(3) + " 초", ok ? "--green-700" : "--rose-700", true],
          ["추", mass === "heavy" ? "무거운 추 (200 g)" : "가벼운 추 (50 g)"],
          ["목표", "2.00 ± 0.02 초"]
        ], 64);
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
    solution: "실의 길이 <b>약 1 m</b> (1.00 m 에서 흔드는 폭 5 ~ 15°, 추는 아무것이나). 0.95 m·30° 처럼 큰 폭으로 맞추는 것도 되지만 정석은 아닙니다.",
    why: "진자의 왕복 시간은 추의 무게와 상관없고, 폭이 작을 때는 폭과도 거의 상관없이 <b>실의 길이</b>로 정해집니다(T = 2π√(L/g)). 갈릴레이가 1580년대에 발견했다고 전해지는(1602년 편지에 기록) 이 ‘진자의 등시성’으로 1656년 하위헌스가 진자시계를 만들어, 하루 오차가 15분에서 15초로 줄었습니다.<br>" +
      "한 번에 한 변인만 바꾸며 시간을 재야 무엇이 원인인지 가릴 수 있습니다. 빗면 실험과 같은 방법이지요. 정확한 시계는 다시 더 정밀한 실험을 가능하게 했습니다. ※ 폭에 따른 보정은 근삿값입니다."
  },

  /* ------------------------------------------------------------------ 2. 에라토스테네스 */
  {
    id: "c2", tag: "역사 속 측정 · 그림자로 지구를 재다", title: "막대기 하나로 잰 지구 둘레", short: "지구 둘레",
    who: "📐", name: "알렉산드리아 도서관장 에라토스테네스",
    say: "“하짓날 정오, 남쪽 도시 시에네에서는 깊은 우물 바닥까지 햇빛이 비쳐 막대의 그림자가 없어요. 같은 날 알렉산드리아에서는 막대의 그림자가 7.2° 기울어집니다. 두 도시 사이는 낙타 대상으로 <b>50일</b>, 하루에 <b>16 km</b> 쯤 갑니다. 재는 때와 거리를 정해 지구 둘레를 <b>40 000 km 의 ± 5%</b> 안으로 구해 주세요.”",
    predict: {
      q: "만약 지구가 평평하고 태양이 아주 멀리 있다면, 같은 시각 두 도시의 막대 그림자는 어떨까요?",
      options: ["㉠ 두 도시에서 그림자 각도가 같다", "㉡ 북쪽 도시의 그림자가 더 기울어진다", "㉢ 남쪽 도시의 그림자가 더 기울어진다"],
      answer: 0
    },
    task: "재는 때와 두 도시 사이의 거리를 정해 <b>지구 둘레 38 000 ~ 42 000 km</b> 를 구하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W;
      var when = "pm", dist = 600;
      function ang() { return when === "noon" ? 7.2 : 7.2 + 30; }   /* 오후 3시에 재면 태양이 기울어 각도가 달라진다 */
      function circ() { return dist * 360 / ang(); }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 250, cy = 330, R = 250;
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore();
        var aS = -Math.PI / 2, aA = -Math.PI / 2 - 0.35;
        [[aS, "시에네", 0], [aA, "알렉산드리아", 1]].forEach(function (c) {
          var x = cx + Math.cos(c[0]) * R, y = cy + Math.sin(c[0]) * R, tx = cx + Math.cos(c[0]) * (R + 40), ty = cy + Math.sin(c[0]) * (R + 40);
          H.line(ctx, [[x, y], [tx, ty]], H.v("--ink"), 3);
          H.text(ctx, c[1], tx, ty - 10, { s: 11.5, w: "800", a: "center" });
        });
        for (var i = 0; i < 4; i++) H.arrow(ctx, 330 + i * 40, 8, 330 + i * 40, 70, H.v("--amber-700"), 1.5, 6);
        H.text(ctx, "☀ 햇빛 (평행)", 490, 40, { s: 11, w: "800", c: H.v("--amber-700") });
        var c = circ(), ok = when === "noon" && c >= 38000 && c <= 42000;
        H.rows(ctx, 600, 54, [
          ["알렉산드리아 그림자 각도", ang().toFixed(1) + "°" + (when === "noon" ? "" : " (정오가 아니라 태양 높이가 다름)"), when === "noon" ? null : "--rose-700"],
          ["두 도시 사이 거리", dist + " km"],
          ["지구 둘레 = 거리 × 360 ÷ 각도", Math.round(c).toLocaleString() + " km", ok ? "--green-700" : "--rose-700", true]
        ], 66);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "재는 때", value: "pm", options: [{ v: "pm", t: "알렉산드리아만 오후 3시에" }, { v: "noon", t: "두 도시 모두 하짓날 정오에" }], onPick: function (x) { when = x; draw(); } });
      api.slider({ label: "두 도시 사이 거리", min: 400, max: 1200, step: 50, value: 600, fmt: function (x) { return x + " km"; }, onInput: function (x) { dist = x; draw(); } });
      api.info("햇빛은 아주 멀리서 오므로 나란히 들어옵니다. 두 도시의 그림자 각도 차이가 곧 두 도시가 지구 중심에서 벌어진 각도예요.");
      draw();
      return {
        judge: function () {
          if (when !== "noon") return { ok: false, msg: "재는 시각이 다르면 태양의 높이가 달라져, 각도 차이가 지구가 둥근 정도만 나타내지 않습니다. 같은 때 재야 해요." };
          var c = circ();
          if (c < 38000 || c > 42000) return { ok: false, msg: "지구 둘레 " + Math.round(c).toLocaleString() + " km. 낙타 대상의 날수와 하루 거리로 두 도시 사이를 다시 계산해 보세요." };
          return { ok: true, msg: "거리 " + dist + " km × 360 ÷ 7.2 = " + Math.round(c).toLocaleString() + " km. 오늘날 값(약 40 000 km)과 거의 같습니다." };
        }
      };
    },
    hints: [
      "재는 시각은 두 도시가 같아야 합니다. 시에네의 그림자가 0 인 하짓날 정오가 기준이에요.",
      "거리 = 50일 × 16 km = 800 km. 각도 7.2° 는 한 바퀴(360°)의 50분의 1 입니다."
    ],
    solution: "<b>두 도시 모두 하짓날 정오</b>, 거리 <b>800 km</b> → 40 000 km.",
    why: "기원전 240년쯤 에라토스테네스는 ‘지구가 둥글고 햇빛은 나란하다’는 가정 아래, 두 도시의 그림자 각도 차이와 거리만으로 지구 둘레를 계산했습니다. 평평한 지구라면 두 도시의 그림자가 같아야 하니, 다른 그림자는 지구가 둥글다는 증거이기도 했지요.<br>" +
      "정확한 결과를 얻으려면 같은 때에 같은 방법으로 재야 하고, 거리를 재는 단위(스타디아)도 정해져 있어야 했습니다. 그가 쓴 스타디아의 정확한 길이는 지금도 논란이 있어, 실제 오차가 얼마였는지는 분명하지 않습니다."
  },

  /* ------------------------------------------------------------------ 3. 화성 기후 궤도선 */
  {
    id: "c3", tag: "표준 단위 · 단위가 섞이면", title: "화성 궤도선은 왜 사라졌을까", short: "단위 혼동",
    who: "🛰️", name: "우주 항법 팀",
    say: "“1999년 화성 기후 궤도선이 화성에 너무 가까이 들어가 사라졌어요. 조사해 보니 한 회사가 만든 추진 자료는 <b>파운드힘·초(lbf·s)</b>였는데, 항법 프로그램은 이 값을 <b>뉴턴·초(N·s)</b>로 알고 계산했습니다. 자료를 바르게 환산해, 궤도선이 계획대로 화성 위 <b>150 km 근처(145 km 이상)</b>를 지나게 해 주세요.”",
    predict: {
      q: "1 파운드힘(lbf)은 약 몇 뉴턴(N)일까요?",
      options: ["㉠ 약 0.45 N", "㉡ 약 4.45 N", "㉢ 약 9.8 N", "㉣ 정확히 1 N"],
      answer: 1
    },
    task: "추진 자료의 처리 방법과 환산 계수를 정해 <b>화성 위 145 km 이상</b>을 지나게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W;
      var mode = "raw", f = 1, K = 4.448;
      function used() { return mode === "raw" ? 1 : f; }
      function alt() { return 150 - 120 * Math.abs(K - used()) / K; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 260, cy = 150, R = 80, a = alt();
        H.dot(ctx, cx, cy, R, "#c1440e");
        ctx.save(); ctx.strokeStyle = "rgba(193,68,14,0.45)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, R + 80 * 0.35, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        H.text(ctx, "대기 (약 80 km)", cx + R + 40, cy + 4, { s: 10.5, w: "700", c: H.v("--mist") });
        var r2 = R + Math.max(4, a) * 0.35, ok = a >= 145, ye = cy - r2 + 70;
        ctx.save(); ctx.strokeStyle = H.v(ok ? "--green-700" : (a < 80 ? "--rose-700" : "--amber-700")); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(cx - 240, ye); ctx.quadraticCurveTo(cx, 2 * (cy - r2) - ye, cx + 240, ye); ctx.stroke(); ctx.restore();
        H.text(ctx, "🛰️", cx - 170, ye - 22, { s: 20, a: "center" });
        H.rows(ctx, 580, 54, [
          ["항법이 쓴 값", mode === "raw" ? "lbf·s 숫자를 그대로 N·s 로" : "lbf·s × " + f.toFixed(2)],
          ["화성 위 가장 가까운 높이", a.toFixed(0) + " km", ok ? "--green-700" : "--rose-700", true],
          ["결과", ok ? "계획대로 궤도 진입" : (a < 80 ? "대기에 부딪혀 사라짐" : "너무 낮다 — 위험"), ok ? "--green-700" : "--rose-700"]
        ], 64);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "추진 자료 처리", value: "raw", options: [{ v: "raw", t: "숫자를 그대로 쓴다" }, { v: "conv", t: "N·s 로 환산해 쓴다" }], onPick: function (x) { mode = x; draw(); } });
      api.slider({ label: "환산 계수 (1 lbf·s = ? N·s)", min: 1, max: 6, step: 0.05, value: 1, fmt: function (x) { return x.toFixed(2); }, onInput: function (x) { f = x; draw(); } });
      api.info("추진 자료를 실제보다 작게 읽으면, 항법 팀은 작은 궤도 수정이 많이 쌓인 효과를 놓쳐 궤도선이 점점 화성 쪽으로 파고드는 것을 알아채지 못합니다.");
      draw();
      return {
        judge: function () {
          var a = alt();
          if (mode === "raw") return { ok: false, msg: "숫자를 그대로 쓰면 추진 효과를 4.45분의 1 로 읽어, 궤도선이 화성 위 " + a.toFixed(0) + " km 까지 내려가 대기에 부딪힙니다. 실제 사고가 이랬어요." };
          if (a < 145) return { ok: false, msg: "환산 계수 " + f.toFixed(2) + " → 화성 위 " + a.toFixed(0) + " km. 1 lbf 가 몇 N 인지 다시 생각해 보세요." };
          return { ok: true, msg: "1 lbf·s = " + f.toFixed(2) + " N·s 로 환산 → 화성 위 " + a.toFixed(0) + " km. 단위만 맞췄을 뿐인데 1억 2500만 달러짜리 궤도선을 지켰습니다." };
        }
      };
    },
    hints: [
      "먼저 ‘환산해 쓴다’를 고르세요. 숫자를 그대로 쓰면 단위가 섞입니다.",
      "1 lbf 는 약 0.4536 kg 의 물체에 작용하는 중력, 곧 0.4536 × 9.8 ≈ 4.45 N 입니다."
    ],
    solution: "<b>N·s 로 환산</b>, 환산 계수 <b>4.30 ~ 4.60</b> (정확한 값 4.448).",
    why: "1999년 9월 화성 기후 궤도선은 화성 위 약 150 km 를 지나도록 계획되었지만, 실제로는 약 57 km 까지 내려가 사라졌습니다. 한 팀은 영국식 단위(파운드힘), 다른 팀은 국제단위계(뉴턴)를 썼기 때문입니다.<br>" +
      "여러 사람이 함께 만드는 과학과 기술에서는 모두가 <b>같은 단위와 기준</b>을 써야 자료를 이어 붙일 수 있습니다. 측우기와 주척을 전국에 나누어 준 까닭, 국제단위계가 필요한 까닭이 여기에 있습니다. ※ 궤도 높이 계산은 수업용으로 단순화했습니다."
  }
  ]
});
})();
