import { FaPlane, FaHotel, FaGlobe, FaList } from "react-icons/fa";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import styles from "./Dashboard.module.css";
import AddFlights from "../AddFlights/AddFlights";
import AddHotels from "../AddHotels/AddHotels";
import AddAirlines from "../AddAirLine/AddAirlines";
import ViewFlights from "../ViewFlights/ViewFlights";
import ViewHotels from "../ViewHotels/ViewHotels";

export default function Dashboard() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <ul className={styles.sidebarMenu}>
          <li>
            <Link
              to="/dashboard/add-flights"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/add-flights" ? styles.active : ""}`}
            >
              <FaPlane className={styles.sidebarIcon} /> Add Flights
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/add-hotels"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/add-hotels" ? styles.active : ""}`}
            >
              <FaHotel className={styles.sidebarIcon} /> Add Hotels
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/add-airlines"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/add-airlines" ? styles.active : ""}`}
            >
              <FaGlobe className={styles.sidebarIcon} /> Add Airlines
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/view-flights"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/view-flights" ? styles.active : ""}`}
            >
              <FaList className={styles.sidebarIcon} /> View Flights
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/view-hotels"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/view-hotels" ? styles.active : ""}`}
            >
              <FaList className={styles.sidebarIcon} /> View Hotels
            </Link>
          </li>
       
        </ul>
      </nav>

      <main className={styles.mainContent}>
        <Routes>
          <Route index element={<ViewFlights />} />
          <Route path="add-flights" element={<AddFlights />} />
          <Route path="add-hotels" element={<AddHotels />} />
          <Route path="add-airlines" element={<AddAirlines />} />
          <Route path="view-flights" element={<ViewFlights />} />
          <Route path="view-hotels" element={<ViewHotels />} />
          <Route
            path="*"
            element={
              <div className={styles.noData}>
                <h1>404 - Page Not Found</h1>
                <Link to="/dashboard/view-flights">Go to View Flights</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}