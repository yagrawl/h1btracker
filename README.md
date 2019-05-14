# Tracker

H1B tracker using puppeteer.

## Instructions

Clone the repository:
```
git clone https://github.com/yagrawl/h1btracker.git
```

Go to the directory and install all the required NPM modules:
```
cd h1btracker && npm i
```

Create a .env file within the directory:
```
touch .env
```

Go to [Twilio](https://www.twilio.com/try-twilio) and sign up for an account.
Obtain a messaging number and confirm your phone number.

In the `.env` file add the following environment variables:
```
ACCOUNT_SID={enter twilio account sid}
AUTH_TOKEN={enter twilio auth token}
RECEIPT_NUMBER={enter your receipt number}
TWILIO_NUMBER={enter twilio number}
MY_NUMBER={enter your phone number}
```

To host a CRON job use a service like [Render](https://render.com/).

This is designed to run twice in a day so in the CRON job schedule field
enter `0 16/12 * * *` which runs the program twice every day, once at 9 AM and
then at 9 PM PST. Don't forget to add the environment variables in the render
CRON job.

This will send a message like
```
:hourglass_flowing_sand: #ACTION.
The status of Receipt '#YOUR_RECEIPT_NUMBER' as of '#DATE' [:sunny:] is '#STATUS'.

:alarm_clock: since lottery : '#X' days
:alarm_clock: since receipt : '#Y' days
```
