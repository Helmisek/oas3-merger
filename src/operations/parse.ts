import * as fs from "fs";
import {glob} from "glob";
import * as YAML from 'yaml'

const parsingOptions = {
    fileExtension: '.yaml',
    primaryFile: 'swagger.yaml'
}

export interface OA3SpecificationStructure {
    paths?: any
    components?: any
}

export function parse(dirPath: string): OA3SpecificationStructure[] {
    if (!fs.existsSync(dirPath)) {
        throw Error(`${dirPath} is not a directory`)
    }
    console.log(`Looking for ${parsingOptions.fileExtension} specs.`)

    const files = glob.sync(constructDirectoryPath(dirPath), {})
    const specFiles = files
        .filter(file => !fs.lstatSync(file).isDirectory())
        .filter(file => file.match(new RegExp(`.*\.(${parsingOptions.fileExtension})`, 'ig')))
        .filter(file => !file.endsWith(parsingOptions.primaryFile))

    if (!specFiles) {
        console.log(`No ${parsingOptions.fileExtension} specs found in ${dirPath}.`)
    }

    const specs: OA3SpecificationStructure[] = []
    for (const file of specFiles) {
        const yaml = parseSpecificationFile(file)
        if (!yaml.components && !yaml.paths) {
            continue
        }
        console.log(`Parsing... ${file}`)
        specs.push({
            paths: yaml.paths,
            components: yaml.components,
        })
    }
    return specs
}

function parseSpecificationFile(filename: string): any {
    const file = fs.readFileSync(filename, 'utf8')
    return YAML.parse(file)
}

function constructDirectoryPath(path: string): string {
    if (!path.endsWith('/')) {
        path = path.concat('/')
    }
    return path.concat('**/*')
}
