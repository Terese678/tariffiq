# duty.py: this is where the tax calculation is
def duty(quantity, unit_price, rate_percent):
  total_value = quantity * unit_price              # what you pay the supplier
  duty_amount = total_value * rate_percent / 100   # the tax you owe
  landed_cost = total_value + duty_amount          # real total cost
  return round(duty_amount, 2), round(landed_cost, 2)