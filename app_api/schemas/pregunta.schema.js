const Joi = require('joi');

const schema = Joi.object().keys({
    nombre: Joi.string().required().min(1).max(100),
    tipo_leccion: Joi.string().required().min(1).max(100),
    tipo_pregunta: Joi.string().required().min(1).max(100),
    tiempo_estimado: Joi.number().min(1).required(),
    descripcion: Joi.string().min(1).required(),
    puntaje: Joi.number().min(1).required(),
    capitulo_id: Joi.number().min(1).required(),
    profesor_id: Joi.number().min(1).required(),
    pregunta_raiz: Joi.number().min(1),
    idMongo : Joi.required(),
});

module.exports.schema = schema;