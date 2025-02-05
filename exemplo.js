const QRCode = require('qrcode');
const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.initialize();

async function createClient( client ) {
  // Client tem que ter:
  // {
  //   "name": "Filipe Cavalcanti",
  //   "email": "lipeaoc@gmail.com",
  //   "phoneNumber": "+5585991094233",
  //   "street":"Washington Soares",
  //   "number":"1010",
  //   "complement":"em frente ao Wesley Safadão Trade Center",
  //   "neighborhood":"Edson Queiroz",
  //   "city":"Fortaleza",
  //   "state":"Ceará",
  //   "cep":"60160070",
  //   "organizationId": 2 // Por enquanto sempre vai ser 2
  // }
  try {
    const response = await axios.post(`http://localhost:4000/api/v1/client`, client)
    return response.data;
  } catch (error) {
    console.error(error);
  }

}

async function getClientInfo( number ) {
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/client/2/${number}`)
    return response.data;
  } catch (error) {
    console.error(error);
  }

}
async function getProducts() {
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/product/2?include=1`)
    return response.data;
  } catch (error) {
    console.error(error);
  }

}


client.on('message', async message => {
  const contactInfo = await message.getContact();
  const contactNumber = contactInfo.number;
  const contactName = contactInfo.pushname;
  const client = {
    number: "+" + contactNumber.substring(0, 4) + '9' + contactNumber.substring(4,12),
    name: contactName
  }
  const backendClientInfo = await getClientInfo(client.number);
  const backendProductsInfo = await getProducts(client.number);

  console.log(client)
  console.log(backendClientInfo)
  console.log(backendProductsInfo)
})
