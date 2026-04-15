import "dotenv/config"
import { REST, Routes, SlashCommandBuilder } from "discord.js"

const commands = [
  new SlashCommandBuilder()
    .setName("react")
    .setDescription("Replies with a ReactBot reaction")
    .addStringOption((option) =>
      option
        .setName("term")
        .setDescription("Search term to find a specific reaction")
        .setRequired(false)
        .setAutocomplete(true)
    )
    .setContexts([0, 1, 2])
    .toJSON(),
  new SlashCommandBuilder()
    .setName("reactinfo")
    .setDescription("Preview a reaction and see its usage stats")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the reaction")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .setContexts([0, 1, 2])
    .toJSON(),
  new SlashCommandBuilder()
    .setName("reacttop")
    .setDescription("List the top 10 most used reactions")
    .setContexts([0, 1, 2])
    .toJSON()
]

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!)

const initialise = async () => {
  await rest.put(Routes.applicationCommands(process.env.APP_ID!), {
    body: commands
  })

  console.log("Commands registered")
}

initialise()
