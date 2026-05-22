// These classes are server-side only. Client callers should branch on
// `e.message`. Keep these classes here for the server-internal call sites
// and as documentation of the failure modes.

export class InvalidServingDateError extends Error {
  name = "InvalidServingDateError";
}
export class ServingAlreadyScheduledError extends Error {
  name = "ServingAlreadyScheduledError";
}
export class ServingNotFoundError extends Error {
  name = "ServingNotFoundError";
}
export class CannotUnschedulePastServingError extends Error {
  name = "CannotUnschedulePastServingError";
}
export class LunchNotFoundError extends Error {
  name = "LunchNotFoundError";
}
