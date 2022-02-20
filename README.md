# OAS3 (OpenAPI 3) Merger Tool

## Introduction

This is a Node.js CLI tooling built for the purpose of managing big Open API 3 specifications where having everything in
a single file is not maintainable anymore.

The problem is there is no easy way to separate and structure OAS3 specifications as the system relies on a singular
file input which must now contain everything which imo makes it a mess to read and operate on.

To deal with this you have to reorganize your documentation specifications into multiple files & directories where you
would normally have to start using relative path referencing.

So instead of direct type based ('../pets/..' vs \#components/schemas/...).

**This tooling solves the issue** by allowing you to split all the files and reference the components normally via
component references and then combine all specifications into a singular YAML file again. That way your code is still
maintainable and the produced output is well-formatted, and you can leverage all the features Swagger provides, all that
while not having to take care of the main Swagger file.

## Example

In order to better understand the solution and problem itself, take a look at `./example` directory.

There you can find a usual representation of API documentation this tooling works with.

`pets` are directory for specific API feature containing all the necessary files for both paths and schemas.

`configuration.yaml` is the necessary base configuration the primary `swagger.yaml` starts with.

`swagger.yaml` is the actually generated output with all the merged data.

`index.html` is providing you the UI for your OAS3 Swagger documentation whilst only referencing `swagger.yaml`.

## How to use

The tooling relies on the developer to actually create a specific folder containing all the documentation specification
files and then using the tool on that file path.

Each of the specific files should start with either `paths` or `components` as per OpenAPI 3.0 Specification from which
the tooling will then use extract the data structure the whole new document.

To see how you should ideally structure your documentation, take a look at `./example` directory.

There are two separate tooling commands available at the moment:

- merge
- validate

With each serving a different purpose and offering various command options explained in sections below.

### Merge

By calling `oas3-merger merge` with configurable options you can adjust the necessary merging behavior.

| Name     | Description                                                                                | Required | Example                     |
|----------|--------------------------------------------------------------------------------------------|----------|-----------------------------|
| `input`  | Path to directory containing your documentation specifications.                            | Yes      | `./docs`                    |
| `output` | Defines where to save the newly generated Swagger documentation to.                        | Yes      | `./docs/swagger.yaml`       |
| `config` | Defines the path to the configuration (base) yaml template file.                           | Yes      | `./docs/configuration.yaml` |
| `ignore` | Defines a RegExp string used to filter out unwanted paths when scanning `input` directory. | No       | `__helpers__.*`             |

Example:

`oas3-merger merge --input "./example" --output "./example/swagger.yaml" --config "./example/configuration.yaml"`

### Validate

By calling `oas3-merger validate` with following available options you can determine what final specification to
validate.

| Name    | Description                                     | Required | Example               |
|---------|-------------------------------------------------|----------|-----------------------|
| `input` | Complete Swagger YAML file to validate against. | Yes      | `./docs/swagger.yaml` |

Example:

`oas3-merger validate --input "./example/swagger.yaml"`

## Contribute

If you want to contribute, just create a PR or an issue to post ideas.
