# GakuWa
### ~ 学生の「輪（コミュニティ）」や「話（情報共有）」 ~
## 開発背景
学生がアプリ開発をしたり技術力を高めたい場合、一人でやるにはモチベーションが上がらないし、チームでやるにはハードルが高いといった問題がある。そこで、学生が気軽にコミュニティに参加しチームでアプリを作成。そして、そこで得た知見などを情報共有できるプラットフォームが欲しいと思った。

<br>

## 🛠️ 使用技術
### フロントエンド
- React

### バックエンド
- Express.js (Node.js)

### データベース
- MySQL

### インフラ
- Docker / Docker Compose
- nginx
- MinIO (S3 Compatible Object Storage)
- MailHog (Mail Testing Tool)

### その他
- Git / GitHub

<br>

## セットアップ手順
<details><summary>Gitとは</summary>
Gitとは、
</details>
<details><summary>Githubとは</summary>
Githubとは、
</details>
<details><summary>Dockerとは</summary>
とは、
</details>

### 1　Gitのセットアップ
ubuntu上で以下のコマンドを実行してください
```
 $ sudo apt update
 $ sudo apt install git
```
バージョンを確認( 実行して　git version 2.43.0 のように出てきたら成功)
```
 $ git --version
```
Gitにアカウントを設定します
```
$ git config --global user.name "<ユーザ名>"
$ git config --global user.email "<メールアドレス>"
```

### 2　Docker Desktop(windows用)のインストール
手順１　Docker Desktop for Windows をダウンロード <br>
https://www.docker.com/ja-jp/products/docker-desktop/

手順２　インストール時にチェックすべき項目（超重要）
インストーラー途中で次の項目を 必ず ON にする：
 -  ☑ Use WSL 2 instead of Hyper-V
 -  ☑ Add shortcut to desktop
 -  ☑ Install required components for WSL 2（出る場合）


手順３　WSL（Ubuntu）から Docker を使えるか確認
```
 ~$ docker --version
 ~$ docker compose version
```
両方のバージョンが出たら成功

[参考サイト](https://zenn.dev/upgradetech/articles/8e8b82e9d5c494)
### 3　ローカルPC上でサーバーを立てる
  手順１　ubuntu上で以下のコマンドを実行し、GithubのレポジトリをローカルPCにクローンする
  ```
   ~$ git clone https://github.com/souma1024/GakuWa.git
  ```
  
  手順２　Dockerデスクトップを起動する
  
  手順３　以下のコマンドをしdockerコンテナを立てる（ローカルPC上にサーバーが立ち上がる）
  ```
   ~/ cd gakuwa
   ~/gakuwa$ docker compose up 
  ```
  
  各サーバーへのアクセスは以下から <br>
  http://localhost:8080/ ：webサーバ（フロントエンド）　<br>
  http://localhost:3000/ ：webサーバ（バックエンド）　<br>
  http://localhost:8025/ ：MailHogサーバ　<br>
  http://localhost:9001/ ：MinIOサーバ　<br>

<br>

## 開発の進め方


<br>

## 参考のサイト
