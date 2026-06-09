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

      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>

        <div className="col-md-10 p-4">
          <h2>Booking Calendar</h2>

          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
          />
        </div>
      </div>
    </>
  );
}
