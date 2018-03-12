#!/usr/bin/env node
import { build } from './build';
import { run } from './run';

switch (process.argv[2]) {
    case 'run':
        run();
    default:
        build();
}