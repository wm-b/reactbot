import fs from "fs"
import path from "path"
import { CacheType, ChatInputCommandInteraction } from "discord.js"
import { reactionMap } from "../utils/map.js"
import { sanitiseString } from "../utils/strings.js"

const command = (interaction: ChatInputCommandInteraction<CacheType>) => {
  const searchTerm = interaction.options.getString("search")?.trim()
  if (!searchTerm) {
    const reactionFileName = getRandomReaction()
    if (!reactionFileName)
      return interaction.reply({
        content: "No reactions available"
      })
    return sendEmbeddedReaction(interaction, reactionFileName)
  }
  const reactionId = getReactionFromTerm(searchTerm)
  if (!reactionId)
    return interaction.reply({
      content: "No matching reactions found"
    })
  return sendEmbeddedReaction(interaction, `${reactionId}.webm`)
}

const getRandomReaction = () => {
  const files = fs
    .readdirSync(process.env.REACTIONS_DIR!)
    .filter((f) =>
      fs.statSync(path.join(process.env.REACTIONS_DIR!, f)).isFile()
    )
  if (files.length === 0) return null
  return files[Math.floor(Math.random() * files.length)]
}

const getReactionFromTerm = (term: string) => {
  const sanitisedTerm = sanitiseString(term)

  const exactMatchId = Object.entries(reactionMap).find(
    ([, name]) => sanitiseString(name) === sanitisedTerm
  )?.[0]
  if (!!exactMatchId) return exactMatchId
  const matchingReactionIds = Object.entries(reactionMap).filter(([, name]) =>
    sanitiseString(name).includes(sanitisedTerm)
  )
  if (!matchingReactionIds.length) return null
  return matchingReactionIds[
    Math.floor(Math.random() * matchingReactionIds.length)
  ][0]
}

const sendEmbeddedReaction = (
  interaction: ChatInputCommandInteraction<CacheType>,
  reactionFileName: string
) => {
  return interaction.reply({
    files: [
      {
        name: "reaction.webm",
        attachment: `${process.env.REACTIONS_DIR}/${reactionFileName}`
      }
    ]
  })
}

export default command
