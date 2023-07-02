const jwt = require("jsonwebtoken");
require("dotenv").config();

async function validatePasswordResetLink(req, res, next) {
  try {
    const { emailToken } = req.params;

    if (!emailToken) {
      return next(
        new Error("This link is invalid. Please submit your email again.")
      );
    }
    // Validate the token and redirect the user to the appropriate page
    jwt.verify(emailToken, process.env.SECRET_TOKEN_KEY, (error, decoded) => {
      if (error) {
        res.redirect(`${process.env.CLIENT_DOMAIN}/expired-link`);
      } else {
        res.redirect(`${process.env.CLIENT_DOMAIN}/valid-link`);
      }
    });
  } catch (error) {
    return next(
      new Error(
        "Invalid link. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = validatePasswordResetLink;
