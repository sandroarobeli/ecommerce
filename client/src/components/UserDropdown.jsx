import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useGetAllMessagesQuery } from "../redux/apiSlice";
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

  const { data: messages } = useGetAllMessagesQuery({ token });

  // Reduces the numbers of unread messages to display in the badge for admin
  const messageCount = useMemo(
    () => messages?.filter((message) => message.hasBeenRead === false).length,
    [messages]
  );

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
            {messageCount > 0 && isAdmin && (
              <span className="absolute -top-3 -right-3 inline-block min-w-2 m-auto py-1 px-2 rounded-full text-xs align-middle bg-red-600">
                {messageCount}
              </span>
            )}
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
