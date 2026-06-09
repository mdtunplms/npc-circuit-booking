import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import DashboardCards from "../components/DashboardCards";
import OccupancyChart from "../components/OccupancyChart";
import TodayCheckins from "../components/TodayCheckins";
import TodayCheckouts from "../components/TodayCheckouts";

import {
  roleDashboard,
  occupancyReport
} from "../api/adminApi";

export default function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [dashboard, setDashboard] =
    useState(null);

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    initializeDashboard();

  }, []);

  const initializeDashboard =
    async () => {

      try {

        // Load dashboard data first
        const dashboardRes =
          await roleDashboard();

        setDashboard(
          dashboardRes.data
        );

        const role =
          dashboardRes.data.role;

        // Only Admin/Super Admin load occupancy report
        if (
          role === "ADMIN" ||
          role === "SUPER_ADMIN"
        ) {

          const reportRes =
            await occupancyReport();

          setReport(
            reportRes.data
          );

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

        <div className="container mt-4">

          <h4>
            Loading Dashboard...
          </h4>

        </div>

      </>

    );

  }

  return (

    <>
      <Navbar />

      <div className="row">

        {/* Sidebar */}

        <div className="col-md-2">

          <Sidebar />

        </div>

        {/* Main Content */}

        <div className="col-md-10 p-4">

          <h2>
            Dashboard
          </h2>

          <hr />

          <h4>
            Welcome {user?.full_name}
          </h4>

          <p>
            Role : {user?.role}
          </p>

          {/* Role Based Statistics */}

          {

            dashboard && (

              <DashboardCards

                role={
                  dashboard.role
                }

                data={
                  dashboard
                }

              />

            )

          }

          {/* ADMIN ONLY */}

          {

            user?.role === "ADMIN" && (

              <div className="row mt-4">

                <div className="col-lg-6 col-md-12 mb-3">

                  <TodayCheckins />

                </div>

                <div className="col-lg-6 col-md-12 mb-3">

                  <TodayCheckouts />

                </div>

              </div>

            )

          }

          {/* ADMIN + SUPER ADMIN */}

          {

            (
              user?.role === "ADMIN" ||
              user?.role === "SUPER_ADMIN"
            ) && (

              <div className="row mt-4">

                <div className="col-lg-8 col-md-12">

                  <div className="card shadow-sm">

                    <div className="card-body">

                      <h5 className="card-title mb-3">

                        Monthly Occupancy Report

                      </h5>

                      <div
                        style={{
                          height: "280px",
                          width: "100%"
                        }}
                      >

                        <OccupancyChart
                          report={report}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )

          }

        </div>

      </div>

    </>

  );

}