import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';

const addWasm = require('./add.c');
const fetchAddFn = async (): Promise<(a: number, b: number) => number> => addWasm.init()
    .then((module: any) => {
        return module.exports.add;
    });

interface State {
    result?: string;
}

class App extends React.Component<{}, State> {
    state: State = {};
    async componentWillMount() {
        const add = await fetchAddFn();
        this.setState({
            result: add(2, 3).toString(),
        });
    }
    render() {
        if (!this.state.result) {
            return <div>Loading....</div>
        }
        return (
            <div className="App">
                <div className="Message">
                    Result: {this.state.result}
                </div> 
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));