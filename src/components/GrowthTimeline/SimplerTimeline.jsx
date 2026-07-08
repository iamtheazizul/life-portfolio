// SimplerTimeline.jsx
export default function SimpleTimeline() {
  const milestones = [
    { id: 1, year: "2019", title: "Started High School", type: "course" },
    { id: 2, year: "2020", title: "Built My First Website", type: "project" },
    { id: 3, year: "2021", title: "Science Fair Winner", type: "achievement" },
  ];

  const colors = {
    course: "#5B8CA6",      // Blue
    project: "#6E9C5C",     // Green
    achievement: "#D99A3C", // Orange
  };

  return (
    <div className="p-8 bg-[#FAF6EC] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">My Journey</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="bg-white rounded-lg p-6 border-l-4"
            style={{ borderColor: colors[milestone.type] }}
          >
            <span className="text-sm font-semibold" style={{ color: colors[milestone.type] }}>
              {milestone.year}
            </span>
            <h3 className="text-xl font-bold text-stone-800 mt-2">
              {milestone.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}