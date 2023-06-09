import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  selectUserStatus,
  selectUserName,
  selectUserAdmin,
  selectToken,
  logout,
} from "../redux/userSlice";
import { cartReset } from "../redux/cartSlice";

export default function UserDropdown() {
  const dispatch = useDispatch();
  const userStatus = useSelector(selectUserStatus);
  const userName = useSelector(selectUserName);
  const isAdmin = useSelector(selectUserAdmin);
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const closeOnEscapeKeyDown = (event) => {
    if ((event.charCode || event.keyCode) === 27) {
      setShowMenu(false);
    }
  };

  const closeOnOutsideClick = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    document.body.addEventListener("click", closeOnOutsideClick);
    return function cleanup() {
      document.body.addEventListener("keydown", closeOnEscapeKeyDown);
      document.body.addEventListener("click", closeOnOutsideClick);
    };
  }, []);

  const logoutHandler = async () => {
    // Reset cart content
    await dispatch(cartReset());
    // Sign out and return to login page
    await dispatch(logout());
    navigate("/");
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {userStatus === "loading" ? (
        "loading.."
      ) : token ? (
        <div className="relative">
          <button
            aria-label={`${token ? "Show menu" : "Login"}`}
            className="hover:scale-105 active:scale-100"
            onClick={() => setShowMenu((state) => !state)}
          >
            {userName}
          </button>
          <ul
            className={`${
              showMenu ? "scale-100 transition-all duration-300" : "scale-0"
            } absolute right-2 top-16 w-60 border rounded z-30 shadow-lg text-center text-black bg-white `}
          >
            <li>
              <Link
                to="/user-profile"
                className="dropdown-link"
                onClick={() => setShowMenu(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/order-history"
                className="dropdown-link"
                onClick={() => setShowMenu(false)}
              >
                Order History
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="dropdown-link"
                  onClick={() => setShowMenu(false)}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link href="#" className="dropdown-link" onClick={logoutHandler}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
