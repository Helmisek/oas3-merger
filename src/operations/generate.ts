import { OA3SpecificationStructure } from './parseSpecs'

interface SwaggerGeneratorOptions {
  readonly configurationBaseSpec: any
  readonly specifications: OA3SpecificationStructure[]
}

export async function generateSwaggerDocument(
  options: SwaggerGeneratorOptions,
) {
  const template = options.configurationBaseSpec
  template.paths = {}
  template.components = {}

  const generalPaths = options.specifications
    .filter((spec) => {
      return spec.paths != null
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((spec) => spec.paths!)

  const components = options.specifications
    .filter((spec) => {
      return spec.components != null
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((spec) => spec.components!)

  generalPaths.forEach((paths) => {
    paths.forEach((path) => {
      template.paths[path.key] = path.data
    })
  })

  components.forEach((component) => {
    template.components[component.type.valueOf()] = {
      ...template.components[component.type.valueOf()],
      ...component.data,
    }
  })

  return template
}
