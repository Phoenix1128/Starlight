import client from '../client';

export const data = {
  name: 'ping',
  description: 'Pings the client.',
  defaultPermission: false,
  permissions: [
    {
      id: client.config.ownerId,
      type: 'USER',
      permission: true,
    },
  ],
};

export async function run(interaction) {
  const m = await interaction.reply('Pinging the Client...');
  interaction.editReply(`Pong! Latency: **${m.createdTimestamp - interaction.createdTimestamp}ms** \nAPI Latency: **${Math.round(client.ws.ping)}ms**`);
}
