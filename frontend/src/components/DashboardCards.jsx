export default function DashboardCards({ role, data }) {
  if (role === "SUPER_ADMIN") {
    return (
      <div className="row">
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Users</h6>

            <h2>{data.totalUsers}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Bungalows</h6>

            <h2>{data.totalBungalows}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Rooms</h6>

            <h2>{data.totalRooms}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Bookings</h6>

            <h2>{data.totalBookings}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (role === "ADMIN") {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h6>Pending</h6>

            <h2>{data.pendingBookings}</h2>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h6>Approved</h6>

            <h2>{data.approvedBookings}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card p-3">
          <h6>My Bookings</h6>

          <h2>{data.myBookings}</h2>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3">
          <h6>Pending</h6>

          <h2>{data.pendingRequests}</h2>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3">
          <h6>Approved</h6>

          <h2>{data.approvedRequests}</h2>
        </div>
      </div>
    </div>
  );
}
