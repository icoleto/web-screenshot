// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

exports.analize = async (url) => {
  try {
    browser = await puppeteer.launch({
      args: getPupppeterArgs(),
      // headless: false,
    });
    const page = await browser.newPage();

    // Set a random user agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0.2',
      // Add more user agents as needed
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    await page.goto(url, { waitUntil: "networkidle0" });
    const hostname = await page.evaluate(() => {
      return window.location.hostname;
    });

    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      let but = document.querySelector(".more-photos");
      if (but) {
        return Promise.resolve(but.click());
      }
    });

    await page.waitForTimeout(1000);

    await autoScroll(page);

    await page.waitForTimeout(1000);

    await page.setViewport({ width: 1920, height: 1080 });

    const screenshot = await page.screenshot({
      // path: "image.png",
      fullPage: true,
    });
    return { screenshot, hostname };
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
      var distance = 250;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

function getPupppeterArgs() {
  const args = [];
  args.push("--no-sandbox");
  if (process.env.PROXY_PAGE) {
    args.push(`--proxy-server=${process.env.PROXY_PAGE}`);
  }
  return args;
}


function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
