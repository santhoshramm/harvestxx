import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ role, children }) {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
}
