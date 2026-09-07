from __future__ import annotations
import sys,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from star_vault import ValidationError,load_curations,load_fixture_pages,reconcile_snapshot,make_catalog,stable_json

def curation(repo_id=101):
    return f'''+++
repo_id = {repo_id}
category = "ai-agent"
resource_type = "collection"
tags = ["Agent", "规范"]
summary = "用于验证资料不会被事实层覆盖。"
related = []
content_updated_at = "2026-09-05"
+++

## 仓库概览
资料正文。
'''

class CurationTests(unittest.TestCase):
    def snapshot(self):
        fetched=load_fixture_pages(ROOT/'tests/fixtures/github/stable')
        return reconcile_snapshot(None,fetched.items,username='jiapeiyang',api_version='2022-11-28',checked_at='2026-09-05T10:00:00Z',pages=fetched.pages)[0]
    def load(self,text,snapshot=None):
        with tempfile.TemporaryDirectory() as directory:
            (Path(directory)/'101.md').write_text(text)
            return load_curations(Path(directory),snapshot or self.snapshot(),ROOT/'config')
    def test_rename_and_missing_preserve_independent_materials(self):
        snapshot=self.snapshot();row=next(r for r in snapshot['repositories'] if r['repo_id']==101)
        row['full_name']='example/renamed';row['source_status']='missing'
        loaded=self.load(curation(),snapshot)
        item=next(r for r in make_catalog(snapshot,loaded,ROOT/'config')['repositories'] if r['repoId']==101)
        self.assertIn('资料正文',item['contentMarkdown']);self.assertEqual(item['name'],'example/renamed')
        self.assertNotIn('stage',item);self.assertNotIn('takeaway',item)
    def test_old_fields_are_rejected(self):
        with self.assertRaisesRegex(ValidationError,'旧内容字段'):
            self.load(curation().replace('related = []','related = []\nstage = "learned"'))
    def test_tags_are_limited_and_case_insensitive(self):
        for tags in ['["a","b","c","d","e","f"]','["Agent","agent"]']:
            with self.assertRaisesRegex(ValidationError,'最多 5 个且不能重复'):
                self.load(curation().replace('["Agent", "规范"]',tags))
    def test_rejects_unknown_enum(self):
        with self.assertRaisesRegex(ValidationError,'非法 category'):
            self.load(curation().replace('"ai-agent"','"invented"'))
    def test_rejects_missing_related(self):
        with self.assertRaisesRegex(ValidationError,'存在的 repo_id'):
            self.load(curation().replace('related = []','related = [999999]'))
    def test_unknown_metadata_not_published(self):
        loaded=self.load(curation().replace('related = []','related = []\ncustom_field = "not-for-catalog"'))
        catalog=make_catalog(self.snapshot(),loaded,ROOT/'config')
        self.assertNotIn('not-for-catalog',stable_json(catalog))
        self.assertIn('custom_field',next(r for r in catalog['repositories'] if r['repoId']==101)['curation']['unsupportedFields'])
    def test_review_requires_sources_sections_and_valid_date(self):
        for extra in ['reviewed_at = "2026-09-07"','reviewed_at = "2026-02-31"','sources = ["javascript:alert(1)"]']:
            with self.assertRaises(ValidationError):self.load(curation().replace('related = []',f'related = []\n{extra}'))
    def test_personal_archive_is_independent_boolean(self):
        loaded=self.load(curation().replace('related = []','related = []\npersonal_archived = true'))
        catalog=make_catalog(self.snapshot(),loaded,ROOT/'config')
        self.assertTrue(next(r for r in catalog['repositories'] if r['repoId']==101)['personalArchived'])
        with self.assertRaises(ValidationError):self.load(curation().replace('related = []','related = []\npersonal_archived = "true"'))

    def test_removed_sections_rejected_even_when_empty(self):
        for section in ["## 实践记录", "## 学习结论\n旧结论"]:
            with self.assertRaisesRegex(ValidationError, "个人记录章节"):
                self.load(curation() + "\n" + section)
