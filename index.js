const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Read the token from the 'token' file
const token = fs.readFileSync('token', 'utf8').trim();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const welcomeMessage = `Здравствуйте. Я бот Высшей школы стилистики, дизайна и технологий! Я готов предоставить вам информацию о наших курсах и вариантах обучения. Также я могу перевести вас на другого бота, где вы можете бесплатно проходить обучение.`;

// // Matches any message
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     // Send back 'Hello, World!' to the sender
//     bot.sendMessage(chatId, welcomeMessage);
// });

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  bot.sendMessage(message.chat.id, `You selected option ${data}`);
});

// Matches /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send back 'Hello, World!' to the sender
  bot.sendMessage(chatId, welcomeMessage).then(() => {

    // Send follow-up question with options
    bot.sendMessage(chatId, 'Как я могу быть вам полезен?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Информация о курсах', callback_data: '1' }],
          [{ text: 'Оставить заявку для связи', callback_data: '2' }],
          [{ text: 'Хочу учиться бесплатно!', callback_data: '3' }]
        ]
      }
    });

  });;
});

console.log("Bot is running...");
