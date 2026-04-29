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
const waMessageHandler = require("./null.js");

//================ BOT =================//
const det = new TelegramBot(global.telegramToken, {
  polling: true
});

//================ GLOBAL UPGRADES =================//
global.inline = global.inline ?? true;
global.lockPair = global.lockPair ?? false;
global.sessionState = global.sessionState || {};
global.startTime = global.startTime || Date.now();
global.vip = global.vip || [];

//================ STORAGE =================//
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

//================ HELPERS =================//
const getUsers = () => JSON.parse(fs.readFileSync(userDB));
const saveUsers = (d) => fs.writeFileSync(userDB, JSON.stringify(d, null, 2));

const getCoupons = () => JSON.parse(fs.readFileSync(couponDB));
const saveCoupons = (d) => fs.writeFileSync(couponDB, JSON.stringify(d, null, 2));

const getCollabs = () => JSON.parse(fs.readFileSync(collabDB));
const saveCollabs = (d) => fs.writeFileSync(collabDB, JSON.stringify(d, null, 2));

const isAdmin = (id) =>
  (global.adminTelegramIds || []).includes(String(id));

const isVip = (id) =>
  global.vip.includes(String(id));

//================ SESSION STATUS =================//
function getSessionStatus(id) {
  const dir = `${sessionDir}/${id}`;
  if (!fs.existsSync(dir)) return "NOT LINKED";
  return global.sessionState[id] || "OFFLINE";
}

//================ CHANNEL CHECK =================//
async function checkChannel(userId) {
  try {
    const collabs = getCollabs();
    const requiredChannels = [...(global.requiredChannels || []), ...collabs];
    
    for (let ch of requiredChannels) {
      try {
        const res = await det.getChatMember(ch, userId);
        if (!res || ["left", "kicked"].includes(res.status)) return false;
      } catch (e) {
        continue;
      }
    }
    return true;
  } catch {
    return false;
  }
}

//================ GET NOT JOINED CHANNELS =================//
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

//================ USER ACCESS =================//
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

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

function buildTextMenu(isAdm) {
  let text = `┌⪼❏ USER MENU
├ /pair <number>
├ /activesession
├ /stats
├ /joinstatus
└ ❏ NULL SYSTEM`;

  if (isAdm) {
    text += `\n\n┌⪼❏ ADMIN PANEL
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
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
  }

  return text;
}

//================ START =================//
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
└ use /det
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

//================ INLINE CALLBACK =================//
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
});

//================ INLINE TOGGLE =================//
det.onText(/\/inline (on|off)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  global.inline = m[1] === "on";

  det.sendMessage(msg.chat.id,
`┌⪼❏ INLINE TOGGLE
├ STATUS: ${global.inline ? "ON" : "OFF"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ LOCK PAIR =================//
det.onText(/\/lockpair (on|off)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  global.lockPair = m[1] === "on";

  det.sendMessage(msg.chat.id,
`┌⪼❏ PAIR LOCK TOGGLE
├ STATUS: ${global.lockPair ? "LOCKED" : "UNLOCKED"}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ VIP LIST =================//
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

//================ BROADCAST =================//
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

//================ IMAGE BC =================//
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

//================ PAIR =================//
det.onText(/\/pair (.+)/, async (msg, match) => {
  const id = String(msg.from.id);
  const chatId = msg.chat.id;

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

  if (global.lockPair && !isAdmin(id)) {
    return det.sendMessage(chatId,
`┌⪼❏ PAIR LOCKED
├ STATUS: Only admins can pair right now 
├ Contact ${global.dev} to buy/get access
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  }

  const number = match[1].replace(/\D/g, "");

  let users = getUsers();
  users[id] = users[id] || { banned: false, vip: false, redeemed: [] };
  saveUsers(users);

  if (!canUse(id)) return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
├ REASON: Banned or no access
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);

  const userPath = `${sessionDir}/${id}`;
  if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });

  async function startSocket() {
    const { state, saveCreds } = await useMultiFileAuthState(userPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({ version, auth: state });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (u) => {
      const { connection, lastDisconnect } = u;

      const code = lastDisconnect?.error?.output?.statusCode;
      const err = lastDisconnect?.error?.message || "";

      if (connection === "open") {
        global.sessionState[id] = "ACTIVE";
        det.sendMessage(chatId,
`┌⪼❏ CONNECTION
├ STATUS: ACTIVE
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
      }

      if (connection === "close") {
        global.sessionState[id] = "OFFLINE";

        if (
          err.includes("PreKeyError") ||
          err.includes("Timed Out") ||
          code === 515 ||
          code === 408
        ) {
          global.sessionState[id] = "REPAIRING";
          setTimeout(startSocket, 3000);
          return;
        }

        setTimeout(startSocket, 4000);
      }
    });

    // WHATSAPP MESSAGE HANDLER HERE
    sock.ev.on("messages.upsert", async (m) => {
      const msg = m.messages[0];
      if (!msg.message) return;
      
      try {
        await waMessageHandler(sock, msg, null, null);
      } catch (err) {
        console.log("WhatsApp handler error:", err);
      }
    });

    if (!sock.authState.creds.registered) {
      setTimeout(async () => {
        const code = await sock.requestPairingCode(number);
        det.sendMessage(chatId,
`┌⪼❏ PAIR CODE
├ NUMBER: ${number}
├ CODE: ${code}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
      }, 2000);
    }
  }

  det.sendMessage(chatId,
`┌⪼❏ GENERATING
├ NUMBER: ${number}
├ PLEASE WAIT...
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
  startSocket();
});

//================ DEFAULT PAIR (NO NUMBER) =================//
det.onText(/\/pair$/, (msg) => {
  det.sendMessage(msg.chat.id,
`┌⪼❏ PAIR HELP
├ USAGE: /pair <number>
├ EXAMPLE: /pair 2347030626048
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
});

//================ ERROR =================//
process.on("uncaughtException", console.log);