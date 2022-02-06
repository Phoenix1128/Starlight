import client from '../client.js';

export default async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  if (!interaction.member) {
    await client.guilds.cache.get(interaction.guildId).members.fetch(interaction.user.id);
  }

  await client.commands.get(interaction.commandName).run(interaction);
};
