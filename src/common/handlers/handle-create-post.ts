import { InputMediaPhoto } from "grammy/types";
import { InlineKeyboard, InputMediaBuilder, Keyboard } from "grammy";

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
import { searchLocations } from "../utils/search-locations.js";
import { findLocationById } from "../utils/find-location-by-id.js";
import { ILocation } from "../interfaces/location.interface.js";

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

  const photos: InputMediaPhoto[] = [];

  await ctx.reply("Фото 🌄", {
    reply_markup: cancelConservetionKeyboard,
  });

  while (true) {
    const photo = await conversation.waitFor(["message:photo", "message:text"]);

    if (photo.message.photo) {
      photos.push(InputMediaBuilder.photo(photo.message.photo[0].file_id));
    } else {
      break;
    }
  }

  await ctx.reply("Чекаю на назву авто 📝");
  post.title = await conversation.form.text();

  await ctx.reply("Рік випуску 📅");
  post.issue_year = await conversation.form.number();

  await ctx.reply("Вартість ($) 💰");
  post.price = await conversation.form.number();

  await ctx.reply("Місто 🏙️");
  const locationSearch = await conversation.form.text();
  const locations = searchLocations(locationSearch);

  const locationInlineKeyboard = InlineKeyboard.from(
    locations.map((location) => [
      InlineKeyboard.text(location.fullName, location.data.id.toString()),
    ])
  );

  await ctx.reply("Вибери місто зі списку 👇", {
    reply_markup: locationInlineKeyboard,
  });
  const selectedLocationId = (
    await conversation.waitForCallbackQuery(
      locations.map((l) => l.data.id.toString())
    )
  ).match;
  post.city = findLocationById(Number(selectedLocationId)) as ILocation;

  await ctx.reply("Пробіг (тис. км) 🛣️");
  post.mileage = await conversation.form.number();

  await ctx.reply("VIN код 🪪");
  post.vin_code = await conversation.form.text();

  await ctx.reply("Вибери тип палива ⛽️", {
    reply_markup: fuelChoosingInlineKeyboard,
  });
  post.fuel = (await conversation.waitForCallbackQuery(Object.values(Fuel)))
    .match as Fuel;

  if (post.fuel === Fuel.Electric) {
    await ctx.reply("Ємність акумулятора (кВт•год) 🔋");
    post.battery_capacity = await conversation.form.number();

    await ctx.reply("Запас ходу (км) 🔌");
    post.power_reserve = await conversation.form.number();
  } else {
    await ctx.reply("Обʼєм двигуна (л) ⚙️");
    post.engine_capacity = await conversation.form.number();

    await ctx.reply("Вибери коробку передач 📦", {
      reply_markup: transmissionChoosingInlineKeyboard,
    });
    post.transmission = (
      await conversation.waitForCallbackQuery(Object.values(Transmission))
    ).match as Transmission;
  }

  await ctx.reply("Вибери привід 🛞", {
    reply_markup: occasionChoosingInlineKeyboard,
  });
  post.occasion = (
    await conversation.waitForCallbackQuery(Object.values(Occasion))
  ).match as Occasion;

  await ctx.reply("Опиши цю кралю 💬");
  post.description = await conversation.form.text();

  await ctx.reply("Куди звонити? 📞");
  post.phone_number = await conversation.form.text();

  await ctx.reply("Імʼя власника 💁‍♂️");
  post.owner_name = await conversation.form.text();

  photos[0].caption = getCarPostText(post);
  photos[0].parse_mode = "HTML";

  await ctx.replyWithMediaGroup(photos);

  await ctx.reply("Чекаю твого наказу, барига 👨‍🏭", {
    reply_markup: createCarPostKeyboard,
  });
};
