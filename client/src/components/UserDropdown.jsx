import { Link } from "react-router-dom";

export default function UserDropdown() {
  return (
    <div className="dropdown dropdown-end ml-2 sm:ml-4">
      <label
        tabIndex={0}
        className="btn bg-black hover:bg-black hover:scale-125"
      >
        Katie
      </label>
      <ul
        tabIndex={0}
        className="menu menu-vertical dropdown-content mt-3 p-2 shadow w-56"
      >
        <li>
          <Link to="/profile" className="text-lg hover:scale-105">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/order-history" className="text-lg hover:scale-105">
            Order History
          </Link>
        </li>
        <li>
          <Link href="#" className="text-lg hover:scale-105" onClick="">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
