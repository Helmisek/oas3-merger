import {
  OA3SpecificationStructure,
  parseSpecs,
} from '../../src/operations/parseSpecs'
import { expect } from 'chai'
import {
  EmptyConfigurationFileError,
  NoSpecificationsFilesFoundError,
  NoSpecificationsFoundError,
  WrongConfigurationFileError,
  WrongInputPathError,
} from '../../src/error/general'
import * as parsedPetStoreStructure from '../data/__mocks__/petstore_parsed_structure.json'

describe('Operations | Input Parser', () => {
  it('returns valid OAS3 specification structure', async () => {
    const specificationData: OA3SpecificationStructure[] = await parseSpecs({
      dirPath: './test/data',
      configurationFile: './test/data/configuration.yaml',
      ignorePathsRegex: '__mocks__.*',
    })

    expect(specificationData).to.be.eql(parsedPetStoreStructure)
  })

  it('throws an error when "dirPath" argument is not a directory', async () => {
    await expect(
      parseSpecs({
        dirPath: './test/data/configuration.yaml',
        configurationFile: './test/data/configuration.yaml',
      }),
    ).to.be.rejectedWith(WrongInputPathError)
  })

  it('throws an error when "dirPath" argument is a directory with no YAML specs', async () => {
    await expect(
      parseSpecs({
        dirPath: './test/data/empty/',
        configurationFile: './test/data/configuration.yaml',
      }),
    ).to.be.rejectedWith(NoSpecificationsFilesFoundError)
  })

  it('throws an error when "configurationFile" argument is not a YAML file', async () => {
    await expect(
      parseSpecs({
        dirPath: './test/data/',
        configurationFile: './test/data/random.json',
      }),
    ).to.be.rejectedWith(WrongConfigurationFileError)
  })

  it('throws an error when "configurationFile" argument is an empty a YAML file', async () => {
    await expect(
      parseSpecs({
        dirPath: './test/data/',
        configurationFile: './test/data/empty.yaml',
      }),
    ).to.be.rejectedWith(EmptyConfigurationFileError)
  })

  it('throws an error when "dirPath" contains spec files with no subkeys to paths or components', async () => {
    await expect(
      parseSpecs({
        dirPath: './test/data/wrong/',
        configurationFile: './test/data/configuration.yaml',
      }),
    ).to.be.rejectedWith(NoSpecificationsFoundError)
  })
})
