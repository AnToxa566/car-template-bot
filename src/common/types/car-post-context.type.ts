import { Context } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

export type CarPostContext = Context & ConversationFlavor;

export type CarPostConversation = Conversation<CarPostContext>;
