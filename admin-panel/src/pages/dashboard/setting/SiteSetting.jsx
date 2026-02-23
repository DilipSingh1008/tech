import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import SiteSettingsForm from "./SiteTab";
import SocialForms from "./SocailForms";
import MailForm from "./MailForm";
import Payment from "./Payment";
import SmsForm from "./SmsFrom";

const SiteSetting = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("site");

  const tabs = ["site", "social", "mail", "payment", "sms"];

  // theme object following your Location.jsx pattern
  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border-gray-800"
      : "bg-white border-gray-200",
    tabActive: isDarkMode
      ? "border-(--primary) text-(--primary) bg-(--primary)/10"
      : "border-(--primary) text-(--primary) bg-gray-100",
    tabInactive: isDarkMode
      ? "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
      : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-200/50",
    divider: isDarkMode ? "border-gray-800" : "border-gray-200",
  };

  return (
    <div className={`flex-1 overflow-y-auto p-4 md:p-6 transition-colors duration-300 ${theme.main}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Tab Navigation */}
        <div className={`flex flex-wrap gap-1 border-b mb-6 ${theme.divider}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize cursor-pointer px-6 py-2.5 text-xs font-bold transition-all duration-200 border-b-2 tracking-wider ${
                activeTab === tab ? theme.tabActive : theme.tabInactive
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${theme.card}`}>
          <div className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
              {activeTab} Settings
            </h2>
            
            <div className="mt-2">
              {activeTab === "site" && <SiteSettingsForm />}
              {activeTab === "social" && <SocialForms />}
              {activeTab === "mail" && <MailForm />}
              {activeTab === "payment" && <Payment />}
              {activeTab === "sms" && <SmsForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSetting;