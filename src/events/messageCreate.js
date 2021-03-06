import client from '../client.js';
import { emoji, executeEval } from '../utils.js';

/*
  HELPER EVAL COMMAND

  OWNER ONLY
*/
export default async (message) => {
  if (message.author.id !== client.config.ownerId || !message.content.startsWith('.eval')) {
    return;
  }

  const { response, responseCode } = await executeEval(client, message.content.split('.eval').join('').trim());
  message.channel.send(`${responseCode === 0 ? emoji.redX : emoji.checkMark} **Eval**\n\`\`\`js\n${response}\`\`\``);
};
