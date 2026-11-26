from duty import duty   # bring in the function we are testing

# left: inputs. right: the answer I worked out by hand
assert duty(500, 3.50, 25) == (437.5, 2187.5)
assert duty(100, 2, 10) == (20.0, 220.0)
assert duty(10, 5, 0) == (0.0, 50.0)   # a 0% tax means no duty at all
assert duty(300, 15.5, 10) == (465.0, 5115.0)

print("all tests passed")