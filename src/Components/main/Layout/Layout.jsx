import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar.jsx";
import TopBar from "../TopBar/TopBar.jsx";

export default function Layout() {
  return (
    <>
      <title>Data Handler</title>
      <meta name="description" content="Data Handler Dashboard" />
      <div className="container-fluid p-0">
        <SideBar />
        <main className="main-content bg-light min-vh-100">
          <TopBar />
          <div className="p-3">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
