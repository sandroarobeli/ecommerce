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
    // Before deleting user, since deleting user deletes user's reviews as well
    const existingReviews = await prisma.review.findMany({
      where: {
        authorId: userId,
      },
    });

    await Promise.all(
      existingReviews.map(async (review) => {
        // Since there is no review, reviewRating should be zero
        // This way cumulative productReview will be most accurate
        await prisma.review.update({
          where: {
            id: review.id,
          },
          data: {
            reviewRating: 0,
          },
        });

        // Since review gets removed, number of reviews is reduced by one
        const productToUpdate = await prisma.product.update({
          where: {
            id: review.productId,
          },
          data: {
            numberOfReviews: {
              decrement: 1,
            },
          },
          include: {
            reviews: true,
          },
        });

        // If number of reviews is zero, cumulative rating is zero
        // This way we avoid division by zero
        const updatedRating =
          productToUpdate.numberOfReviews === 0
            ? 0
            : productToUpdate.reviews.reduce((a, c) => a + c.reviewRating, 0) /
              productToUpdate.numberOfReviews;

        // And we update properties of product based on available reviews
        await prisma.product.update({
          where: {
            id: productToUpdate.id,
          },
          data: {
            // This number HAS changed
            numberOfReviews: productToUpdate.numberOfReviews,
            // This one might have changed
            productRating: updatedRating,
          },
        });
      })
    );

    // Now that all the updates have been up to data, we delete user and all of their reviews
    await prisma.user.delete({
      where: { id: userId },
    });

    res.end();
  } catch (error) {
    return next(
      new Error(
        "Failed to delete. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = deleteAccount;
