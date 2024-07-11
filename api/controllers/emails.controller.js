const {sendEmailGmail} = require("../services/send-email.service");

async function sendEmail(request, response) {
    try {
        await sendEmailGmail(request, response);
        response.status(200).send({message: 'Bilet został wysłany na skrzynkę email'});
    } catch (error) {
        console.error('Error sending email:', error);
        response.status(500).send('Email sending failed', error);
    }
}

module.exports = {
    sendEmail
};