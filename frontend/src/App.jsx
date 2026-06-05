import {
 BrowserRouter,
 Routes,
 Route
}
from "react-router-dom";

import Login
from "./pages/Login";

import Register
from "./pages/Register";

import Dashboard
from "./pages/Dashboard";

import ProtectedRoute
from "./components/ProtectedRoute";

import Rooms from "./pages/Rooms";
import MyBookings from "./pages/MyBookings";
import CreateBooking from "./pages/CreateBooking";

import Calendar
from "./pages/Calendar";

import AdminBookings
from "./pages/AdminBookings";

import RoomCalendar
from "./pages/RoomCalendar";

function App(){

return(

<BrowserRouter>

<Routes>

<Route
 path="/"
 element={<Login/>}
/>

<Route
 path="/register"
 element={<Register/>}
/>

<Route
 path="/dashboard"
 element={

 <ProtectedRoute>

 <Dashboard/>

 </ProtectedRoute>

 }
/>

<Route
 path="/rooms"
 element={
  <ProtectedRoute>
   <Rooms/>
  </ProtectedRoute>
 }
/>

<Route
 path="/my-bookings"
 element={
  <ProtectedRoute>
   <MyBookings/>
  </ProtectedRoute>
 }
/>

<Route
 path="/create-booking"
 element={
  <ProtectedRoute>
   <CreateBooking/>
  </ProtectedRoute>
 }
/>

<Route
 path="/calendar"
 element={
 <ProtectedRoute>
 <Calendar/>
 </ProtectedRoute>
 }
/>

<Route
 path="/admin-bookings"
 element={
 <ProtectedRoute>
 <AdminBookings/>
 </ProtectedRoute>
 }
/>

<Route
 path="/room-calendar"
 element={
  <ProtectedRoute>
   <RoomCalendar/>
  </ProtectedRoute>
 }
/>

</Routes>

</BrowserRouter>

);

}

export default App;