# cognito-demo

- AWS Cognito の勉強リポジトリです
- 認証後のIDトークン情報（クレーム）の内容確認を行います

## 動作確認に必要なもの
1. Cognito ユーザープール
2. メールアドレスとパスワードで認証する Cognito ユーザー

など

`※検証用の AWS リソースの作成については notes 以下のドキュメントを参照してください`

## 経緯
1. Cgnito ユーザープールのグループ自体に IAM ロールが設定できる
2. 使い方がよくわからない
  - グループの IAM ロールを設定すると認証時に発行される ID トークン（JWT）の中身に `cognito:roles` と `cognito:preferred_roles` というクレームが生えることは分かってる（ドキュメントにも書いてある）
3. ID プールの設定として `cognito:group` クレームを条件とした IAM ロールの割り当てを行う方針とした
4. 不要となったグループ自体の IAM ロールを削除しようとしたところ削除できないことが判明した
5. JWT の中には使わないクレームが残り続けてしまう。。。

## ローカルでの動作確認

言語については特に制限ないので好きな言語のサーバーを立てての確認で OK

- Node.js（npm）がインストールしてるのであれば `npx serve docs`
- PHP がインストールしてるのであれば `php -S localhost:3000 -t docs`

など

