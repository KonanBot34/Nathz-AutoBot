const path = require('path');
const pathFile = path.join(__dirname, '..', 'cache', 'maintenance.txt');
const fs = require('fs-extra');

module.exports["config"] = {
  name: "maintenance",
  version: "1.0.0",
  role: 2,
  credits: "Markdevs69",
  description: "Turn on/off Maintenance mode.",
  hasPrefix: true,
  commandCategory: "Admin",
  usages: "[on/off]",
  cooldown: 5,
};

module.exports["run"] = async ({ api, event, args }) => {
     if (args[0] == 'on') {
       fs.writeFileSync(pathFile, 'true');
       api.sendMessage('Maintenance mode is now enable.', event.threadID, event.messageID);
     } else if (args[0] == 'off') {
       fs.writeFileSync(pathFile, 'false');
       api.sendMessage('Maintenance mode is now disabled.', event.threadID, event.messageID);
     } else {
       api.sendMessage('Incorrect syntax', event.threadID, event.messageID);
     }
};
