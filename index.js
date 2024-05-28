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

const chats = {};

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
      { text: 'Платные программы', callback_data: 'step.2.paid-courses' },
      { text: 'Бесплатные программы', callback_data: 'step.3' },
      { text: 'Назад', callback_data: 'step.1' },
      { text: 'Бесплатные в рамках программы Содействие занятости', callback_data: 'step.4' },
    ]);
  },
  "step.2.paid-courses": (chatId) => {
    sendMessageWithOptions(chatId, 'Выберите платный курс:', [
      { text: '1. НЕЙРОСЕТИ ДЛЯ ДИЗАЙНЕРОВ И СТИЛИСТОВ', callback_data: 'step.2.paid-courses.1' },
    ]);
  },
  "step.2.paid-courses.1": (chatId) => {
    bot.sendMessage(chatId, `
    Авторский курс Анны Клименкоди - это практика использования актуальных нейросетей в профессиональной деятельности дизайнеров и стилистов. Курс включает инструкции по работе с инструментами искусственного интеллекта с учетом последних обновлений, и доступен для обучения с “нуля”.

    Профессия: контент менеджер, промпт инженер

    Доступно полностью дистанционное (онлайн) обучение

    Длительность: 12 недель, 72 академических часа
    Полная стоимость курса: 50 тыс. рублей, доступна рассрочка

    Подробнее: https://styleschool.ru/education/nn-for-designers-and-stylists
`);
    sendMessageWithOptions(chatId, 'Хотите начать обучение по этой программе?', [
      { text: 'Да', callback_data: 'block.2' },
      { text: 'Нет', callback_data: 'step.1' },
      { text: 'Выбрать другой курс', callback_data: 'step.2.paid-courses' },
    ]);
  },
  "step.3": (chatId) => {
    sendMessageWithOptions(chatId, 'Выберите бесплатный курс:', [
      { text: '1. КОНСУЛЬТАНТ ПО СТИЛЮ', callback_data: 'step.3.free-courses.1' },
    ]);
  },
  "step.3.free-courses.1": (chatId) => {
    bot.sendMessage(chatId, `
    Курс создан для обучения с “нуля”. Дает возможность реализовать мечту о творческой самореализации в области моды и сделать первые шаги в профессии стилиста. В курсе представлены базовые методики в области подбора комплектов одежды в соответствии с индивидуальными особенностями персон и модными тенденциями. Гибкий график изучения видео материалов в сочетании с живыми практическими занятиями и командной работой дает гарантированный результат.

    Направления в профессии: имидж-консультант, консультант по стилю, персональный стилист, шопер, продавец-стилист.

    Доступно полностью дистанционное (онлайн) обучение
    Доступно комбинированное обучение с очными практиками

    Длительность: 8 недель, 144 академических часов.
    Полная стоимость курса:
    онлайн формат - 40 тыс. рублей, доступна рассрочка
    комбинированный формат (онлайн + очные практики) - 69 тыс. рублей, доступна рассрочка *
    cтоимость обучения в рамках федерального проекта “Содействие занятости” - 0 рублей. **

    * Очные практики доступны по региону: Москва, Новосибирск
    ** Данное обучение доступно для определенных категорий граждан РФ.
`);
    sendMessageWithOptions(chatId, 'Хотите начать обучение по этой программе?', [
      { text: 'Да', callback_data: 'block.2' },
      { text: 'Нет', callback_data: 'step.1' },
      { text: 'Выбрать другой курс', callback_data: 'step.3' },
    ]);
  },
  "block.2": (chatId, userId) => {
    if (!userId) {
      return;
    }

    const user = getRow(userId);
    console.log({ user });

    if (user?.fullName) {
      sendMessageWithOptions(chatId, `Вы ${user.fullName}?`, [
        { text: 'Да', callback_data: 'block.2.form-complete' },
        { text: 'Нет', callback_data: 'block.2.enter-name' },
      ]);
    } else {
      bot.sendMessage(chatId, `Как к вам обращаться?`);
      chats[chatId] ??= {};
      chats[chatId].state = 'entering-name';
    }
  },
  "block.2.form-complete": (chatId) => {
    bot.sendMessage(chatId, `Спасибо! В ближайшее время с Вами свяжутся`);
  },
  "block.2.enter-name": (chatId) => {
    bot.sendMessage(chatId, `Как к вам обращаться?`);
    chats[chatId] ??= {};
    chats[chatId].state = 'entering-name';
  },
};

// Matches any message
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (chats?.[chatId]?.state === 'entering-name') {
      let user;
      if (userId) {
        getRow(userId);
      }
      if (user) {
        user.fullName = text;
        await updateRow(user);
      } else {
        user = {
          userId,
          fullName: text,
        }
        await addRow(user);
      }
      bot.sendMessage(chatId, `Спасибо! В ближайшее время с Вами свяжутся`);
    }
});

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
    handler(message.chat.id, callbackQuery.from.id);
  }
});

console.log("Bot is running...");

const { google } = require('googleapis');
const spreadsheetId = '1_7bWQgcDmd0o6jr7rvYGSoedAmYJ7IbZFV4tOJXOB_I'; // Replace with your spreadsheet ID
let sheets; // Global variable for Google Sheets API client

// Function to insert a row using Google Sheets API
async function addRow(user) {
  const range = 'Users!A:D'; // Adjust the range to include the entire columns needed
  const valueInputOption = 'RAW';

  const values = [
    [user.userId, user.fullName]
  ];
  const resource = {
    values,
  };

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });

    console.log('Row added:', response.data);
  } catch (error) {
    console.error('Error adding row: ', error);
  }
}

// Function to ensure the first two cells in the Users sheet are 'userId' and 'fullName'
async function ensureFirstRow() {
  const range = 'Users!A1:B1';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;
    if (!values || values.length === 0 || values[0].length < 2) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [['userId', 'fullName']],
        },
      });
      console.log('First row updated to "userId" and "fullName".');
    } else if (values[0][0] !== 'userId' || values[0][1] !== 'fullName') {
      throw new Error('First two cells in the first row do not match "userId" and "fullName".');
    } else {
      console.log('First row is already set to "userId" and "fullName".');
    }
  } catch (error) {
    console.error('Error ensuring first row: ', error);
  }
}

// Function to get a user by userId
async function getRow(userId) {
  const range = 'Users!A:D'; // Adjust range to include columns for user data

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (rows.length === 0) {
      console.log('No data found.');
      return null;
    }

    console.log(rows);
    const userRow = rows.find(row => row[0] == userId);

    if (!userRow) {
      console.log('User not found.');
      return null;
    }

    return {
      userId: userRow[0],
      fullName: userRow[1],
    };
  } catch (error) {
    console.error('Error getting row: ', error);
  }
}

// Function to update a user by userId
async function updateRow(user) {
  const range = 'Users!A:D'; // Adjust range to include columns for user data

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length === 0) {
      console.log('No data found.');
      return;
    }

    const rowIndex = rows.findIndex(row => row[0] === user.userId);
    if (rowIndex === -1) {
      console.log('User not found.');
      return;
    }

    const targetRange = `Users!A${rowIndex + 1}:D${rowIndex + 1}`; // Calculate the range for the specific row

    const values = [
      [user.userId, user.fullName]
    ];
    const resource = {
      values,
    };

    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: targetRange,
      valueInputOption: 'RAW',
      resource,
    });

    console.log('Row updated:', updateResponse.data);
  } catch (error) {
    console.error('Error updating row: ', error);
  }
}

// Authorize and call the functions
async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './google-api.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  sheets = google.sheets({ version: 'v4', auth: authClient });

  await ensureFirstRow();

  // const user = { userId: '123', fullName: 'John Doe' };
  // await addRow(user);

  // const retrievedUser = await getRow('123');
  // console.log('Retrieved User:', retrievedUser);
}

main();