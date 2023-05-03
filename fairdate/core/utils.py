import random
import string

def generate_custom_id():
    prefix = 'FDT'
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return prefix + '-' + suffix


new_id = generate_custom_id()
print(new_id)