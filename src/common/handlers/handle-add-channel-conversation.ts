import { ConservetionId } from "../enums/conservetion-id.enum.js";
import { CarPostContext } from "../types/car-post-context.type.js";

export const handleAddChannelConversation = async (ctx: CarPostContext) => {
  await ctx.conversation.enter(ConservetionId.AddChannel);
};
