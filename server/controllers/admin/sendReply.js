const { validationResult } = require("express-validator");

const prisma = require("../../db");
const generateEmail = require("../../utils/generateEmail");

async function sendReply(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { userId } = req.userData;
  const { emailTo, subject, content } = req.body;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });
    // Ensures logged in user has Admin privileges
    if (!currentUser || !currentUser.isAdmin) {
      return next(
        new Error(
          "You are not authorized to perform this function. Admin privileges required"
        )
      );
    }

    // Prepare the data to be passed into email function api for dynamic templates
    const templateData = {
      replyContent: content,
    };

    // Invoke reply message generating function
    await generateEmail(
      emailTo,
      subject,
      templateData,
      "d-727e3519a9b347e9965ae027db9f1e7f"
    );

    res.end();
  } catch (error) {
    return next(
      new Error(
        "Failed to send your reply. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = sendReply;
