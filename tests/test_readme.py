from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from generate_readme import END, START, clean_text, replace_generated_section


class ReadmeTests(unittest.TestCase):
    def test_replaces_only_generated_section(self):
        original = f"# Before\n\n{START}\nold\n{END}\n\n# After\n"
        generated = f"{START}\nnew\n{END}"
        result = replace_generated_section(original, generated)
        self.assertTrue(result.startswith("# Before"))
        self.assertTrue(result.rstrip().endswith("# After"))
        self.assertIn("new", result)
        self.assertNotIn("\nold\n", result)

    def test_rejects_broken_markers(self):
        with self.assertRaisesRegex(ValueError, "标记"):
            replace_generated_section(f"{START}\nwithout end", f"{START}\nnew\n{END}")

    def test_markdown_text_is_single_line_and_escaped(self):
        self.assertEqual("a \\| b", clean_text("a\n| b"))


if __name__ == "__main__":
    unittest.main()
