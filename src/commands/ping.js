import client from '../client.js';

export const data = {
  name: 'ping',
  description: 'Pings the client.',
  permissions: [],
};

export async function run(interaction) {
  const m = await interaction.reply({ content: 'Pinging the Client...', fetchReply: true });
  interaction.editReply(`Pong! Latency: **${m.createdTimestamp - interaction.createdTimestamp}ms** \nAPI Latency: **${Math.round(client.ws.ping)}ms**`);
}
