import { Outlet } from "react-router-dom";
import Toolbar from "./Toolbar";
import "./Layout.css"; // needed for .content styles

export default function Layout() {
  return (
    <>
      {/* Persistent sidebar */}
      <Toolbar />

      {/* Page content wrapper */}
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}