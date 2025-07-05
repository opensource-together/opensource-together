import { ClockPort } from './clock.port';

export class MockClock implements ClockPort {
  constructor(private fixedDate: Date) {}

  now(): Date {
    return this.fixedDate;
  }

  setTime(date: Date): void {
    this.fixedDate = date;
  }

  advanceBy(
    amount: number,
    unit: 'minutes' | 'hours' | 'days' | 'months',
  ): void {
    const milliseconds = this.getMilliseconds(amount, unit);
    this.fixedDate = new Date(this.fixedDate.getTime() + milliseconds);
  }

  setCreatedAt(date: Date): void {
    this.fixedDate = date;
  }

  private getMilliseconds(amount: number, unit: string): number {
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      months: 30 * 24 * 60 * 60 * 1000, // Approximation
    };
    return amount * multipliers[unit];
  }
}
