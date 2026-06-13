# FastAPI Pipeline Parser

A clean, modular FastAPI application for parsing and validating pipeline structures with DAG (Directed Acyclic Graph) cycle detection.

## Features
- Parse pipeline nodes and edges
- Count nodes and edges
- Detect cycles in the pipeline graph
- CORS enabled for frontend integration

## Installation

### Prerequisites
- Python 3.8 or higher

### Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt