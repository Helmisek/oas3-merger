import { validateSpecificationFile } from '../../src/operations/validate'
import { expect } from 'chai'

describe('Operations | Validate spec file', () => {
  it('correctly validates proper OAS3 specification document', async () => {
    await validateSpecificationFile(
      './test/data/__mocks__/petstore_generated_swagger.yaml',
    )
  })

  it('throws an error on invalid OAS3 specification document', async () => {
    await expect(
      validateSpecificationFile(
        './test/data/__mocks__/wrong/petstore_generated_swagger.yaml',
      ),
    ).to.be.rejectedWith('Token "Pets" does not exist.')

    await expect(
      validateSpecificationFile(
        './test/data/__mocks__/wrong/petstore_generated_swagger2.yaml',
      ),
    ).to.be.rejectedWith('Token "components" does not exist.')
  })
})
