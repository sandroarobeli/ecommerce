import { Link } from "react-router-dom";

export default function AdminNav({ pathname }) {
  return (
    <div className="font-oswald">
      <ul>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/dashboard"
            className={`text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/dashboard" ? "font-bold" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/orders"
            className={`mb-6 text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/orders" ? "font-bold" : ""
            }`}
          >
            Orders
          </Link>
        </li>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/products"
            className={`text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/products" ? "font-bold" : ""
            }`}
          >
            Products
          </Link>
        </li>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/new-product"
            className={`text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/new-product" ? "font-bold" : ""
            }`}
          >
            New product
          </Link>
        </li>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/users"
            className={`text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/users" ? "font-bold" : ""
            }`}
          >
            Users
          </Link>
        </li>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/tax-and-shipping"
            className={`text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/tax-and-shipping" ? "font-bold" : ""
            }`}
          >
            Tax & Shipping
          </Link>
        </li>
        <li className="mb-2 text-lg">
          <Link
            to="/admin/messages"
            className={`text-blue-800 hover:text-blue-900 ${
              pathname === "/admin/messages" ? "font-bold" : ""
            }`}
          >
            Messages
          </Link>
        </li>
      </ul>
    </div>
  );
}
