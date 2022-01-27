import {OAS3Component} from "./structure";

export interface OAS3ComponentData {
    type: OAS3Component
    data: any
}

export function extractOAS3ComponentData(specification: any): OAS3ComponentData {
    return Object.keys(specification).map(key => {
        switch (key) {
            case 'securitySchemes': {
                return {
                    type: OAS3Component.securitySchemes,
                    data: specification[key],
                }
            }
            default:
                throw new Error('Unrecognizable key found in provided specification.')
        }
    })[0]!
}
