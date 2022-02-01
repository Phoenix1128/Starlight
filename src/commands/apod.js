import client from '../client';

export const data = {
  name: 'apod',
  description: "Gets NASA's Astronomy Picture of the Day.",
  permissions: [],
};

export async function run(interaction) {
  client.NASA.apod();
}
