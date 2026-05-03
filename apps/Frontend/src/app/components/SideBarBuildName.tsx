import { LayoutSideContent } from "@gravity-ui/icons";

function SideBarBuildName() {
  return (
    <div className="border-b border-slate-200 px-4 py-3 flex items-center gap-2">
      <button>
        <LayoutSideContent/>
      </button>
      <h2 className="text-md text-slate-800 tracking-wide">
        Building Project Name
      </h2>
    </div>
  );
}

export default SideBarBuildName;
