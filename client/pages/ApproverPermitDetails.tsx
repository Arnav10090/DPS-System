import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type ApproverPermitForm = {
  // Requester-side flags (read-only here, shown as plain text)
  requesterRequireUrgent?: boolean;
  requesterSafetyManagerApproval?: boolean;
  requesterPlannedShutdown?: boolean;
  requesterPlannedShutdownDate?: string;
  requesterCustomComments?: Array<string | { text: string; checked?: boolean }>;

  // Approver-side flags (editable)
  approverRequireUrgent?: boolean;
  approverSafetyManagerApproval?: boolean;
  approverPlannedShutdown?: boolean;
  approverPlannedShutdownDate?: string;
  approverCustomComments?: Array<string | { text: string; checked?: boolean }>; // checkbox list
  // Approver -> Safety Officer flags (editable)
  approverToSafetyRequireUrgent?: boolean;
  approverToSafetySafetyManagerApproval?: boolean;
  approverToSafetyPlannedShutdown?: boolean;
  approverToSafetyPlannedShutdownDate?: string;
  approverToSafetyCustomComments?: Array<string | { text: string; checked?: boolean }>;

  // Read-only safety officer comments to display in this view
  safetyFromOfficerRequireUrgent?: boolean;
  safetyFromOfficerSafetyManagerApproval?: boolean;
  safetyFromOfficerPlannedShutdown?: boolean;
  safetyFromOfficerPlannedShutdownDate?: string;
  safetyFromOfficerCustomComments?: Array<string | { text: string; checked?: boolean }>;

  // Header fields (local only)
  permitRequester?: string;
  permitApprover1?: string;
  permitApprover2?: string;
  safetyManager?: string;
  permitIssueDate?: string;
  expectedReturnDate?: string;
  certificateNumber?: string;
  permitNumber?: string;

  // Local-only selection for work permit type
  permitType?: "hot" | "cold";
  // Local-only Work Permit Form Type selection (mirrors main page)
  permitDocType?: "work" | "highTension" | "gasLine";
};

const DEFAULT_FORM: ApproverPermitForm = {
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
  safetyFromOfficerRequireUrgent: false,
  safetyFromOfficerSafetyManagerApproval: false,
  safetyFromOfficerPlannedShutdown: false,
  safetyFromOfficerPlannedShutdownDate: "",
  safetyFromOfficerCustomComments: [],
  permitRequester: "",
  permitApprover1: "",
  permitApprover2: "",
  safetyManager: "",
  permitIssueDate: "",
  expectedReturnDate: "",
  certificateNumber: "",
  permitNumber: "",
  permitType: "hot",
  permitDocType: "work",
};

export default function ApproverPermitDetails() {
  const [form, setForm] = useState<ApproverPermitForm>(() => DEFAULT_FORM);
  const [newApproverComment, setNewApproverComment] = useState("");
  const [newApproverToSafetyComment, setNewApproverToSafetyComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Force approver role for this page
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("dps_role", "approver");
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Load requester comments persisted from requester page
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
    } catch (e) {
      // ignore
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load safety officer comments (to display in approver view) and header fields
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const rawSafety = localStorage.getItem("dps_SafetyOfficer_comments");
      if (rawSafety) {
        const d = JSON.parse(rawSafety);
        update({
          safetyFromOfficerRequireUrgent: !!d.SafetyOfficerRequireUrgent,
          safetyFromOfficerSafetyManagerApproval: !!d.SafetyOfficerSafetyManagerApproval,
          safetyFromOfficerPlannedShutdown: !!d.SafetyOfficerPlannedShutdown,
          safetyFromOfficerPlannedShutdownDate: d.SafetyOfficerPlannedShutdownDate || "",
          safetyFromOfficerCustomComments: d.SafetyOfficerCustomComments || [],
        });
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<ApproverPermitForm>) =>
    setForm((s) => ({ ...s, ...patch }));

  // Persist approver comments & selections for requester view
  useEffect(() => {
    try {
      const payload = {
        approverRequireUrgent: !!form.approverRequireUrgent,
        approverSafetyManagerApproval: !!form.approverSafetyManagerApproval,
        approverPlannedShutdown: !!form.approverPlannedShutdown,
        approverPlannedShutdownDate: form.approverPlannedShutdownDate || "",
        approverCustomComments: form.approverCustomComments || [],
      };
      localStorage.setItem("dps_approver_comments", JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [
    form.approverRequireUrgent,
    form.approverSafetyManagerApproval,
    form.approverPlannedShutdown,
    form.approverPlannedShutdownDate,
    form.approverCustomComments,
  ]);

  // Persist approver -> safety officer comments
  useEffect(() => {
    try {
      const payload = {
        approverToSafetyRequireUrgent: !!form.approverToSafetyRequireUrgent,
        approverToSafetySafetyManagerApproval: !!form.approverToSafetySafetyManagerApproval,
        approverToSafetyPlannedShutdown: !!form.approverToSafetyPlannedShutdown,
        approverToSafetyPlannedShutdownDate: form.approverToSafetyPlannedShutdownDate || "",
        approverToSafetyCustomComments: form.approverToSafetyCustomComments || [],
      };
      localStorage.setItem("dps_approver_to_safety_comments", JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [
    form.approverToSafetyRequireUrgent,
    form.approverToSafetySafetyManagerApproval,
    form.approverToSafetyPlannedShutdown,
    form.approverToSafetyPlannedShutdownDate,
    form.approverToSafetyCustomComments,
  ]);

  return (
    <div className="pb-5 mb-[-2px]">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold">Work Permit Form</h1>
          <div className="text-sm text-gray-500">
            <p>
              <span className="text-sm">Approver View - Section 1</span>
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

      {/* Company header under progress for Approver */}
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
              {/* Top requester/approver fields */}
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

              {/* Comments from Approver — plain text only */}
              <div className="mt-2 bg-yellow-50 p-3 rounded-md">
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
                  {!form.approverRequireUrgent &&
                    !form.approverSafetyManagerApproval &&
                    !(form.approverPlannedShutdown || form.approverPlannedShutdownDate) &&
                    (form.approverCustomComments || []).length === 0 && (
                      <div className="text-gray-500">No comments from approver yet.</div>
                    )}
                </div>
              </div>

              {/* Comments from Safety Officer — plain text only */}
              <div className="mt-2 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments from Safety Officer:</div>
                <div className="mt-2 space-y-1 text-sm">
                  {form.safetyFromOfficerRequireUrgent && <div>Require on urgent basis</div>}
                  {form.safetyFromOfficerSafetyManagerApproval && (
                    <div>Safety Manager approval required</div>
                  )}
                  {(form.safetyFromOfficerPlannedShutdown || form.safetyFromOfficerPlannedShutdownDate) && (
                    <div>
                      Planned shutdown on: {form.safetyFromOfficerPlannedShutdownDate || ""}
                    </div>
                  )}
                  {(form.safetyFromOfficerCustomComments || []).map((it, idx) => (
                    <div key={idx}>- {typeof it === "string" ? it : it.text}</div>
                  ))}
                  {!form.safetyFromOfficerRequireUrgent &&
                    !form.safetyFromOfficerSafetyManagerApproval &&
                    !(form.safetyFromOfficerPlannedShutdown || form.safetyFromOfficerPlannedShutdownDate) &&
                    (form.safetyFromOfficerCustomComments || []).length === 0 && (
                      <div className="text-gray-500">No comments from safety officer yet.</div>
                    )}
                </div>
              </div>

              {/* Specific Comments for Approver — approver can set for own role list */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments for Approver:</div>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.approverRequireUrgent}
                    onChange={(e) => update({ approverRequireUrgent: e.target.checked })}
                  />
                  Require on urgent basis
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.approverSafetyManagerApproval}
                    onChange={(e) =>
                      update({ approverSafetyManagerApproval: e.target.checked })
                    }
                  />
                  Safety Manager approval required
                </label>
                <div className="mt-2 text-md flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!form.approverPlannedShutdown}
                      onChange={(e) => update({ approverPlannedShutdown: e.target.checked })}
                    />
                    <span>
                      Planned shutdown on:
                    </span>
                  </label>
                  <input
                    type="date"
                    className="rounded border px-2 py-1 text-sm"
                    value={form.approverPlannedShutdownDate || ""}
                    onChange={(e) => update({ approverPlannedShutdownDate: e.target.value })}
                  />
                </div>

                {/* Approver custom comments */}
                <div className="mt-3">
                  {/* Existing custom comments as checkbox list with delete */}
                  <div className="mt-2 space-y-1">
                    {(form.approverCustomComments || []).map((item: any, idx: number) => {
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
                                const prev = form.approverCustomComments || [];
                                const next = prev.map((it: any, i: number) => {
                                  if (i !== idx) return it;
                                  if (typeof it === "string")
                                    return { text: it, checked: e.target.checked };
                                  return { ...it, checked: e.target.checked };
                                });
                                update({ approverCustomComments: next });
                              }}
                            />
                            <span className="text-sm">{text}</span>
                          </div>
                          <div>
                            <button
                              type="button"
                              aria-label={`Delete comment ${idx + 1}`}
                              onClick={() => {
                                const prev = form.approverCustomComments || [];
                                const next = prev.filter((_: any, i: number) => i !== idx);
                                update({ approverCustomComments: next });
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
                      value={newApproverComment}
                      onChange={(e) => setNewApproverComment(e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <button
                      className="px-3 py-1 rounded bg-white border text-sm"
                      onClick={() => {
                        const v = newApproverComment.trim();
                        if (!v) return;
                        const prev = form.approverCustomComments || [];
                        const next = [...prev, { text: v, checked: false }];
                        update({ approverCustomComments: next });
                        setNewApproverComment("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Specific Comments for Safety Officer — set by approver */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="text-md font-medium">Comments for Safety Officer:</div>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.approverToSafetyRequireUrgent}
                    onChange={(e) => update({ approverToSafetyRequireUrgent: e.target.checked })}
                  />
                  Require on urgent basis
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.approverToSafetySafetyManagerApproval}
                    onChange={(e) =>
                      update({ approverToSafetySafetyManagerApproval: e.target.checked })
                    }
                  />
                  Safety Manager approval required
                </label>
                <div className="mt-2 text-md flex items-center gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!form.approverToSafetyPlannedShutdown}
                      onChange={(e) => update({ approverToSafetyPlannedShutdown: e.target.checked })}
                    />
                    <span>Planned shutdown on:</span>
                  </label>
                  <input
                    type="date"
                    className="rounded border px-2 py-1 text-sm"
                    value={form.approverToSafetyPlannedShutdownDate || ""}
                    onChange={(e) => update({ approverToSafetyPlannedShutdownDate: e.target.value })}
                  />
                </div>

                {/* Approver to Safety custom comments */}
                <div className="mt-3">
                  <div className="mt-2 space-y-1">
                    {(form.approverToSafetyCustomComments || []).map((item: any, idx: number) => {
                      const text = typeof item === "string" ? item : item.text;
                      const checked = typeof item === "string" ? false : !!item.checked;
                      return (
                        <div key={idx} className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const prev = form.approverToSafetyCustomComments || [];
                                const next = prev.map((it: any, i: number) => {
                                  if (i !== idx) return it;
                                  if (typeof it === "string") return { text: it, checked: e.target.checked };
                                  return { ...it, checked: e.target.checked };
                                });
                                update({ approverToSafetyCustomComments: next });
                              }}
                            />
                            <span className="text-sm">{text}</span>
                          </div>
                          <div>
                            <button
                              type="button"
                              aria-label={`Delete comment ${idx + 1}`}
                              onClick={() => {
                                const prev = form.approverToSafetyCustomComments || [];
                                const next = prev.filter((_: any, i: number) => i !== idx);
                                update({ approverToSafetyCustomComments: next });
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

                  <div className="text-xs font-medium mt-2">Add comment</div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add comment"
                      value={newApproverToSafetyComment}
                      onChange={(e) => setNewApproverToSafetyComment(e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <button
                      className="px-3 py-1 rounded bg-white border text-sm"
                      onClick={() => {
                        const v = newApproverToSafetyComment.trim();
                        if (!v) return;
                        const prev = form.approverToSafetyCustomComments || [];
                        const next = [...prev, { text: v, checked: false }];
                        update({ approverToSafetyCustomComments: next });
                        setNewApproverToSafetyComment("");
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
