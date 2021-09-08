# HTTPS

如果在过去有人问我什么是 https，那我会像背八股文一样告诉他每一步的细节是什么，但现在我觉得这是一种愚蠢的回答。

https 的本质是一个实现了 SSL/TLS 协议的 HTTP 通信，并不是什么新的东西，所以弄懂了 SSL/TLS，也就明白了 https 是什么。
[SSSL/TLS](SSL&TLS.md)

# nodejs 实现 https

这里主要是通过 openssl 来生成证书，签名和私钥

```
openssl genrsa -out pk.pem 1024 // 生成私钥
openssl req -new -key pk.pem -out certreq.csr // 生成证书签名

openssl x509 -req -in certreq.csr -signkey pk.pem -out certificate.pem // 生成证书
```

有了这三样东西就可以通过 nodejs 中的 https 模块，创建一个 http 连接了，这里用的是 express 框架。

```
const express = require("express");
const fs = require("fs");
const https = require("https");
const http = require("http");

const privateKey = fs.readFileSync("./pk.pem", "utf8"); // 私钥
const certificate = fs.readFileSync("./certificate.pem", "utf8"); // 证书

const credentials = {
  key: privateKey,
  cert: certificate,
};
console.log(credentials);
const app = express();

const httpsServer = https.createServer(credentials, app);
httpsServer.listen("12306", () => {
  console.log("正在监听12306");
});
const httpServer = http.createServer(credentials, app);
httpServer.listen("12307", () => {
  console.log("正在监听12307");
});

app.get("/", (req, res) => {
  if (req.protocol === "https") {
    res.status(200).send("its https");
  } else {
    res.status(200).send("its http");
  }
});

```

好吧，其实这里没什么东西，或者说用 nodejs 来搭一个 https 的服务并没什么卢安用，openssl 自己都证书浏览器是不认的，要用的话还是使用一些三方或者正规的证书颁发机构吧。
