import { Client } from 'discord.js';
import Enmap from 'enmap';
import { readdir } from 'fs';
import { AutoPoster } from 'topgg-autoposter';
import config from '../../config.js';
import { asyncForEach } from '../utils.js';
import NASA from './NASA.js';

export default class Bot extends Client {
  constructor(opts) {
    super(opts);

    this.config = config;
    this.commands = new Enmap();
    this.NASA = new NASA(config.NasaApiKey);

    this.topggAutoPoster = AutoPoster(config.topggApiKey, this);
  }

  /**
   * @private
   */
  _smartLogin() {
    this._initBaseEvents();
    this.login(config.token).then(async () => {
      console.log('Bot successfully logged in.');

      await this.application.fetch();
      this._initCommands();
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
    readdir('./src/commands/', (err, files) => {
      if (err) {
        return console.error(err);
      }

      // Looping over all files to load all commands
      return asyncForEach(files, async (file, i) => {
        if (!file.endsWith('.js')) {
          return;
        }

        const { data, run } = await import(`../commands/${file}`);
        const commandName = file.split('.')[0];

        console.log(`Reading command: ${commandName}`);
        this.commands.set(commandName, { data, run });

        await this._loadSlashCommand(commandName);

        if (i === files.length - 1) {
          console.log('Successfully read and loaded all commands.');
        }
      });
    });
  }

  /**
   * @private
   */
  async _loadSlashCommand(commandName) {
    const cmd = this.commands.get(commandName);
    await this.application.commands.create(cmd.data);
    console.log(`Loading command: ${commandName}`);
  }

  /**
   * @private
   */
  _initBaseEvents() {
    readdir('./src/events/', (err, files) => {
      if (err) {
        return console.error(err);
      }

      return asyncForEach(files, async (file, i) => {
        const { default: event } = await import(`../events/${file}`);
        console.log(`Reading event: ${file}`);
        this.on(file.split('.')[0], event);

        if (i === files.length - 1) {
          console.log('Successfully read all events.');
        }
      });
    });
  }

  start() {
    this._smartLogin();
  }
}
