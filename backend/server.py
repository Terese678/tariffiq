# server.py: the API the React app calls.
# AI narrows the choices, the database gives the rate, plain code does the math.
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ai import guess_headings, pick_code, explain
from codes import normalize_code
from duty import duty
from rates import parse_rate

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])

class Shipment(BaseModel):  # the four fields the form sends
  product: str
  originCountry: str
  quantity: float = Field(gt=0)
  unitPrice: float = Field(gt=0)

@app.post("/analyze")
def analyze(s: Shipment):
  # step 1: get the real tariff lines under the headings the AI guessed
  heads = guess_headings(s.product)
  con = sqlite3.connect("backend/tariffs.db")
  marks = ",".join("?" * len(heads))
  rows = con.execute(f"SELECT code, description, rate FROM rates WHERE substr(code, 1, 4) IN ({marks})", heads).fetchall()
  if not rows:
    raise HTTPException(422, "No matching tariff lines loaded for this product")

  # step 2: the AI picks one line, and it must be a real one from the list
  code = normalize_code(pick_code(s.product, rows))
  match = next((r for r in rows if r[0] == code), None)
  rate = parse_rate(match[2]) if match else None
  if rate is None:
    raise HTTPException(422, "No simple percentage rate found for this product")

  # step 3: plain code does the math
  duty_amount, landed = duty(s.quantity, s.unitPrice, rate)
  return {
    "tariffRate": f"{rate}%",
    "dutyAmount": duty_amount,
    "landedCost": landed,
    "marginImpact": f"Matched line {code}: {match[1][:80]}. Base duty adds ${duty_amount:,.2f} to a ${s.quantity * s.unitPrice:,.2f} shipment. Extra tariffs on {s.originCountry} are not included.",
    "alternatives": [],  # needs country-by-country data, not built yet
    "advice": explain(s.product, s.originCountry, match[1][:150], rate, duty_amount, landed),
  }