import { createCompiler } from './compiler';

createCompiler().run((err: any, stats: any) => {
    if (err) {
        throw err;
    }
    // console.log(stats);
});