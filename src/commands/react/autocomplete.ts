import { AutocompleteInteraction, CacheType } from "discord.js"
import { sanitiseString } from "../../utils/strings.js"
import { reactionMap } from "../../utils/map.js"

export const reactAutocomplete = (interaction: AutocompleteInteraction<CacheType>) => {
  const focusedValue = sanitiseString(interaction.options.getFocused())
  const choices = Object.entries(reactionMap)
    .filter(([, name]) => sanitiseString(name).includes(focusedValue))
    .slice(0, 25)
    .map(([, name]) => ({ name, value: name }))
  return interaction.respond(choices)
}
