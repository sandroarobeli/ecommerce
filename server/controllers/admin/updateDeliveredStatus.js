const prisma = require("../../db");

async function updateDeliveredStatus(req, res, next) {
  const { userId } = req.userData;
  const { orderId } = req.params;

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
          "You are not authorized to perform this action. Admin privileges required"
        )
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });
    res.end();
  } catch (error) {
    return next(
      new Error(
        "Failed to update delivery status. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = updateDeliveredStatus;
