const prisma = require("../../db");

async function getAllProducts(req, res, next) {
  const { page } = req.params;

  try {
    if (page < 1) return;
    const products = await prisma.product.findMany({
      skip: 12 * (page - 1),
      take: 12,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.set("Cache-Control", "no-cache");

    res.status(200).json(products);
  } catch (error) {
    return next(new Error("Failed to retrieve products"));
  }
}

module.exports = getAllProducts;
