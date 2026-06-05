import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function OccupancyChart({
  report
}) {

  const data = {

    labels: [
      "Total Bookings",
      "Occupied Rooms"
    ],

    datasets: [
      {
        label: "Count",
        data: [
          report?.totalBookings || 0,
          report?.occupiedBookings || 0
        ]
      }
    ]

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "top"
      }

    }

  };

  return (

    <div
      style={{
        height: "250px"
      }}
    >

      <Bar
        data={data}
        options={options}
      />

    </div>

  );

}