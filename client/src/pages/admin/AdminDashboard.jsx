import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { selectToken } from "../../redux/userSlice";
import { useGetAdminSummaryQuery } from "../../redux/apiSlice";
import AdminNav from "../../components/AdminNav";
import DynamicTitle from "../../components/DynamicTitle";
import MessageDisplay from "../../components/MessageDisplay";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function AdminDashboard() {
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [filteredData, setFilteredData] = useState([]);

  // Sums up sales totals per year
  const annualizedSales = useMemo(
    () => filteredData?.reduce((a, c) => a + c.itemsTotal, 0).toLocaleString(),
    [filteredData]
  );

  // Sums up total number of orders per year
  const annualizedOrders = useMemo(
    () => filteredData?.reduce((a, c) => a + c.ordersPerYear, 0),
    [filteredData]
  );

  const {
    data: summary,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAdminSummaryQuery({ token });

  // Auto scrolls to the top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filters summary.chartingData for the default (current) year on page load.
  // And re filters on every year change. In addition data gets sorted
  useEffect(() => {
    const filterSalesByYear = (year) => {
      setFilteredData(
        summary?.chartingData
          .filter((el) => el._id.substring(3) === year)
          .sort((a, b) => a._id.substring(0, 2) - b._id.substring(0, 2))
      );
    };
    filterSalesByYear(year);
  }, [summary, year]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Admin dashboard" />
      <AdminNav pathname={pathname} />
      <div className="md:col-span-3">
        <h1 className="mb-4 text-xl">Admin Dashboard</h1>
        {isLoading && (
          <p className="text-lg animate-pulse text-blue-800">
            Generating report...
          </p>
        )}
        {isError && (
          <MessageDisplay
            title="Error:"
            message={
              error?.data?.message ||
              "Summary cannot be displayed. Check the internet connection or try again later"
            }
            className="alert-error"
          />
        )}
        {isSuccess && (
          <div className="font-roboto">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="card m-5 p-5">
                <p className="text-3xl">${annualizedSales}</p>
                <p>Annual Sales</p>
                <Link
                  to="/admin/orders"
                  className="text-blue-800 hover:text-blue-900"
                >
                  View sales
                </Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{annualizedOrders}</p>
                <p>Annual Orders</p>
                <Link
                  to="/admin/orders"
                  className="text-blue-800 hover:text-blue-900"
                >
                  View orders
                </Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.productsCount}</p>
                <p>Products</p>
                <Link
                  to="/admin/products"
                  className="text-blue-800 hover:text-blue-900"
                >
                  View products
                </Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.usersCount}</p>
                <p>Users</p>
                <Link
                  to="/admin/users"
                  className="text-blue-800 hover:text-blue-900"
                >
                  View users
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <h2 className="text-xl">Sales Report</h2>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="custom-select focus:ring ring-indigo-300 mx-4"
              >
                {["2022", "2023", "2024", "2025", "2026", "2027"].map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
            <Bar
              options={{
                legend: {
                  display: true,
                  position: "right",
                },
              }}
              data={{
                labels: filteredData?.map((entry) => entry._id),
                datasets: [
                  {
                    label:
                      filteredData?.length > 0
                        ? "Sales"
                        : "No Data available for this year",
                    backgroundColor: "rgba(162, 222, 208, 1)",
                    data: filteredData?.map((entry) => entry.itemsTotal),
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
