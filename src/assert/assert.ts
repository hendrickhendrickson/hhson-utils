export function assertCondition<T>(
  condition: T,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Anonymous Error");
  }
}
