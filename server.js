const express = require("express")
const app = express()
const cors = require('cors')
const axios = require('axios');
const QRCode = require('qrcode');
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
    { name: "Indaiá Mini", type: "5L", value: 5 },
]

let troco = ''

let total = 0

let produtos = []

let quantidades = []

let pos_nova_quantidade = ''

let pedido_padrao = {
    orderId: 833874, // Qualquer valor
    quantitys: [3, 1], // Uma quantidade aleatória
    product: [{name: "Naturágua", type: "20L"}, {name: "Indaiá", type: "5L"}],
    customer: "Dante Araújo", // vou te mandar os dados do cliente e de produtos
    phone: "+5585996105145",
    address: {rua: "Rua Antonele Bezerra", numero: "255", bairro: "Meireles"},
    price: 36,
    payment: "Pix", // Pode ser "Pix", "Cartão de Crédito", "Dinheiro"
    time: "18:30", // um horário qualquer 18:30
}



client.on('message_create', async message => {
    if (etapa === 'inicial') {
        if (message.body === '!ping') {
            // send back "pong" to the chat the message was sent in
            null
        } else {
            pos_nova_quantidade = ''
            total = 0
            quantidades = []
            troco = ''
            produtos = []
            contato =  await message.getContact()
            client.sendMessage(message.from, `Olá, ${contato.pushname}! ${saudacao}`)
            cliente.phone = message.sender
            etapa = 'pega opcao'
            console.log(etapa)
        }
    }
    
    else if (etapa === 'pega opcao') {
        //CADASTRAR NOVO PEDIDO PADRÃO E CLIENTE
        if (message.body === "1") {
            client.sendMessage(message.from, menu)
            console.log(etapa)
            etapa = 'escolhe produto'
        }
        //REALIZAR PEDIDO PADRÃO JÁ EXISTENTE
        else if (message.body === "2") {
            rua = pedido_padrao.address.rua
            numero_rua = pedido_padrao.address.numero
            complemento = 'casa'
            bairro = pedido_padrao.address.bairro
            
            client.sendMessage(message.from, `Pedido:\n`
                +
                pedido_padrao.product.map((prod, index) => {
                    produtos.push(products[products.findIndex(produto => produto.name === prod.name)])
                    quantidades.push(pedido_padrao.quantitys[index])
                })
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]    
                    return "-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                })
                +            
                `
                \n ✅ Perfeito! O valor total do seu pedido é *R$ ${total}*
                \n Selecione a forma de pagamento: 
                \n 1️⃣ Pix
                \n 2️⃣ Cartão
                \n 3️⃣ Dinheiro`)
                 etapa = 'pega meio pagamento'
                
        }
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        //FALAR COM ATENDENTE
        else if(message.body === "3") {
            client.sendMessage(message.from, "Aguarde 😊 enquanto encaminhamos sua solicitação a um de nossos atendentes")
        }
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        //EDITAR PEDIDO
        else if(message.body === "4") {
            client.sendMessage(message.from, `Seu pedido padrão atual é: 
                \nPedido:\n`
                +
                pedido_padrao.product.map((prod, index) => {
                    produtos.push(products[products.findIndex(produto => produto.name === prod.name)])
                    quantidades.push(pedido_padrao.quantitys[index])
                })
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]    
                    return "-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                })
                +
                `Qual dos campos deseja editar?
                \n1️⃣ Produto
	            \n 2️⃣ Quantidade 
	            \n 3️⃣ Endereço`)
            etapa = 'editar'
        }
    }
    else if (etapa === 'editar') {
        if (message.body === "1") {
            client.sendMessage(message.from, `🛠️ Você deseja *acrescentar* ou *excluir* um produto no seu pedido padrão?
                \n1️⃣ Acrescentar
                \n2️⃣ Excluir
                `)
            etapa = 'editar produto'
        }
        else if (message.body === '2') {
            client.sendMessage(message.from, `🛠️Qual produto deseja mudar a quantidade? 
                \nPedido:`
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]
                    let i = index + 1    
                    return "\nDigite *" + i + "* para mudar a quantidade " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                })              
            )
            etapa = 'mudar quantidade'
        }
        else if (message.body === '3') {
            client.sendMessage(message.from, 
                `Seu endereço atual é: 
                \nRua: ${pedido_padrao.address.rua}
                \nNúmero: ${pedido_padrao.address.numero}
                \nBairro: ${pedido_padrao.address.bairro}
                \n1️⃣ Editar rua
                \n2️⃣ Editar número
                \n3️⃣ Editar bairro
                \n4 Voltar ao início
                `
            )
            etapa = 'editar endereco'
        }
    }
    else if (etapa === 'editar endereco') {
        if (message.body === '1') {
            client.sendMessage(message.from, 'Informe a nova rua: ')
            etapa = 'pega nova rua'
        }
        else if(message.body === '2') {
            client.sendMessage(message.from, 'Informe o novo número: ')
            etapa = 'pega novo numero'
        }
        else if (message.body === '3') {
            client.sendMessage(message.from, 'Informe o novo bairro: ')
            etapa = 'pega novo bairro'
        }
        else if (message.body === '4') {
            etapa = 'inicial'
        }
    }
    else if (etapa === 'pega nova rua') {
        if (message.body !== 'Informe a nova rua: ') {
            console.log(message.body)
            rua = message.body
            client.sendMessage(message.from, `
                🎉 Pedido padrão atualizado com sucesso! Agora ele será utilizado automaticamente para futuras compras.
                \nSeu novo endereço é:
                \nRua: ${rua}`)
            etapa = 'enviar pedido'
        }      
    }
    else if (etapa === 'pega novo numero') {
        if (message.body !== 'Informe o novo número: ') {
            numero_rua = message.body
            client.sendMessage(message.from, `
                🎉 Pedido padrão atualizado com sucesso! Agora ele será utilizado automaticamente para futuras compras.
                \nSeu novo número é: ${numero_rua}`)
            etapa = 'enviar pedido'
        }
    }
    else if (etapa === 'pega novo bairro') {
        if (message.body !== 'Informe o novo bairro: ') {
            bairro = message.body
            client.sendMessage(message.from, `
                🎉 Pedido padrão atualizado com sucesso! Agora ele será utilizado automaticamente para futuras compras.
                \nBairro: ${bairro}`)
            etapa = 'enviar pedido'
        }
    }
    else if (etapa === 'editar produto') {
        if (message.body === '1') {
            client.sendMessage(message.from, menu)
            console.log(etapa)
            etapa = 'escolhe produto'
        }
        else if (message.body === '2') {
            client.sendMessage(message.from, `🛠️Qual produto deseja excluir? 
                \nPedido:`
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]
                    let i = index + 1    
                    return "\nDigite *" + i + "* para remover " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                })
            )
            etapa = 'excluir produto'
        }
    }
    else if (etapa === 'mudar quantidade') {
        if (parseInt(message.body) > 0){
            let i = message.body - 1
            pos_nova_quantidade = i
            client.sendMessage(message.from, "🛠️Digite a nova quantidade para o produto")
            etapa = 'escolhe quantidade nova' 
        }
    }
    else if (etapa === 'escolhe quantidade nova') {
        if (parseInt(message.body) > 0) {
            quantidades[pos_nova_quantidade] = message.body
            client.sendMessage(message.from, `🎉 Pedido padrão atualizado com sucesso! Agora ele será utilizado automaticamente para futuras compras.
                \n🛠️Confira seu novo pedido padrão: 
                \nPedido:\n`
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]    
                    return "-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                }))
            etapa = 'enviar pedido'
        }
    }
    
    else if (etapa === 'excluir produto') {
        if (parseInt(message.body) > 0){
            let i = message.body
            console.log(i)
            produtos.splice(i - 1, 1)
            client.sendMessage(message.from, `🎉 Pedido padrão atualizado com sucesso! Agora ele será utilizado automaticamente para futuras compras.
                \n🛠️Confira seu novo pedido padrão: 
                \nPedido:\n`
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]    
                    return "-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                }))
            etapa = 'enviar pedido'
        }
    }
    else if (etapa === 'escolhe produto') {   
        console.log(etapa) 
        if (message.body === '1' || message.body === '2' || message.body === '3') {
            produto = products[parseInt(message.body) - 1]
            produtos.push(produto)
            client.sendMessage(message.from, `Você escolheu ${produto.name} de ${produto.type}.\n🔢 Quantos itens você deseja?`)
            etapa = 'escolhe quantidade'
        }
    }
    else if (etapa === 'escolhe quantidade') {
        console.log(etapa)
        if (parseInt(message.body) > 0 && parseInt(message.body) < 11) {
            console.log("quantidade: " + message.body)
            quantidade = message.body
            quantidades.push(quantidade)
            client.sendMessage(message.from, "✅ Certo, deseja escolher mais algum de nossos produtos ?\n1️⃣ Sim\n2️⃣ Não")
            etapa = 'escolhe etapa'
        }
    }
    else if (etapa === 'escolhe etapa') {
        console.log(etapa)
        console.log("body etapa: " + message.body)
        if (message.body === '1') {
            client.sendMessage(message.from, menu)
            console.log(etapa)
            etapa = 'escolhe produto'
        }
        else if (message.body === '2') {
            //adicionando produto à um pedido padrão já existente
            if (produtos.length > 2) {
                client.sendMessage(message.from, `🎉 Pedido padrão atualizado com sucesso! Agora ele será utilizado automaticamente para futuras compras.
                    \n🛠️Confira seu novo pedido padrão: 
                \nPedido:\n`
                +
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]    
                    return "-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"                
                }))
                etapa = 'enviar pedido'
            //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            } else {
                client.sendMessage(message.from, "👍 Tudo pronto! Agora precisamos do endereço de entrega.\nInforme o nome da sua rua")
                etapa = 'pega rua'
            }
        }
    }
    else if (etapa === 'pega rua') {
        console.log("rua: " + message.body)
        if (message.body.length > 1 && message.body !== "👍 Tudo pronto! Agora precisamos do endereço de entrega.\nInforme o nome da sua rua") {
            rua = message.body
            console.log("Rua armazenada: " + rua)
            client.sendMessage(message.from, "Informe o número")
            etapa = 'pega numero rua'
        }
    }
    else if (etapa === 'pega numero rua') {
        if (message.body !== "Informe o número") {
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
            bairro = message.body
           
            client.sendMessage(message.from, `Pedido:\n`
                + 
                produtos.map((prod, index) => {
                    total += prod.value * quantidades[index]                    
                })
                +            
                `
                \n ✅ Perfeito! O valor total do seu pedido é *R$ ${total}*
                \n Selecione a forma de pagamento: 
                \n 1️⃣ Pix
                \n 2️⃣ Cartão
                \n 3️⃣ Dinheiro`)
            etapa = 'pega meio pagamento'
        }   
    }
    else if (etapa === 'pega meio pagamento') {
        console.log(etapa)
        if (message.body === '1') {
            client.sendMessage(message.from, 'Chave pix: adc8293y4hfasln3478')
            etapa = 'pagamento pix'
        }
        else if (message.body === '2') client.sendMessage(message.from, 'Cartão')
        else if (message.body === '3') {
            client.sendMessage(message.from, `💵 Você vai precisar de troco?\n1️⃣ Sim\n2️⃣ Não`)
            etapa = 'troco'
        }
    }
    else if (etapa === 'pagamento pix') {
        if (message.body === 'pago') {
            client.sendMessage(message.from, `🎉 Pedido confirmado! Será enviado em breve
                \n================================  
                \n🛍️ Detalhes da sua compra:`
                + 
                produtos.map((prod, index) => {    
                    return "\n-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x"
                    
                })
                +            
                `\n Para o endereço:
                \n Rua: ${rua},
                \n Número: ${numero_rua},
                \n Compl: ${complemento},
                \n Bairro: ${bairro}
                \n Total: *R$ ${total}*
                \n================================
                `)
                etapa = 'enviar pedido'
        }
    }
    else if(etapa === 'troco') {
        console.log(etapa)
        console.log('message: ' + message.body)
        if (message.body === '1') {
            client.sendMessage(message.from, `Troco pra quanto 💵 ?`)
            etapa = 'pega valor troco'
            
        }
        else if (message.body === '2') {
            etapa = 'encerrar pedido'
        }
    }
    else if(etapa === 'pega valor troco') {
        console.log(etapa)
        if (parseInt(message.body) > 5 &&  message.body !== `Troco pra quanto 💵 ?`){
            //client.sendMessage(message.from, `Ok! Troco pra R$${message.body}`)
            troco = message.body
            client.sendMessage(message.from, `
                🎉 Pedido confirmado! Será enviado em breve\n
                ================================  
                🛍️ Detalhes da sua compra:\n`
                + 
                produtos.map((prod, index) => {    
                    return "-- " + prod.name + " de " + prod.type + " " + quantidades[index] + "x\n"
                    
                })
                +            
                `\n Para o endereço:
                \n Rua: ${rua},
                \n Número: ${numero_rua},
                \n Compl: ${complemento},
                \n Bairro: ${bairro}
                \n Total: *R$ ${total}*
                \n Troco pra R$${troco}
                ================================
                `)
            
            etapa = 'enviar pedido'
        }
        
    }
    else if ( etapa === 'enviar pedido') {
        console.log(etapa)
        const pedido = await axios.post('http:endereco-do-back', 
            {
                orderId: 833874, // Qualquer valor
                quantity: quantidade, // Uma quantidade aleatória
                product: {name: produto.name, type: produto.type},
                customer: "Dante Araújo", // vou te mandar os dados do cliente e de produtos
                phone: contato.number,
                address: `${rua}, ${numero_rua}, ${bairro}`,
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
        etapa = 'inicial'
          
    }
})

//////////////////////MENSAGENS////////////////////////////////
let saudacao = `👋 Seja bem-vindo ao sistema *Drops*! \nÉ um prazer ter você aqui.\nPara começar, escolha uma das opções abaixo: \n1️⃣ Fazer um novo pedido  \n2️⃣ Realizar pedido padrão  \n3️⃣ Falar com um de nossos atendentes \n4️⃣ Editar pedido padrão `
let menu = `✅ Perfeito, ${contato.pushname}! Agora vamos escolher o produto para o seu pedido.\n
 \n1️⃣ Naturágua 20L \n2️⃣ Indaiá 20L \n3️⃣ Indaiá 5L`
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