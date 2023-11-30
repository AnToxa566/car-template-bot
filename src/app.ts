import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { BotCommand } from "./common/enums/bot-command.enum.js";
import { ConservetionId } from "./common/enums/conservetion-id.enum.js";
import { CarPostContext } from "./common/types/car-post-context.type.js";

import { handleStart } from "./common/handlers/handle-start.js";
import { handleAddChannel } from "./common/handlers/handle-add-channel.js";
import { handleCreatePost } from "./common/handlers/handle-create-post.js";
import { handleCancleConversation } from "./common/handlers/handle-cancle-conversation.js";
import { handleCreatePostConversation } from "./common/handlers/handle-create-post-conversation.js";
import { handleAddChannelConversation } from "./common/handlers/handle-add-channel-conversation.js";
import { channelService } from "./services/channels/channel.service.js";

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

bot.command([BotCommand.Start, BotCommand.Help], handleStart);

bot.command(BotCommand.ExitConversation, handleCancleConversation);

bot.command(BotCommand.CreatePost, handleCreatePostConversation);

bot.command(BotCommand.AddChannel, handleAddChannelConversation);

bot.start();
