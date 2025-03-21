# users/utils.py
def calculate_rank(score, max_score):
    percentage = (score / max_score) * 100
    if percentage > 95:
        return "Bahubali"
    elif percentage > 80:
        return "Rocky Bhai"
    elif percentage > 60:
        return "Pushpa Bahu"
    elif percentage > 40:
        return "Mass"
    elif percentage > 20:
        return "Singham"
    return "Chulbul Pandey"
