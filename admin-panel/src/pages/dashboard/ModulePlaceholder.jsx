import React from "react";
import { useParams } from "react-router-dom";

const ModulePlaceholder = () => {
  const { name } = useParams();

  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-xl font-semibold text-gray-100 capitalize">
        {name?.replace(/-/g, " ")} Module
      </h2>
      <p className="text-sm text-gray-400 mt-2">
        This module is added in sidebar and permissions. Build its page and route when ready.
      </p>
    </div>
  );
};

export default ModulePlaceholder;

