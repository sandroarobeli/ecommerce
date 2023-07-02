const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = require("../../db");

async function updateProfile(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data")); // 422
  }

  const { userId } = req.userData;
  const { name, email, password } = req.body;

  try {
    const anotherUser = await prisma.user.findUnique({
      where: { email: email },
    });
    // If another User has the same email as current User's new email
    if (anotherUser?.id !== userId && anotherUser?.email === email) {
      return next(
        new Error("This email already exists. Please choose another email")
      );
    } else {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          email: email,
          password: bcrypt.hashSync(password),
        },
      });

      // Updating user and thus userName automatically updates authorName in existing reviews
      await prisma.review.updateMany({
        where: {
          authorId: updatedUser.id,
        },
        data: {
          authorName: updatedUser.name,
        },
      });
      res.set("Cache-Control", "private");

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    return next(
      new Error(
        "Failed to update. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = updateProfile;
