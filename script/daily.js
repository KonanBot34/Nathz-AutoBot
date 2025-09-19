const fs = require("fs");
const path = require("path");

const balanceFile = path.join(__dirname, "../database/balance.json");
const dailyFile = path.join(__dirname, "../database/daily.json");

// Helper: read JSON file
function readJSON(file) {
  if (!fs.existsSync(file)) return { users: {} };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Helper: save JSON file
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "daily",
    version: "1.0.0",
    role: 0,
    author: "Shiro Hayoshi",
    description: "Claim your daily coins (24h cooldown, random reward)",
    category: "Economy",
    cooldowns: 5,
    hasPrefix: true
  },

  run: async function ({ api, event }) {
    const userID = event.senderID;

    let balanceDB = readJSON(balanceFile);
    let dailyDB = readJSON(dailyFile);

    if (!balanceDB.users[userID]) {
      balanceDB.users[userID] = { wallet: 0, bank: 0 };
    }

    // Random reward between 200 and 1000
    const minReward = 200;
    const maxReward = 1000;
    const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;

    const cooldown = 24 * 60 * 60 * 1000; // 24h in ms
    const lastClaim = dailyDB.users[userID] || 0;
    const now = Date.now();

    if (now - lastClaim < cooldown) {
      const remaining = cooldown - (now - lastClaim);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      return api.sendMessage(
        `⏳ You already claimed your daily reward!\n` +
        `Please wait ${hours}h ${minutes}m before claiming again.`,
        event.threadID,
        event.messageID
      );
    }

    // Update balance
    balanceDB.users[userID].wallet += reward;
    saveJSON(balanceFile, balanceDB);

    // Save claim time
    dailyDB.users[userID] = now;
    saveJSON(dailyFile, dailyDB);

    return api.sendMessage(
      `━━━『 𝗗𝗮𝗶𝗹𝘆 𝗥𝗲𝘄𝗮𝗿𝗱 』━━━\n` +
      `✅ You claimed your daily reward!\n` +
      `💸 +${reward} coins added to your wallet.\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Developed by: Shiro Hayoshi`,
      event.threadID,
      event.messageID
    );
  },
};
