/**
 * Exhaustiveness guard. Call in the `default` branch of a switch over a union
 * so that adding a new variant becomes a compile-time error until it is handled.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}
