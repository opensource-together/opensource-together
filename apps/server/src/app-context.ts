import { INestApplicationContext } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

let appRef: INestApplicationContext;

export function setAppRef(app: INestApplicationContext): void {
  appRef = app;
}

export function getCommandBus(): CommandBus {
  return appRef.get(CommandBus, { strict: false });
}
