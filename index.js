/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Discord = require('discord.js');
const Keyv = require('keyv');
const fs = require('fs');
const config = require('./config');
const emoji = require('./src/emoji');

const client = new Discord.Client({
  makeCache: Discord.Options.cacheWithLimits({
    MessageManager: 10,
  }),
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true,
  },
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});
client.config = config;
client.emoji = emoji;

fs.readdir('./src/modules/', (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    require(`./src/modules/${file}`)(client);
  });
});

fs.readdir('./events/', (err, files) => {
  if (err) {
    return console.error(err);
  }
  return files.forEach((file) => {
    const event = require(`./events/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

client.commands = new Keyv({ namespace: 'commands' });

fs.readdir('./commands/', (err, files) => {
  if (err) {
    return console.error(err);
  }

  // Looping over all files to load all commands
  files.forEach((file) => {
    if (!file.endsWith('.js')) {
      return;
    }

    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];

    console.log(`Reading command: ${commandName}`);
    client.slashCommands.set(commandName, props);
  });
});

client.login(config.token).then(() => {
  console.log('Bot successfully logged in.');
}).catch(() => {
  console.log('Retrying client.login()...');
  let counter = 1;
  const interval = setInterval(() => {
    console.log(`  Retrying attempt ${counter}`);
    counter += 1;
    client.login(config.token).then(() => {
      console.log('  Bot successfully logged in.');
      clearInterval(interval);
    });
  }, 30000);
});
