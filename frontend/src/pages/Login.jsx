import { useState }
from "react";

import api
from "../api/axios";

import {
 useNavigate
}
from "react-router-dom";

export default function Login(){

const navigate =
useNavigate();

const [email,setEmail] =
useState("");

const [password,setPassword] =
useState("");

const submit =
async(e)=>{

e.preventDefault();

try{

const res =
await api.post(
 "/auth/login",
 {
  email,
  password
 }
);

localStorage.setItem(
 "token",
 res.data.token
);

localStorage.setItem(
 "user",
 JSON.stringify(
  res.data.user
 )
);

navigate("/dashboard");

}catch(err){

alert(
 err.response?.data?.message
);

}

};

return(

<div className="container mt-5">

<h2>Login</h2>

<form onSubmit={submit}>

<input
className="form-control mb-3"
placeholder="Email"
value={email}
onChange={(e)=>
setEmail(
e.target.value
)}
/>

<input
type="password"
className="form-control mb-3"
placeholder="Password"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)}
/>

<button
className="btn btn-primary"
>

Login

</button>

</form>

</div>

);

}