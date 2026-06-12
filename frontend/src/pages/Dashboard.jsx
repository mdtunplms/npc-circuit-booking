import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import DashboardCards from "../components/DashboardCards";
import OccupancyChart from "../components/OccupancyChart";
import TodayCheckins from "../components/TodayCheckins";
import TodayCheckouts from "../components/TodayCheckouts";

import { roleDashboard, occupancyReport } from "../api/adminApi";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [dashboard, setDashboard] = useState(null);

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      // Load dashboard data first
      const dashboardRes = await roleDashboard();

      setDashboard(dashboardRes.data);

      const role = dashboardRes.data.role;

      // Only Admin/Super Admin load occupancy report
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        const reportRes = await occupancyReport();

        setReport(reportRes.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-shell">
          <Sidebar />

          <main className="app-content">
            <div className="panel-card">
              <h4>Loading dashboard...</h4>
              <p>Preparing your booking workspace.</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Dashboard</h2>
              <p>Welcome {user?.full_name}. Here is your booking activity overview.</p>
            </div>

            <span className="app-chip">
              Role: {user?.role}
            </span>
          </div>

          {dashboard && (
            <DashboardCards role={dashboard.role} data={dashboard} />
          )}

          {user?.role === "ADMIN" && (
            <div className="row mt-4">
              <div className="col-lg-6 col-md-12 mb-3">
                <TodayCheckins />
              </div>

              <div className="col-lg-6 col-md-12 mb-3">
                <TodayCheckouts />
              </div>
            </div>
          )}

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <div className="row mt-4">
              <div className="col-lg-8 col-md-12">
                <div className="panel-card">
                  <h5>Monthly Occupancy Report</h5>

                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                    }}
                  >
                    <OccupancyChart report={report} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
