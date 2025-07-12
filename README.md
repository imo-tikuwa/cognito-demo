# cognito-demo

- AWS Cognito の勉強リポジトリです
- 認証後のIDトークン情報（クレーム）の内容確認やIDプールを介したクレデンシャルの発行の検証を行います

## 動作確認に必要なもの
1. Cognito ユーザープール
2. Cognito ID プール
3. メールアドレスとパスワードで認証する Cognito ユーザー

など

**※検証用の AWS リソースの作成については [notes](https://github.com/imo-tikuwa/cognito-demo/tree/main/notes) 以下のドキュメントを参照してください**

## 経緯
1. Cgnito ユーザープールのグループ自体に IAM ロールが設定できる
2. 使い方がよくわからない
  - グループの IAM ロールを設定すると認証時に発行される ID トークン（JWT）の中身に `cognito:roles` と `cognito:preferred_roles` というクレームが生えることは分かってる（ドキュメントにも書いてある）
3. ID プールの設定として `cognito:group` クレームを条件とした IAM ロールの割り当てを行う方針とした
4. 不要となったグループ自体の IAM ロールを削除しようとしたところ削除できないことが判明した
5. JWT の中には使わないクレームが残り続けてしまう。。。

## ローカルでの動作確認

言語については特に制限ないので好きな言語のサーバーを立てての確認で OK

- Node.js（npm）がインストールしてるのであれば `npx http-server docs -p 3000`
  - 2025/7/12 これまでは [serve](https://www.npmjs.com/package/serve) を使用していたが `.html` を取り除く 301 リダイレクトが原因で Hosted UI に関する検証に不都合があったため [http-server](https://www.npmjs.com/package/http-server) に乗り換え
- PHP がインストールしてるのであれば `php -S localhost:3000 -t docs`

など

