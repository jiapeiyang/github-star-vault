import base64
import hashlib
import io
import json
import unittest
import urllib.error
import test_curation  # 配置仓库脚本的导入路径
from report_guide_changes import fetch_blob, render_diff


class GuideReportTests(unittest.TestCase):
    repo = {"repo_id": 101, "full_name": "example/tool", "url": "https://github.com/example/tool"}
    metadata = {"sources": ["https://github.com/example/tool/blob/main/README.md"]}
    check = {"source_url": metadata["sources"][0], "observed_sha": "b" * 40, "checked_at": "2026-10-13T00:00:00Z"}

    def test_blob_integrity_and_failure(self):
        raw = b"README\n"
        sha = hashlib.sha1(b"blob 7\0" + raw).hexdigest()
        data = {"sha": sha, "encoding": "base64", "content": base64.b64encode(raw).decode()}
        opener = lambda *a, **kw: io.StringIO(json.dumps(data))
        self.assertEqual(fetch_blob(self.repo, sha, opener), "README\n")
        with self.assertRaises(ValueError):
            fetch_blob(self.repo, "a" * 40, opener)

    def test_report_escapes_upstream_fences_and_does_not_mutate_checks(self):
        old = {**self.check}
        report = render_diff(self.repo, self.metadata, self.check, "a" * 40, lambda repo, sha: "old\n" if sha == "a" * 40 else "```\n# untrusted\n```\n")
        self.assertIn("````diff", report)
        self.assertIn("+```", report)
        self.assertEqual(self.check, old)

    def test_unavailable_missing_and_stale_sources_never_claim_reviewed(self):
        def no_fetch(*args):
            self.fail("没有可比较版本时不应请求网络")
        for metadata, check, baseline, text in [
            (self.metadata, None, None, "缺少已读基线"),
            ({"sources": ["https://example.test/new"]}, self.check, "a" * 40, "来源已经改变"),
            (self.metadata, {**self.check, "observed_sha": None, "reason": "HTTP 404"}, "a" * 40, "HTTP 404"),
            (self.metadata, self.check, "b" * 40, "版本相同"),
        ]:
            self.assertIn(text, render_diff(self.repo, metadata, check, baseline, no_fetch))
        def unavailable(*args):
            raise urllib.error.HTTPError("https://api.github.com", 404, "Not Found", {}, None)
        self.assertIn("保留原核查状态", render_diff(self.repo, self.metadata, self.check, "a" * 40, unavailable))
