## Variables ##

BUILD:=dist
CLI:=oas3-merger

## Targets ##
compile:
	npx tsc -p ./tsconfig.json

install:
	npm i -g .

test:
	echo "TODO"

merge:
	$(CLI) merge --input "./docs" --output "./docs/swagger.yaml" --config "./docs/configuration.yaml"

validate:
	npx swagger-cli validate ./docs/swagger.yaml

build: compile install merge
