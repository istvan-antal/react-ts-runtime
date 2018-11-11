import { prompt } from 'inquirer';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

const indexTsxTemplate = `import * as React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="Message">
                    React App
                </div> 
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));`;

const indexHtmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>React app</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

export const create = () => {
    let name: string;
    prompt({
        name: 'name',
        type: 'input',
        validate: value => !!value,
    }).then(result => {
        name = (result as any).name as string;
        const projectDir = resolve(process.cwd(), name);
        mkdirSync(name);
        spawnSync('npm',['init', '-y'], {
            cwd: projectDir,
            stdio: 'inherit',
        });

        const packageJsonPath = resolve(projectDir, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
        packageJson.main = './src/index.tsx';
        packageJson.scripts.start = 'react-ts-runtime run';
        packageJson.scripts.build = 'react-ts-runtime build';
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));

        spawnSync('npm', ['install', 'react-ts-runtime', 'react', 'react-dom', '@types/react', '@types/react-dom'], {
            cwd: projectDir,
            stdio: 'inherit',
        });

        mkdirSync(resolve(projectDir, 'src'));
        writeFileSync(resolve(projectDir, 'src/index.tsx'), indexTsxTemplate);
        writeFileSync(resolve(projectDir, 'src/index.html'), indexHtmlTemplate);
    });
};