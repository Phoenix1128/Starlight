import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import client from '../client.js';
import { sendCustomMsg } from '../utils.js';

export const data = {
  name: 'apod',
  description: "Gets NASA's Astronomy Picture of the Day.",
  options: [
    {
      name: 'date',
      description: "The date to fetch from the APOD API in YYYY-MM-DD format. Leave blank for today's APOD.",
      type: 'STRING',
    },
  ],
  permissions: [],
};

export async function run(interaction) {
  const customDate = interaction.options.getString('date') || undefined;

  if (!moment(customDate).isValid() || moment(customDate).unix() < 802411200 || moment(customDate).unix() > moment().unix()) {
    return sendCustomMsg(interaction, 0, 'Invalid Date!', 'Invalid date provided to APOD! Please enter a date between 1995-06-16 and today in YYYY-MM-DD format!');
  }

  const {
    title, explanation, date, hdurl,
  } = await client.NASA.apod(customDate);

  const embed = new MessageEmbed()
    .setColor('#0B3D91')
    .setTitle(`${title} - ${date}`)
    .setDescription(explanation)
    .setImage(hdurl);
  return interaction.reply({ embeds: [embed] });
}
