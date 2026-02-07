import { loadLogs } from "../utils/csvLoader.js";

export function analyticsOverview()
{
  const logs = loadLogs();

  const routeStats = {};
  const authStats = { authenticated: 0, unauthenticated: 0 };
  const timeBuckets = {};
  const latencyByRoute = {};

  const totalTraffic = logs.length;

  for (const l of logs)
  {
    /* ---------------- Route stats ---------------- */
    if (!routeStats[l.route])
    {
      routeStats[l.route] = {
        route: l.route,
        totalRequests: 0,
        totalTime: 0,
        maxTime: 0
      };
      latencyByRoute[l.route] = [];
    }

    routeStats[l.route].totalRequests++;
    routeStats[l.route].totalTime += l.responseTimeMs;
    routeStats[l.route].maxTime = Math.max(
      routeStats[l.route].maxTime,
      l.responseTimeMs
    );

    latencyByRoute[l.route].push(l.responseTimeMs);

    /* ---------------- Auth stats ---------------- */
    if (l.isAuthenticated)
      authStats.authenticated++;
    else
      authStats.unauthenticated++;

    /* ---------------- Time buckets ---------------- */
    const minute = l.timestamp.toISOString().slice(0, 16);
    timeBuckets[minute] = (timeBuckets[minute] || 0) + 1;
  }

  /* ---------------- Percentile helper ---------------- */
  const percentile = (arr, p) =>
  {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.ceil(p * sorted.length) - 1];
  };

  /* ---------------- Final shaping ---------------- */
  const routes = Object.values(routeStats).map(r => ({
    route: r.route,
    totalRequests: r.totalRequests,
    avgResponseTimeMs: +(r.totalTime / r.totalRequests).toFixed(2),
    maxResponseTimeMs: r.maxTime,
    trafficSharePercent: +(
      (r.totalRequests / totalTraffic) * 100
    ).toFixed(2)
  }));

  const latency = Object.entries(latencyByRoute).map(([route, times]) => ({
    route,
    p50: percentile(times, 0.5),
    p95: percentile(times, 0.95),
    p99: percentile(times, 0.99)
  }));

  const trafficTimeline = Object.entries(timeBuckets)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => a.time.localeCompare(b.time));

  /* ---------------- Response ---------------- */
  return {
    success: true,
    data: {
      summary: {
        totalRequests: totalTraffic,
        authenticated: authStats.authenticated,
        unauthenticated: authStats.unauthenticated
      },
      routes,
      authSplit: authStats,
      timeBasedTraffic: trafficTimeline,
      latency
    }
  }
}
