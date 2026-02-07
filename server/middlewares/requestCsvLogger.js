import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "requests.csv");

if (!fs.existsSync(logDir))
{
  fs.mkdirSync(logDir);
}

if (!fs.existsSync(logFile))
{
  fs.writeFileSync(
    logFile,
    [
      "timestamp",
      "method",
      "url",
      "route",
      "statusCode",
      "responseTimeMs",
      "ip",
      "forwardedFor",
      "protocol",
      "host",
      "referer",
      "origin",
      "userAgent",
      "acceptLanguage",
      "contentLength",
      "cookiesPresent",
      "isAuthenticated",
      "userId",
      "userRole",
      "queryCount",
      "paramsCount",
      "bodyKeysCount"
    ].join(",") + "\n"
  );
}

export function requestCsvLogger(req, res, next)
{
  const start = process.hrtime.bigint();

  res.on("finish", () =>
  {
    const end = process.hrtime.bigint();
    const responseTimeMs = Number(end - start) / 1e6;

    const logRow = [
      new Date().toISOString(),
      req.method,
      req.originalUrl,
      req.route?.path || "",
      res.statusCode,
      responseTimeMs.toFixed(2),
      req.ip,
      req.headers["x-forwarded-for"] || "",
      req.protocol,
      req.headers.host || "",
      req.headers.referer || "",
      req.headers.origin || "",
      req.headers["user-agent"] || "",
      req.headers["accept-language"] || "",
      res.getHeader("content-length") || "",
      Boolean(req.headers.cookie),
      Boolean(req.user),
      req.user?.id || "",
      req.user?.role || "",
      Object.keys(req.query || {}).length,
      Object.keys(req.params || {}).length,
      Object.keys(req.body || {}).length
    ]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",") + "\n";

    fs.appendFile(logFile, logRow, err =>
    {
      if (err) console.error("CSV log error:", err);
    });
  });

  next();
}
