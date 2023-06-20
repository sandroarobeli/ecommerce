const prisma = require("../../db");

async function getProductFilters(req, res, next) {
  try {
    const categories = await prisma.product.findMany({
      where: {},
      distinct: ["category"],
      select: {
        category: true,
      },
    });
    const brands = await prisma.product.findMany({
      where: {},
      distinct: ["brand"],
      select: {
        brand: true,
      },
    });
    res.set("Cache-Control", "no-cache");

    res.status(200).json({
      categories: categories.map((category) => category.category),
      brands: brands.map((brand) => brand.brand),
    });
  } catch (error) {
    return next(new Error(`Failed to retrieve properties: ${error.message}`));
  }
}

module.exports = getProductFilters;
