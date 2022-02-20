import { generateSwaggerFile } from '../../src/operations/fileWriter'
import * as generatedOutputSwaggerDocument from '../data/__mocks__/petstore_generated_swagger_document.json'
import * as fs from 'fs'
import * as crypto from 'crypto'
import { expect } from 'chai'

describe('Operations | File Writer', () => {
  const temporarySwaggerFilePath = './test/data/tmp/swagger.yaml'

  it('write generated file successfully', async () => {
    await generateSwaggerFile(
      temporarySwaggerFilePath,
      generatedOutputSwaggerDocument,
    )

    const generatedDocumentHexHashSum = generateHashSumForFile(
      temporarySwaggerFilePath,
    )
    const validDocumentHexHashSum = generateHashSumForFile(
      './test/data/__mocks__/petstore_generated_swagger.yaml',
    )

    expect(generatedDocumentHexHashSum).to.eql(validDocumentHexHashSum)
  })

  function generateHashSumForFile(path: string): string {
    const fileBuffer = fs.readFileSync(path)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(fileBuffer)
    return hashSum.digest('hex')
  }

  afterEach(async () => {
    fs.unlinkSync(temporarySwaggerFilePath)
  })
})
