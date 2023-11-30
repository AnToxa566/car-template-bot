import { ConservetionId } from "../enums/conservetion-id.enum.js";
import { CarPostContext } from "../types/car-post-context.type.js";

export const handleCreatePostConversation = async (ctx: CarPostContext) => {
  await ctx.conversation.enter(ConservetionId.CreatePost);
};
