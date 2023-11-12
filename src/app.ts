import dotenv from "dotenv";
import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { handleCreatePost } from "./common/handlers/handle-create-post.js";
import { CarPostContext } from "./common/types/car-post-context.type.js";
import { BotCommand } from "./common/enums/bot-command.enum.js";
import { handleCreateConversation } from "./common/handlers/handle-create-conversation.js";
import { ConservetionId } from "./common/enums/conservetion-id.enum.js";
import { handleCancleConversation } from "./common/handlers/handle-cancle-conversation.js";

dotenv.config();

const bot = new Bot<CarPostContext>(process.env.TELEGRAM_BOT_KEY as string);

bot.use(
  session({
    initial: () => ({}),
  })
);
bot.use(conversations());
bot.use(createConversation(handleCreatePost, ConservetionId.CreatePost));

bot.command(BotCommand.Start, (ctx) =>
  ctx.reply("Хай, друже! Радий тебе тут бачити ❤️️️️️️️\nХочеш пост? 👇", {
    reply_markup: new InlineKeyboard().text("Хочу! 🚙", BotCommand.CreatePost),
  })
);

bot.callbackQuery(BotCommand.CreatePost, handleCreateConversation);

bot.hears(BotCommand.CreatePostText, handleCreateConversation);

bot.hears(BotCommand.CancelConservetionText, handleCancleConversation);

bot.start();
