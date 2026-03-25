# Project Guidelines

## Code Style
- Follow language-native style guides and formatter defaults once a language stack is added.
- Keep modules small and cohesive; prefer descriptive names over abbreviations.
- Add or update tests alongside behavior changes when a test framework is introduced.

## Architecture
- Keep business rules separated from delivery and persistence layers.
- Prefer explicit boundaries between domain logic, application orchestration, and infrastructure.
- Avoid coupling core logic directly to frameworks or external services.

## Build and Test
- No build or test toolchain is configured yet.
- After initializing the stack, add canonical install, build, lint, and test commands here.

## Conventions
- Do not assume commands, frameworks, or package managers that are not present in the repository.
- Prefer incremental, reviewable changes over large scaffolding updates in a single step.
- Link to existing docs instead of duplicating guidance when documentation is added (for example, docs/ARCHITECTURE.md or CONTRIBUTING.md).