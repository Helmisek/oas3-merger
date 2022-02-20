import * as YAML from 'yaml'
import * as fs from 'fs'
import { logInfo } from '../utils/logger'
import * as chalk from 'chalk'
import { validateSpecificationFile } from './validate'

export async function generateSwaggerFile(outputFile: string, template: any) {
  try {
    const fileContent = YAML.stringify(template)
    const fileContentFixed = fileContent.replace(
      new RegExp('(?<=example: )(.*?)$', 'gm'),
      '"$1"',
    )
    const generatedFileNotice = fs.readFileSync('./assets/generated_notice.txt')

    logInfo(
      chalk.magenta(
        `Generating your OpenAPI 3 API specification: ${outputFile}`,
      ),
    )
    fs.writeFileSync(outputFile, `${generatedFileNotice}\n${fileContentFixed}`)

    const isSpecificationValid = await validateSpecificationFile(outputFile)

    if (isSpecificationValid) {
      logInfo(
        chalk.green(
          `Your new OpenAPI 3 specification is valid and available at: ${outputFile}`,
        ),
      )
    } else {
      logInfo(
        chalk.red(
          `Your OpenAPI 3 specification is invalid and needs to be regenerated after fixing errors.`,
        ),
      )
    }
  } catch (err: any) {
    if (err.message) {
      console.error(chalk.red(err.message))
    } else {
      console.error(chalk.red(err))
    }
  }
}
