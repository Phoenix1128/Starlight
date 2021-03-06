/* eslint-disable no-param-reassign */
import Discord from 'discord.js';
import { inspect } from 'util';

export const emoji = {
  checkMark: '✅',
  redX: '❌',
  warning: '⚠',
  thumbsUp: '👍',
  thumbsDown: '👎',
  neutral: '↔️',
  arrowBack: '◀️',
  arrowForward: '▶️',
};

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
    text = inspect(text, { depth: 1 });
  }

  text = text
    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
    .replace(/@/g, `@${String.fromCharCode(8203)}`);

  return text;
};

/**
 *
 * @param {Discord.Interaction} interaction
 * @param {Number} type 0 (error) OR 1 (success)
 * @param {String} header
 * @param {String} msg
 * @param {boolean} followUp whether to followUp on another reply
 * @param {boolean} ephemeral whether this msg is ephemeral
 * @returns {undefined}
 */
export const sendCustomMsg = async (interaction, type, header, msg, followUp = false, ephemeral = false) => {
  const options = {
    content: `${type === 1 ? emoji.checkMark : emoji.redX} **${header}**\n${msg}`, ephemeral, embeds: [], components: [],
  };
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
 * @param {Discord.Interaction} interaction
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

/**
 *
 * @param {String} code
 * @returns {Object} response, responseCode
 */
export const executeEval = async (client, code) => {
  try {
    // eslint-disable-next-line no-eval
    const evaled = await eval(`(async () => {${code}})()`);
    const cleanedResponse = await clean(evaled);
    return { response: cleanedResponse, responseCode: 1 };
  } catch (err) {
    const cleanedError = await clean(err);
    return { response: cleanedError, responseCode: 0 };
  }
};
