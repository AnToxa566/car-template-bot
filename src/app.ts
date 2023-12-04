import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { BotCommand } from "./common/enums/bot-command.enum.js";
import { ConservetionId } from "./common/enums/conservetion-id.enum.js";
import { CarPostContext } from "./common/types/car-post-context.type.js";

import { handleStart } from "./common/handlers/handle-start.js";
import { handleAddChannel } from "./common/handlers/handle-add-channel.js";
import { handleCreatePost } from "./common/handlers/handle-create-post.js";
import { handleManageChannels } from "./common/handlers/handle-manage-channels.js";

dotenv.config();

const bot = new Bot<CarPostContext>(process.env.TELEGRAM_BOT_KEY as string);

bot.use(
  session({
    initial: () => ({}),
  })
);
bot.use(conversations());
bot.use(createConversation(handleCreatePost, ConservetionId.CreatePost));
bot.use(createConversation(handleAddChannel, ConservetionId.AddChannel));
bot.use(
  createConversation(handleManageChannels, ConservetionId.ManageChannels)
);

bot.command([BotCommand.Start, BotCommand.Help], handleStart);

bot.command(BotCommand.ExitConversation, async (ctx: CarPostContext) => {
  await ctx.conversation.exit();
});

bot.command(BotCommand.CreatePost, async (ctx: CarPostContext) => {
  await ctx.conversation.enter(ConservetionId.CreatePost);
});

bot.command(BotCommand.AddChannel, async (ctx: CarPostContext) => {
  await ctx.conversation.enter(ConservetionId.AddChannel);
});

bot.command(BotCommand.Channels, async (ctx: CarPostContext) => {
  await ctx.conversation.enter(ConservetionId.ManageChannels);
});

bot.start();
