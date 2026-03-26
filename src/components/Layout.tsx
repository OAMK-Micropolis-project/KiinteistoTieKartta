import { Outlet } from "react-router-dom";
import Toolbar from "./Toolbar";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <Toolbar />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}