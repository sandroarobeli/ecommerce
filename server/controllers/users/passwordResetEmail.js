// Creates email token and uses it to generate a time sensitive link, which is
// Emailed to the user using generateEmail utility function. The link contains the
// Token as the req parameter. Clicking the link triggers the route controller that
// validates the link. If the link is still valid(active), user gets redirected
// To the password reset form page. Otherwise, user gets redirected to the page
// With "The link has expired" feedback message

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("../../db");
const generateEmail = require("../../utils/generateEmail");

async function resetEmail(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Email is missing or invalid. Please provide a valid email.")
    );
  }

  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return next(
        new Error(
          "Email not found. Please enter a valid email or proceed to signup."
        )
      );
    }

    let emailToken;
    try {
      emailToken = jwt.sign(
        { userEmail: email },
        process.env.SECRET_TOKEN_KEY,
        {
          expiresIn: "15m",
        }
      );
    } catch (error) {
      return next(new Error("Processing error. Please try again later."));
    }

    // Prepare the data to be passed into email function api for dynamic templates
    const templateData = {
      baseUrl: process.env.SERVER_DOMAIN.toString(),
      emailToken: emailToken,
    };

    // Invoke email generating function with user email & unique token
    await generateEmail(
      email,
      "Password reset",
      templateData,
      "d-15c6123d0c324db89a8aad2d644539d8"
    );

    res.end();
  } catch (error) {
    return next(
      new Error(
        "Password reset currently unavailable. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = resetEmail;
