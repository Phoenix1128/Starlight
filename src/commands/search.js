import {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} from 'discord.js';
import client from '../client.js';
import { arrowBack, arrowForward, redX } from '../emoji.js';
import { sendCustomMsg } from '../utils.js';

export const data = {
  name: 'search',
  description: "Searches NASA's Image and Video library (https://images.nasa.gov) for the given query.",
  options: [
    {
      name: 'query',
      description: 'The query to search for.',
      type: 'STRING',
      required: true,
    },
  ],
  permissions: [],
};

// eslint-disable-next-line consistent-return
export async function run(interaction) {
  const query = interaction.options.getString('query', true);

  const { items, metadata } = await client.NASA.searchImageLibrary(query);

  if (items.length === 0) {
    return sendCustomMsg(interaction, 0, 'No Results!', 'That query returned no results! Please try again!');
  }

  const mappedItems = items.map((v) => ({ name: v.data[0].title, value: v.data[0].description.length > 1024 ? `${v.data[0].description.slice(0, 1020)}...` : v.data[0].description }));

  const embed = new MessageEmbed()
    .setColor('#0B3D91')
    .setFooter({ text: `Total Results: ${metadata.total_hits} results` });

  const totalPages = Math.ceil(mappedItems.length / 5);
  let currPage = 1;
  let end = false;

  // eslint-disable-next-line consistent-return
  const updateEmbed = async () => {
    const startingIndex = (currPage - 1) * 5;
    const updatedFields = mappedItems.slice(startingIndex, startingIndex + 5);

    embed.setFields(updatedFields)
      .setTitle('')
      .setDescription('')
      .setImage('')
      .setAuthor({ name: `Page ${currPage} of ${totalPages}` });

    const buttonActionRow = new MessageActionRow()
      .addComponents([
        new MessageButton()
          .setLabel('Previous')
          .setEmoji(arrowBack)
          .setCustomId('previous')
          .setStyle('PRIMARY')
          .setDisabled(currPage === 1),
        new MessageButton()
          .setLabel('Next')
          .setEmoji(arrowForward)
          .setCustomId('next')
          .setStyle('PRIMARY')
          .setDisabled(currPage === totalPages),
        new MessageButton()
          .setLabel('End Search')
          .setEmoji(redX)
          .setCustomId('end')
          .setStyle('DANGER'),
      ]);

    const selectMenuActionRow = new MessageActionRow()
      .addComponents([
        new MessageSelectMenu()
          .setCustomId('resultToExpand')
          .setPlaceholder('Nothing Selected')
          .addOptions([
            {
              label: updatedFields[0].name.length > 100 ? `${updatedFields[0].name.slice(0, 96)}...` : updatedFields[0].name,
              description: `Result ${startingIndex + 1}`,
              value: startingIndex.toString(),
            },
            {
              label: updatedFields[1].name.length > 100 ? `${updatedFields[1].name.slice(0, 96)}...` : updatedFields[1].name,
              description: `Result ${startingIndex + 2}`,
              value: (startingIndex + 1).toString(),
            },
            {
              label: updatedFields[2].name.length > 100 ? `${updatedFields[2].name.slice(0, 96)}...` : updatedFields[2].name,
              description: `Result ${startingIndex + 3}`,
              value: (startingIndex + 2).toString(),
            },
            {
              label: updatedFields[3].name.length > 100 ? `${updatedFields[3].name.slice(0, 96)}...` : updatedFields[3].name,
              description: `Result ${startingIndex + 4}`,
              value: (startingIndex + 3).toString(),
            },
            {
              label: updatedFields[4].name.length > 100 ? `${updatedFields[4].name.slice(0, 96)}...` : updatedFields[4].name,
              description: `Result ${startingIndex + 5}`,
              value: (startingIndex + 4).toString(),
            },
          ]),
      ]);

    const interactionResponse = interaction.replied ? await interaction.editReply({ embeds: [embed], components: [buttonActionRow, selectMenuActionRow], fetchReply: true }) : await interaction.reply({ embeds: [embed], components: [buttonActionRow, selectMenuActionRow], fetchReply: true });

    const filter = (i) => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    let selectedInteraction;
    try {
      selectedInteraction = await interactionResponse.awaitMessageComponent({ filter, time: 1200000 });
    } catch (err) {
      return sendCustomMsg(interaction, 0, 'Time Expired!', err);
    }

    if (selectedInteraction.customId === 'end') {
      end = true;
      return interaction.editReply({ content: 'Search Ended!', embeds: [], components: [] });
    }

    if (selectedInteraction.customId === 'resultToExpand') {
      const updatedButtonActionRow = new MessageActionRow()
        .addComponents([
          new MessageButton()
            .setLabel('Back')
            .setEmoji(arrowBack)
            .setStyle('PRIMARY')
            .setCustomId('Back'),
        ]);

      const resultIndex = selectedInteraction.values[0];

      embed.setTitle(mappedItems[resultIndex].name)
        .setDescription(mappedItems[resultIndex].value)
        .setFields([])
        .setAuthor({ name: '' });

      if (items[resultIndex].data[0].media_type === 'image') {
        embed.setImage(items[resultIndex].links[0].href);
      } else {
        embed.addField('Links', (items[resultIndex].links && items[resultIndex].links.length > 0) ? items[resultIndex].links.map((link) => link.href).join('\n') : 'No Links');
      }

      const resultResponse = await interaction.editReply({ embeds: [embed], components: [updatedButtonActionRow], fetchReply: true });

      try {
        await resultResponse.awaitMessageComponent({ filter, time: 1200000 });
      } catch (err) {
        return sendCustomMsg(interaction, 0, 'Time Expired!', err);
      }

      await updateEmbed();
    } else {
      currPage = selectedInteraction.customId === 'next' ? currPage += 1 : currPage -= 1;
    }

    if (!end) {
      await updateEmbed();
    }
  };

  await updateEmbed();
}
