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
import { searchLocations } from "../utils/search-locations.js";
import { findLocationById } from "../utils/find-location-by-id.js";
import { ILocation } from "../interfaces/location.interface.js";
import { channelService } from "../../services/channels/channel.service.js";

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

export const handleCreatePost = async (
  conversation: CarPostConversation,
  ctx: CarPostContext
) => {
  const post = {} as ICar;

  const photos: InputMediaPhoto[] = [];

  await ctx.reply("Фото 🌄", {
    reply_markup: new Keyboard().text("Завершити додавання фото 🚪"),
  });

  while (true) {
    const photo = await conversation.waitFor(["message:photo", "message:text"]);

    if (photo.message.photo) {
      photos.push(InputMediaBuilder.photo(photo.message.photo[0].file_id));
    } else {
      break;
    }
  }

  await ctx.reply("Чекаю на назву авто 📝", {
    reply_markup: { remove_keyboard: true },
  });
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
  const channels = await channelService.findAll();

  if (channels.length) {
    const chennelsKeyboard = InlineKeyboard.from(
      channels.map((channeel) => [
        InlineKeyboard.text(channeel.slug, channeel.name),
      ])
    );

    const publishingMessage = await ctx.reply(
      "Нехай цей пост побачить світ 📢",
      {
        reply_markup: chennelsKeyboard,
      }
    );

    const channelName = (
      await conversation.waitForCallbackQuery(channels.map((ch) => ch.name))
    ).match;

    try {
      await ctx.api.sendMediaGroup(channelName.toString(), photos);
      await ctx.reply("Вжух, вже на каналі 🪄");
    } catch (err) {
      await ctx.reply("Упс, щось пішло не так 🥲");
      console.log(err);
    } finally {
      await ctx.api.deleteMessage(
        ctx.message?.chat.id || "undefined",
        publishingMessage.message_id
      );
    }
  }
};
