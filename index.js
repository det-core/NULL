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
const path = require("path");
const { exec } = require("child_process");

require("./settings.js");
const nullHandler = require("./null.js");

//
const det = new TelegramBot(global.telegramToken, {
  polling: true
});

//
const dbPath = "./system/database";
const sessionDir = "./Null_Sessions";

const userDB = `${dbPath}/users.json`;
const couponDB = `${dbPath}/coupons.json`;

if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

if (!fs.existsSync(userDB)) fs.writeFileSync(userDB, "{}");
if (!fs.existsSync(couponDB)) fs.writeFileSync(couponDB, "{}");

//
const getUsers = () => JSON.parse(fs.readFileSync(userDB));
const saveUsers = (d) => fs.writeFileSync(userDB, JSON.stringify(d, null, 2));

const getCoupons = () => JSON.parse(fs.readFileSync(couponDB));
const saveCoupons = (d) => fs.writeFileSync(couponDB, JSON.stringify(d, null, 2));

const isAdmin = (id) =>
  (global.adminTelegramIds || []).includes(String(id));

//
async function checkChannel(userId) {
  try {
    for (let ch of global.requiredChannels || []) {
      const res = await det.getChatMember(ch, userId);
      if (!res || ["left", "kicked"].includes(res.status)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

//
function canUse(id) {
  if (isAdmin(id)) return true;

  if (!global.freeTrialEnabled) return false;

  let users = getUsers();
  users[id] = users[id] || {
    banned: false,
    vip: false,
    redeemed: []
  };

  if (users[id].vip) return true;

  return true;
}

//
det.onText(/\/start/, async (msg) => {
  const id = String(msg.from.id);

  let users = getUsers();
  users[id] = users[id] || {
    banned: false,
    vip: false,
    redeemed: []
  };
  saveUsers(users);

  det.sendPhoto(msg.chat.id, global.img.menu, {
    caption:
`┌⪼❏ ${global.namebot}
├◆ version: ${global.versionBot}
├◆ Developer: ${global.dev}
└ ❏ Use /det`
  });
});

//
det.onText(/\/det/, (msg) => {
  const id = String(msg.from.id);

  let txt =
`┌⪼❏ USER MENU
├ /start
├ /det
├ /pair <number>
├ /delsess
├ /redeem <code>
└ ❏ Powered By NULL`;

  if (isAdmin(id)) {
    txt += `

┌⪼❏ ADMIN PANEL
├ /ban <id>
├ /unban <id>
├ /checkusers
├ /addvip <id>
├ /bc <text>
├ /createcoupon <code> <uses> vip|trial
├ /deletecoupon <code>
├ /freetrial on/off
└ ❏`;
  }

  det.sendMessage(msg.chat.id, txt);
});

//
det.onText(/\/delsess/, async (msg) => {
  const id = String(msg.from.id);
  const dir = `${sessionDir}/${id}`;

  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }

    det.sendMessage(msg.chat.id,
`┌⪼❏ SESSION REMOVED
└ ❏ Pair again with /pair`);
  } catch {
    det.sendMessage(msg.chat.id, "⪼❏ FAILED");
  }
});

//
det.onText(/\/pair (.+)/, async (msg, match) => {
  const id = String(msg.from.id);
  const chatId = msg.chat.id;
  const number = match[1].replace(/\D/g, "");

  let users = getUsers();

  users[id] = users[id] || {
    banned: false,
    vip: false,
    redeemed: []
  };

  saveUsers(users);

  if (users[id].banned && !isAdmin(id)) {
    return det.sendMessage(chatId, "⪼❏ BANNED");
  }

  if (!canUse(id)) {
    return det.sendMessage(chatId,
`┌⪼❏ ACCESS DENIED
├◆ Free trial disabled
└ ❏ Contact ${global.dev}`);
  }

  const joined = await checkChannel(id);
  if (!joined && !isAdmin(id)) {
    return det.sendMessage(chatId,
`┌⪼❏ JOIN REQUIRED
└ ❏ ${global.requiredChannels.join(", ")}`);
  }

  if (number.length < 10 || number.length > 15) {
    return det.sendMessage(chatId,
`┌⪼❏ INVALID NUMBER
└ ❏ Example: 2347030626048`);
  }

  const userPath = `${sessionDir}/${id}`;

  if (!fs.existsSync(userPath))
    fs.mkdirSync(userPath, { recursive: true });

  async function startSocket() {
    const { state, saveCreds } =
      await useMultiFileAuthState(userPath);

    const { version } =
      await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (u) => {
      const { connection, lastDisconnect } = u;

      if (connection === "open") {
        det.sendMessage(chatId,
`┌⪼❏ CONNECTED
└ ❏ WhatsApp Linked`);

        try {
          sock.groupAcceptInvite(global.det.newsletterJid);
        } catch {}

        sock.ev.on("messages.upsert", async (chatUpdate) => {
          const m = chatUpdate.messages[0];
          if (!m || !m.message) return;
          await nullHandler(sock, m, chatUpdate, null);
        });
      }

      if (connection === "close") {
        const code =
          lastDisconnect?.error?.output?.statusCode;

        if (
          code === 515 ||
          code === 408 ||
          code === 428 ||
          code === DisconnectReason.restartRequired
        ) {
          det.sendMessage(chatId,
`⪼❏ RECONNECTING...`);

          setTimeout(startSocket, 3000);
        }
      }
    });

    if (!sock.authState.creds.registered) {
      setTimeout(async () => {
        try {
          const code =
            await sock.requestPairingCode(number);

          det.sendMessage(chatId,
`┌⪼❏ NULL Pair CODE
└ ❏ ${code}`);
        } catch {
          det.sendMessage(chatId,
`⪼❏ FAILED TO GENERATE`);
        }
      }, 2500);
    }
  }

  det.sendMessage(chatId,
`⪼❏ GENERATING CODE...`);

  startSocket();
});

//
det.onText(/\/ban (\d+)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();

  users[m[1]] = users[m[1]] || {};
  users[m[1]].banned = true;

  saveUsers(users);

  det.sendMessage(msg.chat.id, "⪼❏ BANNED");
});

//
det.onText(/\/unban (\d+)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();

  users[m[1]] = users[m[1]] || {};
  users[m[1]].banned = false;

  saveUsers(users);

  det.sendMessage(msg.chat.id, "⪼❏ UNBANNED");
});

//
det.onText(/\/checkusers/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();

  det.sendMessage(msg.chat.id,
`┌⪼❏ USERS
└ ❏ ${Object.keys(users).length}`);
});

//
det.onText(/\/addvip (\d+)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();

  users[m[1]] = users[m[1]] || {};
  users[m[1]].vip = true;

  saveUsers(users);

  det.sendMessage(msg.chat.id, "⪼❏ VIP ADDED");
});

//
det.onText(/\/freetrial (on|off)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  global.freeTrialEnabled =
    m[1].toLowerCase() === "on";

  det.sendMessage(msg.chat.id,
`┌⪼❏ FREE TRIAL
└ ❏ ${m[1].toUpperCase()}`);
});

//
det.onText(/\/createcoupon (\w+) (\d+) (vip|trial)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let coupons = getCoupons();

  coupons[m[1]] = {
    uses: parseInt(m[2]),
    type: m[3]
  };

  saveCoupons(coupons);

  det.sendMessage(msg.chat.id,
`⪼❏ COUPON CREATED`);
});

// ┌ ❏ DELETE COUPON
det.onText(/\/deletecoupon (\w+)/, (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let coupons = getCoupons();

  delete coupons[m[1]];

  saveCoupons(coupons);

  det.sendMessage(msg.chat.id,
`⪼❏ DELETED`);
});

//
det.onText(/\/redeem (\w+)/, (msg, m) => {
  const id = String(msg.from.id);
  const code = m[1];

  let users = getUsers();
  let coupons = getCoupons();

  if (!coupons[code]) {
    return det.sendMessage(msg.chat.id,
`⪼❏ INVALID`);
  }

  users[id] = users[id] || {
    banned: false,
    vip: false,
    redeemed: []
  };

  if (users[id].redeemed.includes(code)) {
    return det.sendMessage(msg.chat.id,
`⪼❏ USED`);
  }

  users[id].redeemed.push(code);

  if (coupons[code].type === "vip") {
    users[id].vip = true;
  }

  coupons[code].uses--;

  if (coupons[code].uses <= 0) {
    delete coupons[code];
  }

  saveUsers(users);
  saveCoupons(coupons);

  det.sendMessage(msg.chat.id,
`⪼❏ SUCCESS`);
});

//
det.onText(/\/bc (.+)/, async (msg, m) => {
  if (!isAdmin(msg.from.id)) return;

  let users = getUsers();

  for (let uid of Object.keys(users)) {
    det.sendMessage(uid, `📢 ${m[1]}`).catch(() => {});
  }

  det.sendMessage(msg.chat.id,
`⪼❏ SENT`);
});

//
process.on("uncaughtException", console.log);