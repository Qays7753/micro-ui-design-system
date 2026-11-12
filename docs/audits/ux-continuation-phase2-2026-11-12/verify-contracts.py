#!/usr/bin/env python3
"""Stage-2 documentation integrity only. No browser, service or UI execution."""
from pathlib import Path
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def code_without_comments(source):
    token = re.compile(r'//[^\n]*|/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\x27(?:\\.|[^\x27\\])*\x27|`(?:\\.|[^`\\])*`')
    return token.sub(lambda m: re.sub(r'[^\n]', ' ', m.group())
                     if m.group().startswith(('//', '/*')) else m.group(), source)


def object_members(source, marker):
    """Read top-level identifier keys; skip strings/comments and nested objects."""
    source = code_without_comments(source)
    start = source.index(marker)
    start = source.index('{', start)
    token = re.compile(r'//[^\n]*|/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\x27(?:\\.|[^\x27\\])*\x27|`(?:\\.|[^`\\])*`|[A-Za-z_$][\w$]*|[{}:]')
    depth, members = 0, []
    for match in token.finditer(source, start):
        value = match.group()
        if value.startswith(('//', '/*', '"', "'", '`')):
            continue
        if value == '{':
            depth += 1
        elif value == '}':
            depth -= 1
            if depth == 0:
                return members
        elif depth == 1 and re.fullmatch(r'[A-Za-z_$][\w$]*', value):
            if re.match(r'\s*:', source[match.end():]):
                members.append(value)
    raise ValueError('unterminated export object')


def main():
    inventory = json.loads((HERE / 'contracts.json').read_text())
    catalog = json.loads((ROOT / 'docs/COMPONENT-CATALOG.json').read_text())
    current = (ROOT / 'docs/COMPONENT-API-CONTRACTS.md').read_text()
    proposed = (ROOT / 'docs/COMPOSITION-CONTRACTS.md').read_text()
    checks = []

    def check(name, condition):
        checks.append({'name': name, 'passed': bool(condition)})

    check('14 families exactly match catalog in order',
          [f['id'] for f in inventory['families']] == [f['id'] for f in catalog['families']] and len(inventory['families']) == 14)
    check('6 variants exactly match catalog', inventory['variants'] == [
        {k: v[k] for k in ['id', 'family', 'maturity', 'optIn', 'source']} for v in catalog['variants']] and len(inventory['variants']) == 6)
    check('all 14 current contract sections present', len(re.findall(r'^## \d+\. ', current, re.M)) == 14)
    check('catalog bytes and maturity unchanged', hashlib.sha256((ROOT / 'docs/COMPONENT-CATALOG.json').read_bytes()).hexdigest() == inventory['catalogSha256'])
    check('all 379 implementation/source files unchanged', len(inventory['sourceSha256']) == 379 and all(
        (ROOT / name).is_file() and hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest
        for name, digest in inventory['sourceSha256'].items()))
    check('all specification and preview paths resolve', all((ROOT / f[key]).is_file()
        for f in inventory['families'] for key in ['specification', 'preview']))
    event_pattern = re.compile(r"(?:new\s+(?:CustomEvent|Event)\(|emit\()\s*'((?:micro-|order-schedule:)[^']+)'")
    api_count, event_count = 0, 0
    for family in inventory['families']:
        actual_events = []
        for api in family['api']:
            source = (ROOT / api['source']).read_text()
            marker = 'window.' + api['global'] + ' = '
            check(api['global'] + ' exact exported methods', object_members(source, marker) == api['methods'])
            check(api['global'] + ' export anchor resolves', marker in code_without_comments(source).splitlines()[api['exportLine'] - 1])
            api_count += 1
            actual_events.extend((m.group(1), api['source'], source[:m.start()].count('\n') + 1)
                for m in event_pattern.finditer(source))
        expected_events = [(e['name'], e['source'], e['line']) for e in family['events']]
        check(family['id'] + ' complete event source anchors', actual_events == expected_events)
        event_count += len(actual_events)
        if 'instanceMembers' in family:
            source = (ROOT / 'components/order-schedule/order-schedule.js').read_text()
            check('Order Schedule exact instance members', object_members(source, 'return {\n      root: root,') == family['instanceMembers'])
    check('all 16 globals covered', api_count == 16)
    check('all 30 event occurrences covered', event_count == 30)
    check('all 6 variants documented explicitly', all('|' + v['id'] + '|' in current.replace(' ', '') for v in inventory['variants']))
    check('three composition contracts marked unimplemented', 'PROPOSED CONTRACTS / NOT IMPLEMENTED' in proposed and
          [x['id'] for x in inventory['compositions']] == ['C01', 'C02', 'C03'] and all('## ' + x['id'] in proposed for x in inventory['compositions']))
    check('three conditional decisions resolve to separate sections', all('## ' + d['id'] in proposed for d in inventory['decisions']))
    navigation = (ROOT / 'components/navigation/navigation.js').read_text()
    check('close request proposal is not accidentally implemented', 'micro-navigation:close-request' not in navigation and 'requestClose' not in object_members(navigation, 'window.MicroNavigation = '))
    result = {'stage': 2, 'startCommit': inventory['startCommit'], 'passed': sum(x['passed'] for x in checks),
              'failed': sum(not x['passed'] for x in checks), 'checks': checks,
              'scope': 'documentation integrity and source identity only; no UI runtime or visual acceptance'}
    (HERE / 'contract-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f"{result['passed']}/{len(checks)} contract checks PASS; {result['failed']} FAIL")
    for item in checks:
        if not item['passed']:
            print('FAIL:', item['name'])
    return 1 if result['failed'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
