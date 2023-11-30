import { CarPostContext } from "../types/car-post-context.type.js";

export const handleStart = async (ctx: CarPostContext) => {
  await ctx.reply(`Привіт 😃👋
Я тут, щоб допомогти тобі створювати твої awesome пости для твоїх каналів 📢

Ти можеш користуватися мною використовуючи наступні команди:

/start - запустити / перезапустити бота
/help - переглянути доступні команди

/newpost - створити новий пост
/addchannel - додати новий канал

/exit - вийти з режиму створення/додавання сутностей
`);
};
