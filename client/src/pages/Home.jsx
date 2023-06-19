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
// 3. SEARCH CONTROLLER TO SEARCH THROUGH ALL PRODUCTS, NOT JUST PER PAGE.
// 4. MAKE SURE MONGO ATLAS SETTINGS ONLY ALLOW ACCESS TO lazikadigital.com
// AS OPPOSED TO ANY '0.0.0.0' DOMAIN NOW (KEEP BOTH TILL FULLY TESTED)
// 5. DON'T FORGET THE CONTACT-US FORM . NOTE: RELATED TO ITEM 10!
// 6. REPLACE PUBLIC/HOME-SCREEN WITH THE SCREEN SHOT OF CURRENT VERSION
// WHEN I ADD UNSPLASH PROFESSIONAL PHOTOS
// 7. ON CONTROLLERS, 500 MAKE CODE ERROR HARD CODED LIKE IN LOGIN CONTROLLER
// WHEN ALL THE CONTROLLERS ARE COMPLETED AND TESTED
// 8. MAKE EMAIL-CONFIRMATION ETC. PAGES NICER, LIKE ADDING A LOGO ETC.
// 9. CREATE A FEW USER1, USER2 USERS AND HAVE THEM BUY SOME ORDERS FOR 2022
// THEN DELETE THOSE USERS SO I HAVE SOME FUNCTIONALITY TO SHOW.
// FINALLY, DELETE ALEX AND KATIE AND LILLY AND CHANGE THEM TO ADMIN,
// USER1, USER2 ETC..
// 10. VERY IMPORTANT: ADD MESSAGES TO ADMIN NAV => CONNECTS TO MESSAGES USERS SEND VIA
// CONTACT FORM. MESSAGES HAVE INPUTS: NAME, EMAIL, CONTENT. THE GO TO DB AND ARE AVAILABLE
// VIA MESSAGES LINK FOR ADMIN. USE SOME KINDA STATE CHANGE FOR WHEN ADMIN READS THEM
// FOR THE FIRST TIME THEY BECOME FONT-REGULAR AS OPPOSED TO FONT-BOLD.
// THE ARE ORGANIZED AS IN TABLE WITH HEADERS: DATE USER. CLICKING ON THE ROW
// TAKES ADMIN TO ACTUAL MESSAGE PAGE (USING PARAMS:MESSAGE-ID) WHICH ALSO
// ALLOWS DELETING THE MESSAGE AND REPLYING TO SENDER VIA SENDGRID!!!
// 11. WHEN DOING NEUTRAL USERS, ADD SOME RATINGS AND COMMENTS AS WELL
// 14. KATIE DELETES HERSELF, LILLY IS DELETED BY ME FOR TESTING.
// 15. AS USER PAYS FOR THE ORDER, SEND EMAIL CONFIRMATION (much like order-confirmation) WITH RECEIPT
// AND ORDER INFO + SHIPPING ADDRESS

// NEXT: (ADMIN USERS...IS NEXT). LIGHTHOUSE. CLEAN UP THE CODE!!!
// ******************************************************************************
// ******************************************************************************
// SERVER: CHECK OUT APPLICATION AUTOMATICALLY RESTARTS.
// TEST BY CREATING UNCAUGHT EXCEPTION AND SEE IF IT RE STARTS AUTOMATICALLY!!!
// https://expressjs.com/en/advanced/best-practice-performance.html
// CHECK OUT SERVING CLIENT AND SERVER OUT OF SAME DOMAIN FOR LATER (WHEN I DEPLOY)
// AS PER MULLER PLACES APP VIDEOS SHOW!!!

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
  } = useGetAllProductsQuery({ page });

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
