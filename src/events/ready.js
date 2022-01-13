import client from '../client';

export default async () => {
  if (!client.application.owner) {
    await client.application.fetch();
  }

  setInterval(() => {
    try {
      client.user.setActivity(`the stars with ${client.guilds.cache.size} servers!`, { type: 'WATCHING' });
    } catch (e) {
      // Don't need any handling
    }
  }, 30000);

  // Logging a ready message on first boot
  console.log(`Ready sequence finished, with ${client.users.cache.size} user(s), in ${client.channels.cache.size} channel(s) of ${client.guilds.cache.size} guild(s).`);
};
