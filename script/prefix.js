module.exports.config = {
  name: 'prefix',
  version: '1.0.0',
  role: 0,
  hasPrefix: false, // kahit walang prefix, pwede itype
  aliases: ['pre'],
  description: 'Show the bot prefix',
  usage: 'prefix',
  credits: 'Shiro',
  cooldown: 5,
};

let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}

module.exports.run = async function({ api, event }) {
  const adminList = global.config.ADMINBOT || [];

  let adminLinks = "";
  for (let uid of adminList) {
    try {
      const userInfo = await api.getUserInfo(uid);
      const name = userInfo[uid]?.name || "Unknown";
      adminLinks += `⊂⊃: ${name}\nhttps://facebook.com/${uid}\n\n`;
    } catch (err) {
      adminLinks += `⊂⊃: https://facebook.com/${uid}\n\n`;
    }
  }

  const message = formatFont(
`>──────────────<
This is my prefix : [ ${global.config.PREFIX} ]

BOT OWNER(S):
${adminLinks}`
  );

  api.sendMessage(message.trim(), event.threadID, event.messageID);
};
