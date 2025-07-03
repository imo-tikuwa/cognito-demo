import { jwtDecode } from "jwt-decode";

/**
 * IDトークンをデコードして画面表示する
 *
 * @param {object} user - currentUser オブジェクト (IdToken を含む)
 * @param {object} options - 表示オプション
 * @param {boolean} options.showRestored - セッション復元時の表示切り替え用
 */
export function updateIdTokenDisplay(user, options = {}) {
  if (!user || !user.IdToken) {
    console.warn("IDトークンが未定義です");
    return;
  }

  try {
    const decoded = jwtDecode(user.IdToken);

    const displayElem = document.getElementById("idTokenDisplay");
    const expiryElem = document.getElementById("tokenExpiry");
    const restoredElem = document.getElementById("sessionRestored");

    if (displayElem) {
      displayElem.textContent = JSON.stringify(decoded, null, 2);
    }

    if (expiryElem && decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000);
      expiryElem.textContent = expiryDate.toLocaleString("ja-JP");
    }

    if (options.showRestored && restoredElem) {
      restoredElem.classList.remove("hidden");
    }
  } catch (err) {
    console.error("IDトークンのデコードに失敗しました", err);
  }
}
