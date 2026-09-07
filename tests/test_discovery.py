"""v1.3 人工资料与来源检查的关键契约。"""
import io
import json
import tempfile
import unittest
import urllib.error
from pathlib import Path
import test_curation
from test_curation import curation, ROOT
from star_vault import ValidationError, make_catalog
from catalog_extras import load_topics, load_source_checks
from check_guide_sources import check_one


class DiscoveryTests(unittest.TestCase):
    snapshot = test_curation.CurationTests.snapshot
    load = test_curation.CurationTests.load
    def test_related_notes_and_limited_require_valid_references(self):
        for replacement in [
            'related = [101]', 'related = [103,103]',
            'related = [103]\nrelated_notes = {"101" = "不属于关联"}',
            'related = [103]\nrelated_notes = {"103" = " "}',
            'related = []\nguide_status = "limited"',
            'related = []\nreviewed_readme_sha = "invalid"',
        ]:
            with self.assertRaises(ValidationError):
                self.load(curation().replace('related = []', replacement))

    def test_upstream_code_date_does_not_mark_guide_changed(self):
        snapshot = self.snapshot()
        snapshot['repositories'][0]['pushed_at'] = '2026-09-07T00:00:00Z'
        loaded = self.load(curation(), snapshot)
        self.assertTrue(all(r['sourceCheck'] is None for r in make_catalog(snapshot, loaded, ROOT/'config')['repositories']))

    def test_changed_source_url_invalidates_report_and_reviewed_sha_resolves_it(self):
        source = 'https://github.com/example/alpha/blob/main/README.md'
        text = curation().replace('related = []', f'related = []\nsources = ["{source}"]')
        loaded = self.load(text)
        record = {'repo_id':101,'source_url':source,'baseline_sha':'a'*40,'observed_sha':'b'*40,'status':'changed','checked_at':'2026-09-07T00:00:00Z'}
        checks = {'checked_at':record['checked_at'],'items':{101:record}}
        def item(values):
            return next(r for r in make_catalog(self.snapshot(),values,ROOT/'config',source_checks=checks)['repositories'] if r['repoId']==101)
        self.assertEqual(item(loaded)['sourceCheck']['status'], 'changed')
        loaded[101]['reviewed_readme_sha'] = 'b'*40
        self.assertEqual(item(loaded)['sourceCheck']['status'], 'unchanged')
        loaded[101]['sources'] = ['https://example.test/new-doc']
        self.assertIsNone(item(loaded)['sourceCheck'])

    def test_topics_validate_ids_and_reasons(self):
        valid = {'id':'tools','title':'做工具','description':'适用场景','entries':[{'repo_id':101,'reason':'理由'}]}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)/'topics.json'
            def load(items):
                path.write_text(json.dumps({'items':items}))
                return load_topics(path,self.snapshot())
            self.assertEqual(load([valid])[0]['entries'][0]['repoId'],101)
            for values in [[valid,valid],[{**valid,'entries':[{'repo_id':99999,'reason':'理由'}]}],[{**valid,'entries':[{'repo_id':101,'reason':''}]}]]:
                with self.assertRaises(ValidationError): load(values)

    def test_source_check_success_change_and_failure(self):
        repo = {'repo_id':101,'full_name':'example/alpha'}
        for observed,expected in [('a'*40,'unchanged'),('b'*40,'changed')]:
            with self.subTest(expected=expected):
                opener = lambda *a, **kw: io.StringIO(json.dumps({'sha':observed}))
                self.assertEqual(check_one(repo,'https://example.test','a'*40,opener)['status'],expected)
        def unavailable(*args,**kwargs):
            raise urllib.error.HTTPError('https://api.github.com',403,'Forbidden',{},None)
        row = check_one(repo,'https://example.test','a'*40,unavailable)
        self.assertEqual(row['status'],'unavailable')
        self.assertIsNone(row['observed_sha'])
        self.assertEqual(row['reason'],'HTTP 403')
        malformed=lambda *a,**kw:io.StringIO('{"sha":"wrong"}')
        self.assertEqual(check_one(repo,'https://example.test','a'*40,malformed)['status'],'unavailable')

    def test_source_report_rejects_inconsistent_observed_sha(self):
        row={'repo_id':101,'source_url':'https://example.test','baseline_sha':'a'*40,'observed_sha':'a'*40,'status':'unchanged'}
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'checks.json'
            def load(record):
                path.write_text(json.dumps({'checked_at':'2026-09-07T00:00:00Z','items':[record]}))
                return load_source_checks(path,self.snapshot())
            self.assertEqual(load(row)['items'][101]['status'],'unchanged')
            for record in [{**row,'status':'changed'},{**row,'status':'unavailable'},{**row,'observed_sha':None},{**row,'repo_id':99999}]:
                with self.assertRaises(ValidationError):load(record)
