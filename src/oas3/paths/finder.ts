export interface OAS3PathData {
    key: string
    data: any
}

export function extractOAS3PathData(specification: any): OAS3PathData[] {
    const keys = Object.keys(specification)
    return keys.map(key => {
        return {
            key: key,
            data: specification[key],
        }
    })
}
