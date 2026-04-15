import { CacheType, ChatInputCommandInteraction } from "discord.js"
import {
  getRandomReaction,
  getReactionFromTerm,
  sendEmbeddedReaction
} from "../../utils/reactions.js"
import { recordUsage } from "../../db.js"

export const reactCommand = (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const searchTerm = interaction.options.getString("term")?.trim()
  if (searchTerm) {
    const reactionId = getReactionFromTerm(searchTerm)
    if (!reactionId)
      return interaction.reply({
        content: "No matching reactions found",
        flags: ["Ephemeral"]
      })
    recordUsage(reactionId, interaction.user.id)
    return sendEmbeddedReaction(interaction, `${reactionId}.webm`)
  }

  const reactionFileName = getRandomReaction()
  if (!reactionFileName)
    return interaction.reply({
      content: "No reactions available",
      flags: ["Ephemeral"]
    })
  const reactionId = reactionFileName.replace(/\.[^/.]+$/, "")
  recordUsage(reactionId, interaction.user.id)
  return sendEmbeddedReaction(interaction, reactionFileName)
}
