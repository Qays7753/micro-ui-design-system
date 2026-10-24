# Jobs to be Done: the main job and its moment

People don't use a screen; they hire it to make progress in a situation. Find that job and the
moment it happens before judging anything, then judge everything by it.

## 1 · The Main Job card (write this first, every time)
```
MAIN JOB (job story)
When <situation: the trigger and context, specific>,
I want to <the progress / motivation, verb + object>,
so I can <the outcome they care about>.

THE MOMENT (when they want to do it)
Trigger:        <the event that starts the job: a notification, a date, a problem, a habit>
When / how often:<time of day, day of week, frequency, deadline>
Where / device:  <desk, on the move, store floor; laptop, phone, kiosk>
State of mind:   <rushed, anxious, bored, focused; one hand free?>
Just before:     <what they were doing>   Just after: <what they do next with the result>
Time budget:     <seconds / minutes they will give it>

JOB DIMENSIONS
Functional: <the task>   Emotional: <how they want to feel>   Social: <how they want to be seen>

SUCCESS = DESIRED OUTCOMES (Ulwick outcome statements)
- Minimise the time it takes to <…>
- Minimise the likelihood of <mistake / missing something>
- Increase the confidence that <…>

FORCES OF PROGRESS (Moesta)
Push (pain of today): <…>     Pull (appeal of the new way): <…>
Anxiety (fear of the new): <…> Habit (comfort of the old): <…>

CURRENT SOLUTION / WORKAROUNDS: <spreadsheet, WhatsApp, calling support, doing nothing>
RELATED JOBS (smaller, in priority order): <job 2>, <job 3>, <job 4>
Evidence: <interviews / analytics / tickets / assumption>   Confidence: <High / Medium / Low>
```
Rules:
- One **main** job per screen or flow. Others are related jobs, ranked.
- The situation is specific ("When it's Saturday night before the Sunday roast"), never a persona
  attribute ("As a 34-year-old manager").
- No solution words in the job ("I want to click the Retry button" is a task; "I want every box to
  ship paid" is the job).
- If there is no evidence, write the card as a hypothesis, mark Confidence Low, and list the
  research that would confirm it (switch interviews, analytics, tickets). Never present an assumed
  job as a finding.

## 2 · The job map (Ulwick and Bettencourt, 8 steps)
Walk the main job through: **Define → Locate → Prepare → Confirm → Execute → Monitor → Modify →
Conclude.** For each step note what the user needs, where the product supports it, and where it
fails. Most UI problems sit in Locate (finding what's needed), Confirm (knowing it's right before
acting) and Monitor (knowing it worked).

## 3 · Moment tests (apply to any screen)
1. **Arrival test:** when the user arrives at the moment the trigger fires, does the first view
   answer the main job without scrolling or clicking? (3-second test)
2. **Time-budget test:** can the job finish inside the time budget on the device of the moment?
   (A 20-second job on a phone in one hand can't need a desktop table.)
3. **State-of-mind test:** does the tone, density and safety match how they feel? (Anxious about
   money → exact amounts, dates, undo; rushed → defaults, one action.)
4. **Next-step test:** does the screen hand the result to what they do just after (share, print,
   schedule, notify)?
5. **Forces test:** does the design reduce anxiety and habit for switchers (preview, undo, import,
   familiar patterns), not only add pull?

## 4 · Prioritising findings by the job
Every finding gets a **Job impact**:
| Job impact | Meaning | Severity effect |
|---|---|---|
| Blocks main job | the main job can't be done at the moment | raise to at least 3 |
| Slows main job | extra steps, search, doubt, rework on the main job | raise by 1 (max 4) |
| Related job | affects a ranked related job | keep |
| Off-job | affects something nobody hired the screen for | lower by 1; often a removal candidate |
Order the findings table by Job impact first, then severity. Recommendations start with what
helps the main job at its moment.

## 5 · Methods that find the job
- **Switch interview** (Moesta and Spiek): reconstruct the timeline of the last time someone switched
  to / from a solution: first thought, passive looking, active looking, deciding, first use. Gives the
  real trigger and the four forces. 4 to 10 interviews per job.
- **Timeline / "last time" interviews:** "Tell me about the last time you…", never "would you…".
- **Analytics for the moment:** time of day and day of week of the key action, device split,
  entry points (the trigger), time on task.
- **Support tickets and search logs:** the words people use when the job fails.
- **Outcome survey** (ODI): rate importance and satisfaction of each outcome statement; the
  under-served outcomes (high importance, low satisfaction) are the opportunities.

## 6 · MENA moments worth checking
Friday/Saturday weekends in KSA and UAE; prayer times breaking sessions; Ramadan shifts (late-night
peaks, iftar and suhoor); salary-day spikes (often around the 25th to 27th in KSA); WhatsApp as the
place the job often starts or ends; government services done on mobile between other tasks.

## 7 · Handing the job on
Put the Main Job card at the top of every deliverable and pass it to the next agents: Interaction
Designer (flows built around the moment), UI Designer (first view answers the job), UX Writer
(tone for the state of mind), Design Systems (components for the job's key step), and the UX/UI
Manager reviews (they check the build against the card).
