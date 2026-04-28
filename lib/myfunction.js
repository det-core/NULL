
const { extractMessageContent, getDevice, jidNormalizedUser, proto, delay, getContentType, areJidsSameUser, generateWAMessage } = require("@whiskeysockets/baileys")
const chalk = require('chalk')
const fs = require('fs-extra')
const util = require('util')
//=====================//
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)
exports.unixTimestampSeconds = unixTimestampSeconds
exports.generateMessageTag = (epoch) => {
let tag = (0, exports.unixTimestampSeconds)().toString();
if (epoch)
tag += '.--' + epoch; // attach epoch if provided
return tag;
}
//=====================//
exports.runtime = function(seconds) {
seconds = Number(seconds);
const d = Math.floor(seconds / (3600 * 24));
const h = Math.floor((seconds % (3600 * 24)) / 3600);
const m = Math.floor((seconds % 3600) / 60); 
return `${d > 0 ? `${d} *hours* ` : ""}${h > 0 ? `${h} *day* ` : ""}${m > 0 ? `${m} *minutes*` : ""}`.trim();
}
//=====================//
exports.jsonformat = (string) => {
return JSON.stringify(string, null, 2)
}
//=====================//
exports.sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
}
exports.isUrl = (url) => {
return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}
exports.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
//=====================//
exports.getGroupAdmins = (participants) => {
let admins = []
for (let i of participants) {
i.admin === "superadmin" ? admins.push(i.id) :i.admin === "admin" ? admins.push(i.id) : ''
}
return admins || []
}
//=====================//
exports.smsg = (conn, n, store) => {
if (!n) return n
let N = proto.WebMessageInfo
if (n.key) {
n.id = n.key.id
n.from = n.key.remoteJid.startsWith('status') ? jidNormalizedUser(n.key?.participant || n.participant) : jidNormalizedUser(n.key.remoteJid);
n.isBaileys = n.id.startsWith('BAE5') && n.id.length === 16
n.chat = n.key.remoteJid
n.fromMe = n.key.fromMe
n.isGroup = n.chat.endsWith('@g.us')
n.sender = conn.decodeJid(n.fromMe && conn.user.id || n.participant || n.key.participant || n.chat || '')
if (n.isGroup) n.participant = conn.decodeJid(n.key.participant) || ''
}
//=====================//
if (n.message) {
n.mtype = getContentType(n.message);
n.msg = (n.mtype === 'viewOnceMessage' ? 
n.message[n.mtype]?.message?.[getContentType(n.message[n.mtype]?.message)] : 
n.message[n.mtype]
) || {};
n.body = n.message.conversation || 
 n.msg.caption || 
 n.msg.text || 
 (n.mtype === 'listResponseMessage' && n.msg.singleSelectReply?.selectedRowId) || 
 (n.mtype === 'buttonsResponseMessage' && n.msg.selectedButtonId) || 
 (n.mtype === 'viewOnceMessage' && n.msg.caption) || 
 n.text || '';
let quoted = n.quoted = n.msg?.contextInfo?.quotedMessage || null;
n.mentionedJid = n.msg?.contextInfo?.mentionedJid || [];
if (n.quoted) {
let type = getContentType(quoted);
n.quoted = quoted?.[type] || {};
if (type === 'productMessage') {
type = getContentType(n.quoted);
n.quoted = n.quoted?.[type] || {};
}
if (typeof n.quoted === 'string') {
n.quoted = { text: n.quoted };
}
n.quoted.key = {
remoteJid: n.msg?.contextInfo?.remoteJid || n.chat || "",
participant: jidNormalizedUser(n.msg?.contextInfo?.participant || n.sender || ""),
fromMe: areJidsSameUser(
jidNormalizedUser(n.msg?.contextInfo?.participant || n.sender || ""), 
jidNormalizedUser(conn?.user?.id || "")
),
id: n.msg?.contextInfo?.stanzaId || ""
};
n.quoted.mtype = type;
n.quoted.from = /g\.us|status/.test(n.msg?.contextInfo?.remoteJid || "") 
? n.quoted.key.participant 
: n.quoted.key.remoteJid;
n.quoted.id = n.msg?.contextInfo?.stanzaId || "";
n.quoted.chat = n.msg?.contextInfo?.remoteJid || n.chat || "";
n.quoted.isBaileys = n.quoted.id 
? n.quoted.id.startsWith('BAE5') && n.quoted.id.length === 16 
: false;
n.quoted.sender = conn.decodeJid(n.msg?.contextInfo?.participant || "");
n.quoted.fromMe = n.quoted.sender === (conn.user?.id);
n.quoted.text = n.quoted.text || 
n.quoted.caption || 
n.quoted.conversation || 
n.quoted.contentText || 
n.quoted.selectedDisplayText || 
n.quoted.title || '';
n.quoted.mentionedJid = n.msg?.contextInfo?.mentionedJid || [];
n.getQuotedObj = n.getQuotedMessage = async () => {
if (!n.quoted.id) return false;
let q = await store.loadMessage(n.chat, n.quoted.id, conn);
return exports.smsg(conn, q, store);
};
let vM = n.quoted.fakeObj = n.fromObject({
key: { remoteJid: n.quoted.chat, fromMe: n.quoted.fromMe, id: n.quoted.id },
message: quoted,
...(n.isGroup ? { participant: n.quoted.sender } : {})
});
n.quoted.delete = () => conn.sendMessage(n.quoted.chat, { delete: vM.key });
n.quoted.copyNForward = (jid, forceForward = false, options = {}) => 
conn.copyNForward(jid, vM, forceForward, options);
n.quoted.download = () => conn.downloadMediaMessage(n.quoted);
}
}
//=====================//
if (n.msg.url) n.download = () => conn.downloadMediaMessage(n.msg)
n.text = n.msg.text || n.msg.caption || n.message.conversation || n.msg.contentText || n.msg.selectedDisplayText || n.msg.title || ''
n.reply = (text, chatId = n.chat, options = {}) => Buffer.isBuffer(text) ? conn.sendMedia(chatId, text, 'file', '', n, { ...options }) : conn.sendText(chatId, text, n, { ...options })
n.copy = () => exports.smsg(conn, N.fromObject(N.toObject(n)))
n.copyNForward = (jid = n.chat, forceForward = false, options = {}) => conn.copyNForward(jid, n, forceForward, options)
return n
}