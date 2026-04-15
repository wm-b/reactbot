import { CacheType, ChatInputCommandInteraction } from "discord.js"
import fs from "fs"
import path from "path"
import { reactionMap } from "./map.js"
import { sanitiseString } from "./strings.js"

export const getReactionFromTerm = (term: string) => {
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

export const getRandomReaction = () => {
  const files = fs
    .readdirSync(process.env.REACTIONS_DIR!)
    .filter((f) =>
      fs.statSync(path.join(process.env.REACTIONS_DIR!, f)).isFile()
    )
  if (files.length === 0) return null
  return files[Math.floor(Math.random() * files.length)]
}

export const sendEmbeddedReaction = (
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
