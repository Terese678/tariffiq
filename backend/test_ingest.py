import sqlite3
from ingest import save

# three fake lines shaped like the real download
rows = [
  {"htsno": "6912.00.44.00", "description": "Mugs and other steins", "general": "10%"},
  {"htsno": "6912.00", "description": "A heading with no rate", "general": ""},
  {"htsno": "6109.10.00", "description": "Of cotton", "general": "16.5%"},
]
con = sqlite3.connect(":memory:")  # a throwaway database, nothing saved to disk

assert save(rows, con) == 2   # the heading has no rate, so only 2 get saved
assert save(rows, con) == 0   # same data again, nothing to do
rows[0]["general"] = "12%"
assert save(rows, con) == 1   # one rate changed, so one row updates
assert con.execute("SELECT rate FROM rates WHERE code = '69120044'").fetchone()[0] == "12%"

print("all ingest tests passed")
