import React, { useState } from "react";

const SiteSetting = () => {
  const [activeTab, setActiveTab] = useState("site");

  const tabs = ["site", "social", "mail", "payment", "sms"];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-t-lg ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-100 p-4 rounded-lg">
        {activeTab === "site" && <div>Site Settings Form</div>}
        {activeTab === "social" && <div>Social Settings Form</div>}
        {activeTab === "mail" && <div>Mail Settings Form</div>}
        {activeTab === "payment" && <div>Payment Settings Form</div>}
        {activeTab === "sms" && <div>SMS Settings Form</div>}
      </div>
    </div>
  );
};

export default SiteSetting;