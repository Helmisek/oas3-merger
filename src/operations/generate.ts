import {OA3SpecificationStructure} from "./parse";
import * as fs from "fs";
import * as YAML from 'yaml';
import {extractOAS3ComponentData, OAS3ComponentData} from "../oas3/components/finder";
import {extractOAS3PathData, OAS3PathData} from "../oas3/paths/finder";
import * as chalk from "chalk";

interface SwaggerGeneratorOptions {
    readonly configurationSpecFile: string
    readonly outputFile: string
    readonly specifications: OA3SpecificationStructure[]
}

export function generateSwagger(options: SwaggerGeneratorOptions) {
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

    generateSwaggerFile(options.outputFile, template)
}

function generateSwaggerFile(outputFile: string, template: any) {
    try {
        fs.writeFileSync(outputFile, YAML.stringify(template))
        console.log(chalk.green(`Your new OpenAPI 3 specification is available: ${outputFile}`))
    } catch (err) {
        console.error(err)
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
