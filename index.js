const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const services = require('./services')
import * as child_process from 'child_process';
const LAST_COMMIT = child_process.execSync('git rev-parse --short HEAD')

app.use(express.static("public"));

app.get("/web", async (req, res) => {
    console.log(req.query["url"]);
    const {screenshot, hostname} = await services.analize(req.query["url"]);
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
  res.send(LAST_COMMIT);
}); 

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
new Date().get
