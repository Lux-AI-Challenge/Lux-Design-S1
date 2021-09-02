# read in a markdown doc and strip all hrefs
file_path = "./specs.md"
import re
with open(file_path, "r") as f:
    txt = f.read()
    # Anything that isn't a square closing bracket
    name_regex = "[^]]+"
    # http:// or https:// followed by anything but a closing paren
    url_regex = "#*[^)]+"

    markup_regex = '\[({0})]\(\s*({1})\s*\)'.format(name_regex, url_regex)
    matches = re.findall(markup_regex, txt)
    for match in matches:
        txt = txt.replace(f"[{match[0]}]({match[1]})", match[0])
    print(txt)

