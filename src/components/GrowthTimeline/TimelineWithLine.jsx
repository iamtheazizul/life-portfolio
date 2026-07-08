export default function TimelineWithLine() {
  const milestones = [
    { id: 1, year: "2019", title: "Started High School", type: "course" },
    { id: 2, year: "2020", title: "Built My First Website", type: "project" },
    { id: 3, year: "2021", title: "Science Fair Winner", type: "achievement" },
  ];

  const colors = {
    course: "#5B8CA6",
    project: "#6E9C5C",
    achievement: "#D99A3C",
  };

  return (
    <div className="p-8 bg-[#FAF6EC] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">My Journey</h1>

      <div className="relative mx-auto" style={{ width: "900px" }}>
        {/* The vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#6E9C5C]"
          style={{ transform: "translateX(-50%)" }}
        />

        <div className="space-y-10">
          {milestones.map((milestone, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={milestone.id} className="relative" style={{ minHeight: "100px" }}>
                {/* DOT - absolutely centered on the line, independent of card layout */}
                <div
                  className="absolute left-1/2 top-1/2 w-6 h-6 rounded-full border-4 border-[#FAF6EC] z-10"
                  style={{
                    backgroundColor: colors[milestone.type],
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Card - sits in left or right half, with breathing room from center */}
                <div
                  className={`flex ${isLeft ? "justify-end pr-20" : "justify-start pl-20 ml-auto"}`}
                  style={{ width: "50%", marginLeft: isLeft ? "0" : "50%" }}
                >
                  <div className="bg-white rounded-lg p-8 flex-shrink-0 w-56 shadow-sm">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: colors[milestone.type] }}
                    >
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold text-stone-800 mt-3">
                      {milestone.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}