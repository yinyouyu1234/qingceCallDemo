import Vue from 'vue'
import Router from 'vue-router'
import Waiting2 from '@/components/Waiting2'
import Waiting1 from '@/components/Waiting1'
import SceneGuidance from '@/components/SceneGuidance'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/b',
      name: 'Waiting2',
      component: Waiting2
    },
    {
      path: '/a',
      name: 'Waiting1',
      component: Waiting1
    },
    {
      path: '/SceneGuidance',
      name: 'SceneGuidance',
      component: SceneGuidance
    }
  ]
})
