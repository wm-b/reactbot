import { CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { getTopReactions } from "../db.js"
import { reactionMap } from "../utils/map.js"

export const top = (interaction: ChatInputCommandInteraction<CacheType>) => {
  const topReactions = getTopReactions(10)

  const embed = new EmbedBuilder().setTitle("Top 10 Reactions")

  if (!topReactions.length) {
    embed.setDescription("No reactions have been used yet.")
  } else {
    const lines = topReactions.map((r, i) => {
      const name = reactionMap[r.reactionId] ?? r.reactionId
      return `**${i + 1}.** ${name} — ${r.uses} use${r.uses === 1 ? "" : "s"}`
    })
    embed.setDescription(lines.join("\n"))
  }

  return interaction.reply({ embeds: [embed], flags: ["Ephemeral"] })
}
