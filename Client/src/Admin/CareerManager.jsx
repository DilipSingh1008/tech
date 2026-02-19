import React, { useState } from "react";
import CareerTable from "./CareerTable";
import CareerForm from "./CareerForm";
import { ArrowLeft } from "lucide-react";

const CareerManager = () => {
  const [currentView, setCurrentView] = useState("list");

  return (
    <div className="p-2">
      {currentView === "list" ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CareerTable onCreateNew={() => setCurrentView("create")} />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button
            onClick={() => setCurrentView("list")}
            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Back to Job List
          </button>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <CareerForm onSuccess={() => setCurrentView("list")} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerManager;
