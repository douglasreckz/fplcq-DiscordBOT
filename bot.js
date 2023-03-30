require('dotenv').config();

const Discord = require('discord.js');
const axios = require('axios');
const fs = require("fs");
const converter = require('json-2-csv');
const { GatewayIntentBits } = require("discord.js");
const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const URL = 'https://api.faceit.com/leaderboard/v2/ranking'

const hubs = {
  MasterLeagueSA: '63fe9587094dc168d1134133',
  MasterLeagueNA: '63fe9581e4bbe81631b231b1',
  MasterLeagueEU: '63fe9580094dc168d113409e',
}

async function getList(limit, offset, leadearboardId) {
  const response = await axios.get(`${URL}/${leadearboardId}?limit=${limit}&offset=${offset}`);
  return response.data.payload.rankings;
}

client.on('ready', () => {
  console.log(`Logged as ${client.user.tag}`);
})

client.on('messageCreate', async (msg) => {
  if (msg.content == '!lbsa') {
    msg.channel.sendTyping();
    const first = await getList(50, 0, hubs.MasterLeagueSA);
    const second = await getList(50, 50, hubs.MasterLeagueSA);

    const rankings = [...first, ...second];
    const cleanRankings = rankings.map((ranking) => {
      const player = { position: ranking.position, guid: ranking.placement.entity_id, nick: ranking.placement.entity_name }
      return player;
    });
    const csv = await converter.json2csv(cleanRankings);
    fs.writeFileSync("rankings.csv", csv);
    msg.channel.send({
      files: [{
        attachment: "./rankings.csv",
        name: 'rankings.csv',
        description: 'Rankings'
      }]
    });
  }
})

client.on('messageCreate', async (msg) => {
  if (msg.content == '!lbna') {
    msg.channel.sendTyping();
    const first = await getList(50, 0, hubs.MasterLeagueNA);

    const rankings = [...first,];
    const cleanRankings = rankings.map((ranking) => {
      const player = { position: ranking.position, guid: ranking.placement.entity_id, nick: ranking.placement.entity_name }
      return player;
    });
    const csv = await converter.json2csv(cleanRankings);
    fs.writeFileSync("rankings.csv", csv);
    msg.channel.send({
      files: [{
        attachment: "./rankings.csv",
        name: 'rankings.csv',
        description: 'Rankings'
      }]
    });
  }
})
client.on('messageCreate', async (msg) => {
  if (msg.content == '!lbeu') {
    msg.channel.sendTyping();
    const first = await getList(50, 0, hubs.MasterLeagueEU);
    const second = await getList(50, 50, hubs.MasterLeagueEU);

    const rankings = [...first, ...second];
    const cleanRankings = rankings.map((ranking) => {
      const player = { position: ranking.position, guid: ranking.placement.entity_id, nick: ranking.placement.entity_name }
      return player;
    });
    const csv = await converter.json2csv(cleanRankings);
    fs.writeFileSync("rankings.csv", csv);
    msg.channel.send({
      files: [{
        attachment: "./rankings.csv",
        name: 'rankings.csv',
        description: 'Rankings'
      }]
    });
  }
})

client.login(process.env.TOKEN_BOT);