from pydantic import BaseModel
from typing import List, Dict

class Node(BaseModel):
    id: str
    type: str
    position: Dict
    data: Dict

class Edge(BaseModel):
    source: str
    target: str
    id: str

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]