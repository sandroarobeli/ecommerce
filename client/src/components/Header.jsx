import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "./icons/Logo";
import CartIcon from "./icons/CartIcon";
import UserDropdown from "./UserDropdown";
import SearchBar from "./SearchBar";

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    navigate(`/search?query=${query} `);
  };

  return (
    <div className="navbar flex justify-between items-center bg-black px-4 font-oswald">
      <div className="hidden sm:flex sm:justify-around">
        <Logo />
        <Link to="/" className="ml-4 font-bold text-white text-2xl">
          e-commerce
        </Link>
      </div>

      <SearchBar
        onSubmit={submitHandler}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="flex-none">
        <CartIcon />

        <UserDropdown />
      </div>
    </div>
  );
}
