## Variables ##

BUILD:=dist
CLI:=oas3-merger

## Targets ##
.PHONY: compile
compile:
	npx tsc -p ./tsconfig.json

.PHONY: install
install:
	npm i -g .

.PHONY: test
test:
	echo "TODO"

.PHONY: merge
merge:
	$(CLI) merge --input "./docs" --output "./docs/swagger.yaml" --config "./docs/configuration.yaml"

.PHONY: validate
validate:
	npx swagger-cli validate ./docs/swagger.yaml

.PHONY: build
build: compile install merge

.PHONY: lint-staged
lint-staged:
	npx pretty-quick --staged && npx lint-staged

.PHONY: lint
lint:
	npx eslint --cache --fix src/

format:
	npx prettier --write src/
