/**
┌⪼❏ tele x wa pair sys
├◆ Telegram ⇄ WhatsApp Bridge
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ
*/

const TelegramBot = require("node-telegram-bot-api");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const fs = require("fs");
require("./settings.js");
const nullHandler = require("./null.js");

//================ BOT INIT =================//
const det = new TelegramBot(global.telegramToken, {
  polling: true
});

//================ GLOBAL STATE =================//
global.inline = global.inline ?? true;
global.lockPair = global.lockPair ?? false;
global.sessionState = global.sessionState || {};
global.activeSockets = global.activeSockets || {};
global.startTime = global.startTime || Date.now();
global.vip = global.vip || [];

//================ STORAGE SETUP =================//
const dbPath = "./system/database";
const sessionDir = "./Null_Sessions";

const userDB = `${dbPath}/users.json`;
const couponDB = `${dbPath}/coupons.json`;
const collabDB = `${dbPath}/collabs.json`;

if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

if (!fs.existsSync(userDB)) fs.writeFileSync(userDB, "{}");
if (!fs.existsSync(couponDB)) fs.writeFileSync(couponDB, "{}");
if (!fs.existsSync(collabDB)) fs.writeFileSync(collabDB, JSON.stringify([], null, 2));

//================ DATABASE HELPERS =================//
const getUsers = () => JSON.parse(fs.readFileSync(userDB));
const saveUsers = (d) => fs.writeFileSync(userDB, JSON.stringify(d, null, 2));

const getCoupons = () => JSON.parse(fs.readFileSync(couponDB));
const saveCoupons = (d) => fs.writeFileSync(couponDB, JSON.stringify(d, null, 2));

const getCollabs = () => JSON.parse(fs.readFileSync(collabDB));
const saveCollabs = (d) => fs.writeFileSync(collabDB, JSON.stringify(d, null, 2));

//================ PERMISSION CHECKS =================//
const isAdmin = (id) => (global.adminTelegramIds || []).includes(String(id));
const isVip = (id) => global.vip.includes(String(id));

//================ SESSION STATUS =================//
function getSessionStatus(id) {
  const dir = `${sessionDir}/${id}`;
  if (!fs.existsSync(dir)) return "NOT LINKED";
  return global.sessionState[id] || "OFFLINE";
}

//================ CHANNEL VERIFICATION =================//
async function checkChannel(userId) {
  try {
    const collabs = getCollabs();
    const requiredChannels = [...(global.requiredChannels || []), ...collabs];
    
    if (requiredChannels.length === 0) return true;
    
    for (let ch of requiredChannels) {
      try {
        const res = await det.getChatMember(ch, userId);
        if (!res || ["left", "kicked"].includes(res.status)) return false;
      } catch (e) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function getNotJoinedChannels(userId) {
  const notJoined = [];
  const collabs = getCollabs();
  const requiredChannels = [...(global.requiredChannels || []), ...collabs];
  
  for (let ch of requiredChannels) {
    try {
      const res = await det.getChatMember(ch, userId);
      if (!res || ["left", "kicked"].includes(res.status)) {
        notJoined.push(ch);
      }
    } catch (e) {
      notJoined.push(ch + " (Bot not admin)");
    }
  }
  return notJoined;
}

//================ ACCESS CONTROL =================//
function canUse(id) {
  if (isAdmin(id)) return true;

  let users = getUsers();
  users[id] = users[id] || { banned: false, vip: false, redeemed: [] };

  if (users[id].banned) return false;
  if (users[id].vip) return true;
  if (isVip(id)) return true;

  return global.freeTrialEnabled;
}

//================ INLINE MENU BUILDER =================//
function buildInlineMenu(isAdm, chatId) {
  const keyboard = [];

  const row1 = [];
  row1.push({ text: "SESSION", callback_data: "session" });
  if (isAdm) {
    row1.push({ text: "USERS", callback_data: "users" });
  }
  keyboard.push(row1);

  const row2 = [];
  row2.push({ text: "PAIR", callback_data: "pair" });
  row2.push({ text: "STATS", callback_data: "stats" });
  keyboard.push(row2);

  if (isAdm) {
    const row3 = [];
    row3.push({ text: "ADMIN PANEL", callback_data: "admin_panel" });
    keyboard.push(row3);
  }

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

function buildAdminPanelKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "INLINE ON/OFF", callback_data: "admin_inline" },
          { text: "LOCK PAIR ON/OFF", callback_data: "admin_lockpair" }
        ],
        [
          { text: "BROADCAST", callback_data: "admin_bc" },
          { text: "BROADCAST IMG", callback_data: "admin_bcimg" }
        ],
        [
          { text: "VIP LIST", callback_data: "admin_violist" },
          { text: "SESSIONS", callback_data: "admin_sessions" }
        ],
        [
          { text: "CHECK USERS", callback_data: "admin_checkusers" },
          { text: "COLLAB LIST", callback_data: "admin_listcollab" }
        ],
        [
          { text: "ADD COLLAB", callback_data: "admin_addcollab" },
          { text: "REMOVE COLLAB", callback_data: "admin_rmcollab" }
        ],
        [
          { text: "TEST JOIN", callback_data: "admin_testjoin" },
          { text: "STATS", callback_data: "admin_stats" }
        ],
        [
          { text: "BACK TO MENU", callback_data: "back_to_menu" }
        ]
      ]
    }
  };
}

function buildTextMenu(isAdm) {
  let menu = `┌⪼❏ USER MENU
├ /pair <number>
├ /activesession
├ /stats
├ /joinstatus
└ ❏ NULL SYSTEM`;

  if (isAdm) {
    menu += `\n\n┌⪼❏ ADMIN PANEL
├ /adminpanel
├ /bc
├ /bcimg
├ /inline on/off
├ /lockpair on/off
├ /violist
├ /sessions
├ /checkusers
├ /addcollab <@username>
├ /rmcollab <@username>
├ /listcollab
├ /testjoin
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
  }

  return menu;
}

//================ START COMMAND =================//
det.onText(/\/start/, async (msg) => {
  const id = String(msg.from.id);

  let users = getUsers();
  users[id] = users[id] || { banned: false, vip: false, redeemed: [] };
  saveUsers(users);

  const joined = await checkChannel(id);
  
  if (!joined) {
    const notJoined = await getNotJoinedChannels(id);
    const channelList = notJoined.map(c => `├ ${c}`).join("\n");
    
    return det.sendMessage(msg.chat.id,
`┌⪼❏ ACCESS DENIED
├ You must join all required channels
├ to use this bot
│
├ REQUIRED CHANNELS:
${channelList}
│
└ ❏ Please join and /start again`);
  }

  det.sendMessage(msg.chat.id,
`┌⪼❏ ${global.nameBot}
├ dev: ${global.dev}
├ version: ${global.versionBot}
├ inline: ${global.inline}
├ Made by: ${global.authors}
└ use /det or /panel
> ${global.nameauthor}`);
});

//================ MENU WITH IMAGE =================//
det.onText(/\/det/, async (msg) => {
  const id = String(msg.from.id);
  const isAdm = isAdmin(id);
  const chatId = msg.chat.id;

  const joined = await checkChannel(id);
  if (!joined) {
    const notJoined = await getNotJoinedChannels(id);
    const channelList = notJoined.map(c => `├ ${c}`).join("\n");
    
    return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
├ You must join all required channels
├ to use this bot
│
├ REQUIRED CHANNELS:
${channelList}
│
└ ❏ Please join and try again`);
  }

  if (global.inline) {
    const opts = buildInlineMenu(isAdm, chatId);
    if (global.img && global.img.menu) {
      return det.sendPhoto(chatId, global.img.menu, {
        caption: `┌⪼❏ MAIN MENU
├ ${global.nameBot}
├ dev: ${global.dev}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
        ...opts
      });
    } else {
      return det.sendMessage(chatId, "┌⪼❏ MAIN MENU", opts);
    }
  }

  const textMenu = buildTextMenu(isAdm);
  return det.sendMessage(chatId, textMenu);
});

//================ PANEL COMMAND =================//
det.onText(/\/panel/, async (msg) => {
  const id = String(msg.from.id);
  const isAdm = isAdmin(id);
  const chatId = msg.chat.id;

  const joined = await checkChannel(id);
  if (!joined) {
    const notJoined = await getNotJoinedChannels(id);
    const channelList = notJoined.map(c => `├ ${c}`).join("\n");
    
    return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
├ You must join all required channels
├ to use this bot
│
├ REQUIRED CHANNELS:
${channelList}
│
└ ❏ Please join and try again`);
  }

  if (global.inline) {
    const opts = buildInlineMenu(isAdm, chatId);
    if (global.img && global.img.menu) {
      return det.sendPhoto(chatId, global.img.menu, {
        caption: `┌⪼❏ MAIN MENU
├ ${global.nameBot}
├ dev: ${global.dev}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
        ...opts
      });
    } else {
      return det.sendMessage(chatId, "┌⪼❏ MAIN MENU", opts);
    }
  }

  const textMenu = buildTextMenu(isAdm);
  return det.sendMessage(chatId, textMenu);
});

//================ ADMIN PANEL COMMAND =================//
det.onText(/\/adminpanel/, async (msg) => {
  const id = String(msg.from.id);
  const chatId = msg.chat.id;
  
  if (!isAdmin(id)) {
    return det.sendMessage(chatId, 
`┌⪼❏ ACCESS DENIED
├ This command is for admins only
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  let users = getUsers();
  const collabs = getCollabs();
  
  const adminPanelMsg = 
`┌⪼❏ ADMIN PANEL
│
├ SYSTEM STATUS
├ INLINE: ${global.inline ? "ON" : "OFF"}
├ LOCK PAIR: ${global.lockPair ? "LOCKED" : "UNLOCKED"}
├ USERS: ${Object.keys(users).length}
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ VIP COUNT: ${global.vip.length}
├ COLLABS: ${collabs.length}
│
├ COMMANDS
├ /bc <message>
├ /bcimg <url> <caption>
├ /inline on/off
├ /lockpair on/off
├ /violist
├ /sessions
├ /checkusers
├ /addcollab <@username>
├ /rmcollab <@username>
├ /listcollab
├ /testjoin
│
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;

  const adminOpts = buildAdminPanelKeyboard();
  
  det.sendMessage(chatId, adminPanelMsg, adminOpts);
});

//================ JOIN STATUS =================//
det.onText(/\/joinstatus/, async (msg) => {
  const id = String(msg.from.id);
  const joined = await checkChannel(id);
  
  if (joined) {
    return det.sendMessage(msg.chat.id,
`┌⪼❏ JOIN STATUS
├ STATUS: ALL JOINED
└ ❏ You have access to the bot`);
  }
  
  const notJoined = await getNotJoinedChannels(id);
  const channelList = notJoined.map(c => `├ ${c}`).join("\n");
  
  return det.sendMessage(msg.chat.id,
`┌⪼❏ JOIN STATUS
├ STATUS: NOT ALL JOINED
│
├ MISSING CHANNELS:
${channelList}
│
└ ❏ Please join all channels`);
});

//================ TEST FORCE JOIN (ADMIN) =================//
det.onText(/\/testjoin/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;

  try {
    const botInfo = await det.getMe();
    let report = `┌⪼❏ FORCE JOIN TEST\n│\n`;
    
    const allChannels = [...(global.requiredChannels || []), ...getCollabs()];
    
    for (let ch of allChannels) {
      try {
        const botMember = await det.getChatMember(ch, botInfo.id);
        report += `├ OK ${ch} - Bot: ${botMember.status}\n`;
      } catch (e) {
        report += `├ FAIL ${ch} - Bot not in channel\n`;
      }
    }
    
    report += `│\n└ ❏ Test complete`;
    det.sendMessage(msg.chat.id, report);
  } catch (e) {
    det.sendMessage(msg.chat.id, `┌⪼❏ ERROR\n└ ${e.message}`);
  }
});

//================ ACTIVE SESSION =================//
det.onText(/\/activesession/, async (msg) => {
  const id = String(msg.from.id);
  
  const joined = await checkChannel(id);
  if (!joined) {
    const notJoined = await getNotJoinedChannels(id);
    const channelList = notJoined.map(c => `├ ${c}`).join("\n");
    
    return det.sendMessage(msg.chat.id,
`┌⪼❏ ACCESS DENIED
├ You must join all required channels
├ to use this bot
│
├ REQUIRED CHANNELS:
${channelList}
│
└ ❏ Please join and try again`);
  }
  
  return det.sendMessage(msg.chat.id,
`┌⪼❏ SESSION STATUS
└ ${getSessionStatus(id)}`);
});

//================ SESSIONS (ADMIN) =================//
det.onText(/\/sessions/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  const sessions = Object.entries(global.sessionState)
    .map(([uid, status]) => `├ ${uid}: ${status}`)
    .join("\n");

  det.sendMessage(msg.chat.id,
`┌⪼❏ ALL SESSIONS
${sessions || "├ NONE"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ CHECK USERS (ADMIN) =================//
det.onText(/\/checkusers/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();
  const list = Object.keys(users).map(u => `├ ${u}`).join("\n");

  det.sendMessage(msg.chat.id,
`┌⪼❏ REGISTERED USERS
${list || "├ NONE"}
└ TOTAL: ${Object.keys(users).length}`);
});

//================ ADD COLLAB (ADMIN) =================//
det.onText(/\/addcollab (.+)/, (msg, match) => {
  if (!isAdmin(msg.from.id)) {
    return det.sendMessage(msg.chat.id, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
  }

  const channel = match[1].trim();
  const collabs = getCollabs();

  if (collabs.includes(channel)) {
    return det.sendMessage(msg.chat.id,
`┌⪼❏ COLLAB EXISTS
├ ${channel} is already in required list
└ ❏ Use /listcollab to view all`);
  }

  collabs.push(channel);
  saveCollabs(collabs);

  det.sendMessage(msg.chat.id,
`┌⪼❏ COLLAB ADDED
├ CHANNEL: ${channel}
├ TOTAL COLLABS: ${collabs.length}
└ ❏ Users must join this channel`);
});

//================ REMOVE COLLAB (ADMIN) =================//
det.onText(/\/rmcollab (.+)/, (msg, match) => {
  if (!isAdmin(msg.from.id)) {
    return det.sendMessage(msg.chat.id, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
  }

  const channel = match[1].trim();
  let collabs = getCollabs();

  if (!collabs.includes(channel)) {
    return det.sendMessage(msg.chat.id,
`┌⪼❏ COLLAB NOT FOUND
├ ${channel} is not in required list
└ ❏ Use /listcollab to view all`);
  }

  collabs = collabs.filter(c => c !== channel);
  saveCollabs(collabs);

  det.sendMessage(msg.chat.id,
`┌⪼❏ COLLAB REMOVED
├ CHANNEL: ${channel}
├ TOTAL COLLABS: ${collabs.length}
└ ❏ Channel removed from requirements`);
});

//================ LIST COLLAB =================//
det.onText(/\/listcollab/, (msg) => {
  const collabs = getCollabs();
  const baseChannels = global.requiredChannels || [];
  
  const allChannels = [...baseChannels, ...collabs];
  
  const baseList = baseChannels.length > 0 
    ? baseChannels.map(c => `├ [BASE] ${c}`).join("\n")
    : "├ NONE";
    
  const collabList = collabs.length > 0
    ? collabs.map(c => `├ [COLLAB] ${c}`).join("\n")
    : "├ NONE";

  det.sendMessage(msg.chat.id,
`┌⪼❏ REQUIRED CHANNELS
│
├ BASE CHANNELS (settings):
${baseList}
│
├ COLLAB CHANNELS:
${collabList}
│
├ TOTAL: ${allChannels.length}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ INLINE CALLBACK HANDLER =================//
det.on("callback_query", async (cb) => {
  const id = String(cb.from.id);
  const isAdm = isAdmin(id);
  const chatId = cb.message.chat.id;

  det.answerCallbackQuery(cb.id);

  if (cb.data === "session") {
    const joined = await checkChannel(id);
    if (!joined) {
      return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
└ ❏ Join all required channels first`);
    }
    
    return det.sendMessage(chatId,
`┌⪼❏ YOUR SESSION
├ ID: ${id}
├ STATUS: ${getSessionStatus(id)}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "users") {
    if (!isAdm) {
      return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    }
    let users = getUsers();
    return det.sendMessage(chatId,
`┌⪼❏ TOTAL USERS
├ COUNT: ${Object.keys(users).length}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "stats") {
    const baseStats =
`┌⪼❏ NULL STATS
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ INLINE: ${global.inline}
├ LOCK PAIR: ${global.lockPair}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;

    if (isAdm) {
      let users = getUsers();
      const collabs = getCollabs();
      return det.sendMessage(chatId,
`┌⪼❏ ADMIN STATS
├ USERS: ${Object.keys(users).length}
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ INLINE: ${global.inline}
├ LOCK PAIR: ${global.lockPair}
├ VIP COUNT: ${global.vip.length}
├ COLLABS: ${collabs.length}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }

    return det.sendMessage(chatId, baseStats);
  }

  if (cb.data === "pair") {
    const joined = await checkChannel(id);
    if (!joined) {
      return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
└ ❏ Join all required channels first`);
    }
    
    return det.sendMessage(chatId,
`┌⪼❏ PAIR COMMAND
├ USE: /pair <number>
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  // ADMIN PANEL CALLBACK
  if (cb.data === "admin_panel") {
    if (!isAdm) {
      return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    }
    
    let users = getUsers();
    const collabs = getCollabs();
    
    const adminPanelMsg = 
`┌⪼❏ ADMIN PANEL
│
├ SYSTEM STATUS
├ INLINE: ${global.inline ? "ON" : "OFF"}
├ LOCK PAIR: ${global.lockPair ? "LOCKED" : "UNLOCKED"}
├ USERS: ${Object.keys(users).length}
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ VIP COUNT: ${global.vip.length}
├ COLLABS: ${collabs.length}
│
├ COMMANDS
├ /bc <message>
├ /bcimg <url> <caption>
├ /inline on/off
├ /lockpair on/off
├ /violist
├ /sessions
├ /checkusers
├ /addcollab <@username>
├ /rmcollab <@username>
├ /listcollab
├ /testjoin
│
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;

    return det.sendMessage(chatId, adminPanelMsg, buildAdminPanelKeyboard());
  }

  // ADMIN PANEL ACTION CALLBACKS
  if (cb.data === "admin_inline") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    
    global.inline = !global.inline;
    return det.sendMessage(chatId,
`┌⪼❏ INLINE TOGGLE
├ STATUS: ${global.inline ? "ON" : "OFF"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_lockpair") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    
    global.lockPair = !global.lockPair;
    return det.sendMessage(chatId,
`┌⪼❏ PAIR LOCK TOGGLE
├ STATUS: ${global.lockPair ? "LOCKED" : "UNLOCKED"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_bc") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    return det.sendMessage(chatId,
`┌⪼❏ BROADCAST
├ USAGE: /bc <message>
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_bcimg") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    return det.sendMessage(chatId,
`┌⪼❏ IMAGE BROADCAST
├ USAGE: /bcimg <url> <caption>
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_violist") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    
    const list = global.vip.length
      ? global.vip.map(v => `├ ${v}`).join("\n")
      : "├ EMPTY";

    return det.sendMessage(chatId,
`┌⪼❏ VIP USERS
${list}
└ TOTAL: ${global.vip.length}`);
  }

  if (cb.data === "admin_sessions") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    
    const sessions = Object.entries(global.sessionState)
      .map(([uid, status]) => `├ ${uid}: ${status}`)
      .join("\n");

    return det.sendMessage(chatId,
`┌⪼❏ ALL SESSIONS
${sessions || "├ NONE"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_checkusers") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    
    let users = getUsers();
    const list = Object.keys(users).map(u => `├ ${u}`).join("\n");

    return det.sendMessage(chatId,
`┌⪼❏ REGISTERED USERS
${list || "├ NONE"}
└ TOTAL: ${Object.keys(users).length}`);
  }

  if (cb.data === "admin_listcollab") {
    const collabs = getCollabs();
    const baseChannels = global.requiredChannels || [];
    
    const allChannels = [...baseChannels, ...collabs];
    
    const baseList = baseChannels.length > 0 
      ? baseChannels.map(c => `├ [BASE] ${c}`).join("\n")
      : "├ NONE";
      
    const collabList = collabs.length > 0
      ? collabs.map(c => `├ [COLLAB] ${c}`).join("\n")
      : "├ NONE";

    return det.sendMessage(chatId,
`┌⪼❏ REQUIRED CHANNELS
│
├ BASE CHANNELS (settings):
${baseList}
│
├ COLLAB CHANNELS:
${collabList}
│
├ TOTAL: ${allChannels.length}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_addcollab") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    return det.sendMessage(chatId,
`┌⪼❏ ADD COLLAB
├ USAGE: /addcollab @username
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_rmcollab") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    return det.sendMessage(chatId,
`┌⪼❏ REMOVE COLLAB
├ USAGE: /rmcollab @username
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_testjoin") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    return det.sendMessage(chatId,
`┌⪼❏ TEST JOIN
├ USAGE: /testjoin
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "admin_stats") {
    if (!isAdm) return det.sendMessage(chatId, "┌⪼❏ ACCESS DENIED\n└ ADMIN ONLY");
    
    let users = getUsers();
    const collabs = getCollabs();
    return det.sendMessage(chatId,
`┌⪼❏ ADMIN STATS
├ USERS: ${Object.keys(users).length}
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ INLINE: ${global.inline}
├ LOCK PAIR: ${global.lockPair}
├ VIP COUNT: ${global.vip.length}
├ COLLABS: ${collabs.length}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  if (cb.data === "back_to_menu") {
    const isAdm = isAdmin(id);
    const opts = buildInlineMenu(isAdm, chatId);
    
    if (global.img && global.img.menu) {
      return det.sendPhoto(chatId, global.img.menu, {
        caption: `┌⪼❏ MAIN MENU
├ ${global.nameBot}
├ dev: ${global.dev}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
        ...opts
      });
    } else {
      return det.sendMessage(chatId, "┌⪼❏ MAIN MENU", opts);
    }
  }
});

//================ INLINE TOGGLE (ADMIN) =================//
det.onText(/\/inline (on|off)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  global.inline = m[1] === "on";

  det.sendMessage(msg.chat.id,
`┌⪼❏ INLINE TOGGLE
├ STATUS: ${global.inline ? "ON" : "OFF"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ LOCK PAIR (ADMIN) =================//
det.onText(/\/lockpair (on|off)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  global.lockPair = m[1] === "on";

  det.sendMessage(msg.chat.id,
`┌⪼❏ PAIR LOCK TOGGLE
├ STATUS: ${global.lockPair ? "LOCKED" : "UNLOCKED"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ VIP LIST (ADMIN) =================//
det.onText(/\/violist/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  const list = global.vip.length
    ? global.vip.map(v => `├ ${v}`).join("\n")
    : "├ EMPTY";

  det.sendMessage(msg.chat.id,
`┌⪼❏ VIP USERS
${list}
└ TOTAL: ${global.vip.length}`);
});

//================ STATS =================//
det.onText(/\/stats/, async (msg) => {
  let users = getUsers();
  const id = String(msg.from.id);
  const isAdm = isAdmin(id);

  let statsMsg =
`┌⪼❏ NULL STATS
├ USERS: ${Object.keys(users).length}
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ INLINE: ${global.inline}
├ LOCK: ${global.lockPair}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;

  if (isAdm) {
    const collabs = getCollabs();
    statsMsg =
`┌⪼❏ ADMIN STATS
├ USERS: ${Object.keys(users).length}
├ SESSIONS: ${Object.keys(global.sessionState).length}
├ INLINE: ${global.inline}
├ LOCK: ${global.lockPair}
├ VIP COUNT: ${global.vip.length}
├ COLLABS: ${collabs.length}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
  }

  det.sendMessage(msg.chat.id, statsMsg);
});

//================ BROADCAST (ADMIN) =================//
det.onText(/\/bc (.+)/, async (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();
  let list = Object.keys(users);

  let sent = 0;
  let failed = 0;

  for (let uid of list) {
    try {
      await det.sendMessage(uid,
`┌⪼❏ ANNOUNCEMENT
└ ${m[1]}`);
      sent++;
    } catch {
      failed++;
    }
  }

  det.sendMessage(msg.chat.id,
`┌⪼❏ BC DONE
├ SENT: ${sent}
├ FAILED: ${failed}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ IMAGE BROADCAST (ADMIN) =================//
det.onText(/\/bcimg (.+?) (.+)/, async (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();
  let list = Object.keys(users);

  let sent = 0;
  let failed = 0;

  for (let uid of list) {
    try {
      await det.sendPhoto(uid, m[1], {
        caption: `┌⪼❏ ANNOUNCEMENT\n└ ${m[2]}`
      });
      sent++;
    } catch {
      failed++;
    }
  }

  det.sendMessage(msg.chat.id,
`┌⪼❏ IMAGE BC DONE
├ SENT: ${sent}
├ FAILED: ${failed}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ PAIR COMMAND (WITH WHATSAPP CONNECTED NOTIFICATION AND BOT ACTIVATION) =================//
det.onText(/\/pair (.+)/, async (msg, match) => {
  const id = String(msg.from.id);
  const chatId = msg.chat.id;

  // DUPLICATE PAIRING CHECK
  if (global.sessionState[id] === "PAIRING") {
    return det.sendMessage(chatId,
`┌⪼❏ PAIR IN PROGRESS
├ Please wait for your current
├ pairing code to be generated
└ ❏ Do not spam this command`);
  }

  // ACTIVE SESSION CHECK
  if (global.sessionState[id] === "ACTIVE") {
    return det.sendMessage(chatId,
`┌⪼❏ SESSION ACTIVE
├ You already have an active
├ WhatsApp session linked
├ Use /activesession to check
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  // CHANNEL SUBSCRIPTION CHECK
  const joined = await checkChannel(id);
  if (!joined) {
    const notJoined = await getNotJoinedChannels(id);
    const channelList = notJoined.map(c => `├ ${c}`).join("\n");
    
    return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
├ You must join all required channels
├ to use pair feature
│
├ REQUIRED CHANNELS:
${channelList}
│
└ ❏ Please join and try again`);
  }

  // LOCK PAIR CHECK
  if (global.lockPair && !isAdmin(id)) {
    return det.sendMessage(chatId,
`┌⪼❏ PAIR LOCKED
├ STATUS: Only admins can pair
├ Contact ${global.dev} to buy/get access
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  const number = match[1].replace(/\D/g, "");

  // SET PAIRING LOCK IMMEDIATELY
  global.sessionState[id] = "PAIRING";

  let users = getUsers();
  users[id] = users[id] || { banned: false, vip: false, redeemed: [] };
  saveUsers(users);

  if (!canUse(id)) {
    global.sessionState[id] = "OFFLINE";
    return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
├ REASON: Banned or no access
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  const userPath = `${sessionDir}/${id}`;
  if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });

  // CLOSE EXISTING SOCKET IF ANY
  if (global.activeSockets && global.activeSockets[id]) {
    try {
      global.activeSockets[id].end();
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch(e) {
      console.log("Error closing existing socket:", e);
    }
    delete global.activeSockets[id];
  }

  async function startSocket() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(userPath);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({ 
        version, 
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.0"],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
      });

      // STORE SOCKET REFERENCE
      if (!global.activeSockets) global.activeSockets = {};
      global.activeSockets[id] = sock;

      // Handle credential updates
      sock.ev.on("creds.update", saveCreds);
      
      // Handle incoming WhatsApp messages - THIS ACTIVATES null.js BOT
      sock.ev.on("messages.upsert", async (chatUpdate) => {
        try {
          const mek = chatUpdate.messages[0];
          if (!mek.message) return;
          
          // Call null.js handler for WhatsApp commands
          await nullHandler(sock, mek, chatUpdate, null);
        } catch (err) {
          console.log("Message handler error:", err);
        }
      });

      // Handle connection updates
      sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        console.log("Connection update:", { connection, statusCode });

        if (connection === "open") {
          // WHATSAPP CONNECTED - BOT IS NOW ACTIVE
          global.sessionState[id] = "ACTIVE";
          
          det.sendMessage(chatId,
`┌⪼❏ WHATSAPP CONNECTED
├ STATUS: ONLINE
├ Your WhatsApp session is now active
├ Bot commands will now work via WhatsApp
├ Type menu in WhatsApp to see commands
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
          
          console.log(`WHATSAPP CONNECTED for user ${id} - null.js bot is now active`);
        }

        if (connection === "close") {
          console.log("Connection closed:", { statusCode });
          delete global.activeSockets[id];

          // Handle different close reasons
          if (statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === 403) {
            global.sessionState[id] = "OFFLINE";
            det.sendMessage(chatId,
`┌⪼❏ SESSION LOGGED OUT
├ Your WhatsApp session has been logged out
├ Please use /pair to create a new session
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
            
            try {
              fs.rmSync(userPath, { recursive: true, force: true });
            } catch(e) {
              console.log("Error cleaning session files:", e);
            }
            return;
          }
          
          if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
            if (global.sessionState[id] === "ACTIVE" || 
                global.sessionState[id] === "PAIRING" ||
                global.sessionState[id] === "CONNECTING") {
              
              console.log(`Reconnecting for user ${id} in 5 seconds...`);
              global.sessionState[id] = "RECONNECTING";
              
              det.sendMessage(chatId,
`┌⪼❏ RECONNECTING
├ WhatsApp connection lost
├ Attempting to reconnect...
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
              
              setTimeout(() => {
                if (global.sessionState[id] === "RECONNECTING") {
                  startSocket();
                }
              }, 5000);
            } else {
              global.sessionState[id] = "OFFLINE";
            }
          } else {
            if (global.sessionState[id] === "ACTIVE") {
              console.log(`Unexpected close for user ${id}, reconnecting...`);
              setTimeout(startSocket, 5000);
            } else {
              global.sessionState[id] = "OFFLINE";
            }
          }
        }
      });

      // Check if not registered and needs pairing
      if (!sock.authState.creds.registered) {
        console.log("Not registered, requesting pairing code...");
        
        setTimeout(async () => {
          try {
            const code = await sock.requestPairingCode(number);
            
            global.sessionState[id] = "AWAITING_PAIR";
            
            console.log(`Pairing code generated: ${code}`);
            
            det.sendMessage(chatId,
`┌⪼❏ PAIRING CODE
├ NUMBER: +${number}
├ CODE: ${code}
│
├ To connect:
├ 1. Open WhatsApp on your phone
├ 2. Go to Settings > Linked Devices
├ 3. Tap "Link a Device"
├ 4. Enter this code
│
├ Code expires in 60 seconds!
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
          } catch (err) {
            console.error("Pairing code error:", err);
            global.sessionState[id] = "OFFLINE";
            delete global.activeSockets[id];
            
            det.sendMessage(chatId,
`┌⪼❏ PAIRING FAILED
├ Error: ${err.message || 'Unknown error'}
├ Please try again with /pair ${number}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
          }
        }, 3000);
      } else {
        global.sessionState[id] = "CONNECTING";
        console.log("Already registered, connecting...");
      }
    } catch (err) {
      console.error("Socket creation error:", err);
      global.sessionState[id] = "OFFLINE";
      delete global.activeSockets[id];
      
      det.sendMessage(chatId,
`┌⪼❏ CONNECTION ERROR
├ Failed to create WhatsApp session
├ Error: ${err.message || 'Unknown error'}
├ Please try again later
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
  }

  det.sendMessage(chatId,
`┌⪼❏ GENERATING CODE
├ NUMBER: +${number}
├ Please wait...
│
├ Make sure WhatsApp is installed
├ and you have internet connection
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  
  startSocket();
});

//================ PAIR HELP (NO NUMBER) =================//
det.onText(/\/pair$/, (msg) => {
  det.sendMessage(msg.chat.id,
`┌⪼❏ PAIR HELP
├ USAGE: /pair <number>
├ EXAMPLE: /pair 2347030626048
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ ERROR HANDLER =================//
process.on("uncaughtException", console.log);