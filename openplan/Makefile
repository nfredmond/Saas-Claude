.PHONY: help carto-install story-pack story-pack-existing

MAP_PIPELINE_ROOT ?= /home/nathaniel/.openclaw/workspace/agents/team/expert-programmer/projects/map-data-pipeline
JURISDICTION ?= sample-jurisdiction
CORRIDOR ?= sample-corridor
STORY_PACK_OUT ?= .artifacts/story-pack

help:
	@echo "Targets:"
	@echo "  make carto-install                # install pinned CARTO CLI"
	@echo "  make story-pack                   # run map pipeline + build report/web/motion manifests"
	@echo "  make story-pack-existing          # build manifests from existing exports only"

carto-install:
	./scripts/setup_carto_cli.sh

story-pack:
	python3 $(MAP_PIPELINE_ROOT)/integration/scripts/run_pipeline.py
	python3 ./scripts/make_story_pack.py \
		--pipeline-root $(MAP_PIPELINE_ROOT) \
		--jurisdiction $(JURISDICTION) \
		--corridor $(CORRIDOR) \
		--output-dir $(STORY_PACK_OUT)

story-pack-existing:
	python3 ./scripts/make_story_pack.py \
		--pipeline-root $(MAP_PIPELINE_ROOT) \
		--jurisdiction $(JURISDICTION) \
		--corridor $(CORRIDOR) \
		--output-dir $(STORY_PACK_OUT)
