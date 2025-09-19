import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { flights as flightsData } from "../data/flights";

export default function SearchFlights() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departing, setDeparting] = useState("");
  const [returning, setReturning] = useState("");
  const [tripType, setTripType] = useState("round");

  const [flights, setFlights] = useState([]);
  const [results, setResults] = useState([]);

  const [showSeats, setShowSeats] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights"));
    if (storedFlights) {
      setFlights(storedFlights);
    } else {
      const flightsWithSeats = flightsData.map(f => ({
        ...f,
        seats: Array.from({ length: 40 }, (_, i) => ({ seat: i + 1, booked: false })),
        status: f.status || "upcoming"
      }));
      setFlights(flightsWithSeats);
      localStorage.setItem("flights", JSON.stringify(flightsWithSeats));
    }
  }, []);

  // دالة البحث
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const filtered = flights.filter(f => {
      // تحويل النصوص للتأكد من عدم وجود مشاكل بالحروف الكبيرة/الصغيرة
      const fromMatch = from ? f.from.toLowerCase().includes(from.toLowerCase()) : true;
      const toMatch = to ? f.to.toLowerCase().includes(to.toLowerCase()) : true;
      const departMatch = departing ? f.Departing === departing : true;
      const returnMatch = tripType === "round" && returning ? f.Returning === returning : true;

      // إذا الرحلة One-Way نتجاهل حقل Returning
      return fromMatch && toMatch && departMatch && (tripType === "round" ? returnMatch : true);
    });

    setResults(filtered);
  };

  // فتح المقاعد للحجز
  const handleOpenSeats = (flight) => {
    if (!flight.seats) {
      flight.seats = Array.from({ length: 40 }, (_, i) => ({ seat: i + 1, booked: false }));
    }
    setSelectedFlight(flight);
    setShowSeats(true);
    setSelectedSeat(null);
  };

  // تأكيد الحجز
  const handleConfirmBooking = () => {
    if (!selectedSeat) return alert("Please select a seat first!");

    const updatedFlights = flights.map(f => {
      if (f.id === selectedFlight.id) {
        const updatedSeats = f.seats.map(s =>
          s.seat === selectedSeat ? { ...s, booked: true } : s
        );
        return {
          ...f,
          seats: updatedSeats,
          bookedSeat: selectedSeat,
          status: "completed",
        };
      }
      return f;
    });

    setFlights(updatedFlights);
    setShowSeats(false);
    setSelectedSeat(null);
    setSelectedFlight(null);
    setResults([]);
    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    alert("تم حجز الرحلة بنجاح ✅");
  };

  return (
    <div
  className="min-h-screen flex flex-col bg-gray-200 bg-cover bg-center"
  style={{ backgroundImage: "url('/beach.jpg')",
  }} >
  <Navbar />
  
      <div className="flex flex-col items-center justify-start flex-1 p-24">
        <h1 className="text-4xl font-bold mb-6 text-black">Search Flights</h1>

        {/* Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-lg p-6 flex flex-wrap gap-4 justify-center shadow-md w-full max-w-4xl"
        >
          <div className="flex flex-col">
            <label className="font-semibold">From</label>
            <input
              type="text"
              placeholder="Origin"
              className="px-3 py-2 border rounded"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">To</label>
            <input
              type="text"
              placeholder="Destination"
              className="px-3 py-2 border rounded"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            /></div>

          <div className="flex flex-col">
            <label className="font-semibold">Departing</label>
            <input
              type="date"
              className="px-3 py-2 border rounded"
              value={departing}
              onChange={(e) => setDeparting(e.target.value)}
            />
          </div>

          {tripType === "round" && (
            <div className="flex flex-col">
              <label className="font-semibold">Returning</label>
              <input
                type="date"
                className="px-3 py-2 border rounded"
                value={returning}
                onChange={(e) => setReturning(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-4 w-full justify-center mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tripType"
                value="round"
                checked={tripType === "round"}
                onChange={() => setTripType("round")}
              />{" "}
              Round Trip
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tripType"
                value="oneway"
                checked={tripType === "oneway"}
                onChange={() => setTripType("oneway")}
              />{" "}
              One-Way
            </label>
          </div>

          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg shadow-md"
            >
              SEARCH
            </button>
          </div>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 w-full max-w-6xl bg-white text-black rounded-lg p-4 shadow">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th>From</th>
                  <th>To</th>
                  <th>Departing</th>
                  <th>Returning</th>
                  <th>Time</th>
                  <th>Airport</th>
                  <th>Price</th>
                  <th>Seat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((f) => (
                  <tr key={f.id} className="border-b">
                    <td>{f.from}</td>
                    <td>{f.to}</td>
                    <td>{f.Departing}</td>
                    <td>{f.Returning || "-"}</td>
                    <td>{f.time}</td>
                    <td>{f.Airport}</td>
                    <td>${f.price}</td>
                    <td>{f.bookedSeat || "-"}</td>
                    <td>
                      {f.status !== "completed" ? (
                        <button
                          onClick={() => handleOpenSeats(f)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Book
                        </button>
                      ) : (
                        <span className="text-green-600 font-bold">Booked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Seat Modal */}
        {showSeats && selectedFlight && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <h2 className="text-lg font-bold mb-4">
                Select Seat for {selectedFlight.from} → {selectedFlight.to}
              </h2>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {selectedFlight.seats.map((s) => (
                  <button key={s.seat}
                    disabled={s.booked}
                    onClick={() => setSelectedSeat(s.seat)}
                    className={`px-2 py-1 border rounded ${
                      s.booked
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : selectedSeat === s.seat
                        ? "bg-sky-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {s.seat}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSeats(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}