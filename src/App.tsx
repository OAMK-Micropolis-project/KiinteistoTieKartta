import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/SummaryView";
import AnalyticsView from "./pages/AnalyticsView";
import DetailView from "./pages/detailView";
import AddProp from "./pages/AddProp";
import PropertyPdfReport from "./pages/PropertyPdfReport";
import BackUp from "./pages/BackUp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/detail/:id/pdf" element={<PropertyPdfReport />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/detail/:id" element={<DetailView />} />
          <Route path="/add" element={<AddProp />} />
          <Route path="/add/:id" element={<AddProp />} />
          <Route path="/deleted" element={<BackUp />} />
        </Route>
      </Routes>
    </Router>
  );
}
