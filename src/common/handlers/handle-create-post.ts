import { InlineKeyboard, Keyboard } from "grammy";

import { Fuel } from "../enums/fuel.enum.js";
import { Occasion } from "../enums/occasion.enum.js";
import { Transmission } from "../enums/transmission.enum.js";
import { ICar } from "../interfaces/car.interface.js";
import { getCarPostText } from "../utils/get-car-post-text.js";
import {
  CarPostContext,
  CarPostConversation,
} from "../types/car-post-context.type.js";
import { BotCommand } from "../enums/bot-command.enum.js";

export const fuelChoosingInlineKeyboard = InlineKeyboard.from(
  Object.values(Fuel).map((fuel) => [InlineKeyboard.text(fuel)])
);

export const occasionChoosingInlineKeyboard = InlineKeyboard.from(
  Object.values(Occasion).map((occasion) => [InlineKeyboard.text(occasion)])
);

export const transmissionChoosingInlineKeyboard = InlineKeyboard.from(
  Object.values(Transmission).map((transmission) => [
    InlineKeyboard.text(transmission),
  ])
);

export const createCarPostKeyboard = new Keyboard().text(
  BotCommand.CreatePostText
);

export const cancelConservetionKeyboard = new Keyboard().text(
  BotCommand.CancelConservetionText
);

export const handleCreatePost = async (
  conversation: CarPostConversation,
  ctx: CarPostContext
) => {
  const post = {} as ICar;

  ctx.reply("Чекаю на назву авто 📝", {
    reply_markup: cancelConservetionKeyboard,
  });
  post.title = await conversation.form.text();

  ctx.reply("Рік випуску 📅");
  post.issue_year = await conversation.form.number();

  ctx.reply("Вартість ($) 💰");
  post.price = await conversation.form.number();

  ctx.reply("Місто 🏙️");
  post.city = await conversation.form.text();

  ctx.reply("Пробіг (тис. км) 🛣️");
  post.mileage = await conversation.form.number();

  ctx.reply("VIN код 🪪");
  post.vin_code = await conversation.form.text();

  ctx.reply("Вибери тип палива ⛽️", {
    reply_markup: fuelChoosingInlineKeyboard,
  });
  post.fuel = (await conversation.waitForCallbackQuery(Object.values(Fuel)))
    .match as Fuel;

  if (post.fuel === Fuel.Electric) {
    ctx.reply("Ємність акумулятора (кВт•год) 🔋");
    post.battery_capacity = await conversation.form.number();

    ctx.reply("Запас ходу (км) 🔌");
    post.power_reserve = await conversation.form.number();
  } else {
    ctx.reply("Обʼєм двигуна (л) ⚙️");
    post.engine_capacity = await conversation.form.number();

    ctx.reply("Вибери коробку передач 📦", {
      reply_markup: transmissionChoosingInlineKeyboard,
    });
    post.transmission = (
      await conversation.waitForCallbackQuery(Object.values(Transmission))
    ).match as Transmission;
  }

  ctx.reply("Вибери привід 🛞", {
    reply_markup: occasionChoosingInlineKeyboard,
  });
  post.occasion = (
    await conversation.waitForCallbackQuery(Object.values(Occasion))
  ).match as Occasion;

  ctx.reply("Опиши цю кралю 💬");
  post.description = await conversation.form.text();

  ctx.reply("Куди звонити? 📞");
  post.phone_number = await conversation.form.text();

  ctx.reply("Імʼя власника 💁‍♂️");
  post.owner_name = await conversation.form.text();

  ctx.reply(getCarPostText(post), {
    parse_mode: "HTML",
    reply_markup: createCarPostKeyboard,
    disable_web_page_preview: true,
  });
};
