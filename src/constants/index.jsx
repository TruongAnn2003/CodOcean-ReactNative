import icons from "./icons";
import images from "./images";
import aminations from "./aminations";

export { icons, images, aminations };
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  GUEST: "GUEST",
};
export const LIMIT_QUANTITY_TOPICS = 3;

export const LIMIT_ROW_PROBLEMS_TABLE = 20;

export const WEEKS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const FILTER_DEFAULT = {
  pageNumber: 0,
  limit: 1,
  status: "All",
  difficulty: "All",
  topic: "All",
  searchTerm: "",
};

export const PROBLEM_STATUS = ["ALL", "SOLVED", "TODO", "ATTEMPTED"];
export const PROBLEM_DIFFICULTY = ["ALL", "EASY", "NORMAL", "HARD"];