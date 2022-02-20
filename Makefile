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
	NODE_ENV=test npx mocha

.PHONY: merge
merge:
	$(CLI) merge --input "./example" --output "./example/swagger.yaml" --config "./example/configuration.yaml"

.PHONY: validate-external
validate-external:
	npx swagger-cli validate ./example/swagger.yaml

.PHONY: validate
validate:
	$(CLI) validate --input "./example/swagger.yaml"

.PHONY: build
build: compile install merge validate

.PHONY: lint-staged
lint-staged:
	npx pretty-quick --staged && npx lint-staged

.PHONY: lint
lint:
	npx eslint --cache --fix ./src/ ./test/

.PHONY: format
format:
	npx prettier --write ./src ./test
