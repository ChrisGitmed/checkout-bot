import { config } from './config.js';
import { exit } from 'node:process';
import { log } from 'node:console';
import puppeteer from 'puppeteer';

/**
 * This script should use the puppeteer package to open a new browser window.
 * The browser should then navigate to any specified product URLs, and add the item(s) to the cart.
 * Once the item(s) are added to the cart, the bot should then securely checkout, filling out
 * any necessary forms along the way. Finally, a notification should be send to the User that the
 * item(s) were checkout out.
 *
 * ! This is currently throwing the following error:
 * !   Error: net::ERR_CERT_AUTHORITY_INVALID at https://www.walmart.com/search?q=Pokemon+Trading+Cards
 *
 * TODO: Once the above error is fixed, the script should be updated to go directly to the desired product URL
 * TODO: (Not MVP): Send SMS/RCS notification
 * TODO: (Not MVP): Can I update this to visit multiple URLs in parallel?
 *
 */
(async () => {
  // Instantiate the browser, leveraging a proxy server to avoid bot detection systems
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--proxy-server=http://${config.PROXY_SERVER}:${config.PROXY_SERVER_PORT}`,
    ],
  });

  try {
    // Open a new page and set authentication credentials
    const page = await browser.newPage();
    await page.authenticate({
      username: config.PROXY_USERNAME,
      password: config.PROXY_PASSWORD,
    });

    // Go to the target URL
    const targetUrl = 'https://www.walmart.com/search?q=Pokemon+Trading+Cards';
    await page.goto(targetUrl, {
      waitUntil: 'load',
    });

    // TODO: Click 'Add To Cart'

    // TODO: Checkout
  } catch (err) {
    // If any error is throw, log it to the console
    log(err);
  } finally {
    // Finally, close the browser instance
    browser.close;
  }
  log('Fin!');
  exit(0);
})();
