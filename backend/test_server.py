import os, sqlite3, tempfile
import server
from fastapi import HTTPException
from server import Shipment, analyze

# a small test database with the mug line I know: 10%
server.DB = os.path.join(tempfile.mkdtemp(), "test.db")
con = sqlite3.connect(server.DB)
con.execute("CREATE TABLE rates (code TEXT PRIMARY KEY, description TEXT, rate TEXT, hash TEXT)")
con.execute("INSERT INTO rates VALUES ('69120044', 'Mugs and other steins', '10%', 'x')")
con.commit()

# fake AI, so the test needs no internet and gives the same answer every time
server.guess_headings = lambda product: ["6912"]
server.explain = lambda *args: "fake advice"
order = Shipment(product="mugs", originCountry="China", quantity=500, unitPrice=3.5)

# the AI picks the real line, the numbers must come from my own code
server.pick_code = lambda product, rows: "69120044"
result = analyze(order)
assert result["dutyAmount"] == 175.0
assert result["landedCost"] == 1925.0

# the AI picks a code that isn't in the list, the server must refuse
server.pick_code = lambda product, rows: "99999999"
try:
  analyze(order)
  assert False, "should have refused"
except HTTPException as e:
  assert e.status_code == 422

print("all server tests passed")
