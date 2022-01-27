interface MergeCommandOptions {
    input: string
    output: string
}

function mergeSpecs(options: MergeCommandOptions) {
    console.log(`Ahoj ${options.input} ${options.output}`)
}

export {
    mergeSpecs,
}
