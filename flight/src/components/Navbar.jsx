
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-80 py-4 bg-white/30 backdrop-blur-sm fixed top-0 left-0 w-full z-50">
      {/* روابط */}
     
      <div className="flex gap-8 font-semibold text-lg">
        <Link to="/dashboard" className="hover:underline"> Dashboard  </Link>
        <Link to="/flights" className="hover:underline"> Flights list </Link>
        <Link to="/search" className="hover:underline"> Search for a flight </Link>
        
      </div>
      
    </nav>
  );
}
