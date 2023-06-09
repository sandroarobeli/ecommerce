const prisma = require("../../db");

async function getOrders(req, res, next) {
  const { userId } = req.userData;

  try {
    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!loggedInUser || loggedInUser.isAdmin === false) {
      return next(new Error("Access denied. Admin privileges required."));
    }

    const orders = await prisma.order.findMany({
      // Populates owner
      include: {
        owner: true,
        owner: {
          // Only returns the name field
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.set("Cache-Control", "private");

    res.status(200).json(orders);
  } catch (error) {
    return next(new Error(`Failed to load order history: ${error.message}`));
  }
}

module.exports = getOrders;
