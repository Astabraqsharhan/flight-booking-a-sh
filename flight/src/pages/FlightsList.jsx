import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { flights as flightsData } from "../data/flights.jsx";

export default function FlightsList() {
  const [tab, setTab] = useState("all");
  const [flights, setFlights] = useState([]);
  const [showSeats, setShowSeats] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // ألوان متناسقة مع الداشبورد
  const colors = {
    yellow: "#FACC15",
    black: "#1F2937",
    white: "#FFFFFF",
    grayLight: "#d5d7daff",
    gray: "#6B7280",
    red: "#EF4444",
    green: "#22C55E",
  };

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("flights"));
    const source = raw || flightsData;

    const flightsWithSeats = source.map(f => ({
      ...f,
      status: f.status || "upcoming",
      seats: Array.from({ length: 40 }, (_, i) => ({ seat: i + 1, booked: false })),
    }));

    setFlights(flightsWithSeats);
    if (!raw) localStorage.setItem("flights", JSON.stringify(flightsWithSeats));
  }, []);

  const saveFlights = (updatedFlights) => {
    setFlights(updatedFlights);
    localStorage.setItem("flights", JSON.stringify(updatedFlights));
  };

  const handleOpenSeats = (flight) => {
    const fresh = flights.find(f => f.id === flight.id) || flight;
    setSelectedFlight(fresh);
    setSelectedSeat(null);
    setShowSeats(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat) return alert("Please select a seat first!");

    const updatedFlights = flights.map(f => {
      if (f.id === selectedFlight.id) {
        const updatedSeats = f.seats.map(s => 
          s.seat === selectedSeat ? { ...s, booked: true } : s
        );
        return { ...f, seats: updatedSeats, bookedSeat: selectedSeat, status: "completed" };
      }
      return f;
    });

    saveFlights(updatedFlights);
    setShowSeats(false);
    setSelectedSeat(null);
    setSelectedFlight(null);
  };

  const handleCancelFlight = (id) => {
    const updatedFlights = flights.map(f => f.id === id ? { ...f, status: "canceled" } : f);
    saveFlights(updatedFlights);
  };

  const filteredFlights = flights.filter(f => {
    if (tab === "all") return f.status !== "canceled";
    return f.status === tab;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E5E7EB" }}>
      <Navbar />

      <div className="container mx-auto px-6 pt-24 ">
        {/* Tabs */}
        <div className={`flex gap-4 mb-6 p-3 rounded-lg w-fit`} style={{ backgroundColor: colors.black }}>
          {["all", "upcoming", "completed", "canceled"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded font-semibold`}
              style={{
                backgroundColor: tab === t ? colors.yellow : colors.grayLight,
                color: tab === t ? colors.black : colors.black,
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Flights Table */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-black">Flights List</h2>
          <table className="w-full text-left border-collapse">
            <thead style={{ backgroundColor: colors.black, color: colors.white }}>
              <tr>
                <th className="px-2 py-1">From</th>
                <th className="px-2 py-1">To</th>
                <th className="px-2 py-1"> Departing</th>
                <th className="px-2 py-1">Returning</th>
                <th className="px-2 py-1">Time</th>
                <th className="px-2 py-1">Airport</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Seat</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.map(f => (<tr key={f.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-2 py-1">{f.from}</td>
                  <td className="px-2 py-1">{f.to}</td>
                  <td className="px-2 py-1">{f.Departing}</td>
                  <td className="px-2 py-1">{f.Returning || "-"}</td>
                  <td className="px-2 py-1">{f.time}</td>
                  <td className="px-2 py-1">{f.Airport}</td>
                  <td className="px-2 py-1">${f.price}</td>
                  <td className="px-2 py-1">{f.bookedSeat || "-"}</td>
                  <td className="px-2 py-1 font-semibold" style={{
                    color: f.status === "upcoming" ? colors.yellow :
                           f.status === "completed" ? colors.green :
                           f.status === "canceled" ? colors.red : colors.black
                  }}>
                    {f.status}
                  </td>
                  <td className="flex gap-2 px-2 py-1">
                    {f.status === "upcoming" && (
                      <button
                        onClick={() => handleOpenSeats(f)}
                        className="px-3 py-1 rounded font-semibold"
                        style={{ backgroundColor: colors.yellow, color: colors.black }}
                      >
                        Book
                      </button>
                    )}
                    {f.status !== "canceled" && (
                      <button
                        onClick={() => handleCancelFlight(f.id)}
                        className="px-3 py-1 rounded font-semibold"
                        style={{ backgroundColor: colors.black, color: colors.white }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seat Modal */}
      {showSeats && selectedFlight && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4 text-black">Select Seat</h2>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {selectedFlight.seats.map(s => (
                <button
                  key={s.seat}
                  disabled={s.booked}
                  onClick={() => setSelectedSeat(s.seat)}
                  className={`px-2 py-1 border rounded font-semibold`}
                  style={{
                    backgroundColor: s.booked ? colors.red :
                                     selectedSeat === s.seat ? colors.yellow :
                                     colors.grayLight,
                    color: s.booked ? colors.white : colors.black,
                    cursor: s.booked ? "not-allowed" : "pointer"
                  }}
                >
                  {s.seat}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSeats(false)}
                className="px-3 py-1 rounded font-semibold"
                style={{ backgroundColor: colors.gray, color: colors.white }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-3 py-1 rounded font-semibold"
                style={{ backgroundColor: colors.yellow, color: colors.black }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}