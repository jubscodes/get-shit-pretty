"""
GSP Token Proxy — mitmproxy addon that logs Claude API token usage.

Usage:
  mitmproxy -s dev/scripts/token-proxy.py --set stream_large_bodies=0
  Then: HTTPS_PROXY=http://localhost:8080 claude

Logs to: dev/reports/token-log-{timestamp}.jsonl
"""

import json
import time
from datetime import datetime, timezone
from pathlib import Path

from mitmproxy import http


class TokenLogger:
    def __init__(self):
        self.start_time = time.monotonic()
        self.call_count = 0
        self.total_input = 0
        self.total_output = 0
        self.total_cache_creation = 0
        self.total_cache_read = 0
        self.peak_input = 0
        self.peak_call_num = 0

        reports_dir = Path(__file__).parent.parent / "reports"
        reports_dir.mkdir(exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d-%H%M%S")
        self.log_path = reports_dir / f"token-log-{ts}.jsonl"
        self.log_file = open(self.log_path, "a")

        print(f"\n  GSP Token Proxy active")
        print(f"  logging to: {self.log_path}")
        print(f"  watching: api.anthropic.com/v1/messages\n")

    def response(self, flow: http.HTTPFlow):
        if "api.anthropic.com" not in (flow.request.host or ""):
            return
        if "/v1/messages" not in flow.request.path:
            return

        content = flow.response.get_text() if flow.response else ""
        if not content:
            return

        usage = None
        model = None
        stop_reason = None

        if "event:" in content:
            for line in content.split("\n"):
                if line.startswith("data: "):
                    try:
                        data = json.loads(line[6:])
                        if "usage" in data:
                            usage = data["usage"]
                        if "model" in data:
                            model = data["model"]
                        if "delta" in data and "stop_reason" in data["delta"]:
                            stop_reason = data["delta"]["stop_reason"]
                    except json.JSONDecodeError:
                        continue
        else:
            try:
                data = json.loads(content)
                usage = data.get("usage")
                model = data.get("model")
                stop_reason = data.get("stop_reason")
            except json.JSONDecodeError:
                return

        if not usage:
            return

        self.call_count += 1
        input_tokens = usage.get("input_tokens", 0)
        output_tokens = usage.get("output_tokens", 0)
        cache_creation = usage.get("cache_creation_input_tokens", 0)
        cache_read = usage.get("cache_read_input_tokens", 0)

        self.total_input += input_tokens
        self.total_output += output_tokens
        self.total_cache_creation += cache_creation
        self.total_cache_read += cache_read

        if input_tokens > self.peak_input:
            self.peak_input = input_tokens
            self.peak_call_num = self.call_count

        entry = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "call": self.call_count,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cache_creation": cache_creation,
            "cache_read": cache_read,
            "model": model,
            "stop_reason": stop_reason,
        }
        self.log_file.write(json.dumps(entry) + "\n")
        self.log_file.flush()

        cache_pct = (
            f"{cache_read / input_tokens * 100:.0f}% cached"
            if input_tokens > 0
            else "n/a"
        )
        print(
            f"  #{self.call_count:3d}  in:{input_tokens:>8,}  out:{output_tokens:>6,}  {cache_pct}"
        )

    def done(self):
        elapsed = time.monotonic() - self.start_time
        mins = int(elapsed // 60)
        secs = int(elapsed % 60)

        cache_rate = (
            f"{self.total_cache_read / self.total_input * 100:.0f}%"
            if self.total_input > 0
            else "n/a"
        )

        avg_in = self.total_input // self.call_count if self.call_count > 0 else 0
        avg_out = self.total_output // self.call_count if self.call_count > 0 else 0

        print(f"\n  ── Token Proxy Report ─────────────────────────")
        print(f"  duration       {mins}m {secs}s")
        print(f"  api calls      {self.call_count}")
        print(f"  total input    {self.total_input:,} tokens")
        print(f"  total output   {self.total_output:,} tokens")
        print(f"  cache hits     {self.total_cache_read:,} tokens ({cache_rate} cache rate)")
        print(f"  cache misses   {self.total_cache_creation:,} tokens")
        print(f"  avg per call   {avg_in:,} input / {avg_out:,} output")
        print(f"  peak call      {self.peak_input:,} input (call #{self.peak_call_num})")
        print(f"  log file       {self.log_path}")
        print()

        self.log_file.close()


addons = [TokenLogger()]
