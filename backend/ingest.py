# ingest.py: downloads the tariff schedule, saves only rows that are new or changed
import sys, sqlite3, hashlib, requests
from codes import normalize_code

URL = "https://hts.usitc.gov/reststop/exportList?from={}&to={}&format=JSON&styles=false"
DB = "backend/tariffs.db"

def ingest(start="0101", end="9999.99.99.99"):
  rows = requests.get(URL.format(start, end), timeout=120).json()
  con = sqlite3.connect(DB)
  con.execute("CREATE TABLE IF NOT EXISTS rates (code TEXT PRIMARY KEY, description TEXT, rate TEXT, hash TEXT)")
  before = con.total_changes

  for r in rows:
    code = normalize_code(r.get("htsno") or "")
    rate = r.get("general") or ""
    if not code or not rate:
      continue  # headings have no rate, skip them
    code = code[:8]  # lookups use 8 digits, so 6912.00.44.00 is saved as 69120044
    desc = r.get("description") or ""
    fingerprint = hashlib.sha256(f"{desc}|{rate}".encode()).hexdigest()
    # new row: insert. old row: update only if the fingerprint changed
    con.execute(
      "INSERT INTO rates VALUES (?, ?, ?, ?) ON CONFLICT(code) DO UPDATE SET "
      "description = excluded.description, rate = excluded.rate, hash = excluded.hash "
      "WHERE rates.hash != excluded.hash",
      (code, desc, rate, fingerprint))

  con.commit()
  total = con.execute("SELECT COUNT(*) FROM rates").fetchone()[0]
  print(f"downloaded {len(rows)} lines, {con.total_changes - before} new or changed, {total} saved")

if __name__ == "__main__":
  ingest(*sys.argv[1:3])  # optional start and end codes