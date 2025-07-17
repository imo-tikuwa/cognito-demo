# README

AWS Cognito の各種検証について、セットアップ手順や補足メモを記載しています。

動作確認でマネジメントコンソールを使用しますがリソースの操作は全て AWS CLI で実施しています。

## ページ一覧

**`🔔上にあるものほど古いです。下にあるものは上にある記事の中で行った作業を前提としています。`**

| 記事名 | 概要、備考 |
|------------|----------|
| [setup_auth-and-token-verify.md](setup_auth-and-token-verify.md) | ユーザープール、ユーザー、アプリクライアントなどを作成<br />アプリからの認証を検証 |
| [setup_auth-and-token-verify2.md](setup_auth-and-token-verify2.md) | ユーザープールグループを作成<br />グループにユーザーを追加などを実施 |
| [setup_auth-and-token-verify3.md](setup_auth-and-token-verify3.md) | グループに IAM ロールを割り当てた際の動作確認を実施 |
| [setup_federated-identity.md](setup_federated-identity.md) | ID プール、ユーザープールグループ、2つの異なるポリシーを持つ IAM ロールなどを作成<br />グループに IAM ロールを設定し preferred_role クレームベースのロール割り当ての検証 |
| [setup_federated-identity2.md](setup_federated-identity2.md) | ID プールについてルールベースのロール割り当ての検証を実施 |
| [setup_hosted-ui-login.md](setup_hosted-ui-login.md) | Hosted UI に関する検証の仕掛かり（これまでの手順で意図せず？作成していたリソースなどの削除） |
| [setup_hosted-ui-login2.md](setup_hosted-ui-login2.md) | ユーザープールドメインを作成、アプリクライアントのマネージドログインページに関する設定などを実施<br />その他、ユーザーからのサインアップの無効化も行っています |
| [setup_hosted-ui-login3.md](setup_hosted-ui-login3.md) | Hosted UI に関する一連の動作確認を実施 |
| [setup_hosted-ui-login4.md](setup_hosted-ui-login4.md) | Hosted UI に関するログアウト関連の動作確認を実施 |
| [setup_managed-login.md](setup_managed-login.md) | Hosted UI について2025年現在利用を推奨されているマネージドログインに移行する作業を実施<br />マネージドログイン用のスタイルを作成<br />スタイルについて aws-cli 上で更新など実施 |
| [setup_update-user-attributes.md](setup_update-user-attributes.md) | ユーザープールで標準で管理されている各種属性について Read / Update / Delete の検証 |
| [setup_multi-factor-authentication.md](setup_multi-factor-authentication.md) | ユーザープール、ユーザー、アプリクライアントを更新<br />Authenticator アプリを使用した MFA 付き認証の検証 |
| [setup_lambda-trigger.md](setup_lambda-trigger.md) | ユーザープールの Lambda トリガー、Lambda 関数、DynamoDB テーブルなどを作成＆設定<br />検証内容として認証後のイベントにフックする形で Lambda 関数を呼び出し、ログインしたユーザー情報を DynamoDB に記録するような動作を確認<br />トリガー先の一連のリソースは AWS SAM を使用して開発（同プロジェクト内の cognito-demo-triggers） |
