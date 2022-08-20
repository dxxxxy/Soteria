# Discord.js Template
Easy to use and configure discord.js bot template with dotenv and mongoose pre-integrated.
## npm Dependencies
```js
├── discord.js@12.2.0
├── dotenv@9.0.2
└── mongoose@5.12.10
```
## .env Configuration
```js
# Necessary
CLIENT_TOKEN="" //your bot's client token
PREFIX="" //your own prefix

# Optional
DATABSE=""
```
## Installation
1. Clone this repository using <kbd>git clone https://github.com/DxxxxY/Discord.js-Template.git</kbd>
2. Install dependencies using <kbd>npm i</kbd>
3. Create a `.env` file while following [.env Configuration](#env-configuration)
4. Start the bot using <kbd>node .</kbd>
> Congrats, you made it!
## How to use
- If you want to create a command, do so in the `commands` folder, the file should have the intended command's name as its file name.
> You can check out the [info](commands/info.js) command's comments to familiarize yourself more with this template.
- If you want to create an event, do so in the `events` folder, the file should have the intended event's name as its file name.
> You can find all the event names at: [Client Event List](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-applicationCommandCreate).

> You can check out the [ready](events/ready.js) event's comments to familiarize yourself more with this template.
