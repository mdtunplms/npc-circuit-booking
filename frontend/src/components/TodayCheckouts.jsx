import {
 useEffect,
 useState
}
from "react";

import {
 todayCheckouts
}
from "../api/bungalowApi";

export default function
TodayCheckouts(){

const [items,
setItems]
=
useState([]);

useEffect(()=>{

load();

},[]);

const load =
async()=>{

const res =
await todayCheckouts();

setItems(
 res.data
);

};

return(

<div
className="card p-3"
>

<h5>

Today's Check-outs

</h5>

<ul>

{
items.map(item=>(

<li
 key={item.id}
>

{
item
.booking_reference
}

</li>

))
}

</ul>

</div>

);

}