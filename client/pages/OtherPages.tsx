import React from "react";
import {
  PermitItem,
  PermitStatusTable,
  SortState,
} from "@/components/permit/PermitStatusTable";
import { PermitStatusCard } from "@/components/permit/PermitStatusCard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatISO, subDays } from "date-fns";

function makeMockData(count = 24): PermitItem[] {
  const plants = ["HSM-1", "HSM-2", "CRM", "BOF", "DRI", "Sinter", "Utilities"];
  const depts = ["Maintenance", "Operations", "Safety", "Projects", "Quality"];
  const requesters = [
    "A. Sharma",
    "R. Patel",
    "S. Khan",
    "M. Gupta",
    "J. Singh",
    "P. Verma",
  ];
  const approvers = ["V. Rao", "D. Mehta", "K. Iyer", "N. Das", "L. Roy"];
  const statuses: PermitItem["status"][] = [
    "approved",
    "pending",
    "rejected",
    "in_progress",
  ];

  return Array.from({ length: count }).map((_, i) => {
    const issued = subDays(new Date(), Math.floor(Math.random() * 20));
    const isApproved = Math.random() < 0.45;
    const returnDate = isApproved
      ? subDays(new Date(), Math.floor(Math.random() * 5))
      : undefined;
    return {
      id: `${i + 1}`,
      sn: i + 1,
      plant: plants[i % plants.length],
      dept: depts[(i + 2) % depts.length],
      date: formatISO(issued),
      permitNo: `PTW-${2024 + (i % 2)}-${String(1000 + i)}`,
      requester: requesters[i % requesters.length],
      approver1: approvers[(i + 1) % approvers.length],
      approver2:
        Math.random() > 0.5 ? approvers[(i + 3) % approvers.length] : undefined,
      safetyApprover:
        Math.random() > 0.3 ? approvers[(i + 2) % approvers.length] : undefined,
      returnDate: returnDate ? formatISO(returnDate) : undefined,
      commentsRequester:
        Math.random() > 0.4
          ? "Work on pump alignment and coupling replacement scheduled with safety barriers in place."
          : undefined,
      commentsApprover:
        Math.random() > 0.6
          ? "Proceed with caution near hot zones, ensure gas testing prior to confined space entry."
          : undefined,
      status: isApproved ? "approved" : statuses[i % statuses.length],
    };
  });
}

export function OverallStatus() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<PermitItem[]>([]);
  const [sort, setSort] = React.useState<SortState | null>({
    key: "date",
    dir: "desc",
  });

  React.useEffect(() => {
    const t = setTimeout(() => {
      setData(makeMockData(32));
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">
          Overall Permit Status
        </h2>
      </div>

      {/* Desktop (xl+) and Tablets (md-lg): Responsive table with horizontal scroll */}
      <div className="hidden md:block">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <PermitStatusTable data={data} sort={sort} setSort={setSort} />
        )}
      </div>

      {/* Mobile and Tablet Portrait (< md): Card-based layout */}
      <div className="md:hidden">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {data.map((item) => (
              <PermitStatusCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ContractorPerformance() {
  const contractors = React.useMemo(
    () => [
      {
        id: "c1",
        name: "Alpha Contractors",
        supervisor: "R. Patel",
        address: "Unit 12, Industrial Park",
        workingFrom: "2018",
      },
      {
        id: "c2",
        name: "Beta Services",
        supervisor: "M. Gupta",
        address: "Sector 5, Plant Road",
        workingFrom: "2020",
      },
      {
        id: "c3",
        name: "Gamma Works",
        supervisor: "S. Khan",
        address: "Yard 3",
        workingFrom: "2016",
      },
    ],
    [],
  );

  const defaultRangeFrom = React.useCallback(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  }, []);
  const defaultRangeTo = React.useCallback(
    () => new Date().toISOString().slice(0, 10),
    [],
  );

  const [selected, setSelected] = React.useState(contractors[0].id);
  const [viewTable, setViewTable] = React.useState(false);
  const [rangeFrom, setRangeFrom] = React.useState(() => defaultRangeFrom());
  const [rangeTo, setRangeTo] = React.useState(() => defaultRangeTo());

  // generate mock timeseries for selected contractor
  const rawData = React.useMemo(() => {
    const to = new Date(rangeTo);
    const from = new Date(rangeFrom);
    const days: any[] = [];
    const msDay = 24 * 60 * 60 * 1000;
    for (let t = from.getTime(); t <= to.getTime(); t += msDay) {
      const d = new Date(t);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      const base = Math.round(20 + Math.sin(t / 5e8) * 10 + Math.random() * 6);
      days.push({
        date: label,
        permitsIssued: base + Math.floor(Math.random() * 5),
        permitsReturnedOnTime: Math.max(
          0,
          base - Math.floor(Math.random() * 4),
        ),
        pendingPermits: Math.max(0, Math.floor(Math.random() * 10)),
        safetyIssues: Math.floor(Math.random() * 3),
        permitsRejected: Math.floor(Math.random() * 2),
      });
    }
    return days;
  }, [selected, rangeFrom, rangeTo]);

  const totals = React.useMemo(() => {
    return rawData.reduce(
      (acc, r) => {
        acc.permitsIssued += r.permitsIssued;
        acc.permitsReturnedOnTime += r.permitsReturnedOnTime;
        acc.pendingPermits += r.pendingPermits;
        acc.safetyIssues += r.safetyIssues;
        acc.permitsRejected += r.permitsRejected;
        return acc;
      },
      {
        permitsIssued: 0,
        permitsReturnedOnTime: 0,
        pendingPermits: 0,
        safetyIssues: 0,
        permitsRejected: 0,
      },
    );
  }, [rawData]);

  const [hiddenMetrics, setHiddenMetrics] = React.useState<
    Record<string, boolean>
  >({});
  const toggleMetric = (key: string) =>
    setHiddenMetrics((s) => ({ ...s, [key]: !s[key] }));

  const resetFilters = () => {
    setSelected(contractors[0].id);
    setViewTable(false);
    setRangeFrom(defaultRangeFrom());
    setRangeTo(defaultRangeTo());
    setHiddenMetrics({});
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div />
        <div className="flex items-center gap-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Details panel */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-card p-4 space-y-3">
            <h3 className="text-red-600 font-bold">Contractor Details :</h3>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground mb-1">
                Company Name
              </label>
              <Select value={selected} onValueChange={(v) => setSelected(v)}>
                <SelectTrigger className="h-9 w-44 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contractors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <label className="text-sm text-muted-foreground">
                  Supervisor Name
                </label>
                <div className="mt-1">
                  {contractors.find((c) => c.id === selected)?.supervisor}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                <div className="mt-1">
                  {contractors.find((c) => c.id === selected)?.address}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Working from
                </label>
                <div className="mt-1">
                  {contractors.find((c) => c.id === selected)?.workingFrom}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Company name selectable, once selected all details to be shown
                automatically
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-9">
          <div className="bg-white rounded-lg shadow-card p-4">
            {/* KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-cardHover transition transform hover:-translate-y-1 flex items-center gap-3">
                <div className="w-1 h-12 bg-blue-500 rounded" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Permits Issued
                  </div>
                  <div className="text-xl font-semibold">
                    {totals.permitsIssued}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-cardHover transition transform hover:-translate-y-1 flex items-center gap-3">
                <div className="w-1 h-12 bg-green-500 rounded" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Returned On Time
                  </div>
                  <div className="text-xl font-semibold">
                    {totals.permitsReturnedOnTime}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-cardHover transition transform hover:-translate-y-1 flex items-center gap-3">
                <div className="w-1 h-12 bg-orange-500 rounded" />
                <div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-xl font-semibold">
                    {totals.pendingPermits}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-cardHover transition transform hover:-translate-y-1 flex items-center gap-3">
                <div className="w-1 h-12 bg-red-500 rounded" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Safety Issues
                  </div>
                  <div className="text-xl font-semibold">
                    {totals.safetyIssues}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow-cardHover transition transform hover:-translate-y-1 flex items-center gap-3">
                <div className="w-1 h-12 bg-purple-500 rounded" />
                <div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                  <div className="text-xl font-semibold">
                    {totals.permitsRejected}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart controls */}
            <div className="flex items-center justify-between mb-3 gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm">Date range</label>
                <input
                  type="date"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className="h-9 rounded-md border px-2"
                />
                <input
                  type="date"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className="h-9 rounded-md border px-2"
                />
                <button
                  onClick={() => {
                    setRangeFrom(new Date().toISOString().slice(0, 10));
                    setRangeTo(new Date().toISOString().slice(0, 10));
                  }}
                  className="text-sm px-2 py-1 border rounded"
                >
                  Today
                </button>
                <button
                  onClick={resetFilters}
                  className="text-sm px-2 py-1 border rounded"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewTable((v) => !v)}
                  className="px-3 py-1 border rounded"
                >
                  {viewTable ? "Chart" : "Table"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 border rounded"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Chart or table */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { key: "permitsIssued", label: "Issued", color: "bg-blue-500" },
                {
                  key: "permitsReturnedOnTime",
                  label: "Returned",
                  color: "bg-green-500",
                },
                {
                  key: "pendingPermits",
                  label: "Pending",
                  color: "bg-orange-500",
                },
                { key: "safetyIssues", label: "Safety", color: "bg-red-500" },
                {
                  key: "permitsRejected",
                  label: "Rejected",
                  color: "bg-purple-500",
                },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => toggleMetric(m.key)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 border ${
                    hiddenMetrics[m.key] ? "opacity-40" : ""
                  }`}
                >
                  <span className={`${m.color} w-2 h-2 rounded-full`} />
                  {m.label}
                </button>
              ))}
            </div>
            <div style={{ width: "100%", height: 360 }}>
              {!viewTable ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={rawData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend onClick={(e: any) => toggleMetric(e.dataKey)} />

                    {!hiddenMetrics.permitsIssued && (
                      <Line
                        type="monotone"
                        dataKey="permitsIssued"
                        stroke="#1f77b4"
                        dot
                      />
                    )}
                    {!hiddenMetrics.permitsReturnedOnTime && (
                      <Line
                        type="monotone"
                        dataKey="permitsReturnedOnTime"
                        stroke="#2ca02c"
                        dot
                      />
                    )}
                    {!hiddenMetrics.pendingPermits && (
                      <Line
                        type="monotone"
                        dataKey="pendingPermits"
                        stroke="#ff7f0e"
                        dot
                      />
                    )}
                    {!hiddenMetrics.safetyIssues && (
                      <Line
                        type="monotone"
                        dataKey="safetyIssues"
                        stroke="#d62728"
                        dot
                      />
                    )}
                    {!hiddenMetrics.permitsRejected && (
                      <Line
                        type="monotone"
                        dataKey="permitsRejected"
                        stroke="#9467bd"
                        dot
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Issued</th>
                        <th className="p-2 border">Returned On Time</th>
                        <th className="p-2 border">Pending</th>
                        <th className="p-2 border">Safety Issues</th>
                        <th className="p-2 border">Rejected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rawData.map((r, idx) => (
                        <tr key={idx} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 border">{r.date}</td>
                          <td className="p-2 border">{r.permitsIssued}</td>
                          <td className="p-2 border">
                            {r.permitsReturnedOnTime}
                          </td>
                          <td className="p-2 border">{r.pendingPermits}</td>
                          <td className="p-2 border">{r.safetyIssues}</td>
                          <td className="p-2 border">{r.permitsRejected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

export function Alarms() {
  type Alarm = {
    id: string;
    alarmNo: string;
    level: "critical" | "high" | "medium" | "low" | "info" | "resolved";
    message: string;
    device: string;
    eventTime: string;
    recoveredTime?: string | null;
    acknowledged: boolean;
    resolved: boolean;
  };

  const makeAlarms = (count = 28): Alarm[] => {
    const levels: Alarm["level"][] = [
      "critical",
      "high",
      "medium",
      "low",
      "info",
    ];
    const devices = ["PLC-12", "HSM-1", "Comms-GW", "Sensor-22", "Boiler-1"];
    const msgs = [
      "Overpressure detected in vessel A",
      "Unauthorized access to control room",
      "Temperature exceeded threshold",
      "Vibration spike detected",
      "Communication timeout with remote node",
    ];
    const now = Date.now();
    return Array.from({ length: count }).map((_, i) => {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const event = new Date(
        now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 5),
      );
      const recovered =
        Math.random() > 0.6
          ? new Date(
              event.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24),
            )
          : null;
      return {
        id: String(i + 1),
        alarmNo: `AL-${2024}-${1000 + i}`,
        level,
        message: msgs[i % msgs.length],
        device: devices[i % devices.length],
        eventTime: event.toISOString().replace("T", " ").split(".")[0],
        recoveredTime: recovered
          ? recovered.toISOString().replace("T", " ").split(".")[0]
          : null,
        acknowledged: Math.random() > 0.6,
        resolved: Boolean(recovered),
      };
    });
  };

  const [alarms, setAlarms] = React.useState<Alarm[]>(() => makeAlarms());
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = React.useState<string | null>(
    null,
  );
  const [dateFrom, setDateFrom] = React.useState<string | null>(null);
  const [dateTo, setDateTo] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(alarms.length / pageSize));
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [detailAlarm, setDetailAlarm] = React.useState<Alarm | null>(null);

  // debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // auto refresh simulation
  React.useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setAlarms((prev) => {
        // prepend a possible new alarm occasionally
        const addNew = Math.random() > 0.7;
        const base = addNew ? makeAlarms(1) : [];
        const next = [...base, ...prev].slice(0, 200);
        return next;
      });
    }, 45000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter(null);
    setPriorityFilter(null);
    setDateFrom(null);
    setDateTo(null);
    setSelected({});
  };

  const filtered = React.useMemo(() => {
    return alarms.filter((a) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !`${a.alarmNo} ${a.message} ${a.device} ${a.level}`
            .toLowerCase()
            .includes(q)
        )
          return false;
      }
      if (priorityFilter && a.level !== priorityFilter) return false;
      if (dateFrom && new Date(a.eventTime) < new Date(dateFrom)) return false;
      if (dateTo && new Date(a.eventTime) > new Date(dateTo + "T23:59:59"))
        return false;
      return true;
    });
  }, [alarms, debouncedSearch, priorityFilter, dateFrom, dateTo]);

  const current = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const toggleSelect = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  const selectAllOnPage = () => {
    const obj: Record<string, boolean> = {};
    current.forEach((a) => (obj[a.id] = true));
    setSelected((s) => ({ ...s, ...obj }));
  };
  const clearSelection = () => setSelected({});

  const acknowledgeSelected = (ack = true) => {
    setAlarms((prev) =>
      prev.map((a) => (selected[a.id] ? { ...a, acknowledged: ack } : a)),
    );
    setSelected({});
  };
  const resolveSelected = () => {
    setAlarms((prev) =>
      prev.map((a) =>
        selected[a.id]
          ? {
              ...a,
              resolved: true,
              recoveredTime: new Date()
                .toISOString()
                .replace("T", " ")
                .split(".")[0],
            }
          : a,
      ),
    );
    setSelected({});
  };
  const exportCSV = () => {
    const rows = filtered.map((a) =>
      [
        a.id,
        a.alarmNo,
        a.level,
        a.message,
        a.device,
        a.eventTime,
        a.recoveredTime || "",
      ].join(","),
    );
    const csv = [
      "No,AlarmNo,Level,Message,Device,EventTime,RecoveredTime",
      ...rows,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alarms.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const unackCount = alarms.filter(
    (a) => !a.acknowledged && !a.resolved,
  ).length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* table area */}
        <div className="lg:col-span-8 lg:order-first order-last">
          <div className="bg-card border p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div />

              <div />
            </div>

            {/* table for md+ */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead className="w-12">
                      {/* select all on current page */}
                      {(() => {
                        const allSelectedOnPage =
                          current.length > 0 &&
                          current.every((a) => !!selected[a.id]);
                        const deselectPage = () => {
                          setSelected((prev) => {
                            const copy = { ...prev };
                            current.forEach((a) => delete copy[a.id]);
                            return copy;
                          });
                        };
                        return (
                          <Checkbox
                            checked={allSelectedOnPage}
                            onCheckedChange={(v) => {
                              if (v) selectAllOnPage();
                              else deselectPage();
                            }}
                          />
                        );
                      })()}
                    </TableHead>
                    <TableHead>No.</TableHead>
                    <TableHead>Alarm</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Event Time</TableHead>
                    <TableHead>Recovered Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {current.map((a, idx) => (
                    <TableRow
                      key={a.id}
                      className={
                        a.resolved
                          ? "opacity-70"
                          : a.level === "critical" || a.level === "high"
                            ? "font-semibold"
                            : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={!!selected[a.id]}
                          onCheckedChange={(v) =>
                            setSelected((s) => ({ ...s, [a.id]: !!v }))
                          }
                        />
                      </TableCell>
                      <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-10 rounded ${
                              a.level === "critical" || a.level === "high"
                                ? "bg-red-500"
                                : a.level === "medium"
                                  ? "bg-orange-400"
                                  : a.level === "low"
                                    ? "bg-green-400"
                                    : "bg-blue-400"
                            }`}
                          />
                          <div>
                            <div className="text-sm">
                              {a.alarmNo} — {a.message}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Level: {a.level}
                              {a.resolved
                                ? " • Resolved"
                                : a.acknowledged
                                  ? " • Acknowledged"
                                  : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{a.device}</TableCell>
                      <TableCell>{a.eventTime}</TableCell>
                      <TableCell>{a.recoveredTime || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-sm px-2 py-1 rounded-md bg-gray-100"
                            onClick={() => setDetailAlarm(a)}
                          >
                            Details
                          </button>
                          <button
                            className="text-sm px-2 py-1 rounded-md bg-primary text-white"
                            onClick={() => {
                              setAlarms((prev) =>
                                prev.map((p) =>
                                  p.id === a.id
                                    ? { ...p, acknowledged: true }
                                    : p,
                                ),
                              );
                            }}
                          >
                            {a.acknowledged ? "Ackd" : "Ack"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.slice(0, 20).map((a) => (
                <div
                  key={a.id}
                  className={`bg-white p-3 rounded-lg shadow-sm border-l-4 ${
                    a.level === "critical" || a.level === "high"
                      ? "border-red-500"
                      : a.level === "medium"
                        ? "border-orange-400"
                        : a.level === "low"
                          ? "border-green-400"
                          : "border-blue-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{a.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.device} • {a.eventTime}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs">{a.level.toUpperCase()}</div>
                      <div className="flex gap-1">
                        <button
                          className="text-xs px-2 py-1 rounded bg-primary text-white"
                          onClick={() =>
                            setAlarms((prev) =>
                              prev.map((p) =>
                                p.id === a.id
                                  ? { ...p, acknowledged: true }
                                  : p,
                              ),
                            )
                          }
                        >
                          Ack
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded border"
                          onClick={() => setDetailAlarm(a)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  ‹ Prev
                </Button>
                <div className="text-sm font-medium">
                  Page {page} / {totalPages}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                >
                  Next ›
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* right control panel */}
        <aside className="lg:col-span-4 lg:order-last order-first">
          <div className="bg-card border p-4 rounded-lg shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Search</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search alarms"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDebouncedSearch(search)}
                >
                  <p>SEARCH</p>
                </Button>
                <Button size="sm" variant="outline" onClick={clearFilters}>
                  RESET
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Filters</h3>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Priority
                  </label>
                  <Select
                    value={priorityFilter ?? "__all__"}
                    onValueChange={(v) =>
                      setPriorityFilter(v === "__all__" ? null : v)
                    }
                  >
                    <SelectTrigger className="h-9 w-full text-sm">
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">
                    Date range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateFrom || ""}
                      onChange={(e) => setDateFrom(e.target.value || null)}
                    />
                    <Input
                      type="date"
                      value={dateTo || ""}
                      onChange={(e) => setDateTo(e.target.value || null)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-2" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Pagination</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(1)}>
                  <p>FRONT</p>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  ‹
                </Button>
                <div className="px-3 py-1 border rounded-md bg-white shadow-sm">
                  Page {page} / {totalPages}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                >
                  ›
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage(totalPages)}
                >
                  END
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog
        open={!!detailAlarm}
        onOpenChange={(open) => {
          if (!open) setDetailAlarm(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alarm details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {detailAlarm && (
              <>
                <div className="text-sm">
                  <strong>{detailAlarm.alarmNo}</strong> — {detailAlarm.message}
                </div>
                <div className="text-xs text-muted-foreground">
                  Device: {detailAlarm.device}
                </div>
                <div className="text-xs text-muted-foreground">
                  Level: {detailAlarm.level}
                </div>
                <div className="text-xs text-muted-foreground">
                  Event: {detailAlarm.eventTime}
                </div>
                <div className="text-xs text-muted-foreground">
                  Recovered: {detailAlarm.recoveredTime || "-"}
                </div>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setAlarms((prev) =>
                        prev.map((p) =>
                          p.id === detailAlarm.id
                            ? { ...p, acknowledged: true }
                            : p,
                        ),
                      );
                      setDetailAlarm(null);
                    }}
                  >
                    Acknowledge
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function SystemArchitecture() {
  type Node = {
    id: string;
    label: string;
    type: "server" | "db" | "network" | "client" | "security" | "tablet";
    x: number;
    y: number;
    status?: "online" | "offline" | "warn";
  };

  const nodes: Node[] = [
    {
      id: "email",
      label: "Email Server",
      type: "server",
      x: 300,
      y: 50,
      status: "online",
    },
    {
      id: "admin",
      label: "AdminUser",
      type: "server",
      x: 450,
      y: 50,
      status: "online",
    },
    {
      id: "portal",
      label: "Permit Portal",
      type: "server",
      x: 120,
      y: 200,
      status: "online",
    },
    {
      id: "trans",
      label: "Transactional DB",
      type: "db",
      x: 60,
      y: 320,
      status: "online",
    },
    {
      id: "hist",
      label: "Historical DB",
      type: "db",
      x: 180,
      y: 320,
      status: "online",
    },
    {
      id: "firewall",
      label: "Firewall",
      type: "security",
      x: 300,
      y: 160,
      status: "online",
    },
    {
      id: "switch",
      label: "Ethernet Switch",
      type: "network",
      x: 420,
      y: 160,
      status: "online",
    },
    {
      id: "wifi",
      label: "Wifi AP",
      type: "network",
      x: 600,
      y: 160,
      status: "online",
    },
    {
      id: "client1",
      label: "Client 1",
      type: "client",
      x: 360,
      y: 240,
      status: "online",
    },
    {
      id: "client6",
      label: "Client 6",
      type: "client",
      x: 480,
      y: 240,
      status: "online",
    },
    {
      id: "tablet1",
      label: "Tablet-1",
      type: "tablet",
      x: 780,
      y: 80,
      status: "online",
    },
    {
      id: "tablet2",
      label: "Tablet-2",
      type: "tablet",
      x: 780,
      y: 160,
      status: "online",
    },
    {
      id: "tablet6",
      label: "Tablet-6",
      type: "tablet",
      x: 780,
      y: 240,
      status: "online",
    },
  ];

  const edges = [
    { from: "email", to: "firewall", type: "ethernet" },
    { from: "admin", to: "switch", type: "ethernet" },
    { from: "portal", to: "firewall", type: "ethernet" },
    { from: "portal", to: "trans", type: "ethernet" },
    { from: "portal", to: "hist", type: "ethernet" },
    { from: "firewall", to: "switch", type: "ethernet" },
    { from: "switch", to: "wifi", type: "ethernet" },
    { from: "switch", to: "client1", type: "ethernet" },
    { from: "switch", to: "client6", type: "ethernet" },
  ];

  const extraComponents = [
    { id: "client2", label: "Client 2" },
    { id: "client3", label: "Client 3" },
    { id: "client4", label: "Client 4" },
    { id: "client5", label: "Client 5" },
    { id: "tablet3", label: "Tablet-3" },
    { id: "tablet4", label: "Tablet-4" },
    { id: "tablet5", label: "Tablet-5" },
  ];

  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [selectedComponentId, setSelectedComponentId] = React.useState<
    string | null
  >(null);
  const [showWifi, setShowWifi] = React.useState(true);
  const [showEthernet, setShowEthernet] = React.useState(true);
  const [showSecure, setShowSecure] = React.useState(true);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const dragging = React.useRef(false);
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);

  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !dragStart.current) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    dragStart.current = null;
  };

  const zoomIn = () => setScale((s) => Math.min(2, s + 0.1));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.1));
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <div />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 lg:order-first order-last">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="relative overflow-hidden" style={{ height: 400 }}>
              <svg
                ref={svgRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="w-full h-full"
                viewBox="0 0 900 400"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="flow" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#4caf50" />
                    <stop offset="100%" stopColor="#2196f3" />
                  </linearGradient>
                  <filter
                    id="glow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g
                  transform={`translate(${offset.x},${offset.y}) scale(${scale})`}
                >
                  {/* edges */}
                  {edges.map((e, i) => {
                    if (e.type === "wifi" && !showWifi) return null;
                    if (e.type === "ethernet" && !showEthernet) return null;
                    if (e.type === "secure" && !showSecure) return null;
                    const from = nodes.find((n) => n.id === e.from)!;
                    const to = nodes.find((n) => n.id === e.to)!;
                    // primary green for ethernet, lighter dashed for wifi
                    const stroke =
                      e.type === "ethernet"
                        ? "#16a34a"
                        : e.type === "wifi"
                          ? "#16a34a"
                          : "#f97316";
                    const dash =
                      e.type === "wifi"
                        ? "4 4"
                        : e.type === "secure"
                          ? "2 2"
                          : "0";
                    const width =
                      e.type === "ethernet" ? 6 : e.type === "wifi" ? 3 : 4;
                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;
                    return (
                      <g key={i}>
                        <line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={stroke}
                          strokeWidth={width}
                          strokeDasharray={dash}
                          strokeLinecap="round"
                          opacity={0.95}
                        />
                      </g>
                    );
                  })}

                  {/* vertical dotted line between tablets and horizontal dotted between clients */}
                  {(() => {
                    const t2 = nodes.find((n) => n.id === "tablet2");
                    const t6 = nodes.find((n) => n.id === "tablet6");
                    const c1 = nodes.find((n) => n.id === "client1");
                    const c6 = nodes.find((n) => n.id === "client6");
                    const portal = nodes.find((n) => n.id === "portal");
                    const trans = nodes.find((n) => n.id === "trans");
                    const hist = nodes.find((n) => n.id === "hist");
                    if (!t2 && !c1 && !portal) return null;
                    // compute dashed box around portal, trans, hist
                    let box = null;
                    if (portal && trans && hist) {
                      const nodeWidth = 100;
                      const nodeHeight = 36;
                      const padding = 10;
                      const minX = Math.min(
                        portal.x - nodeWidth / 2,
                        trans.x - nodeWidth / 2,
                        hist.x - nodeWidth / 2,
                      );
                      const maxX = Math.max(
                        portal.x + nodeWidth / 2,
                        trans.x + nodeWidth / 2,
                        hist.x + nodeWidth / 2,
                      );
                      const minY = Math.min(
                        portal.y - nodeHeight / 2,
                        trans.y - nodeHeight / 2,
                        hist.y - nodeHeight / 2,
                      );
                      const maxY = Math.max(
                        portal.y + nodeHeight / 2,
                        trans.y + nodeHeight / 2,
                        hist.y + nodeHeight / 2,
                      );
                      const bx = minX - padding;
                      const by = minY - padding;
                      const bw = maxX - minX + padding * 2;
                      const bh = maxY - minY + padding * 2;
                      box = (
                        <rect
                          x={bx}
                          y={by}
                          width={bw}
                          height={bh}
                          rx={8}
                          fill="none"
                          stroke="#b91c1c"
                          strokeWidth={2}
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                        />
                      );
                    }
                    return (
                      <g key="helper-lines">
                        {box}
                        {t2 && t6 && (
                          <line
                            x1={t2.x}
                            y1={t2.y}
                            x2={t6.x}
                            y2={t6.y}
                            stroke="#16a34a"
                            strokeWidth={3}
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            opacity={0.95}
                          />
                        )}
                        {c1 && c6 && (
                          <line
                            x1={c1.x}
                            y1={c1.y}
                            x2={c6.x}
                            y2={c6.y}
                            stroke="#16a34a"
                            strokeWidth={3}
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            opacity={0.95}
                          />
                        )}
                      </g>
                    );
                  })()}

                  {/* nodes */}
                  {nodes.map((n) => {
                    const tx = n.x - 50;
                    const ty = n.y - 18;
                    return (
                      <g
                        key={n.id}
                        transform={`translate(${tx}, ${ty})`}
                        onClick={() => n.label && setSelectedNode(n)}
                        style={{ cursor: n.label ? "pointer" : "default" }}
                      >
                        <rect
                          width={100}
                          height={36}
                          rx={6}
                          fill="#fff"
                          stroke="#0f172a"
                          strokeWidth={1}
                        />
                        {n.label ? (
                          <foreignObject width={100} height={36}>
                            <div
                              className={`w-full h-full flex items-center gap-2 px-2`}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  background:
                                    n.status === "online"
                                      ? "#16a34a"
                                      : n.status === "offline"
                                        ? "#ef4444"
                                        : "#f59e0b",
                                }}
                              />
                              <div className="text-xs">
                                <div className="font-semibold text-[10px] leading-tight">
                                  {n.label}
                                </div>
                              </div>
                            </div>
                          </foreignObject>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:order-last order-first">
          <div className="bg-white border p-4 rounded-lg shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Legend & Controls</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showEthernet}
                    onChange={(e) => setShowEthernet(e.target.checked)}
                  />{" "}
                  Ethernet
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showWifi}
                    onChange={(e) => setShowWifi(e.target.checked)}
                  />{" "}
                  WiFi
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showSecure}
                    onChange={(e) => setShowSecure(e.target.checked)}
                  />{" "}
                  Secure
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Status Overview</h3>
              <div className="flex flex-col gap-2 text-sm">
                {["online", "warn", "offline"].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        s === "online"
                          ? "bg-green-500"
                          : s === "warn"
                            ? "bg-yellow-400"
                            : "bg-red-500"
                      }`}
                    />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Components</h3>
              <div className="grid grid-cols-1 gap-2">
                <Select
                  value={selectedComponentId ?? ""}
                  onValueChange={(v) => {
                    setSelectedComponentId(v || null);
                    const node = nodes.find((n) => n.id === v);
                    if (node) setSelectedNode(node);
                  }}
                >
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue placeholder="Select component..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-40 overflow-auto">
                    {(() => {
                      const combined: { id: string; label: string }[] = [
                        ...nodes.map((n) => ({ id: n.id, label: n.label })),
                        ...extraComponents,
                      ];
                      const clients = combined
                        .filter((c) => c.id.startsWith("client"))
                        .sort((a, b) => {
                          const na = parseInt(
                            a.id.replace(/[^0-9]/g, "") || "0",
                            10,
                          );
                          const nb = parseInt(
                            b.id.replace(/[^0-9]/g, "") || "0",
                            10,
                          );
                          return na - nb;
                        });
                      const tablets = combined
                        .filter((t) => t.id.startsWith("tablet"))
                        .sort((a, b) => {
                          const na = parseInt(
                            a.id.replace(/[^0-9]/g, "") || "0",
                            10,
                          );
                          const nb = parseInt(
                            b.id.replace(/[^0-9]/g, "") || "0",
                            10,
                          );
                          return na - nb;
                        });
                      const others = combined.filter(
                        (x) =>
                          !x.id.startsWith("client") &&
                          !x.id.startsWith("tablet"),
                      );
                      const wifiIdx = others.findIndex((o) => o.id === "wifi");
                      let ordered: { id: string; label: string }[] = [];
                      if (wifiIdx >= 0) {
                        const beforeWifi = others.slice(0, wifiIdx + 1);
                        const afterWifi = others.slice(wifiIdx + 1);
                        ordered = [
                          ...beforeWifi,
                          ...clients,
                          ...tablets,
                          ...afterWifi,
                        ];
                      } else {
                        ordered = [...others, ...clients, ...tablets];
                      }
                      return ordered.map((n) => (
                        <SelectItem key={n.id} value={n.id}>
                          {n.label}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">View</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                    onClick={() => setScale(1)}
                  >
                    1x
                  </button>
                  <button
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                    onClick={() => setScale(1.25)}
                  >
                    1.25x
                  </button>
                  <button
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                    onClick={() => setScale(1.5)}
                  >
                    1.5x
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                    onClick={resetView}
                  >
                    Reset View
                  </button>
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                    onClick={zoomOut}
                  >
                    -
                  </button>
                  <div className="px-2 py-1 border rounded">
                    {Math.round(scale * 100)}%
                  </div>
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-50"
                    onClick={zoomIn}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {selectedNode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Component Details</h3>
            <div className="space-y-2">
              <div>
                <strong>{selectedNode.label}</strong>
              </div>
              <div className="text-sm text-gray-600">
                Type: {selectedNode.type}
              </div>
              <div className="text-sm text-gray-600">
                Status: {selectedNode.status}
              </div>
              <div className="text-sm">
                IP: 10.0.{selectedNode.id.length}.
                {selectedNode.id.charCodeAt(0) % 255}
              </div>
              <div className="pt-4 flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    console.log("Open docs for", selectedNode.id);
                  }}
                >
                  Open docs
                </button>
                <button
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  onClick={() => setSelectedNode(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Spare() {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-card shadow-card p-5">
        <h2 className="text-lg font-semibold mb-2">Spare</h2>
        <p className="text-sm text-gray-600">Reserved for future features.</p>
      </div>
    </section>
  );
}
