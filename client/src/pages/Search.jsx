import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useGetProductFiltersQuery,
  useGetSearchResultsMutation,
} from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";
import ProductItem from "../components/ProductItem";
import MessageDisplay from "../components/MessageDisplay";
import Spinner from "../components/Spinner";

// Same as "take" in Prisma offset pagination
const PRODUCTS_PER_PAGE = 3;
const prices = [
  {
    name: "$1 - $50",
    value: "1-50",
  },
  {
    name: "$51 - $200",
    value: "51-200",
  },
  {
    name: "$201 - $1000",
    value: "201 - 1000",
  },
];
const productRatings = [
  {
    name: "1 star & up",
    value: 1,
  },
  {
    name: "2 stars & up",
    value: 2,
  },
  {
    name: "3 stars & up",
    value: 3,
  },
  {
    name: "4 stars & up",
    value: 4,
  },
  {
    name: "5 stars & up",
    value: 5,
  },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = Object.fromEntries([...searchParams]);

  // Sets initial properties for searchQuery in addition to query (typed in search bar)
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    productRating = "all",
    sort = "featured",
    page = 1,
  } = searchQuery;

  // Generates search based on hand typed query or select box option change
  const [
    getSearchResults,
    { data: searchResults, isLoading, isSuccess, isError, error },
  ] = useGetSearchResultsMutation();

  // Returns unique product properties for select boxes
  const { data: filters } = useGetProductFiltersQuery();

  // De-structures returned objects for convenience
  const products = searchResults?.products;
  const numberOfProducts = searchResults?.numberOfProducts;
  const pages = searchResults?.pages;
  const categories = filters?.categories;
  const brands = filters?.brands;

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Clears search bar on every page load
  useEffect(() => {
    const searchBar = document.getElementById("user-search-products");
    searchBar.value = "";
  }, [products]);

  // Every time searchQuery properties get changed, getSearchResults function gets invoked
  useEffect(() => {
    getSearchResults({
      query,
      category,
      brand,
      price,
      productRating,
      sort,
      page,
      limit: PRODUCTS_PER_PAGE,
    });
  }, [
    query,
    category,
    brand,
    price,
    productRating,
    sort,
    page,
    getSearchResults,
  ]);

  const searchFilter = ({
    category,
    brand,
    price,
    productRating,
    sort,
    page,
  }) => {
    const searchQuery = Object.fromEntries([...searchParams]);
    // In case of category, once it changes, hand written query re sets to
    // Empty string to avoid conflict. e.g. "shirts" and "pants" don't ever overlap
    if (category)
      setSearchParams({ ...searchQuery, query: "", category: category });
    // In case of brand, once it changes, hand written query re sets to
    // Empty string to avoid conflict. e.g. "Polo" and "Gucci" don't ever overlap
    if (brand) setSearchParams({ ...searchQuery, query: "", brand: brand });
    if (price) setSearchParams({ ...searchQuery, price });
    if (productRating) setSearchParams({ ...searchQuery, productRating });
    if (sort) setSearchParams({ ...searchQuery, sort });
    if (page) setSearchParams({ ...searchQuery, page });
  };

  // Change searchQuery properties every time we change select drop box value
  const categoryHandler = (event) => {
    searchFilter({ category: event.target.value });
  };

  const brandHandler = (event) => {
    searchFilter({ brand: event.target.value });
  };

  const priceHandler = (event) => {
    searchFilter({ price: event.target.value });
  };

  const ratingHandler = (event) => {
    searchFilter({ productRating: event.target.value });
  };

  const sortHandler = (event) => {
    searchFilter({ sort: event.target.value });
  };

  const pageHandler = (page) => {
    searchFilter({ page: page });
  };

  return (
    <>
      <DynamicTitle title="Search" />
      {isLoading && (
        <Spinner className="spinner" strokeColor="#FCD34D" strokeWidth="120" />
      )}
      {isError && (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Products cannot be displayed. Please try again later"
          }
          className="alert-error"
        />
      )}
      {isSuccess && (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div>
            <div className="my-3">
              <h2>Categories</h2>
              <select
                className="custom-select w-full focus:ring ring-indigo-300"
                value={category}
                onChange={categoryHandler}
              >
                <option value="all">All</option>
                {categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-3">
              <h2>Brands</h2>
              <select
                className="custom-select w-full focus:ring ring-indigo-300"
                value={brand}
                onChange={brandHandler}
              >
                <option value="all">All</option>
                {brands?.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-3">
              <h2>Prices</h2>
              <select
                className="custom-select w-full focus:ring ring-indigo-300"
                value={price}
                onChange={priceHandler}
              >
                <option value="all">All</option>
                {prices.map((price) => (
                  <option key={price.name} value={price.value}>
                    {price.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-3">
              <h2>Ratings</h2>
              <select
                className="custom-select w-full focus:ring ring-indigo-300"
                value={productRating}
                onChange={ratingHandler}
              >
                <option value="all">All</option>
                {productRatings.map((rating) => (
                  <option key={rating.name} value={rating.value}>
                    {rating.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="mb-2 flex flex-col justify-between md:flex-row md:items-center md:justify-between border-b-2 pb-2">
              <div
                className={`mb-2 md:mb-0 flex items-center text-lg ${
                  isLoading ? "animate-pulse text-blue-800" : ""
                }`}
              >
                {isLoading
                  ? "Searching..."
                  : `Results found: ${numberOfProducts}`}
              </div>

              <div>
                Sort by{" "}
                <select
                  className="custom-select w-full focus:ring ring-indigo-300"
                  value={sort}
                  onChange={sortHandler}
                >
                  <option value="featured">Featured</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="toprated">Top Rated</option>
                  <option value="newest">Latest Arrivals</option>
                </select>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
                {products?.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
              <ul className="flex flex-wrap mt-4">
                {numberOfProducts > 0 &&
                  [...Array(pages).keys()].map((pageNumber) => (
                    <li key={pageNumber}>
                      <button
                        aria-label="Navigate through search result pages"
                        className={`m-2 ${
                          Number(page) === pageNumber + 1
                            ? "primary-button"
                            : "outline-button"
                        }`}
                        onClick={() => pageHandler(pageNumber + 1)}
                      >
                        {pageNumber + 1}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
