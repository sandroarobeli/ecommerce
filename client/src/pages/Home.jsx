import { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "../redux/apiSlice";
import MessageDisplay from "../components/MessageDisplay";
import DynamicTitle from "../components/DynamicTitle";
import Spinner from "../components/Spinner";
import Carousel from "../components/Carousel";
import ProductItem from "../components/ProductItem";
import Pagination from "../components/Pagination";

// NOTE: FOLLOW BASSIR'S LESSONS FOR PAGE SEQUENCE TO STAY CONSISTENT
// ALWAYS: !!!TEST LIGHTHOUSE ON EVERY PAGE COMPLETION!!!

// FOR LATER:

// ******************************************************************************
// ******************************************************************************
// SERVER: CHECK OUT APPLICATION AUTOMATICALLY RESTARTS.
// TEST BY CREATING UNCAUGHT EXCEPTION AND SEE IF IT RE STARTS AUTOMATICALLY!!!
// https://expressjs.com/en/advanced/best-practice-performance.html
// CHECK OUT SERVING CLIENT AND SERVER OUT OF SAME DOMAIN FOR LATER (WHEN I DEPLOY)
// AS PER MULLER PLACES APP VIDEOS SHOW!!!

// AT SOME POINT FIND GREAT PICS OF CLOTHING ON UNSPLASH, ADJUST SIZING FOR THIS APP AND
// ADD HERE. DELETE THESE OLD UGLY ONES

export default function Home() {
  const [page, setPage] = useState(1);
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllProductsQuery(page);

  // Auto scrolls to the top on page change
  useEffect(() => {
    const body = document.querySelector("#root");

    body.scrollIntoView(
      {
        behavior: "smooth",
      },
      5000
    );
  }, [page]);

  return (
    <>
      <DynamicTitle title="Home" />
      {isLoading && <Spinner />}
      {isError && (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Unknown error has ocurred. Please try again later"
          }
          className="bg-red-100 text-red-800"
        />
      )}
      {isSuccess && (
        <div className="flex flex-col justify-between min-h-screen font-roboto">
          <Carousel products={products} />
          <h2 className="mb-4 text-lg font-semibold">
            {products?.length === 0
              ? "For products, navigate to previous pages"
              : "Latest Products"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products?.map((product) => (
              <ProductItem key={product.slug} product={product} />
            ))}
          </div>
          <Pagination
            toPrevPage={() => setPage((prevPage) => prevPage - 1)}
            toNextPage={() => setPage((prevPage) => prevPage + 1)}
          />
        </div>
      )}
    </>
  );
}
