#!/usr/bin/env node -r ts-node/register
import { build } from './build';
import { run } from './run';

switch (process.argv[2]) {
    case 'run':
        run();
        break;
    default:
        build();
}