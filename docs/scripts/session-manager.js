// セッションストレージのキー
export const SESSION_KEYS = {
  AUTH_DATA: "cognito_auth_data",
  CONFIG: "cognito_config",
  IDENTITY_POOL_CONFIG: "cognito_identity_pool_config",
};

/**
 * セッションデータを保存
 * @param {string} key - セッションキー
 * @param {any} data - 保存するデータ
 */
export function setSession(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * セッションデータを取得
 * @param {string} key - セッションキー
 * @returns {any|null} - 取得したデータまたはnull
 */
export function getSession(key) {
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * 特定のセッションデータを削除
 * @param {string} key - セッションキー
 */
export function removeSession(key) {
  sessionStorage.removeItem(key);
}

/**
 * 全セッションデータをクリア
 */
export function clearAllSessions() {
  Object.values(SESSION_KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
  });
}
