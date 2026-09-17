import time
import threading
from typing import Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor

class JobStore:
    def __init__(self, max_workers: int = 4, ttl_seconds: int = 3600):
        self._jobs: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._executor = ThreadPoolExecutor(max_workers=max_workers)
        self.ttl_seconds = ttl_seconds

    def create_job(self, job_id: str, tool: str, file_name: str) -> Dict[str, Any]:
        with self._lock:
            self._cleanup_expired()
            job = {
                "job_id": job_id,
                "tool": tool,
                "file_name": file_name,
                "status": "pending",
                "progress": 0,
                "result": None,
                "error": None,
                "created_at": time.time(),
                "updated_at": time.time(),
            }
            self._jobs[job_id] = job
            return job

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._jobs.get(job_id)

    def update_progress(self, job_id: str, progress: int, status: str = "processing"):
        with self._lock:
            if job_id in self._jobs:
                self._jobs[job_id]["progress"] = progress
                self._jobs[job_id]["status"] = status
                self._jobs[job_id]["updated_at"] = time.time()

    def set_completed(self, job_id: str, result: Dict[str, Any]):
        with self._lock:
            if job_id in self._jobs:
                self._jobs[job_id]["status"] = "completed"
                self._jobs[job_id]["progress"] = 100
                self._jobs[job_id]["result"] = result
                self._jobs[job_id]["updated_at"] = time.time()

    def set_failed(self, job_id: str, error_message: str):
        with self._lock:
            if job_id in self._jobs:
                self._jobs[job_id]["status"] = "failed"
                self._jobs[job_id]["error"] = error_message
                self._jobs[job_id]["updated_at"] = time.time()

    def submit_task(self, fn, *args, **kwargs):
        return self._executor.submit(fn, *args, **kwargs)

    def _cleanup_expired(self):
        now = time.time()
        expired_ids = [
            jid for jid, job in self._jobs.items()
            if now - job["created_at"] > self.ttl_seconds
        ]
        for jid in expired_ids:
            del self._jobs[jid]

job_store = JobStore()
