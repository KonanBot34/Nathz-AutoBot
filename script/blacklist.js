const fs = require('fs');

module.exports.config = {
  name: 'blacklist',
  version: '1.0.0',
  role: 2,
  hasPrefix: true,
  aliases: [],
  description: "Permission to use the bot",
  usages: "{p}{n} bann userid/reply & {p}{n} unbann userid/reply",
  credits: 'Developer',
  cooldowns: 3,
};

module.exports["run"] = async function({ api, event, args }) {
  const { mentions, messageReply, threadID, senderID, messageID } = event;
  const targetID = args[1] || (messageReply && messageReply.senderID);

const uid = await api.getCurrentUserID();
let history = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'));


let blacklist = history.find(item => item.userid === uid) || { userid: uid, blacklist: [] };

  if (!targetID) {
    return api.sendMessage(`Please mention a user or reply to a message to specify the user.`, threadID, messageID);
  }

  const command = args[0];

  if (command === 'bann') {
    if (!blacklist.blacklist.includes(targetID)) {
      blacklist.blacklist.push(targetID);
      fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2));
      return api.sendMessage(`User ${targetID} has been banned.`, threadID, messageID);
    } else {
      return api.sendMessage(`User ${targetID} is already banned.`, threadID, messageID);
    }
  }

  if (command === 'unbann') {
    if (blacklist.blacklist.includes(targetID)) {
      blacklist.blacklist = blacklist.blacklist.filter(id => id !== targetID);
      fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2));
      return api.sendMessage(`User ${targetID} has been unbanned.`, threadID, messageID);
    } else {
      return api.sendMessage(`User ${targetID} is not banned.`, threadID, messageID);
    }
  }

  return api.sendMessage(`Invalid command. Use either 'bann' or 'unbann'.`, threadID, messageID);
};
