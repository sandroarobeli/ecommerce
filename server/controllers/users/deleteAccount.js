const { validationResult } = require("express-validator");
require("dotenv").config();

const prisma = require("../../db");

async function deleteAccount(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { userId } = req.params;
  const { email } = req.body;

  try {
    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (loggedInUser.email !== email) {
      return next(
        new Error(
          "You are not authorized to delete this account. Please enter a valid email associated with this account and try again."
        )
      );
    }

    // Update overall combined product rating and number of reviews
    // Since deleting user deletes user's reviews as well
    const existingReviews = await prisma.review.findMany({
      where: {
        authorId: userId,
      },
    });

    // Placing delete user call before existingProduct update call
    // Provides most up to date reviews' length for each product
    await prisma.user.delete({
      where: { id: userId },
    });

    await Promise.all(
      existingReviews.map(async (review) => {
        const productToUpdate = await prisma.product.findUnique({
          where: {
            id: review.productId,
          },
          include: {
            reviews: true,
          },
        });

        const updatedRating =
          productToUpdate.reviews.reduce((a, c) => a + c.reviewRating, 0) /
          productToUpdate.reviews.length;

        // And we update properties of product based on available reviews
        await prisma.product.update({
          where: {
            id: productToUpdate.id,
          },
          data: {
            // This number HAS changed
            numberOfReviews: productToUpdate.reviews.length,
            // This one might have changed
            productRating: updatedRating,
          },
        });
      })
    );

    res.end();
  } catch (error) {
    return next(new Error(`Failed to delete: ${error.message}`));
  }
}

module.exports = deleteAccount;
