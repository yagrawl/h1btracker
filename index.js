const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

const client = require('twilio')(
                  process.env.ACCOUNT_SID,
                  process.env.AUTH_TOKEN
               );

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  const URL = `https://egov.uscis.gov/casestatus/`;
  const RECEIPT_NUMBER = `WAC1917951037`;

  const RECEIPT_NUMBER_SELECTOR = `#receipt_number`;
  const CHECK_STATUS_BUTTON_SELECTOR = `#landingForm > div > div.container > div > div.case-status-info3 > fieldset > div:nth-child(2) > div.filed-box.col-lg-6 > input`;
  const STATUS_SELECTOR = `body > div.main-content-sec.pb40 > form > div > div.container > div > div > div.col-lg-12.appointment-sec.center > div.rows.text-center > h1`;

  await page.goto(URL);
  await page.waitForNavigation();

  await page.click(RECEIPT_NUMBER_SELECTOR);
  await page.keyboard.type(RECEIPT_NUMBER);

  await page.click(CHECK_STATUS_BUTTON_SELECTOR);

  await page.waitForSelector(STATUS_SELECTOR);

  const element = await page.$(STATUS_SELECTOR);
  const text = await page.evaluate(element => element.textContent, element);

  client.messages
    .create({
       body: text,
       from: '+12172882029',
       to: '+12178191201'
     })
    .then(message => console.log(message.sid));

  console.log(text);

  browser.close();
}

run();
