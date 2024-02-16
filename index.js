const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const { menu, profile, donate, premium } = require("./commands.js");
const { sapa } = require("./text/text.json");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const client = new Client({
	authStrategy: new LocalAuth(),
	dataPath: "session",
});

//QR
client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

//Kalo udah Siap
client.on("ready", () => {
	console.log("Connected");
});

//Ini Buat Pesannya
client.on("message", async (msg) => {
	let user = await msg.getContact();
	const chat = await msg.getChat();
	console.log(`Dari: ${user.name} ${msg.type}: ${msg.body}`);

	if (sapa.includes(msg.body)) {
		await msg.reply(
			"Halo! Saya Bot VEO, Tunggu Sebentar ya^^ Owner sedang beristirahat.. Sampaikan pesan kamu melalui VN ya!"
		);
	} else if (msg.body.startsWith(".menu")) {
		menu.execute(msg);
	} else if (msg.body.startsWith(".profile")) {
		profile.execute(msg);
	} else if (msg.body.startsWith(".donate")) {
		donate.execute(msg);
	} else if (msg.body.startsWith(".premium")) {
		premium.execute(msg);
	} //Tag Orang

	// Tag semua MEMBER
	if (msg.body === ".everyone") {
		if (msg.isGroup) {
			const chat = await msg.getChat();
			let text = "";
			let mentions = [];
			for (let participant of msg.chat.participants) {
				mentions.push(`${participant.id.user}@c.us`);
				text += `@${participant.id.user} `;
			}
			msg.chat.sendMessage(text, { mentions });
		} else {
			await msg.reply("Perintah .everyone hanya berlaku di grup.");
		}
	} //ping with TAG
	else if (msg.body === ".ping") {
		await chat.sendMessage(`*🔴PONG!* @${user.id.user}`, {
			mentions: [user],
		});
	}

	//Unduhan Media
	if (msg.hasMedia === ".unduh") {
		//Download media ya
		const media = await msg.downloadMedia();
		// do something with the media data here
	}
});

client.initialize();
