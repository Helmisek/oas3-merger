import { OA3SpecificationStructure, parseSpecs } from '../operations/parseSpecs'
import { generateSwaggerDocument } from '../operations/generate'
import type { program as CommanderProgram } from 'commander'
import { generateSwaggerFile } from '../operations/fileWriter'
import * as YAML from 'yaml'
import * as fs from 'fs'

interface MergeCommandOptions {
  input: string
  output: string
  config: string
  ignore?: string
}

async function mergeSpecs(options: MergeCommandOptions) {
  const specs: OA3SpecificationStructure[] = await parseSpecs({
    configurationFile: options.config,
    dirPath: options.input,
    ignorePathsRegex: options.ignore,
  })

  const configurationBasicSpec = YAML.parse(
    fs.readFileSync(options.config, 'utf-8'),
  )

  const template = await generateSwaggerDocument({
    configurationBaseSpec: configurationBasicSpec,
    specifications: specs,
  })

  await generateSwaggerFile(options.output, template)
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
    .option(
      '--ignore <ignore>',
      'Define Regex string to ignore YAML files you want to avoid parsing.',
    )
    .action(mergeSpecs)
}

export { useMergeSpecsCommand }
