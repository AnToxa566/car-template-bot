import { CarPostContext } from "../types/car-post-context.type.js";
import { createCarPostKeyboard } from "./handle-create-post.js";

export const handleCancleConversation = async (ctx: CarPostContext) => {
  await ctx.conversation.exit();
  await ctx.reply("Чекаю твого наказу, барига 👨‍🏭", {
    reply_markup: createCarPostKeyboard,
  });
};
