import { FaPlane, FaHotel, FaGlobe, FaList } from "react-icons/fa";
import { Link, useLocation, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";


export default function Dashboard() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <ul className={styles.sidebarMenu}>
          <li>
            <Link
              to="/dashboard/overview"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/overview" ? styles.active : ""}`}
            >
              <FaPlane className={styles.sidebarIcon} /> Overview
            </Link>
          </li>
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
              <FaGlobe className={styles.sidebarIcon} />Airlines
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
          <li>
            <Link
              to="/dashboard/users"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/users" ? styles.active : ""}`}
            >
              <FaList className={styles.sidebarIcon} />Users
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/usersbookedflights"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/usersbookedflights" ? styles.active : ""}`}
            >
              <FaList className={styles.sidebarIcon} />Booked FLights
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/usersbookedhotels"
              className={`${styles.sidebarLink} ${location.pathname === "/dashboard/usersbookedhotels" ? styles.active : ""}`}
            >
              <FaList className={styles.sidebarIcon} />Booked Hotels
            </Link>
          </li>
       
        </ul>
      </nav>

      <main className={styles.mainContent}>
        {/* <Routes>
      <Route index element={<OverView />} />
      <Route path="/dashboard" element={<OverView />} />
      <Route path="add-flights" element={<AddFlights />} />
      <Route path="overview" element={<OverView />} />
      <Route path="add-hotels" element={<AddHotels />} />
      <Route path="add-airlines" element={<AddAirlines />} />
      <Route path="view-flights" element={<ViewFlights />} />
      <Route path="view-hotels" element={<ViewHotels />} />
      <Route path="users" element={<Users />} />
      <Route path="usersbookedflights" element={<UsersBookedFlights />} />
      <Route path="usersbookedhotels" element={<UsersBookedHotels />} />
      <Route
        path="*"
        element={
          <div className={styles.noData}>
            <h1>404 - Page Not Found</h1>
            <Link to="/dashboard/view-flights">Go to View Flights</Link>
          </div>
        }
      />
    </Routes> */}

    <Outlet ></Outlet>
      </main>
    </div>
  );
}