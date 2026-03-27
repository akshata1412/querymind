from sqlalchemy import create_engine, text

engine = create_engine("sqlite:///./demo.db")

with engine.connect() as conn:
    # Create tables
    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        city TEXT
    );
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL
    );
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    );
    """))

    conn.execute(text("""
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY,
        order_id INTEGER,
        amount REAL,
        status TEXT,
        FOREIGN KEY(order_id) REFERENCES orders(id)
    );
    """))

    # Insert sample data
    conn.execute(text("""
    INSERT INTO customers (name, email, city) VALUES
    ('Aksh', 'aksh@example.com', 'Pune'),
    ('Rahul', 'rahul@example.com', 'Mumbai'),
    ('Priya', 'priya@example.com', 'Delhi');
    """))

    conn.execute(text("""
    INSERT INTO products (name, price) VALUES
    ('Laptop', 75000),
    ('Phone', 30000),
    ('Headphones', 2000);
    """))

    conn.execute(text("""
    INSERT INTO orders (customer_id, product_id, quantity) VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3);
    """))

    conn.execute(text("""
    INSERT INTO payments (order_id, amount, status) VALUES
    (1, 75000, 'Paid'),
    (2, 60000, 'Pending'),
    (3, 6000, 'Paid');
    """))

    conn.commit()

print("✅ Demo database created successfully!")