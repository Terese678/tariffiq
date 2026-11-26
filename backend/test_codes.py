from codes import normalize_code  # the function I'm about to write

# dots and spaces get stripped, digits stay
assert normalize_code("6911.10.10") == "69111010"
assert normalize_code("6911.10.10.00") == "6911101000"
assert normalize_code("  6911.10 ") == "691110"

# anything that isn't a usable code gives back None
assert normalize_code("69") is None        # too short to mean anything
assert normalize_code("6911.1x.10") is None  # a letter slipped in
assert normalize_code("") is None

print("all code tests passed")