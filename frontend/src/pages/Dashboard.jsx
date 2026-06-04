import {
 useEffect,
 useState
} from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
 occupancyReport
}
from "../api/adminApi";

export default function Dashboard() {

    const user =
    JSON.parse(
    localStorage.getItem("user") || "null"
    );

    const [report,
setReport]
=
useState(null);

useEffect(()=>{

loadReport();

},[]);

const loadReport =
async()=>{

try{

const res =
await occupancyReport();

setReport(
 res.data
);

}catch(err){

console.log(err);

}

};


  return (

    <>
      <Navbar />

      <div className="row">

        <div className="col-md-2">
          <Sidebar />
        </div>

        <div className="col-md-10 p-4">

          <h2>Dashboard</h2>

          <hr />

          <h4>
            Welcome {user?.full_name}
          </h4>

          <p>
            Role : {user?.role}
          </p>

          <div className="row">

<div className="col-md-4">

<div className=
"card p-3"
>

<h5>
Total Bookings
</h5>

<h2>

{
report
?.totalBookings
}

</h2>

</div>

</div>

<div className="col-md-4">

<div className=
"card p-3"
>

<h5>
Occupied
</h5>

<h2>

{
report
?.occupiedBookings
}

</h2>

</div>

</div>

<div className="col-md-4">

<div className=
"card p-3"
>

<h5>
Occupancy
</h5>

<h2>

{
report
?.occupancyRate
}

</h2>

</div>

</div>

</div>


        </div>

      </div>

    </>

  );

}