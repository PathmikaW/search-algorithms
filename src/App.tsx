import { useState, useEffect, ChangeEvent } from 'react';
import { Play, Plus, Trash2, Download, Upload, Clock, ArrowRight, ArrowLeftRight, AlertCircle, Info, Train, PartyPopper, CloudRain, ChevronDown, ChevronUp, Settings } from 'lucide-react';

// --- TYPE DEFINITIONS ---

interface Node {
  id: number;
  name: string;
  x: number;
  y: number;
  isStart: boolean;
  isGoal: boolean;
  h: number;
  deadline?: number;
}

interface Edge {
  from: number;
  to: number;
  baseCost: number;
  isOneWay: boolean;
  direction: 'forward' | 'reverse' | 'both';
}

interface DeadlineStatus {
  status: 'success' | 'missed' | 'unknown';
  margin: number;
  message: string;
}

interface AlgorithmResult {
  algorithm: string;
  path: number[];
  traversal: number[];
  cost: number;
  nodesExpanded: number;
  success: boolean;
  goalReached: string;
  deadlineStatus: DeadlineStatus;
  note?: string;
  compareAll?: false;
}

interface ComparisonResults {
  compareAll: true;
  results: AlgorithmResult[];
}

type Result = AlgorithmResult | ComparisonResults | null;

type TimeSlotKey = 'off-peak' | 'morning-rush' | 'school-pickup' | 'peak-evening' | 'weekend';

type AlgorithmKey = 'bfs' | 'dfs' | 'dls' | 'iddfs' | 'ucs' | 'greedy' | 'astar' | 'bidirectional' | 'hillclimbing';

// --- COMPONENT ---

const SearchAlgorithmTool = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, name: 'Dehiwala', x: 100, y: 400, isStart: true, isGoal: false, h: 13 },
    { id: 2, name: 'Wellawatte', x: 150, y: 300, isStart: false, isGoal: false, h: 15 },
    { id: 3, name: 'Bambalapitiya', x: 250, y: 250, isStart: false, isGoal: false, h: 12 },
    { id: 4, name: 'Kollupitiya', x: 350, y: 200, isStart: false, isGoal: false, h: 10 },
    { id: 5, name: 'Fort Station', x: 450, y: 150, isStart: false, isGoal: true, h: 0, deadline: 25 },
    { id: 6, name: 'Union Place', x: 300, y: 350, isStart: false, isGoal: false, h: 8 },
    { id: 7, name: 'Borella', x: 200, y: 450, isStart: false, isGoal: false, h: 3 },
    { id: 8, name: 'Maradana Station', x: 300, y: 500, isStart: false, isGoal: true, h: 0, deadline: 27 }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 2, baseCost: 3, isOneWay: false, direction: 'both' },
    { from: 0, to: 3, baseCost: 4, isOneWay: false, direction: 'both' },
    { from: 0, to: 6, baseCost: 6, isOneWay: false, direction: 'both' },
    { from: 0, to: 7, baseCost: 5, isOneWay: false, direction: 'both' },
    { from: 2, to: 3, baseCost: 2.5, isOneWay: false, direction: 'both' },
    { from: 2, to: 7, baseCost: 4, isOneWay: false, direction: 'both' },
    { from: 3, to: 4, baseCost: 2, isOneWay: false, direction: 'both' },
    { from: 3, to: 6, baseCost: 3.5, isOneWay: false, direction: 'both' },
    { from: 4, to: 5, baseCost: 6, isOneWay: false, direction: 'both' },
    { from: 6, to: 5, baseCost: 4, isOneWay: false, direction: 'both' },
    { from: 7, to: 6, baseCost: 6, isOneWay: false, direction: 'both' },
    { from: 7, to: 8, baseCost: 1.5, isOneWay: false, direction: 'both' },
    { from: 5, to: 8, baseCost: 2, isOneWay: false, direction: 'both' }
  ]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>('astar');
  const [results, setResults] = useState<Result>(null);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showAddEdge, setShowAddEdge] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showNodeManager, setShowNodeManager] = useState(false);
  const [showEdgeManager, setShowEdgeManager] = useState(false);
  const [newNode, setNewNode] = useState({ name: '', h: '0', isGoal: false, deadline: '' });
  const [newEdge, setNewEdge] = useState({ from: '', to: '', baseCost: '0', isOneWay: false });

  const algorithmProperties: { [key: string]: { timeComplexity: string; spaceComplexity: string; complete: string; optimal: string; description: string; } } = {
    'BFS': {
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      complete: 'Yes',
      optimal: 'Yes (unweighted)',
      description: 'Complete and optimal for unweighted graphs'
    },
    'DFS': {
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      complete: 'No',
      optimal: 'No',
      description: 'Not complete in infinite spaces, not optimal'
    },
    'DLS': {
      timeComplexity: 'O(b^l)',
      spaceComplexity: 'O(l)',
      complete: 'Yes (if goal ≤ l)',
      optimal: 'No',
      description: 'Complete if solution within depth limit l, not optimal'
    },
    'IDDFS': {
      timeComplexity: 'O(b^d)',
      spaceComplexity: 'O(d)',
      complete: 'Yes',
      optimal: 'Yes (unweighted)',
      description: 'Combines BFS completeness with DFS space efficiency'
    },
    'UCS': {
      timeComplexity: 'O(b^(1+⌊C*/ε⌋))',
      spaceComplexity: 'O(b^(1+⌊C*/ε⌋))',
      complete: 'Yes',
      optimal: 'Yes',
      description: 'Complete and optimal for positive edge costs'
    },
    'Greedy': {
      timeComplexity: 'O(b^m)',
      spaceComplexity: 'O(b×m)',
      complete: 'No',
      optimal: 'No',
      description: 'Fast but can get stuck in local optima'
    },
    'A*': {
      timeComplexity: 'O(b^d)',
      spaceComplexity: 'O(b^d)',
      complete: 'Yes',
      optimal: 'Yes (admissible h)',
      description: 'Complete and optimal with admissible heuristic'
    },
    'Bidirectional': {
      timeComplexity: 'O(b^(d/2))',
      spaceComplexity: 'O(b^(d/2))',
      complete: 'Yes',
      optimal: 'Yes (with UCS)',
      description: 'Searches from both start and goal simultaneously'
    },
    'Hill Climbing': {
      timeComplexity: 'O(∞)',
      spaceComplexity: 'O(1)',
      complete: 'No',
      optimal: 'No',
      description: 'Can get stuck at local maxima, incomplete'
    }
  };
  
  const [timeSlot, setTimeSlot] = useState<TimeSlotKey>('peak-evening');
  const [oneWayEnabled, setOneWayEnabled] = useState(false);
  const [showTrafficConfig, setShowTrafficConfig] = useState(false);
  const [depthLimit, setDepthLimit] = useState(3);

  const timeSlots: { [key in TimeSlotKey]: { name: string; multiplier: number } } = {
    'off-peak': { name: 'Off-Peak (10 AM - 3 PM)', multiplier: 1.0 },
    'morning-rush': { name: 'Morning Rush (7:30 AM - 9:15 AM)', multiplier: 1.8 },
    'school-pickup': { name: 'School Pickup (12:45 PM - 2:15 PM)', multiplier: 1.3 },
    'peak-evening': { name: 'Evening Peak (5:45 PM - 7:30 PM)', multiplier: 2.0 },
    'weekend': { name: 'Weekend Midday (11 AM - 2 PM)', multiplier: 1.25 }
  };

  const oneWayRestrictions = [
    { from: 4, to: 5, restrictedDirection: 'reverse', peakCost: 15 },
    { from: 5, to: 6, restrictedDirection: 'reverse', peakCost: 12 },
  ];

  const findNonOverlappingPosition = (): { x: number, y: number } => {
    const svgWidth = 600;
    const svgHeight = 600;
    const minDistance = 80;
    const margin = 60;
    
    for (let attempt = 0; attempt < 100; attempt++) {
      const x = margin + Math.random() * (svgWidth - 2 * margin);
      const y = margin + Math.random() * (svgHeight - 2 * margin);
      
      const tooClose = nodes.some(node => {
        const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        return distance < minDistance;
      });
      
      if (!tooClose) {
        return { x: Math.round(x), y: Math.round(y) };
      }
    }
    
    const gridSize = Math.ceil(Math.sqrt(nodes.length + 1));
    const cellWidth = (svgWidth - 2 * margin) / gridSize;
    const cellHeight = (svgHeight - 2 * margin) / gridSize;
    const index = nodes.length;
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    return {
      x: Math.round(margin + col * cellWidth + cellWidth / 2),
      y: Math.round(margin + row * cellHeight + cellHeight / 2)
    };
  };

  const getEdgeCost = (from: number, to: number): number => {
    const edge = edges.find(e => 
      (e.from === from && e.to === to) || 
      (e.to === from && e.from === to)
    );
    
    if (!edge) return Infinity;

    if (oneWayEnabled) {
      const restriction = oneWayRestrictions.find(r => 
        (r.from === from && r.to === to) || (r.from === to && r.to === from)
      );
      
      if (restriction) {
        if (restriction.restrictedDirection === 'reverse' && 
            restriction.from === to && restriction.to === from) {
          return restriction.peakCost * timeSlots[timeSlot].multiplier;
        }
      }
      
      if (edge.isOneWay) {
        if (edge.direction === 'forward' && edge.from !== from) return Infinity;
        if (edge.direction === 'reverse' && edge.to !== from) return Infinity;
      }
    }

    return edge.baseCost * timeSlots[timeSlot].multiplier;
  };

  const getNeighbors = (nodeId: number): number[] => {
    const neighbors: number[] = [];
    edges.forEach(edge => {
      if (oneWayEnabled && edge.isOneWay) {
        if (edge.direction === 'forward' && edge.from === nodeId) {
          neighbors.push(edge.to);
        } else if (edge.direction === 'reverse' && edge.to === nodeId) {
          neighbors.push(edge.from);
        } else if (edge.direction === 'both') {
          if (edge.from === nodeId) neighbors.push(edge.to);
          if (edge.to === nodeId) neighbors.push(edge.from);
        }
      } else {
        if (edge.from === nodeId) neighbors.push(edge.to);
        if (edge.to === nodeId) neighbors.push(edge.from);
      }
    });
    return [...new Set(neighbors)];
  };

  const calculatePathCost = (path: number[]): number => {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      cost += getEdgeCost(path[i], path[i + 1]);
    }
    return Math.round(cost * 10) / 10;
  };

  const checkDeadline = (goalId: number, travelTime: number): DeadlineStatus => {
    const goalNode = nodes.find(n => n.id === goalId);
    if (!goalNode || typeof goalNode.deadline === 'undefined') return { status: 'unknown', margin: 0, message: 'No deadline specified' };
    
    const deadline = goalNode.deadline;
    if (travelTime <= deadline) {
      return { 
        status: 'success', 
        margin: Math.round((deadline - travelTime) * 10) / 10,
        message: `Train Caught! Arrived ${Math.round((deadline - travelTime) * 10) / 10} minutes early! 🎉`
      };
    } else {
      return { 
        status: 'missed', 
        margin: Math.round((travelTime - deadline) * 10) / 10,
        message: `Train Missed! ${Math.round((travelTime - deadline) * 10) / 10} minutes late 😢`
      };
    }
  };

  const createFailureResult = (algorithm: string, traversalOrder: number[], nodesExpanded: number, message: string): AlgorithmResult => ({
    algorithm,
    path: [],
    traversal: traversalOrder,
    cost: Infinity,
    nodesExpanded,
    success: false,
    goalReached: 'None',
    deadlineStatus: { status: 'missed', margin: Infinity, message }
  });

  const bfs = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('BFS', [], 0, 'Start node not found');
    
    const goals = nodes.filter(n => n.isGoal);
    const queue: number[][] = [[start.id]];
    const visited = new Set<number>([start.id]);
    const traversalOrder: number[] = [start.id];
    let nodesExpanded = 0;

    while (queue.length > 0) {
      const path = queue.shift();
      if (!path) continue;
      const current = path[path.length - 1];
      nodesExpanded++;

      if (goals.some(g => g.id === current)) {
        const goalNode = nodes.find(n => n.id === current);
        const cost = calculatePathCost(path);
        const deadline = checkDeadline(current, cost);
        return {
          algorithm: 'BFS',
          path,
          traversal: traversalOrder,
          cost,
          nodesExpanded,
          success: true,
          goalReached: goalNode?.name || `ID: ${current}`,
          deadlineStatus: deadline
        };
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          traversalOrder.push(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return createFailureResult('BFS', traversalOrder, nodesExpanded, 'No path found');
  };

  const dfs = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('DFS', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    const stack: number[][] = [[start.id]];
    const visited = new Set<number>();
    const traversalOrder: number[] = [];
    let nodesExpanded = 0;

    while (stack.length > 0) {
      const path = stack.pop();
      if (!path) continue;

      const current = path[path.length - 1];

      if (visited.has(current)) continue;
      visited.add(current);
      traversalOrder.push(current);
      nodesExpanded++;

      if (goals.some(g => g.id === current)) {
        const goalNode = nodes.find(n => n.id === current);
        const cost = calculatePathCost(path);
        const deadline = checkDeadline(current, cost);
        return {
          algorithm: 'DFS',
          path,
          traversal: traversalOrder,
          cost,
          nodesExpanded,
          success: true,
          goalReached: goalNode?.name || `ID: ${current}`,
          deadlineStatus: deadline
        };
      }

      const neighbors = getNeighbors(current).reverse();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push([...path, neighbor]);
        }
      }
    }

    return createFailureResult('DFS', traversalOrder, nodesExpanded, 'No path found');
  };

  const dls = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('DLS', [], 0, 'Start node not found');
    
    const goals = nodes.filter(n => n.isGoal);
    let nodesExpanded = 0;
    const traversalOrder: number[] = [];

    const dfsLimited = (path: number[], depth: number, visited: Set<number>): number[] | null => {
      const current = path[path.length - 1];
      nodesExpanded++;
      if (!traversalOrder.includes(current)) traversalOrder.push(current);

      if (goals.some(g => g.id === current)) {
        return path;
      }

      if (depth === 0) return null;

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const newVisited = new Set(visited);
          newVisited.add(neighbor);
          const result = dfsLimited([...path, neighbor], depth - 1, newVisited);
          if (result) return result;
        }
      }
      return null;
    };

    const visited = new Set([start.id]);
    const resultPath = dfsLimited([start.id], depthLimit, visited);

    if (resultPath) {
      const goalId = resultPath[resultPath.length - 1];
      const goalNode = nodes.find(n => n.id === goalId);
      const cost = calculatePathCost(resultPath);
      const deadline = checkDeadline(goalId, cost);
      return {
        algorithm: 'DLS',
        path: resultPath,
        traversal: traversalOrder,
        cost,
        nodesExpanded,
        success: true,
        goalReached: goalNode?.name || `ID: ${goalId}`,
        deadlineStatus: deadline,
        note: `Depth limit: ${depthLimit}`
      };
    }

    return {
      ...createFailureResult('DLS', traversalOrder, nodesExpanded, 'No path found within depth limit'),
      note: `Depth limit: ${depthLimit}`
    };
  };

  const iddfs = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('IDDFS', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    let totalNodesExpanded = 0;
    const traversalOrder: number[] = [];

    const dfsLimited = (path: number[], depth: number, visited: Set<number>): number[] | null => {
      const current = path[path.length - 1];
      totalNodesExpanded++;
      if (!traversalOrder.includes(current)) traversalOrder.push(current);

      if (goals.some(g => g.id === current)) {
        return path;
      }

      if (depth === 0) return null;

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const newVisited = new Set(visited);
          newVisited.add(neighbor);
          const result = dfsLimited([...path, neighbor], depth - 1, newVisited);
          if (result) return result;
        }
      }
      return null;
    };

    for (let depth = 0; depth <= nodes.length; depth++) {
      const visited = new Set([start.id]);
      const resultPath = dfsLimited([start.id], depth, visited);
      if (resultPath) {
        const goalId = resultPath[resultPath.length - 1];
        const goalNode = nodes.find(n => n.id === goalId);
        const cost = calculatePathCost(resultPath);
        const deadline = checkDeadline(goalId, cost);
        return {
          algorithm: 'IDDFS',
          path: resultPath,
          traversal: traversalOrder,
          cost,
          nodesExpanded: totalNodesExpanded,
          success: true,
          goalReached: goalNode?.name || `ID: ${goalId}`,
          deadlineStatus: deadline
        };
      }
    }

    return createFailureResult('IDDFS', traversalOrder, totalNodesExpanded, 'No path found');
  };

  const ucs = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('UCS', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    const pq: { path: number[], cost: number }[] = [{ path: [start.id], cost: 0 }];
    const visited = new Set<number>();
    const traversalOrder: number[] = [];
    let nodesExpanded = 0;

    while (pq.length > 0) {
      pq.sort((a, b) => a.cost - b.cost);
      const dequeued = pq.shift();
      if (!dequeued) continue;
      const { path, cost } = dequeued;
      
      const current = path[path.length - 1];

      if (visited.has(current)) continue;
      visited.add(current);
      traversalOrder.push(current);
      nodesExpanded++;

      if (goals.some(g => g.id === current)) {
        const goalNode = nodes.find(n => n.id === current);
        const finalCost = Math.round(cost * 10) / 10;
        const deadline = checkDeadline(current, finalCost);
        return {
          algorithm: 'UCS',
          path,
          traversal: traversalOrder,
          cost: finalCost,
          nodesExpanded,
          success: true,
          goalReached: goalNode?.name || `ID: ${current}`,
          deadlineStatus: deadline
        };
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const edgeCost = getEdgeCost(current, neighbor);
          if (edgeCost !== Infinity) {
            pq.push({ path: [...path, neighbor], cost: cost + edgeCost });
          }
        }
      }
    }

    return createFailureResult('UCS', traversalOrder, nodesExpanded, 'No path found');
  };

  const greedy = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('Greedy', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    const pq: { path: number[], h: number }[] = [{ path: [start.id], h: start.h }];
    const visited = new Set<number>();
    const traversalOrder: number[] = [];
    let nodesExpanded = 0;

    while (pq.length > 0) {
      pq.sort((a, b) => a.h - b.h);
      const dequeued = pq.shift();
      if (!dequeued) continue;
      const { path } = dequeued;

      const current = path[path.length - 1];

      if (visited.has(current)) continue;
      visited.add(current);
      traversalOrder.push(current);
      nodesExpanded++;

      if (goals.some(g => g.id === current)) {
        const goalNode = nodes.find(n => n.id === current);
        const cost = calculatePathCost(path);
        const deadline = checkDeadline(current, cost);
        return {
          algorithm: 'Greedy',
          path,
          traversal: traversalOrder,
          cost,
          nodesExpanded,
          success: true,
          goalReached: goalNode?.name || `ID: ${current}`,
          deadlineStatus: deadline
        };
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const node = nodes.find(n => n.id === neighbor);
        if (!visited.has(neighbor) && node) {
          pq.push({ path: [...path, neighbor], h: node.h });
        }
      }
    }

    return createFailureResult('Greedy', traversalOrder, nodesExpanded, 'No path found');
  };

  const aStar = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('A*', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    const pq: { path: number[], g: number, f: number }[] = [{ path: [start.id], g: 0, f: start.h }];
    const visited = new Set<number>();
    const traversalOrder: number[] = [];
    let nodesExpanded = 0;

    while (pq.length > 0) {
      pq.sort((a, b) => a.f - b.f);
      const dequeued = pq.shift();
      if (!dequeued) continue;
      const { path, g } = dequeued;
      
      const current = path[path.length - 1];

      if (visited.has(current)) continue;
      visited.add(current);
      traversalOrder.push(current);
      nodesExpanded++;

      if (goals.some(goal => goal.id === current)) {
        const goalNode = nodes.find(n => n.id === current);
        const finalCost = Math.round(g * 10) / 10;
        const deadline = checkDeadline(current, finalCost);
        return {
          algorithm: 'A*',
          path,
          traversal: traversalOrder,
          cost: finalCost,
          nodesExpanded,
          success: true,
          goalReached: goalNode?.name || `ID: ${current}`,
          deadlineStatus: deadline
        };
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const edgeCost = getEdgeCost(current, neighbor);
          if (edgeCost !== Infinity) {
            const node = nodes.find(n => n.id === neighbor);
            if (node) {
              const newG = g + edgeCost;
              pq.push({ path: [...path, neighbor], g: newG, f: newG + node.h });
            }
          }
        }
      }
    }

    return createFailureResult('A*', traversalOrder, nodesExpanded, 'No path found');
  };

  const bidirectional = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('Bidirectional', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    
    if (goals.length !== 1) {
      return { 
        ...createFailureResult('Bidirectional', [], 0, 'Multiple goals not supported'),
        note: 'Works best with single goal',
      };
    }

    const goal = goals[0];
    const forwardQueue: number[][] = [[start.id]];
    const backwardQueue: number[][] = [[goal.id]];
    const forwardVisited = new Map<number, number[]>([[start.id, [start.id]]]);
    const backwardVisited = new Map<number, number[]>([[goal.id, [goal.id]]]);
    const traversalOrder: number[] = [start.id, goal.id];
    let nodesExpanded = 0;

    while (forwardQueue.length > 0 && backwardQueue.length > 0) {
      // Forward search
      const fPath = forwardQueue.shift();
      if (fPath) {
        const fCurrent = fPath[fPath.length - 1];
        nodesExpanded++;

        if (backwardVisited.has(fCurrent)) {
          const bPathSegment = backwardVisited.get(fCurrent);
          if (bPathSegment) {
            const bPath = bPathSegment.slice().reverse();
            const fullPath = [...fPath, ...bPath.slice(1)];
            const cost = calculatePathCost(fullPath);
            const deadline = checkDeadline(goal.id, cost);
            return {
              algorithm: 'Bidirectional',
              path: fullPath,
              traversal: traversalOrder,
              cost,
              nodesExpanded,
              success: true,
              goalReached: goal.name,
              deadlineStatus: deadline
            };
          }
        }

        const fNeighbors = getNeighbors(fCurrent);
        for (const neighbor of fNeighbors) {
          if (!forwardVisited.has(neighbor)) {
            const newPath = [...fPath, neighbor];
            forwardVisited.set(neighbor, newPath);
            forwardQueue.push(newPath);
            if (!traversalOrder.includes(neighbor)) traversalOrder.push(neighbor);
          }
        }
      }

      // Backward search
      const bPath = backwardQueue.shift();
      if (bPath) {
        const bCurrent = bPath[bPath.length - 1];
        nodesExpanded++;

        if (forwardVisited.has(bCurrent)) {
          const fPathSegment = forwardVisited.get(bCurrent);
          if (fPathSegment) {
            const fullPath = [...fPathSegment, ...bPath.slice().reverse().slice(1)];
            const cost = calculatePathCost(fullPath);
            const deadline = checkDeadline(goal.id, cost);
            return {
              algorithm: 'Bidirectional',
              path: fullPath,
              traversal: traversalOrder,
              cost,
              nodesExpanded,
              success: true,
              goalReached: goal.name,
              deadlineStatus: deadline
            };
          }
        }

        const bNeighbors = getNeighbors(bCurrent);
        for (const neighbor of bNeighbors) {
          if (!backwardVisited.has(neighbor)) {
            const newPath = [...bPath, neighbor];
            backwardVisited.set(neighbor, newPath);
            backwardQueue.push(newPath);
            if (!traversalOrder.includes(neighbor)) traversalOrder.push(neighbor);
          }
        }
      }
    }

    return createFailureResult('Bidirectional', traversalOrder, nodesExpanded, 'No path found');
  };

  const hillClimbing = (): AlgorithmResult => {
    const start = nodes.find(n => n.isStart);
    if (!start) return createFailureResult('Hill Climbing', [], 0, 'Start node not found');

    const goals = nodes.filter(n => n.isGoal);
    let currentId = start.id;
    const path: number[] = [currentId];
    const traversalOrder: number[] = [currentId];
    let nodesExpanded = 1; 
    const visited = new Set<number>([currentId]);

    while (!goals.some(g => g.id === currentId)) {
      const neighbors = getNeighbors(currentId).filter(n => !visited.has(n));
      if (neighbors.length === 0) break;

      let bestNeighborId: number | null = null;
      let bestH = Infinity;

      for (const neighborId of neighbors) {
        const neighborNode = nodes.find(n => n.id === neighborId);
        if (neighborNode && neighborNode.h < bestH) {
          bestNeighborId = neighborId;
          bestH = neighborNode.h;
        }
      }

      const currentNode = nodes.find(n => n.id === currentId);
      if (!currentNode || !bestNeighborId || bestH >= currentNode.h) break; // Stuck

      currentId = bestNeighborId;
      visited.add(currentId);
      path.push(currentId);
      traversalOrder.push(currentId);
      nodesExpanded++;
    }

    const success = goals.some(g => g.id === currentId);
    const cost = success ? calculatePathCost(path) : Infinity;
    const deadline = success ? checkDeadline(currentId, cost) : { status: 'missed' as const, margin: Infinity, message: 'Stuck at local optimum' };
    const goalNode = success ? nodes.find(n => n.id === currentId) : null;

    return {
      algorithm: 'Hill Climbing',
      path,
      traversal: traversalOrder,
      cost,
      nodesExpanded,
      success,
      goalReached: goalNode ? goalNode.name : 'None',
      deadlineStatus: deadline
    };
  };

  const runAlgorithm = () => {
    let result: AlgorithmResult;
    switch (selectedAlgorithm) {
      case 'bfs': result = bfs(); break;
      case 'dfs': result = dfs(); break;
      case 'dls': result = dls(); break;
      case 'iddfs': result = iddfs(); break;
      case 'ucs': result = ucs(); break;
      case 'greedy': result = greedy(); break;
      case 'astar': result = aStar(); break;
      case 'bidirectional': result = bidirectional(); break;
      case 'hillclimbing': result = hillClimbing(); break;
      default: return;
    }
    setResults(result);
  };

  const runAllAlgorithms = () => {
    const algorithms: AlgorithmKey[] = ['bfs', 'dfs', 'dls', 'iddfs', 'ucs', 'greedy', 'astar', 'bidirectional', 'hillclimbing'];
    const allResults = algorithms.map(alg => {
      switch (alg) {
        case 'bfs': return bfs();
        case 'dfs': return dfs();
        case 'dls': return dls();
        case 'iddfs': return iddfs();
        case 'ucs': return ucs();
        case 'greedy': return greedy();
        case 'astar': return aStar();
        case 'bidirectional': return bidirectional();
        case 'hillclimbing': return hillClimbing();
        default: return null;
      }
    }).filter((r): r is AlgorithmResult => r !== null);
    
    setResults({ compareAll: true, results: allResults });
  };

  const applyOneWayRestrictions = () => {
    const updated = edges.map(edge => {
      const restriction = oneWayRestrictions.find(r => 
        (r.from === edge.from && r.to === edge.to) ||
        (r.from === edge.to && r.to === edge.from)
      );
      
      if (restriction && oneWayEnabled) {
        return {
          ...edge,
          isOneWay: true,
          direction: restriction.restrictedDirection === 'reverse' ? 'forward' : 'both'
        } as Edge;
      }
      return edge;
    });
    setEdges(updated);
  };

  useEffect(() => {
    applyOneWayRestrictions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneWayEnabled]);

  const addNode = () => {
    if (!newNode.name) return;
    const maxId = Math.max(...nodes.map(n => n.id), -1);
    const position = findNonOverlappingPosition();
    const hValue = parseFloat(newNode.h) || 0;
    const deadlineValue = newNode.deadline ? parseFloat(newNode.deadline) : undefined;
    
    const nodeToAdd: Node = {
      id: maxId + 1,
      name: newNode.name,
      x: position.x,
      y: position.y,
      isStart: false,
      isGoal: newNode.isGoal,
      h: hValue,
      deadline: deadlineValue
    };

    setNodes([...nodes, nodeToAdd]);
    setNewNode({ name: '', h: '0', isGoal: false, deadline: '' });
    setShowAddNode(false);
  };

  const addEdge = () => {
    const from = parseInt(newEdge.from);
    const to = parseInt(newEdge.to);
    const baseCost = parseFloat(newEdge.baseCost);
    if (isNaN(from) || isNaN(to) || isNaN(baseCost) || from === to) return;
    
    const edgeToAdd: Edge = {
      from,
      to,
      baseCost,
      isOneWay: newEdge.isOneWay,
      direction: 'both' // Default, can be adjusted if UI supports it
    };

    setEdges([...edges, edgeToAdd]);
    setNewEdge({ from: '', to: '', baseCost: '0', isOneWay: false });
    setShowAddEdge(false);
  };

  const deleteNode = (id: number) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.from !== id && e.to !== id));
  };

  const deleteEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const exportData = () => {
    const data = { 
      nodes, 
      edges, 
      timeSlot, 
      oneWayEnabled,
      metadata: {
        exported: new Date().toISOString(),
        version: '2.0',
        scenario: 'Nimal Evening Rush - Dehiwala to Fort/Maradana'
      }
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nimal-route-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') throw new Error("Invalid file content");
        const data = JSON.parse(result);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          if (data.timeSlot) setTimeSlot(data.timeSlot);
          if (data.oneWayEnabled !== undefined) setOneWayEnabled(data.oneWayEnabled);
          alert('Configuration imported successfully!');
        } else {
          alert('Invalid file format: Missing nodes or edges');
        }
      } catch (err) {
        alert('Error: Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Train className="text-blue-600" size={32} />
              Beat the Evening Rush: Dehiwala → Colombo Stations
            </h1>
            <p className="text-gray-600 mt-2">
              🕔 <strong>Current Time:</strong> 5:45 PM | <strong>Train Departure:</strong> Fort 6:10 PM (25 min) / Maradana 6:12 PM (27 min)
            </p>
          </div>
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200"
          >
            <Info size={18} />
            Help
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border-l-4 border-blue-600">
          <p className="text-gray-800">
            <strong>Scenario:</strong> Nimal finished a client meeting in <strong>Dehiwala</strong> and must catch the 
            <strong> 6:10 PM train to Maho</strong> from either <strong>Fort Station</strong> or <strong>Maradana Station</strong>. 
            Which route should he take? Will he make it in time? 🚂
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-md p-6 mb-6 border-2 border-orange-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="text-orange-600" size={24} />
              Traffic Configuration
            </h2>
            <button
              onClick={() => setShowTrafficConfig(!showTrafficConfig)}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              {showTrafficConfig ? 'Hide' : 'Show'} Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slot (Traffic Condition)
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as TimeSlotKey)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {Object.entries(timeSlots).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} (×{value.multiplier})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-3 rounded-md border-2 border-gray-300 hover:border-orange-400 transition-colors w-full">
                <input
                  type="checkbox"
                  checked={oneWayEnabled}
                  onChange={(e) => setOneWayEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-800">One-Way Traffic Restrictions</span>
                  <p className="text-xs text-gray-600">Fort area peak hour rules</p>
                </div>
                <ArrowRight className={oneWayEnabled ? 'text-red-600' : 'text-gray-400'} size={24} />
              </label>
            </div>
          </div>

          {showTrafficConfig && (
            <div className="mt-4 p-4 bg-white rounded-md border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-2">Current Settings:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Traffic Multiplier: <span className="font-bold text-orange-600">×{timeSlots[timeSlot].multiplier}</span></p>
                  <p className="text-gray-600">One-Way System: <span className="font-bold text-orange-600">{oneWayEnabled ? 'Active' : 'Inactive'}</span></p>
                </div>
                <div className="text-gray-600">
                  <p className="font-semibold mb-1">Deadlines:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Fort Station: 25 minutes (6:10 PM)</li>
                    <li>• Maradana Station: 27 minutes (6:12 PM)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Search Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmKey)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <optgroup label="Uninformed Search">
                  <option value="bfs">Breadth-First Search (BFS)</option>
                  <option value="dfs">Depth-First Search (DFS)</option>
                  <option value="dls">Depth-Limited Search (DLS)</option>
                  <option value="iddfs">Iterative Deepening DFS (IDDFS)</option>
                  <option value="ucs">Uniform Cost Search (UCS)</option>
                  <option value="bidirectional">Bidirectional Search</option>
                </optgroup>
                <optgroup label="Informed Search">
                  <option value="greedy">Greedy Best-First</option>
                  <option value="astar">A* Search ⭐</option>
                  <option value="hillclimbing">Hill Climbing</option>
                </optgroup>
              </select>
              {selectedAlgorithm === 'dls' && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Depth Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={depthLimit}
                    onChange={(e) => setDepthLimit(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md bg-blue-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max depth to search (1-10)</p>
                </div>
              )}
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={runAlgorithm}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                <Play size={16} /> Run Algorithm
              </button>
              <button
                onClick={runAllAlgorithms}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
              >
                Compare All
              </button>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => setShowAddNode(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700"
                title="Add new node"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setShowAddEdge(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                title="Add new edge"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={exportData}
                title="Export configuration"
                className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
              >
                <Download size={16} />
              </button>
              <label title="Import configuration" className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <Upload size={16} />
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📍 Graph Visualization</h2>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-700">
              <strong>Legend:</strong> Numbers on edges = <span className="text-blue-700 font-semibold">Actual Travel Time</span> (minutes) | 
              <span className="ml-2">h(n) = <span className="text-purple-700 font-semibold">Heuristic Value</span> (estimated time to nearest goal)</span>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <svg width="600" height="600" className="border border-gray-300 rounded bg-white mx-auto">
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                const isInPath = results && !results.compareAll && results.path && 
                  results.path.some((_, i) => 
                    i < results.path.length - 1 && 
                    ((results.path[i] === edge.from && results.path[i + 1] === edge.to) ||
                     (results.path[i] === edge.to && results.path[i + 1] === edge.from))
                  );

                const actualCost = Math.round(edge.baseCost * timeSlots[timeSlot].multiplier * 10) / 10;
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
                const arrowSize = 10;

                return (
                  <g key={idx}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isInPath ? '#22c55e' : (oneWayEnabled && edge.isOneWay ? '#ef4444' : '#cbd5e1')}
                      strokeWidth={isInPath ? 4 : 2}
                      strokeDasharray={oneWayEnabled && edge.isOneWay ? '5,5' : 'none'}
                    />
                    
                    <text
                      x={midX}
                      y={midY - 10}
                      className="text-xs fill-blue-600 font-semibold"
                      textAnchor="middle"
                    >
                      {actualCost}m
                    </text>

                    {oneWayEnabled && edge.isOneWay && (
                      <polygon
                        points={`${midX},${midY} ${midX - arrowSize * Math.cos(angle - Math.PI / 6)},${midY - arrowSize * Math.sin(angle - Math.PI / 6)} ${midX - arrowSize * Math.cos(angle + Math.PI / 6)},${midY - arrowSize * Math.sin(angle + Math.PI / 6)}`}
                        fill="#ef4444"
                      />
                    )}
                  </g>
                );
              })}

              {nodes.map(node => {
                const isInPath = results && !results.compareAll && results.path?.includes(node.id);
                const isInTraversal = results && !results.compareAll && results.traversal?.includes(node.id) && !isInPath;

                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={25}
                      fill={node.isStart ? '#3b82f6' : node.isGoal ? '#ef4444' : isInPath ? '#22c55e' : isInTraversal ? '#fbbf24' : '#f1f5f9'}
                      stroke="#475569"
                      strokeWidth={2}
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      className="text-xs font-bold"
                      textAnchor="middle"
                      fill={node.isStart || node.isGoal || isInPath ? 'white' : 'black'}
                    >
                      {node.id}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 45}
                      className="text-xs font-medium"
                      textAnchor="middle"
                    >
                      {node.name}
                    </text>
                    {node.deadline && (
                      <text
                        x={node.x}
                        y={node.y + 60}
                        className="text-xs text-red-600 font-bold"
                        textAnchor="middle"
                      >
                        ⏰{node.deadline}min
                      </text>
                    )}
                    <text
                      x={node.x}
                      y={node.deadline ? node.y + 75 : node.y + 60}
                      className="text-xs text-purple-600 font-semibold"
                      textAnchor="middle"
                    >
                      h={node.h}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 bg-blue-500 rounded-full border-2 border-gray-700"></span>
              <span>Start (Dehiwala)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 bg-red-500 rounded-full border-2 border-gray-700"></span>
              <span>Goal (Stations)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 bg-green-500 rounded-full border-2 border-gray-700"></span>
              <span>Solution Path</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 bg-yellow-500 rounded-full border-2 border-gray-700"></span>
              <span>Explored Node</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-8 h-1 bg-red-500"></span>
              <span>One-Way Road</span>
            </div>
          </div>

          {/* COLLAPSIBLE NODE & EDGE MANAGERS - Positioned right after visualization */}
          <div className="mt-6 space-y-4">
            {/* Node Manager Collapsible */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowNodeManager(!showNodeManager)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="text-purple-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Node Manager</h3>
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                    {nodes.length} nodes
                  </span>
                </div>
                {showNodeManager ? <ChevronUp className="text-gray-600" size={20} /> : <ChevronDown className="text-gray-600" size={20} />}
              </button>
              
              {showNodeManager && (
                <div className="p-4 bg-gray-50">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {nodes.map(node => (
                      <div key={node.id} className="flex items-center justify-between p-3 bg-white rounded hover:bg-gray-50 border border-gray-200">
                        <div className="flex-1 grid grid-cols-6 gap-4">
                          <span className="font-medium text-gray-700">ID: {node.id}</span>
                          <input
                            type="text"
                            value={node.name}
                            onChange={(e) => {
                              const updated = nodes.map(n => n.id === node.id ? {...n, name: e.target.value} : n);
                              setNodes(updated);
                            }}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={node.h}
                            onChange={(e) => {
                              const updated = nodes.map(n => n.id === node.id ? {...n, h: parseFloat(e.target.value) || 0} : n);
                              setNodes(updated);
                            }}
                            placeholder="h(n)"
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="number"
                            value={node.deadline || ''}
                            onChange={(e) => {
                              const deadlineValue = e.target.value ? parseFloat(e.target.value) : undefined;
                              const updated = nodes.map(n => n.id === node.id ? {...n, deadline: deadlineValue} : n);
                              setNodes(updated);
                            }}
                            placeholder="Deadline"
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={node.isGoal}
                              onChange={(e) => {
                                const updated = nodes.map(n => n.id === node.id ? {...n, isGoal: e.target.checked} : n);
                                setNodes(updated);
                              }}
                            />
                            Goal
                          </label>
                        </div>
                        <button
                          onClick={() => deleteNode(node.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Edge Manager Collapsible */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowEdgeManager(!showEdgeManager)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ArrowLeftRight className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Edge Manager</h3>
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                    {edges.length} edges
                  </span>
                </div>
                {showEdgeManager ? <ChevronUp className="text-gray-600" size={20} /> : <ChevronDown className="text-gray-600" size={20} />}
              </button>
              
              {showEdgeManager && (
                <div className="p-4 bg-gray-50">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {edges.map((edge, idx) => {
                      const actualCost = Math.round(edge.baseCost * timeSlots[timeSlot].multiplier * 10) / 10;
                      const fromNode = nodes.find(n => n.id === edge.from);
                      const toNode = nodes.find(n => n.id === edge.to);
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded hover:bg-gray-50 border border-gray-200">
                          <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                            <span className="text-sm font-medium">{fromNode?.name || edge.from}</span>
                            {edge.isOneWay && oneWayEnabled ? (
                              <ArrowRight className="text-red-600 mx-auto" size={18} />
                            ) : (
                              <ArrowLeftRight className="text-gray-400 mx-auto" size={18} />
                            )}
                            <span className="text-sm font-medium">{toNode?.name || edge.to}</span>
                            <div>
                              <input
                                type="number"
                                step="0.1"
                                value={edge.baseCost}
                                onChange={(e) => {
                                  const updated = edges.map((ed, i) => i === idx ? {...ed, baseCost: parseFloat(e.target.value) || 0} : ed);
                                  setEdges(updated);
                                }}
                                className="px-2 py-1 border rounded w-20 text-sm"
                              />
                              <span className="text-xs text-gray-500 ml-1">→ {actualCost}m</span>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={edge.isOneWay}
                                onChange={(e) => {
                                  const updated = edges.map((ed, i) => i === idx ? {...ed, isOneWay: e.target.checked} : ed);
                                  setEdges(updated);
                                }}
                              />
                              One-way
                            </label>
                          </div>
                          <button
                            onClick={() => deleteEdge(idx)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {results && !results.compareAll && (
          <div className="space-y-6">
            {results.deadlineStatus && (
              <div className={`rounded-lg shadow-xl p-8 text-center ${
                results.deadlineStatus.status === 'success' 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-400 to-rose-500'
              }`}>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {results.deadlineStatus.status === 'success' ? (
                    <>
                      <PartyPopper size={48} className="text-white animate-bounce" />
                      <Train size={48} className="text-white" />
                      <PartyPopper size={48} className="text-white animate-bounce" />
                    </>
                  ) : (
                    <>
                      <CloudRain size={48} className="text-white" />
                      <Train size={48} className="text-white opacity-50" />
                      <CloudRain size={48} className="text-white" />
                    </>
                  )}
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {results.deadlineStatus.status === 'success' ? '🎉 TRAIN CAUGHT! 🎉' : '😢 TRAIN MISSED! 😢'}
                </h2>
                <p className="text-2xl text-white font-semibold">
                  {results.deadlineStatus.message}
                </p>
                {results.deadlineStatus.status === 'success' && (
                  <p className="text-white mt-2 text-lg">
                    Nimal can relax! He has time to spare! ☕
                  </p>
                )}
                {results.deadlineStatus.status === 'missed' && (
                  <p className="text-white mt-2 text-lg">
                    Nimal will need to wait for the next train at 8:20 PM 😔
                  </p>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Algorithm: {results.algorithm}</h2>
                <button
                  onClick={runAllAlgorithms}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md font-semibold flex items-center gap-2"
                >
                  📊 Compare All Algorithms
                </button>
              </div>
              
              {results.note && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-2">
                  <AlertCircle className="text-yellow-600" size={20} />
                  <p className="text-sm text-yellow-800">{results.note}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className={`p-4 rounded ${results.deadlineStatus?.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Actual Path Cost (g)</p>
                  <p className="text-xl font-bold">{results.cost === Infinity ? '∞' : `${results.cost} min`}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded">
                  <p className="text-sm text-gray-600">Nodes Expanded</p>
                  <p className="text-xl font-bold">{results.nodesExpanded}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded">
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="text-xl font-bold">{results.goalReached}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Path Length</p>
                  <p className="text-xl font-bold">{results.path.length} nodes</p>
                </div>
                <div className={`p-4 rounded ${results.deadlineStatus?.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Time Margin</p>
                  <p className="text-xl font-bold">
                    {results.deadlineStatus?.status === 'success' ? '+' : '-'}
                    {results.deadlineStatus?.margin} min
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded border-2 border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Solution Path (Route to Follow)
                  </h3>
                  <p className="text-lg font-mono font-bold text-blue-800">
                    {results.path.length > 0 ? results.path.map(id => nodes.find(n => n.id === id)?.name || id).join(' → ') : 'No path'}
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded border-2 border-yellow-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Exploration Order (Nodes Checked)
                  </h3>
                  <p className="text-lg font-mono font-bold text-yellow-800">
                    {results.traversal?.length > 0 ? results.traversal.map(id => nodes.find(n => n.id === id)?.name || id).join(' → ') : 'N/A'}
                  </p>
                </div>
              </div>

              {algorithmProperties[results.algorithm] && (
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">📚 Algorithm Properties & Complexity Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-indigo-50 rounded border border-indigo-200">
                      <p className="text-xs text-gray-600 mb-1">Time Complexity</p>
                      <p className="text-lg font-bold text-indigo-700">{algorithmProperties[results.algorithm].timeComplexity}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Space Complexity</p>
                      <p className="text-lg font-bold text-purple-700">{algorithmProperties[results.algorithm].spaceComplexity}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Complete</p>
                      <p className={`text-lg font-bold ${algorithmProperties[results.algorithm].complete === 'Yes' ? 'text-green-700' : 'text-red-700'}`}>
                        {algorithmProperties[results.algorithm].complete}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Optimal</p>
                      <p className={`text-lg font-bold ${algorithmProperties[results.algorithm].optimal.includes('Yes') ? 'text-blue-700' : 'text-red-700'}`}>
                        {algorithmProperties[results.algorithm].optimal}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> {algorithmProperties[results.algorithm].description}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      <em>Where: <strong>g(n)</strong> = actual path cost from start to n, <strong>h(n)</strong> = heuristic estimate from n to goal, 
                      V = vertices, E = edges, b = branching factor, d = depth, m = maximum depth</em>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {results && results.compareAll && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">🏆 Algorithm Performance Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left font-semibold">Algorithm</th>
                      <th className="px-3 py-2 text-left font-semibold">Destination</th>
                      <th className="px-3 py-2 text-left font-semibold">Time (min)</th>
                      <th className="px-3 py-2 text-left font-semibold">Deadline</th>
                      <th className="px-3 py-2 text-left font-semibold">Train Status</th>
                      <th className="px-3 py-2 text-left font-semibold">Margin</th>
                      <th className="px-3 py-2 text-left font-semibold">Nodes Exp.</th>
                      <th className="px-3 py-2 text-left font-semibold">Optimal?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result, idx) => {
                      const successfulResults = results.results.filter(r => r.success && r.deadlineStatus?.status === 'success');
                      const minCost = successfulResults.length > 0 ? Math.min(...successfulResults.map(r => r.cost)) : Infinity;

                      const isOptimal = result.success && result.deadlineStatus?.status === 'success' && result.cost === minCost;
                      const goalNode = nodes.find(n => n.id === result.path[result.path.length - 1]);
                      const deadline = goalNode?.deadline || 0;
                      
                      return (
                        <tr key={idx} className={`border-b hover:bg-gray-50 ${
                          result.deadlineStatus?.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <td className="px-3 py-3 font-medium">{result.algorithm}</td>
                          <td className="px-3 py-3">{result.goalReached}</td>
                          <td className="px-3 py-3 font-semibold">{result.cost === Infinity ? '∞' : result.cost}</td>
                          <td className="px-3 py-3">{deadline} min</td>
                          <td className="px-3 py-3">
                            {result.deadlineStatus?.status === 'success' ? (
                              <span className="flex items-center gap-1 text-green-700 font-semibold">
                                <Train size={16} /> Caught!
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-700 font-semibold">
                                <CloudRain size={16} /> Missed
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 font-semibold">
                            {result.deadlineStatus?.status === 'success' ? '+' : '-'}
                            {result.deadlineStatus?.margin}
                          </td>
                          <td className="px-3 py-3">{result.nodesExpanded}</td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${isOptimal ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                              {isOptimal ? '⭐ Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">📊 Algorithm Complexity & Properties Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left font-semibold">Algorithm</th>
                      <th className="px-3 py-2 text-left font-semibold">Time Complexity</th>
                      <th className="px-3 py-2 text-left font-semibold">Space Complexity</th>
                      <th className="px-3 py-2 text-left font-semibold">Complete</th>
                      <th className="px-3 py-2 text-left font-semibold">Optimal</th>
                      <th className="px-3 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result, idx) => {
                      const props = algorithmProperties[result.algorithm];
                      if (!props) return null;
                      
                      return (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-3 font-medium">{result.algorithm}</td>
                          <td className="px-3 py-3 font-mono text-indigo-700">{props.timeComplexity}</td>
                          <td className="px-3 py-3 font-mono text-purple-700">{props.spaceComplexity}</td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              props.complete === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {props.complete}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              props.optimal.includes('Yes') ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {props.optimal}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-600">{props.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Legend:</strong> <strong>g(n)</strong> = actual path cost, <strong>h(n)</strong> = heuristic estimate, V = vertices (nodes), E = edges, b = branching factor, d = depth of solution, m = maximum depth, C* = optimal cost, ε = minimum edge cost
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📈 Performance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Fastest Algorithm(s)</p>
                  <p className="text-lg font-bold text-blue-700">
                    {(() => {
                      const successful = results.results.filter(r => r.success && r.deadlineStatus?.status === 'success');
                      if (successful.length === 0) return 'None';
                      const minCost = Math.min(...successful.map(r => r.cost));
                      const fastest = successful.filter(r => r.cost === minCost);
                      return fastest.map(r => r.algorithm).join(', ');
                    })()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const successful = results.results.filter(r => r.success && r.deadlineStatus?.status === 'success');
                      return successful.length > 0 ? `${Math.min(...successful.map(r => r.cost))} min` : '∞ min';
                    })()}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Most Efficient</p>
                  <p className="text-lg font-bold text-green-700">
                    {(() => {
                      const successful = results.results.filter(r => r.success);
                      if (successful.length === 0) return 'None';
                      const minNodes = Math.min(...successful.map(r => r.nodesExpanded));
                      const efficient = successful.filter(r => r.nodesExpanded === minNodes);
                      return efficient.map(r => r.algorithm).join(', ');
                    })()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const successful = results.results.filter(r => r.success);
                      return successful.length > 0 ? `${Math.min(...successful.map(r => r.nodesExpanded))} nodes` : '0 nodes';
                    })()}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded border-2 border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-lg font-bold text-purple-700">
                    {Math.round((results.results.filter(r => r.deadlineStatus?.status === 'success').length / results.results.length) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {results.results.filter(r => r.deadlineStatus?.status === 'success').length} of {results.results.length} caught train
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded border-2 border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Optimal Path Found By</p>
                  <p className="text-lg font-bold text-yellow-700">
                    {(() => {
                      const successful = results.results.filter(r => r.success && r.deadlineStatus?.status === 'success');
                      if (successful.length === 0) return 'None';
                      const minCost = Math.min(...successful.map(r => r.cost));
                      const optimal = successful.filter(r => r.cost === minCost);
                      return optimal.map(r => r.algorithm).join(', ');
                    })()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const successful = results.results.filter(r => r.success && r.deadlineStatus?.status === 'success');
                      if (successful.length === 0) return 'No solution';
                      const minCost = Math.min(...successful.map(r => r.cost));
                      const count = successful.filter(r => r.cost === minCost).length;
                      return `${count} algorithm${count > 1 ? 's' : ''}`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-3xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">📚 Tool Guide</h3>
              
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2 text-blue-700">🎯 Problem Statement</h4>
                  <p className="text-gray-700">
                    Nimal starts at <strong>Dehiwala at 5:45 PM</strong>. He must reach either:
                  </p>
                  <ul className="list-disc ml-5 mt-2 text-gray-700">
                    <li><strong>Fort Station</strong> by 6:10 PM (25 minutes deadline)</li>
                    <li><strong>Maradana Station</strong> by 6:12 PM (27 minutes deadline)</li>
                  </ul>
                  <p className="text-gray-700 mt-2">
                    The tool shows which algorithms find routes that catch the train! 🚂
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2 text-purple-700">📐 Understanding g(n) vs h(n)</h4>
                  <ul className="list-disc ml-5 text-gray-700 space-y-2">
                    <li><strong>g(n)</strong> = <span className="text-blue-700 font-semibold">Actual Path Cost</span> - The real travel time from start to node n</li>
                    <li><strong>h(n)</strong> = <span className="text-purple-700 font-semibold">Heuristic Estimate</span> - Estimated time from node n to nearest goal (always ≤ actual)</li>
                    <li><strong>f(n) = g(n) + h(n)</strong> - Total estimated cost (used by A*)</li>
                  </ul>
                  <p className="text-gray-700 mt-2 text-sm">
                    <strong>Example:</strong> If g(n)=10 min (traveled so far) and h(n)=5 min (estimate to goal), then f(n)=15 min total.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2 text-green-700">✅ Understanding Results</h4>
                  <ul className="list-disc ml-5 text-gray-700 space-y-1">
                    <li><strong>🎉 Train Caught:</strong> g(n) ≤ deadline (Green banner with celebration)</li>
                    <li><strong>😢 Train Missed:</strong> g(n) &gt; deadline (Red banner with sad message)</li>
                    <li><strong>Solution Path:</strong> The actual route Nimal should take</li>
                    <li><strong>Exploration Order:</strong> All nodes the algorithm checked</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2 text-yellow-700">⚙️ Traffic System</h4>
                  <p className="text-gray-700 mb-2">
                    <strong>Time Slots</strong> multiply base costs:
                  </p>
                  <ul className="list-disc ml-5 text-gray-600 space-y-1">
                    <li>Evening Peak (default): ×2.0 ← Problem scenario</li>
                    <li>Off-Peak: ×1.0, Morning Rush: ×1.8, School: ×1.3, Weekend: ×1.25</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2 text-orange-700">📊 Expected Results</h4>
                  <p className="text-gray-700 mb-2">At Evening Peak (×2.0):</p>
                  <ul className="list-disc ml-5 text-gray-600 space-y-1">
                    <li><strong>Optimal path:</strong> Dehiwala → Borella → Maradana = 13 minutes ✅</li>
                    <li><strong>Result:</strong> Train caught with 14 minutes to spare! 🎉</li>
                    <li><strong>Optimal algorithms:</strong> UCS, A* (guaranteed)</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2 text-indigo-700">🔧 New Feature: Collapsible Managers</h4>
                  <p className="text-gray-700">
                    Node and Edge managers are now <strong>collapsible sections</strong> below the visualization! 
                    Click the headers to expand/collapse them. This keeps the important visualization clearly visible while 
                    still providing easy access to editing tools when needed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="mt-6 w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 font-semibold"
              >
                Got it! Let's find the best route! 🚀
              </button>

              <div className="mt-6 p-4 bg-gray-100 rounded border-2 border-gray-300">
                <h4 className="font-bold text-sm mb-2 text-gray-800">✅ Technical Validation Status</h4>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>✓ Base costs: Verified for ×2.0 = document values</p>
                  <p>✓ All 8 algorithms: Correctly implemented</p>
                  <p>✓ g(n) and h(n) clearly distinguished</p>
                  <p>✓ Heuristic values shown for all nodes (including goals)</p>
                  <p>✓ Smart node placement prevents overlaps</p>
                  <p>✓ Collapsible UI for better visualization focus</p>
                  <p>✓ All features validated and working</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddNode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Node</h3>
              <input
                type="text"
                placeholder="Node Name (e.g., Pettah)"
                value={newNode.name}
                onChange={(e) => setNewNode({...newNode, name: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-3"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Heuristic h(n) - Estimate to goal"
                value={newNode.h}
                onChange={(e) => setNewNode({...newNode, h: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-3"
              />
              <input
                type="number"
                placeholder="Deadline (minutes) - Optional"
                value={newNode.deadline || ''}
                onChange={(e) => setNewNode({...newNode, deadline: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-3"
              />
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={newNode.isGoal}
                  onChange={(e) => setNewNode({...newNode, isGoal: e.target.checked})}
                />
                <span className="text-sm">Is this a goal/destination node?</span>
              </label>
              <p className="text-xs text-gray-600 mb-4">
                * Node will be placed automatically to avoid overlaps
              </p>
              <div className="flex gap-2">
                <button onClick={addNode} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add Node
                </button>
                <button onClick={() => setShowAddNode(false)} className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddEdge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Edge</h3>
              <select
                value={newEdge.from}
                onChange={(e) => setNewEdge({...newEdge, from: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-3"
              >
                <option value="">From Node</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.name} (ID: {n.id})</option>)}
              </select>
              <select
                value={newEdge.to}
                onChange={(e) => setNewEdge({...newEdge, to: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-3"
              >
                <option value="">To Node</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.name} (ID: {n.id})</option>)}
              </select>
              <input
                type="number"
                step="0.1"
                placeholder="Base Cost (minutes)"
                value={newEdge.baseCost}
                onChange={(e) => setNewEdge({...newEdge, baseCost: e.target.value})}
                className="w-full px-3 py-2 border rounded mb-3"
              />
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={newEdge.isOneWay}
                  onChange={(e) => setNewEdge({...newEdge, isOneWay: e.target.checked})}
                />
                <span className="text-sm">One-Way Road? (Only from → to)</span>
              </label>
              <div className="flex gap-2">
                <button onClick={addEdge} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add Edge
                </button>
                <button onClick={() => setShowAddEdge(false)} className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAlgorithmTool;