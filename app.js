// DOM 選擇器
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const tabBtns = document.querySelectorAll(".tab-btn");

// 初始化
function init() {
  setupNavigation();
  setupTabs();
  setupAudioPlayer();
}

// 设置左侧導航
function setupNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const sectionId = item.getAttribute("data-section");

      // 更新導航項的 active 狀態
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      // 更新內容區的顯示
      sections.forEach((section) => section.classList.remove("active"));
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add("active");
      }

      // 根據選中的條文更新右側說明面板
      updateExplanationForSection(sectionId);
    });
  });

  // 點擊第一個導航項為默認值
  if (navItems.length > 0) {
    navItems[0].click();
  }
}

// 根據條文ID更新說明面板
function updateExplanationForSection(sectionId) {
  // 隱藏所有說明
  const allExplanations = document.querySelectorAll(".section-explanation");
  allExplanations.forEach((exp) => {
    exp.style.display = "none";
  });

  // 顯示對應的說明
  const targetExplanation = document.getElementById(`${sectionId}-explanation`);
  if (targetExplanation) {
    targetExplanation.style.display = "block";
  }

  // 重置標籤到第一個
  resetExplanationPanel();
}

// 设置右侧標籤
function setupTabs() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");

      // 更新按鈕的 active 狀態
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");

      // 更新內容的顯示 - 只顯示當前段落中的對應標籤內容
      const explanationContent = document.querySelector(".explanation-content");
      const allTabContents = explanationContent.querySelectorAll(".tab-content");
      
      allTabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.getAttribute("data-tab") === tabName) {
          // 檢查這個tab-content是否屬於當前顯示的section
          const sectionExp = content.closest(".section-explanation");
          if (sectionExp && sectionExp.style.display !== "none") {
            content.classList.add("active");
          }
        }
      });
    });
  });

  // 不需要在這裡點擊第一個標籤，因為在初始化時會通過resetExplanationPanel來設定
}

// 重置說明面板
function resetExplanationPanel() {
  tabBtns.forEach((btn) => btn.classList.remove("active"));
  
  // 隱藏所有tab-content
  const allTabContents = document.querySelectorAll(".explanation-content .tab-content");
  allTabContents.forEach((content) => content.classList.remove("active"));

  // 顯示當前顯示的section中的第一個tab-content
  const visibleExplanation = document.querySelector(".section-explanation:not([style*='display: none'])");
  if (visibleExplanation) {
    const firstTab = visibleExplanation.querySelector(".tab-content");
    if (firstTab) {
      firstTab.classList.add("active");
    }
  }

  // 激活第一個標籤按鈕
  if (tabBtns.length > 0) {
    tabBtns[0].classList.add("active");
  }
}

let currentSpeechButton = null;
let currentUtterance = null;

// ------- MinNan TTS support -------
const MINNAN_TTS_API_URL = "https://happy0708-minnan-test.hf.space/gradio_api/call/v2/tts";
const MINNAN_TTS_EVENT_URL = "https://happy0708-minnan-test.hf.space/gradio_api/call/v2/tts";

function parseEventPayload(text) {
  const trimmedText = (text || "").trim();
  if (!trimmedText) return null;

  const dataLines = trimmedText
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"));

  // 從最後一筆 data: 開始找
  for (let i = dataLines.length - 1; i >= 0; i--) {
    const dataText = dataLines[i]
      .replace(/^data:\s*/, "")
      .trim();

    // 忽略 heartbeat 的 null
    if (!dataText || dataText === "null") {
      continue;
    }

    try {
      return JSON.parse(dataText);
    } catch (e) {
      console.warn("JSON parse failed:", dataText, e);
    }
  }

  // 有些 API 直接回 JSON
  try {
    return JSON.parse(trimmedText);
  } catch {
    return null;
  }
}

async function pollEvent(eventId) {
  const url = `${MINNAN_TTS_EVENT_URL}/${eventId}`;
  for (let i = 0; i < 20; i++) {
    const response = await fetch(url, { method: "GET" });
    const text = await response.text();
    const result = parseEventPayload(text);
    const payload = result?.data?.[0] ?? result?.[0] ?? result;
    const fileItem = payload?.data?.[0] ?? payload;

    if (fileItem?.url) return fileItem.url;
    if (fileItem?.path) return fileItem.path;

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return null;
}

async function fetchMinnanAudio(text) {
  const response = await fetch(MINNAN_TTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const bodyText = await response.text();
  if (!response.ok) throw new Error(bodyText || "語音生成失敗");

  let result;
  try {
    result = JSON.parse(bodyText);
  } catch {
    throw new Error("回傳內容不是 JSON");
  }

  const eventId = result?.event_id || result?.eventId;
  if (!eventId) throw new Error("Space 未回傳事件 ID");

  const audioUrl = await pollEvent(eventId);
  if (!audioUrl) throw new Error("Space 未回傳音訊資料");

  const normalizedAudioUrl = audioUrl.startsWith("http")
    ? audioUrl
    : `https://happy0708-minnan-test.hf.space/${audioUrl}`;

  const audioResponse = await fetch(normalizedAudioUrl, { headers: { Accept: "audio/*" } });
  if (!audioResponse.ok) throw new Error("音訊下載失敗");

  const arrayBuffer = await audioResponse.arrayBuffer();
  const contentType = audioResponse.headers.get("content-type") || "";
  const inferredMimeType = contentType && contentType !== "application/octet-stream"
    ? contentType
    : (normalizedAudioUrl.toLowerCase().endsWith(".wav") ? "audio/wav" : "audio/mpeg");

  const audioBlob = new Blob([arrayBuffer], { type: inferredMimeType });
  return URL.createObjectURL(audioBlob);
}

function isMinnanButton(button) {
  return button && (button.getAttribute("data-voice") === "minnan" || (button.textContent || "").includes("閩南語"));
}
// ------- end MinNan support -------

// 设置音频播放器
function setupAudioPlayer() {
  const allPlayBtns = document.querySelectorAll(".play-btn");
  allPlayBtns.forEach((playBtn) => {
    // 移除 HTML inline onclick，以便統一交給 JS 控制
    playBtn.removeAttribute("onclick");

    playBtn.addEventListener("click", () => {
      toggleSpeech(playBtn);
    });
  });
}

function toggleSpeech(button) {
  const tabContent = button.closest(".tab-content");
  if (!tabContent) return;

  const isCurrentButton = button === currentSpeechButton;

  if (isMinnanButton(button)) {
    if (isCurrentButton && currentUtterance instanceof HTMLAudioElement) {
      if (currentUtterance.paused) {
        currentUtterance.play().catch(() => {
          updateButtonState(button, "stopped");
        });
        updateButtonState(button, "playing");
      } else {
        currentUtterance.pause();
        updateButtonState(button, "paused");
      }
      return;
    }

    playMinnanSpeech(button);
    return;
  }

  const text = getTextFromTabContent(tabContent);
  if (!text) return;

  const synth = window.speechSynthesis;

  if (isCurrentButton && synth.speaking && !synth.paused) {
    synth.pause();
    updateButtonState(button, "paused");
    return;
  }

  if (isCurrentButton && synth.paused) {
    synth.resume();
    updateButtonState(button, "playing");
    return;
  }

  if (synth.speaking || synth.paused) {
    synth.cancel();
    resetAllPlayButtons();
  }

  currentSpeechButton = button;
  speakText(text, button);
}

async function playMinnanSpeech(button) {
  const tabContent = button.closest(".tab-content");
  if (!tabContent) return;

  const text = button.getAttribute("data-minnan-text") || tabContent.getAttribute("data-minnan-text") || getTextFromTabContent(tabContent);
  if (!text) return;

  const synth = window.speechSynthesis;
  if (synth && (synth.speaking || synth.paused)) {
    synth.cancel();
  }

  resetAllPlayButtons();
  currentSpeechButton = button;
  updateButtonState(button, "preparing");

  try {
    const objectUrl = await fetchMinnanAudio(text);
    const audio = new Audio(objectUrl);
    currentUtterance = audio;

    updateButtonState(button, "playing");

    audio.onended = () => {
      updateButtonState(button, "stopped");
      currentSpeechButton = null;
      currentUtterance = null;
      URL.revokeObjectURL(objectUrl);
    };

    audio.onerror = () => {
      updateButtonState(button, "stopped");
      currentSpeechButton = null;
      currentUtterance = null;
      URL.revokeObjectURL(objectUrl);
    };

    await audio.play();
  } catch (error) {
    console.error(error);
    updateButtonState(button, "stopped");
    currentSpeechButton = null;
    currentUtterance = null;
  }
}

function getTextFromTabContent(tabContent) {
  const lines = Array.from(tabContent.querySelectorAll("p, li"))
    .map((el) => el.textContent.trim())
    .filter(Boolean);
  return lines.join(" ");
}

function speakText(text, button) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    if (button) {
      updateButtonState(button, "stopped");
    }
    currentSpeechButton = null;
    currentUtterance = null;
  };

  utterance.onerror = () => {
    if (button) {
      updateButtonState(button, "stopped");
    }
    currentSpeechButton = null;
    currentUtterance = null;
  };

  currentUtterance = utterance;
  const synth = window.speechSynthesis;
  synth.speak(utterance);
  updateButtonState(button, "playing");
}

function updateButtonState(button, state) {
  if (!button) return;
  const isMinnan = isMinnanButton(button);
  if (state === "preparing") {
    button.textContent = isMinnan ? "⏳ 閩南語語音準備中..." : "⏳ 語音準備中...";
    button.style.background = "#ffc107";
    button.disabled = true;
  } else if (state === "playing") {
    button.textContent = isMinnan ? "⏸ 暫停閩南語語音" : "⏸ 暫停中文語音";
    button.style.background = "#6c757d";
    button.disabled = false;
  } else if (state === "paused") {
    button.textContent = isMinnan ? "▶ 繼續閩南語語音" : "▶ 繼續中文語音";
    button.style.background = "#e9a428";
    button.disabled = false;
  } else {
    button.textContent = isMinnan ? "▶ 播放閩南語語音說明" : "▶ 播放中文語音說明";
    button.style.background = "var(--primary-yellow)";
    button.disabled = false;
  }
}

function resetAllPlayButtons() {
  document.querySelectorAll(".play-btn").forEach((btn) => {
    const isMinnan = isMinnanButton(btn);
    btn.textContent = isMinnan ? "▶ 播放閩南語語音說明" : "▶ 播放中文語音說明";
    btn.style.background = "var(--primary-yellow)";
  });
  currentSpeechButton = null;
  currentUtterance = null;
}

// 鍵盤快捷鍵
document.addEventListener("keydown", (e) => {
  // Alt + 數字鍵快速切換章節
  if (e.altKey && e.key >= "1" && e.key <= "7") {
    const index = parseInt(e.key) - 1;
    if (navItems[index]) {
      navItems[index].click();
    }
  }

  // Alt + T 快速切換標籤
  if (e.altKey && e.key === "t") {
    e.preventDefault();
    const activeTabIndex = Array.from(tabBtns).findIndex((btn) =>
      btn.classList.contains("active")
    );
    const nextIndex = (activeTabIndex + 1) % tabBtns.length;
    tabBtns[nextIndex].click();
  }
});

// 平滑滾動到內容
function scrollToContent() {
  const articleContent = document.querySelector(".article-content");
  if (articleContent) {
    articleContent.scrollTop = 0;
  }
}

// 當切換內容時，滾動到頂部
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    setTimeout(scrollToContent, 100);
  });
});

// 頁面加載完成後初始化
document.addEventListener("DOMContentLoaded", init);
