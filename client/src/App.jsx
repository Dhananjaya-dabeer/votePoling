import { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import VotingPage from "./pages/VotingPage";
const LazyStatisticPage = lazy(() => import("./pages/StatisticPage"));
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route
          path="/stat"
          element={
            <Suspense
              fallback={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100vw",
                  }}
                >
                  <img
                  style={{width: '20%'}}
                    src="https://i.ibb.co/sPPJhhR/loading-white.gif"
                    alt=""
                  />
                </div>
              }
            >
              <LazyStatisticPage />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
