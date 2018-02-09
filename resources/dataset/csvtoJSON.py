import csv
import json

csvfile = open('restaurants_info.csv', 'r')
jsonfile = open('csvtoJSON.json', 'w')

fieldnames = ("objectID","food_type","stars_count","reviews_count","neighborhood","phone_number","price_range","dining_style")
reader = csv.DictReader( csvfile, fieldnames)
out = json.dumps( [ row for row in reader ] )
jsonfile.write(out)