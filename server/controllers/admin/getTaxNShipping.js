const prisma = require("../../db");

async function getTaxNShipping(req, res, next) {
  try {
    const taxNShipping = await prisma.taxNShipping.findUnique({
      where: {
        id: "649b51c4c04719835278f9db",
      },
    });
    if (!taxNShipping) {
      return next(
        new Error(
          "Unable to retrieve current tax rates. Please try again later"
        )
      );
    }
    res.set("Cache-Control", "no-cache");

    res.status(200).json({
      taxRate: taxNShipping.taxRate,
      shippingRate: taxNShipping.shippingRate,
    });
  } catch (error) {
    return next(new Error(`Failed to retrieve rates: ${error.message}`));
  }
}

module.exports = getTaxNShipping;
