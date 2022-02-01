import { Client } from 'discord.js';
import Keyv from 'keyv';
import { readdir } from 'fs';
import config from '../../config';
import { asyncForEach } from '../utils';
import NASA from './NASA';

export default class Bot extends Client {
  constructor(opts) {
    super(opts);

    this.config = config;
    this.commands = new Keyv({ namespace: 'commands' });
    this.NASA = new NASA();
  }

  /**
   * @private
   */
  _smartLogin() {
    this.login(config.token).then(() => {
      console.log('Bot successfully logged in.');
    }).catch(() => {
      console.log('Retrying login...');
      let counter = 1;
      const interval = setInterval(() => {
        console.log(`  Attempt #${counter}`);
        counter += 1;
        this.login(config.token).then(() => {
          console.log('  Bot successfully logged in.');
          clearInterval(interval);
        });
      }, 30000);
    });
  }

  /**
   * @private
   */
  _initCommands() {
    readdir('./commands/', (err, files) => {
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
        this.commands.set(commandName, props);
      });

      console.log('Successfully read all commands.');

      this._loadSlashCommands();
      return console.log('Successfully loaded all commands.');
    });
  }

  /**
   * @private
   */
  _loadSlashCommands() {
    const commandsArr = this.commands.keyArray();
    asyncForEach(commandsArr, async (command) => {
      const cmd = this.slashCommands.get(command);
      this.application.commands.create(cmd.data)
        .then(async (slashCommand) => {
          console.log(`Loading command: ${slashCommand.name}`);
          await slashCommand.permissions.add(cmd.data.permissions);
        }).catch(console.error);
    });
  }

  /**
   * @private
   */
  _initBaseEvents() {
    readdir('./events', (err, files) => {
      if (err) {
        return console.error(err);
      }
      return files.forEach((file) => {
        const event = require(`./events/${file}`);
        this.on(file.split('.')[0], event);
      });
    });
  }

  start() {
    this._initBaseEvents();
    this._smartLogin();
    this._initCommands();
  }
}
