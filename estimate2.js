const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");
const detailBtn = document.getElementById("detailBtn");
const closeFormulaBtn = document.getElementById("closeFormulaBtn");
const resultCard = document.getElementById("resultCard");
const formulaModal = document.getElementById("formulaModal");
const productInfo = document.getElementById("productInfo");
const toggleProductBtn = document.getElementById("toggleProductBtn");

let claimRules = [];
let articleRuleMap = {};

const fallbackRuleText = {
  "第五條": `被保險人於本契約有效期間內遭受第二條約定的意外傷害事故，自意外傷害事故發生之日起一百八十日以內身故者，本公司按保險金額給付身故保險金。但超過一百八十日身故者，受益人若能證明被保險人之身故與該意外傷害事故具有因果關係者，不在此限。\n訂立本契約時，以受監護宣告尚未撤銷者為被保險人，其「意外傷害身故保險金」變更為喪葬費用保險金。\n前項被保險人於民國九十九年二月三日（含）以後所投保之喪葬費用保險金額總和（不限本公司），不得超過遺產及贈與稅法第十七條有關遺產稅喪葬費扣除額之半數，其超過部分本公司不負給付責任，本公司並應無息退還該超過部分之已繳保險費。\n前項情形，如要保人向二家（含）以上保險公司投保，或向同一保險公司投保數個保險契(附)約，且其投保之喪葬費用保險金額合計超過所定之限額者，本公司於所承保之喪葬費用金額範圍內，依各要保書所載之要保時間先後，依約給付喪葬費用保險金至前項喪葬費用額度上限為止，如有二家以上保險公司之保險契約要保時間相同或無法區分其要保時間之先後者，各該保險公司應依其喪葬費用保險金額與扣除要保時間在先之保險公司應理賠之金額後所餘之限額比例分擔其責任。`,
  "第六條": `被保險人於本契約有效期間內遭受第二條約定的意外傷害事故，自意外傷害事故發生之日起一百八十日以內致成附表一所列失能程度之一者，本公司給付意外傷害失能保險金，其金額按保險金額乘以該表所列之給付比例計算。但超過一百八十日致成失能者，受益人若能證明被保險人之失能與該意外傷害事故具有因果關係者，不在此限。\n被保險人因同一意外傷害事故致成附表一所列二項以上失能程度時，本公司給付各該項意外傷害失能保險金之和，最高以保險金額為限。但不同失能項目屬於同一手或同一足時，僅給付一項意外傷害失能保險金；若失能項目所屬失能等級不同時，給付較嚴重項目的意外傷害失能保險金。\n被保險人因本次意外傷害事故所致之失能，如合併以前（含本契約訂立前）的失能，可領附表一所列較嚴重項目的意外傷害失能保險金者，本公司按較嚴重的項目給付意外傷害失能保險金，但以前的失能，視同已給付意外傷害失能保險金，應扣除之。\n前項情形，若被保險人扣除以前的失能後得領取之保險金低於單獨請領之金額者，不適用合併之約定。被保險人於本契約有效期間內因不同意外傷害事故申領意外傷害失能保險金時，本公司累計給付金額最高以保險金額為限。\n第一項情形被保險人之失能如係附表一所列失能等級第一級者，本公司依本條約定給付保險金後，本契約效力即行終止。`,
  "第七條": `被保險人於本契約有效期間內遭受第二條約定的意外傷害事故，自意外傷害事故發生之日起一百八十日以內，經醫院或診所治療，診斷確定致成附表二骨折別表所列項目之一，本公司按保險金額的 5%乘以附表二骨折別表所定給付比例，給付「意外傷害骨折保險金」。\n如被保險人自意外傷害事故發生之日起超過一百八十日經診斷確定骨折者，若能證明其與該意外傷害事故具有因果關係者，本公司仍依前項約定給付「意外傷害骨折保險金」，不受前項一百八十日之限制。附表二骨折別表內所載給付比例僅適用於骨骼完全折斷之情形。如係不完全骨折，其給付比例為完全骨折的二分之一；如係骨骼龜裂者，其給付比例為完全骨折的四分之一。\n同一意外傷害事故僅給付一次意外傷害骨折保險金。如因同一意外傷害事故致有二處以上骨折時，本公司僅給付一項最高比例之意外傷害骨折保險金。`,
  "第八條": `被保險人於本契約有效期間內遭受第二條約定的意外傷害事故，自意外傷害事故發生之日起一百八十日以內，經醫院或診所治療，診斷確定致成附表三脫臼別表所列脫臼項目之一，經醫生診斷必須且實際施行「脫臼開放性復位術」治療者，本公司依其脫臼部位按保險金額的 5%乘以附表三脫臼別表所定給付比例，給付「意外傷害脫臼開放性復位術保險金」。\n如被保險人自意外傷害事故發生之日起超過一百八十日經診斷確定脫臼而施行「脫臼開放性復位術」者，若能證明被保險人之脫臼與該意外傷害事故具有因果關係者，本公司仍依前項約定給付意外傷害脫臼開放性復位術保險金，不受前項一百八十日之限制。\n同一意外傷害事故僅給付一次意外傷害脫臼開放性復位術保險金。如因同一意外傷害事故致成二項以上脫臼經醫師診斷必須且實際施行二項以上之「脫臼開放性復位術」治療者，本公司僅給付一項較高比例之意外傷害脫臼開放性復位術保險金。`,
  "第九條": `被保險人於本契約有效期間內遭受第二條約定的意外傷害事故，於醫院或診所經醫師診斷必須接受創傷縫合處置治療且已接受縫合處置者，本公司依其創傷大小按保險金額的 0.1%乘以附表四意外創傷縫合處置項目及給付比例表所定給付比例，給付「意外傷害創傷縫合處置保險金」。\n同一意外傷害事故僅給付一次意外傷害創傷縫合處置保險金。如因同一意外傷害事故而接受二項以上創傷縫合處置者，本公司僅給付一項較高比例之意外傷害創傷縫合處置保險金。`,
  "第十條": `被保險人於本契約有效期間內因同一意外傷害事故致成失能後身故，並符合本契約第五條及第六條約定之申領條件時，本公司之給付總金額合計最高以保險金額為限。\n前項情形，受益人已受領意外傷害失能保險金者，本公司僅就保險金額與已受領金額間之差額負給付責任。\n被保險人於本契約有效期間內因不同意外傷害事故致成失能、身故時，受益人得依第五條及第六條之約定分別申領保險金，不適用第一項之約定。`,
  "第十一條": `被保險人因下列原因致成死亡、失能或傷害時，本公司不負給付保險金的責任：\n一、要保人、被保險人的故意行為。\n二、被保險人犯罪行為。\n三、被保險人飲酒後駕（騎）車，其吐氣或血液所含酒精成份超過道路交通法令規定標準者。\n四、戰爭（不論宣戰與否）、內亂及其他類似的武裝變亂。但契約另有約定者不在此限。\n五、因原子或核子能裝置所引起的爆炸、灼熱、輻射或污染。但契約另有約定者不在此限。\n前項第一款及第二十三條情形（除被保險人的故意行為外），致被保險人傷害或失能時，本公司仍給付保險金。`,
  "第十二條": `被保險人從事下列活動，致成死亡、失能或傷害時，除本契約另有約定外，本公司不負給付保險金的責任：\n一、被保險人從事角力、摔跤、柔道、空手道、跆拳道、馬術、拳擊、特技表演等的競賽或表演。\n二、被保險人從事汽車、機車及自由車等的競賽或表演。`
};

async function loadRuleData() {
  try {
    const response = await fetch("rules.json");
    if (!response.ok) {
      throw new Error("無法載入 rules.json");
    }
    const data = await response.json();
    claimRules = data.rules || [];
    articleRuleMap = claimRules.reduce((map, rule) => {
      if (rule.article) {
        map[rule.article] = rule;
      }
      return map;
    }, {});
  } catch (error) {
    console.warn("載入 rules.json 失敗：", error);
    claimRules = [];
    articleRuleMap = {};
  }
}

function formatAmount(amount) {
  return new Intl.NumberFormat("zh-TW").format(Math.round(amount));
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\u4e00-\u9fff0-9a-zA-Z]+/g, " ")
    .trim();
}

function detectClaimType(text) {
  const normalized = normalizeText(text);
  if (!normalized) return null;

  if (normalized.includes("身故") || normalized.includes("死亡") || normalized.includes("喪葬")) {
    return {
      article: "第五條",
      title: "保險範圍：意外傷害身故保險金或喪葬費用保險金的給付",
      type: "death",
      keywords: ["身故", "死亡", "喪葬"],
      fullText: fallbackRuleText["第五條"]
    };
  }

  if (normalized.includes("失能") || normalized.includes("殘廢") || normalized.includes("失能等級")) {
    return {
      article: "第六條",
      title: "保險範圍：意外傷害失能保險金的給付",
      type: "disability",
      keywords: ["失能", "殘廢", "失能等級"],
      fullText: fallbackRuleText["第六條"]
    };
  }

  if (normalized.includes("除外責任") || normalized.includes("故意行為") || normalized.includes("犯罪") || normalized.includes("酒駕") || normalized.includes("飲酒") || normalized.includes("駕車") || normalized.includes("騎車") || normalized.includes("戰爭") || normalized.includes("核能") || normalized.includes("原子能") || normalized.includes("武裝變亂")) {
    return {
      article: "第十一條",
      title: "除外責任（原因）",
      type: "exclusion",
      keywords: ["除外責任", "故意行為", "犯罪", "酒駕", "飲酒", "駕車", "騎車", "戰爭", "核能", "原子能", "武裝變亂"],
      fullText: fallbackRuleText["第十一條"]
    };
  }

  if (normalized.includes("不保事項") || normalized.includes("競賽") || normalized.includes("特技") || normalized.includes("拳擊") || normalized.includes("賽車") || normalized.includes("角力") || normalized.includes("摔跤") || normalized.includes("柔道") || normalized.includes("空手道") || normalized.includes("跆拳道") || normalized.includes("馬術") || normalized.includes("汽車") || normalized.includes("機車") || normalized.includes("自由車") || normalized.includes("表演")) {
    return {
      article: "第十二條",
      title: "不保事項",
      type: "nonCoverage",
      keywords: ["不保事項", "競賽", "特技", "拳擊", "賽車", "角力", "摔跤", "柔道", "空手道", "跆拳道", "馬術", "汽車", "機車", "自由車", "表演"],
      fullText: fallbackRuleText["第十二條"]
    };
  }

  if (normalized.includes("給付限制") || normalized.includes("失能後身故") || normalized.includes("差額給付") || normalized.includes("同一事故") || normalized.includes("已受領") || normalized.includes("給付總額") || normalized.includes("限額") || normalized.includes("差額")) {
    return {
      article: "第十條",
      title: "保險範圍：保險金給付的限制",
      type: "claimLimit",
      keywords: ["給付限制", "失能後身故", "差額給付", "同一事故", "已受領", "給付總額", "限額", "差額"],
      fullText: fallbackRuleText["第十條"]
    };
  }

  if (normalized.includes("骨折")) {
    return {
      article: "第七條",
      title: "保險範圍：意外傷害骨折保險金的給付",
      type: "fracture",
      keywords: ["骨折", "完全骨折", "不完全骨折", "龜裂"],
      fullText: fallbackRuleText["第七條"]
    };
  }

  if (normalized.includes("脫臼")) {
    return {
      article: "第八條",
      title: "保險範圍：意外傷害脫臼開放性復位術保險金的給付",
      type: "dislocation",
      keywords: ["脫臼", "開放性復位術"],
      fullText: fallbackRuleText["第八條"]
    };
  }

  if (normalized.includes("縫合") || normalized.includes("創傷") || normalized.includes("傷口")) {
    return {
      article: "第九條",
      title: "保險範圍：意外傷害創傷縫合處置保險金的給付",
      type: "suture",
      keywords: ["縫合", "創傷", "傷口"],
      fullText: fallbackRuleText["第九條"]
    };
  }

  return null;
}

function extractFraction(text, keywords) {
  const normalized = normalizeText(text);
  if (!normalized) return 1;

  // 優先檢查龜裂情況（最嚴重：給付25%）
  if (normalized.includes("龜裂") || (normalized.includes("裂") && !normalized.includes("骨折"))) {
    return 0.25;
  }

  // 其次檢查不完全骨折情況（給付50%）
  if (normalized.includes("不完全") || normalized.includes("不全") || normalized.includes("半") || normalized.includes("不完整")) {
    return 0.5;
  }

  // 最後默認為完全骨折（給付100%）
  return 1;
}

function extractDisabilityRatio(text) {
  const normalized = normalizeText(text);
  if (normalized.includes("一級")) return 1.0;
  if (normalized.includes("二級")) return 0.8;
  if (normalized.includes("三級")) return 0.6;
  if (normalized.includes("四級")) return 0.5;
  if (normalized.includes("五級")) return 0.4;
  if (normalized.includes("六級")) return 0.3;
  if (normalized.includes("七級")) return 0.2;
  if (normalized.includes("八級")) return 0.15;
  if (normalized.includes("九級")) return 0.1;
  if (normalized.includes("殘廢") || normalized.includes("失能")) return 0.5;
  return 0.3;
}

// 骨折部位給付比例表（完全骨折）
const fracturePartRatios = {
  "指骨": 0.03,
  "趾骨": 0.03,
  "鼻骨": 0.12,
  "喉骨": 0.12,
  "頸骨": 0.12,
  "掌骨": 0.12,
  "跖骨": 0.12,
  "肋骨": 0.20,
  "鎖骨": 0.30,
  "下頷": 0.20,
  "拇骨": 0.30,
  "尺骨": 0.30,
  "膝蓋骨": 0.30,
  "肩胛骨": 0.35,
  "脊骨": 0.40,
  "脊椎": 0.40,
  "骨盤": 0.40,
  "頭蓋骨": 0.60,
  "肎骨": 0.40,
  "腕骨": 0.40,
  "腓骨": 0.40,
  "脛骨": 0.40,
  "踝骨": 0.40,
  "股骨": 0.60,
  "大腿骨": 0.80
};

const dislocationPartRatios = {
  "肩關節": 0.20,
  "肘關節": 0.10,
  "腕關節": 0.10,
  "髖關節": 0.30,
  "膝關節": 0.20,
  "踝關節": 0.20,
  "足關節": 0.20,
  "肩": 0.20,
  "肘": 0.10,
  "腕": 0.10,
  "髖": 0.30,
  "膝": 0.20,
  "踝": 0.20,
  "足": 0.20
};

function extractFracturePart(text) {
  const normalized = normalizeText(text);
  for (const [part, ratio] of Object.entries(fracturePartRatios)) {
    if (normalized.includes(normalizeText(part))) {
      return ratio;
    }
  }
  return 0.30; // 預設為中等部位比例
}

function extractDislocationPart(text) {
  const normalized = normalizeText(text);
  for (const [part, ratio] of Object.entries(dislocationPartRatios)) {
    if (normalized.includes(normalizeText(part))) {
      return ratio;
    }
  }
  return 0.15; // 預設為其他關節比例
}

function extractSutureRatio(text) {
  const normalized = normalizeText(text);

  const greaterThan7 = /(大於|超過|超過了|>)[\s\S]*7\s*(公?分|cm)|7\s*(公?分|cm)[\s\S]*(以上|以上的|以上)/;
  const lessOrEqual7 = /(小於|等於|小於或等於|<=|<)[\s\S]*7\s*(公?分|cm)|7\s*(公?分|cm)[\s\S]*(以下|以下的|以內)/;

  if (greaterThan7.test(normalized)) {
    return 1;
  }
  if (lessOrEqual7.test(normalized)) {
    return 0.5;
  }
  // 若描述只提到表淺撕裂傷且未明確長度，可先預設為 50%
  if (normalized.includes("表淺") || normalized.includes("淺撕裂") || normalized.includes("表淺撕裂")) {
    return 0.5;
  }
  return 0.5;
}

function calculateClaimAmount(typeInfo, coverageAmount, eventDescription) {
  const normalized = normalizeText(eventDescription);
  let amount = 0;
  const details = [];
  const formulas = [];

  if (!typeInfo) {
    return {
      amount: 0,
      formulas: [
        {label: "無法判斷適用條款", value: "請補充事件描述，例如身故、骨折、脫臼、縫合、失能。"}
      ],
      details: "未找到符合事件描述的條款。",
      appliedRuleTitle: null,
      appliedType: null
    };
  }

  switch (typeInfo.type) {
    case "death":
      amount = coverageAmount;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，本次給付為保險金額。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: `直接採用保險金額 ${formatAmount(coverageAmount)}。`
      });
      break;

    case "disability": {
      const ratio = extractDisabilityRatio(eventDescription);
      amount = coverageAmount * ratio;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，保險金額乘以失能給付比例。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: `保險金額 ${formatAmount(coverageAmount)} × 比例 ${ratio * 100}% = ${formatAmount(amount)}。`
      });
      break;
    }

    case "fracture": {
      const partRatio = extractFracturePart(eventDescription);
      const completeness = extractFraction(eventDescription, ["完全骨折", "骨折"]);
      let completenessDesc = "完全骨折";
      if (completeness === 0.5) {
        completenessDesc = "不完全骨折（二分之一）";
      } else if (completeness === 0.25) {
        completenessDesc = "骨骼龜裂（四分之一）";
      }
      amount = coverageAmount * partRatio * completeness;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，按骨折部位給付比例 ${(partRatio * 100).toFixed(1)}% 及 ${completenessDesc} 計算。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: `保險金額 ${formatAmount(coverageAmount)} × ${(partRatio * 100).toFixed(1)}% (${completenessDesc}) = ${formatAmount(amount)}。`
      });
      break;
    }


    case "dislocation": {
      const partRatio = extractDislocationPart(eventDescription);
      const baseRate = 0.05;
      amount = coverageAmount * baseRate * partRatio;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，保險金額 × 5% × 脫臼部位比例。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: `保險金額 ${formatAmount(coverageAmount)} × 5% × ${partRatio * 100}% = ${formatAmount(amount)}。`
      });
      break;
    }

    case "suture": {
      const ratio = extractSutureRatio(eventDescription);
      const ratioDesc = ratio === 1 ? "大於7公分，給付比例100%" : "小於或等於7公分，給付比例50%";
      const baseRate = 0.001;
      amount = coverageAmount * baseRate * ratio;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，按附表四意外創傷縫合處置項目及給付比例表計算：${ratioDesc}。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: `保險金額 ${formatAmount(coverageAmount)} × 0.1% × ${ratio * 100}% = ${formatAmount(amount)}。`
      });
      break;
    }

    case "claimLimit": {
      amount = 0;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，同一事故之身故與失能保險金給付總額以保險金額為限，且已請領之失能金於身故給付時應先扣除。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: "此情況屬保險金給付限制規定，請以實際契約審核結果為準。"
      });
      break;
    }

    case "exclusion": {
      amount = 0;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，此情形屬除外責任，保險公司不予給付。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: "此情形不在保險理賠範圍。"
      });
      break;
    }

    case "nonCoverage": {
      amount = 0;
      details.push(`依 ${typeInfo.article} ${typeInfo.title}，此情形屬不保事項，保險公司不予給付。`);
      formulas.push({
        label: `${typeInfo.article} ${typeInfo.title}`,
        value: "此情形不在保險理賠範圍。"
      });
      break;
    }

    default:
      amount = 0;
      formulas.push({
        label: typeInfo.title,
        value: "暫不支援此條款的自動估算。"
      });
      details.push("目前僅支援身故、失能、骨折、脫臼、縫合等常見條款的估算。" );
  }

  return {
    amount,
    formulas,
    details: details.join(" "),
    appliedRuleTitle: `${typeInfo.article} ${typeInfo.title}`,
    appliedType: typeInfo.type
  };
}

function updateResultDisplay(productName, typeInfo, result) {
  document.getElementById("productInfo").innerHTML = buildProductInfoHTML(typeInfo, productName);
  const resultProductEl = document.getElementById("resultProduct");
  if (resultProductEl) {
    resultProductEl.textContent = productName;
  }

  document.getElementById("estimateAmount").textContent = formatAmount(result.amount);
  resultCard.style.display = "block";
}

function buildProductInfoHTML(typeInfo, productName) {
  if (!typeInfo) {
    return `
      <strong>商品：</strong><span id="resultProduct">${productName || "-"}</span><br/>
      <strong>未找到適用條文</strong><br/>
      請補充更清楚的事件描述，例如身故、骨折、脫臼、縫合、失能。
    `;
  }

  const ruleText = typeInfo.fullText || "未找到對應條文內容。";

  return `
    <strong>商品：</strong><span id="resultProduct"></span><br/>
    <strong>適用條文：</strong>${typeInfo.article} ${typeInfo.title}<br/>
    <div style="margin-top: 8px; white-space: pre-wrap; line-height: 1.8;">
      ${ruleText}
    </div>
  `;
}

function showFormulaModal() {
  if (!window.calculationData) {
    alert("請先進行估算");
    return;
  }

  const data = window.calculationData;
  const appliedType = data.result.appliedType;
  
  // 根據條款類型決定要顯示的圖片
  let tableImageHtml = "";
  if (appliedType === "fracture") {
    tableImageHtml = `<img src="images/Fun_table2.png" alt="附表二：骨折別表" style="max-width:100%; margin-top:8px;"/>`;
  } else if (appliedType === "dislocation") {
    tableImageHtml = `<img src="images/Fun_table3.png" alt="附表三：脫臼別表" style="max-width:100%; margin-top:8px;"/>`;
  } else if (appliedType === "suture") {
    tableImageHtml = `<img src="images/Fun_table4.png" alt="附表四：意外創傷縫合處置項目及給付比例表" style="max-width:100%; margin-top:8px;"/>`;
  }
  
  const formulaHTML = `
    <div style="line-height: 1.8; color: var(--text-dark);">
      ${data.result.formulas
        .map(
          (formula, index) => `
        <div style="background: #eef6ff; padding: 14px; border-radius: 10px; margin: 14px 0;">
          <p><strong>${index + 1}. ${formula.label}</strong></p>
          <p style="margin: 8px 0; font-size: 14px;">${formula.value}</p>
          ${tableImageHtml}
        </div>`
        )
        .join("")}
      <div style="background: #dbeafe; padding: 18px; border-radius: 12px; margin-top: 16px;">
        <p style="font-size: 16px; font-weight: 700;">最終估算結果：</p>
        <p style="font-size: 16px;">${formatAmount(data.result.amount)} 新臺幣</p>
      </div>
      <p style="color: var(--text-muted); font-size: 14px; margin-top: 18px;">
        ※ 本估算依事件描述與條款資訊進行自動判斷，實際理賠仍以保險公司審核與契約為準。
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
  document.getElementById("gender").value = "male";
  document.getElementById("insuranceType").value = "accident";
  document.getElementById("insuranceProduct").value = "富邦人壽 Fun 肆動網路投保傷害保險";
  document.getElementById("coverageAmount").value = 1000000;
  document.getElementById("eventDescription").value = "我先生因車禍摔倒，送醫後診斷為鎖骨完全骨折，請問可以理賠多少錢？";
  resultCard.style.display = "none";
}

async function computeEstimate() {
  const insuredAge = Number(document.getElementById("insuredAge").value) || 35;
  const currentAge = Number(document.getElementById("currentAge").value) || 40;
  const gender = document.getElementById("gender").value;
  const insuranceType = document.getElementById("insuranceType").value;
  const insuranceProduct = document.getElementById("insuranceProduct").value;
  const coverageAmount = Number(document.getElementById("coverageAmount").value) || 100000;
  const eventDescription = document.getElementById("eventDescription").value;

  if (!claimRules.length) {
    await loadRuleData();
  }

  const matchedType = detectClaimType(eventDescription);
  if (matchedType) {
    const ruleEntry = articleRuleMap[matchedType.article];
    matchedType.fullText =
      (ruleEntry && ruleEntry.fullText) ||
      fallbackRuleText[matchedType.article] ||
      "未找到完整條文";
  }

  const result = calculateClaimAmount(matchedType, coverageAmount, eventDescription);

  window.calculationData = {
    insuredAge,
    currentAge,
    gender,
    insuranceType,
    insuranceProduct,
    coverageAmount,
    eventDescription,
    ruleTitle: result.appliedRuleTitle,
    result
  };

  updateResultDisplay(insuranceProduct, matchedType, result);
}

calculateBtn.addEventListener("click", computeEstimate);
clearBtn.addEventListener("click", resetForm);
detailBtn.addEventListener("click", showFormulaModal);
closeFormulaBtn.addEventListener("click", closeModal);
formulaModal.addEventListener("click", (e) => {
  if (e.target === formulaModal) {
    closeModal();
  }
});

if (toggleProductBtn) {
  toggleProductBtn.addEventListener("click", () => {
    productInfo.classList.toggle("expanded");
    toggleProductBtn.textContent = productInfo.classList.contains("expanded")
      ? "收起條文"
      : "展開全部條文";
  });
}
