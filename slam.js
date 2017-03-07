const Discord = require("discord.js"), client = new Discord.Client();
const request = require("request-promise")

let token = ""
let channelid = ""

client.login(token);

client.on("ready", () => {
	client.channels.get(channelid).join().then(connection => {
		let stream = request({uri:'http://stream.radiocorp.nl/web11_aac', headers:{'User-Agent':'SLAM!'}});
		connection.playStream(stream, {passes: 2})
	})
})

client.on("message", msg => {
	if (msg.content === "slam save") {
		msg.author.sendMessage(client.user.presence.game.name)
	}
})

let now = ""

setInterval(() => {
	request({
		uri:'https://live.slam.nl/slam-hardstyle/metadata/hardstyle_livewall',
		headers:{'User-Agent':'SLAM!'},
		json: true
	}).then(data => {
		if (now === data) return false;
		now = data
		client.user.setGame(`${data.nowArtist} - ${data.nowTitle}`)
	})
}, 10000)
