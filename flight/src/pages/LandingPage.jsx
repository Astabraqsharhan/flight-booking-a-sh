
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FULL_TEXT = "Find And Book A Great Experience";

export default function LandingPage() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // كتابة النص حرف حرف
    const interval = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= FULL_TEXT.length) {
          clearInterval(interval);
          setTimeout(() => setShowButton(true), 300); // بعد انتهاء الكتابة يظهر الزر
          return v;
        }
        return v + 1;
      });
    }, 50); // سرعة الكتابة 

    return () => clearInterval(interval);
  }, []);

  const handleBookNow = () => {
    navigate("/flights");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* النص مع الانميشن */}
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
        {FULL_TEXT.slice(0, visibleCount)}
        <span
          className={`inline-block w-[2px] bg-black ml-1 ${
            visibleCount < FULL_TEXT.length ? "animate-blink" : "opacity-0"
          }`}
        />
      </h1>

      {/* الصورة مع انميشن تكبير */}
      <div className="w-full max-w-3xl mb-6 overflow-hidden">
        <img
          src="/plane.jpg"
          alt="Airplane"
          className="rounded-full w-full object-cover transform transition-transform duration-700 hover:scale-110"
        />
      </div>

      {/* زر Book Now */}
      {showButton && (
        <button
          onClick={handleBookNow}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-500"
        >
          BOOK NOW
        </button>
      )}

      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1 }
          50% { opacity: 0 }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}