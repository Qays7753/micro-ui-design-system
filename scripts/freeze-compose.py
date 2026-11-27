"""Freeze the delivery compose view swap (both wings stacked)."""
import pathlib

p = pathlib.Path('ds/lab/src/domains/delivery.tsx')
s = p.read_text()

old = """function DeliveryCompose() {
  const [view, setView] = useState<'requests' | 'driver'>('requests');
  return ("""
new = """function DeliveryCompose() {
  // Frozen: the states gate presses every control — a real view swap would
  // unmount half the specimens mid-scan. Both wings render stacked; the
  // segmented control stays interactive-looking but inert here.
  const [view] = useState<'requests' | 'driver'>('requests');
  return ("""
assert old in s, 'compose head not found'
s = s.replace(old, new)

old2 = """      {view === 'requests' ? (
        <>
          <Section label={t('title.needsYou')} caption={1}>"""
new2 = """      {view === 'requests' && (
        <>
          <Section label={t('title.needsYou')} caption={1}>"""
assert old2 in s, 'requests wing not found'
s = s.replace(old2, new2)

old3 = """          {/* Disclosure «السجل»: مكوّن مرحلة 2 غير مرفوع بعد — يُكمَّل بعد الدمج */}
        </>
      ) : (
        <>
          <DriverApprovalStatus tone="waiting" />
          <DriverJobCard
            label="الزرقاء، حي معصوم"
            origin="طبربور"
            destination="الزرقاء، حي معصوم"
            owner="ورشة الياسمين للخياطة"
            phone={PHONE}
            items={STAGES}
            value={1}
            stage="active"
            action={<Button variant="primary">{ar['job.slideDelivered'].text}</Button>}
          />
        </>
      )}"""
new3 = """          {/* Disclosure «السجل»: مكوّن مرحلة 2 غير مرفوع بعد — يُكمَّل بعد الدمج */}
        </>
      )}
      <Section label={ar['delivery.driverView'].text}>
        <DriverApprovalStatus tone="waiting" />
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone={PHONE}
          items={STAGES}
          value={1}
          stage="active"
          action={<Button variant="primary">{ar['job.slideDelivered'].text}</Button>}
        />
      </Section>"""
assert old3 in s, 'driver wing not found'
s = s.replace(old3, new3)

p.write_text(s)
print('compose frozen: both wings stacked')
