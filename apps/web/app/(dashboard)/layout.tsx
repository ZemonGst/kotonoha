import { Sidebar } from "~/components/dashboard/Sidebar";
import { Topbar } from "~/components/dashboard/Topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-root">
            <Sidebar />
            <div className="dashboard-main">
                <Topbar />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}