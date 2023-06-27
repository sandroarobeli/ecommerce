const prisma = require("../../db");
const generateEmail = require("../../utils/generateEmail");

async function updatePaidStatus(req, res, next) {
  const { orderId } = req.params;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return next(new Error("Order could not be found"));
    }
    if (existingOrder.isPaid) {
      return next(new Error("Order is already paid!"));
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          paypalId: req.body.id,
          status: req.body.status,
          email_address: req.body.payer.email_address,
        },
      },
    });

    // Since the payment has been made, Adjust current quantities of products in DB
    // Updates all at once concurrently
    await Promise.all(
      existingOrder.orderItems.map(
        async (item) =>
          await prisma.product.update({
            where: { slug: item.slug },
            data: {
              inStock: {
                decrement: item.quantity,
              },
            },
          })
      )
    );

    // Prepare the data to be passed into email function api for dynamic templates
    const templateData = {
      timeStamp: new Date().toLocaleString(),
      dateFormat: "MMMM DD, YYYY h:mm:ss A",
      orderItems: existingOrder.orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity.toString(),
        price: item.price.toFixed(2),
        total: (item.quantity * item.price).toFixed(2),
      })),
      shippingAddress: existingOrder.shippingAddress,
      itemsTotal: existingOrder.itemsTotal.toFixed(2),
      taxTotal: existingOrder.taxTotal.toFixed(2),
      shippingTotal: existingOrder.taxTotal.toFixed(2),
      grandTotal: existingOrder.grandTotal.toFixed(2),
    };

    // Invoke purchase receipt generating function with order user just paid for
    await generateEmail(
      req.body.payer.email_address,
      "Purchase receipt for order number: " + existingOrder.id,
      templateData,
      "d-3219bae17677438fa265ffcbbddbd8af"
    );

    res.end();
  } catch (error) {
    return next(new Error(`Failed to update order status: ${error.message}`));
  }
}

module.exports = updatePaidStatus;
