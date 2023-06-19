const prisma = require("../../db");

async function deleteUser(req, res, next) {
  const { userId } = req.userData;
  const { deletedUserId } = req.params;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });
    const deletedUser = await prisma.user.findUnique({
      where: {
        id: deletedUserId,
      },
      select: {
        isAdmin: true,
      },
    });
    // Ensures logged in user has Admin privileges
    if (!currentUser || !deletedUser || !currentUser.isAdmin) {
      return next(
        new Error(
          "You are not authorized to perform this function. Admin privileges required"
        )
      );
    }
    // Ensures Admin user cannot be deleted
    if (deletedUser.isAdmin) {
      return next(new Error("Deleting Admin is not permitted!"));
    }

    // Update overall combined product rating and number of reviews
    // Before deleting user, since deleting user deletes user's reviews as well
    const existingReviews = await prisma.review.findMany({
      where: {
        authorId: deletedUserId,
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
      where: { id: deletedUserId },
    });

    res.end();
  } catch (error) {
    return next(new Error(`Failed to delete user: ${error.message}`));
  }
}

module.exports = deleteUser;
