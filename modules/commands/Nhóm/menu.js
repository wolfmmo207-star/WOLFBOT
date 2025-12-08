module.exports.config = {
  name: "menu",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "DC-Nam mod by Toàn",
  description: "Xem danh sách nhóm lệnh, thông tin lệnh",
  commandCategory: "Nhóm",
  usages: "[...name commands|all]",
  cooldowns: 5,
  usePrefix: false,
  envConfig: {
    autoUnsend: {
      status: true,
      timeOut: 60
    }
  }
};

const { autoUnsend = this.config.envConfig.autoUnsend } =
  global.config == undefined
    ? {}
    : global.config.menu == undefined
    ? {}
    : global.config.menu;
const { compareTwoStrings, findBestMatch } = require("string-similarity");
const { readFileSync, writeFileSync, existsSync } = require("fs-extra");

module.exports.run = async function ({ api, event, args }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY");

  const { sendMessage: send, unsendMessage: un } = api;
  const { threadID: tid, messageID: mid, senderID: sid } = event;
  const cmds = global.client.commands;

  const video = global.vdcos && global.vdcos.length > 0 ? global.vdcos.splice(0, 1)[0] : null;

  if (args.length >= 1) {
    if (typeof cmds.get(args.join(" ")) == "object") {
      const body = infoCmds(cmds.get(args.join(" ")).config);
      return send(body, tid, mid);
    } else {
      if (args[0] == "all") {
        const data = cmds.values();
        let txt = "[ LIST All COMMANDS ]\n────────────────────\n";
        let count = 0;
        for (const cmd of data) {
          txt += `${++count}. Tên lệnh: ${cmd.config.name}\n📌 Mô tả: ${cmd.config.description}\n\n`;
        }
        txt += `\n────────────────────\n⏳ Tự động gỡ tin nhắn sau: ${autoUnsend.timeOut}s`;

        send({ body: txt, attachment: video ? [video] : [] }, tid, (a, b) => {

          if (b && b.messageID) {
            setTimeout(() => {
              api.unsendMessage(b.messageID, (err) => {
                if (err) console.error("Lỗi khi gỡ tin nhắn:", err);
              });
            }, autoUnsend.timeOut * 1000);
          } else {
            console.error("Không thể lấy messageID để gỡ.");
          }
        });
      } else {
        const requestedCategory = args.join(" ");
        const categoryCommands = Array.from(cmds.values()).filter(cmd => cmd.config.commandCategory.toLowerCase() === requestedCategory.toLowerCase());

        if (categoryCommands.length === 0) {
          const cmdsValue = cmds.values();
          const arrayCmds = [];
          for (const cmd of cmdsValue) arrayCmds.push(cmd.config.name);
          const similarly = findBestMatch(args.join(" "), arrayCmds);
          if (similarly.bestMatch.rating >= 0.3)
            return send(
              `"${args.join(" ")}" là lệnh gần giống là "${similarly.bestMatch.target}" ?`,
              tid,
              mid
            );
          else {
            return send(`Không tìm thấy nhóm lệnh "${requestedCategory}".`, tid, mid);
          }
        }

        let txt = `[ MENU ${requestedCategory.toUpperCase()} ]\n──────────────────\n`;
        let count = 0;
        for (const cmd of categoryCommands) {
          txt += `${++count}. ${cmd.config.name} - ${cmd.config.description}\n`;
        }
        txt += `\n──────────────────\n📌 Tổng ${categoryCommands.length} lệnh thuộc nhóm ${requestedCategory}.\n⏳ Tự động gỡ tin nhắn sau: ${autoUnsend.timeOut}s\n👤 Dùng ${global.config.PREFIX}menu + tên lệnh nếu muốn xem chi tiết cách sử dụng lệnh`;

        send({ body: txt, attachment: video ? [video] : [] }, tid, (a, b) => {
          if (b && b.messageID) {
            setTimeout(() => {
              api.unsendMessage(b.messageID, (err) => {
                if (err) console.error("Lỗi khi gỡ tin nhắn:", err);
              });
            }, autoUnsend.timeOut * 1000);
          } else {
            console.error("Không thể lấy messageID để gỡ.");
          }
        });

      }
    }
  } else {
    const data = commandsGroup();
    let txt = "[ MENU COMMANDS ]\n──────────────────\n";
    let count = 0;
    for (const { commandCategory, commandsName } of data)
      txt += `${++count}. ${commandCategory} - có ${commandsName.length} lệnh\n`;
    txt += `\n──────────────────\n╭─────────╮\n  Tổng ${global.client.commands.size} lệnh\n╰─────────╯\n⏰ Thời gian hiện tại:\n${time}\n🔎 Reply từ 1 đến ${data.length} để chọn\n⏳ Tự động gỡ tin nhắn sau: ${autoUnsend.timeOut}s\n👤 Nếu có thắc mắc gì về lệnh, bot bị lỗi thì ib trực tiếp Admin để được hỗ trợ nhé!`;

    send({ body: txt, attachment: video ? [video] : [] }, tid, (a, b) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: b.messageID,
        author: sid,
        case: "infoGr",
        data,
      });
      if (b && b.messageID) {
        setTimeout(() => {
          api.unsendMessage(b.messageID, (err) => {
            if (err) console.error("Lỗi khi gỡ tin nhắn:", err);
          });
        }, autoUnsend.timeOut * 1000);
      } else {
        console.error("Không thể lấy messageID để gỡ.");
      }
    });
  }
};

module.exports.handleReply = async function ({ handleReply: $, api, event }) {
  const { sendMessage: send, unsendMessage: un } = api;
  const { threadID: tid, messageID: mid, senderID: sid, body } = event;
  // Parse args from body since event.args is not provided in handleReply
  const args = body.trim().split(/\s+/);

  const video = global.vdcos && global.vdcos.length > 0 ? global.vdcos.splice(0, 1)[0] : null;
  const autoUnsend = global.config?.menu?.autoUnsend || { status: true, timeOut: 60 };

  if (sid != $.author) {
    return send(`⛔ Cút ra chỗ khác`, tid, mid);
  }

  switch ($.case) {
    case "infoGr": {
      const data = $.data[+args[0] - 1];
      if (!data) {
        return send(`"${args[0]}" không nằm trong số thứ tự menu`, tid, mid);
      }

      un($.messageID);
      let txt = "『 " + data.commandCategory + " 』\n──────────────────\n";
      let count = 0;
      for (const name of data.commandsName) txt += `${++count}. ${name}\n`;
      txt += `──────────────────\n🔎 Reply từ 1 đến ${data.commandsName.length} để chọn\n⏳ Tự động gỡ tin nhắn sau: ${autoUnsend.timeOut}s\n👤 Dùng ${global.config.PREFIX}menu + tên lệnh nếu muốn xem chi tiết cách sử dụng lệnh`;

      send({ body: txt, attachment: video ? [video] : [] }, tid, (a, b) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: b.messageID,
          author: sid,
          case: "infoCmds",
          data: data.commandsName,
        });
        if (b && b.messageID) {
          setTimeout(() => {
            api.unsendMessage(b.messageID, (err) => {
              if (err) console.error("Lỗi khi gỡ tin nhắn:", err);
            });
          }, autoUnsend.timeOut * 1000);
        } else {
          console.error("Không thể lấy messageID để gỡ.");
        }
      });
      break;
    }
    case "infoCmds": {
      const data = global.client.commands.get($.data[+args[0] - 1]);
      if (!data) {
        return send(`⚠️ "${args[0]}" không nằm trong số thứ tự menu`, tid, mid);
      }

      un($.messageID);
      send(infoCmds(data.config), tid, mid);
      break;
    }
  }
};

function commandsGroup() {
  const array = [];
  const cmds = global.client.commands.values();
  for (const cmd of cmds) {
    const { name, commandCategory } = cmd.config;
    const find = array.find(i => i.commandCategory == commandCategory);
    !find ? array.push({ commandCategory, commandsName: [name] }) : find.commandsName.push(name);
  }
  array.sort(sortCompare("commandsName"));
  return array;
}

function infoCmds(config) {
  return `[ INFO - COMMANDS ]\n====================\n|- 📔 Tên lệnh: ${config.name}\n|- 🌴 Phiên bản: ${config.version}\n|- 🔐 Quyền hạn: ${premssionTxt(config.hasPermssion)}\n|- 👤 Tác giả: ${config.credits}\n|- 🌾 Mô tả: ${config.description}\n|- 📎 Thuộc nhóm: ${config.commandCategory}\n|- 📝 Cách dùng: ${config.usages}\n|- ⏳ Thời gian chờ: ${config.cooldowns} giây\n`;
}

function premssionTxt(level) {
  return level == 0 ? "Thành Viên" : level == 1 ? "Quản Trị Viên Nhóm" : "Admin";
}

function sortCompare(key) {
  return (a, b) => (a[key].length > b[key].length ? -1 : 1);
}