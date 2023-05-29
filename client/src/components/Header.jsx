import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { selectAllItems } from "../redux/cartSlice";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";
import UserDropdown from "./UserDropdown";
import Modal from "./Modal";

export default function Header() {
  const navigate = useNavigate();
  const allItems = useSelector(selectAllItems);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  // Initialize the state so the server side delay doesn't cause mismatch in hydration
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(allItems.reduce((a, c) => a + c.quantity, 0));
  }, [allItems]);

  const submitHandler = (event) => {
    event.preventDefault();
    navigate(`/search?query=${query} `);
    if (modalOpen) {
      setModalOpen(false);
    }
  };

  return (
    <header className="p-4 text-md sm:text-xl text-white bg-black font-oswald">
      <nav className="flex justify-between items-center">
        <Link to="/" className="font-bold text-white">
          e-commerce
        </Link>
        {/* SEARCH BAR BEGIN */}
        <form onSubmit={submitHandler} className="mx-auto">
          <div className="sm:hidden">
            <button
              aria-label="Display search modal"
              type="button"
              className="rounded py-1 px-2 bg-amber-300 hover:bg-amber-400 active:bg-amber-500 text-sm dark:text-black"
              onClick={() => setModalOpen(true)}
            >
              <SearchIcon />
            </button>
          </div>
          <div className="hidden sm:flex sm:justify-center">
            <input
              type="text"
              id="search"
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-tr-none rounded-br-none p-1 text-lg text-black focus:ring-0"
              placeholder="Search products.."
            />
            <button
              type="submit"
              id="button-addon"
              aria-label="submit search query"
              className="rounded rounded-tl-none rounded-bl-none py-1 px-2 bg-amber-300 hover:bg-amber-400 active:bg-amber-500 text-lg text-black"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {/* SEARCH BAR END */}
        <div className="flex justify-between">
          <Link to="/cart" className="mr-8" aria-label="Link to cart page">
            <CartIcon cartItemsCount={cartItemsCount} />
          </Link>
          <UserDropdown />
        </div>
      </nav>
      <Modal
        title="Search Products"
        titleColor="text-black"
        description="Enter a name, brand or category"
        twoButtons={true}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitHandler}
        clearMessage={() => {
          console.log("Used only with one button version");
          setModalOpen(false);
        }}
      >
        <input
          type="text"
          id="search-modal"
          onChange={(event) => setQuery(event.target.value)}
          className="w-full mt-1 mb-2 text-lg text-black focus:ring-0"
          placeholder="Start here"
        />
      </Modal>
    </header>
  );
}
