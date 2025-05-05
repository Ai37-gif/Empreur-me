module.exports = {
    config: {
        name: "bonjour",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: "Noo Prefix",
        longDescription: "Noo Prefix",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "bonjour") return message.reply("𝐁𝐎𝐍𝐉𝐎𝐔𝐑 𝐌𝐎𝐈 𝐂'𝐄𝐒𝐓 𝐋'𝐄𝐌𝐏𝐄𝐑𝐄𝐔𝐑 𝐀𝐊𝐀𝐒𝐇𝐈 𝐉𝐄 𝐒𝐔𝐈𝐒 𝐔𝐍𝐄 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 𝐀𝐑𝐓𝐈𝐅𝐈𝐂𝐈𝐄𝐋 𝐂𝐑𝐄𝐄 𝐏𝐀𝐑 𝐂𝐈𝐄𝐋 𝐁𝐋𝐄𝐔 𝐄𝐍 𝐐𝐔𝐎𝐈 𝐏𝐔𝐈𝐒 𝐉𝐄 𝐕𝐎𝐔𝐒 𝐀𝐈𝐃𝐄𝐙?♣️");
}
};
