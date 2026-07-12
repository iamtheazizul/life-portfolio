export default function TimelineWithLine() {
  const milestones = [
    {
      id: 1,
      year: "2026",
      title: "Senior Year - Spring",
      type: "course",
      branches: [
        { id: "1a", title: "Comp & Complexity" },
        { id: "1b", title: "Artificial Intelligence" },
        { id: "1c", title: "Imm & US Color Lines" },
        { id: "1d", title: "Elementary Spanish I" },
      ],
    },
    {
      id: 1,
      year: "2025",
      title: "Senior Year - Fall",
      type: "course",
      branches: [
        { id: "1a", title: "Programming Langs" },
        { id: "1b", title: "Cybersecurity" },
        { id: "1c", title: "Intro to Computer Org" },
        { id: "1d", title: "CS Tools Bootcamp" },
        { id: "1e", title: "PM Seminar"},
        { id: "1f", title: "PM Experience" },
        { id: "1g", title: "Political Sociology" },
      ],
    },
    {
      id: 1,
      year: "2025",
      title: "Junior Year - 3rd Term",
      type: "course",
      branches: [
        { id: "1a", title: "Distributed Systems and Fields" },
        { id: "1b", title: "Machine Learning" },
        { id: "1c", title: "Digital Electronics" }
      ],
    },
    {
      id: 2,
      year: "2025",
      title: "Junior Year - 2nd Term",
      type: "course",
      branches: [
        { id: "2a", title: "Systems" },
        { id: "2b", title: "Embedded Systems" },
        { id: "2c", title: "AR/VR Development" }
      ],
    },
    {
      id: 3,
      year: "2024",
      title: "Junior Year - 1st Term",
      type: "course",
      branches: [
        { id: "3a", title: "Intro to Engineering" },
        { id: "3b", title: "Discrete and Probabilistic Systems" },
        { id: "3c", title: "Urban Applications of GIS" }
      ],
    },
    {
      id: 4,
      year: "2024",
      title: "Sophomore Year - Spring",
      type: "course",
      branches: [
        { id: "4a", title: "Algorithms" },
        { id: "4b", title: "Intro Physics II" },
        { id: "4c", title: "Stats for Social Science" },
        { id: "4d", title: "Leisure & Fun in MidEast" },
        { id: "4e", title: "IdeaLab Special Topics" }

      ],
    },
    {
      id: 5,
      year: "2023",
      title: "Sophomore Year - Fall",
      type: "course",
      branches: [
        { id: "5a", title: "Class Study of Piano" },
        { id: "5b", title: "Software Design" },
        { id: "5c", title: "Linear Algebra"},
        { id: "5d", title: "Intro to Macroeconomics" },
        { id: "5e", title: "Sociological Perspectives" },
        { id: "5f", title: "Self-Paced Fitness" }
      ],
    },
    {
      id: 6,
      year: "2023",
      title: "Freshmen Year - Spring",
      type: "course",
      branches: [
        { id: "6a", title: "Data Structures & Math" },
        { id: "6b", title: "Calc III" },
        { id: "6c", title: "Intro to Microeconomics" },
        { id: "6d", title: "Writing Seminar" },
        { id: "6e", title: "Sociological Research" }
      ],
    },
    {
      id: 7,
      year: "2022",
      title: "Freshmen Year - Fall",
      type: "course",
      branches: [
        { id: "7a", title: "Intro to Comp. Sci." },
        { id: "7b", title: "Mapping the Soc. World" },
        { id: "7c", title: "Writing Seminar" },
        { id: "7d", title: "Principles of Chemistry" }
      ],
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

                    {/* Branches (side projects) - one vertical line with ticks out to each branch */}
                    {milestone.branches?.length > 0 && (
                      // this is working for the vertical line on sub-branches
                      <div
                        className={`flex flex-col gap-4 ${
                          isLeft ? "items-end pr-4 border-r-2" : "items-start pl-4 border-l-2"
                        }`}
                        style={{ borderColor: colors[milestone.type] }}
                      > 
                        {/* horizontal line for sub-branches start here*/}
                        {milestone.branches.map((branch) => (
                          <div key={branch.id} className="relative">
                            {/* horizontal tick from the vertical line to this branch */}
                            <div
                              className="absolute top-1/2 h-0.5 w-4"
                              style={{
                                backgroundColor: colors[milestone.type],
                                transform: "translateY(-50%)",
                                [isLeft ? "right" : "left"]: "-16px",
                              }}
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
                    )}
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