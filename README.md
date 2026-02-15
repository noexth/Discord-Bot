# 💎 Discord Utility Bot

A modular Discord bot built with **discord.js v14** designed for
community management, RPG roles, automation, and server utilities.

------------------------------------------------------------------------

## ✨ Features

-   Modular Slash Command Handler
-   Welcome Message (Embed)
-   Reaction Role Panel
-   Sticker Manager (Upload & Delete)
-   Scalable Event Handler System
-   Environment Configuration (.env)
-   Per‑guild command deployment

------------------------------------------------------------------------

## 🏗️ Architecture

The bot uses a **Command Handler + Event Handler** architecture.

    Discord-Bot/
    │
    ├── deploy-commands.js
    ├── package.json
    ├── .env
    │
    └── src/
        ├── index.js
        │
        ├── commands/
        │   ├── utility/
        │   │   ├── ping.js
        │   │   └── rolesetup.js
        │   │
        │   ├── moderation/
        │       └── ...
        └── events/
            ├── ready.js
            ├── interactionCreate.js
            ├── guildMemberAdd.js
            └── messageReactionAdd.js

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone Repository

``` bash
git clone https://github.com/username/discord-bot.git
cd discord-bot
```

### 2. Install Dependencies

``` bash
npm install
```

------------------------------------------------------------------------

## 🔐 Environment Configuration

Create a `.env` file:

    TOKEN=YOUR_BOT_TOKEN
    CLIENT_ID=APPLICATION_ID
    GUILD_ID=SERVER_ID
    WELCOME_CHANNEL_ID=CHANNEL_ID

> Never commit your `.env` file.

------------------------------------------------------------------------

## 🚀 Running the Bot

### Register Slash Commands

``` bash
node deploy-commands.js
```

### Start Bot

``` bash
node src/index.js
```

------------------------------------------------------------------------

## 🔑 Required Bot Permissions

Recommended permissions:

-   Send Messages
-   Manage Roles
-   Add Reactions
-   Read Message History
-   Manage Emojis and Stickers
-   View Channels

Also enable in Developer Portal: - MESSAGE CONTENT INTENT - SERVER
MEMBERS INTENT

------------------------------------------------------------------------

## 🧩 Creating a New Command

Create a file inside:

    src/commands/<category>/commandname.js

Basic template:

``` js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('description'),

    async execute(interaction) {
        await interaction.reply('Hello World!');
    }
};
```

Then redeploy commands:

    node deploy-commands.js

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   Node.js
-   discord.js v14
-   dotenv

------------------------------------------------------------------------

## 📌 Troubleshooting

If slash commands show **"The application did not respond"**,\
your `interactionCreate` event did not call `reply()` or `deferReply()`.

------------------------------------------------------------------------

## 📜 License

MIT License --- free to use and modify.
