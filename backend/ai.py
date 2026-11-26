# ai.py: the three jobs I give the AI. It picks and explains, it never does math.
import os, re, requests
from dotenv import load_dotenv

load_dotenv("backend/.env")  # the key is read from this file on the server
URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "anthropic/claude-sonnet-4-5"

# sends one prompt to the AI and gives back its text answer
def ask(prompt):
  res = requests.post(URL, timeout=60,
    headers={"Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}"},
    json={"model": MODEL, "max_tokens": 500, "messages": [{"role": "user", "content": prompt}]})
  res.raise_for_status()  # if the call failed, stop here instead of carrying on
  return res.json()["choices"][0]["message"]["content"].strip()

# job 1: the AI guesses which 4-digit headings the product sits under
def guess_headings(product):
  reply = ask(f"Up to two 4-digit US HTS headings for: {product}. Reply with digits only, comma separated.")
  return re.findall(r"\d{4}", reply)[:2]  # keep only 4-digit numbers, two at most

# job 2: the AI picks one line from real codes in my database
def pick_code(product, rows):
  lines = "\n".join(f"{code} | {desc[:120]} | {rate}" for code, desc, rate in rows)
  return ask(f"Which line best fits: {product}?\n{lines}\nReply with the code only.")

# job 3: the AI explains numbers my own code already worked out
def explain(product, country, desc, rate, duty_amount, landed):
  return ask(
    f"A small business is planning to import {product} from {country}, classified as: {desc}. "
    f"Base duty rate {rate}%, duty ${duty_amount}, landed cost ${landed}. "
    "This is an estimate before buying, not money already paid. "
    "Do not guess which extra tariffs apply."
    "Write one short plain-English paragraph of advice. Use only these numbers, "
    "and say extra country-specific tariffs may apply.")