import {
 useEffect,
 useState
}
from "react";

import {
 todayCheckins
}
from "../api/bungalowApi";

export default function
TodayCheckins(){

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
await todayCheckins();

setItems(
 res.data
);

};

return(

<div
className="card p-3"
>

<h5>

Today's Check-ins

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