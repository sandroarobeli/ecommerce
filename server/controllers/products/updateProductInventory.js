const prisma = require("../../db");

async function updateProductInventory(req, res, next) {
  const { purchasedItems } = req.body;

  try {
    await Promise.all(
      purchasedItems.map(
        async (item) =>
          await prisma.product.update({
            where: { id: item.id },
            data: {
              inStock: {
                decrement: item.quantity,
              },
            },
          })
      )
    );

    res.end();
  } catch (error) {
    return next(new Error(`Failed to update inventory: ${error.message}`));
  }
}

module.exports = updateProductInventory;
