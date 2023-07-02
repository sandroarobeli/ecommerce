const { validationResult } = require("express-validator");

const prisma = require("../../db");

async function updateTaxNShipping(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { userId } = req.userData;
  const { taxRate, shippingRate } = req.body;

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

    await prisma.taxNShipping.update({
      where: {
        id: "649b51c4c04719835278f9db",
      },
      data: {
        taxRate: taxRate,
        shippingRate: shippingRate,
      },
    });

    res.end();
  } catch (error) {
    return next(
      new Error(
        "Failed to update. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = updateTaxNShipping;
