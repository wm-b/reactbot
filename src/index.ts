import "dotenv/config"
import { Client, GatewayIntentBits } from "discord.js"
import { reactCommand } from "./commands/react/command.js"
import { reactAutocomplete } from "./commands/react/autocomplete.js"
import { info } from "./commands/info.js"
import { top } from "./commands/top.js"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
})

client.once("clientReady", () => {
  if (!client.user) return
  console.log(`Logged in as ${client.user.tag}`)
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete())
    switch (interaction.commandName) {
      case "react":
      case "reactinfo":
        return reactAutocomplete(interaction)
    }

  if (interaction.isChatInputCommand())
    switch (interaction.commandName) {
      case "react":
        return reactCommand(interaction)
      case "reactinfo":
        return info(interaction)
      case "reacttop":
        return top(interaction)
    }
})

client.login(process.env.TOKEN)
