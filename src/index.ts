import "dotenv/config"
import { Client, GatewayIntentBits } from "discord.js"
import react from "./commands/react.js"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
})

client.once("clientReady", () => {
  if (!client.user) return
  console.log(`Logged in as ${client.user.tag}`)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.commandName) {
    case "react":
      return react(interaction)
  }
})

client.login(process.env.TOKEN)
