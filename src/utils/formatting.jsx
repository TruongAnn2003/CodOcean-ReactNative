export const formatString = (str) => {
  if (str !== null)
    return str
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  return "";
};

export function normalizeName(name) {
  if (typeof name !== "string") return "";
  else
    return name
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
}

export function normalizeVietNameseString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d");
}

export function shortenString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
}

export function generateFunctionName(problemName) {
  //Loại bỏ các khoảng trắng dư thừa và khoảng trắng ở đầu và cuối chuỗi
  const sanitizedProblemName = normalizeVietNameseString(problemName)
    .replace(/\s+/g, " ")
    .trim();

  const words = sanitizedProblemName.split(" ");
  const firstWordLowercase = words[0].toLowerCase();
  const restWords = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return `${firstWordLowercase}${restWords}`;
}

export function generateDefaultValue(dataType) {
  switch (dataType) {
    case "int":
    case "long":
      return "0";
    case "int[]":
    case "long[]":
      return "{0}";
    case "float":
    case "double":
      return "0.0";
    case "float[]":
    case "double[]":
      return "{0.0}";
    case "char":
      return '"a"';
    case "String":
      return '"abc"';
    case "char[]":
      return '{"a"}';
    case "String[]":
      return '{"abc"}';
    case "boolean":
      return "true";
    case "boolean[]":
      return "{true}";
    default:
      return null;
  }
}

export function checkInputValidation(dataType, input) {
  const isBoolean = (data) => data === "true" || data === "false";
  const isNumber = (data) => !isNaN(Number(data));

  switch (dataType) {
    case "int":
    case "long":
      return isNumber(input);
    case "int[]":
    case "long[]":
      return (
        input.startsWith("{") &&
        input.endsWith("}") &&
        input
          .substring(1, input.length - 1)
          .split(",")
          .every((element) => isNumber(element.trim()))
      );
    case "float":
    case "double":
      return isNumber(input);
    case "float[]":
    case "double[]":
      return (
        input.startsWith("{") &&
        input.endsWith("}") &&
        input
          .substring(1, input.length - 1)
          .split(",")
          .every((element) => isNumber(element.trim()))
      );
    case "char":
      return (
        typeof input === "string" &&
        input.length === 3 &&
        ((input.startsWith('"') && input.endsWith('"')) ||
          (input.startsWith("'") && input.endsWith("'")))
      );
    case "String":
      return (
        typeof input === "string" &&
        ((input.startsWith('"') && input.endsWith('"')) ||
          (input.startsWith("'") && input.endsWith("'")))
      );
    case "char[]":
      return (
        typeof input === "string" &&
        input.startsWith("{") &&
        input.endsWith("}") &&
        input
          .substring(1, input.length - 1)
          .split(",")
          .every(
            (element) =>
              element.trim().length === 3 &&
              ((element.trim().startsWith('"') &&
                element.trim().endsWith('"')) ||
                (element.trim().startsWith("'") &&
                  element.trim().endsWith("'")))
          )
      );
    case "String[]":
      return (
        typeof input === "string" &&
        input.startsWith("{") &&
        input.endsWith("}") &&
        input
          .substring(1, input.length - 1)
          .split(",")
          .every(
            (element) =>
              (element.trim().startsWith('"') &&
                element.trim().endsWith('"')) ||
              (element.trim().startsWith("'") && element.trim().endsWith("'"))
          )
      );
    case "boolean":
      return isBoolean(input);
    case "boolean[]":
      return (
        input.startsWith("{") &&
        input.endsWith("}") &&
        input
          .substring(1, input.length - 1)
          .split(",")
          .every((element) => isBoolean(element.trim()))
      );
    default:
      return false;
  }
}

export function checkParameterName(parameterName) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(parameterName);
}
