# users/utils.py
def calculate_rank(score, max_score):
    percentage = (score / max_score) * 100
    if percentage > 95:
        return "Surya Bhai"
    elif percentage > 80:
        return "Rocky Bhai"
    elif percentage > 60:
        return "Bahubali"
    elif percentage > 40:
        return "Lucky the Racer"
    elif percentage > 20:
        return "Aadi"
    return "JADHAV"
