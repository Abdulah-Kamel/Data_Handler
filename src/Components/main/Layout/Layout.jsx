import { Link, Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar.jsx";
import TopBar from "../TopBar/TopBar.jsx";

export default function Layout() {
  return (
    <>
      <title>Data Handler</title>
      <meta name="description" content="Data Handler Dashboard" />
      <div className="container-fluid">
        <div className="row vh-100">
          <SideBar />

          <main className="p-0 bg-light">
            <TopBar />
            <div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
