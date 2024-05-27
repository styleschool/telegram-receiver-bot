const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Read the token from the 'token' file
const token = fs.readFileSync('token', 'utf8').trim();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches any message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Send back 'Hello, World!' to the sender
    bot.sendMessage(chatId, 'Hello, World!');
});

console.log("Bot is running...");
