import {
 useEffect,
 useState
} from "react";

import Navbar
from "../components/Navbar";

import Sidebar
from "../components/Sidebar";

import {
 getRooms
}
from "../api/roomApi";

export default function Rooms(){

const [rooms,setRooms] =
useState([]);

useEffect(()=>{

loadRooms();

},[]);

const loadRooms =
async()=>{

const res =
await getRooms();

setRooms(
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

<h2>Rooms</h2>

<table className="table">

<thead>

<tr>

<th>ID</th>

<th>Room No</th>

<th>Type</th>

<th>Price</th>

</tr>

</thead>

<tbody>

{
rooms.map(room=>(

<tr key={room.id}>

<td>{room.id}</td>

<td>{room.room_no}</td>

<td>{room.room_type}</td>

<td>{room.price}</td>

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