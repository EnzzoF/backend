// Importando modulos das bibliotecas NPM baixadas
const fs = require('fs');
const express = require('express'); // Servidor 
const path = require('path');
const passport = require('passport'); // middleware para o node.js  = Funciona como intermediario permitindo a troca de dados entre a API E CLIENTE
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session'); // Gerenciamento de Session  LOGADO / DESLOGADO 
const { getStudents, insertStudent } = require('./googleplanilhas');
const { sendEmail, upload } = require('./nodemailer');

const credentials = JSON.parse(fs.readFileSync('./creden.json', 'utf8'));
const port = process.env.PORT || 5500;

// Configura o servidor EXPRESS para usar MIDDLEWARE = processa soli , respostas = req , resp = response

const CLIENT_ID = '857961179786-r9p4i592okbbt5eoqhvgfjhl8vparn3h.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

function isProfessor(email) {
  const regex = /^[0-9]/; // Expressao Regular/REGEX para verificar os emails logados emaisl com numeros nao irao ser permitidos 
  return !regex.test(email);  // Se a regex não encontrar um número no início da string do e-mail, isso significa que o e-mail pertence a um professor e a 
                              //função retorna true. Se a regex encontrar um número no 
                              //início da string do e-mail, isso significa que o e-mail pertence a um aluno e a função retorna false.
}

passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: 'https://mapadesala.notredamecampinas.com.br/auth/google/callback',
  hosted_domain: 'notredamecampinas.net.br'
},

(accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  if (isProfessor(email)) {
    const user = {
      email: email,
      name: profile.displayName,
      picture: profile.photos[0].value
    };
    done(null, user);
  } else {
    done(new Error('Acesso negado, Somente professores', email));
  }
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express(); // Criando Servidor Express 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public', { type: 'text/css' })); // Suprindo arquivos Estaticos
app.use('/public/js', express.static('public/js')); // Suprindo Arquivos Estaticos
app.use('/assets', express.static('assets')); // Suprindo Arquivos Estaticos


// Definindo sessoes
app.use(session({
  secret: CLIENT_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Configurando sessao 
app.use(passport.initialize()); // inicizaliza passport 
app.use(passport.session()); // habilitando uso de sessoes 


// Rota pagina de login 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Button do google com a rota /auth/google 
// Autentica o usuario 
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

// get para autenticaçao quanto para acesso negado 

app.get('/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user) => {
      if (err) { // se for igual a o ERRO redirecionar para error.html = acesso negado da biblioteca SWAL
        console.error('Somente PROFESSOR', err);
        return res.redirect('/error.html?error=access_denied'); 
      }

      req.logIn(user, (err) => {
        if (err) {  
          console.error(err);
          return res.redirect('/error.html?error=access_denied');
        }
        console.log('Professor conectado:', user.name);
        return res.redirect('/inter.html');
      });

    })(req, res, next);
  }
);

 // Rota para pagina de erro 
app.get('/error.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'error.html')); // .. e / para referenciar os arquivos dentro da public
});

// Rota para a prof.html 
  
app.get('/prof.html', (req, res) => {
    if (req.user) {
      const userData = {
        name: req.user.name,
        picture: req.user.picture
      };
  
      const profHTML = fs.readFileSync(path.join(__dirname, '../public', 'prof.html'), 'utf8');
      // passa o email , name , foto para o corpo __user_data__ e no index.html recuperamos 
      const updatedHTML = profHTML.replace('__USER_DATA__', JSON.stringify(userData));
      
      // definindo o tipo de cocnteudo = TEXT.html = html
      res.setHeader('Content-Type', 'text/html');
      res.send(updatedHTML);
    } else {
      res.redirect('/');
      
    }
  });

  app.get('/hello', (req, res) => {
    res.send('Hello, World!');
  });
  

  // Rota para inter.html

app.get('/inter.html', (req, res) => {
    if(req.user) {
      res.sendFile(path.join(__dirname, '../public', 'inter.html'));
    } else {
      res.redirect('/');
    }
  } 
  );
  
// Rota para deslogar o usuario revogando o acesso 

app.get('/logout', (req, res) => {
    console.log('Professor desconectado:', req.user.name);
    req.logout(function(err) {
      if (err) {
        // Lida com erros, SE houver
        console.error(err);
      }
      res.redirect('/');
    });
  });
//

// Rota GET para recuperar os alunos e colocalos em "carteiras"

 app.get('/students/:sheetName', async (req, res) => {
    const spreadsheetId = '1IaYIo6PwRK6i0Aola0Akxrd8VMlur1_OIWYGctTz4O4';
    const sheetName = req.params.sheetName; // Pega o parâmetro 'sheetName' da URL
  
    try {
      const students = await getStudents(spreadsheetId, sheetName);
      console.log('Planilha Retornado OK');
      res.json(students);
    } catch (error) {
      console.error(error);
      console.log('erro , provavel nao existente');
      res.status(500).send('Erro a buscar Alunos Na Planilha do google sheets (SERVIDOR)'); 
    }
  });

  // Rota POST para enviar email usando NODEMAILER

app.post('/send-email', upload.single('arquivo'), sendEmail);


// Rota POST para inserir alunos na planilha 

app.post('/students', express.json(), async (req, res) => {
  const { name, ra, className } = req.body; // Recebemos os dados do aluno via corpo da requisição

  try {
    await insertStudent(name, ra, className); 
    res.status(200).send('Aluno inserido com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao inserir aluno na planilha do Google Sheets');
  }
});

// Servidor Express 

app.listen(port, () => {
  console.log('Servidor funcionando na porta', port);
});
