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
// REMEMBER: ID QUERY ==> USE MESSAGE DISPLAY, IF MUTATION ==> USE MODAL
// IF BOTH ==> USE BOTH (AS A GENERAL RULE)

// NOTE: FOLLOW BASSIR'S LESSONS FOR PAGE SEQUENCE TO STAY CONSISTENT
// 1. ALWAYS: !!!TEST LIGHTHOUSE ON EVERY PAGE COMPLETION!!!
// 2. WHEN UPDATING A PRODUCT, MAKE SURE YOU INCREMENT THE QUANTITIES,
// WHEN ADDING A NEW ORDER, QUANTITY SELECTION MUST BE AS A SEPARATE FIELD
// 3. SEARCH CONTROLLER TO SEARCH THROUGH ALL PRODUCTS, NOT JUST PER PAGE.
// 4. MAKE SURE MONGO ATLAS SETTINGS ONLY ALLOW ACCESS TO lazikadigital.com
// AS OPPOSED TO ANY '0.0.0.0' DOMAIN NOW
// 5. DON'T FORGET THE CONTACT-US FORM
// 6. REPLACE PUBLIC/HOME-SCREEN WITH THE SCREEN SHOT OF CURRENT VERSION
// WHEN I ADD UNSPLASH PROFESSIONAL PHOTOS

// NEXT: (ADMIN DASHBOARD...IS NEXT). LIGHTHOUSE. CLEAN UP THE CODE!!!
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
