const client = require("@sendgrid/mail");
require("dotenv").config();

// sendGridMail object
client.setApiKey(process.env.SENDGRID_API_KEY);

// Generates and sends emails of various content and purpose
async function generateEmail(emailTo, subject, templateData, templateId) {
  try {
    await client.send({
      from: {
        email: process.env.SENDER.toString(),
      },
      subject: subject,
      personalizations: [
        {
          to: [
            {
              email: emailTo,
            },
          ],
          dynamic_template_data: templateData,
        },
      ],
      template_id: templateId,
    });
    console.log(`Mail to ${emailTo} was sent successfully`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = generateEmail;
