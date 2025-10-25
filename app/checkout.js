import { config } from './config.js';
import { exit } from 'node:process';
import { log } from 'node:console';
import puppeteer from 'puppeteer';

// Simple logging/debugging function to log 'Clicked' on button click
const clickButton = async (page, selector) => {
  await page.$eval(selector, (button) => {
    button.click();
  });
  console.log('Clicked');
};

// Tell the node process to sleep for `x` milliseconds
const sleep  = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Define the target URLs
const targetUrls = [
  // 'https://www.walmart.com/ip/Scarlet-Violet-Mega-Evolution-Booster-Bundle/17344505131?classType=REGULAR&athbdg=L1102&from=/search',
  'https://www.amazon.com/Diamond-Crystal-Kosher-Salt-Additives/dp/B0BQPXDF8X/ref=sr_1_1_pp?crid=NR59PY891JAL&dib=eyJ2IjoiMSJ9.mpKpftlM6UTPhBQ1dCHSrDr7eBLPT7388OAdSVHVG-rGY-PU8VNnozQ0X71F2ASWHEUU1-WAP3oW7c-ghz7jD4UE3RyWpxtaIvOHYI0toIUUCOcm2Bo6Xva6VrgDBqtoRW5RcHiZY21wggU54qeYokKVSpD_VKU9PnHP3egXKF27YHrIJnshEKriRxICVQkyA7rBf5_8YXG0R91pohDIaDJEYRDMMA1i4-Hm5gJezColuZDU9Kj1ecD0oiR_D1-UvV8C5CBR4OMdkW6ixAvowMuy4rJQdrtcXHDB3PuRAw0.RYrDam_-4-e1R0ZOOPVtro4kNKCaH8-2yShzGN4DLH8&dib_tag=se&keywords=kosher%2Bsalt&qid=1761362047&sprefix=kosher%2Bsal%2Caps%2C172&sr=8-1&th=1',
];

// Instantiate the browser, leveraging a proxy server
const browser = await puppeteer.launch({
  headless: false,
  args: [
    `--proxy-server=http://${config.PROXY_SERVER}:${config.PROXY_SERVER_PORT}`,
  ],
});

/**
 * This script should use the puppeteer package to open a new browser window.
 * The browser should then navigate to any specified product URLs, and add the item(s) to the cart.
 * Once the item(s) are added to the cart, the bot should then securely checkout, filling out
 * any necessary forms along the way. Finally, a notification should be send to the User that the
 * item(s) were checkout out.
 *
 * ! This script needs to be tailored for each specific vendor. MVP will be specific to amazon.com
 */
(async () => {
  try {
    // Open a new page and set authentication credentials
    const page = await browser.newPage();
    await page.authenticate({
      username: config.PROXY_USERNAME,
      password: config.PROXY_PASSWORD,
    });

    // Go to the product URL
    await page.goto(targetUrls[0], {
      timeout: '180000',
      waitUntil: 'domcontentloaded',
    });
    log('Page loaded');
    sleep(2000);

    // Click 'Add To Cart'
    await Promise.all([
      page.waitForNavigation({
        timeout: '180000',
        waitUntil: 'domcontentloaded',
      }),
      clickButton(page, '#add-to-cart-button'),
    ]);
    log('Added item to cart');
    sleep(3000);

    // Click 'Proceed to checkout'
    await Promise.all([
      page.waitForNavigation({
        timeout: '180000',
        waitUntil: 'domcontentloaded',
      }),
      clickButton(page, 'input[name="proceedToRetailCheckout"]'),
    ]);
    log('Proceeded to checkout');
    sleep(3000);

    // TODO: Enter any need checkout details

    // TODO: Submit the checkout form

    // Finally, close the browser
    await browser.close();
  } catch (err) {
    // On any error, log the error to the console, close the browser, and exit with an error code
    log(err);
    browser.close();
    exit(1);
  }

  // If everything succeeds, log out the results of the script and exit with a success code
  log('Fin!');
  exit(0);
})();
