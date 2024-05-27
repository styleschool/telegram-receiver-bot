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
