export function dfs(grid, startNode, finishNode) {

    startNode.distance = 0;
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
    unvisitedNodes.push(startNode);
    while (!!unvisitedNodes.length) {
        
        if (unvisitedNodes.length >2000) return visitedNodesInOrder;
        const closestNode = unvisitedNodes.shift();
        //console.log(closestNode.row +" " + closestNode.col + "\n");
        if (closestNode.isWall || closestNode.isVisited ) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        //if (closestNode.row == finishNode.row && closestNode.col == finishNode.col) console.log("BREAKKKK NOWWWWWW\n");
        if (closestNode === finishNode) return visitedNodesInOrder;
        const temp = updateUnvisitedNeighbors(closestNode, grid);
        
        for (const neighbor of temp)
        {
            unvisitedNodes.unshift(neighbor);
            //console.log(neighbor.row + "," + neighbor.col + " ");


        }
        //console.log("\n\n");
       //console.log(unvisitedNodes.length+" " +visitedNodesInOrder.length+"\n");
    }

    return visitedNodesInOrder;
}



function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
    return unvisitedNeighbors;
    

}


function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
  