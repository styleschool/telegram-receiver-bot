const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Read the token from the 'token' file
const token = fs.readFileSync('token', 'utf8').trim();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

/**
 * Send a message with options
 * @param {number} chatId - The ID of the chat
 * @param {string} message - The message text to be sent
 * @param {array} options - An array of options, each option being an object { text, callback_data }
 */
function sendMessageWithOptions(chatId, message, options) {
  const inlineKeyboard = options.map(option => [{ text: option.text, callback_data: option.callback_data }]);

  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: inlineKeyboard
    }
  });
}

// // Matches /start
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

//   // Send "Hello, World!" message
//   bot.sendMessage(chatId, 'Hello, World!').then(() => {
//     // Send follow-up question with options
//     sendMessageWithOptions(chatId, 'Please choose an option:', [
//       { text: 'Option 1', callback_data: '1' },
//       { text: 'Option 2', callback_data: '2' },
//       { text: 'Option 3', callback_data: '3' },
//     ]);
//   });
// });

// // Handle callback queries
// bot.on('callback_query', (callbackQuery) => {
//   const message = callbackQuery.message;
//   const data = callbackQuery.data;

//   if (data === '1') {
//     // If the first option is selected, send another question with four options
//     sendMessageWithOptions(message.chat.id, 'You selected option 1. Please choose an additional option:', [
//       { text: 'Option A', callback_data: 'A' },
//       { text: 'Option B', callback_data: 'B' },
//       { text: 'Option C', callback_data: 'C' },
//       { text: 'Option D', callback_data: 'D' },
//     ]);
//   } else if (['A', 'B', 'C', 'D'].includes(data)) {
//     // Handle additional options from the second question
//     bot.sendMessage(message.chat.id, `You selected option ${data}`);
//   } else {
//     // For other options, send a confirmation message
//     bot.sendMessage(message.chat.id, `You selected option ${data}`);
//   }
// });

// console.log("Bot is running...");

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
    sendMessageWithOptions(chatId, 'Как я могу быть вам полезен?', [
      { text: 'Информация о курсах', callback_data: 'Step.2' },
      { text: 'Оставить заявку для связи', callback_data: '...' },
      { text: 'Хочу учиться бесплатно!', callback_data: 'Step.3' }
    ]);
  });
});

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data === 'Step.2') {
    // If the first option is selected, send another question with four options
    sendMessageWithOptions(message.chat.id, 'У нас есть следующие варианты обучения:', [
      { text: 'Платные программы', callback_data: 'Step.2.1' },
      { text: 'Option B', callback_data: 'B' },
      { text: 'Option C', callback_data: 'C' },
      { text: 'Option D', callback_data: 'D' },
    ]);
  } else if (['A', 'B', 'C', 'D'].includes(data)) {
    // Handle additional options from the second question
    // bot.sendMessage(message.chat.id, `You selected option ${data}`);
  } else {
    // For other options, send a confirmation message
    // bot.sendMessage(message.chat.id, `You selected option ${data}`);
  }
});

console.log("Bot is running...");
