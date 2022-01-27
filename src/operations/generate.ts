import {OA3SpecificationStructure} from "./parse";
import * as fs from "fs";
import * as YAML from 'yaml';
import {extractComponentData, OAS3ComponentData} from "../oas3/components/finder";

interface SwaggerGeneratorOptions {
    readonly outputFile: string
    readonly specifications: OA3SpecificationStructure[]
}

// TODO: get rid of this later by introducing configuration file
const templateFilepath = './docs/swagger.tpl.yaml'

export function generateSwagger(options: SwaggerGeneratorOptions) {
    const template = YAML.parse(fs.readFileSync(templateFilepath, 'utf-8'))
    template.components = {}
    const components = findComponents(options.specifications)
    components.forEach(component => {
        template.components[component.type.valueOf()] = component.data
    })

    generateSwaggerFile(options.outputFile, template)
}

function generateSwaggerFile(outputFile: string, template: any) {
    try {
        fs.writeFileSync(outputFile, YAML.stringify(template))
    } catch (err) {
        console.error(err)
    }
}

function findComponents(specifications: OA3SpecificationStructure[]): OAS3ComponentData[] {
    return specifications.map(spec => {
        return extractComponentData(spec.components)
    })
}
