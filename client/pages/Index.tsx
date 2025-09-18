import { useMemo } from "react";
import StatusCard from "@/components/common/StatusCard";
import ContractorStatsChart from "@/components/charts/ContractorStatsChart";
import ContractorKpisChart from "@/components/charts/ContractorKpisChart";
import RequesterBarChart from "@/components/charts/RequesterBarChart";
import RequesterLineChart from "@/components/charts/RequesterLineChart";
import {
  FileText,
  CheckCircle2,
  Clock4,
  Undo2,
  PauseCircle,
  XCircle,
} from "lucide-react";

export default function Index() {
  const counters = useMemo(
    () => ({
      new: 12,
      approved: 48,
      pending: 7,
      returned: 3,
      hold: 5,
      rejected: 2,
    }),
    [],
  );

  // Get user role - replace this with your actual authentication logic
  const userRole = getCurrentUserRole(); // This should come from your auth context/store
  const isRequester = userRole === "requester";

  return (
    <div className="space-y-6">
      <section
        aria-label="Status cards"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <StatusCard
          title="New Permits"
          count={counters.new}
          Icon={FileText}
          accentClass="from-[#f44336]/40 to-transparent"
          to="/permit-details"
        />
        <StatusCard
          title="Approved Permits"
          count={counters.approved}
          Icon={CheckCircle2}
          accentClass="from-[#4caf50]/40 to-transparent"
          to="/overall-status"
        />
        <StatusCard
          title="Pending Approval Permits"
          count={counters.pending}
          Icon={Clock4}
          accentClass="from-[#ff9800]/40 to-transparent"
          to="/overall-status"
        />
        <StatusCard
          title="Returned Permits"
          count={counters.returned}
          Icon={Undo2}
          accentClass="from-yellow-400/40 to-transparent"
          to="/permit-details"
        />
        <StatusCard
          title="Permits under Hold"
          count={counters.hold}
          Icon={PauseCircle}
          accentClass="from-purple-500/40 to-transparent"
          to="/overall-status"
        />
        <StatusCard
          title="Permits Rejected"
          count={counters.rejected}
          Icon={XCircle}
          accentClass="from-[#f44336]/40 to-transparent"
          to="/overall-status"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {isRequester ? (
          // Requester view - components handle their own styling
          <>
            <div className="lg:col-span-2">
              <RequesterBarChart />
            </div>
            <div>
              <RequesterLineChart />
            </div>
          </>
        ) : (
          // Contractor/other roles view - dashboard provides styling
          <>
            <div className="lg:col-span-2 bg-white rounded-card shadow-card">
              <div className="bg-[#f44336] text-white px-4 py-2 rounded-t-card font-medium">
                Contractor Statistics
              </div>
              <div className="p-5">
                <div className="mb-2 text-sm text-gray-500 flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 bg-gray-200 rounded"
                    aria-hidden
                  />
                  <span>Bar graph - hover for details</span>
                </div>
                <ContractorStatsChart />
              </div>
            </div>
            <div className="bg-white rounded-card shadow-card">
              <div className="bg-[#f44336] text-white px-4 py-2 rounded-t-card font-medium">
                Contractor KPIs
              </div>
              <div className="p-5">
                <ContractorKpisChart />
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// Helper function to get current user role from localStorage
function getCurrentUserRole() {
  try {
    return localStorage.getItem("dps_role") || "requester";
  } catch (e) {
    // Fallback if localStorage is not available
    return "requester";
  }
}
