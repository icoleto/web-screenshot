const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const services = require("./services");
const VERSION = require("./package.json").version;
let LAST_COMMIT = null;
if (process.env.NODE_ENV !== "production") {
  const child_process = require("child_process");
  LAST_COMMIT = child_process.execSync("git rev-parse HEAD").toString().trim();
} else {
  LAST_COMMIT = process.env.HEROKU_SLUG_COMMIT;
}

app.use(express.static("public"));

app.get("/web", async (req, res) => {
  console.log(req.query["url"]);
  const { screenshot, hostname } = await services.analize(req.query["url"]);
  var img = Buffer.from(screenshot, "base64");

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": img.length,
    "Content-Disposition": `attachment; filename="${hostname}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.png"`,
  });
  res.end(img);
});

app.get("/", function (req, res) {
  res.sendFile("public/index.html");
});

app.get("/version", function (req, res) {
  res.send({ version: VERSION, commit: LAST_COMMIT });
});

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
