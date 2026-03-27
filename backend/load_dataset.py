import pandas as pd
import sqlite3
import os

# Load the CSV
df = pd.read_csv('olist_customers_dataset.csv')

print("Columns found:", list(df.columns))
print("Rows:", len(df))

# Create SQLite database
conn = sqlite3.connect('olist.db')

# Save to database
df.to_sql('customers', conn, if_exists='replace', index=False)

conn.commit()
conn.close()

print("Database created: olist.db")
print("Table 'customers' loaded successfully!")