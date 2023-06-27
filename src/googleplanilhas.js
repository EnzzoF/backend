// Importando modulos/bibliotecas necessarias
const { google } = require('googleapis');
const fs = require('fs');
const { allowedNodeEnvironmentFlags } = require('process');

const credentials = JSON.parse(fs.readFileSync('./creden.json', 'utf8'));

// Função para autorizar o acesso à API do Google Sheets
async function authorize() {
  const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  await client.authorize();
  return client;
}

// Função para obter os alunos e as URLs das imagens das planilhas do Google Sheets
async function getStudents(spreadsheetId, sheetName) {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:B`,
  });

  const students = data.values.map(([name, imageUrl]) => ({ 
    name, 
    imageUrl: imageUrl || 'https://yt3.ggpht.com/-uawOVNigAxE/AAAAAAAAAAI/AAAAAAAAAAA/PlqdDQ-wv7I/s900-c-k-no-mo-rj-c0xffffff/photo.jpg', 
    className: 
    sheetName 
  }));
  return students;
}

// Funçao assincrona para INSERIR ESTUDANTES 

async function insertStudent(name, ra, className) {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });
  const values = [[`${name} - ${ra}`]]; // Concatena nome e RA em uma única string
  const resource = { values }; // Corpo da requisição para a API do Google Sheets

  await sheets.spreadsheets.values.append({
    spreadsheetId: '1IaYIo6PwRK6i0Aola0Akxrd8VMlur1_OIWYGctTz4O4', // Substitua pelo ID da sua planilha
    range: `${className}!A:A`,
    valueInputOption: 'USER_ENTERED',
    resource,
  });
}

// Exportação das funções em módulos
module.exports = { getStudents, insertStudent};

