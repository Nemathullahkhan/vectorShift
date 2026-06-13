from fastapi import APIRouter
from ..models.pipeline import PipelineRequest
from ..services.dag_checker import is_dag

router = APIRouter()

@router.get('/')
def read_root():
    return {'Ping': 'Pong'}

@router.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse a pipeline and return:
    - num_nodes: count of nodes
    - num_edges: count of edges
    - is_dag: whether the pipeline forms a directed acyclic graph
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag
    }