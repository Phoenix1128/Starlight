import { MessageEmbed } from 'discord.js';
import client from '../client.js';

export const data = {
  name: 'apod',
  description: "Gets NASA's Astronomy Picture of the Day.",
  permissions: [],
};

export async function run(interaction) {
  const {
    title, explanation, date, hdurl,
  } = await client.NASA.apod();

  const embed = new MessageEmbed()
    .setTimestamp()
    .setTitle(`${title} - ${date}`)
    .setDescription(explanation)
    .setImage(hdurl);
  interaction.reply({ embeds: [embed] });
}
