const nodemailer = require('nodemailer');
const config = require('../config');
const render = require('./templateHelpers');
const logger = require('./loggerHelpers');

// create reusable transporter object using the default SMTP transport
const mailer = {
  transporter: nodemailer.createTransport(config.mail),
  send: function send(mailOptions_, callback) {
    const mailOptions = mailOptions_;
    mailOptions.from = config.mail.from;
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
      }
      callback(error, info);
    });
  },
  sendTemplate: async function sendWithTemplate(templateName, to, payload, language, callback) {
    const subject = await render(`${language}/mail_${templateName}_subject`, payload);
    const html = await render(`${language}/mail_${templateName}`, payload);

    const mailOptions = {
      subject, html, to,
    };
    this.send(mailOptions, callback);
  },

};
module.exports = mailer;
