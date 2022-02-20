import * as fs from 'fs'
import { glob } from 'glob'
import * as YAML from 'yaml'
import * as chalk from 'chalk'
import {
  EmptyConfigurationFileError,
  NoComponentKeysFoundError,
  NoPathKeysFoundError,
  NoSpecificationsFilesFoundError,
  NoSpecificationsFoundError,
  WrongConfigurationFileError,
  WrongInputPathError,
} from '../error/general'
import { logInfo } from '../utils/logger'
import {
  extractOAS3ComponentData,
  OAS3ComponentData,
} from '../oas3/components/finder'
import { extractOAS3PathData, OAS3PathData } from '../oas3/paths/finder'

const parsingOptions = {
  fileExtensions: ['.yaml', '.yml'],
  primaryFile: 'swagger.yaml',
}

export interface OA3SpecificationStructure {
  paths: OAS3PathData[] | null
  components: OAS3ComponentData | null
}

export interface ParsingOptions {
  readonly dirPath: string
  readonly configurationFile: string
  readonly ignorePathsRegex?: string | RegExp
}

function parseSpecificationFile(filename: string): any | null {
  const file = fs.readFileSync(filename, 'utf8')
  return YAML.parse(file)
}

function constructDirectoryPath(path: string): string {
  if (!path.endsWith('/')) {
    path = path.concat('/')
  }
  return path.concat('**/*')
}

export async function parseSpecs(
  options: ParsingOptions,
): Promise<OA3SpecificationStructure[]> {
  if (fs.lstatSync(options.dirPath).isFile()) {
    throw new WrongInputPathError(`Input path must be a directory.`)
  }
  if (!fs.existsSync(options.dirPath)) {
    throw new WrongInputPathError(
      `Provided path: ${options.dirPath} does not exist.`,
    )
  }

  if (!options.configurationFile.match(/(.yaml|.yml)/)) {
    throw new WrongConfigurationFileError(
      `Provided configuration file must be a YAML (.yaml, .yml) file.`,
    )
  }
  if (fs.statSync(options.configurationFile).size === 0) {
    throw new EmptyConfigurationFileError(
      `Provided configuration file must not be empty.`,
    )
  }

  logInfo(
    chalk.yellow(
      `Looking for [${parsingOptions.fileExtensions.join('|')}] specs.`,
    ),
  )

  const files = glob.sync(constructDirectoryPath(options.dirPath), {})
  const specFiles = files
    .filter((file) => !fs.lstatSync(file).isDirectory())
    .filter((file) =>
      file.match(
        new RegExp(`.*.(${parsingOptions.fileExtensions.join('|')})`, 'ig'),
      ),
    )
    .filter((file) => !file.endsWith(parsingOptions.primaryFile))
    .filter((file) => file !== options.configurationFile)
    .filter((file) =>
      options.ignorePathsRegex
        ? file.match(options.ignorePathsRegex) === null
        : true,
    )

  if (!specFiles || specFiles.length === 0) {
    throw new NoSpecificationsFilesFoundError(
      parsingOptions.fileExtensions.join(' | '),
      options.dirPath,
    )
  }

  const specs: OA3SpecificationStructure[] = []
  for (const file of specFiles) {
    const yaml = parseSpecificationFile(file)
    if (!yaml || (!yaml.components && !yaml.paths)) {
      continue
    }
    logInfo(chalk.cyan(`Parsing... ${file}`))
    specs.push({
      paths: findPaths(yaml),
      components: findComponents(yaml),
    })
  }

  if (specs.length === 0) {
    throw new NoSpecificationsFoundError()
  }
  return specs
}

function findComponents(data: any): OAS3ComponentData | null {
  const componentData = data ? data.components : null
  if (componentData != null && Object.keys(componentData).length === 0) {
    throw new NoComponentKeysFoundError()
  }
  if (!componentData) return null
  return extractOAS3ComponentData(componentData)
}

function findPaths(data: any): OAS3PathData[] | null {
  const pathData = data ? data.paths : null
  if (pathData != null && Object.keys(pathData).length === 0) {
    throw new NoPathKeysFoundError()
  }
  if (!pathData) return null
  return extractOAS3PathData(pathData)
}
