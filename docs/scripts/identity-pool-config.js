import { SESSION_KEYS, setSession, getSession } from "./session-manager.js";

export function setupIdentityPoolConfig() {
  // イベントリスナーを設定
  document
    .getElementById("toggleIdentityPoolConfig")
    .addEventListener("click", () => {
      const inputs = document.getElementById("identityPoolConfigInputs");
      const icon = document.getElementById("toggleIdentityPoolIcon");
      const isHidden = inputs.classList.toggle("hidden");
      icon.textContent = "▶";
      icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(90deg)";
    });
  document
    .getElementById("validateIdentityPoolConfig")
    .addEventListener("click", () => {
      const isValid = validateIdentityPoolConfig();
      if (isValid) {
        document
          .getElementById("credentialVerifySection")
          .classList.remove("hidden");
      }
    });

  // セッションからIDプール設定を復元
  try {
    const savedIdPoolConfig = getSession(SESSION_KEYS.IDENTITY_POOL_CONFIG);
    if (savedIdPoolConfig) {
      // フォームに値を設定
      document.getElementById("identityPoolId").value =
        savedIdPoolConfig.identityPoolId;

      // 設定完了状態を表示
      updateIdentityPoolConfigStatus(true);

      document
        .getElementById("credentialVerifySection")
        .classList.remove("hidden");
      console.log("IDプール設定をセッションから復元しました");
    }
  } catch (error) {
    console.error("IDプール設定の復元エラー:", error);
  }
}

function validateIdentityPoolConfig() {
  const identityPoolId = document.getElementById("identityPoolId").value.trim();
  const statusDiv = document.getElementById("identityPoolConfigStatus");

  if (!identityPoolId) {
    statusDiv.className =
      "mt-6 text-red-700 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400 font-medium";
    statusDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-red-500">❌</span>
        <span>IDプールIDを入力してください</span>
      </div>
    `;
    return false;
  }

  // 保存されたCognito設定からリージョンを取得
  const savedConfig = getSession(SESSION_KEYS.CONFIG);
  if (!savedConfig || !savedConfig.region) {
    statusDiv.className =
      "mt-6 text-red-700 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400 font-medium";
    statusDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-red-500">❌</span>
        <span>Cognito設定が見つかりません。先にCognito設定を完了してください</span>
      </div>
    `;
    return false;
  }

  // IDプール設定を保存
  setSession(SESSION_KEYS.IDENTITY_POOL_CONFIG, {
    identityPoolId: identityPoolId,
    region: savedConfig.region,
  });

  statusDiv.className =
    "mt-6 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400 font-medium";
  statusDiv.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-green-500">✅</span>
      <span>IDプール設定を保存しました</span>
    </div>
  `;

  // 入力欄を閉じる
  document.getElementById("identityPoolConfigInputs").classList.add("hidden");
  const icon = document.getElementById("toggleIdentityPoolIcon");
  icon.textContent = "▶";
  icon.style.transform = "rotate(0deg)";

  return true;
}

// 設定状態を更新
function updateIdentityPoolConfigStatus(isValid) {
  const statusDiv = document.getElementById("identityPoolConfigStatus");

  if (isValid) {
    statusDiv.className =
      "mt-6 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400 font-medium";
    statusDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-green-500">✅</span>
        <span>IDプール設定は設定済みです</span>
      </div>
    `;
  } else {
    statusDiv.className =
      "mt-6 text-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border-l-4 border-amber-400 font-medium";
    statusDiv.innerHTML = "⚙️ IDプール設定を入力してください";
  }
}
