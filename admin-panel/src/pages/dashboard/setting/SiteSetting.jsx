import React, { useState } from "react";
import SiteSettingsForm from "./SiteTab";

const SiteSetting = () => {
  const [activeTab, setActiveTab] = useState("site");

  const tabs = ["site", "social", "mail", "payment", "sms"];

  return (
    <div className="p-6 pt-0 min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize cursor-pointer px-6 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 capitalize">{activeTab} Settings</h2>
        
        {/* Conditional Rendering */}
        <div className="mt-2">
          {activeTab === "site" && <SiteSettingsForm / >}
          {activeTab === "social" && <p>Manage your Facebook, X, and Instagram links.</p>}
          {activeTab === "mail" && <p>Setup SMTP and email template configurations.</p>}
          {activeTab === "payment" && <p>Integrate Stripe, PayPal, or other gateways.</p>}
          {activeTab === "sms" && <p>Manage Twilio or other SMS provider API keys.</p>}
        </div>
      </div>
    </div>
  );
};

export default SiteSetting;