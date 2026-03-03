import React from "react";

const CommonImage = ({ src, alt = "image", className }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-image.png";
  };

  return (
    <img
      src={src || "/default-image.png"}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default CommonImage;
