export class DuplicateCheckInSameDayError extends Error {
  constructor() {
    super('Already checked in on this day');
  }
}