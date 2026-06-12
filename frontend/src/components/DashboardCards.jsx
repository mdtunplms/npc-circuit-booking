import {
  FaBed,
  FaBuilding,
  FaCalendarCheck,
  FaClock,
  FaRegCheckCircle,
  FaUsers,
} from "react-icons/fa";

const MetricCard = ({ icon, label, value }) => (
  <div className="col-xl-3 col-md-6 mb-3">
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <h6>{label}</h6>
      <h2>{value ?? 0}</h2>
    </div>
  </div>
);

export default function DashboardCards({ role, data }) {
  if (role === "SUPER_ADMIN") {
    return (
      <div className="row">
        <MetricCard icon={<FaUsers />} label="Users" value={data.totalUsers} />
        <MetricCard icon={<FaBuilding />} label="Bungalows" value={data.totalBungalows} />
        <MetricCard icon={<FaBed />} label="Rooms" value={data.totalRooms} />
        <MetricCard icon={<FaCalendarCheck />} label="Bookings" value={data.totalBookings} />
      </div>
    );
  }

  if (role === "ADMIN") {
    return (
      <div className="row">
        <MetricCard icon={<FaClock />} label="Pending" value={data.pendingBookings} />
        <MetricCard icon={<FaRegCheckCircle />} label="Approved" value={data.approvedBookings} />
      </div>
    );
  }

  return (
    <div className="row">
      <MetricCard icon={<FaCalendarCheck />} label="My Bookings" value={data.myBookings} />
      <MetricCard icon={<FaClock />} label="Pending" value={data.pendingRequests} />
      <MetricCard icon={<FaRegCheckCircle />} label="Approved" value={data.approvedRequests} />
    </div>
  );
}
