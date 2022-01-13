/* eslint-disable no-param-reassign */
import Discord from 'discord.js';
import { checkMark, redX } from './emoji';

/**
 *
 * @param {Array} array the array to iterate over
 * @param {Function} callback the function to call for each array element
 * @returns {undefined}
 */
export const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[i], i, array);
  }
};

/**
 *
 * @param {*} text
 * @returns {String} cleanText
 */
export const clean = async (text) => {
  if (text && text.constructor.name === 'Promise') {
    text = await text;
  }
  if (typeof text !== 'string') {
    // eslint-disable-next-line global-require
    text = require('util').inspect(text, { depth: 1 });
  }

  text = text
    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
    .replace(/@/g, `@${String.fromCharCode(8203)}`)
    .replace(this.config.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

  return text;
};

/**
 *
 * @param {Discord.Interaction}
 * @param {String} type 0 (error) OR 1 (success)
 * @param {Discord.TextChannel|String} channel
 * @param {String} header
 * @param {String} msg
 * @param {boolean} followUp whether to followUp on another reply
 * @param {boolean} ephemeral whether this msg is ephemeral
 * @returns {undefined}
 */
export const sendCustomMsg = async (interaction, type, header, msg, followUp = false, ephemeral = false) => {
  const options = { content: `${type === 1 ? checkMark : redX} **${header}**\n${msg}`, ephemeral };
  if (interaction.replied) {
    if (followUp) {
      await interaction.followUp(options);
    } else {
      await interaction.editReply(options);
    }
  } else {
    await interaction.reply(options);
  }
};

/**
 *
 * @param {Discord.Interaction}
 * @param {String} message
 * @returns {undefined}
 */
export const sendLongMessage = (interaction, message) => {
  const splitMsg = Discord.Util.splitMessage(message);
  asyncForEach(splitMsg, async (msgToSend, index) => {
    if (index === 0) {
      await interaction.reply(msgToSend);
    } else {
      await interaction.followUp(msgToSend);
    }
  });
};
