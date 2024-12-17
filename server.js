const express = require("express")
const app = express()
const cors = require('cors')
//require('dotenv').config({path: './config/.env'})
//const mongoose = require("mongoose");
//const connectDB = require('./config/db')
//connectDB()
const PORT = 3000

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

//const homeRoutes = require('./routes/homeRoutes')

//app.use('/', homeRoutes)




// Create a new client instance
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');



//Isso faz com que o puppeteer guarde a autenticação, não precisando fazer novamente o tempo todo. Evita tomar ban
const client = new Client({
    authStrategy: new LocalAuth()
});


// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

// Start your client
client.initialize();






client.on('message_create', message => {
	if (message.body === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
    else if (message.body === "1") {
        client.sendMessage(message.from, 
            "Você escolher a opção .... "
        )
        let mensagem_recebida = message.body
    }
});

app.post('/', (req, res) => {
    res.send("Mensagem enviada ao dashboard")
})

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })