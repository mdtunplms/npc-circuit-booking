import { useState }
from "react";

import api
from "../api/axios";

export default function Register(){

const [form,setForm] =
useState({

 full_name:"",
 email:"",
 password:"",
 institution:"",
 mobile_no:""

});

const submit =
async(e)=>{

e.preventDefault();

await api.post(
 "/auth/register",
 form
);

alert(
 "Registration Success"
);

};

return(

<div className="container mt-5">

<h2>Register</h2>

<form onSubmit={submit}>

<input
className="form-control mb-2"
placeholder="Full Name"
onChange={(e)=>
setForm({
...form,
full_name:
e.target.value
})
}
/>

<input
className="form-control mb-2"
placeholder="Email"
onChange={(e)=>
setForm({
...form,
email:
e.target.value
})
}
/>

<input
type="password"
className="form-control mb-2"
placeholder="Password"
onChange={(e)=>
setForm({
...form,
password:
e.target.value
})
}
/>

<button
className="btn btn-success"
>

Register

</button>

</form>

</div>

);

}