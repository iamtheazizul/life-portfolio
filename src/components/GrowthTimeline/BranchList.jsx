export default function BranchList({ branches, isLeft, color, isOpen, onBranchClick }) {
  if (!branches || branches.length === 0) return null;

  return (
    <div
      className={`grid transition-all duration-300 ease-in-out w-full ${
        isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
      }`}
    >
      <div className="overflow-hidden">
        <div
          className={`flex flex-col gap-4 ${
            isLeft ? "items-end pr-4 border-r-2" : "items-start pl-4 border-l-2"
          }`}
          style={{ borderColor: color }}
        >
          {branches.map((branch) => (
            <div key={branch.id} className="relative">
              <div
                className="absolute top-1/2 h-0.5 w-4"
                style={{
                  backgroundColor: color,
                  transform: "translateY(-50%)",
                  [isLeft ? "right" : "left"]: "-16px",
                }}
              />
              <button
                onClick={() => onBranchClick(branch.details, color)}
                className="bg-white rounded-md py-3 px-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                style={{ borderColor: color + "30" }}
              >
                <p className="text-sm font-medium text-stone-600 whitespace-nowrap">
                  {branch.title}
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}