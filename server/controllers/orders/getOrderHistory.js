const prisma = require("../../db");

async function getOrderHistory(req, res, next) {
  const { userId } = req.userData;

  try {
    const orders = await prisma.order.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.set("Cache-Control", "no-cache");

    res.status(200).json(orders);
  } catch (error) {
    return next(
      new Error(`Failed to load your order history: ${error.message}`)
    );
  }
}

module.exports = getOrderHistory;
