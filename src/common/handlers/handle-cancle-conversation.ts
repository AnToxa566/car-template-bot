import { CarPostContext } from "../types/car-post-context.type.js";

export const handleCancleConversation = async (ctx: CarPostContext) => {
  await ctx.conversation.exit();
  await ctx.reply("Чекаю твого наказу, барига 👨‍🏭");
};
