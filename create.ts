import { prompt } from 'inquirer';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

const appTsxTemplate = `import * as React from 'react';

export default class App extends React.Component {
    render() {
        return (
            <div>
                React App
            </div>
        );
    }
}`;

const indexTsxTemplate = `import * as React from 'react';
import { render } from 'react-dom';
import App from './App.tsx';

render(<App />, document.getElementById('app'));`;

const reduxIndexTsxTemplate = `import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

// Replace this with actual actions union
type Actions = any;
import { connect } from 'react-redux';
import { State } from './store';
import { Dispatch, bindActionCreators } from 'redux';
const ConnectedApp = connect((state: State) => ({
}), (dispatch: Dispatch<Actions>) => bindActionCreators({
}, dispatch))(App);

render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById('app'),
);`;

const indexHtmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>React app</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

const actionsIndexTsx = `export interface Action<T extends string> {
    type: T;
}

export interface ActionWithData<T extends string, P> extends Action<T> {
    data: P;
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, data: P): ActionWithData<T, P>
export function createAction<T extends string, P>(type: T, data?: P) {
    return data === undefined ? { type } : ({ type, data });
}

type FunctionType = (...args: any[]) => any;
type ActionCreatorMapObject = { [actionCreator: string]: FunctionType };
export type ActionsUnion<A extends ActionCreatorMapObject> = ReturnType<A[keyof A]>;

// Example actions/counter.ts
/*
import { createAction, ActionsUnion } from '.';

export const counterActions = {
    reset: () => createAction('reset'),
    increment: (amount = 1) => createAction('increment', amount),
    decrement: (amount = 1) => createAction('decrement', amount),
}

export type CounterActions = ActionsUnion<typeof counterActions>;
*/

// Example reducers/counter.ts
/*
import { CounterActions } from '../actions/counter';

export const counter = (state = 0, action: CounterActions) => {
    switch (action.type) {
    case 'reset':
        return 0;
    case 'increment':
        return state + action.data;
    case 'decrement':
        return state - action.data;
    default:
        return state;    
    }
}
*/
`;

const reducersIndexTsx = `import { combineReducers } from 'redux';
// import { counter } from './counter';

export default combineReducers({
    // counter,
});`;

const storeIndexTsx = `import { createStore } from 'redux';
import reducers from '../reducers';

export type State = ReturnType<typeof reducers>;

const store = createStore(reducers);

export default store;`;

export const create = () => {
    let name: string;
    let features: string[];
    prompt({
        name: 'name',
        type: 'input',
        validate: value => !!value,
    }).then(result => {
        name = (result as any).name as string;

        return prompt({
            name: 'features',
            type: 'checkbox',
            choices: [
                {
                    value: 'redux',
                    name: 'Redux'
                }
            ],
        }).then(result => {
            features = (result as any).features as string[];
        });
    }).then(() => {
        const projectDir = resolve(process.cwd(), name);
        const hasRedux = features.includes('redux');

        mkdirSync(name);
        spawnSync('npm',['init', '-y'], {
            cwd: projectDir,
            stdio: 'inherit',
        });

        const packageJsonPath = resolve(projectDir, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
        packageJson.main = './src/index.tsx';
        packageJson.scripts.start = '@charge/sdk run';
        packageJson.scripts.build = '@charge/sdk build';
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));

        spawnSync('npm', ['install', '@charge/sdk', 'react', 'react-dom', '@types/react', '@types/react-dom'], {
            cwd: projectDir,
            stdio: 'inherit',
        });

        if (hasRedux) {
            spawnSync('npm', ['install', 'redux', 'react-redux', '@types/react-redux'], {
                cwd: projectDir,
                stdio: 'inherit',
            });
        }

        mkdirSync(resolve(projectDir, 'src'));
        writeFileSync(resolve(projectDir, 'src/App.tsx'), appTsxTemplate);
        writeFileSync(resolve(projectDir, 'src/index.tsx'), hasRedux ? reduxIndexTsxTemplate : indexTsxTemplate);
        writeFileSync(resolve(projectDir, 'src/index.html'), indexHtmlTemplate);

        if (hasRedux) {
            mkdirSync(resolve(projectDir, 'src/actions'));
            mkdirSync(resolve(projectDir, 'src/reducers'));
            mkdirSync(resolve(projectDir, 'src/store'));
            writeFileSync(resolve(projectDir, 'src/actions/index.tsx'), actionsIndexTsx);
            writeFileSync(resolve(projectDir, 'src/reducers/index.tsx'), reducersIndexTsx);
            writeFileSync(resolve(projectDir, 'src/store/index.tsx'), storeIndexTsx);
        }

        console.log('Project created, run the following command to get started!')
        console.log(`cd ${name}; npm start`)
    });
};