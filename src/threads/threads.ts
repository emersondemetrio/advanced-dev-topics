import { cpus } from "os";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

type Range = { start: number; end: number };

const splitWorkload = (total: number, workers: number): Range[] => {
  if (total <= 0) return [];
  const chunkSize = Math.ceil(total / workers);
  const ranges: Range[] = [];
  for (let start = 0; start < total; start += chunkSize) {
    ranges.push({ start, end: Math.min(start + chunkSize, total) });
  }
  return ranges;
};

const runWorkers = (ranges: Range[]): Promise<number[]> => {
  return Promise.all(
    ranges.map(
      (range) =>
        new Promise<number>((resolve, reject) => {
          const worker = new Worker(__filename, { workerData: range });
          worker.once("message", (value: number) => resolve(value));
          worker.once("error", reject);
        })
    )
  );
};

const main = async (): Promise<void> => {
  const totalNumbers = 100_000_000;
  const cores = cpus().length || 1;
  const workers = cores;

  const ranges = splitWorkload(totalNumbers, workers);
  if (ranges.length === 0) {
    console.log("Nothing to sum.");
    return;
  }

  const partials = await runWorkers(ranges);
  const total = partials.reduce((acc, value) => acc + value, 0);

  console.log(`Summed numbers 0..${totalNumbers - 1}`);
  console.log(`Workers used: ${ranges.length} (detected cores: ${cores})`);
  console.log(`Result: ${total}`);
};

const workerTask = (): void => {
  const { start, end } = workerData as Range;
  let subtotal = 0;
  for (let i = start; i < end; i++) {
    subtotal += i;
  }
  parentPort?.postMessage(subtotal);
};

if (isMainThread) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else {
  workerTask();
}
