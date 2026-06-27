const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");
const detailBtn = document.getElementById("detailBtn");
const closeFormulaBtn = document.getElementById("closeFormulaBtn");
const resultCard = document.getElementById("resultCard");
const formulaModal = document.getElementById("formulaModal");

function formatAmount(amount) {
  return new Intl.NumberFormat("zh-TW").format(Math.round(amount));
}

function computeEstimate() {
  const insuredAge = Number(document.getElementById("insuredAge").value) || 35;
  const currentAge = Number(document.getElementById("currentAge").value) || 40;
  const gender = document.getElementById("gender").value;
  const insuranceType = document.getElementById("insuranceType").value;
  const insuranceProduct = document.getElementById("insuranceProduct").value;
  const coverageAmount = Number(document.getElementById("coverageAmount").value) || 100000;
  const eventDescription = document.getElementById("eventDescription").value;

  // 計算基本參數
  const yearsInForce = currentAge - insuredAge; // 保單年度
  const policyYear = Math.max(1, yearsInForce);
  const annualPremium = calculateAnnualPremium(insuredAge, gender, insuranceType);
  const reserveAmount = coverageAmount * 0.3; // 假設保單價值準備金
  const thresholdRatio = getThresholdRatio(currentAge); // 依年齡查表
  const annualAmountCoefficient = getAnnualAmountCoefficient(policyYear); // 附表三查表取得係數

  // 三項計算方式
  const calc1 = coverageAmount * 1.01; // 年繳應繳保險費總額的1.01倍
  const calc2 = reserveAmount * thresholdRatio; // 保單價值準備金 × 門檻比率
  const calc3 = (coverageAmount / 10000) * annualAmountCoefficient; // 當年度保險金額

  // 取最大值
  const maxPayment = Math.max(calc1, calc2, calc3);

  // 更新結果顯示
  document.getElementById("resultProduct").textContent = insuranceProduct;
  document.getElementById("calc1").textContent = formatAmount(calc1);
  document.getElementById("calc2").textContent = formatAmount(calc2);
  document.getElementById("calc3").textContent = formatAmount(calc3);
  document.getElementById("estimateAmount").textContent = formatAmount(maxPayment);

  // 顯示結果卡片
  resultCard.style.display = "block";

  // 保存計算資料供詳細公式使用
  window.calculationData = {
    insuredAge,
    currentAge,
    gender,
    insuranceType,
    coverageAmount,
    annualPremium,
    yearsInForce,
    policyYear,
    reserveAmount,
    thresholdRatio,
    annualAmountCoefficient,
    calc1,
    calc2,
    calc3,
    maxPayment
  };
}

function calculateAnnualPremium(age, gender, type) {
  // 簡化的保費計算（實際應使用精算表）
  const basePremium = {
    life: 1000,
    travel: 500,
    accident: 800,
    medical: 1200
  };

  let premium = basePremium[type] || 1000;
  
  // 年齡調整
  if (age < 30) {
    premium *= 0.8;
  } else if (age >= 50) {
    premium *= 1.5;
  }

  // 性別調整
  if (gender === "female") {
    premium *= 0.9;
  }

  return premium;
}

function getThresholdRatio(age) {
  if (age >= 18 && age <= 30) return 1.90;
  if (age >= 31 && age <= 40) return 1.60;
  if (age >= 41 && age <= 50) return 1.40;
  if (age >= 51 && age <= 60) return 1.20;
  if (age >= 61 && age <= 70) return 1.10;
  if (age >= 71 && age <= 90) return 1.02;
  return 1.00;
}

function getAnnualAmountCoefficient(policyYear) {
  const table = {
    1: 300,
    2: 300,
    3: 300,
    4: 9790,
    5: 9584,
    6: 9383,
    7: 9186,
    8: 8993,
    9: 8804,
    10: 8619,
    11: 8438,
    12: 8261,
    13: 8088,
    14: 7918,
    15: 7752,
    16: 7589,
    17: 7429,
    18: 7273,
    19: 7121,
    20: 6971,
    21: 6825,
    22: 6681,
    23: 6541,
    24: 6404,
    25: 6269,
    26: 6138,
    27: 6009,
    28: 5883,
    29: 5759,
    30: 5638,
    31: 5520,
    32: 5404,
    33: 5290,
    34: 5179,
    35: 5070,
    36: 4964,
    37: 4860,
    38: 4758,
    39: 4658,
    40: 4560,
    41: 4464,
    42: 4370,
    43: 4279,
    44: 4189,
    45: 4101,
    46: 4015,
    47: 3930,
    48: 3848,
    49: 3767,
    50: 3688,
    51: 3611,
    52: 3535,
    53: 3460,
    54: 3388,
    55: 3317,
    56: 3247,
    57: 3179,
    58: 3112,
    59: 3047,
    60: 2983,
    61: 2920,
    62: 2859,
    63: 2799,
    64: 2740,
    65: 2682,
    66: 2626,
    67: 2571,
    68: 2517,
    69: 2464,
    70: 2412,
    71: 2362,
    72: 2312,
    73: 2264,
    74: 2216,
    75: 2169,
    76: 2124,
    77: 2079,
    78: 2036,
    79: 1993,
    80: 1951,
    81: 1910,
    82: 1870,
    83: 1831,
    84: 1792,
    85: 1755,
    86: 1718,
    87: 1682,
    88: 1646,
    89: 1612,
    90: 1578,
    91: 1545,
    92: 1512,
    93: 1481,
    94: 1450,
    95: 1419,
    96: 1389,
    97: 1360,
    98: 1332,
    99: 1304,
    100: 1276,
    101: 1249,
    102: 1223,
    103: 1197,
    104: 1172,
    105: 1148,
    106: 1124,
    107: 1100,
    108: 1077,
    109: 1054,
    110: 1032,
    111: 1010
  };

  const year = Math.max(1, Math.min(111, policyYear));
  return table[year] || 1010;
}

function showFormulaModal() {
  if (!window.calculationData) {
    alert("請先進行估算");
    return;
  }

  const data = window.calculationData;
  
  const formulaHTML = `
    <div style="line-height: 1.8; color: var(--text-dark);">
      <h4>第十五條 身故保險金詳細計算公式</h4>
      <p>根據合約第十五條關於身故保險金的規定，理賠金額為以下三者中最大者：</p>

      <div style="background: #eef6ff; padding: 16px; border-radius: 10px; margin: 16px 0;">
        <p><strong>1. 年繳應繳保險費總額的 1.01 倍</strong></p>
        <p style="margin: 8px 0; font-size: 14px;">
          三年共繳 ${data.coverageAmount} 美元，則此項為<br/>
          ${data.coverageAmount} × 1.01 = <strong>${Math.round(data.coverageAmount * 1.01)}</strong> 美元。
        </p>
      </div>

      <div style="background: #eef6ff; padding: 16px; border-radius: 10px; margin: 16px 0;">
        <p><strong>2. 保單價值準備金乘以門檻比率</strong></p>
        <p style="margin: 8px 0; font-size: 14px;">
          由於被保險人 ${data.currentAge} 歲身故，根據附表二適用的門檻比率為 ${Math.round(data.thresholdRatio * 100)}%。<br/>
          假設當時的保單價值準備金為 ${data.reserveAmount} 美元，則此項為<br/>
          ${data.reserveAmount} × ${Math.round(data.thresholdRatio * 100)}% = <strong>${formatAmount(data.calc2)}</strong> 美元。
        </p>
        <img src="images/table2.png" alt="附表二給付比率表" style="max-width: 100%; margin: 10px 0; border-radius: 6px;">
      </div>

      <div style="background: #eef6ff; padding: 16px; border-radius: 10px; margin: 16px 0;">
        <p><strong>3. 當年度保險金額</strong></p>
        <p style="margin: 8px 0; font-size: 14px;">
          根據附表三，第 ${data.policyYear} 保單年度每 10,000 美元的當年度保險金額係數為 ${formatAmount(data.annualAmountCoefficient)}。<br/>
          因此 ${formatAmount(data.coverageAmount)} 美元的總保險金額對應：<br/>
          ${formatAmount(data.annualAmountCoefficient)} × ${formatAmount(data.coverageAmount / 10000)} = <strong>${formatAmount(data.calc3)}</strong> 美元。
          <img src="images/table1.png" alt="附表ㄧ當年度保險金額係數表" style="max-width: 100%; margin: 10px 0; border-radius: 6px;">
        </p>
      </div>

      <div style="background: #dbeafe; padding: 18px; border-radius: 12px; margin-top: 20px;">
        <p style="font-size: 16px; font-weight: 700; color: var(--dark-yellow);">結論：</p>
        <p style="font-size: 16px;">
          在這個情境下，身故保險金的給付金額為三者中最大的 <strong>${formatAmount(data.maxPayment)}</strong> 美元。
        </p>
      </div>

      <p style="color: var(--text-muted); font-size: 14px; margin-top: 18px;">
        ※ 此為示意性公式展示，實際理賠依保單條款與保險公司審核為準。
      </p>
    </div>
  `;

  document.getElementById("formulaBody").innerHTML = formulaHTML;
  formulaModal.style.display = "flex";
}

function closeModal() {
  formulaModal.style.display = "none";
}

function resetForm() {
  document.getElementById("insuredAge").value = 35;
  document.getElementById("currentAge").value = 40;
  document.getElementById("gender").value = "female";
  document.getElementById("insuranceType").value = "life";
  document.getElementById("insuranceProduct").value = "富邦人壽傳富美滿外幣利率變動型終身壽險";
  document.getElementById("coverageAmount").value = 100000;
  document.getElementById("eventDescription").value = "我太太投保了上面的壽險，她最近因車禍過世，請問可以理賠多少錢？";
  resultCard.style.display = "none";
}

calculateBtn.addEventListener("click", computeEstimate);
clearBtn.addEventListener("click", resetForm);
detailBtn.addEventListener("click", showFormulaModal);
closeFormulaBtn.addEventListener("click", closeModal);

// 點擊 modal 背景關閉
formulaModal.addEventListener("click", (e) => {
  if (e.target === formulaModal) {
    closeModal();
  }
});

// 商品條文展開/收起
const productInfo = document.getElementById("productInfo");
const toggleProductBtn = document.getElementById("toggleProductBtn");

if (toggleProductBtn) {
  toggleProductBtn.addEventListener("click", () => {
    productInfo.classList.toggle("expanded");
    toggleProductBtn.textContent = productInfo.classList.contains("expanded")
      ? "收起條文"
      : "展開全部條文";
  });
}
