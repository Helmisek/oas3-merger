#! /usr/bin/env node
import {mergeSpecs} from "./commands/merge";

const {program} = require('commander')

program
    .command('merge')
    .description('Merge specifications into a single file.')
    .option('--input <input>', 'The input directory where all the specs are defined.')
    .option('--output <output>', 'The output path to the singular swagger.yaml file.')
    .action(mergeSpecs)

program.parse()
