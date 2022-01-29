#! /usr/bin/env node
import { useMergeSpecsCommand } from './commands/merge'
import { program } from 'commander'
import { useValidateSpecsCommand } from './commands/validate'

useMergeSpecsCommand(program)
useValidateSpecsCommand(program)

program.parse()
