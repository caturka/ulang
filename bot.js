const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const moment = require('moment-timezone')
const axios = require('axios')
const gtts = require('gtts')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const http = require('http')

// Biar Render gak error No open ports
http.createServer((req,res)=>{
  res.writeHead(200);
  res.end('BANGCATS ON 24 JAM MAS!');
}).listen(process.env.PORT || 3000, ()=>{
  console.log('Server web nyala di port', process.env.PORT || 3000);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ["Bangcats", "Chrome", "1.0.0"]
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (up) => {
        const { connection, lastDisconnect, qr } = up
        if(qr){
            console.log('===== SCAN QR INI MAS =====');
            qrcode.generate(qr, {small: true})
            console.log('QR String:', qr)
        }
        if (connection === 'close') {
            const reconnect = lastDisconnect?.error?.output?.statusCode!== 401
            console.log('Connection close, reconnect:', reconnect)
            if (reconnect) startBot()
        } else if (connection === 'open') {
            console.log('✅ BANGCATS ON 24 JAM NYALA MAS - BOT CONNECTED!')
        }
    })

    // DATA 38 PROVINSI MAS - biarin aja mas kode lama mas dibawah ini
    const provinsi = {
        aceh: 'Banda Aceh', sumut: 'Medan', sumbar: 'Padang'
        // lanjutin kode lama mas yang di bawahnya mas
    }

    //... kode bot mas yang lain mas biarin tetep di bawah sini...

    sock.ev.on('messages.upsert', async (m) => {
        // kode auto reply mas yang lama
        console.log('Ada pesan masuk mas', m.messages[0]?.message)
    })
}

startBot()
