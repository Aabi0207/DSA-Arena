import requests
from bs4 import BeautifulSoup
from bs4.element import NavigableString


def extract_formatted_text(html_content):
    """
    Convert HTML content to well-formatted plain text.
    Handles newlines and spacing for readability.
    """
    soup = BeautifulSoup(html_content, "html.parser")

    # Add newlines before and after block-level elements
    block_tags = ['p', 'pre', 'ul', 'ol', 'li', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    for tag in soup.find_all(block_tags):
        tag.insert_before(NavigableString("\n"))
        tag.insert_after(NavigableString("\n"))

    # Replace <br> with line breaks
    for br in soup.find_all("br"):
        br.replace_with("\n")

    # Optional: Format <pre> code blocks more clearly
    for pre in soup.find_all("pre"):
        text = pre.get_text(strip=True)
        pre.string = f"\n{text}\n"

    # Convert to plain text
    text = soup.get_text()

    # Remove excessive empty lines
    lines = [line.strip() for line in text.splitlines()]
    cleaned_text = "\n".join([line for line in lines if line])

    return cleaned_text


def get_leetcode_problem_html(slug, lang="C++"):
    """
    Fetch LeetCode problem title, clean description text, and starter code.
    
    Args:
        slug (str): Problem slug (e.g., "set-matrix-zeroes")
        lang (str): Programming language for starter code (default: "C++")
    
    Returns:
        dict: {'title': ..., 'content_text': ..., 'code': ...}
    """
    url = "https://leetcode.com/graphql"
    query = """
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        content
        codeSnippets {
          lang
          code
        }
      }
    }
    """
    variables = {"titleSlug": slug}
    headers = {
        "Content-Type": "application/json",
        "Referer": f"https://leetcode.com/problems/{slug}/",
        "User-Agent": "Mozilla/5.0"
    }
    json_data = {"query": query, "variables": variables}
    
    response = requests.post(url, json=json_data, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    question = data.get("data", {}).get("question", {})
    if not question:
        return {"error": "Problem not found."}
    
    # Convert HTML content to clean plain text
    content_html = question.get("content", "")
    content_text = extract_formatted_text(content_html)
    
    # Find starter code for the requested language
    code_snippets = question.get("codeSnippets", [])
    code = next((c["code"] for c in code_snippets if c["lang"] == lang), "")
    
    return {
        "title": question.get("title", ""),
        "content_text": content_text,
        "code": code
    }


# Example usage
# result = get_leetcode_problem_html("set-matrix-zeroes", "C++")
# print("Title:", result["title"])
# print("\nDescription:\n", result["content_text"])
# print("\nStarter Code:\n", result["code"])
