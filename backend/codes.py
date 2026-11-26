# codes.py: cleans up a tariff code so lookups always match
def normalize_code(text):
  text = text.strip().replace(".", "")   # drop spaces and dots
  if text.isdigit() and 4 <= len(text) <= 10:
    return text                          # only digits, sensible length
  return None                            # anything else isn't a code