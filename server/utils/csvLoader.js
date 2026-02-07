import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "logs", "requests.csv");

export function loadLogs()
{
  const raw = fs.readFileSync(LOG_FILE, "utf-8").trim();
  const [header, ...rows] = raw.split("\n");
  const keys = header.split(",");

  return rows.map(row =>
  {
    const values = row
      .match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
      .map(v => v.replace(/^"|"$/g, "").replace(/""/g, '"'));

    const obj = {};
    keys.forEach((k, i) => obj[k] = values[i]);

    obj.responseTimeMs = Number(obj.responseTimeMs);
    obj.statusCode = Number(obj.statusCode);
    obj.isAuthenticated = obj.isAuthenticated === "true";
    obj.timestamp = new Date(obj.timestamp);

    return obj;
  });
}
