const prisma = require("../../db");

async function updateUserStatus(req, res, next) {
  const { userId } = req.userData;
  const { updatedUserId } = req.params;
  const { isAdmin } = req.body;

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
    await prisma.user.update({
      where: { id: updatedUserId },
      data: {
        isAdmin: isAdmin,
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

module.exports = updateUserStatus;
