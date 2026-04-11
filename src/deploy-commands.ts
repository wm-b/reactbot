import "dotenv/config"
import { REST, Routes, SlashCommandBuilder } from "discord.js"

const commands = [
  new SlashCommandBuilder()
    .setName("react")
    .setDescription("Replies with a ReactBot reaction")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Search term to find a specific reaction")
        .setRequired(false)
    )
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
