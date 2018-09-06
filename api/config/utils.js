const Ajv = require('ajv')
let localize = require('ajv-i18n')
const ajv = new Ajv({ allErrors: true, jsonPointers: true })
module.exports = {
  schemaFormato (schema, datos) {
    const validate = ajv.compile(schema)
    validate(datos)
    localize.es(validate.errors)
    let errores = validate.errors
    let erroresReturn = null
    if (errores) {
      erroresReturn = {}
      for (let error of errores) {
        let nombre = error['dataPath'].split('/')[1]
        erroresReturn[nombre] = error['message']
      }
      return [true, erroresReturn]
    }
    return [false, {}]
  }
}