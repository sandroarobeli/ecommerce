const prisma = require("../../db");

async function searchProducts(req, res, next) {
  const { query, category, brand, price, productRating, sort, page, limit } =
    req.body;

  // Presets sorting order
  let orderBy;
  if (sort === "lowest") orderBy = { price: "asc" };
  else if (sort === "highest") orderBy = { price: "desc" };
  else if (sort === "toprated") orderBy = { productRating: "desc" };
  else orderBy = { createdAt: "desc" };

  try {
    // Retrieves actual batches of matched products
    const products = await prisma.product.findMany({
      skip: limit * (page - 1),
      take: limit,
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            brand: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        AND: [
          {
            category: {
              contains: category === "all" ? "" : category,
              mode: "insensitive",
            },
          },
          {
            brand: {
              contains: brand === "all" ? "" : brand,
              mode: "insensitive",
            },
          },
          {
            price: {
              gte: price === "all" ? 0 : Number(price.split("-")[0]),
              lte: price === "all" ? 999999 : Number(price.split("-")[1]),
            },
          },
          {
            productRating: {
              gte: productRating === "all" ? 0 : Number(productRating),
            },
          },
        ],
      },
      orderBy: orderBy,
    });
    // Retrieves total number of matched products for pagination
    const numberOfProducts = await prisma.product.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            brand: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        AND: [
          {
            category: {
              contains: category === "all" ? "" : category,
              mode: "insensitive",
            },
          },
          {
            brand: {
              contains: brand === "all" ? "" : brand,
              mode: "insensitive",
            },
          },
          {
            price: {
              gte: price === "all" ? 0 : Number(price.split("-")[0]),
              lte: price === "all" ? 999999 : Number(price.split("-")[1]),
            },
          },
          {
            productRating: {
              gte: productRating === "all" ? 0 : Number(productRating),
            },
          },
        ],
      },
    });

    // Determines how many page buttons to show (Has to be Integer)
    const pages = Math.ceil(numberOfProducts / limit);
    res.set("Cache-Control", "no-cache");

    res.status(200).json({ products, numberOfProducts, pages });
  } catch (error) {
    return next(
      new Error(
        "Failed to retrieve products. Check the internet connection or try again later"
      )
    );
  }
}

module.exports = searchProducts;
