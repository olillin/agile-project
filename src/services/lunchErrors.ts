// These classes are server-side only. Client callers should branch on
// `e.message`. Keep these classes here for the server-internal call sites
// and as documentation of the failure modes.

export class InvalidServingDateError extends Error {}
export class ServingAlreadyScheduledError extends Error {}
export class ServingNotFoundError extends Error {}
export class CannotUnschedulePastServingError extends Error {}
