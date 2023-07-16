import { Outlet } from "react-router-dom";
import ToolbarComponent from "../components/toolbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div style={{ marginTop: '64px' }}>
      <Outlet />
      <Footer />
    </div>
  );
}
