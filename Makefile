## Variables ##

BUILD:=dist
CLI_NAME:=oas3-merger
CLI:=generated/$(CLI_NAME)

## Targets ##
compile:
	npx tsc -p ./tsconfig.json

test:
	echo "TODO"

package: compile
	npx pkg . --output ./$(CLI)

merge:
	./$(CLI) merge --input "./docs" --output "./docs/swagger.yaml"

build: package merge
