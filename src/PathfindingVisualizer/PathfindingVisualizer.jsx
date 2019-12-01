import React, {Component} from 'react';
import Node from './Node/node';
import {dijkstra} from './algorithms/dijkstra';
import {astar} from './algorithms/astar';
import {bfs} from './algorithms/bfs';
import {dfs} from './algorithms/dfs';
import {greedy} from './algorithms/greedy';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 12;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 38;

 

class PathfindingVisualizer extends Component {
	
	
	constructor() {
		super();
		this.state = {
		  grid: getInitialGrid(),
		  mouseIsPressed: false,
		  allowClear : true,
		  
		};
	  }
	
	  componentDidMount() {
		const grid = getInitialGrid();
		this.setState({grid});
	  }
	
	  handleMouseDown(row, col) {
		
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({grid: newGrid, mouseIsPressed: true});
	  }
	
	  handleMouseEnter(row, col) {
		if (!this.state.mouseIsPressed) return;
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState({grid: newGrid});
	  }
	
	  handleMouseUp() {
		this.setState({mouseIsPressed: false});
	  }
	

	styles={
		fontWeight : "bold", 
		fontSize : 50

	};

	

	render()
	{	const {grid} = this.state;

		return 	(
			<>
				<div>
     			<nav class="navbar navbar bg-dark">
       				<div class="container-fluid">
        		 		<div class="navbar-header">
           					<a style = {{color:'white', fontWeight:'bold', fontSize : 20}} id="refreshButton" class="navbar-brand" href="#">Pathfinding Visualizer</a>
        		 		</div> 
         				
						<button onClick={() => this.handleClear()} className="btn-danger btn-secondary btn-sm "> Clear Everything!</button>
						<button onClick={() => this.clearPath()} className="btn-warning btn-secondary btn-sm "> Clear Path!</button>

						<button onClick={() => this.visualizeDijkstra()} className="btn-success btn-secondary btn-sm"> Visualize Dijkstra's!</button>
						
						<button onClick={() => this.visualizeAstar()} className="btn-success btn-secondary btn-sm "> Visualize A*!</button>
						<button onClick={() => this.visualizeGreedy()} className="btn-success btn-secondary btn-sm"> Visualize Greedy Best First Search!</button>
						<button onClick={() => this.visualizeBFS()} className="btn-success btn-secondary btn-sm"> Visualize Breadth First Search!</button>
						<button onClick={() => this.visualizeDFS()} className="btn-success btn-secondary btn-sm"> Visualize Depth First Search!</button>
						<a style = {{color:'white'}} id="refreshButton" class="navbar-brand" href="#">By Brandon Su</a>
						<a id="refreshButton" class="navbar-brand" href="#">Left click and hold to make walls!</a>
					</div>
				</nav>
				

				


				<div className="grid">
          			{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx}>
							{row.map((node, nodeIdx) => {
							const {row, col, isFinish, isStart, isWall, mouseIsPressed} = node;
							return (
								<Node
								key={nodeIdx}
								col={col}
								isFinish={isFinish}
								isStart={isStart}
								isWall={isWall}
								mouseIsPressed={mouseIsPressed}
								onMouseDown={(row, col) => this.handleMouseDown(row, col)}
								onMouseEnter={(row, col) =>
								  this.handleMouseEnter(row, col)
								}
								onMouseUp={() => this.handleMouseUp()}
								
								
								row={row}></Node>
							);
							})}
							</div>
						);
					})}
				</div>
				
			</div>


			</>

		);

	}
	handleClear()
	{
		if (!this.allowClear)
		return;
		this.clearPath();
		this.clearWall();
		document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node node-start';
		document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node node-finish';
	}
	clearWall()
	{
		if (!this.allowClear)
		return;
		const {grid} = this.state;
		for (let row = 0; row < 20; row++) {
			
			for (let col = 0; col < 50; col++) {
				
				if (grid[row][col].isWall)
				{
					
					const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
					this.setState({grid: newGrid});
					document.getElementById(`node-${row}-${col}`).className ='node';
					
			
				}
			}
			
		}
	}
	
	clearPath()
	{
		if (!this.allowClear)
		return;
		const {grid} = this.state;
		grid[START_NODE_ROW][START_NODE_COL].isVisited = false;
		grid[START_NODE_ROW][START_NODE_COL].previousNode = null;
		grid[FINISH_NODE_ROW][FINISH_NODE_COL].isVisited = false;
		grid[FINISH_NODE_ROW][FINISH_NODE_COL].previousNode = null;
		
		for (let row = 0; row < 20; row++) {
			
			for (let col = 0; col < 50; col++) {
				grid[row][col].distance = Infinity;
				if (grid[row][col].isVisited)
				{
					if (row != START_NODE_ROW || col!= START_NODE_COL)
					{
						if(row!= FINISH_NODE_ROW || col != FINISH_NODE_COL)
						{
							const newGrid = getNewGridWithPathToggled(this.state.grid, row, col);
							this.setState({grid: newGrid});
							//console.log(grid[row][col].isVisited);
							document.getElementById(`node-${row}-${col}`).className ='node';
						}
						
					}
					
				}

			}
		}
			
		
	}

	visualizeBFS()
	{
		
		const {grid} = this.state;
		this.clearPath();
		this.allowClear = false;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
    	const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		
		const visitedNodesInOrder = bfs(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
	}


	visualizeDFS()
	{
		const {grid} = this.state;
		this.clearPath();
		this.allowClear = false;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
    	const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		
		const visitedNodesInOrder = dfs(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);

	}


	
	visualizeAstar()
	{
		const {grid} = this.state;
		this.clearPath();
		this.allowClear = false;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
    	const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		
		const visitedNodesInOrder = astar(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);

	}
	visualizeGreedy()
	{
		const {grid} = this.state;
		this.clearPath();
		this.allowClear = false;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
    	const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		
		const visitedNodesInOrder = greedy(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);

	}
	visualizeDijkstra()
	{
		const {grid} = this.state;
		this.clearPath();
		this.allowClear = false;
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
    	const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
		
		const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
	} 


	animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
		
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
		  if (i === visitedNodesInOrder.length) {
			setTimeout(() => {
			  this.animateShortestPath(nodesInShortestPathOrder);
			}, 10 * i);
			
			return;
		  }
		  setTimeout(() => {
			const node = visitedNodesInOrder[i];


			if (node.row == START_NODE_ROW && node.col == START_NODE_COL)
			{
				document.getElementById(`node-${node.row}-${node.col}`).className =
			'node node-start';

			}
			else if (node.row==FINISH_NODE_ROW && node.col ==FINISH_NODE_COL){

				document.getElementById(`node-${node.row}-${node.col}`).className =
			'node node-finish';
			}
			else{
				document.getElementById(`node-${node.row}-${node.col}`).className =
			'node node-visited';
			}
		  }, 10 * i);
		}
		
	  }


	  
	
	  animateShortestPath(nodesInShortestPathOrder) {
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
		  setTimeout(() => {
			const node = nodesInShortestPathOrder[i];
			if (node.row == START_NODE_ROW && node.col == START_NODE_COL)
			{
				document.getElementById(`node-${node.row}-${node.col}`).className =
			'node node-start';

			}
			else if (node.row==FINISH_NODE_ROW && node.col ==FINISH_NODE_COL){

				document.getElementById(`node-${node.row}-${node.col}`).className =
			'node node-finish';
			}
			else{
				document.getElementById(`node-${node.row}-${node.col}`).className =
			'node node-shortest-path';
			}
			
		  }, 50 * i);
		}
		this.allowClear = true;
	  }
}




export default PathfindingVisualizer;

const getInitialGrid = () => {
	const grid = [];
	for (let row = 0; row < 20; row++) {
	  const currentRow = [];
	  for (let col = 0; col < 50; col++) {
		currentRow.push(createNode(col, row));
	  }
	  grid.push(currentRow);
	}
	return grid;
  };




const createNode = (col, row) => {
	return {
	  col,
	  row,
	  isStart: row === START_NODE_ROW && col === START_NODE_COL,
	  isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
	  isWall: false,
	  distance: Infinity,
	  previousNode: null,
	  isVisited: false,
	};
  };
  
const getNewGridWithWallToggled = (grid, row, col) => {
	const newGrid = grid.slice();
	const node = newGrid[row][col];
	const newNode = {
	  ...node,
	  distance: Infinity,
	  previousNode: null,
	  isVisited: false,
	  isWall: !node.isWall,
	};
	newGrid[row][col] = newNode;
	return newGrid;
};


const getNewGridWithPathToggled = (grid, row, col) => {
	const newGrid = grid.slice();
	const node = newGrid[row][col];
	const newNode = {
	  ...node,
	  distance: Infinity,
	  previousNode: null,
	  isVisited: false,

	};
	newGrid[row][col] = newNode;
	return newGrid;
};




const getNodesInShortestPathOrder =(finishNode) =>{
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }