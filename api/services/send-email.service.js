const nodemailer = require("nodemailer");
const mailConfig = require("../config/nodemailer.config");

async function sendEmailSandBox() {
    // https://ethereal.email/create
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'adrianna.bernhard75@ethereal.email',
            pass: 'TNkk7uR1rBhvEJgvh6'
        }
    });

    const message = {
        from: 'radoslaw.grzymala@hotmail.com',
        to: 'radkoo2.grzymala@gmail.ocmx',
        subject: 'Subject of your email',
        text: 'Body of your email'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
        } else {
            console.log('Email sent:', info.messageId);
        }
    });
}

async function sendEmailGmail(request, response) {
    const { email, ticketBase64 } = request.body;
    if (!email) {
        throw new Error("Missing required data");
    }

    const transporter = nodemailer.createTransport({
        host: mailConfig.nmHost,
        port: mailConfig.nmPort,
        secure: true,
        auth: {
            user: mailConfig.nmMail,
            pass: mailConfig.nmPassword
        }
    });

    const message = {
        from: mailConfig.nmMail,
        to: email,
        subject: 'Bilet Suma 2024 Płock',
        text: 'Bilet Suma 2024 Płock',
        attachments: [
            {
                filename: 'ticket-suma-2024.pdf',
                content: ticketBase64,
                encoding: 'base64'
            },
        ]
    };

    transporter.sendMail(message, (error) => {
        if (error) {
            console.log('Error sending email:', error);
        }
    });
}

module.exports = {
    sendEmailSandBox,
    sendEmailGmail
}