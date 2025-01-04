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





let etapa = 'inicial'
let produto = ''
let quantidade = ''
let rua = ''
let numero_rua = ''
let complemento = ''
let bairro = ''



client.on('message_create', async message => {
    if (etapa === 'inicial') {
        if (message.body === '!ping') {
            // send back "pong" to the chat the message was sent in
            client.sendMessage(message.from, saudacao);
            etapa = 'pega opcao'
            console.log(etapa)
        }
    }
    else if (etapa === 'pega opcao') {
        if (message.body === "1") {
            client.sendMessage(message.from, menu)
            console.log(etapa)
            etapa = 'escolhe produto'
        }
        
    }
    else if (etapa === 'escolhe produto') {   
        console.log(etapa) 
       if (message.body === '1' || message.body === '2' || message.body === '3') {
            produto = message.body
            client.sendMessage(message.from, `Você escolheu ${produto}. Digite a quantidade`)
            etapa = 'escolhe quantidade'
       }
    }
    else if ( etapa === 'escolhe quantidade') {
        console.log(etapa)
        if (parseInt(message.body) > 0 && parseInt(message.body) < 11) {
            quantidade = message.body
            client.sendMessage(message.from, "Deseja adicionar outro produto?\n 1. Sim\n 2. Não")
            etapa = 'escolhe etapa'
        }
        
    }
    else if (etapa === 'escolhe etapa') {
        console.log(etapa)
        if (message.body === '1') {
            etapa = 'pega opcao'
        }
        if (message.body === '2') {         
            client.sendMessage(message.from, "Informe a rua do endereço de entrega");
            etapa = 'pega rua'
            
            }
            
    }
    else if (etapa === 'pega rua') {
        
            rua = message.body;
            if (rua.length > 1) {
                client.sendMessage(message.from, "Informe o número da rua");
                etapa = 'pega numero rua';  // Aguarda a próxima resposta para número da rua

            }
        
        
    }
    else if (etapa === 'pega numero rua') {
        

        console.log(etapa)
        if (parseInt(message.body) > 0) {
            numero_rua = message.body
            client.sendMessage(message.from, "Complemento")
            etapa = 'pega complemento'
        
        }
            
        
    }
    else if (etapa === 'pega complemento') {
        console.log(etapa)
       
            complemento = message.body
            client.sendMessage(message.from, "Informe o bairro")
            etapa = 'pega bairro'
        
        
    }
    else if (etapa === 'pega bairro') {
        console.log(etapa)
            bairro = message.body
            client.sendMessage(message.from, `O pedido de ${quantidade} ${produto}
                \n Para o endereço:
                \n Rua ${rua},
                \n Número ${numero_rua},
                \n Compl: ${complemento},
                \n Bairro: ${bairro}
                \n Selecione a forma de pagamento: 
                \n 1. Pix
                \n 2. Cartão
                \n 3. Dinheiro`)
            etapa = 'pega meio pagamento'
        
        
    }
    else if (etapa === 'pega meio pagamento') {
        console.log(etapa)
        if (message.body === '1') client.sendMessage(message.from, 'PIX')
        else if (message.body === '2') client.sendMessage(message.from, 'Cartão')
        else if ( message.body === '3') client.sendMessage(message.from, 'Dinheiro')
    }
});

//bot////////////////////////////////////////////////////
let saudacao = "Olá! \n1. Fazer novo pedido \n2. Realizar pedido padrão \n3. Falar com atendente \n4. Editar Pedido padrão"
let menu = "Digite o número do produto para adiciona-lo ao carrinho: \n1. Naturágua 20L \n2. Indaiá 20L \n3. Indaiá 5L"
let finalizado = false

receber_endereco = () => {
    client.sendMessage(message.from, "Insira o nome da rua do endereço de entrega")
    let rua = message.body
    client.sendMessage(message.from, "Insira o número")
    let numero = message.body
    client.sendMessage(message.from, "Informe um complemento")
    let complemento = message.body
    client.sendMessage(message.from, "Insira o bairro")
    let bairro = message.body
}

/////////////////////////////////////////////////////////

app.post('/', (req, res) => {
    res.send("Mensagem enviada ao dashboard")
})

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })