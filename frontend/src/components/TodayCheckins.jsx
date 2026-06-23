import { useEffect, useState } from "react";

import { todayCheckins } from "../api/bungalowApi";

export default function TodayCheckins() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await todayCheckins();

      setItems(res.data);
    };

    load();
  }, []);

  return (
    <div className="panel-card">
      <h5>Today's Check-ins</h5>

      <ul className="today-list">
        {items.map((item) => (
          <li key={item.id}>{item.booking_reference}</li>
        ))}
      </ul>

      {!items.length && (
        <div className="empty-state">No check-ins scheduled today.</div>
      )}
    </div>
  );
}
