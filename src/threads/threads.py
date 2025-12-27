import argparse
import concurrent.futures
import math
import os
from typing import Iterable, List, Optional, Tuple


def split_workload(total: int, workers: int) -> List[Tuple[int, int]]:
    """Split a range [0, total) into nearly even chunks."""
    if total <= 0:
        return []

    workers = max(1, workers)
    chunk_size = math.ceil(total / workers)
    return [
        (start, min(start + chunk_size, total))
        for start in range(0, total, chunk_size)
    ]


def partial_sum(bounds: Tuple[int, int]) -> int:
    start, end = bounds
    result = sum(range(start, end))
    print(f'start={start} | end={end} | result={result}\n')
    return result


def sum_numbers(total: int, workers: Optional[int] = None) -> int:
    if workers is None:
        workers = os.cpu_count() or 1

    ranges = split_workload(total, workers)
    print(ranges)
    if not ranges:
        return 0

    # Threads: good for IO; CPU-bound work may still be limited by the GIL.
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(ranges)) as pool:
        partials: Iterable[int] = pool.map(partial_sum, ranges)
    return sum(partials)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sum numbers using threads.")
    parser.add_argument(
        "--total",
        type=int,
        default=100_000_000,
        help="Total count of sequential numbers to sum (default: 100,000,000).",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=None,
        help="Number of worker threads (default: CPU count).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    cores = os.cpu_count() or 1
    workers = args.workers or cores
    total = args.total

    result = sum_numbers(total, workers)

    print(f"Summed numbers 0..{args.total - 1}")
    print(f"Workers used: {workers} (detected cores: {cores})")
    print(f"Result: {result}")


if __name__ == "__main__":
    main()
