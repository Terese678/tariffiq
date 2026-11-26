from rates import parse_rate  # pulling in the function I'm testing

# plain cases: free means 0, a percent should become a number
assert parse_rate("Free") == 0.0
assert parse_rate("free") == 0.0        # case shouldn't matter
assert parse_rate("6.5%") == 6.5
assert parse_rate("  25% ") == 25.0     # stray spaces around it

# rates I can't turn into one number, so I expect None
assert parse_rate("2.5¢/kg") is None    # charged per kilo, I have no weight
assert parse_rate("5.3¢/kg + 6%") is None
assert parse_rate("") is None

print("all rate tests passed")