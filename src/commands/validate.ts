import { program as CommanderProgram } from 'commander'
import { validateSpecificationFile } from '../operations/validate'
import * as chalk from 'chalk'

interface ValidateCommandOptions {
  input: string
}

async function validateSpecs(options: ValidateCommandOptions) {
  const isSpecificationValid = await validateSpecificationFile(options.input)
  if (isSpecificationValid) {
    console.log(chalk.green(`Your OpenAPI 3 specification is valid.`))
  } else {
    console.log(
      chalk.red(
        `Your OpenAPI 3 specification is invalid, proceed to fix the errors before using it.`,
      ),
    )
  }
}

function useValidateSpecsCommand(program: typeof CommanderProgram) {
  program
    .command('validate')
    .description('Validate provided OpenAPI 3.0 specifications file.')
    .requiredOption(
      '--input <input>',
      'The OpenAPI 3.0 specification file to validate against.',
    )
    .action(validateSpecs)
}

export { useValidateSpecsCommand }
