import { CacheType, ChatInputCommandInteraction } from "discord.js"
import fs from "fs"
import path from "path"
import { reactionMap } from "../utils/map.js"
import { sanitiseString } from "../utils/strings.js"

const command = (interaction: ChatInputCommandInteraction<CacheType>) => {
  const searchTerm = interaction.options.getString("search")?.trim()
  if (!searchTerm)
    return interaction.reply({
      content: getRandomReactionUrl() || "No reactions available"
    })
  return interaction.reply({
    content: getReactionFromTerm(searchTerm) || "No matching reactions found"
  })
}

const getRandomReactionUrl = () => {
  const files = fs
    .readdirSync(process.env.REACTIONS_DIR!)
    .filter((f) =>
      fs.statSync(path.join(process.env.REACTIONS_DIR!, f)).isFile()
    )
  if (files.length === 0) return null
  const randomFile = files[Math.floor(Math.random() * files.length)]
  return `${process.env.BASE_URL}/${encodeURIComponent(randomFile)}`
}

const getReactionFromTerm = (term: string): string | null => {
  const sanitisedTerm = sanitiseString(term)

  const exactMatchId = Object.entries(reactionMap).find(
    ([, name]) => sanitiseString(name) === sanitisedTerm
  )?.[0]
  if (exactMatchId) return `${process.env.BASE_URL}/${exactMatchId}.webm`
  const matchingReactionIds = Object.entries(reactionMap).filter(([, name]) =>
    sanitiseString(name).includes(sanitisedTerm)
  )
  if (!matchingReactionIds.length) return null
  const reactionId =
    matchingReactionIds[
      Math.floor(Math.random() * matchingReactionIds.length)
    ][0]
  return `${process.env.BASE_URL}/${reactionId}.webm`
}

export default command
