#!/usr/bin/env python3
"""Story-pack orchestration skeleton for Lane 23.

Integrates map-data-pipeline exports into report/web/motion manifest package.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--pipeline-root",
        default="/home/nathaniel/.openclaw/workspace/agents/team/expert-programmer/projects/map-data-pipeline",
        help="Path to map-data-pipeline project root",
    )
    parser.add_argument(
        "--output-dir",
        default=".artifacts/story-pack",
        help="Base output directory for generated story packs",
    )
    parser.add_argument("--jurisdiction", default="sample-jurisdiction", help="Jurisdiction slug")
    parser.add_argument("--corridor", default="sample-corridor", help="Corridor slug")
    return parser.parse_args()


def read_json(path: Path, default: dict | list):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    args = parse_args()

    pipeline_root = Path(args.pipeline_root).resolve()
    exports_root = pipeline_root / "exports"

    visual_index_path = exports_root / "visual-boards" / "layer-index.json"
    remotion_manifest_path = exports_root / "remotion" / "scene-manifest.json"
    remotion_summary_path = exports_root / "remotion" / "pipeline-summary.json"

    visual_index = read_json(visual_index_path, default={"layers": []})
    remotion_manifest = read_json(remotion_manifest_path, default={"scenes": []})
    remotion_summary = read_json(remotion_summary_path, default={})

    layers = visual_index.get("layers", []) if isinstance(visual_index, dict) else []

    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    pack_root = Path(args.output_dir).resolve() / f"{ts}_{args.jurisdiction}_{args.corridor}"
    report_dir = pack_root / "report"
    web_dir = pack_root / "web"
    motion_dir = pack_root / "motion"

    for directory in (report_dir, web_dir, motion_dir):
        directory.mkdir(parents=True, exist_ok=True)

    report_manifest = {
        "kind": "report",
        "source": str(visual_index_path),
        "layerCount": len(layers),
        "assets": [
            {
                "layer": layer.get("name") or layer.get("id"),
                "svg": layer.get("svg_path") or layer.get("svgPath"),
                "png": layer.get("png_path") or layer.get("pngPath"),
            }
            for layer in layers
        ],
        "notes": [
            "Attach council/report caption text and disclaimer block before external release.",
            "Optional PDF plate assembly step can be added as a post-processor.",
        ],
    }

    web_manifest = {
        "kind": "web",
        "source": str(visual_index_path),
        "layerCount": len(layers),
        "assets": [
            {
                "layer": layer.get("name") or layer.get("id"),
                "svg": layer.get("svg_path") or layer.get("svgPath"),
                "bbox": layer.get("bbox") or layer.get("bounds"),
                "remotionAsset": layer.get("remotion_asset_path") or layer.get("remotionAssetPath"),
            }
            for layer in layers
        ],
        "notes": [
            "Mapbox static/interactive publish step intentionally left as lane-level extension point.",
            "Add attribution and alt text before publishing.",
        ],
    }

    motion_manifest = {
        "kind": "motion",
        "source": str(remotion_manifest_path),
        "sceneCount": len(remotion_manifest.get("scenes", [])),
        "manifest": remotion_manifest,
        "summary": remotion_summary,
    }

    (report_dir / "report-manifest.json").write_text(json.dumps(report_manifest, indent=2), encoding="utf-8")
    (web_dir / "web-manifest.json").write_text(json.dumps(web_manifest, indent=2), encoding="utf-8")
    (motion_dir / "remotion-manifest.json").write_text(json.dumps(motion_manifest, indent=2), encoding="utf-8")

    story_manifest = {
        "kind": "story-pack",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "jurisdiction": args.jurisdiction,
        "corridor": args.corridor,
        "pipelineRoot": str(pipeline_root),
        "inputs": {
            "visualIndex": str(visual_index_path),
            "remotionManifest": str(remotion_manifest_path),
            "remotionSummary": str(remotion_summary_path),
        },
        "outputs": {
            "report": str(report_dir / "report-manifest.json"),
            "web": str(web_dir / "web-manifest.json"),
            "motion": str(motion_dir / "remotion-manifest.json"),
        },
    }

    (pack_root / "manifest.json").write_text(json.dumps(story_manifest, indent=2), encoding="utf-8")

    print(json.dumps(story_manifest, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
