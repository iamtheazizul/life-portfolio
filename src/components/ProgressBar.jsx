import { MapPin } from "lucide-react";

export function ProgressBar({ progress }) {
  return (
    <div className="fixed hidden md:flex flex-col items-center z-20" style={{ right: 28, top: "18%", bottom: "12%" }}>
      <div style={{ width: 2, flex: 1, background: "rgba(35,43,56,0.12)", position: "relative" }}>
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            left: "50%",
            top: `${progress * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 26,
            height: 26,
            background: "#5B7A5E",
            transition: "top 0.1s linear",
          }}
        >
          <MapPin size={13} color="#EDE6D2" />
        </div>
      </div>
    </div>
  );
}