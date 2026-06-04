import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {

    const user =
    JSON.parse(
    localStorage.getItem("user") || "null"
    );

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

        </div>

      </div>

    </>

  );

}