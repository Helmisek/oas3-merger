import * as chalk from 'chalk'
import { logInfo } from '../utils/logger'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SwaggerParser = require('@apidevtools/swagger-parser')

export async function validateSpecificationFile(specsFile: string) {
  logInfo(chalk.blueBright(`Validating generated specification...`))
  return (
    (await SwaggerParser.validate(specsFile, {
      parse: {
        json: false,
        yaml: {
          allowEmpty: false,
        },
      },
    })) != null
  )
}
