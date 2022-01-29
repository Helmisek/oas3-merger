import * as chalk from 'chalk'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SwaggerParser = require('@apidevtools/swagger-parser')

export async function validateSpecificationFile(specsFile: string) {
  console.log(chalk.blueBright(`Validating generated specification...`))
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
