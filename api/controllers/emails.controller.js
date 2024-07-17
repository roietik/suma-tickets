import { sendEmailGmail } from "../services/send-email.service.js";

async function sendEmail(request, response) {
    try {
        await sendEmailGmail(request, response);
        response.status(200).send({message: 'Bilet został wysłany na skrzynkę email'});
    } catch (error) {
        console.error('Error sending email:', error);
        response.status(500).send('Email sending failed', error);
    }
}

export default {
    sendEmail
};