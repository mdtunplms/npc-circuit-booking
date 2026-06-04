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

</Routes>

</BrowserRouter>

);

}

export default App;