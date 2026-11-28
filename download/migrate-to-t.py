"""Migrate B-domain components off direct `ar` imports to t()/getMoneyTexts().

3ج.1 (agent-1): texts flow ONLY through t()/getMoneyTexts() so host-app
overrideTexts() reaches every component. My 26 B-domain files still read
`ar['key'].text` — this rewrites every such read to `t('key')` (with
params where a .replace('{p}', …) follows), fixes imports, and reports
anything it could not convert.
"""
import pathlib
import re

ROOT = pathlib.Path('ds/src/components')
FILES = [
    'AgendaList/AgendaList.tsx', 'ContactBar/ContactBar.tsx', 'DayTimeline/DayTimeline.tsx',
    'DebtCard/DebtCard.tsx', 'DebtSummary/DebtSummary.tsx',
    'DeliveryRequestCard/DeliveryRequestCard.tsx', 'DriverApprovalStatus/DriverApprovalStatus.tsx',
    'DriverJobCard/DriverJobCard.tsx', 'EvidenceSlot/EvidenceSlot.tsx', 'FundCard/FundCard.tsx',
    'Gallery/Gallery.tsx', 'IssueProposalCard/IssueProposalCard.tsx', 'ListingCard/ListingCard.tsx',
    'ListingEditor/ListingEditor.tsx', 'ListingStatusBadge/ListingStatusBadge.tsx',
    'LocationSlot/LocationSlot.tsx', 'MovementRow/MovementRow.tsx', 'OrderCard/OrderCard.tsx',
    'PriceTierTable/PriceTierTable.tsx', 'QuoteCard/QuoteCard.tsx', 'ReportSheet/ReportSheet.tsx',
    'SlotPicker/SlotPicker.tsx', 'StatusTrack/StatusTrack.tsx', 'SupplierHeader/SupplierHeader.tsx',
    'TransferRow/TransferRow.tsx', 'WeekStrip/WeekStrip.tsx',
]

# ar['k'].text.replace('{p}', EXPR)  ->  t('k', { p: EXPR })
RE_REPLACE = re.compile(
    r"ar\['([A-Za-z0-9_.]+)'\]\.text\.replace\('\{(\w+)\}',\s*([^)]+)\)")
# plain ar['k'].text  ->  t('k')
RE_PLAIN = re.compile(r"ar\['([A-Za-z0-9_.]+)'\]\.text")
# typing uses: keep the WORD map pattern but read through t()

def migrate(rel: str) -> tuple[int, list[str]]:
    p = ROOT / rel
    s = p.read_text()
    problems = []
    n = 0

    def sub_replace(m):
        nonlocal n
        n += 1
        return f"t('{m.group(1)}', {{ {m.group(2)}: {m.group(3).strip()} }})"

    s2 = RE_REPLACE.sub(sub_replace, s)

    def sub_plain(m):
        nonlocal n
        n += 1
        return f"t('{m.group(1)}')"

    s2 = RE_PLAIN.sub(sub_plain, s2)

    # import line: drop ar, ensure t (and getMoneyTexts if it was used)
    if re.search(r"\bt\(", s2):
        has_gmt = 'getMoneyTexts' in s2
        def fix_import(m):
            names = [x.strip() for x in m.group(1).split(',') if x.strip()]
            names = [x for x in names if x != 'ar']
            if 't' not in names:
                names.append('t')
            if has_gmt and 'getMoneyTexts' not in names:
                names.append('getMoneyTexts')
            names = sorted(set(names), key=lambda x: (x != 't', x))
            return "import { " + ', '.join(names) + " } from '../../i18n/ar';"
        s2 = re.sub(r"import \{([^}]*)\} from '\.\./\.\./i18n/ar';", fix_import, s2, count=1)

    # leftovers that still reference ar (WORD maps etc.)
    if re.search(r"\bar\[", s2):
        problems.append(rel)
    p.write_text(s2)
    return n, problems

total = 0
leftover = []
for rel in FILES:
    n, probs = migrate(rel)
    total += n
    leftover += probs
print(f'migrated {total} reads across {len(FILES)} files')
print('files still referencing ar:', leftover if leftover else 'none')
