import { SESSION_KEYS, setSession, getSession } from "./session-manager.js";

export function setupHostedUIConfig() {
  document
    .getElementById("toggleHostedUIConfig")
    .addEventListener("click", toggleHostedUIConfig);
  document
    .getElementById("validateHostedUIConfig")
    .addEventListener("click", validateHostedUIConfig);

  // セッションから設定を復元
  try {
    const hostedUIConfig = getSession(SESSION_KEYS.HOSTED_UI_CONFIG);
    if (hostedUIConfig && hostedUIConfig.domain) {
      document.getElementById("hostedUIDomain").value = hostedUIConfig.domain;

      updateHostedUIConfigStatus(true, "Hosted UI - 設定済みです");
    }
  } catch (error) {
    console.error("セッション復元エラー:", error);
  }
}

function toggleHostedUIConfig() {
  const inputs = document.getElementById("hostedUIConfigInputs");
  const icon = document.getElementById("toggleHostedUIIcon");
  const isHidden = inputs.classList.toggle("hidden");
  icon.textContent = "▶";
  icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(90deg)";
}

function validateHostedUIConfig() {
  const domain = document.getElementById("hostedUIDomain").value.trim();

  if (!domain) {
    updateHostedUIConfigStatus(false, "Hosted UI ドメインを入力してください");
    return false;
  }

  // URLフォーマットの簡単な検証
  try {
    const url = new URL(domain);
    if (
      !url.hostname.includes(".auth.") ||
      !url.hostname.includes(".amazoncognito.com")
    ) {
      updateHostedUIConfigStatus(
        false,
        "正しいAWS Cognitoのドメインを入力してください"
      );
      return false;
    }
  } catch (e) {
    updateHostedUIConfigStatus(false, "正しいURL形式で入力してください");
    return false;
  }

  setSession(SESSION_KEYS.HOSTED_UI_CONFIG, {
    domain: domain,
  });
  updateHostedUIConfigStatus(true, "Hosted UI - 設定済みです");

  // 入力欄を閉じる
  document.getElementById("hostedUIConfigInputs").classList.add("hidden");
  const icon = document.getElementById("toggleHostedUIIcon");
  icon.textContent = "▶";
  icon.style.transform = "rotate(0deg)";

  return true;
}

function updateHostedUIConfigStatus(isValid, message) {
  const statusDiv = document.getElementById("hostedUIConfigStatus");

  if (isValid) {
    statusDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-green-500">✅</span>
        <span>${message}</span>
      </div>
    `;
    statusDiv.className =
      "mt-6 text-green-800 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400 font-medium";
  } else {
    statusDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-red-500">❌</span>
        <span>${message}</span>
      </div>
    `;
    statusDiv.className =
      "mt-6 text-red-800 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400 font-medium";
  }
}

// HostedUIの認証URLを生成
export function generateAuthURL(config, hostedUIConfig) {
  const currentOrigin = window.location.origin;
  const basePath = window.location.pathname.includes("/cognito-demo/")
    ? "/cognito-demo"
    : "";
  const redirectUri = `${currentOrigin}${basePath}/callback.html`;

  const authUrl = new URL(`${hostedUIConfig.domain}/oauth2/authorize`);
  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid email profile");

  return authUrl.toString();
}
