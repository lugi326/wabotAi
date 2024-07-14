const { makeWASocket, useMultiFileAuthState, } = require('@whiskeysockets/baileys')
const pino = require('pino');
const { text } = require('stream/consumers');

async function connectWhatsapp() {
    const auth = await useMultiFileAuthState("session");
    const socket = makeWASocket({
      printQRInTerminal: true,
      browser: ["DAPABOT", "", ""],
      auth: auth.state,
      logger: pino({ level: "silent" }),
    });
  
    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", async ({ connection, qr }) => {
      if(connection === 'open') {
        console.log("WatsApp Active.."); //memberitahu jika sudah connect
      } else if (connection === 'close') {
        console.log("WatsApp Closed..")
        connectWhatsapp(); //gunanya buat connect ulang
      }else if (connection === 'connecting' )
        console.log('WatsApp Conecting')
      if(qr)
        console.log(qr)
    });

    socket.ev.on("messages.upsert", ({messages})=>{
        const pesan = messages[0].message.conversation
        const phone =  messages[0].key.remoteJid
        console.log(messages[0])
        if(!messages[0].key.fromMe){
        query({"question": pesan}).then(async (response) => {
            console.log(response);
            const {text} = response
            await socket.sendMessage(phone, { text: text })
        });
    }
    return

    })   
}

async function query(data) {
    const response = await fetch(
        "https://geghnreb.cloud.sealos.io/api/v1/prediction/28a6b79e-bd21-436c-ae21-317eee710cb0",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

connectWhatsapp()