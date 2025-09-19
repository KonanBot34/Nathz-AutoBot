const fs = require("fs");
const path = require("path");

const balanceFile = path.join(__dirname, "../database/balance.json");

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
    name: "slot",
    version: "1.0.0",
    role: 0,
    author: "Shiro Hayoshi",
    description: "Play slot machine with jackpot system",
    category: "Games",
    cooldowns: 5,
    hasPrefix: true
  },

  run: async function ({ api, event, args }) {
    const userID = event.senderID;
    let bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return api.sendMessage(
        "❌ Please place a valid bet amount.\nExample: slot 100",
        event.threadID,
        event.messageID
      );
    }

    let balanceDB = readJSON(balanceFile);
    if (!balanceDB.users[userID]) {
      balanceDB.users[userID] = { wallet: 0, bank: 0 };
    }

    if (balanceDB.users[userID].wallet < bet) {
      return api.sendMessage(
        "❌ You don't have enough coins in your wallet to bet.",
        event.threadID,
        event.messageID
      );
    }

    const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    let resultMsg = `🎰 | ${slot1} | ${slot2} | ${slot3} | 🎰\n\n`;
    let winnings = 0;

    if (slot1 === slot2 && slot2 === slot3) {
      // Jackpot (triple match)
      winnings = bet * 10;
      balanceDB.users[userID].wallet += winnings;
      resultMsg += `🎉 JACKPOT!!! You won ${winnings} coins!`;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      // Small win (double match)
      winnings = bet * 2;
      balanceDB.users[userID].wallet += winnings;
      resultMsg += `✨ You got a match! You won ${winnings} coins.`;
    } else {
      // Lose
      balanceDB.users[userID].wallet -= bet;
      resultMsg += `😢 You lost ${bet} coins. Better luck next time!`;
    }

    saveJSON(balanceFile, balanceDB);

    return api.sendMessage(
      `━━━『 𝗦𝗟𝗢𝗧 』━━━\n${resultMsg}\n━━━━━━━━━━━━━━━━━━━\nDeveloped by: Shiro Hayoshi`,
      event.threadID,
      event.messageID
    );
  },
};
