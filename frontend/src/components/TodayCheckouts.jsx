import { useEffect, useState } from "react";

import { todayCheckouts } from "../api/bungalowApi";

export default function TodayCheckouts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await todayCheckouts();

      setItems(res.data);
    };

    load();
  }, []);

  return (
    <div className="panel-card">
      <h5>Today's Check-outs</h5>

      <ul className="today-list">
        {items.map((item) => (
          <li key={item.id}>{item.booking_reference}</li>
        ))}
      </ul>

      {!items.length && (
        <div className="empty-state">No check-outs scheduled today.</div>
      )}
    </div>
  );
}
