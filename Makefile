## Variables ##

BUILD:=dist
CLI_NAME:=oas3-merger
CLI:=output/$(CLI_NAME)

## Targets ##
compile:
	npx tsc -p ./tsconfig.json

test:
	echo "TODO"

package: compile
	npx pkg . --output ./$(CLI)

merge:
	./$(CLI) merge --input "./docs" --output "./test/swagger.yaml"

build: package merge
