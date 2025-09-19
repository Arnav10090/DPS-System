import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type SafetyOfficerPermitForm = {
  // Requester-side flags (read-only here, shown as plain text)
  requesterRequireUrgent?: boolean;
  requesterSafetyManagerApproval?: boolean;
  requesterPlannedShutdown?: boolean;
  requesterPlannedShutdownDate?: string;
  requesterCustomComments?: Array<string | { text: string; checked?: boolean }>;
  // Approver comments (read-only shown here)
  approverRequireUrgent?: boolean;
  approverSafetyManagerApproval?: boolean;
  approverPlannedShutdown?: boolean;
  approverPlannedShutdownDate?: string;
  approverCustomComments?: Array<string | { text: string; checked?: boolean }>;
  // Approver -> Safety comments (read-only shown here)
  approverToSafetyRequireUrgent?: boolean;
  approverToSafetySafetyManagerApproval?: boolean;
  approverToSafetyPlannedShutdown?: boolean;
  approverToSafetyPlannedShutdownDate?: string;
  approverToSafetyCustomComments?: Array<string | { text: string; checked?: boolean }>;

  // SafetyOfficer -> Approver flags (editable)
  safetyToApproverRequireUrgent?: boolean;
  safetyToApproverSafetyManagerApproval?: boolean;
  safetyToApproverPlannedShutdown?: boolean;
  safetyToApproverPlannedShutdownDate?: string;
  safetyToApproverCustomComments?: Array<string | { text: string; checked?: boolean }>;

  // SafetyOfficer comments for Safety Officer (editable)
  SafetyOfficerRequireUrgent?: boolean;
  SafetyOfficerSafetyManagerApproval?: boolean;
  SafetyOfficerPlannedShutdown?: boolean;
  SafetyOfficerPlannedShutdownDate?: string;
  SafetyOfficerCustomComments?: Array<string | { text: string; checked?: boolean }>; // checkbox list
  // Local-only selection for work permit type
  permitType?: "hot" | "cold";
  // Local-only Work Permit Form Type selection (mirrors main page)
  permitDocType?: "work" | "highTension" | "gasLine";
  // Header fields
  permitRequester?: string;
  permitApprover1?: string;
  permitApprover2?: string;
  safetyManager?: string;
  permitIssueDate?: string;
  expectedReturnDate?: string;
  certificateNumber?: string;
  permitNumber?: string;
};

const DEFAULT_FORM: SafetyOfficerPermitForm = {
  requesterRequireUrgent: false,
  requesterSafetyManagerApproval: false,
  requesterPlannedShutdown: false,
  requesterPlannedShutdownDate: "",
  requesterCustomComments: [],
  approverRequireUrgent: false,
  approverSafetyManagerApproval: false,
  approverPlannedShutdown: false,
  approverPlannedShutdownDate: "",
  approverCustomComments: [],
  approverToSafetyRequireUrgent: false,
  approverToSafetySafetyManagerApproval: false,
  approverToSafetyPlannedShutdown: false,
  approverToSafetyPlannedShutdownDate: "",
  approverToSafetyCustomComments: [],

  safetyToApproverRequireUrgent: false,
  safetyToApproverSafetyManagerApproval: false,
  safetyToApproverPlannedShutdown: false,
  safetyToApproverPlannedShutdownDate: "",
  safetyToApproverCustomComments: [],
  SafetyOfficerRequireUrgent: false,
  SafetyOfficerSafetyManagerApproval: false,
  SafetyOfficerPlannedShutdown: false,
  SafetyOfficerPlannedShutdownDate: "",
  SafetyOfficerCustomComments: [],
  permitType: "hot",
  permitDocType: "work",
  permitRequester: "",
  permitApprover1: "",
  permitApprover2: "",
  safetyManager: "",
  permitIssueDate: "",
  expectedReturnDate: "",
  certificateNumber: "",
  permitNumber: "",
};

export default function SafetyOfficerPermitDetails() {
  const [form, setForm] = useState<SafetyOfficerPermitForm>(() => DEFAULT_FORM);
  const [newSafetyOfficerComment, setNewSafetyOfficerComment] = useState("");
  const [newSafetyToApproverComment, setNewSafetyToApproverComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Force safety role for this page
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("dps_role", "safety");
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Load requester & approver comments and header fields persisted from other pages
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("dps_requester_comments");
      if (!raw) return;
      const data = JSON.parse(raw);
      update({
        requesterRequireUrgent: !!data.requesterRequireUrgent,
        requesterSafetyManagerApproval: !!data.requesterSafetyManagerApproval,
        requesterPlannedShutdown: !!data.requesterPlannedShutdown,
        requesterPlannedShutdownDate: data.requesterPlannedShutdownDate || "",
        requesterCustomComments: data.requesterCustomComments || [],
      });
      // Approver base comments
      const rawApprover = localStorage.getItem("dps_approver_comments");
      if (rawApprover) {
        const a = JSON.parse(rawApprover);
        update({
          approverRequireUrgent: !!a.approverRequireUrgent,
          approverSafetyManagerApproval: !!a.approverSafetyManagerApproval,
          approverPlannedShutdown: !!a.approverPlannedShutdown,
          approverPlannedShutdownDate: a.approverPlannedShutdownDate || "",
          approverCustomComments: a.approverCustomComments || [],
        });
      }
      // Approver -> Safety comments
      const rawATS = localStorage.getItem("dps_approver_to_safety_comments");
      if (rawATS) {
        const s = JSON.parse(rawATS);
        update({
          approverToSafetyRequireUrgent: !!s.approverToSafetyRequireUrgent,
          approverToSafetySafetyManagerApproval: !!s.approverToSafetySafetyManagerApproval,
          approverToSafetyPlannedShutdown: !!s.approverToSafetyPlannedShutdown,
          approverToSafetyPlannedShutdownDate: s.approverToSafetyPlannedShutdownDate || "",
          approverToSafetyCustomComments: s.approverToSafetyCustomComments || [],
        });
      }
      // Header fields
      const header = localStorage.getItem("dps_permit_header");
      if (header) {
        const h = JSON.parse(header);
        update({
          permitRequester: h.permitRequester || "",
          permitApprover1: h.permitApprover1 || "",
          permitApprover2: h.permitApprover2 || "",
          safetyManager: h.safetyManager || "",
          permitIssueDate: h.permitIssueDate || "",
          expectedReturnDate: h.expectedReturnDate || "",
          certificateNumber: h.certificateNumber || "",
          permitNumber: h.permitNumber || "",
        });
      }
    } catch (e) {
      // ignore
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<SafetyOfficerPermitForm>) =>
    setForm((s) => ({ ...s, ...patch }));

  // Persist SafetyOfficer comments for Safety Officer section
  useEffect(() => {
    try {
      const payload = {
        SafetyOfficerRequireUrgent: !!form.SafetyOfficerRequireUrgent,
        SafetyOfficerSafetyManagerApproval: !!form.SafetyOfficerSafetyManagerApproval,
        SafetyOfficerPlannedShutdown: !!form.SafetyOfficerPlannedShutdown,
        SafetyOfficerPlannedShutdownDate: form.SafetyOfficerPlannedShutdownDate || "",
        SafetyOfficerCustomComments: form.SafetyOfficerCustomComments || [],
      };
      localStorage.setItem("dps_SafetyOfficer_comments", JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [
    form.SafetyOfficerRequireUrgent,
    form.SafetyOfficerSafetyManagerApproval,
    form.SafetyOfficerPlannedShutdown,
    form.SafetyOfficerPlannedShutdownDate,
    form.SafetyOfficerCustomComments,
  ]);

  // Persist SafetyOfficer -> Approver comments
  useEffect(() => {
    try {
      const payload = {
        safetyToApproverRequireUrgent: !!form.safetyToApproverRequireUrgent,
        safetyToApproverSafetyManagerApproval: !!form.safetyToApproverSafetyManagerApproval,
        safetyToApproverPlannedShutdown: !!form.safetyToApproverPlannedShutdown,
        safetyToApproverPlannedShutdownDate: form.safetyToApproverPlannedShutdownDate || "",
        safetyToApproverCustomComments: form.safetyToApproverCustomComments || [],
      };
      localStorage.setItem("dps_safety_to_approver_comments", JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [
    form.safetyToApproverRequireUrgent,
    form.safetyToApproverSafetyManagerApproval,
    form.safetyToApproverPlannedShutdown,
    form.safetyToApproverPlannedShutdownDate,
    form.safetyToApproverCustomComments,
  ]);

  return (
    <div className="pb-5 mb-[-2px]">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">Work Permit Form</h1>
          <div className="text-sm text-gray-500">
            <p>
              <span className="text-sm">SafetyOfficer View - Section 1</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {/* Work Permit Form Type dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 font-medium">Work Permit Form Type:</span>
            <div className="w-[220px]">
              <Select
                value={form.permitDocType}
                onValueChange={(v) => {
                  if (v === "highTension") {
                    navigate("/ht-permit");
                  } else if (v === "gasLine") {
                    navigate("/gas-permit");
                  } else {
                    update({ permitDocType: v as any });
                  }
                }}
              >
                <SelectTrigger aria-label="Select permit form">
                  <SelectValue placeholder="Permit form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work Permit</SelectItem>
                  <SelectItem value="highTension">High Tension Line Work Permit</SelectItem>
                  <SelectItem value="gasLine">Gas Line Work Permit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Preview requester form button */}
          <button
            type="button"
            onClick={() => navigate("/permit-details?preview=1")}
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Preview Requester Form
          </button>
        </div>
      </header>

      {/* Company header under progress for Safety Officer */}
      <div className="bg-white mt-3">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/placeholder.svg" alt="AM/NS INDIA logo" className="h-[60px] w-auto" />
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">ArcelorMittal Nippon Steel India Limited</div>
            <div className="text-gray-600">HAZIRA</div>
            <div className="mt-1 text-[20px] font-bold text-gray-900">
              {form.permitDocType === "highTension"
                ? "ADDITIONAL WORK PERMIT FOR HIGH TENSION LINE/Equipment"
                : form.permitDocType === "gasLine"
                ? "ADDITIONAL WORK PERMIT FOR GAS LINE"
                : "PERMIT TO WORK"}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[240px]">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate No.</label>
              <input
                value={form.certificateNumber || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  update({ certificateNumber: v });
                  try {
                    const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                    header.certificateNumber = v;
                    localStorage.setItem("dps_permit_header", JSON.stringify(header));
                  } catch {}
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-2 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit No.</label>
              <input
                value={form.permitNumber || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  update({ permitNumber: v });
                  try {
                    const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                    header.permitNumber = v;
                    localStorage.setItem("dps_permit_header", JSON.stringify(header));
                  } catch {}
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-2 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Only Section 1: Permit Details */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-md">
              Details of such permit
            </div>

            <div className="mt-4 space-y-4">
              {/* Header fields, as per screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Permit Requester</div>
                  <input
                    type="text"
                    placeholder="Search user..."
                    className="w-full rounded border px-3 py-2"
                    value={form.permitRequester || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      update({ permitRequester: v });
                      try {
                        const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                        header.permitRequester = v;
                        localStorage.setItem("dps_permit_header", JSON.stringify(header));
                      } catch {}
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Permit Approver 1</div>
                  <input
                    type="text"
                    placeholder="Approver name or role"
                    className="w-full rounded border px-3 py-2"
                    value={form.permitApprover1 || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      update({ permitApprover1: v });
                      try {
                        const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                        header.permitApprover1 = v;
                        localStorage.setItem("dps_permit_header", JSON.stringify(header));
                      } catch {}
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Permit Approver 2</div>
                  <input
                    type="text"
                    placeholder="Approver name or role"
                    className="w-full rounded border px-3 py-2"
                    value={form.permitApprover2 || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      update({ permitApprover2: v });
                      try {
                        const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                        header.permitApprover2 = v;
                        localStorage.setItem("dps_permit_header", JSON.stringify(header));
                      } catch {}
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Safety Manager</div>
                  <input
                    type="text"
                    placeholder="Safety Manager name/department"
                    className="w-full rounded border px-3 py-2"
                    value={form.safetyManager || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      update({ safetyManager: v });
                      try {
                        const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                        header.safetyManager = v;
                        localStorage.setItem("dps_permit_header", JSON.stringify(header));
                      } catch {}
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Permit Issue Date</div>
                  <input
                    type="date"
                    className="w-full rounded border px-3 py-2"
                    value={form.permitIssueDate || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      update({ permitIssueDate: v });
                      try {
                        const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                        header.permitIssueDate = v;
                        localStorage.setItem("dps_permit_header", JSON.stringify(header));
                      } catch {}
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Expected Return Date</div>
                  <input
                    type="date"
                    className="w-full rounded border px-3 py-2"
                    value={form.expectedReturnDate || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      update({ expectedReturnDate: v });
                      try {
                        const header = JSON.parse(localStorage.getItem("dps_permit_header") || "{}");
                        header.expectedReturnDate = v;
                        localStorage.setItem("dps_permit_header", JSON.stringify(header));
                      } catch {}
                    }}
                  />
                </div>
              </div>

              {/* Comments from Approver — combined base + to Safety */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments from Approver:</div>
                <div className="mt-2 space-y-1 text-sm">
                  {form.approverRequireUrgent && <div>Require on urgent basis</div>}
                  {form.approverSafetyManagerApproval && (
                    <div>Safety Manager approval required</div>
                  )}
                  {(form.approverPlannedShutdown || form.approverPlannedShutdownDate) && (
                    <div>Planned shutdown on: {form.approverPlannedShutdownDate || ""}</div>
                  )}
                  {(form.approverCustomComments || []).map((it, idx) => (
                    <div key={idx}>- {typeof it === "string" ? it : it.text}</div>
                  ))}
                  {/* Approver -> Safety */}
                  {form.approverToSafetyRequireUrgent && <div>Require on urgent basis</div>}
                  {form.approverToSafetySafetyManagerApproval && (
                    <div>Safety Manager approval required</div>
                  )}
                  {(form.approverToSafetyPlannedShutdown || form.approverToSafetyPlannedShutdownDate) && (
                    <div>Planned shutdown on: {form.approverToSafetyPlannedShutdownDate || ""}</div>
                  )}
                  {(form.approverToSafetyCustomComments || []).map((it, idx) => (
                    <div key={`ats-${idx}`}>- {typeof it === "string" ? it : it.text}</div>
                  ))}
                  {!form.approverRequireUrgent &&
                    !form.approverSafetyManagerApproval &&
                    !(form.approverPlannedShutdown || form.approverPlannedShutdownDate) &&
                    (form.approverCustomComments || []).length === 0 &&
                    !form.approverToSafetyRequireUrgent &&
                    !form.approverToSafetySafetyManagerApproval &&
                    !(form.approverToSafetyPlannedShutdown || form.approverToSafetyPlannedShutdownDate) &&
                    (form.approverToSafetyCustomComments || []).length === 0 && (
                      <div className="text-gray-500">No comments from approver yet.</div>
                    )}
                </div>
              </div>

              {/* Comments from Safety Officer — show persisted box */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments from Safety Officer:</div>
                <div className="mt-2 space-y-1 text-sm">
                  {form.SafetyOfficerRequireUrgent && (<div>Require on urgent basis</div>)}
                  {form.SafetyOfficerSafetyManagerApproval && (<div>Safety Manager approval required</div>)}
                  {(form.SafetyOfficerPlannedShutdown || form.SafetyOfficerPlannedShutdownDate) && (
                    <div>Planned shutdown on: {form.SafetyOfficerPlannedShutdownDate || ""}</div>
                  )}
                  {(form.SafetyOfficerCustomComments || []).map((it, idx) => (
                    <div key={`soc-${idx}`}>- {typeof it === "string" ? it : it.text}</div>
                  ))}
                  {!form.SafetyOfficerRequireUrgent &&
                    !form.SafetyOfficerSafetyManagerApproval &&
                    !(form.SafetyOfficerPlannedShutdown || form.SafetyOfficerPlannedShutdownDate) &&
                    (form.SafetyOfficerCustomComments || []).length === 0 && (
                      <div className="text-gray-500">No comments from safety officer yet.</div>
                    )}
                </div>
              </div>

              {/* Specific Comments for Approver — SafetyOfficer can set */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments for Approver:</div>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.safetyToApproverRequireUrgent}
                    onChange={(e) => update({ safetyToApproverRequireUrgent: e.target.checked })}
                  />
                  Require on urgent basis
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.safetyToApproverSafetyManagerApproval}
                    onChange={(e) =>
                      update({ safetyToApproverSafetyManagerApproval: e.target.checked })
                    }
                  />
                  Safety Manager approval required
                </label>
                <div className="mt-2 text-md flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!form.safetyToApproverPlannedShutdown}
                      onChange={(e) => update({ safetyToApproverPlannedShutdown: e.target.checked })}
                    />
                    <span>
                      Planned shutdown on:
                    </span>
                  </label>
                  <input
                    type="date"
                    className="rounded border px-2 py-1 text-sm"
                    value={form.safetyToApproverPlannedShutdownDate || ""}
                    onChange={(e) => update({ safetyToApproverPlannedShutdownDate: e.target.value })}
                  />
                </div>

                {/* Safety -> Approver custom comments */}
                <div className="mt-3">
                  <div className="mt-2 space-y-1">
                    {(form.safetyToApproverCustomComments || []).map((item: any, idx: number) => {
                      const text = typeof item === "string" ? item : item.text;
                      const checked = typeof item === "string" ? false : !!item.checked;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 w-full"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const prev = form.safetyToApproverCustomComments || [];
                                const next = prev.map((it: any, i: number) => {
                                  if (i !== idx) return it;
                                  if (typeof it === "string")
                                    return { text: it, checked: e.target.checked };
                                  return { ...it, checked: e.target.checked };
                                });
                                update({ safetyToApproverCustomComments: next });
                              }}
                            />
                            <span className="text-sm">{text}</span>
                          </div>
                          <div>
                            <button
                              type="button"
                              aria-label={`Delete comment ${idx + 1}`}
                              onClick={() => {
                                const prev = form.safetyToApproverCustomComments || [];
                                const next = prev.filter((_: any, i: number) => i !== idx);
                                update({ safetyToApproverCustomComments: next });
                              }}
                              className="text-xs text-red-600 hover:underline px-2 py-1"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add new comment input */}
                  <div className="text-xs font-medium mt-2">Add comment</div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add comment"
                      value={newSafetyToApproverComment}
                      onChange={(e) => setNewSafetyToApproverComment(e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <button
                      className="px-3 py-1 rounded bg-white border text-sm"
                      onClick={() => {
                        const v = newSafetyToApproverComment.trim();
                        if (!v) return;
                        const prev = form.safetyToApproverCustomComments || [];
                        const next = [...prev, { text: v, checked: false }];
                        update({ safetyToApproverCustomComments: next });
                        setNewSafetyToApproverComment("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Specific Comments for Safety Officer — SafetyOfficer can set */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments for Safety Officer:</div>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.SafetyOfficerRequireUrgent}
                    onChange={(e) => update({ SafetyOfficerRequireUrgent: e.target.checked })}
                  />
                  Require on urgent basis
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.SafetyOfficerSafetyManagerApproval}
                    onChange={(e) =>
                      update({ SafetyOfficerSafetyManagerApproval: e.target.checked })
                    }
                  />
                  Safety Manager approval required
                </label>
                <div className="mt-2 text-md flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!form.SafetyOfficerPlannedShutdown}
                      onChange={(e) => update({ SafetyOfficerPlannedShutdown: e.target.checked })}
                    />
                    <span>
                      Planned shutdown on:
                    </span>
                  </label>
                  <input
                    type="date"
                    className="rounded border px-2 py-1 text-sm"
                    value={form.SafetyOfficerPlannedShutdownDate || ""}
                    onChange={(e) => update({ SafetyOfficerPlannedShutdownDate: e.target.value })}
                  />
                </div>

                {/* SafetyOfficer custom comments */}
                <div className="mt-3">
                  {/* Existing custom comments as checkbox list with delete */}
                  <div className="mt-2 space-y-1">
                    {(form.SafetyOfficerCustomComments || []).map((item: any, idx: number) => {
                      const text = typeof item === "string" ? item : item.text;
                      const checked = typeof item === "string" ? false : !!item.checked;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 w-full"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const prev = form.SafetyOfficerCustomComments || [];
                                const next = prev.map((it: any, i: number) => {
                                  if (i !== idx) return it;
                                  if (typeof it === "string")
                                    return { text: it, checked: e.target.checked };
                                  return { ...it, checked: e.target.checked };
                                });
                                update({ SafetyOfficerCustomComments: next });
                              }}
                            />
                            <span className="text-sm">{text}</span>
                          </div>
                          <div>
                            <button
                              type="button"
                              aria-label={`Delete comment ${idx + 1}`}
                              onClick={() => {
                                const prev = form.SafetyOfficerCustomComments || [];
                                const next = prev.filter((_: any, i: number) => i !== idx);
                                update({ SafetyOfficerCustomComments: next });
                              }}
                              className="text-xs text-red-600 hover:underline px-2 py-1"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add new comment input */}
                  <div className="text-xs font-medium mt-2">Add comment</div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add comment"
                      value={newSafetyOfficerComment}
                      onChange={(e) => setNewSafetyOfficerComment(e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <button
                      className="px-3 py-1 rounded bg-white border text-sm"
                      onClick={() => {
                        const v = newSafetyOfficerComment.trim();
                        if (!v) return;
                        const prev = form.SafetyOfficerCustomComments || [];
                        const next = [...prev, { text: v, checked: false }];
                        update({ SafetyOfficerCustomComments: next });
                        setNewSafetyOfficerComment("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
