import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import OccupancyChart from "../components/OccupancyChart";
import TodayCheckins from "../components/TodayCheckins";
import TodayCheckouts from "../components/TodayCheckouts";

import { occupancyReport } from "../api/adminApi";

export default function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {

    try {

      const res = await occupancyReport();

      setReport(res.data);

    } catch (err) {

      console.log(err);

    }

  };

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

          <h2>Dashboard</h2>

          <hr />

          <h4>
            Welcome {user?.full_name}
          </h4>

          <p>
            Role : {user?.role}
          </p>

          {/* Statistics Cards */}

          <div className="row">

            <div className="col-md-4">

              <div className="card p-3 shadow-sm">

                <h5>Total Bookings</h5>

                <h2>
                  {report?.totalBookings || 0}
                </h2>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card p-3 shadow-sm">

                <h5>Occupied Rooms</h5>

                <h2>
                  {report?.occupiedBookings || 0}
                </h2>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card p-3 shadow-sm">

                <h5>Occupancy Rate</h5>

                <h2>
                  {report?.occupancyRate || "0%"}
                </h2>

              </div>

            </div>

          </div>

          {/* Occupancy Chart */}

{/* Today's Checkins / Checkouts */}

<div className="row mt-4">

  <div className="col-lg-6 col-md-12 mb-3">

    <TodayCheckins />

  </div>

  <div className="col-lg-6 col-md-12 mb-3">

    <TodayCheckouts />

  </div>

</div>

{/* Occupancy Chart */}

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

        </div>

      </div>

    </>

  );

}