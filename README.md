# 我的記帳小幫手

![](https://upload.cc/i1/2023/05/15/JExwhS.jpg)

## 介紹

##### 紀錄屬於自己的帳戶支出，使用者可以登入帳戶、記錄支出、新增及刪除支出、依照分類瀏覽支出狀況。

## 功能

- 查看所有支出 
- 根據類別篩選支出並瀏覽類別總和
- 新增支出  
- 編輯支出  
- 刪除支出 
- 註冊帳號，登入，登出
- 可以用 Facebook Login

## 開始使用 

1. 請先確認有安裝 node.js 與 npm
2. 將專案 clone 到本地
```javascript
git clone https://github.com/jiasyuanchu/expense-tracker
```
3. 在本地開啟之後，透過終端機進入資料夾，輸入：
```javascript
npm install
```
4. 安裝完畢後，設定環境變數連線 MongoDB
```javascript
MONGODB_URI=mongodb+srv://<Your MongoDB Account>:<Your MongoDB Password>@cluster0.xxxx.xxxx.net/<Your MongoDB Table><?retryWrites=true&w=majority
```
5. 繼續輸入：
```javascript
npm run start
```
6. 若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址
```javascript
Listening on http://localhost:3000
```

7. 製作種子資料 (會做出2個dummy帳號，裡面各有3筆dummy data)
```javascript
npm run seed
```

8. 暫停使用
```javascript
ctrl + c
```

9. 中斷後要再次啟動伺服器，執行app.js檔案
```javascript
npm run dev
```

10. 製作 .env檔案，可以參考 .env.example


## 開發工具

- Node.js v18.13.0
- Express v4.18.2
- Express-Handlebars v4.0.2
- express-session v1.17.1
- express-handlebars v0.10.0
- Bootstrap v5.1.3
- MongoDB
- mongoose 5.9.7
- method-override v3.0.0
- passport" 0.4.1
- body-parser v1.20.2
- passport-local v1.0.0
- dotenv v16.0.3
