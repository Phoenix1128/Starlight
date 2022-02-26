import { MessageEmbed } from 'discord.js';
import client from '../client.js';

export default async (guild) => {
  const starlightChannel = client.channels.cache.get(client.config.starlightChannel) || await client.channels.fetch(client.config.starlightChannel);

  const embed = new MessageEmbed()
    .setColor('#0B3D91')
    .setTitle('New Guild!')
    .setDescription(`Name: ${guild.name} (${guild.id})\nMember Count: ${guild.memberCount}\n\nTotal Guilds: ${(await client.guilds.fetch()).size}`);

  starlightChannel.send({ embeds: [embed] });
};
