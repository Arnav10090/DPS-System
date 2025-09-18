import React, { useMemo } from "react";
import { FormWizard, HTPermitHeader } from "@/components/permit/ht/components";
import type {
  PermitDraftEnvelope,
  PermitFormData,
} from "@/lib/ht-permit-types";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function createInitialData(): PermitFormData {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return {
    permitId: crypto.randomUUID(),
    certificateNo: "",
    permitNo: "",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stepData: {
      basic: {
        powerLine: "",
        affectedPlant: "",
        jobDescription: "",
        crossRefPermitNo: "",
        deptLocation: "",
        validity: {
          fromDate: today,
          fromTime: time,
          toDate: today,
          toTime: time,
        },
      },
      workAuth: {
        confirmation: false,
        rows: [
          {
            name: "",
            role: "Permit Requisitioner",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
          {
            name: "",
            role: "Permit Issuing Authority",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
      deEnergize: {
        checklist: [
          {
            id: 1,
            activity: "All back feeding circuits checked & isolated",
            answer: "",
            remarks: "",
          },
          {
            id: 2,
            activity: "Control supply switched off",
            answer: "",
            remarks: "",
          },
          {
            id: 3,
            activity: "Breaker/MCC switched off & front lid opened",
            answer: "",
            remarks: "",
          },
          {
            id: 4,
            activity: "Breaker racked out & control plug removed",
            answer: "",
            remarks: "",
          },
          {
            id: 5,
            activity: "All fuses pulled out and kept at proper place",
            answer: "",
            remarks: "",
          },
          {
            id: 6,
            activity: "Back cover / lid of Breaker Panel opened",
            answer: "",
            remarks: "",
          },
          {
            id: 7,
            activity: "Breaker / MCC internals visually checked",
            answer: "",
            remarks: "",
          },
          {
            id: 8,
            activity:
              "No live voltage observed on Voltage Test using Voltage detector",
            answer: "",
            remarks: "",
          },
          {
            id: 9,
            activity: "Line discharged through Earth Rod",
            answer: "",
            remarks: "",
          },
          {
            id: 10,
            activity: "Temporary earthing provided",
            answer: "",
            remarks: "",
          },
          {
            id: 11,
            activity: "Breaker/ MCC backfront lids [covers] closed",
            answer: "",
            remarks: "",
          },
          {
            id: 12,
            activity: "LOTO performed on Breaker/MCC Module",
            answer: "",
            remarks: "",
          },
        ],
        confirmation: false,
        authorization: [
          {
            name: "",
            role: "Electrical Department",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
      permitToWork: {
        workerName: "",
        equipmentType: "",
        timeRange: {
          fromDate: today,
          fromTime: time,
          toDate: today,
          toTime: time,
        },
        safetyConfirmed: false,
        authorization: [
          {
            name: "",
            role: "Permit Issuing Authority",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
      preExecution: {
        checklist: [
          {
            id: 1,
            activity: "Breaker is in racked out position",
            answer: "",
            remarks: "",
          },
          {
            id: 2,
            activity:
              "No live voltage observed on cable discharged by grounding",
            answer: "",
            remarks: "",
          },
          {
            id: 3,
            activity:
              "No line voltage observed on Voltage Test using Voltage detector",
            answer: "",
            remarks: "",
          },
          {
            id: 4,
            activity: "Local earthing provided",
            answer: "",
            remarks: "",
          },
          {
            id: 5,
            activity: "LOTO done on Breaker/ MCC Module",
            answer: "",
            remarks: "",
          },
        ],
        confirmation: false,
        authorization: [
          {
            name: "",
            role: "Authorised Person",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
          {
            name: "",
            role: "Permit Requisitioner",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
      jobCompletion: {
        status: "",
        safetyChecks: {
          toolsRemoved: false,
          manpowerEvacuated: false,
          groundsRemoved: false,
          areaSafe: false,
        },
        authorization: [
          {
            name: "",
            role: "Requisitioner / Executor",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
      reEnergizeInstruction: {
        confirmations: {
          authorizationReceived: false,
          noConflicts: false,
          personnelNotified: false,
          systemReady: false,
        },
        authorization: [
          {
            name: "",
            role: "Permit Issuing Authority",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
      reEnergizeAuthorization: {
        checklist: [
          {
            id: 1,
            activity: "Damaged internals of Breaker/ MCC rectified",
            answer: "",
            remarks: "",
          },
          {
            id: 2,
            activity: "Temporary earthing removed",
            answer: "",
            remarks: "",
          },
          {
            id: 3,
            activity: "IR Value of Cable/Equipment Checked-found O.K.",
            answer: "",
            remarks: "",
          },
          {
            id: 4,
            activity: "Back lid / cover of Breaker boxed up",
            answer: "",
            remarks: "",
          },
          {
            id: 5,
            activity: "All Locks & Tags of Breaker removed",
            answer: "",
            remarks: "",
          },
          {
            id: 6,
            activity: "All fuses put back in place",
            answer: "",
            remarks: "",
          },
          {
            id: 7,
            activity: "Breaker control plug put back in place",
            answer: "",
            remarks: "",
          },
          {
            id: 8,
            activity: "Breaker checked in test position & found O.K.",
            answer: "",
            remarks: "",
          },
          {
            id: 9,
            activity: "Trip circuit found healthy",
            answer: "",
            remarks: "",
          },
          {
            id: 10,
            activity: "Breaker racked in to service position",
            answer: "",
            remarks: "",
          },
          {
            id: 11,
            activity: "Control supply switched on",
            answer: "",
            remarks: "",
          },
          {
            id: 12,
            activity: "Breaker / MCC Module front door closed",
            answer: "",
            remarks: "",
          },
          {
            id: 13,
            activity: "MCC [MCU Module] switched on",
            answer: "",
            remarks: "",
          },
          {
            id: 14,
            activity: "All cables are dressed properly",
            answer: "",
            remarks: "",
          },
        ],
        finalConfirmation: false,
        authorization: [
          {
            name: "",
            role: "Electrical Department",
            contactNo: "",
            date: today,
            time,
            signatureImage: "",
          },
        ],
      },
    },
  };
}

export default function HTPermitForm() {
  const draftKeyBase = "ht-permit";
  const navigate = useNavigate();

  // restore latest draft if any
  const initial = useMemo(() => {
    const latest = localStorage.getItem(draftKeyBase + "-latest");
    if (latest) {
      try {
        const env = JSON.parse(latest) as PermitDraftEnvelope;
        return env.data;
      } catch {}
    }
    return createInitialData();
  }, []);

  const onSaveDraft = (data: PermitFormData) => {
    const env: PermitDraftEnvelope = { data, auditTrail: [] };
    localStorage.setItem(`ht-permit-${data.permitId}`, JSON.stringify(env));
    localStorage.setItem("ht-permit-latest", JSON.stringify(env));
  };

  const onSubmit = (data: PermitFormData) => {
    const env: PermitDraftEnvelope = {
      data: { ...data, status: "submitted" },
      auditTrail: [],
    };
    localStorage.setItem(`ht-permit-${data.permitId}`, JSON.stringify(env));
    localStorage.setItem("ht-permit-latest", JSON.stringify(env));
    alert(
      "Permit submitted successfully. You can use the browser Print to save a PDF.",
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="mb-4 flex items-center justify-between mx-auto max-w-7xl px-4 pt-6">
        <div>
          <h1 className="text-[20px] font-semibold">
            Create New Work Permit For High Tension Line/Equipment
          </h1>
          <div className="text-sm text-gray-500">
            <p>
              <span className="text-sm">{`WCS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Work Permit Form Type:</span>
          <div className="w-[220px]">
            <Select
              value={"highTension"}
              onValueChange={(v) => {
                if (v === "work") navigate("/permit-details");
                if (v === "highTension") return;
                if (v === "gasLine") navigate("/gas-permit");
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
      <div className="mx-auto max-w-7xl px-4 pb-6 space-y-6">
        <FormWizard
          initial={initial}
          onSaveDraft={onSaveDraft}
          onSubmit={onSubmit}
          renderHeader={() => <HTPermitHeader />}
        />
        <div className="text-xs text-gray-500">
          Use Ctrl/Cmd+P to generate a print-ready PDF.
        </div>
      </div>
    </div>
  );
}
