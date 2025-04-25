import { Link, Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar.jsx";
import TopBar from "../TopBar/TopBar.jsx";
import { useState } from "react";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
      <>
    <title>Emailer Dashboard</title>
    <meta name="description" content="Emailer Dashboard" />
    <div className="container-fluid">
      <div className="row vh-100">

        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>

        {/* Main content */}
        <main className={`col-10 p-0`}>
          <TopBar />
          <div className="container">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
      </>
  );
}
