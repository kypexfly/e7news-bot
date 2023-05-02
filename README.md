# Epic 7 Discord Bot

This project was bootstrapped from [Discord.js v14 Bot Template](https://github.com/MericcaN41/discordjs-v14-template-ts).

## Features

* Get Epic Seven news from STOVE
* Get chest password for watching videos
* Get timeline banners from CeciliaBot

## To do (low priority)

* Use proper cache system for database
* Add proper automate tests
* Improve error handling

## Installation

Clone the repository then create a file named `.env` and fill it out accordingly

```
TOKEN="YOURTOKENHERE"
CLIENT_ID="BOTS CLIENT ID"
PREFIX="$"
NEWS_CHECK_CRON="A CRON TIME STRING"
TIMELINE_CHECK_CRON="A CRON TIME STRING"
MONGO_URI="YOUR MONGO CONNECTION STRING"
MONGO_DATABASE_NAME="YOUR DATABASE NAME"
```

Build the project using the typescript module and start the bot using the `npm start` command
