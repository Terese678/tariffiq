# rates.py: reads the rate text from the tariff file and gives back a number
def parse_rate(text):
  text = text.strip().lower()
  if text == "free":
    return 0.0
  if text.endswith("%"):        # only handle plain percent rates
    number = text[:-1]          # drop the % sign, keep the digits
    try:
      return float(number)      # "6.5" becomes 6.5
    except ValueError:
      return None               # not a clean number, so skip it
  return None                   # per-kilo and other formats