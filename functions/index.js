
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Ignite Ideas - Orient Cement';



exports.sendsendThankyouEmail = functions.database.ref('/ideas/{pushId}').onWrite(event => {
  // Only edit data when it is first created.
      if (event.data.previous.exists()) {
        return;
      }
      // Exit when the data is deleted.
      if (!event.data.exists()) {
        return;
      }
// [END onDeleteTrigger]

// Grab the current value of what was written to the Realtime Database.
const original = event.data.val();
console.log('WelcomeData added', event.params.pushId, original);

  const user = event.data;

  const email = user.email;
  const displayName = user.displayName;

  return sendThankyou(original.IdeaProposedByEmail, original.IdeaProposedBy);
});

function sendThankyou(email,displayName){
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. Thank you for sending us your idea. Your idea will be evaluated and sent to The top management. We will keep you posted on the status.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

function sendupdatechangemail(email,displayName){

}
