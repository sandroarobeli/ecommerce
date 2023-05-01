const prisma = require("../../db");

// WHAT TO DO: IMPLEMENT REDUX. IMPLEMENT UI
// CHECK OUT APPLICATION AUTOMATICALLY RESTARTS
// https://expressjs.com/en/advanced/best-practice-performance.html
// CHECK OUT SERVING CLIENT AND SERVER OUT OF SAME DOMAIN FOR LATER (WHEN I DEPLOY)
// AS PER MULLER PLACES APP VIDEOS SHOW!!!

async function getAllProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.set("Cache-Control", "no-cache");
    res.status(200).json(products);
  } catch (error) {
    // return next(new Error("Failed to retrieve products"));
    return next(new Error(error.message)); // For testing
  }
}

module.exports = getAllProducts;
