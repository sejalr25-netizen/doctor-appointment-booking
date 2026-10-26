
const TIMES = [
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM"
];

export default function SlotGrid({
  value,
  onChange,
  bookedSlots = [],
  blockedSlots = [],
  date
}) {
  return (
    <div className="slot-grid">
      {TIMES.map((time) => {
        const blocked =
          bookedSlots.includes(time) ||
          blockedSlots.some(
            (slot) =>
              slot.date === date &&
              slot.time === time
          );

        return (
          <button
            key={time}
            type="button"
            className={`slot ${
              value === time ? "selected" : ""
            } ${blocked ? "slot-disabled" : ""}`}
            disabled={blocked}
            onClick={() => onChange(time)}
          >
            {time}
            {blocked ? " · Booked" : ""}
          </button>
        );
      })}
    </div>
  );
}
