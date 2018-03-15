import {Game} from 'components/Game';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
    <Game />,
    container,
);
