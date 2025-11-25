const sgMail = require('@sendgrid/mail')
const twilio = require('twilio')
const axios = require('axios')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const twClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

async function sendEmail(to, subject, text, html) {
  return sgMail.send({ to, from: process.env.SENDGRID_FROM, subject, text, html })
}
async function sendSms(to, body) {
  return twClient.messages.create({ body, from: process.env.TWILIO_FROM, to })
}
async function sendWebhook(url, payload) {
  return axios.post(url, payload, { timeout: 5000 })
}

module.exports = { sendEmail, sendSms, sendWebhook }
