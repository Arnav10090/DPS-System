import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const today = useMemo(() => new Date().toLocaleDateString(), []);
  const navigate = useNavigate();

  const onLogout = () => {
    // clear any client-side auth tokens here if present
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            aria-label="Customer name or logo"
            placeholder="Customer / Logo"
            className="h-10 w-48 rounded-input border border-[hsl(4_90%_58%)] px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(207_75%_47%)]"
          />
        </div>
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          <p>Digital Permit System (DPS)</p>
        </h1>
        <div className="flex items-center gap-4 min-w-[220px] justify-end">
          <span className="text-sm text-gray-600" aria-label="Current date">
            {today}
          </span>
          <div className="flex items-center gap-2" aria-label="Hitachi logo">
            <span className="text-xs uppercase tracking-widest font-bold text-gray-900">
              Hitachi
            </span>
            <span className="h-5 w-5 rounded-full bg-[hsl(207_75%_47%)] inline-block" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
