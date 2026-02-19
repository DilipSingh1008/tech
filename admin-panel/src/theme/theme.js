import themes from "./themes.json";

export const getTheme = (name) => themes[name] || themes["default"];
