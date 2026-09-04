#!/usr/bin/env node

/**
 * Zero-dependency latency benchmark against the workerd preview (pnpm worker:preview).
 *
 * Usage: pnpm bench [--base URL] [--duration SEC] [--concurrency N] [--warmup SEC] [paths...]
 *
 * Reports wall-time percentiles; real per-request CPU time is only visible in
 * the Cloudflare dashboard (Workers > Metrics > CPU Time per Request).
 */

const DEFAULT_BASE = "http://localhost:8787";
const DEFAULT_DURATION = 10;
const DEFAULT_CONCURRENCY = 4;
const DEFAULT_WARMUP = 3;

function parseArgs(rawArgv) {
  const argv = rawArgv.filter((arg) => arg !== "--");
  const options = {
    base: DEFAULT_BASE,
    duration: DEFAULT_DURATION,
    concurrency: DEFAULT_CONCURRENCY,
    warmup: DEFAULT_WARMUP,
    paths: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--base":
        options.base = argv[++i];
        break;
      case "--duration":
        options.duration = Number(argv[++i]);
        break;
      case "--concurrency":
        options.concurrency = Number(argv[++i]);
        break;
      case "--warmup":
        options.warmup = Number(argv[++i]);
        break;
      case "--help":
      case "-h":
        console.log(
          "Usage: node scripts/bench.mjs [--base URL] [--duration SEC] [--concurrency N] [--warmup SEC] [paths...]"
        );
        process.exit(0);
        break;
      default:
        if (arg.startsWith("--")) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
        options.paths.push(arg);
    }
  }

  if (options.paths.length === 0) options.paths.push("/");
  return options;
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0;
  const index = Math.min(
    sortedValues.length - 1,
    Math.ceil((p / 100) * sortedValues.length) - 1
  );
  return sortedValues[Math.max(0, index)];
}

async function runPhase(base, path, durationSeconds, concurrency) {
  const url = `${base.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const deadline = Date.now() + durationSeconds * 1000;
  const latencies = [];
  const statusCounts = new Map();
  let errors = 0;
  let lastError = null;
  let requests = 0;

  async function worker() {
    while (Date.now() < deadline) {
      const startedAt = performance.now();
      try {
        const response = await fetch(url, {
          redirect: "manual",
          headers: { "user-agent": "ost-bench/1.0" },
        });
        // Drain the body so timing includes the full response transfer.
        await response.arrayBuffer();
        const elapsed = performance.now() - startedAt;
        requests++;
        latencies.push(elapsed);
        statusCounts.set(
          response.status,
          (statusCounts.get(response.status) ?? 0) + 1
        );
      } catch (error) {
        errors++;
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, concurrency) }, () => worker())
  );

  return { url, requests, latencies, statusCounts, errors, lastError };
}

function printResult(result) {
  const { url, requests, latencies, statusCounts, errors, lastError } = result;
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = latencies.reduce((acc, value) => acc + value, 0);
  const mean = requests > 0 ? sum / requests : 0;

  const statuses = [...statusCounts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([status, count]) => `${status}×${count}`)
    .join("  ");

  console.log(`\n${url}`);
  console.log(
    [
      `requests: ${requests}`,
      `errors: ${errors}`,
      `statuses: ${statuses || "-"}`,
      `rps: ${(requests / (result.durationSeconds || 1)).toFixed(1)}`,
    ].join("  |  ")
  );

  if (requests > 0) {
    console.log(
      [
        `p50: ${percentile(sorted, 50).toFixed(1)}ms`,
        `p90: ${percentile(sorted, 90).toFixed(1)}ms`,
        `p99: ${percentile(sorted, 99).toFixed(1)}ms`,
        `max: ${sorted[sorted.length - 1].toFixed(1)}ms`,
        `mean: ${mean.toFixed(1)}ms`,
      ].join("  |  ")
    );
  }

  if (errors > 0 && lastError) {
    console.log(`last error: ${lastError.message ?? lastError}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log(
    `Benchmarking ${options.base} — duration=${options.duration}s, concurrency=${options.concurrency}, warmup=${options.warmup}s per path`
  );

  try {
    const probe = await fetch(
      `${options.base.replace(/\/+$/, "")}/robots.txt`,
      {
        redirect: "manual",
      }
    );
    await probe.body?.cancel();
  } catch (error) {
    console.error(
      `\nCould not reach ${options.base}. Start the worker first: pnpm worker:build && pnpm worker:preview`
    );
    console.error(error.message ?? error);
    process.exit(1);
  }

  for (const path of options.paths) {
    if (options.warmup > 0) {
      process.stdout.write(`\nWarming up ${path} for ${options.warmup}s...`);
      await runPhase(options.base, path, options.warmup, options.concurrency);
      console.log(" done");
    }

    process.stdout.write(`Measuring ${path} for ${options.duration}s...`);
    const result = await runPhase(
      options.base,
      path,
      options.duration,
      options.concurrency
    );
    result.durationSeconds = options.duration;
    console.log(" done");
    printResult(result);
  }

  console.log(
    "\nReminder: local workerd reports wall time only. True CPU time per request is available in the Cloudflare dashboard after deploy."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
