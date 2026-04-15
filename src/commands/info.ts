import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js"
import { getUsageStats } from "../db.js"
import { reactionMap } from "../utils/map.js"
import { getReactionFromTerm } from "../utils/reactions.js"

export const info = (interaction: ChatInputCommandInteraction<CacheType>) => {
  const name = interaction.options.getString("name", true)
  const reactionId = getReactionFromTerm(name)
  if (!reactionId)
    return interaction.reply({
      content: "No matching reactions found",
      flags: ["Ephemeral"]
    })

  const stats = getUsageStats(reactionId)
  const reactionName = reactionMap[reactionId]

  const embed = new EmbedBuilder().setTitle(reactionName)

  if (!stats) {
    embed.setDescription("No uses recorded yet.")
  } else {
    embed.addFields(
      { name: "Total Uses", value: String(stats.totalUses), inline: true },
      {
        name: "Last Used",
        value: `<t:${stats.lastUseTimestamp}:R>`,
        inline: true
      },
      { name: "Last User", value: `<@${stats.lastUserId}>`, inline: true },
      {
        name: "Top User",
        value: `<@${stats.topUserId}> — ${stats.topUserUses} use${stats.topUserUses === 1 ? "" : "s"}`,
        inline: true
      }
    )
  }

  return interaction.reply({
    embeds: [embed],
    files: [
      {
        name: "reaction.webm",
        attachment: `${process.env.REACTIONS_DIR}/${reactionId}.webm`
      }
    ],
    flags: ["Ephemeral"]
  })
}
