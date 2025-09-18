import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModernPagination } from "@/components/ui/modern-pagination";
import {
  StepSection,
  SignaturePad,
  StepActions,
} from "@/components/permit/ht/components";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import GasPermitPreview from "@/components/permit/gas/GasPermitPreview";

type ChecklistRow = {
  id: number;
  activity: string;
  answer: "yes" | "na" | "";
  remarks: string;
};

const checklistItems: ChecklistRow[] = [
  {
    id: 1,
    activity:
      "Are persons authorized (trained & competent) to enter / work in the gas proximity area?",
    answer: "",
    remarks: "",
  },
  {
    id: 2,
    activity: "Certified that the gas lines / equipment positively isolated?",
    answer: "",
    remarks: "",
  },
  {
    id: 3,
    activity:
      "Certified that the isolated gas lines / equipment completely purged by Nitrogen gas?",
    answer: "",
    remarks: "",
  },
  {
    id: 4,
    activity:
      "Are chemical analysis carried out of the sample taken after purging by Nitrogen gas?",
    answer: "",
    remarks: "",
  },
  {
    id: 5,
    activity:
      "Are the emergency escape routes checked & ensured? And Emergency Response plan in place?",
    answer: "",
    remarks: "",
  },
  {
    id: 6,
    activity:
      "Are all the PPEs, & firefighting equipment available, appropriate & in good condition?",
    answer: "",
    remarks: "",
  },
  {
    id: 7,
    activity: "Are the Breathing Apparatus Set etc. Available?",
    answer: "",
    remarks: "",
  },
  {
    id: 8,
    activity:
      "Are non-sparking tools or intrinsically safe electrical fittings and portable hand lamp used?",
    answer: "",
    remarks: "",
  },
  {
    id: 9,
    activity: "Are all mobile phones prohibited at work place?",
    answer: "",
    remarks: "",
  },
  {
    id: 10,
    activity:
      "Are required personal gas monitors available with persons working in the area?",
    answer: "",
    remarks: "",
  },
  {
    id: 11,
    activity:
      "Ensured that during operating the bleeder the gas is not allowed to blow over any person?",
    answer: "",
    remarks: "",
  },
  {
    id: 12,
    activity:
      "Ensured that the work will be started after checking the concentration of CO / toxic gases?",
    answer: "",
    remarks: "",
  },
];

const gasTable = [
  ["Ammonia", "25 ppm", "16.0%", "25.0%"],
  ["BF Gas", "50 PPM", "45%", "70%"],
  ["Carbon Monoxide (CO)", "50 PPM", "12.50%", "74%"],
  ["Corex Gas", "50 PPM", "10%", "72%"],
  ["Coke Oven Gas", "50 PPM", "6.00%", "30%"],
  ["Chlorine (Cl)", "0.5 ppm", "—", "—"],
  ["DRI Tail Gas", "50 PPM", "27%", "87%"],
  ["Hydrogen (H)", "—", "4.0%", "74.0%"],
  ["Hydrogen Sulphide (H s)", "10 ppm", "4%", "46%"],
  ["LPG", "1000 ppm", "2.2%", "9.9%"],
  ["Methane / Natural Gas", "1000 ppm", "5.9%", "14.0%"],
];

function GasSafetyTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-md">
        <thead className="bg-[#f8fafc]">
          <tr className="text-left">
            <th className="p-2 border">Gas</th>
            <th className="p-2 border">Safe Conc. For 8 Hrs.</th>
            <th className="p-2 border">Lower-Flammable Limit</th>
            <th className="p-2 border">Upper-Flammable Limit</th>
          </tr>
        </thead>
        <tbody>
          {gasTable.map((row, idx) => (
            <tr key={idx} className={cn(idx % 2 ? "bg-white" : "bg-gray-50")}>
              <td className="p-2 border font-medium">{row[0]}</td>
              <td className="p-2 border">{row[1]}</td>
              <td className="p-2 border">{row[2]}</td>
              <td className="p-2 border">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GasPermit() {
  const steps = useMemo(
    () => [
      { id: "auth", name: "Authorization (Part A)" },
      { id: "safety", name: "Safety Checklist (Part B)" },
      { id: "limits", name: "Gas Safety Limits (Part C)" },
      { id: "permit", name: "Permit Authorization (Part D)" },
      { id: "closure", name: "Work Completion (Part E)" },
    ],
    [],
  );

  const [current, setCurrent] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const storageKey = "gas-permit-draft";

  const [form, setForm] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw
        ? JSON.parse(raw)
        : {
            header: { certificateNo: "", permitNo: "" },
            partA: {
              issuerName: "",
              crossRef: "",
              department: "",
              location: "",
              description: "",
              fromDate: "",
              fromTime: "",
              toDate: "",
              toTime: "",
            },
            partB: checklistItems,
            partC: {},
            partD: {
              confirmation: false,
              issuerName: "",
              issuerSignature: "",
              issuerContact: "",
              issuerDate: "",
              issuerTime: "",
            },
            partE: {
              acceptor: {
                authority: "",
                name: "",
                signature: "",
                contact: "",
                date: "",
                time: "",
              },
              issuer: {
                authority: "",
                name: "",
                signature: "",
                contact: "",
                date: "",
                time: "",
              },
              acceptorConfirmed: false,
              closed: false,
            },
          };
    } catch (e) {
      return {} as any;
    }
  });

  // autosave interval
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem(storageKey, JSON.stringify(form));
    }, 30000);
    return () => clearInterval(id);
  }, [form]);

  // persist on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form]);

  const update = (path: string, value: any) => {
    setForm((f: any) => {
      const copy = JSON.parse(JSON.stringify(f));
      const parts = path.split(".");
      let cur: any = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const validatePartA = () => {
    const a = form.partA || {};
    return (
      !!a.issuerName &&
      !!a.crossRef &&
      !!a.department &&
      !!a.location &&
      !!a.description &&
      !!a.fromDate
    );
  };

  const validatePartB = () => {
    const rows: ChecklistRow[] = form.partB || [];
    return (
      rows.length === 12 &&
      rows.every((r) => r.answer === "yes" || r.answer === "na")
    );
  };

  const validatePartD = () => {
    const d = form.partD || {};
    return (
      !!d.issuerName &&
      (!!d.issuerSignature || !!d.issuerContact) &&
      !!d.confirmation
    );
  };

  const canNext = () => {
    if (current === 0) return validatePartA();
    if (current === 1) return validatePartB();
    if (current === 2) return true;
    if (current === 3) return validatePartD();
    if (current === 4) return form.partE?.closed === true;
    return true;
  };

  const next = () => {
    setCurrent((c) => Math.min(steps.length - 1, c + 1));
  };
  const back = () => setCurrent((c) => Math.max(0, c - 1));

  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 space-y-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">Create New Work Permit</h1>
          <div className="text-sm text-gray-500">
            <p>
              <span className="text-sm">
                {form.header.permitNo ||
                  `WCS-${new Date().getFullYear()}-${String(Date.now()).slice(
                    -6,
                  )}`}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Work Permit Form Type:</span>
          <div className="w-[220px]">
            <Select
              value={"gasLine"}
              onValueChange={(v) => {
                if (v === "highTension") {
                  navigate("/ht-permit");
                } else if (v === "work") {
                  navigate("/permit-details");
                } else {
                  // stay on gas permit
                }
              }}
            >
              <SelectTrigger aria-label="Select permit form">
                <SelectValue placeholder="Permit form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work Permit</SelectItem>
                <SelectItem value="highTension">
                  High Tension Line Work Permit
                </SelectItem>
                <SelectItem value="gasLine">Gas Line Work Permit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <ModernPagination
        steps={steps.map((s) => s.name)}
        currentStep={current}
        onStepChange={(i) => setCurrent(i)}
        showProgress
        allowClickNavigation
        variant="numbered"
      />

      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-start justify-between">
          <div className="text-left">
            <div className="text-sm font-semibold">AM/NS INDIA</div>
            <div className="text-lg font-bold">
              ArcelorMittal Nippon Steel India Limited
            </div>
            <div className="text-sm text-gray-600">HAZIRA</div>
            <div className="mt-2 text-xl font-bold">
              ADDITIONAL WORK PERMIT FOR GAS LINE / EQUIPMENT
            </div>
          </div>
          <div className="w-56">
            <div className="mb-2">
              <label className="text-sm text-gray-700">Certificate No.</label>
              <input
                value={form.header.certificateNo}
                readOnly
                className="w-full rounded-md border px-2 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Permit No.</label>
              <input
                value={form.header.permitNo}
                readOnly
                className="w-full rounded-md border px-2 py-2 text-sm bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {current === 0 && (
        <StepSection
          title="Part - A: AUTHORISATION TO WORK"
          subtitle="(To be filled-up by Permit Issuer)"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                Issuer Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.partA.issuerName}
                onChange={(e) => update("partA.issuerName", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Cross Ref. Permit No <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.partA.crossRef}
                onChange={(e) => update("partA.crossRef", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Department <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.partA.department}
                onChange={(e) => update("partA.department", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.partA.location}
                onChange={(e) => update("partA.location", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">
                Description of the Job <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm h-24"
                value={form.partA.description}
                onChange={(e) => update("partA.description", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">
                Validity <span className="text-red-600">*</span>
              </label>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">From</span>
                  <input
                    type="date"
                    className="rounded-md border px-3 py-2 text-sm"
                    value={form.partA.fromDate || ""}
                    onChange={(e) => update("partA.fromDate", e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded-md border px-3 py-2 text-sm"
                    value={form.partA.fromTime || ""}
                    onChange={(e) => update("partA.fromTime", e.target.value)}
                  />
                  <span className="text-sm font-medium">to</span>
                  <input
                    type="date"
                    className="rounded-md border px-3 py-2 text-sm"
                    value={form.partA.toDate || ""}
                    onChange={(e) => update("partA.toDate", e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded-md border px-3 py-2 text-sm"
                    value={form.partA.toTime || ""}
                    onChange={(e) => update("partA.toTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </StepSection>
      )}

      {current === 1 && (
        <StepSection
          title="Part - B: MANDATORY CONDITIONS"
          subtitle="(To be filled-up Jointly by Permit Issuer & Acceptor)"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Checklist completion:{" "}
              {(form.partB || []).filter((r: any) => r.answer).length}/
              {(form.partB || []).length}
            </p>
            <div
              className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden"
              aria-label="Checklist progress"
            >
              <div
                className="h-2 bg-[#2563eb]"
                style={{
                  width: `${Math.round(
                    ((form.partB || []).filter((r: any) => r.answer).length /
                      (form.partB || []).length) *
                      100,
                  )}%`,
                }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md">
              <thead style={{ background: "#f8fafc" }}>
                <tr className="text-left">
                  <th className="p-2 border w-12">S/N</th>
                  <th className="p-2 border">Activity</th>
                  <th className="p-2 border w-24 text-center">Yes</th>
                  <th className="p-2 border w-24 text-center">N/A</th>
                  <th className="p-2 border w-64">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {(form.partB || []).map((row: any, idx: number) => (
                  <tr
                    key={row.id}
                    className={cn(idx % 2 ? "bg-white" : "bg-gray-50")}
                  >
                    <td className="p-2 border align-top">{row.id}</td>
                    <td className="p-2 border align-top text-sm text-gray-800">
                      {row.activity}
                    </td>
                    <td className="p-2 border align-top text-center">
                      <button
                        type="button"
                        aria-pressed={row.answer === "yes"}
                        onClick={() => {
                          const next = row.answer === "yes" ? "" : "yes";
                          const copy = [...(form.partB || [])];
                          copy[idx] = { ...copy[idx], answer: next };
                          update(`partB.${idx}.answer`, next);
                        }}
                        className={cn(
                          "mx-auto h-6 w-6 rounded-md border flex items-center justify-center",
                          row.answer === "yes"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white",
                        )}
                      >
                        {row.answer === "yes" ? "✓" : ""}
                      </button>
                    </td>
                    <td className="p-2 border align-top text-center">
                      <button
                        type="button"
                        aria-pressed={row.answer === "na"}
                        onClick={() => {
                          const next = row.answer === "na" ? "" : "na";
                          update(`partB.${idx}.answer`, next);
                        }}
                        className={cn(
                          "mx-auto h-6 w-6 rounded-md border flex items-center justify-center",
                          row.answer === "na"
                            ? "bg-gray-600 text-white border-gray-600"
                            : "bg-white",
                        )}
                      >
                        {row.answer === "na" ? "✓" : ""}
                      </button>
                    </td>
                    <td className="p-2 border align-top">
                      <input
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        value={row.remarks || ""}
                        onChange={(e) =>
                          update(`partB.${idx}.remarks`, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StepSection>
      )}

      {current === 2 && (
        <StepSection
          title="Part - C: SAFE LIMITS OF GASES / VAPOURS"
          subtitle="(To be checked By Permit Issuer & Permit Acceptor)"
        >
          <GasSafetyTable />
        </StepSection>
      )}

      {current === 3 && (
        <StepSection
          title="Part - D: PERMIT AUTHORISATION"
          subtitle="(To be filled-up by Permit Issuer)"
        >
          <div className="mb-4">
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={!!form.partD.confirmation}
                onChange={(e) => update("partD.confirmation", e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-800">
                I confirm that the above location have been examined, the safety
                precautions taken as per the check list. The permission is
                authorized for this work. I also accept responsibility for the
                work to be carried out safely.
              </span>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md">
              <thead className="bg-[#f8fafc]">
                <tr className="text-left">
                  <th className="p-2 border">Authority</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Signature</th>
                  <th className="p-2 border">Contact No.</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-2 border align-top">
                    <div className="text-sm font-medium text-gray-800">
                      Permit Issuer
                    </div>
                  </td>
                  <td className="p-2 border align-top">
                    <input
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={form.partD.issuerName || ""}
                      onChange={(e) =>
                        update("partD.issuerName", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <SignaturePad
                      value={form.partD.issuerSignature}
                      onChange={(v) => update("partD.issuerSignature", v)}
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <input
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={form.partD.issuerContact || ""}
                      onChange={(e) =>
                        update("partD.issuerContact", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <input
                      type="date"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={form.partD.issuerDate || ""}
                      onChange={(e) =>
                        update("partD.issuerDate", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <input
                      type="time"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={form.partD.issuerTime || ""}
                      onChange={(e) =>
                        update("partD.issuerTime", e.target.value)
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </StepSection>
      )}

      {current === 4 && (
        <StepSection
          title="Part - E: Work Permit Closure"
          subtitle="(To be signed by Permit Issuer & Permit Acceptor)"
        >
          <div className="space-y-4">
            {/* First checkbox */}
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={!!form.partE.acceptorConfirmed}
                onChange={(e) =>
                  update("partE.acceptorConfirmed", e.target.checked)
                }
                className="mt-1"
              />
              <span className="text-sm text-gray-800">
                I confirm that the work has been completed / partially
                completed, checked by myself and the area is left in a safe
                condition.
              </span>
            </label>

            {/* Combined Table with both Permit Acceptor and Permit Issuer */}
            <div>
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="border border-gray-300 p-2 w-32">
                      Authority
                    </th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Signature</th>
                    <th className="border border-gray-300 p-2">Contact No.</th>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 align-top font-semibold">
                      Permit Acceptor
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.acceptor.name}
                        onChange={(e) =>
                          update("partE.acceptor.name", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <SignaturePad
                        value={form.partE.acceptor.signature}
                        onChange={(v) => update("partE.acceptor.signature", v)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.acceptor.contact}
                        onChange={(e) =>
                          update("partE.acceptor.contact", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.acceptor.date}
                        onChange={(e) =>
                          update("partE.acceptor.date", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        type="time"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.acceptor.time}
                        onChange={(e) =>
                          update("partE.acceptor.time", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Second checkbox */}
            <label className="inline-flex items-start gap-2">
              <input
                type="checkbox"
                checked={!!form.partE.workCompleted}
                onChange={(e) =>
                  update("partE.workCompleted", e.target.checked)
                }
                className="mt-1"
              />
              <span className="text-sm text-gray-800">
                I have inspected the finished work and hereby cancel / Close
                this permit.
              </span>
            </label>

            {/* Continue with Permit Issuer table */}
            <div>
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="border border-gray-300 p-2 w-32">
                      Authority
                    </th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Signature</th>
                    <th className="border border-gray-300 p-2">Contact No.</th>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 align-top font-semibold">
                      Permit Issuer
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.issuer.name}
                        onChange={(e) =>
                          update("partE.issuer.name", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <SignaturePad
                        value={form.partE.issuer.signature}
                        onChange={(v) => update("partE.issuer.signature", v)}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.issuer.contact}
                        onChange={(e) =>
                          update("partE.issuer.contact", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.issuer.date}
                        onChange={(e) =>
                          update("partE.issuer.date", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 align-top">
                      <input
                        type="time"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={form.partE.issuer.time}
                        onChange={(e) =>
                          update("partE.issuer.time", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-4" role="group" aria-label="Legend">
              <div className="border border-gray-300 rounded">
                <div className="flex divide-x divide-gray-300">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                    Legend
                  </div>
                  <div className="px-3 py-2 text-sm flex items-center gap-2">
                    <span className="font-bold">✓</span>
                    <span>Measures Taken</span>
                  </div>
                  <div className="px-3 py-2 text-sm flex items-center gap-2">
                    <span className="font-bold">✖</span>
                    <span>Measures Not Required</span>
                  </div>
                  <div className="px-3 py-2 text-sm">NA</div>
                  <div className="px-3 py-2 text-sm">Not applicable</div>
                </div>
              </div>
            </div>
          </div>
        </StepSection>
      )}

      <StepActions
        onBack={back}
        onSave={() => localStorage.setItem(storageKey, JSON.stringify(form))}
        onNext={() => (current === steps.length - 1 ? null : next())}
        nextLabel={current === steps.length - 1 ? "Submit" : "Next Step"}
        disableNext={false}
        isFirst={current === 0}
        isLast={current === steps.length - 1}
        onPreview={() => setShowPreview(true)}
        previewLabel="Preview"
      />
      {showPreview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <div
            className="relative z-10 bg-white rounded-md shadow-xl w-[95vw] max-w-[1100px] max-h-[90vh] overflow-hidden"
            style={{ padding: 16 }}
          >
            <div
              className="overflow-auto bg-white"
              style={{ maxHeight: "calc(90vh - 32px)", padding: 12 }}
            >
              <div
                style={{
                  transform: "scale(0.92)",
                  transformOrigin: "top center",
                }}
              >
                <GasPermitPreview data={form as any} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
