// Importando modulos/bibliotecas necessarias
require('dotenv').config();
console.log()
const Swal = require('sweetalert2');    
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function sendEmail(req, res) {
    const { email, assunto } = req.body;
    const arquivo = req.file;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });

    const mailOptions = {
        from: 'mapadesala@notredamecampinas.net.br',
        to: email,
        subject: req.user.name + ' - Mapa-de-sala',
        text: assunto,
        attachments: arquivo
            ? [
                  {
                      filename: arquivo.originalname,
                      path: arquivo.path,
                  },
              ]
            : [],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("ENVIADO EMAIL", email, req.user.name);
        res.json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ message: 'Erro ao enviar email' });
    }
}





module.exports = { sendEmail, upload };
