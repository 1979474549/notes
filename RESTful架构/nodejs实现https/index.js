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
