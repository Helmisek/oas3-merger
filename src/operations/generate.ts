import {OA3SpecificationStructure} from "./parse";
import * as fs from "fs";
import * as YAML from 'yaml';
import {extractOAS3ComponentData, OAS3ComponentData} from "../oas3/components/finder";
import {extractOAS3PathData, OAS3PathData} from "../oas3/paths/finder";
import * as chalk from "chalk";

const SwaggerParser = require("@apidevtools/swagger-parser");

interface SwaggerGeneratorOptions {
    readonly configurationSpecFile: string
    readonly outputFile: string
    readonly specifications: OA3SpecificationStructure[]
}

export async function generateSwagger(options: SwaggerGeneratorOptions) {
    const template = YAML.parse(fs.readFileSync(options.configurationSpecFile, 'utf-8'))
    template.paths = {}
    template.components = {}

    const generalPaths = findPaths(options.specifications.filter(spec => {
        return spec.paths != null
    }))
    const components = findComponents(options.specifications.filter(spec => {
        return spec.components != null
    }))

    generalPaths.forEach(paths => paths.forEach(path => {
        template.paths[path.key] = path.data
    }))
    components.forEach(component => {
        template.components[component.type.valueOf()] = {
            ...template.components[component.type.valueOf()],
            ...component.data,
        }
    })

    await generateSwaggerFile(options.outputFile, template)
}

async function validateSpecificationFile(outputFile: string) {
    console.log(chalk.blueBright(`Validating generated specification...`))
    return await SwaggerParser.validate(outputFile, {
        parse: {
            json: false,
            yaml: {
                allowEmpty: false,
            }
        },
    }) != null;
}

async function generateSwaggerFile(outputFile: string, template: any) {
    try {
        const fileContent = YAML.stringify(template)
        const fileContentFixed = fileContent.replace(new RegExp("(?<=example: )(.*?)$", "gm"), '"$1"')
        const generatedFileNotice = fs.readFileSync('./assets/generated_notice.txt')

        console.log(chalk.magenta(`Generating your OpenAPI 3 API specification: ${outputFile}`))
        fs.writeFileSync(outputFile, `${generatedFileNotice}\n${fileContentFixed}`)

        const isSpecificationValid = await validateSpecificationFile(outputFile);

        if (isSpecificationValid) {
            console.log(chalk.green(`Your new OpenAPI 3 specification is valid and available at: ${outputFile}`))
        } else {
            console.log(chalk.green(`Your OpenAPI 3 specification is invalid and needs to be regenerated after fixing errors.`))
        }
    } catch (err: any) {
        if (err.message) {
            console.error(chalk.red(err.message))
        } else {
            console.error(chalk.red(err))
        }
    }
}

function findComponents(specifications: OA3SpecificationStructure[]): OAS3ComponentData[] {
    return specifications.map(spec => {
        return extractOAS3ComponentData(spec.components)
    })
}

function findPaths(specifications: OA3SpecificationStructure[]): OAS3PathData[][] {
    return specifications.map(spec => {
        return extractOAS3PathData(spec.paths)
    })
}
