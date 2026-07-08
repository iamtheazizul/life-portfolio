export default function TimelineWithLine() {
  const milestones = [
    {
      id: 1,
      year: "2019",
      title: "Started High School",
      type: "course",
      branches: [
        { id: "1a", title: "Joined Robotics Club" },
        { id: "1b", title: "Learned Python" },
      ],
    },
    {
      id: 2,
      year: "2020",
      title: "Built My First Website",
      type: "project",
      branches: [{ id: "2a", title: "Freelanced for Local Bakery" }],
    },
    {
      id: 3,
      year: "2021",
      title: "Science Fair Winner",
      type: "achievement",
      branches: [],
    },
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
                {/* DOT - centered on the main card's height, not the full row (branches add height below) */}
                <div
                  className="absolute left-1/2 w-6 h-6 rounded-full border-4 border-[#FAF6EC] z-10"
                  style={{
                    top: "56px",
                    backgroundColor: colors[milestone.type],
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Card - sits in left or right half, with breathing room from center */}
                <div
                  className={`flex ${isLeft ? "justify-end pr-20" : "justify-start pl-20 ml-auto"}`}
                  style={{ width: "50%", marginLeft: isLeft ? "0" : "50%" }}
                >
                  <div className={`flex flex-col gap-3 flex-shrink-0 w-56 ${isLeft ? "items-end" : "items-start"}`}>
                    {/* Main milestone card */}
                    <div className="bg-white rounded-lg p-8 shadow-sm w-56">
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

                    {/* Branches (side projects) - connected by a small line */}
                    {milestone.branches?.map((branch) => (
                      <div
                        key={branch.id}
                        className={`relative flex items-center ${isLeft ? "flex-row-reverse" : "flex-row"} gap-3`}
                      >
                        {/* connector line from main card down to branch */}
                        <div
                          className="h-0.5 w-6 flex-shrink-0"
                          style={{ backgroundColor: colors[milestone.type], opacity: 0.4 }}
                        />
                        <div
                          className="bg-white rounded-md py-3 px-4 shadow-sm border"
                          style={{ borderColor: colors[milestone.type] + "30" }}
                        >
                          <p className="text-sm font-medium text-stone-600 whitespace-nowrap">
                            {branch.title}
                          </p>
                        </div>
                      </div>
                    ))}
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