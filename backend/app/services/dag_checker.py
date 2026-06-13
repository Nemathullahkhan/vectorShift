from typing import List
from ..models.pipeline import Node, Edge

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the given nodes and edges form a directed acyclic graph.
    Returns True if DAG, False if there's a cycle.
    """
    # Build adjacency list
    adj = {node.id: [] for node in nodes}
    for edge in edges:
        adj[edge.source].append(edge.target)
    
    # Track visited states: 0 = unvisited, 1 = visiting, 2 = visited
    state = {node.id: 0 for node in nodes}
    
    def has_cycle(node_id):
        """DFS to detect cycle"""
        if state[node_id] == 1:  # Currently visiting this node - cycle found
            return True
        if state[node_id] == 2:  # Already fully visited
            return False
        
        state[node_id] = 1  # Mark as visiting
        for neighbor in adj[node_id]:
            if has_cycle(neighbor):
                return True
        state[node_id] = 2  # Mark as visited
        return False
    
    # Check from each unvisited node
    for node_id in state:
        if state[node_id] == 0:
            if has_cycle(node_id):
                return False
    return True