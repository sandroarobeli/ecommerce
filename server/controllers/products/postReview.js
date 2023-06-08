const { validationResult } = require("express-validator");

const prisma = require("../../db");

async function postReview(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Review content cannot be empty"));
  }

  const { userId } = req.userData;
  const { productId } = req.params;
  const { content, rating } = req.body;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });

    if (!currentUser) {
      return next(new Error("Login required to leave a review"));
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: true,
      },
    });

    if (product) {
      const existingReview = product.reviews.find(
        (review) => review.authorId === userId
      );
      if (existingReview) {
        // If the review already exists, we update it
        const updatedReview = await prisma.review.update({
          where: {
            id: existingReview.id,
          },
          data: {
            authorName: currentUser.name,
            content: content,
            reviewRating: rating,
          },
        });
        // Replace existing review with updated review, even if nothing changed
        const indexToReplace = product.reviews.findIndex(
          (review) => review.id === existingReview.id
        );
        product.reviews.splice(indexToReplace, 1, updatedReview);

        const updatedRating =
          product.reviews.reduce((a, c) => a + c.reviewRating, 0) /
          product.reviews.length;

        // And we update properties of product based on existing Review
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            // This number HASN'T changed
            numberOfReviews: product.reviews.length,
            // This one might have changed
            productRating: updatedRating,
          },
        });

        res.end();
      } else {
        // Otherwise, since there is no review, we create it
        const newReview = await prisma.review.create({
          data: {
            content: content,
            reviewRating: rating,
            authorName: currentUser.name,
            author: {
              connect: {
                id: userId,
              },
            },
            product: {
              connect: {
                id: productId,
              },
            },
          },
        });

        const updatedReviews = [...product.reviews, newReview];
        const updatedRating =
          updatedReviews.reduce((a, c) => a + c.reviewRating, 0) /
          updatedReviews.length;

        // And we update properties of product based on new Review
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            // This number HAS changed
            numberOfReviews: updatedReviews.length,
            // This number might have changed
            productRating: updatedRating,
          },
        });
        res.end();
      }
    }
  } catch (error) {
    return next(new Error(`Failed to add your review: ${error.message}`));
  }
}

module.exports = postReview;
