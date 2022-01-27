import {OA3SpecificationStructure, parse} from "../operations/parse";
import {generateSwagger} from "../operations/generate";

interface MergeCommandOptions {
    input: string
    output: string
}

function mergeSpecs(options: MergeCommandOptions) {
    const specs: OA3SpecificationStructure[] = parse(options.input)
    generateSwagger({
        outputFile: options.output,
        specifications: specs,
    })
}

export {
    mergeSpecs,
}
