const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const now = require('moment');
const moment = require('moment-timezone');

const actions = require('./actions');

dotenv.config();

const client = require('twilio')(
                  process.env.ACCOUNT_SID,
                  process.env.AUTH_TOKEN
               );

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const URL = `https://egov.uscis.gov/casestatus/`;

  const RECEIPT_NUMBER_SELECTOR = `#receipt_number`;
  const CHECK_STATUS_BUTTON_SELECTOR = `#landingForm > div > div.container > div > div.case-status-info3 > fieldset > div:nth-child(2) > div.filed-box.col-lg-6 > input`;
  const STATUS_SELECTOR = `body > div.main-content-sec.pb40 > form > div > div.container > div > div > div.col-lg-12.appointment-sec.center > div.rows.text-center > h1`;

  let message = '';

  try {
    await page.goto(URL);
    await page.waitForNavigation();

    await page.click(RECEIPT_NUMBER_SELECTOR);
    await page.keyboard.type(process.env.RECEIPT_NUMBER);

    await page.click(CHECK_STATUS_BUTTON_SELECTOR);

    await page.waitForSelector(STATUS_SELECTOR);

    const element = await page.$(STATUS_SELECTOR);
    const status = await page.evaluate(element => element.textContent, element);

    let day = moment().tz("America/Los_Angeles").format('DD MMMM, YYYY');
    let time = parseInt(moment().tz("America/Los_Angeles").format('HH'));

    let timeOfDay = (time > 12) ? '🌙' : '☀️';

    let dayLottery = moment('11 April, 2019', 'DD MMMM, YYYY').tz("America/Los_Angeles");
    let dayReceipt = moment('24 April, 2019', 'DD MMMM, YYYY').tz("America/Los_Angeles");
    let dayToday = now(day, 'DD MMMM, YYYY');

    daysSinceLottery = now.duration(dayToday.diff(dayLottery)).asDays();
    daysSinceReceipt = now.duration(dayToday.diff(dayReceipt)).asDays();

    message = `${actions.action[status]}
The status of Receipt ${process.env.RECEIPT_NUMBER} as of ${day} [${timeOfDay}] is '${status}'.

⏰ since lottery : ${daysSinceLottery} days
⏰ since receipt : ${daysSinceReceipt} days`;

    browser.close();

  } catch(err) {
    message = `❌ : ${err}`;
  }

  client.messages
    .create({
       body: message,
       from: process.env.TWILIO_NUMBER,
       to: process.env.MY_NUMBER
     })
    .then(message => console.log(message.sid));

  console.log(message);
}

run();
