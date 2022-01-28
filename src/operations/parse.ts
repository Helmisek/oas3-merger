import * as fs from "fs";
import {glob} from "glob";
import * as YAML from 'yaml'
import * as chalk from "chalk";

const parsingOptions = {
    fileExtensions: ['.yaml', '.yml'],
    primaryFile: 'swagger.yaml'
}

export interface OA3SpecificationStructure {
    paths?: any
    components?: any
}

export interface ParsingOptions {
    readonly dirPath: string
    readonly configurationFile: string
}

export function parse(options: ParsingOptions): OA3SpecificationStructure[] {
    if (!fs.existsSync(options.dirPath)) {
        throw Error(`${options.dirPath} is not a directory`)
    }
    console.log(chalk.yellow(`Looking for [${parsingOptions.fileExtensions.join(" | ")}] specs.`))

    const files = glob.sync(constructDirectoryPath(options.dirPath), {})
    const specFiles = files
        .filter(file => !fs.lstatSync(file).isDirectory())
        .filter(file => file.match(new RegExp(`.*\.(${parsingOptions.fileExtensions.join('|')})`, 'ig')))
        .filter(file => !file.endsWith(parsingOptions.primaryFile))
        .filter(file => file !== options.configurationFile)

    if (!specFiles) {
        console.log(`No [${parsingOptions.fileExtensions.join(" | ")}] specs found in ${options.dirPath}.`)
    }

    const specs: OA3SpecificationStructure[] = []
    for (const file of specFiles) {
        const yaml = parseSpecificationFile(file)
        if (!yaml.components && !yaml.paths) {
            continue
        }
        console.log(chalk.cyan(`Parsing... ${file}`))
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
