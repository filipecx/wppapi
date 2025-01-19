const express = require("express")
const app = express()
const cors = require('cors')
const axios = require('axios');
//require('dotenv').config({path: './config/.env'})
//const mongoose = require("mongoose");
//const connectDB = require('./config/db')
//connectDB()
const PORT = 8080

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

//const homeRoutes = require('./routes/homeRoutes')

//app.use('/', homeRoutes)




// Create a new client instance
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

///////////////////////////////////////////////////////////
//mandar mensagem

app.post('/enviar-mensagem', (req, res) => {
    const {numero, mensagem} = req.body
    console.log(`numero: ${numero}, mensagem: ${mensagem}`)


    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Phone number and message are required' });
    }

    client.sendMessage(`${numero}@c.us`, mensagem)
        .then(response => {
            res.json({ success: true, response });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to send message', details: error });
        }
    )
})

const pegarUsuario = (numero) => {
    app.get(`http://localhost:3000/api/v1/${numero}`, async (req, res) => {
        const data = await res.data
        const usuario = data.json()

    })
}
/*
axios.post('http:endereco-do-back', 
    {
        orderId: 833874, // Qualquer valor
        quantity: 3, // Uma quantidade aleatória
        product: {name: "Naturágua", type: "20L"},
        customer: "Dante Araújo", // vou te mandar os dados do cliente e de produtos
        phone: "+5585996105145",
        address: "Rua Antonele Bezerra, 255, Meireles",
        price: 13 * 3,
        payment: "Pix", // Pode ser "Pix", "Cartão de Crédito", "Dinheiro"
        time: "18:30", // um horário qualquer 18:30
    }
)
  .then(response => {
    console.log('Response from server:', response.data);
  })
  .catch(error => {
    console.error('Error sending POST request:', error);
  });
*/


///////////////////////////////////////////////////////////


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



let contato = {pushname: ""}
let etapa = 'inicial'
let produto = ''
let quantidade = ''
let rua = ''
let numero_rua = ''
let complemento = ''
let bairro = ''
let cliente = {
    name: "Dante Araújo",
    phone: "+5585996105145",
    address: ""
}

const products = [
    { name: "Naturágua", type: "20L", value: 13 },
    { name: "Indaiá", type: "20L", value: 12 },
    { name: "Indaiá", type: "5L", value: 5 },
]



client.on('message_create', async message => {
    if (etapa === 'inicial') {
        if (message.body === '!ping') {
            // send back "pong" to the chat the message was sent in
            null
        } else {
            contato =  await message.getContact()
            console.log(contato.pushname)
            client.sendMessage(message.from, `Olá, ${contato.pushname}! ${saudacao}`)
            cliente.phone = message.sender
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
            produto = products[message.body - 1]
            client.sendMessage(message.from, `Você escolheu ${produto.name} de ${produto.type}. Digite a quantidade`)
            etapa = 'escolhe quantidade'
        }
    }
    else if (etapa === 'escolhe quantidade') {
        console.log(etapa)
        if (parseInt(message.body) > 0 && parseInt(message.body) < 11) {
            console.log("quantidade: " + message.body)
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
            client.sendMessage(message.from, "Informe a rua do endereço de entrega")
            etapa = 'pega rua'
        }
    }
    else if (etapa === 'pega rua') {
        console.log("rua: " + message.body)
        if (message.body.length > 1 && message.body !== "Informe a rua do endereço de entrega") {
            rua = message.body
            console.log("Rua armazenada: " + rua)
            client.sendMessage(message.from, "Informe o número da rua")
            etapa = 'pega numero rua'
        }
    }
    else if (etapa === 'pega numero rua') {
        if (message.body !== "Informe o número da rua") {
            console.log("Número da rua: " + message.body)
            numero_rua = message.body
            client.sendMessage(message.from, "Informe o complemento")
            etapa = 'pega complemento'
        }      
    }
    else if (etapa === 'pega complemento') {
        if (message.body !== "Informe o complemento") {
            console.log(message.body)
            complemento = message.body;
            client.sendMessage(message.from, "Informe o bairro")
            etapa = 'pega bairro'
        }       
    }
    else if (etapa === 'pega bairro') {
        if (message.body !== "Informe o bairro") {
            bairro = message.body;
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
     
    }
    else if (etapa === 'pega meio pagamento') {
        console.log(etapa)
        if (message.body === '1') client.sendMessage(message.from, 'PIX')
        else if (message.body === '2') client.sendMessage(message.from, 'Cartão')
        else if (message.body === '3') client.sendMessage(message.from, 'Dinheiro')
    }
    else if ( etapa === 'enviar pedido') {
        axios.post('http:endereco-do-back', 
            {
                orderId: 833874, // Qualquer valor
                quantity: quantidade, // Uma quantidade aleatória
                product: {name: produto.name, type: produto.type},
                customer: "Dante Araújo", // vou te mandar os dados do cliente e de produtos
                phone: "+5585996105145",
                address: "Rua Antonele Bezerra, 255, Meireles",
                price: 13 * 3,
                payment: "Pix", // Pode ser "Pix", "Cartão de Crédito", "Dinheiro"
                time: "18:30", // um horário qualquer 18:30
            }
        )
          .then(response => {
            console.log('Response from server:', response.data);
          })
          .catch(error => {
            console.error('Error sending POST request:', error);
          });
    }
})

//////////////////////MENSAGENS////////////////////////////////
let saudacao = `\nEscolha uma das opções para ser atendido \n1. Fazer novo pedido \n2. Realizar pedido padrão \n3. Falar com atendente \n4. Editar Pedido padrão`
let menu = "Digite o número do produto para adiciona-lo ao carrinho: \n1. Naturágua 20L \n2. Indaiá 20L \n3. Indaiá 5L"
let finalizado = false


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