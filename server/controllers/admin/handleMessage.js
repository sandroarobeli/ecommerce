const prisma = require("../../db");

async function handleMessage(req, res, next) {
  const { userId } = req.userData;
  const { messageId } = req.params;

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

    if (req.method === "GET") {
      const message = await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          hasBeenRead: true,
        },
      });
      res.set("Cache-Control", "private");

      res.status(200).json(message);
    } else if (req.method === "DELETE") {
      await prisma.message.delete({
        where: {
          id: messageId,
        },
      });

      res.end();
    }
  } catch (error) {
    return next(new Error(`Unable to execute: ${error.message}`));
  }
}

module.exports = handleMessage;
