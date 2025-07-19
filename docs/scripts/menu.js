// メニュー項目の定義
const MENU_ITEMS = [
  {
    id: "home",
    title: "🏠 ホーム",
    href: "index.html",
    description: "トップページ",
  },
  {
    id: "auth-token-verify",
    title: "🔐 認証＆IDトークンの中身を確認",
    href: "auth-and-token-verify.html",
    description: "USER_PASSWORD_AUTH 認証フローを使用",
  },
  {
    id: "try-refresh",
    title: "🔁 リフレッシュトークンを使用した再認証",
    href: "try-refresh.html",
  },
  {
    id: "federated-identity1",
    title: "🆔 IDプールを使用したクレデンシャル発行とその確認",
    href: "federated-identity1.html",
    description: "@aws-sdk/client-cognito-identity を使用",
  },
  {
    id: "federated-identity2",
    title: "🆔 IDプールを使用したクレデンシャル発行とその確認",
    href: "federated-identity2.html",
    description: "@aws-sdk/credential-providers を使用",
  },
  {
    id: "hosted-ui-verify",
    title: "🔐 Hosted UI（およびマネージドログイン）を使用した認証を検証",
    href: "hosted-ui-verify.html",
  },
  {
    id: "hosted-ui-signout",
    title:
      "🚪 Hosted UI（およびマネージドログイン）を使用した認証状態の解除（サインアウト）を検証",
    href: "hosted-ui-signout.html",
  },
  {
    id: "update-user-attributes",
    title: "✏️ 認証中のユーザーの属性更新を検証",
    href: "update-user-attributes.html",
  },
];

// 現在のページを判定
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";
  return filename === "" ? "index.html" : filename;
}

// メニューHTMLの生成
function generateMenuHTML() {
  const currentPage = getCurrentPage();

  return `
    <!-- メニューオーバーレイ -->
    <div id="menu-overlay" class="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-40 hidden transition-opacity duration-300 opacity-0"></div>
    
    <!-- サイドメニュー -->
    <div id="side-menu" class="fixed top-0 left-0 h-full w-160 bg-white shadow-2xl transform -translate-x-full transition-transform duration-300 z-50 flex flex-col">
      <!-- メニューヘッダー -->
      <div class="bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold">🔧 AWS Cognito デモ</h2>
          <button 
            id="menu-close-btn" 
            class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            aria-label="メニューを閉じる"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- メニュー項目 -->
      <div class="flex-1 overflow-y-auto py-4">
        <nav class="px-4 space-y-2">
          ${MENU_ITEMS.map((item) => {
            const isActive = currentPage === item.href;

            return `
              <a 
                href="${item.href}" 
                class="block px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }"
              >
                <div class="flex items-center gap-2">
                  <div class="font-medium text-sm leading-relaxed">${
                    item.title
                  }</div>
                  ${
                    item.description
                      ? `<div class="text-xs text-gray-500 group-hover:text-gray-600 ${
                          isActive ? "text-blue-600" : ""
                        } whitespace-nowrap">（${item.description}）</div>`
                      : ""
                  }
                </div>
              </a>
            `;
          }).join("")}
        </nav>
      </div>
      
      <!-- メニューフッター -->
      <div class="border-t border-gray-200 px-4 py-4 bg-gray-50">
        <div class="text-xs text-gray-600 space-y-2">
          <div class="flex items-center gap-2">
            <span>📝</span>
            <a href="https://github.com/imo-tikuwa/cognito-demo" target="_blank" class="hover:text-blue-600 underline">GitHub リポジトリ</a>
          </div>
          <div class="flex items-center gap-2">
            <span>📄</span>
            <a href="https://github.com/imo-tikuwa/cognito-demo/tree/main/notes" target="_blank" class="hover:text-blue-600 underline">ドキュメント</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- メニュー開閉ボタン -->
    <button 
      id="menu-toggle-btn" 
      class="fixed top-4 left-4 z-30 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105
             bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800"
      aria-label="メニューを開く"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  `;
}

// メニューの初期化
function initializeMenu() {
  // 既存のメニューがあれば削除
  const existingMenu = document.getElementById("cognito-demo-menu");
  if (existingMenu) {
    existingMenu.remove();
  }

  // メニューコンテナを作成
  const menuContainer = document.createElement("div");
  menuContainer.id = "cognito-demo-menu";
  menuContainer.innerHTML = generateMenuHTML();
  document.body.appendChild(menuContainer);

  // イベントリスナーの設定
  setupMenuEvents();
}

// メニューのイベントリスナー設定
function setupMenuEvents() {
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const menuCloseBtn = document.getElementById("menu-close-btn");
  const menuOverlay = document.getElementById("menu-overlay");
  const sideMenu = document.getElementById("side-menu");

  // メニューを開く
  function openMenu() {
    sideMenu.classList.remove("-translate-x-full");
    menuOverlay.classList.remove("hidden");
    // オーバーレイのフェードイン効果
    setTimeout(() => {
      menuOverlay.classList.remove("opacity-0");
      menuOverlay.classList.add("opacity-100");
    }, 10);
    document.body.style.overflow = "hidden";
  }

  // メニューを閉じる
  function closeMenu() {
    sideMenu.classList.add("-translate-x-full");
    menuOverlay.classList.remove("opacity-100");
    menuOverlay.classList.add("opacity-0");
    // アニメーション完了後にhiddenクラスを追加
    setTimeout(() => {
      menuOverlay.classList.add("hidden");
    }, 300);
    document.body.style.overflow = "";
  }

  // イベントリスナーの登録
  menuToggleBtn?.addEventListener("click", openMenu);
  menuCloseBtn?.addEventListener("click", closeMenu);
  menuOverlay?.addEventListener("click", closeMenu);

  // ESCキーでメニューを閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  // メニュー内のリンクがクリックされた時にメニューを閉じる
  const menuLinks = sideMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });
}

// メニューの表示/非表示制御（index.htmlでは非表示）
function shouldShowMenu() {
  const currentPage = getCurrentPage();
  return currentPage !== "index.html";
}

// 自動初期化（DOMContentLoadedで実行）
function autoInitialize() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (shouldShowMenu()) {
        initializeMenu();
      }
    });
  } else {
    if (shouldShowMenu()) {
      initializeMenu();
    }
  }
}

// 手動初期化用の関数をエクスポート
export { initializeMenu, shouldShowMenu, MENU_ITEMS };

// 自動初期化を実行
autoInitialize();
