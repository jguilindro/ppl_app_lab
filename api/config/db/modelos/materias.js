let mongoose = require('mongoose')
let db = require('mongoose')

const shortid = require('shortid')
mongoose.Promise = global.Promise

const MateriasSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombre: { type: String },
  codigo: { type: String }
},{ timestamps: false, versionKey: false, collection: 'materias' })

MateriasSchema.virtual('id').get(function(){
    return this._id
})

MateriasSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

MateriasSchema.methods = {
  Crear () {
    let self = this
    return Promise.resolve(self.save())
  }
}

MateriasSchema.statics = {
  ObtenerTodos () {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({}))
    })
  },
  Eliminar (id) {
    const self = this
    return new Promise(function(resolve) {
      self.findOneAndRemove({ _id: id }).then((accionEstado) => {
        resolve(accionEstado ? true : false)
      })
    })
  },
  Actualizar ({ id, nombre, codigo }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: id }, {$set: { nombres, codigo }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  }
}

module.exports = db.model('Materias', MateriasSchema)