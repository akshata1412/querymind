from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/generate")
def generate_er_data(req: SchemaRequest):
    nodes, edges = [], []
    cols = 4
    for i, (table_name, table_data) in enumerate(req.schema.items()):
        x = (i % cols) * 280
        y = (i // cols) * 320
        nodes.append({
            "id": table_name,
            "type": "tableNode",
            "position": {"x": x, "y": y},
            "data": {
                "label": table_name,
                "columns": table_data["columns"],
                "primary_keys": table_data["primary_keys"],
                "foreign_keys": table_data["foreign_keys"],
            }
        })
    edge_id = 0
    for table_name, table_data in req.schema.items():
        for fk in table_data["foreign_keys"]:
            edges.append({
                "id": f"e{edge_id}",
                "source": table_name,
                "target": fk["references_table"],
                "sourceHandle": fk["column"],
                "label": f"{fk['column']} → {fk['references_column']}",
                "type": "smoothstep",
                "animated": True,
                "style": {"stroke": "#00B4D8", "strokeWidth": 2},
            })
            edge_id += 1
    return {"nodes": nodes, "edges": edges}