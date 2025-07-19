import { jwtDecode } from "jwt-decode";
import { updateIdTokenDisplay } from "./id-token-display.js";
import {
  SESSION_KEYS,
  setSession,
  getSession,
  removeSession,
} from "./session-manager.js";

export function setupCognitoConfig() {
  // イベントリスナーを設定
  document
    .getElementById("toggleConfig")
    .addEventListener("click", toggleConfig);
  document
    .getElementById("validateConfig")
    .addEventListener("click", validateConfig);

  // セッションから認証状態を復元
  try {
    // 設定を復元
    const savedConfig = getSession(SESSION_KEYS.CONFIG);
    if (savedConfig) {
      document.getElementById("region").value = savedConfig.region;
      document.getElementById("userPoolId").value = savedConfig.userPoolId;
      document.getElementById("clientId").value = savedConfig.clientId;

      // 設定完了状態を表示
      updateConfigStatus(true);
    }

    // 認証データを復元
    const savedAuthData = getSession(SESSION_KEYS.AUTH_DATA);
    if (savedAuthData) {
      // トークンの有効期限をチェック
      const decodedToken = jwtDecode(savedAuthData.IdToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        // トークンが有効な場合、認証状態を復元
        showLoggedInState(true);
        console.log("セッションから認証状態を復元しました");
      } else {
        // トークンが期限切れの場合、セッションをクリア
        alert(
          "ID トークンの有効期限が切れているためセッションをクリアします。\nHosted UI で認証している場合は Hosted UI 側のログアウトが必要です"
        );
        removeSession(SESSION_KEYS.AUTH_DATA);

        updateConfigStatus(savedConfig ? true : false);
      }
    }
  } catch (error) {
    console.error("セッション復元エラー:", error);
    removeSession(SESSION_KEYS.AUTH_DATA);
  }
}

function toggleConfig() {
  const inputs = document.getElementById("configInputs");
  const icon = document.getElementById("toggleIcon");
  const isHidden = inputs.classList.toggle("hidden");
  icon.textContent = "▶";
  icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(90deg)";
}

function validateConfig() {
  const config = {
    region: document.getElementById("region").value.trim(),
    userPoolId: document.getElementById("userPoolId").value.trim(),
    clientId: document.getElementById("clientId").value.trim(),
  };

  if (!config.region || !config.userPoolId || !config.clientId) {
    updateConfigStatus(false);
    return;
  }

  setSession(SESSION_KEYS.CONFIG, config);
  updateConfigStatus(true);

  // 入力欄を閉じる
  document.getElementById("configInputs").classList.add("hidden");
  const icon = document.getElementById("toggleIcon");
  icon.textContent = "▶";
  icon.style.transform = "rotate(0deg)";
}

// ログイン後の状態を表示
export function showLoggedInState(isRestored = false) {
  const currentUser = getSession(SESSION_KEYS.AUTH_DATA);

  updateIdTokenDisplay(currentUser, { showRestored: isRestored });

  document.getElementById("loginSection")?.classList.add("hidden");
  document.getElementById("loggedInSection")?.classList.remove("hidden");
}

// 設定状態を更新
function updateConfigStatus(isValid) {
  const loginSection = document.getElementById("loginSection");
  const statusDiv = document.getElementById("configStatus");
  const signInBtn = document.getElementById("signInBtn");
  const currentUser = getSession(SESSION_KEYS.AUTH_DATA);

  if (isValid) {
    statusDiv.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-green-500">✅</span>
              <span>設定完了 - ログイン可能です</span>
            </div>
          `;
    statusDiv.className =
      "mt-6 text-green-800 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400 font-medium";

    // ログイン済みでない場合のみログインセクションを表示
    if (!currentUser) {
      loginSection?.classList.remove("hidden");
    }
    if (signInBtn) {
      signInBtn.disabled = false;
    }
  } else {
    statusDiv.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-red-500">❌</span>
              <span>必須項目を入力してください</span>
            </div>
          `;
    statusDiv.className =
      "mt-6 text-red-800 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400 font-medium";
    loginSection?.classList.add("hidden");
    if (signInBtn) {
      signInBtn.disabled = true;
    }
  }
}
