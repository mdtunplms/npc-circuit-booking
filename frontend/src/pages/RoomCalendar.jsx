import {
 useEffect,
 useState
}
from "react";

import FullCalendar
from "@fullcalendar/react";

import dayGridPlugin
from "@fullcalendar/daygrid";

import {
 roomCalendar
}
from "../api/calendarApi";

export default function
RoomCalendar(){

const [events,
setEvents]
=
useState([]);

useEffect(()=>{

load();

},[]);

const load =
async()=>{

const res =
await roomCalendar(
 1
);

setEvents(
 res.data
);

};

return(

<FullCalendar

plugins={[
 dayGridPlugin
]}

initialView=
"dayGridMonth"

events={events}

/>

);

}