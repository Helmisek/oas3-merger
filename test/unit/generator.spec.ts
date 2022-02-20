import { generateSwaggerDocument } from '../../src/operations/generate'
import {
  OA3SpecificationStructure,
  parseSpecs,
} from '../../src/operations/parseSpecs'
import * as YAML from 'yaml'
import * as fs from 'fs'
import { expect } from 'chai'
import * as generatedOutputSwaggerDocument from '../data/__mocks__/petstore_generated_swagger_document.json'

describe('Operations | Output Generator', () => {
  it('generate valid YAML structure', async () => {
    const specificationData: OA3SpecificationStructure[] = await parseSpecs({
      dirPath: './test/data',
      configurationFile: './test/data/configuration.yaml',
    })

    const configurationBasicSpec = YAML.parse(
      fs.readFileSync('./test/data/configuration.yaml', 'utf-8'),
    )

    const generatedOutput = await generateSwaggerDocument({
      configurationBaseSpec: configurationBasicSpec,
      specifications: specificationData,
    })

    expect(generatedOutput).to.be.eql(generatedOutputSwaggerDocument)
  })
})
