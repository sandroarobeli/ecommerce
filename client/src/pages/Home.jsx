import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPage, selectPage } from "../redux/pageSlice";
import { useGetAllProductsQuery } from "../redux/apiSlice";
import MessageDisplay from "../components/MessageDisplay";
import DynamicTitle from "../components/DynamicTitle";
import Spinner from "../components/Spinner";
import Carousel from "../components/Carousel";
import ProductItem from "../components/ProductItem";
import Pagination from "../components/Pagination";
// NOTE: FOLLOW BASSIR'S LESSONS FOR PAGE SEQUENCE TO STAY CONSISTENT
// 1. ALWAYS: !!!TEST LIGHTHOUSE ON EVERY PAGE COMPLETION!!!
// 2. !!!VERY IMPORTANT: MAKE SURE THE QUANTITIES OF PRODUCTS GET UPDATED ONCE
// A USER PLACES AN ORDER. THIS WAY, QUANTITIES ARE ALWAYS UP TO DATE!!! (AT PLACE ORDER MODULE)

// 3. SEARCH CONTROLLER TO SEARCH THROUGH ALL PRODUCTS, NOT JUST PER PAGE.

// NEXT: DECIDE ON NEXT MOVE (PLACE ORDER IS NEXT). LIGHTHOUSE. CLEAN UP THE CODE!!!
// ******************************************************************************
// ******************************************************************************
// SERVER: CHECK OUT APPLICATION AUTOMATICALLY RESTARTS.
// TEST BY CREATING UNCAUGHT EXCEPTION AND SEE IF IT RE STARTS AUTOMATICALLY!!!
// https://expressjs.com/en/advanced/best-practice-performance.html
// CHECK OUT SERVING CLIENT AND SERVER OUT OF SAME DOMAIN FOR LATER (WHEN I DEPLOY)
// AS PER MULLER PLACES APP VIDEOS SHOW!!!

// AT SOME POINT FIND GREAT PICS OF CLOTHING ON UNSPLASH, ADJUST SIZING FOR THIS APP AND
// ADD HERE. DELETE THESE OLD UGLY ONES

// AFTER THIS PROJECT, GET BACK TO C# PER THAT OTHER IRANIAN GUY'S VIDS I BOUGHT FROM UDEMY
export default function Home() {
  const dispatch = useDispatch();
  // The page and setPage need to be global, because Cart uses them as well and it can't have pagination
  const page = useSelector(selectPage);

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllProductsQuery(page);

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <DynamicTitle title="Home" />
      {isLoading && (
        <Spinner className="spinner" strokeColor="#FCD34D" strokeWidth="120" />
      )}
      {isError && (
        <MessageDisplay
          title="Error:"
          message={
            error?.data?.message ||
            "Unknown error has ocurred. Please try again later"
          }
          className="alert-error"
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
            toPrevPage={() => dispatch(setPage(page - 1))}
            toNextPage={() => dispatch(setPage(page + 1))}
          />
        </div>
      )}
    </>
  );
}
