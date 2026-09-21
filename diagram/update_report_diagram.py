from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Inches, Pt


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "Lab1.docx"
OUTPUT = ROOT / "Lab1-editable.docx"
IMAGE = ROOT / "diagram" / "priya-architecture-drawio.png"
REPOSITORY_URL = "https://github.com/horiiiiii032929/cs5224-lab1-priya-wedding-gallery"


def image_target(document: Document, paragraph) -> str | None:
    for blip in paragraph._p.iter(qn("a:blip")):
        rel_id = blip.get(qn("r:embed"))
        if rel_id and rel_id in document.part.rels:
            return document.part.rels[rel_id].target_ref
    return None


def remove_paragraph(paragraph) -> None:
    element = paragraph._element
    element.getparent().remove(element)
    paragraph._p = paragraph._element = None


doc = Document(SOURCE)

# Remove the redundant caption above the landscape figure. The figure itself
# now contains the requested title and region subtitle.
for paragraph in list(doc.paragraphs):
    if paragraph.text.startswith("Figure 1. Architecture of Priya"):
        remove_paragraph(paragraph)
        break

# Replace only the architecture image, preserving every other report element.
for paragraph in doc.paragraphs:
    if image_target(doc, paragraph) == "media/image7.png":
        paragraph.clear()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        paragraph.paragraph_format.space_before = 0
        paragraph.paragraph_format.space_after = 0
        run = paragraph.add_run()
        run.add_picture(str(IMAGE), width=Inches(10.68), height=Inches(7.18))
        break
else:
    raise RuntimeError("Architecture image was not found in the source report")

# Add the source repository URL at the bottom without changing existing prose
# or code snippets.
repository_paragraph = doc.add_paragraph()
repository_paragraph.paragraph_format.space_before = 8
repository_run = repository_paragraph.add_run(f"Repository: {REPOSITORY_URL}")
repository_run.font.size = Pt(9)

# Keep the existing three-section A4 structure: portrait, landscape, portrait.
doc.save(OUTPUT)
print(OUTPUT)
