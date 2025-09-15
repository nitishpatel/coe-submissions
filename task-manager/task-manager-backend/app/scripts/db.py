# app/scripts/db.py
from __future__ import annotations

import sys
import argparse
from pathlib import Path
from typing import Optional

from alembic import command
from alembic.config import Config

from app.core.config import config as app_config


def _alembic_config(db_url: Optional[str] = None) -> Config:
    """
    Build an Alembic Config object, wiring SQLAlchemy URL from app settings,
    and pointing to your local alembic.ini & migrations directory.
    """
    root = Path(__file__).resolve().parents[2]  # project root
    ini_path = root / "alembic.ini"
    if not ini_path.exists():
        print(f"[db] alembic.ini not found at {ini_path}", file=sys.stderr)
        sys.exit(2)

    cfg = Config(str(ini_path))
    cfg.set_main_option("script_location", str(root / "migrations"))

    url = db_url or app_config.postgres_url
    if not url:
        print("[db] DATABASE_URL not set", file=sys.stderr)
        sys.exit(2)
    cfg.set_main_option("sqlalchemy.url", url)

    # Ensure models are imported so Base.metadata is populated
    import app.models  # noqa: F401

    return cfg


def cmd_migrate(args: argparse.Namespace) -> None:
    cfg = _alembic_config(args.url)
    command.upgrade(cfg, "head")


def cmd_downgrade(args: argparse.Namespace) -> None:
    cfg = _alembic_config(args.url)
    command.downgrade(cfg, args.revision)


def cmd_revision(args: argparse.Namespace) -> None:
    cfg = _alembic_config(args.url)
    command.revision(
        cfg,
        message=args.message,
        autogenerate=not args.empty,
        rev_id=args.rev_id,
    )


def cmd_current(args: argparse.Namespace) -> None:
    cfg = _alembic_config(args.url)
    command.current(cfg)


def cmd_history(args: argparse.Namespace) -> None:
    cfg = _alembic_config(args.url)
    command.history(cfg)


def cmd_stamp(args: argparse.Namespace) -> None:
    cfg = _alembic_config(args.url)
    command.stamp(cfg, args.revision)


def cmd_reset(args: argparse.Namespace) -> None:
    """Convenience: drop back to base, then upgrade to head (for dev/test)."""
    cfg = _alembic_config(args.url)
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")


def cmd_check(args: argparse.Namespace) -> None:
    """
    Emit a no-op autogenerate diff to see if there are pending changes.
    Exits with code 1 if a diff is detected (useful in CI).
    """
    from io import StringIO
    cfg = _alembic_config(args.url)
    buf = StringIO()
    command.revision(cfg, message="__check__", autogenerate=True, head="head", rev_id=None, splice=False, branch_label=None, version_path=None, depends_on=None, process_revision_directives=lambda ctx, rev, directives: directives.clear() or buf.write("DIFF"))
    if buf.getvalue():
        print("[db] Model changes detected (run revision).")
        sys.exit(1)
    print("[db] No model changes detected.")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="db", description="Database/Alembic utility")
    p.add_argument("--url", help="Override DATABASE_URL (optional)")
    sub = p.add_subparsers(dest="command", required=True)

    # migrate
    sp = sub.add_parser("migrate", help="Upgrade to head")
    sp.set_defaults(func=cmd_migrate)

    # downgrade
    sp = sub.add_parser("downgrade", help="Downgrade to a revision (e.g., -1)")
    sp.add_argument("revision", help="Revision (e.g., base, -1, <rev>)")
    sp.set_defaults(func=cmd_downgrade)

    # revision
    sp = sub.add_parser("revision", help="Create a revision")
    sp.add_argument("-m", "--message", required=True, help="Revision message")
    sp.add_argument("--empty", action="store_true", help="Create empty revision (no autogenerate)")
    sp.add_argument("--rev-id", help="Custom revision id (rare)")
    sp.set_defaults(func=cmd_revision)

    # current
    sp = sub.add_parser("current", help="Show current revision")
    sp.set_defaults(func=cmd_current)

    # history
    sp = sub.add_parser("history", help="Show revision history")
    sp.set_defaults(func=cmd_history)

    # stamp
    sp = sub.add_parser("stamp", help="Set DB to a revision without running migrations")
    sp.add_argument("revision", help="Revision to stamp (e.g., head)")
    sp.set_defaults(func=cmd_stamp)

    # reset
    sp = sub.add_parser("reset", help="Downgrade to base then upgrade to head")
    sp.set_defaults(func=cmd_reset)

    # check
    sp = sub.add_parser("check", help="Exit non-zero if pending model changes exist")
    sp.set_defaults(func=cmd_check)

    return p


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
