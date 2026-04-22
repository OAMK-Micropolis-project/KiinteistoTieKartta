import { Outlet } from "react-router-dom";
import React from "react";
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

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Jokin meni pieleen. Käynnistä sovellus uudelleen.</h2>;
    }
    return this.props.children;
  }
}
