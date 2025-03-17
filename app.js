import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType, InteractionResponseFlags, verifyKeyMiddleware } from "discord-interactions";
import { getSongLyrics } from "./songLyricsAPI.js";
import { EmbedBuilder } from "discord.js";
import { capitalize } from "./utils.js";

const app = express();
const PORT = process.env.PORT;

app.post("/interactions", verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, id, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === "lyrics") {
      const requestedSong = data.options[0].value;
      const requestedArtist = data.options[1].value;

      const lyrics = await getSongLyrics(requestedArtist, requestedSong);
      const responseEmbed = new EmbedBuilder();

      const username = req.body.member.user.global_name || req.body.member.user.username;
      const avatar = `https://cdn.discordapp.com/avatars/${req.body.member.user.id}/${req.body.member.user.avatar}.png`;

      if (lyrics.startsWith("Failed to fetch song lyrics")) {
        responseEmbed
          .setTitle(`Something went wrong!`)
          .setDescription(
            `Something when wrong while looking for **${capitalize(requestedSong)}** by **${capitalize(requestedArtist)}**:\n\n\`${lyrics}\``
          )
          .setThumbnail("https://media.tenor.com/qsyIIg0tvo4AAAAi/manimarcus.gif")
          .setColor("#DD2222")
          .setTimestamp()
          .setFooter({ text: `Requested by ${username}`, iconURL: avatar });
      } else {
        responseEmbed
          .setTitle(`${capitalize(requestedSong)} by ${capitalize(requestedArtist)}`)
          .setDescription(lyrics)
          .setThumbnail("https://media1.tenor.com/m/3rk82pI48AcAAAAC/maid-outfit-vibe.gif")
          .setColor("#AA22FF")
          .setTimestamp()
          .setFooter({ text: `Requested by ${username}`, iconURL: avatar });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
          embeds: [responseEmbed],
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: "unknown command" });
  }

  console.error("unknown interaction type", type);
  return res.status(400).json({ error: "unknown interaction type" });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
