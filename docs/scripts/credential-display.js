export function setupCredentialDisplay() {
  // イベントリスナーを設定
  document
    .getElementById("copyAwsCliCommand")
    .addEventListener("click", copyAwsCliCommand);
}

// aws-cliでS3のバケット一覧取得を行うコマンドをクリップボードにコピー
// ※ブラウザ上ではS3バケット一覧の取得についてCORS由来のエラーになるため aws-cli で検証するためのワンライナーをコピーする
function copyAwsCliCommand() {
  const accessKeyId = document.getElementById("accessKeyId").innerText;
  const secretKey = document.getElementById("secretKey").innerText;
  const sessionToken = document.getElementById("sessionToken").innerText;
  const region = document.getElementById("region").innerText;
  const cmd = `AWS_ACCESS_KEY_ID=${accessKeyId} AWS_SECRET_ACCESS_KEY=${secretKey} AWS_SESSION_TOKEN=${sessionToken} AWS_DEFAULT_REGION=${region} aws s3 ls`;
  navigator.clipboard.writeText(cmd).then(() => {
    alert("aws-cli用コマンドをクリップボードにコピーしました");
  });
}
