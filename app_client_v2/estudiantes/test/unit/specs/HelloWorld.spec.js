import Vue from 'vue'
import Lecciones from '@/components/Lecciones'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Lecciones)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('h1').textContent)
      .toEqual('hello')
  })
})
