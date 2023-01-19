import { onProcess, useLogger, useOperations, constants, mikser } from 'mikser-core'
import _ from 'lodash'
import morphism from 'morphism'
import jsonata from 'jsonata'

onProcess(() => {
    const logger = useLogger()

    for (let { match, schema, map, expression, use = 'meta' } of mikser.config.mapper?.mappers || []) {        
        const entities = useOperations([constants.OPERATION_CREATE, constants.OPERATION_UPDATE])
        .map(operation => operation.entity)
        .filter(entity => entity.meta && _.isMatch(entity, match))

        if (expression) {
            expression = jsonata(expression)
        }
    
        for (let entity of entities) {
            logger.trace('Mapper: %s', entity.id)
            const object = _.get(entity, use)
            if (schema) {
                _.set(entity, use, morphism.morphism(schema, object))
            }
            if (expression) {
                _.set(entity, use, expression(object))
            }
            if (map) {
                _.set(entity, use, map(object))
            }
        }
    }
})