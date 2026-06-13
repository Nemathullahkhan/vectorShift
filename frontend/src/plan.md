# VERSION 1: CORE PLAN (Necessary)

## User Flow 
- Add nodes via the existing **drag-and-drop mechanism** from the toolbar (keep current interaction model unchanged)
- Submit via an "Execute" button that calls the backend and displays the result as an `alert()` showing `num_nodes`, `num_edges`, and `is_dag`
- Output node is optional — no validation needed to enforce its presence

## PART - 1: Node Abstraction (Foundation)
- Create shared components for reusability:
  - `BaseNode` — wrapper component that renders node shell (header, body, handles)
  - `BaseHandle` — standardized Handle positioning and styling
  - Node content wrapper — holds fields (inputs, textareas, selects)
- Create a **registry** mapping `nodeType` to node config (defines handles, fields, labels)
- Create per-node **config files** (e.g., `inputNodeConfig.js`, `llmNodeConfig.js`) defining structure, not rendering
- Refactor existing 4 nodes (Input, Output, LLM, Text) to use `BaseNode` + config
- Create **5 new nodes** using this config-driven approach:
  - Manual Trigger (entry point node)
  - HTTP Request (make API calls)
  - Math/Calculator (basic math operations)
  - Filter (conditional logic)
  - Delay (pause execution)

## PART - 2: Styling (Visual Consistency)
- Apply Tailwind CSS + shadCN to `BaseNode` and `BaseHandle` — this automatically styles all 9 node types uniformly
- Style the toolbar and draggable node palette items consistently
- Handle styling: consistent colors, sizes, positions
- Basic, clean layout for the React Flow canvas (Background, Controls positioning)

## PART - 3: Text Node Logic (Dynamic Behavior)
- Replace `<input>` with an auto-resizing `<textarea>` — adjust height/width based on content using `scrollHeight`
- **Regex-based variable detection**: parse `{{ variableName }}` patterns on every keystroke
- Dynamically add/remove left-side `Handle`s based on detected variables, keeping data synced to store
- Handle cleanup when variables are removed from text

## PART - 4: Backend Integration (End-to-End Flow)
- **Frontend (submit.js)**:
  - Pull `nodes` and `edges` from `useStore`
  - Make a `POST` request to `/pipelines/parse` with JSON body: `{ nodes, edges }`
  - Handle the response and display result via `alert()`
- **Backend (main.py)**:
  - Change `/pipelines/parse` to a `POST` endpoint accepting JSON
  - Add `CORSMiddleware` (frontend :3000 ↔ backend :8000)
  - Compute `num_nodes` (array length) and `num_edges` (array length)
  - Implement `is_dag` check via **cycle detection** (DFS or `networkx.is_directed_acyclic_graph()`)
  - Return JSON response: `{num_nodes: int, num_edges: int, is_dag: bool}`
- Display the result as an `alert()` showing all three values in a readable format

## EXECUTION ORDER 
**PART 4 → PART 1 → PART 3 → PART 2**


---

# VERSION 2: STRETCH FEATURES (Additional / Nice-to-Have)

**Only pursue these after Version 1 is fully working and tested end-to-end.**

## User Flow Enhancements
- Replace drag-and-drop with a **"+" button** that opens a right sidebar panel
  - Sidebar lists all available node types for click-to-add
  - Decide on node placement strategy: viewport center, cascading offset from last added node, or grid snap
- Sidebar includes an optional **search bar** to filter/find node types by name
- **Manual Trigger validation** (v2): before adding any other node, check if a Manual Trigger node exists; if not, show a hint or require it first

## UI/UX Polish
- **Theme toggle button** (light/dark mode) using shadCN theme utilities
- New **Navbar** with:
  - Company logo/branding on the left
  - Your name + GitHub profile link on the right
- Toast notification instead of `alert()` using shadCN `Toast` or `Sonner` for a more polished result display

## Backend Validation Enhancements
- Extend `is_dag` error messaging: if `is_dag` is `false`, identify and return which **node(s) form the cycle** (requires tracking the actual cycle path during DFS)
- Return detailed error: `{is_dag: false, error: "Cycle detected involving nodes: X, Y, Z"}`
- Display the error message alongside the alert/toast to help users fix their pipeline

## Output Node Handling
- Explicitly validate that **Output node is optional** (no enforcement, just allow pipelines without it)

---