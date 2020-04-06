const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => sgMail.send({
    to: email,
    from: 'indflor.nasik@gmail.com',
    subject: 'Welcome to inflor',
    text: `Hi ${name}, Welcome to Indflor family`
});

const sendAccDeactEmail = (email, name) => sgMail.send({
    to: email,
    from: 'indflor.nasik@gmail.com',
    subject: 'Account Deactivated',
    text: `Hi ${name}, Your account has deactivated.`
});

module.exports = {
    sendWelcomeEmail,
    sendAccDeactEmail
}