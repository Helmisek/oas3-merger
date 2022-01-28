import {OAS3Component} from "./structure";

export interface OAS3ComponentData {
    type: OAS3Component
    data: any
}

export function extractOAS3ComponentData(specification: any): OAS3ComponentData {
    return Object.keys(specification).map(key => {
        switch (key) {
            case 'schemas': {
                return {
                    type: OAS3Component.schemas,
                    data: specification[key],
                }
            }
            case 'parameters': {
                return {
                    type: OAS3Component.parameters,
                    data: specification[key],
                }
            }
            case 'securitySchemes': {
                return {
                    type: OAS3Component.securitySchemes,
                    data: specification[key],
                }
            }
            case 'requestBodies': {
                return {
                    type: OAS3Component.requestBodies,
                    data: specification[key],
                }
            }
            case 'responses': {
                return {
                    type: OAS3Component.responses,
                    data: specification[key],
                }
            }
            case 'headers': {
                return {
                    type: OAS3Component.headers,
                    data: specification[key],
                }
            }
            case 'examples': {
                return {
                    type: OAS3Component.examples,
                    data: specification[key],
                }
            }
            case 'links': {
                return {
                    type: OAS3Component.links,
                    data: specification[key],
                }
            }
            case 'callbacks': {
                return {
                    type: OAS3Component.callbacks,
                    data: specification[key],
                }
            }
            default:
                throw new Error('Unrecognizable key found in provided specification.')
        }
    })[0]!
}
