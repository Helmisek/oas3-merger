## Variables ##

BUILD:=dist

## Targets ##
compile:
	npx tsc -p ./tsconfig.json

test:
	echo "TODO"

merge: compile
	node $(BUILD)/src/index.js
