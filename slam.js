const req    = require('snekfetch');
const Eris   = require('eris');
const client = new Eris('TOKEN');

client.connect();

client.on('ready', async () => {
	await client.joinVoiceChannel('VOICECHANNEL ID');
	client.voiceConnections.get('GUILD ID').play('http://stream.radiocorp.nl/web11_aac')
})

client.on('messageCreate', msg => {
	if (msg.author.bot) return;

	if (msg.content === 'slam save') 
		msg.author.createMessage(now);
	if (msg.content === 'slam stats') 
		msg.channel.createMessage({ embed: {
			color: 0xE60268,
			title: 'SLAM! Stats',
			description: `Ping: ${msg.channel.guild.shard.latency}ms\n` +
			     	`RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
			     	`Uptime: ${process.uptime() / 60} minutes`
		}});

	if (msg.content === 'slam np') 
		msg.channel.createMessage({ embed: {
			color: 0xE60268,
			title: 'Now Playing',
			description: now
		}});

	if (msg.content === 'slam help') 
		msg.channel.createMessage('slam < save | stats | np >');
})

let now = ''

setInterval(async () => {
	let res = await req.get('https://live.slam.nl/slam-hardstyle/metadata/hardstyle_livewall').set('User-Agent', 'discord-slambot/1.0')
	if (res.status !== 200 || !res.body.nowArtist || !res.body.nowTitle || now === `${res.body.nowArtist} - ${res.body.nowTitle}`) return;

	now = `${res.body.nowArtist} - ${res.body.nowTitle}`
	client.editStatus({ name: `${res.body.nowArtist} - ${res.body.nowTitle}` });

}, 10000)
