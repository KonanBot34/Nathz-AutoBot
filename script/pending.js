const moment = require("moment-timezone");
const axios = require("axios");
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports.config = {
  name: "pending",
  version: "1.0.5",
  credits: "Mirai Team",
  role: 2,
  usage: "{p}pending list | {p}pending approve numberThread/groupID | {p}pending cancel by_number/groupID",
  hasPrefix: false,
  usePrefix: false,
  description: "Manage bot's waiting messages",
  commandCategory: "system",
  cooldown: 1
};

module.exports.run = async function({ api, event, args, admin, prefix }) {
  if (!admin.includes(event.senderID))
    return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID);

  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `Invalid usage: Use\n{p}pending list\n{p}pending approve by_number/groupID\n{p}pending cancel by_number/groupID`,
      threadID,
      messageID
    );
  }

  let msg = "";
  let index = 1;
  let count = 0;

  try {
    const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
    const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
    const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) {
      msg += `${index++}. 『${single.name} </> ${single.threadID}』\n`;
    }

    if (list.length === 0) {
      return api.sendMessage("「PENDING」There is no thread in the pending list", threadID, messageID);
    }

    if (args[0] === "list") {
      return api.sendMessage(`»「PENDING」«❮ The whole number of threads to approve is: ${list.length} thread(s) ❯\n\n${msg}`, threadID, messageID);
    }

    if (args[0] === "approve" || args[0] === "cancel") {
      const isApprove = args[0] === "approve";
      const threadIndexes = args.slice(1).map(Number).filter(n => !isNaN(n) && n > 0 && n <= list.length);

      if (threadIndexes.length === 0) {
        return api.sendMessage(
          `Invalid usage: Use\n{p}pending list\n{p}pending approve by_number/groupID\n{p}pending cancel by_number/groupID`,
          threadID,
          messageID
        );
      }

      for (const singleIndex of threadIndexes) {
        const groupThreadID = list[singleIndex - 1].threadID;
        if (isApprove) {
          const gifUrls = [
            'https://i.imgur.com/ZUZBLjf.gif',
            'https://i.imgur.com/0ywNTvk.gif'
          ];

          const gifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
          const response = await axios.get(gifUrl, { responseType: 'stream' });

          const userName = await getUserName(api, admin);
          const uid = await api.getCurrentUserID();
          const je = await getUserName(api, uid);

          const autofont = {
            sansbold: {
              a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
              j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
              s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
              A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
              J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
              S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
              " ": " "
            },
          };

          const textToAutofont = (text, font) => {
            const convertedText = [...text].map(char => font[char] || char).join("");
            return convertedText;
          };

          const ju = textToAutofont(userName, autofont.sansbold);
          const jh = textToAutofont(je, autofont.sansbold);
          const d = textToAutofont(prefix, autofont.sansbold);

          const approvalMessage = `🔴🟢🟡\n\n✅ 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦! \n\n➭ BotName: ${jh}\n➭ Bot Prefix: ⟨${prefix}⟩\n➭ Approved-by: ⟨${ju}⟩\n➭ Owner: ‹https://m.me/${admin}›\n➭ Use ${prefix}help to view command details\n➭ Added bot at: ⟨${moment().tz('Asia/Manila').format("HH:mm:ss - DD/MM/YYYY")}⟩〈${moment().tz('Asia/Manila').format('dddd')}〉`;

          api.sendMessage({
            body: approvalMessage,
            attachment: response.data
          }, groupThreadID);

        } else {
          api.removeUserFromGroup(api.getCurrentUserID(), groupThreadID);
        }

        count++;
      }

      return api.sendMessage(`Successfully ${isApprove ? 'approved' : 'canceled'} ${count} threads`, threadID, messageID);
    } else {
      return api.sendMessage(
        `Invalid usage: Use\n{p}pending list\n{p}pending approve by_number/groupID\n{p}pending cancel by_number/groupID`,
        threadID,
        messageID
      );
    }
  } catch (error) {
    return api.sendMessage("Cannot get pending list", threadID, messageID);
  }
};

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name;
  } catch (error) {
    return "User";
  }
}
