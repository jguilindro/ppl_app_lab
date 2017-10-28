import * as types from './mutations-types'

export const increment = (state) => {
  state.count = state.count + 1
  state.history.push(types.INCREMENT)
}

export const decrement = (state) => {
  state.count = state.count - 1
  state.history.push(types.DECREMENT)
}

export const CARGAR_ESTUDIANTE = (state, data) => {
  state.estudiante = data
}
