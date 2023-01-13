import { onProcess, useLogger, useOperations, constants, mikser } from 'mikser-core'
import _ from 'lodash'
import morphism from 'morphism'

onProcess(() => {
    const logger = useLogger()

    for (let { match, schema, map } of mikser.config.mapper?.mappers || []) {        
        const entities = useOperations([constants.OPERATION_CREATE, constants.OPERATION_UPDATE])
        .map(operation => operation.entity)
        .filter(entity => entity.meta && _.matches(entity, match))
    
        for (let entity of entities) {
            logger.trace('Mapper: %s', entity.id)
            if (schema) {
                entity.meta = morphism.morphism(schema, entity.meta)
            }
            if (map) {
                entity.meta = map(entity.meta)
            }
        }
    }
})