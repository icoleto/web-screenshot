// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
 
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

exports.analize = async (url) => {
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      // headless: false,
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
      let but = document.querySelector(".more-photos");
      if (but) {
        return Promise.resolve(but.click());
      }
    });
    await autoScroll(page);
    await page.setViewport({ width: 1920, height: 1080 });

    const screenshot = await page.screenshot({
      // path: "image.png",
      fullPage: true,
    });
    return screenshot;
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 200;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
}
