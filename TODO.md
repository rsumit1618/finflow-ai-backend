# TODO (FinFlow AI backend improvements)

- [x] Create interview + FAQ docs in `docs/`
- [ ] Fix Redis readiness issue so rate limiter uses Redis reliably (avoid permanent MemoryStore fallback at startup)
- [ ] Improve rate-limit key extraction for proxied requests (optional but recommended)
- [ ] Test locally (start Redis + start server, confirm rate-limit behavior)

