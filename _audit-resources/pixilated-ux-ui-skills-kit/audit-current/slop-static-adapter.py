"""Bound each unchanged scanner invocation; retain timeouts as limitations."""
import json
import subprocess
import tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).parent
scanner=ROOT/"_audit-resources/pixilated-ux-ui-skills-kit/anti-ai-slop/scripts/slop_scan.py"
paths=[p for d in ("components","shared","previews") for p in (ROOT/d).rglob("*") if p.is_file() and p.suffix in {".js",".css",".html"}]
results={"adapter":"Original scanner invoked per file with 3-second CPU/wall guard after whole-folder invocation timed out; raw signals require human triage.","files":[],"findings":[]}
with tempfile.TemporaryDirectory() as tmp:
 for p in paths:
  target=Path(tmp)/"result.json"
  try:
   r=subprocess.run(["python3",str(scanner),str(p),"--json",str(target)],timeout=3,capture_output=True,text=True)
   data=json.loads(target.read_text()) if target.exists() else {}
   results["files"].append({"path":str(p.relative_to(ROOT)),"exit":r.returncode,"findings":len(data.get("findings",[]))})
   for f in data.get("findings",[]):f["file"]=str(Path(f["file"]).relative_to(ROOT))
   results["findings"]+=data.get("findings",[])
   if target.exists():target.unlink()
  except subprocess.TimeoutExpired:
   results["files"].append({"path":str(p.relative_to(ROOT)),"status":"TIMEOUT","seconds":3})
results["counts"]={s:sum(f["sev"]==s for f in results["findings"]) for s in ["P0","P1","P2"]}
(OUT/"slop-static-bounded.json").write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps({"files":len(paths),"timeouts":[f for f in results["files"] if f.get("status")=="TIMEOUT"],"raw_counts":results["counts"]},ensure_ascii=False))
