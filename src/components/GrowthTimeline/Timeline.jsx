import { useState } from "react";
import BranchList from "./BranchList";
import DetailModal from "./DetailModal";

export default function TimelineWithLine() {
  const milestones = [
    {
      id: 1,
      year: "2026",
      title: "Senior Year - Spring",
      type: "course",
      branches: [
        { id: "1a", title: "Comp & Complexity", details: { title: "Comp & Complexity", description: "", image: null, links: [] } },
        { id: "1b", title: "Artificial Intelligence", details: { title: "Artificial Intelligence", description: "", image: null, links: [] } },
        { id: "1c", title: "Imm & US Color Lines", details: { title: "Imm & US Color Lines", description: "", image: null, links: [] } },
        { id: "1d", title: "Elementary Spanish I", details: { title: "Elementary Spanish I", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 1,
      year: "2025",
      title: "Senior Year - Fall",
      type: "course",
      branches: [
        { id: "1a", title: "Programming Langs", details: { title: "Programming Langs", description: "", image: null, links: [] } },
        { id: "1b", title: "Cybersecurity", details: { title: "Cybersecurity", description: "", image: null, links: [] } },
        { id: "1c", title: "Intro to Computer Org", details: { title: "Intro to Computer Org", description: "", image: null, links: [] } },
        { id: "1d", title: "CS Tools Bootcamp", details: { title: "CS Tools Bootcamp", description: "", image: null, links: [] } },
        { id: "1e", title: "PM Seminar", details: { title: "PM Seminar", description: "", image: null, links: [] } },
        { id: "1f", title: "PM Experience", details: { title: "PM Experience", description: "", image: null, links: [] } },
        { id: "1g", title: "Political Sociology", details: { title: "Political Sociology", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 1,
      year: "2025",
      title: "Junior Year - 3rd Term",
      type: "course",
      branches: [
        { id: "1a", title: "Distributed Systems and Fields", details: { title: "Distributed Systems and Fields", description: "", image: null, links: [] } },
        { id: "1b", title: "Machine Learning", details: { title: "Machine Learning", description: "", image: null, links: [] } },
        { id: "1c", title: "Digital Electronics", details: { title: "Digital Electronics", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 2,
      year: "2025",
      title: "Junior Year - 2nd Term",
      type: "course",
      branches: [
        { id: "2a", title: "Systems", details: { title: "Systems", description: "", image: null, links: [] } },
        { id: "2b", title: "Embedded Systems", details: { title: "Embedded Systems", description: "Mucho gusto", image: null, links: [] } },
        { id: "2c", title: "AR/VR Development", details: { title: "AR/VR Development", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 3,
      year: "2024",
      title: "Junior Year - 1st Term",
      type: "course",
      branches: [
        { id: "3a", title: "Intro to Engineering", details: { title: "Intro to Engineering", description: "", image: null, links: [] } },
        { id: "3b", title: "Discrete and Probabilistic Systems", details: { title: "Discrete and Probabilistic Systems", description: "", image: null, links: [] } },
        { id: "3c", title: "Urban Applications of GIS", details: { title: "Urban Applications of GIS", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 4,
      year: "2024",
      title: "Sophomore Year - Spring",
      type: "course",
      branches: [
        { id: "4a", title: "Algorithms", details: { title: "Algorithms", description: "", image: null, links: [] } },
        { id: "4b", title: "Intro Physics II", details: { title: "Intro Physics II", description: "", image: null, links: [] } },
        { id: "4c", title: "Stats for Social Science", details: { title: "Stats for Social Science", description: "", image: null, links: [] } },
        { id: "4d", title: "Leisure & Fun in MidEast", details: { title: "Leisure & Fun in MidEast", description: "", image: null, links: [] } },
        { id: "4e", title: "IdeaLab Special Topics", details: { title: "IdeaLab Special Topics", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 5,
      year: "2023",
      title: "Sophomore Year - Fall",
      type: "course",
      branches: [
        { id: "5a", title: "Class Study of Piano", details: { title: "Class Study of Piano", description: "", image: null, links: [] } },
        { id: "5b", title: "Software Design", details: { title: "Software Design", description: "", image: null, links: [] } },
        { id: "5c", title: "Linear Algebra", details: { title: "Linear Algebra", description: "", image: null, links: [] } },
        { id: "5d", title: "Intro to Macroeconomics", details: { title: "Intro to Macroeconomics", description: "", image: null, links: [] } },
        { id: "5e", title: "Sociological Perspectives", details: { title: "Sociological Perspectives", description: "", image: null, links: [] } },
        { id: "5f", title: "Self-Paced Fitness", details: { title: "Self-Paced Fitness", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 6,
      year: "2023",
      title: "Freshmen Year - Spring",
      type: "course",
      branches: [
        { id: "6a", title: "Data Structures & Math", details: { title: "Data Structures & Math", description: "", image: null, links: [] } },
        { id: "6b", title: "Calc III", details: { title: "Calc III", description: "", image: null, links: [] } },
        { id: "6c", title: "Intro to Microeconomics", details: { title: "Intro to Microeconomics", description: "", image: null, links: [] } },
        { id: "6d", title: "Writing Seminar", details: { title: "Writing Seminar", description: "", image: null, links: [] } },
        { id: "6e", title: "Sociological Research", details: { title: "Sociological Research", description: "", image: null, links: [] } },
      ],
    },
    {
      id: 7,
      year: "2022",
      title: "Freshmen Year - Fall",
      type: "course",
      branches: [
        { id: "7a", title: "Intro to Comp. Sci.", details: { title: "Intro to Comp. Sci.", description: "", image: null, links: [] } },
        { id: "7b", title: "Mapping the Soc. World", details: { title: "Mapping the Soc. World", description: "", image: null, links: [] } },
        { id: "7c", title: "Writing Seminar", details: { title: "Writing Seminar", description: "", image: null, links: [] } },
        { id: "7d", title: "Principles of Chemistry", details: { title: "Principles of Chemistry", description: "", image: null, links: [] } },
      ],
    },
  ];

  const colors = {
    course: "#5B8CA6",
    project: "#6E9C5C",
    achievement: "#D99A3C",
  };

  // ---- STATE ----
  const [expandedIds, setExpandedIds] = useState({});
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // ---- FUNCTIONS ----
  function toggleBranches(idx) {
    setExpandedIds((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function openDetails(details, color) {
    if (details) {
      setSelectedDetails(details);
      setSelectedColor(color);
    }
  }

  function handleMilestoneDotClick(milestone, idx) {
    const hasBranches = milestone.branches && milestone.branches.length > 0;
    if (hasBranches) {
      toggleBranches(idx);
    } else {
      openDetails(milestone.details, colors[milestone.type]);
    }
  }

  return (
    <div className="p-8 bg-[#FAF6EC] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">My Journey</h1>

      <div className="relative mx-auto" style={{ width: "900px" }}>
        <div
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#6E9C5C]"
          style={{ transform: "translateX(-50%)" }}
        />

        <div className="space-y-10">
          {milestones.map((milestone, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className="relative" style={{ minHeight: "100px" }}>
                <div
                  onClick={() => handleMilestoneDotClick(milestone, idx)}
                  className="absolute left-1/2 w-6 h-6 rounded-full border-4 border-[#FAF6EC] z-10 cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    top: "56px",
                    backgroundColor: colors[milestone.type],
                    transform: "translate(-50%, -50%)",
                  }}
                />

                <div
                  className={`flex ${isLeft ? "justify-end pr-20" : "justify-start pl-20 ml-auto"}`}
                  style={{ width: "50%", marginLeft: isLeft ? "0" : "50%" }}
                >
                  <div className={`flex flex-col gap-3 flex-shrink-0 w-56 ${isLeft ? "items-end" : "items-start"}`}>
                    <div className="bg-white rounded-lg p-8 shadow-sm w-56">
                      <span className="text-sm font-semibold" style={{ color: colors[milestone.type] }}>
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-stone-800 mt-3">
                        {milestone.title}
                      </h3>
                    </div>

                    <BranchList
                      branches={milestone.branches}
                      isLeft={isLeft}
                      color={colors[milestone.type]}
                      isOpen={!!expandedIds[idx]}
                      onBranchClick={openDetails}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DetailModal
        details={selectedDetails}
        color={selectedColor}
        onClose={() => setSelectedDetails(null)}
      />
    </div>
  );
}