import { Link, Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar.jsx";

export default function Layout() {
  return (
      <>
    <title>Emailer Dashboard</title>
    <meta name="description" content="Emailer Dashboard" />
    <div className="container-fluid">
      <div className="row vh-100">

        <SideBar/>

        {/* Main content */}
        <main className="col-md-10 col-9 p-4">
          <Outlet />
        </main>
      </div>
    </div>
      </>
  );
}
