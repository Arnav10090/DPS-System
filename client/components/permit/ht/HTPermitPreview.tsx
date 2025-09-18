import React from "react";
import type { PermitFormData, SignatureData } from "@/lib/ht-permit-types";

function Cell({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <td className={`border border-black p-2 align-top ${className}`}>
      {children}
    </td>
  );
}

function YesNo({ v }: { v: "yes" | "na" | "" }) {
  return (
    <div className="flex items-center justify-center">
      <span className="inline-block w-3 h-3 border border-black text-[9px] leading-3 text-center">
        {v === "yes" ? "✓" : ""}
      </span>
    </div>
  );
}

function SigRow({
  row,
  roleLabel,
}: {
  row: SignatureData;
  roleLabel?: string;
}) {
  return (
    <tr>
      <Cell className="whitespace-nowrap">{roleLabel || row.role}</Cell>
      <Cell>{row.name}</Cell>
      <Cell>
        {row.signatureImage ? (
          <img
            src={row.signatureImage}
            alt="signature"
            className="h-10 object-contain"
          />
        ) : (
          <div className="h-10 border border-dashed border-black" />
        )}
      </Cell>
      <Cell>{row.contactNo}</Cell>
      <Cell>{row.date}</Cell>
      <Cell>{row.time}</Cell>
    </tr>
  );
}

function toAmPm(t?: string) {
  if (!t) return "";
  const [hh, mm] = t.split(":");
  const h = parseInt(hh, 10);
  const am = h < 12;
  const h12 = ((h + 11) % 12) + 1;
  return `${String(h12).padStart(2, "0")}:${mm} ${am ? "AM" : "PM"}`;
}

export default function HTPermitPreview({ data }: { data: PermitFormData }) {
  const basic = data.stepData.basic;
  const workAuth = data.stepData.workAuth;
  const deE = data.stepData.deEnergize;
  const ptw = data.stepData.permitToWork;
  const pre = data.stepData.preExecution;
  const job = data.stepData.jobCompletion;
  const rei = data.stepData.reEnergizeInstruction;
  const rea = data.stepData.reEnergizeAuthorization;

  const handlePrint = () => {
    try {
      const el = document.querySelector(
        ".permit-print-area",
      ) as HTMLElement | null;
      if (!el) {
        window.print();
        return;
      }
      const w = window.open("", "_blank");
      if (!w) {
        window.print();
        return;
      }
      const styles = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style'),
      )
        .map((s) => s.outerHTML)
        .join("");
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Permit Print</title>${styles}<style>@page{size:A4;margin:10mm;} body{background:white;color:black;-webkit-print-color-adjust:exact;print-color-adjust:exact;} .permit-print-area{width:210mm;transform:none;transform-origin:top left;} @media print{ .permit-print-area{width:210mm;transform:none;transform-origin:top left;} }</style></head><body>${el.outerHTML}</body></html>`;
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => {
        try {
          w.print();
        } catch (e) {
          /* ignore */
        }
      }, 500);
    } catch (e) {
      try {
        window.print();
      } catch {}
    }
  };

  return (
    <div
      className="mx-auto bg-white text-black permit-print-area"
      style={{ width: "210mm" }}
    >
      <style>{`.permit-print-area .compact-table td, .permit-print-area .compact-table th { padding: 6px 6px !important; font-size: 10px !important; line-height: 1.1 !important; }
.permit-print-area .compact-table th { font-weight: 600 !important; }
.permit-print-area .compact-table td { height: 20px !important; }
.permit-print-area .compact-table .signature-cell { min-height: 36px !important; }
.permit-print-area table { border-collapse: collapse !important; }
.permit-print-area .print-group { box-sizing: border-box; margin: 0; padding: 0; }
.permit-print-area .page-section { break-inside: avoid; page-break-inside: avoid; }
@media print {
  html, body { margin: 0; padding: 0; }
  @page { size: A4; margin: 6mm; }
  .permit-print-area { width: 210mm !important; margin: 0 auto !important; }
  .permit-print-area .compact-table td, .permit-print-area .compact-table th { padding: 3px 6px !important; font-size: 9px !important; }
  .permit-print-area .print-group { page-break-after: always; break-after: page; page-break-inside: avoid; break-inside: avoid; border: none !important; padding: 6px !important; }
  .permit-print-area .print-group:last-child { page-break-after: auto; }
  /* Ensure specific groups start on their intended pages */
  .permit-print-area .print-page-2 { page-break-before: always; break-before: page; }
  .permit-print-area .print-page-3 { page-break-before: always; break-before: page; }
  /* Prevent large margins from creating empty trailing pages */
  .permit-print-area .print-group > * { margin: 0; }
  /* Extra compacting for De-energize block to keep it with checklist */
  .permit-print-area .deE-block .compact-table th,
  .permit-print-area .deE-block .compact-table td {
    padding: 2px 4px !important;
    font-size: 9px !important;
    line-height: 1 !important;
  }
  .permit-print-area .deE-block .compact-table td { height: 16px !important; }
  .permit-print-area .deE-block .signature-cell img { height: 22px !important; }
  .permit-print-area .deE-block { page-break-inside: avoid !important; break-inside: avoid !important; }
}
`}</style>

      {/* Single outer border container for all content */}
      <div className="border border-black">
        <div className="print-page-1 print-group p-3">
          {/* Header */}
          <div className="grid grid-cols-12 items-center p-2">
            <div className="col-span-3">
              <div className="bg-gray-200 text-gray-800 font-bold inline-block px-3 py-2">
                AM/NS INDIA
              </div>
            </div>
            <div className="col-span-6 text-center">
              <div className="text-[14px] font-bold text-gray-900">
                ArcelorMittal Nippon Steel India Limited
              </div>
              <div className="text-[12px] text-gray-800">HAZIRA</div>
            </div>
            <div className="col-span-3 text-[10px] text-right">
              <div>
                <span className="font-semibold">Certificate No.:</span>{" "}
                {data.certificateNo}
              </div>
              <div className="mt-1">
                <span className="font-semibold">Permit No.:</span>{" "}
                {data.permitNo}
              </div>
            </div>
          </div>
          <div className="text-center bg-gray-800 text-white text-[13px] font-bold py-2">
            ADDITIONAL WORK PERMIT FOR HIGH TENSION LINE/Equipment
            <div className="text-[11px] font-normal">
              (To be filled-up by Requisitioner / Executor) For 1000 V and above
            </div>
          </div>

          {/* Part A */}
          <div className="p-2">
            <div className="text-[12px] font-bold mb-1">
              Part - A: REQUEST TO WORK ON HT LINE
            </div>
            <table className="w-full border border-black border-collapse text-[11px]">
              <tbody>
                <tr>
                  <Cell className="font-semibold w-[22%]">
                    Power Line to be Isolated
                  </Cell>
                  <Cell className="w-[28%]">{basic.powerLine}</Cell>
                  <Cell className="font-semibold w-[22%]">
                    Cross Ref. Permit No:
                  </Cell>
                  <Cell className="w-[28%]">{basic.crossRefPermitNo}</Cell>
                </tr>
                <tr>
                  <Cell className="font-semibold">Plant will be affected</Cell>
                  <Cell>{basic.affectedPlant}</Cell>
                  <Cell className="font-semibold">Dept. & Location</Cell>
                  <Cell>{basic.deptLocation}</Cell>
                </tr>
                <tr>
                  <Cell className="font-semibold">Description of the Job</Cell>
                  <td className="border border-black p-2 align-top" colSpan={3}>
                    <div className="min-h-[40px] whitespace-pre-wrap">
                      {basic.jobDescription}
                    </div>
                  </td>
                </tr>
                <tr>
                  <Cell className="font-semibold">Validity</Cell>
                  <td className="border border-black p-2 align-top" colSpan={3}>
                    <div className="flex flex-wrap gap-x-2">
                      <span>From Date</span>
                      <span className="inline-block min-w-[86px] border-b border-black">
                        {basic.validity.fromDate}
                      </span>
                      <span>at</span>
                      <span className="inline-block min-w-[70px] border-b border-black">
                        {toAmPm(basic.validity.fromTime)}
                      </span>
                      <span>AM / PM</span>
                      <span>to Date</span>
                      <span className="inline-block min-w-[86px] border-b border-black">
                        {basic.validity.toDate}
                      </span>
                      <span>at</span>
                      <span className="inline-block min-w-[70px] border-b border-black">
                        {toAmPm(basic.validity.toTime)}
                      </span>
                      <span>AM / PM</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Part B */}
          <div className="px-2 pb-1">
            <div className="text-[12px] font-bold">
              Part - B: WORK STARTING AUTHORISATION FOR HT LINE
            </div>
            <div className="text-[11px] mb-1">
              (To be filled-up by Operation-In-Charge of working area)
            </div>
            <div className="text-[11px] mt-1 flex items-center">
              <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                {workAuth.confirmation ? "✓" : ""}
              </span>
              <span>
                The above mentioned equipment / related power cable may be
                de-energized as requested.
              </span>
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-1">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-left">
                    Authorised Person
                  </th>
                  <th className="border border-black p-2 text-left">Name</th>
                  <th className="border border-black p-2 text-left">
                    Signature
                  </th>
                  <th className="border border-black p-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {workAuth.rows.map((r, i) => (
                  <SigRow key={i} row={r} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Part C */}
          <div className="p-2">
            <div className="text-[12px] font-bold">
              Part - C: DE-ENERGISING AUTHORISATION FOR HT LINE
            </div>
            <div className="text-[11px]">
              (To be filled by Authorised Person of Electrical Operation)
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-1 compact-table">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 w-10">Sr.</th>
                  <th className="border border-black p-2 text-left">
                    Activity
                  </th>
                  <th className="border border-black p-2 w-12">Yes</th>
                  <th className="border border-black p-2 w-12">NA</th>
                  <th className="border border-black p-2 w-48 text-left">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {deE.checklist.map((r) => (
                  <tr key={r.id}>
                    <Cell className="text-center">{r.id}</Cell>
                    <Cell>{r.activity}</Cell>
                    <Cell className="text-center">
                      <YesNo v={r.answer} />
                    </Cell>
                    <Cell className="text-center">
                      <YesNo v={r.answer === "na" ? "yes" : ""} />
                    </Cell>
                    <Cell>{r.remarks}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="page-section">
              <div className="mt-1 text-[11px] flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {deE.confirmation ? "✓" : ""}
                </span>
                <span>
                  The above mentioned power cable [Feeder] / equipment is
                  de-energised after performing above Checks / Activities
                </span>
              </div>
              <div className="overflow-x-auto mt-1">
                <table className="w-full border border-black border-collapse text-[10px] compact-table">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2 text-left">
                        Authorised Person
                      </th>
                      <th className="border border-black p-2 text-left">
                        Name
                      </th>
                      <th className="border border-black p-2 text-left">
                        Signature
                      </th>
                      <th className="border border-black p-2 text-left">
                        Contact No.
                      </th>
                      <th className="border border-black p-2 text-left">
                        Date
                      </th>
                      <th className="border border-black p-2 text-left">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deE.authorization.map((r, i) => (
                      <SigRow key={i} row={r} roleLabel="Electrical Dept." />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="print-page-2 print-group p-3">
          {/* Part D */}
          <div className="pb-2 mb-4 px-2">
            <div className="text-[12px] font-bold">
              Part - D: PERMIT TO WORK AUTHORISATION
            </div>
            <div className="text-[11px]">
              (To be filled by Permit Issuing Authorities)
            </div>
            <div className="text-[11px] mt-1">
              Permit is hereby issued to Mr.{" "}
              <span className="border-b border-black inline-block min-w-[120px]">
                {ptw.workerName}
              </span>{" "}
              for working on{" "}
              <span className="border-b border-black inline-block min-w-[120px]">
                {ptw.equipmentType}
              </span>
            </div>
            <div className="text-[11px] mt-1">
              From{" "}
              <span className="border-b border-black inline-block min-w-[90px]">
                {ptw.timeRange.fromDate}
              </span>{" "}
              at{" "}
              <span className="border-b border-black inline-block min-w-[70px]">
                {toAmPm(ptw.timeRange.fromTime)}
              </span>{" "}
              To{" "}
              <span className="border-b border-black inline-block min-w-[90px]">
                {ptw.timeRange.toDate}
              </span>{" "}
              at{" "}
              <span className="border-b border-black inline-block min-w-[70px]">
                {toAmPm(ptw.timeRange.toTime)}
              </span>
            </div>
            <div className="text-[11px] mt-1">
              Cable / feeder / system and ensuring safe working condition after
              performing Lock out and Tag out (LOTO) operation on Breaker /
              Switch. This permit is valid till the return of job completion
              AUTHORISATION.
            </div>
            <div className="text-[11px] mt-1 flex items-center">
              <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                {ptw.safetyConfirmed ? "✓" : ""}
              </span>
              <span>Safety procedures have been followed.</span>
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-left">
                    Authorised Person
                  </th>
                  <th className="border border-black p-2 text-left">Name</th>
                  <th className="border border-black p-2 text-left">
                    Signature
                  </th>
                  <th className="border border-black p-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {ptw.authorization.map((r, i) => (
                  <SigRow key={i} row={r} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Part E */}
          <div className="mb-4 px-2">
            <div className="text-[12px] font-bold">
              Part - E: PRE-EXECUTION CHECKUP OF ISOLATED SYSTEM
            </div>
            <div className="text-[11px]">
              (To be filled-up by Requisitioner / Executor)
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 w-10">Sr.</th>
                  <th className="border border-black p-2 text-left">
                    Activity
                  </th>
                  <th className="border border-black p-2 w-12">Yes</th>
                  <th className="border border-black p-2 w-12">NA</th>
                  <th className="border border-black p-2 w-48 text-left">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {pre.checklist.map((r) => (
                  <tr key={r.id}>
                    <Cell className="text-center">{r.id}</Cell>
                    <Cell>{r.activity}</Cell>
                    <Cell className="text-center">
                      <YesNo v={r.answer} />
                    </Cell>
                    <Cell className="text-center">
                      <YesNo v={r.answer === "na" ? "yes" : ""} />
                    </Cell>
                    <Cell>{r.remarks}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] mt-1 flex items-center">
              <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                {pre.confirmation ? "✓" : ""}
              </span>
              <span>
                Above checkup of the Isolated cable / equipment has been done
                before starting the work to ensure safe working condition.
              </span>
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-left">
                    Authorised Person
                  </th>
                  <th className="border border-black p-2 text-left">Name</th>
                  <th className="border border-black p-2 text-left">
                    Signature
                  </th>
                  <th className="border border-black p-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {pre.authorization.map((r, i) => (
                  <SigRow key={i} row={r} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Part F */}
          <div className="pb-2 mb-4 px-2">
            <div className="text-[12px] font-bold">
              Part - F: JOB COMPLETION AUTHORISATION
            </div>
            <div className="text-[11px]">
              (To be filled-up by Requisitioner / Executor)
            </div>
            <div className="text-[11px] mt-1">
              This is certify that the work detailed in Part-A has been
              completed / stopped due to urgent requirement. All tools unused
              material & manpower have been removed. Locally provided temporary
              safety ground has been removed. Locks & Tags is safe for charging.
            </div>
            <div className="text-[11px] mt-1 grid grid-cols-1 gap-1">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {job.safetyChecks.toolsRemoved ? "✓" : ""}
                </span>
                <span>Tools and unused material removed</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {job.safetyChecks.manpowerEvacuated ? "✓" : ""}
                </span>
                <span>Manpower evacuated</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {job.safetyChecks.groundsRemoved ? "✓" : ""}
                </span>
                <span>Temporary safety grounds removed</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {job.safetyChecks.areaSafe ? "✓" : ""}
                </span>
                <span>Area safe for charging</span>
              </div>
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-left">
                    Authorised Person
                  </th>
                  <th className="border border-black p-2 text-left">Name</th>
                  <th className="border border-black p-2 text-left">
                    Signature
                  </th>
                  <th className="border border-black p-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {job.authorization.map((r, i) => (
                  <SigRow key={i} row={r} roleLabel="Permit Requisitioner" />
                ))}
              </tbody>
            </table>
          </div>

          {/* Part G */}
          <div className="pb-2 mb-4 px-2">
            <div className="text-[12px] font-bold">
              Part - G: RE-ENERGISING INSTRUCTION FOR ISOLATED POWER LINE
            </div>
            <div className="text-[11px]">
              (To be filled by Permit Issuing Authorities)
            </div>
            <div className="text-[11px] mt-1">
              Job completion authorisation has been received from the
              Requisitioner / Executor for the power line de-energized earlier.
              No other job clearance has been issued on this power line.
              Affected plant is in agreement with the proposal.
            </div>
            <div className="text-[11px] mt-1 grid grid-cols-1 gap-1">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {rei.confirmations.authorizationReceived ? "✓" : ""}
                </span>
                <span>Authorization received</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {rei.confirmations.noConflicts ? "✓" : ""}
                </span>
                <span>No conflicts with other jobs</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {rei.confirmations.personnelNotified ? "✓" : ""}
                </span>
                <span>Personnel notified</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                  {rei.confirmations.systemReady ? "✓" : ""}
                </span>
                <span>System ready</span>
              </div>
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-left">
                    Authorised Person
                  </th>
                  <th className="border border-black p-2 text-left">Name</th>
                  <th className="border border-black p-2 text-left">
                    Signature
                  </th>
                  <th className="border border-black p-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {rei.authorization.map((r, i) => (
                  <SigRow key={i} row={r} roleLabel="Permit Issuing Autho." />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="print-page-3 print-group p-3">
          {/* Part H */}
          <div className="pb-3 px-2">
            <div className="text-[12px] font-bold">
              Part - H: RE-ENERGISING AUTHORISATION
            </div>
            <div className="text-[11px]">
              (To be filled by Authorised Person of Electrical Operation)
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 w-10">Sr.</th>
                  <th className="border border-black p-2 text-left">
                    Activity
                  </th>
                  <th className="border border-black p-2 w-12">Yes</th>
                  <th className="border border-black p-2 w-12">NA</th>
                  <th className="border border-black p-2 w-48 text-left">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {rea.checklist.map((r) => (
                  <tr key={r.id}>
                    <Cell className="text-center">{r.id}</Cell>
                    <Cell>{r.activity}</Cell>
                    <Cell className="text-center">
                      <YesNo v={r.answer} />
                    </Cell>
                    <Cell className="text-center">
                      <YesNo v={r.answer === "na" ? "yes" : ""} />
                    </Cell>
                    <Cell>{r.remarks}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] mt-1 flex items-center">
              <span className="inline-block w-3 h-3 border border-black mr-2 text-center leading-3">
                {rea.finalConfirmation ? "✓" : ""}
              </span>
              <span>
                The work detailed in Part-A power cable (Feeder) is re-energised
                after performing above Checks / Activities
              </span>
            </div>
            <table className="w-full border border-black border-collapse text-[10px] mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-black p-2 text-left">
                    Authorised Person
                  </th>
                  <th className="border border-black p-2 text-left">Name</th>
                  <th className="border border-black p-2 text-left">
                    Signature
                  </th>
                  <th className="border border-black p-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {rea.authorization.map((r, i) => (
                  <SigRow key={i} row={r} roleLabel="Electrical Dept." />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print button - outside the border */}
      <div className="mt-4 flex justify-end px-2 pb-6 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </div>
  );
}
