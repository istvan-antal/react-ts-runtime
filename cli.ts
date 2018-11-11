#!/usr/bin/env node
import { build } from './build';
import { run } from './run';
import { create } from './create';

switch (process.argv[2]) {
    case 'run':
        run();
        break;
    case 'create':
        create();
        break;
    default:
        build();
}