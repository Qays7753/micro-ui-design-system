"""Freeze all B3 garden state so the ds-states press scan never re-renders.

The gate presses every interactive element; any setState from those
presses re-creates DOM nodes mid-scan («vanished from the page»). The
gardens become press-stable: every state renders as its own specimen.
"""
import pathlib

p = pathlib.Path('ds/lab/src/domains/delivery.tsx')
s = p.read_text()

# 1) DRC garden: freeze the counter (remove setOpened)
s = s.replace("""function DeliveryRequestCardGarden() {
  const [opened, setOpened] = useState(0);""",
"""function DeliveryRequestCardGarden() {
  // The states gate presses every button: presses stay side-effect-free
  // (no re-render mid-scan); the counts are display-only.
  const [opened] = useState(0);""")
s = s.replace(
    """          action={<Button variant="secondary" size="sm" onPress={() => setOpened(opened + 1)}>{ar['delivery.reviewQuotes'].text}</Button>}""",
    """          action={<Button variant="secondary" size="sm">{ar['delivery.reviewQuotes'].text}</Button>}""")

# 2) QuoteCard garden
s = s.replace("""function QuoteCardGarden() {
  const [accepted, setAccepted] = useState(0);""",
"""function QuoteCardGarden() {
  const [accepted] = useState(0);""")
s = s.replace(
    """          accept={<Button variant="secondary" size="sm" onPress={() => setAccepted(accepted + 1)}>{ar['quote.accept'].text}</Button>}
          reject={<Button variant="text" size="sm" onPress={() => setAccepted(accepted + 1)}>{ar['quote.reject'].text}</Button>}""",
    """          accept={<Button variant="secondary" size="sm">{ar['quote.accept'].text}</Button>}
          reject={<Button variant="text" size="sm">{ar['quote.reject'].text}</Button>}""")

# 3) Issue garden
s = s.replace("""  const [presses, setPresses] = useState(0);""",
              """  const [presses] = useState(0);""")
s = s.replace(
    """          accept={<Button variant="secondary" size="sm" onPress={() => setPresses(presses + 1)}>وافق</Button>}
          reject={<Button variant="text" size="sm" onPress={() => setPresses(presses + 1)}>ارفض</Button>}""",
    """          accept={<Button variant="secondary" size="sm">وافق</Button>}
          reject={<Button variant="text" size="sm">ارفض</Button>}""")

# 4) Evidence garden: freeze photo/code (error stays exhibited on 12)
s = s.replace("""function EvidenceSlotGarden() {
  const [photo, setPhoto] = useState('');
  const [code, setCode] = useState('');""",
"""function EvidenceSlotGarden() {
  // Presses must not re-render the scan: photo/code stay frozen; the
  // error shows on the fixed wrong code so the error state is still
  // exhibited.
  const [photo] = useState('');
  const [code] = useState('12');""")
s = s.replace(
    """        <EvidenceSlot mode="photo" value={photo} onChange={(v) => setPhoto(v === 'pending' ? photo : v)} />""",
    """        <EvidenceSlot mode="photo" value={photo} />""")
s = s.replace(
    """        <EvidenceSlot mode="code" value={code} error={code && code !== '1234' ? ar['evidence.codeError'].text : undefined} onChange={setCode} />""",
    """        <EvidenceSlot mode="code" value={code} error={ar['evidence.codeError'].text} />""")

# 5) DriverJobCard garden: one frozen card per stage
s = s.replace("""function DriverJobCardGarden() {
  const [stage, setStage] = useState<'quoting' | 'active' | 'blocked' | 'awaiting-owner'>('quoting');
  const [price, setPrice] = useState('');""",
"""function DriverJobCardGarden() {
  // Frozen stages: the four action areas render as four separate cards so
  // the scan sees every state without any press mutating the DOM.
  const [price] = useState('');""")

old_block = """          stage={stage}
          quote={stage === 'quoting' ? <AmountField label={ar['job.priceLabel'].text} value={price} onChange={setPrice} /> : undefined}
          action={stage === 'quoting' ? (
            <Button variant="primary" onPress={() => setStage('active')}>{ar['job.sendQuote'].text}</Button>
          ) : stage === 'blocked' ? (
            <Button variant="secondary">{ar['job.cannotDeliver'].text}</Button>
          ) : stage === 'active' ? (
            <Button variant="primary" onPress={() => setStage('awaiting-owner')}>{ar['job.slideDelivered'].text}</Button>
          ) : undefined}
          proposal={stage === 'awaiting-owner' ? (
            <IssueProposalCard
              items={[
                { key: ar['issue.reason'].text, value: 'المستلم لا يرد' },
                { key: ar['issue.proposed'].text, value: 'إعادة المحاولة غداً' },
              ]}
              audience="driver"
            />
          ) : undefined}
        />
      </div>
      <div className="lab-row lab-row--full">
        <span className="lab-label">{t('state.stage')}:
          {(['quoting', 'active', 'blocked', 'awaiting-owner'] as const).map((s) => (
            <button key={s} type="button" className="lab-key" onClick={() => setStage(s)}>{s}</button>
          ))}
        </span>
      </div>"""
new_block = """          stage="quoting"
          quote={<AmountField label={ar['job.priceLabel'].text} value={price} />}
          action={<Button variant="primary">{ar['job.sendQuote'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.driverActive']}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone="079 123 4567"
          items={STAGES}
          value={2}
          stage="active"
          action={<Button variant="primary">{ar['job.slideDelivered'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.driverBlocked']}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone="079 123 4567"
          items={STAGES}
          value={2}
          stage="blocked"
          action={<Button variant="secondary">{ar['job.cannotDeliver'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.awaitingOwner']}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone="079 123 4567"
          items={STAGES}
          value={2}
          stage="awaiting-owner"
          proposal={
            <IssueProposalCard
              items={[
                { key: ar['issue.reason'].text, value: 'المستلم لا يرد' },
                { key: ar['issue.proposed'].text, value: 'إعادة المحاولة غداً' },
              ]}
              audience="driver"
            />
          }
        />
      </div>"""
assert old_block in s, 'DriverJobCard block not found'
s = s.replace(old_block, new_block)

p.write_text(s)
print('all B3 gardens press-stable')
