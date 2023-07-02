const prisma = require("../../db");

async function getProductBySlug(req, res, next) {
  const { slug } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        reviews: true,
      },
    });
    if (!product) {
      return next(new Error("This product could not be found"));
    }
    res.set("Cache-Control", "no-cache");

    res.status(200).json(product);
  } catch (error) {
    return next(
      new Error(
        "Failed to retrieve the product. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = getProductBySlug;
