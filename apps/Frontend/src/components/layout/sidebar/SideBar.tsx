import SideBarButton from "./SideBarButton";
import SideBarSeccion from "./SideBarSeccion";
import SideBarBuildName from "./SideBarBuildName";
import {
  Bell,
  BellFill,
  Calendar,
  CircleExclamation,
  PaperPlane,
} from "@gravity-ui/icons";

function SideBar() {
  return (
    <div className="col-span-2 bg-slate-50 border-r border-slate-200 min-h-full">
      <SideBarBuildName />

      <SideBarSeccion icon={<PaperPlane />} text="Project Overview">
        <SideBarButton text="Home" />
        <SideBarButton text="Dashboard" />
      </SideBarSeccion>

      <SideBarSeccion icon={<CircleExclamation />} text="Alerts">
        <SideBarButton text="All Alerts" />
        <SideBarButton text="Active Alerts" />
      </SideBarSeccion>

      <SideBarSeccion icon={<Calendar />} text="Tasks">
        <SideBarButton text="Gantt Diagram" />
        <SideBarButton text="Calendar" />
      </SideBarSeccion>
    </div>
  );
}

export default SideBar;
