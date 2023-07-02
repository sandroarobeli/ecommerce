const { validationResult } = require("express-validator");

const prisma = require("../../db");

async function sendMessage(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { sender, subject, content } = req.body;

  try {
    await prisma.message.create({
      data: {
        sender: sender,
        subject: subject,
        content: content,
      },
    });

    res.end();
  } catch (error) {
    return next(
      new Error(
        "Message sending failed. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = sendMessage;
