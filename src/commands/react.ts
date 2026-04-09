import { CommandInteraction, CommandInteractionResolvedData } from "discord.js"
import fs from "fs"
import path from "path"

const getReactionUrl = () => {
  const files = fs
    .readdirSync(process.env.REACTIONS_DIR!)
    .filter((f) =>
      fs.statSync(path.join(process.env.REACTIONS_DIR!, f)).isFile()
    )
  if (files.length === 0) return null
  const randomFile = files[Math.floor(Math.random() * files.length)]
  return `${process.env.BASE_URL}/${encodeURIComponent(randomFile)}`
}

const command = (interaction: CommandInteraction) => {
  const reactionUrl = getReactionUrl()
  if (!reactionUrl)
    return interaction.reply({ content: "No reactions available" })
  interaction.reply({ content: reactionUrl })
}

export default command
