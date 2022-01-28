import {OA3SpecificationStructure, parse} from "../operations/parse";
import {generateSwagger} from "../operations/generate";

interface MergeCommandOptions {
    input: string
    output: string
    config: string
}

function mergeSpecs(options: MergeCommandOptions) {
    const specs: OA3SpecificationStructure[] = parse({
        configurationFile: options.config,
        dirPath: options.input,
    })
    generateSwagger({
        configurationSpecFile: options.config,
        outputFile: options.output,
        specifications: specs,
    })
}

export {
    mergeSpecs,
}
