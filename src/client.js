import { Options, Intents } from 'discord.js';
import Bot from './structures/Bot.js';

const client = new Bot({
  makeCache: Options.cacheWithLimits({
    MessageManager: 10,
  }),
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true,
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

export default client;
