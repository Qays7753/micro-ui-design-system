---
name: Delivery approval
description: Owner's standing boundary for cumulative UI branch delivery and cleanup
---

Repairs may be committed and uploaded to the designated cumulative delivery branch, but merge, PR closure, branch deletion, and default-branch changes require a separate explicit owner approval. Never independently merge ancestors already included in the cumulative delivery.

**Why:** The owner requires preservation of history and one reviewable delivery, without automatic or duplicate merging.

**How to apply:** Deliver evidence and a review report first; prepare the cleanup sequence without executing it, and wait for explicit owner approval.