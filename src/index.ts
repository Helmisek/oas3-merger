#! /usr/bin/env node
import { mergeSpecs } from './commands/merge'
import { program } from 'commander'

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

program.parse()
