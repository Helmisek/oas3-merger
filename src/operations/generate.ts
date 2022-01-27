import {OA3SpecificationStructure} from "./parse";
import * as fs from "fs";
import * as YAML from 'yaml';
import {extractOAS3ComponentData, OAS3ComponentData} from "../oas3/components/finder";
import {extractOAS3PathData, OAS3PathData} from "../oas3/paths/finder";

interface SwaggerGeneratorOptions {
    readonly outputFile: string
    readonly specifications: OA3SpecificationStructure[]
}

// TODO: get rid of this later by introducing configuration file
const templateFilepath = './docs/swagger.tpl.yaml'

export function generateSwagger(options: SwaggerGeneratorOptions) {
    const template = YAML.parse(fs.readFileSync(templateFilepath, 'utf-8'))
    template.components = {}
    template.paths = {}

    const components = findComponents(options.specifications.filter(spec => {
        return spec.components != null
    }))
    const generalPaths = findPaths(options.specifications.filter(spec => {
        return spec.paths != null
    }))

    components.forEach(component => {
        template.components[component.type.valueOf()] = component.data
    })
    generalPaths.forEach(paths => paths.forEach(path => {
        template.paths[path.key] = path.data
    }))

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
        return extractOAS3ComponentData(spec.components)
    })
}

function findPaths(specifications: OA3SpecificationStructure[]): OAS3PathData[][] {
    return specifications.map(spec => {
        return extractOAS3PathData(spec.paths)
    })
}
