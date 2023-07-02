const prisma = require("../../db");

async function getOrderById(req, res, next) {
  const { orderId } = req.params;
  const { userId } = req.userData;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isAdmin: true,
      },
    });

    if (!existingOrder) {
      return next(new Error("Order could not be found"));
    }
    // If logged in user tries to look up someone else's order..
    // e.g. userId from userData from token does not match
    // order creator's id. Unless that logged in user is Admin
    if (existingOrder.ownerId !== userId && !currentUser.isAdmin) {
      return next(new Error("You are not authorized to view this page"));
    }
    res.set("Cache-Control", "private");

    res.status(200).json(existingOrder);
  } catch (error) {
    return next(
      new Error(
        "Failed to retrieve the order. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = getOrderById;
