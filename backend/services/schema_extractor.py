from sqlalchemy import create_engine, inspect

def extract_schema(db_url: str) -> dict:
    engine = create_engine(db_url)
    inspector = inspect(engine)
    schema = {}
    for table_name in inspector.get_table_names():
        columns = []
        for col in inspector.get_columns(table_name):
            columns.append({
                "name": col["name"],
                "type": str(col["type"]),
                "nullable": col.get("nullable", True),
                "default": str(col.get("default", "")),
            })
        foreign_keys = []
        for fk in inspector.get_foreign_keys(table_name):
            foreign_keys.append({
                "column": fk["constrained_columns"][0],
                "references_table": fk["referred_table"],
                "references_column": fk["referred_columns"][0],
            })
        pk = inspector.get_pk_constraint(table_name)
        indexes = inspector.get_indexes(table_name)
        schema[table_name] = {
            "columns": columns,
            "foreign_keys": foreign_keys,
            "primary_keys": pk.get("constrained_columns", []),
            "indexes": [i["name"] for i in indexes],
        }
    return schema