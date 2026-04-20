import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/SummaryView";
import AnalyticsView from "./pages/AnalyticsView";
import DetailView from "./pages/detailView";
import AddProp from "./pages/AddProp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/detail/:id" element={<DetailView />} />
          <Route path="/add" element={<AddProp />} />
        </Route>
      </Routes>
    </Router>
  );
}
