const fs = require("fs");
const dbFile = "./database.json";

function loadDB() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ users: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}
function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "balance",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, 
  description: "Check your wallet and bank balance",
  usage: "{prefix}balance",
  credits: "Shiro hayoshi"
};

module.exports.run = async function({ api, event, args, prefix }) {
  const uid = event.senderID;
  let db = loadDB();

  // default values kung wala pa sa database
  if (!db.users[uid]) {
    db.users[uid] = { wallet: 500, bank: 0 };
  }

  const { wallet, bank } = db.users[uid];

  // save back to file
  saveDB(db);

  // fancy design output
  const msg =
`━━━『  𝗕𝗮𝗹𝗮𝗻𝗰𝗲 』━━━
𝖶𝖺𝗅𝗅𝖾𝗍: 💸 ${wallet} 𝖼𝗈𝗂𝗇𝗌
𝖡𝖺𝗇𝗄: 🏦 ${bank} 𝖼𝗈𝗂𝗇𝗌
━━━━━━━━━━━━━━━━━━━
Developed by: Shiro Hayoshi`;

  api.sendMessage(msg, event.threadID, event.messageID);
};
