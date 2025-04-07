import openpyxl
import csv

# Map fill color hex to difficulty
COLOR_TO_DIFFICULTY = {
    "D9EAD3": "Easy",
    "B6D7A8": "Medium",
    "93C47D": "Hard",
}

def extract_dsa_from_excel(excel_path, output_tsv):
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    sheet = wb.active

    data = []
    current_topic = None
    blank_row_count = 0

    for row in sheet.iter_rows(min_row=1):
        topic_cell = row[0]
        question_cell = row[1]

        # Skip if topic and question both are empty
        if (not topic_cell.value) and (not question_cell.value):
            blank_row_count += 1
            continue

        # Reset blank row counter if row is not fully empty
        blank_row_count = 0

        # Update topic if topic cell has value
        if topic_cell.value:
            current_topic = topic_cell.value.strip()

        # Skip if question is empty or not a Hyperlink
        if question_cell.value is None or question_cell.hyperlink is None:
            continue

        # Extract difficulty from the fill color of the topic cell
        fill = topic_cell.fill
        color = fill.start_color.rgb
        hex_color = color[-6:] if color else ""
        difficulty = COLOR_TO_DIFFICULTY.get(hex_color.upper(), "UNMARKED")

        problem_name = question_cell.value.strip()
        problem_link = question_cell.hyperlink.target.strip()

        data.append([
            problem_name,
            problem_link,
            current_topic,
            "",  # Solution Link is blank
            difficulty
        ])

    # Write to TSV
    with open(output_tsv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, delimiter='\t')
        writer.writerow(['Problem Name', 'Problem Link', 'Topic', 'Solution Link', 'Difficulty'])
        writer.writerows(data)

    print(f"Extracted {len(data)} questions to {output_tsv}")

# Example usage
extract_dsa_from_excel(r"C:\Users\abhis\OneDrive\Desktop\Coding\FullStack\CapstoneProjects\DSA-Arena\DataCollector\apnaCollege.xlsx", "apnaCollege.tsv")
