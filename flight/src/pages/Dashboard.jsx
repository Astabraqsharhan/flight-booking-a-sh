import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { flights as flightsData } from "../data/flights";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [completedFlights, setCompletedFlights] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const storedFlights =
      JSON.parse(localStorage.getItem("flights")) || flightsData;
    setFlights(storedFlights);

    const completed = storedFlights.filter((f) => f.status === "completed");
    setCompletedFlights(completed);

    const total = completed.reduce((sum, f) => sum + (f.price || 0), 0);
    setTotalSpent(total);
  }, []);

  const colors = {
    yellow: "#FACC15",
    black: "#1F2937",
    white: "#FFFFFF",
    gray: "#6B7280",
  };

  // بيانات الرسوم
  const ticketSalesData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Tickets Sold",
        data: [2000, 2500, 1800, 3000, 2200, 2600, 1400],
        backgroundColor: colors.yellow,
      },
    ],
  };

  const flightScheduleData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Domestic",
        data: [100, 120, 90, 140, 170, 150, 160, 130],
        borderColor: colors.yellow,
        backgroundColor: colors.yellow,
      },
      {
        label: "International",
        data: [80, 90, 70, 110, 120, 100, 115, 95],
        borderColor: colors.black,
        backgroundColor: colors.black,
      },
    ],
  };

  const airlinesData = {
    labels: ["SkyHigh Airlines", "FlyFast Airways", "AeroJet", "Nimbus Airlines"],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: [colors.yellow, colors.black, "#9CA3AF", "#FDE68A"],
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E5E7EB" }}>
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-6 text-black">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-yellow-400 rounded-lg shadow p-6 text-center text-black">
            <h2 className="text-xl font-semibold">Completed Flights</h2>
            <p className="text-3xl font-bold">{completedFlights.length}</p>
          </div>
          <div className="bg-yellow-400 rounded-lg shadow p-6 text-center text-black">
            <h2 className="text-xl font-semibold">Total Spent</h2>
            <p className="text-3xl font-bold">${totalSpent}</p>
          </div>
          <div className="bg-yellow-400 rounded-lg shadow p-6 text-center text-black">
            <h2 className="text-xl font-semibold">Upcoming Flights</h2>
            <p className="text-3xl font-bold">
              {flights.filter((f) => f.status === "upcoming" || !f.status).length}
            </p>
          </div>
          <div className="bg-yellow-400 rounded-lg shadow p-6 text-center text-black">
            <h2 className="text-xl font-semibold">Canceled Flights</h2>
            <p className="text-3xl font-bold">
              {flights.filter((f) => f.status === "canceled").length}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Ticket Sales</h2>
            <Bar data={ticketSalesData} />
          </div>

          <div className="bg-white rounded-lg shadow p-6 col-span-2">
            <h2 className="text-xl font-bold mb-4 text-black">Flights Schedule</h2>
            <Line data={flightScheduleData} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Popular Airlines</h2>
            <Doughnut data={airlinesData} />
          </div>

          <div className="bg-white rounded-lg shadow p-6 col-span-2 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-black">
             Track your flights around the world
            </h2>
           
            <img
              src="/public/map.png"
              alt="World Map"
              className="rounded-lg shadow-lg w-full h-90 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}