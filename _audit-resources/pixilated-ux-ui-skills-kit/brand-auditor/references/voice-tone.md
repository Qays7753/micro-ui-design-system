# Voice and tone, and the UX Writer hand-off

**Voice** is who the brand is (stable). **Tone** is how it sounds in a moment (it shifts by context:
calm in errors, warm in success, exact in billing).

## Scoring the copy
For each string in `strings.json`, rate 1 to 5 on NN/g's four tone dimensions:
| Dimension | 1 | 5 |
|---|---|---|
| Humour | funny | serious |
| Formality | casual | formal |
| Respect | irreverent | respectful |
| Enthusiasm | enthusiastic | matter-of-fact |
Compare with the profile's targets (`voice.nng`). A string is **off-voice** when any dimension is 2+
points away, when it uses an `avoid` word, when it misses a pillar it should carry (for example
billing copy that isn't "exact about money and time"), or when the same thing is named two ways.
Also check: consistency of terms (one name per concept), sentence case, numbers as digits, no dashes.

## Voice Brief (send this to the UX Writer)
```
VOICE BRIEF: <brand> · <screen>
Pillars: <3 pillars>
Target tone: humour <x>/5 · formality <x>/5 · respect <x>/5 · enthusiasm <x>/5
Say: <words> | Avoid: <words>
Context tones: errors <calm, exact> · success <warm, short> · billing <exact> · empty states <helpful>
Off-voice strings (id · current · problem):
  s12 · "Elevate your coffee journey!" · avoid-words, enthusiastic 1/5 vs 4/5
Constraints: keep meaning and severity of semantic messages; keep prices, dates, legal text exact;
no dashes; sentence case; ≤ current length unless clarity needs more; Arabic later (+40% budget).
Return: id · rewrite (standard) · short version · reason, as a table.
```

## Talking to the UX Writer
1. Spawn it: Agent tool, `subagent_type: "ux-writer"`, prompt = the brief + strings file path.
   If agents aren't available, load the `ux-writer-agent` skill and do its EXECUTE mode yourself,
   labelled as the UX Writer's output.
2. Check every rewrite against the brief. Send one round of notes for the misses (quote the id and
   the rule). Accept the second version unless it breaks a rule.
3. Apply in the source. Keep the exchange in the report:
   `brief (n strings) → rewrites (n) → notes (k) → applied (n)`.
4. Hand the final strings to Design Systems as a string table if the product has one
   (`[product].[screen].[component].[state]`).
