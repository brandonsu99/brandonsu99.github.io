import React, {Component} from 'react';

import './node.css';


export default class Node extends Component {
	render()
	{
		const {
			col,
			isFinish,
			isStart,
			isWall,
			row,
			distance,
			previousNode,
			isVisted,
			onMouseDown,
      		onMouseEnter,
      		onMouseUp,
		  } = this.props;
		const extraClassName = isFinish
			? 'node-finish'
			:  isStart
			? 'node-start'
			: isWall
			? 'node-wall'
			: '';
		return <div id= {1} 
		className = {`node ${extraClassName}`}
		id={`node-${row}-${col}`}
		onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}>
		
		</div>;

	};

}