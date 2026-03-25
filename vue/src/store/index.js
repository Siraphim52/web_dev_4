import { createStore } from 'vuex'
import gameModule from './modules/gameModule'
import recordsModule from './modules/recordsModule'

export default createStore({
  modules: {
    game: gameModule,
    records: recordsModule
  }
})