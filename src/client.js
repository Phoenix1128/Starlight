import { Options, Intents } from 'discord.js';
import Bot from './structures/Bot';

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
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

export default client;
