import os, pathlib, yaml
from textwrap import dedent
from datetime import datetime, timezone
from openai import OpenAI

ROOT = pathlib.Path(__file__).resolve().parents[1]
ART = ROOT / "artifacts"; ART.mkdir(exist_ok=True)

def main():
    roles = yaml.safe_load((ROOT / "agents" / "roles.yaml").read_text(encoding="utf-8"))
    req_path = ROOT / "input" / "build_request.md"
    if not req_path.exists():
        req_path.parent.mkdir(parents=True, exist_ok=True)
        req_path.write_text("Describe what to build here.", encoding="utf-8")
    request = req_path.read_text(encoding="utf-8")

    prompt = dedent(f"""
    You are a senior product/tech lead.
    Use the goal and constraints below to write a complete RFC/spec for engineers and QA.

    GOAL:
    {roles['spec']['goal']}

    CONSTRAINTS:
    {roles['spec']['constraints']}

    BUILD REQUEST (from user):
    ---
    {request}
    ---

    Produce clear Markdown with headings and bullet points where helpful.
    Avoid filler language. Keep it implementable in 1–2 sprints unless the request demands more.
    """)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY not set. Set it locally in this session or in GitHub Secrets for CI.")

    client = OpenAI(api_key=api_key)
    # Use any capable GPT model name you have access to (e.g., "gpt-4.1")
    resp = client.responses.create(model="gpt-4.1", input=prompt)
    text = resp.output_text

    out = ART / "spec.md"
    out.write_text(text, encoding="utf-8")
    ts = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    (ART / "spec.timestamp.txt").write_text(ts, encoding="utf-8")
    print(f"Wrote {out}")

if __name__ == "__main__":
    main()
