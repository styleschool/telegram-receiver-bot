const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = fs.readFileSync('token', 'utf8').trim();
const bot = new TelegramBot(token, { polling: true });

function sendMessageWithOptions(chatId, message, options) {
  const inlineKeyboard = options.map(option => [{ text: option.text, callback_data: option.callback_data }]);

  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: inlineKeyboard
    }
  });
}

const welcomeMessage = `Здравствуйте. Я бот Высшей школы стилистики, дизайна и технологий! Я готов предоставить вам информацию о наших курсах и вариантах обучения. Также я могу перевести вас на другого бота, где вы можете бесплатно проходить обучение.`;

// // Matches any message
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     // Send back 'Hello, World!' to the sender
//     bot.sendMessage(chatId, welcomeMessage);
// });

// // Handle callback queries
// bot.on('callback_query', (callbackQuery) => {
//   const message = callbackQuery.message;
//   const data = callbackQuery.data;

//   // bot.sendMessage(message.chat.id, `You selected option ${data}`);
// });

const steps = {
  "step.1": (chatId) => {
    sendMessageWithOptions(chatId, 'Как я могу быть вам полезен?', [
      { text: 'Информация о курсах', callback_data: 'step.2' },
      { text: 'Оставить заявку для связи', callback_data: '...' },
      { text: 'Хочу учиться бесплатно!', callback_data: 'step.3' }
    ]);
  },
  "step.2": (chatId) => {
    sendMessageWithOptions(chatId, 'У нас есть следующие варианты обучения:', [
      { text: 'Платные программы', callback_data: 'step.2.1' },
      { text: 'Бесплатные программы', callback_data: 'step.3' },
      { text: 'Назад', callback_data: 'step.1' },
      { text: 'Бесплатные в рамках программы Содействие занятости', callback_data: 'step.4' },
    ]);
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, welcomeMessage).then(() => {
    steps['step.1'](chatId);
  });
});

bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;
  const handler = steps[data];
  if (handler) {
    handler(message.chat.id);
  }
});

console.log("Bot is running...");
