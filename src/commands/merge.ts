import { OA3SpecificationStructure, parse } from '../operations/parse'
import { generateSwagger } from '../operations/generate'
import type { program as CommanderProgram } from 'commander'

interface MergeCommandOptions {
  input: string
  output: string
  config: string
}

async function mergeSpecs(options: MergeCommandOptions) {
  const specs: OA3SpecificationStructure[] = parse({
    configurationFile: options.config,
    dirPath: options.input,
  })
  await generateSwagger({
    configurationSpecFile: options.config,
    outputFile: options.output,
    specifications: specs,
  })
}

function useMergeSpecsCommand(program: typeof CommanderProgram) {
  program
    .command('merge')
    .description('Merge specifications into a single file.')
    .requiredOption(
      '--input <input>',
      'The input directory where all the specs are defined.',
    )
    .requiredOption(
      '--output <output>',
      'The output path to the singular swagger.yaml file.',
    )
    .requiredOption(
      '--config <config>',
      'The basic Open API 3 specification file to use.',
    )
    .action(mergeSpecs)
}

export { useMergeSpecsCommand }
