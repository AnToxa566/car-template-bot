import { InlineKeyboard } from "grammy";

import { channelService } from "../../services/channels/channel.service.js";
import {
  CarPostContext,
  CarPostConversation,
} from "../types/car-post-context.type.js";

export const handleManageChannels = async (
  conversation: CarPostConversation,
  ctx: CarPostContext
) => {
  const chatId = ctx.message?.chat.id.toString() || "";

  const channels = await channelService.findAll({ chatId });

  if (channels.length) {
    const chennelsKeyboard = InlineKeyboard.from(
      channels.map((channel) => [InlineKeyboard.text(channel.slug, channel.id)])
    );

    const message = await ctx.reply(
      "Виберіть канал для подальшого редагувння ⚙️",
      {
        reply_markup: chennelsKeyboard,
      }
    );

    const channelId = (
      await conversation.waitForCallbackQuery(channels.map((ch) => ch.id))
    ).match;
    const channel = channels.find((ch) => ch.id === channelId) || channels[0];

    await ctx.api.editMessageText(
      chatId,
      message.message_id,
      `Обрано: ${channel.slug} (${channel.name})\nЩо робимо?`,
      {
        reply_markup: new InlineKeyboard()
          .text("Змінити назву", "change_slug")
          .row()
          .text("Змінити id каналу", "change_name")
          .row()
          .text("Видалити канал 🗑️", "delete_channel"),
      }
    );

    const action = (
      await conversation.waitForCallbackQuery([
        "change_slug",
        "change_name",
        "delete_channel",
      ])
    ).match;

    switch (action) {
      case "change_slug":
        await ctx.reply("Добре. Чекаю на нову назву для каналу");
        const channelSlug = await conversation.form.text();

        await channelService.update({ ...channel, slug: channelSlug });
        await ctx.reply("Назву канала відредагованно ✅");

        break;
      case "change_name":
        await ctx.reply("Добре. Чекаю на новий id каналу");
        const id = await conversation.form.text();

        await channelService.update({ ...channel, name: id });
        await ctx.reply("ID канала відредагованно ✅");

        break;
      case "delete_channel":
        await channelService.delete(channelId.toString());
        await ctx.reply("Канал успішно видалено ✅");

        break;
      default:
        await ctx.reply("Щось пішло не так 🥲");
        break;
    }
  } else {
    await ctx.reply("Ви ще не додали жодного каналу 🥺");
  }
};
