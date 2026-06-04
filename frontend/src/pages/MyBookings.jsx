import {
 useEffect,
 useState
}
from "react";

import Navbar
from "../components/Navbar";

import Sidebar
from "../components/Sidebar";

import {
 myBookings
}
from "../api/bookingApi";

export default function MyBookings(){

const [bookings,setBookings]
=
useState([]);

useEffect(()=>{

loadBookings();

},[]);

const loadBookings =
async()=>{

const res =
await myBookings();

setBookings(
 res.data
);

};

return(

<>

<Navbar/>

<div className="row">

<div className="col-md-2">
<Sidebar/>
</div>

<div className="col-md-10 p-4">

<h2>My Bookings</h2>

<table className="table">

<thead>

<tr>

<th>Reference</th>

<th>Status</th>

<th>Check In</th>

<th>Check Out</th>

</tr>

</thead>

<tbody>

{
bookings.map(item=>(

<tr key={item.id}>

<td>
{item.booking_reference}
</td>

<td>
{item.status}
</td>

<td>
{item.check_in}
</td>

<td>
{item.check_out}
</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>

</>

);

}