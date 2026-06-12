import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import { bungalowCalendar } from "../api/calendarApi";

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    const res = await bungalowCalendar(1);

    setEvents(res.data);
  };

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Booking Calendar</h2>
              <p>View booking activity by date across the bungalow calendar.</p>
            </div>

            <span className="app-chip">{events.length} calendar items</span>
          </div>

          <div className="panel-card calendar-panel">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
            />
          </div>
        </main>
      </div>
    </>
  );
}
