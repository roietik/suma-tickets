const {sendEmailSandBox, sendEmailGmail} = require("../services/send-email.service");

async function sendEmail(request, response) {
    try {
        // TODO utworzyć gmail dla suma
        // TODO skonfigurować gmail
        // TODO utworzyć serwis do wysyłki prawdziwego maila
        // TODO dodać do serwisu konfigurację z wysłaniem załącznika pobieranego z base64
        await sendEmailGmail();
        response.send('email was send');
    } catch (error) {
        console.error('Error sending email:', error);
        response.status(500).send('Email sending failed');
    }
}

module.exports = {
    sendEmail
};