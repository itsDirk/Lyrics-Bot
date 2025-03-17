import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const LYRICS_COMMAND = {
  name: 'lyrics',
  description: 'Get lyrics of a song',
  type: 1,
  options: [
    {
      type: 3,
      name: "song",
      description: "Song name",
      required: true,
    },
    {
      type: 3,
      name: "artist",
      description: "Song's artist",
      required: true,
    },
  ],
  integration_types: [0],
  contexts: [0],
};

const ALL_COMMANDS = [LYRICS_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
