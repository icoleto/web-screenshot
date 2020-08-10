const express = require("express");
const app = express();
const port = 3001;
const services = require('./services')
app.get("/web", async (req, res) => {
    console.log(req.query["url"]);
    const data = await services.analize(req.query["url"]);
        var img = Buffer.from(data, "base64");

        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": img.length,
        });
        res.end(img); 
});

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
