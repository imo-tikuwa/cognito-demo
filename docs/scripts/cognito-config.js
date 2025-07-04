import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";
import { updateIdTokenDisplay } from "./id-token-display.js";
import {
  SESSION_KEYS,
  setSession,
  getSession,
  removeSession,
} from "./session-manager.js";

let cognitoClient = null;
let currentUser = null;
let config = { region: "", userPoolId: "", clientId: "" };

export function getCognitoClient() {
  return cognitoClient;
}
export function getCurrentUser() {
  return currentUser;
}
export function setCurrentUser(user) {
  currentUser = user;
  setSession(SESSION_KEYS.AUTH_DATA, user);
}
export function getConfig() {
  return config;
}

export function toggleConfig() {
  const inputs = document.getElementById("configInputs");
  const icon = document.getElementById("toggleIcon");
  const isHidden = inputs.classList.toggle("hidden");
  icon.textContent = "▶";
  icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(90deg)";
}

export function validateConfig() {
  config.region = document.getElementById("region").value.trim();
  config.userPoolId = document.getElementById("userPoolId").value.trim();
  config.clientId = document.getElementById("clientId").value.trim();

  if (!config.region || !config.userPoolId || !config.clientId) {
    updateConfigStatus(false);
    return;
  }

  setSession(SESSION_KEYS.CONFIG, config);
  updateConfigStatus(true);

  // Cognitoクライアントを初期化
  cognitoClient = new CognitoIdentityProviderClient({
    region: config.region,
  });

  // 入力欄を閉じる
  document.getElementById("configInputs").classList.add("hidden");
  const icon = document.getElementById("toggleIcon");
  icon.textContent = "▶";
  icon.style.transform = "rotate(0deg)";
}

// セッションから認証状態を復元
export function restoreSession() {
  try {
    // 設定を復元
    const savedConfig = getSession(SESSION_KEYS.CONFIG);
    if (savedConfig) {
      config.region = savedConfig.region;
      config.userPoolId = savedConfig.userPoolId;
      config.clientId = savedConfig.clientId;

      document.getElementById("region").value = config.region;
      document.getElementById("userPoolId").value = config.userPoolId;
      document.getElementById("clientId").value = config.clientId;

      // Cognitoクライアントを初期化
      cognitoClient = new CognitoIdentityProviderClient({
        region: config.region,
      });

      // 設定完了状態を表示
      updateConfigStatus(true);
    }

    // 認証データを復元
    const savedAuthData = getSession(SESSION_KEYS.AUTH_DATA);
    if (savedAuthData && cognitoClient) {
      // トークンの有効期限をチェック
      const decodedToken = jwtDecode(savedAuthData.IdToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        // トークンが有効な場合、認証状態を復元
        currentUser = savedAuthData;
        showLoggedInState(true);
        console.log("セッションから認証状態を復元しました");
      } else {
        // トークンが期限切れの場合、セッションをクリア
        console.log("トークンが期限切れのため、セッションをクリアします");
        clearSession();
      }
    }
  } catch (error) {
    console.error("セッション復元エラー:", error);
    clearSession();
  }
}

// ログイン後の状態を表示
export function showLoggedInState(isRestored = false) {
  const currentUser = getCurrentUser();

  updateIdTokenDisplay(currentUser, { showRestored: isRestored });

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("loggedInSection").classList.remove("hidden");
}

// 設定状態を更新
function updateConfigStatus(isValid) {
  const loginSection = document.getElementById("loginSection");
  const statusDiv = document.getElementById("configStatus");
  const signInBtn = document.getElementById("signInBtn");
  const currentUser = getCurrentUser();

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
      loginSection.classList.remove("hidden");
    }
    signInBtn.disabled = false;
  } else {
    statusDiv.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-red-500">❌</span>
              <span>必須項目を入力してください</span>
            </div>
          `;
    statusDiv.className =
      "mt-6 text-red-800 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400 font-medium";
    loginSection.classList.add("hidden");
    signInBtn.disabled = true;
  }
}

// セッションをクリア
export function clearSession() {
  removeSession(SESSION_KEYS.AUTH_DATA);
  currentUser = null;
}
