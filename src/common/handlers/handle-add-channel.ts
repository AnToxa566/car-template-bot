import { channelService } from "../../services/channels/channel.service.js";
import {
  CarPostContext,
  CarPostConversation,
} from "../types/car-post-context.type.js";

export const handleAddChannel = async (
  conversation: CarPostConversation,
  ctx: CarPostContext
) => {
  await ctx.reply("Відправ назву свого каналу у форматі @my_channel_name");
  const channelName = await conversation.form.text();

  await ctx.reply("Дай назву для відображення");
  const channelSlug = await conversation.form.text();

  channelService.create({
    id: Math.random().toString(16).slice(2),
    user_id: ctx.msg?.chat.id.toString() || "undefined",
    name: channelName,
    slug: channelSlug,
  });

  await ctx.reply("Канал додано ✅\nНе забудь додати бота на канал 🤖");
};
