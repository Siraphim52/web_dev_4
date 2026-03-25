const STORAGE_KEY = 'puzzleRecords'

const MUTATIONS = {
  SET_RECORDS: 'SET_RECORDS',
  ADD_RECORD: 'ADD_RECORD',
}

export default {
  namespaced: true,

  state: () => ({
    records: [],
  }),

  mutations: {
    [MUTATIONS.SET_RECORDS]: (state, records) => {
      state.records = records
    },

    [MUTATIONS.ADD_RECORD]: (state, record) => {
      state.records.push(record)
    },
  },

  getters: {
    getAllRecords: (state) => state.records,

    getFilteredRecords: (state) => (mode, size) => {
      return state.records
        .filter(r => r.mode === mode && r.size === size)
        .sort((a, b) => a.time - b.time)
        .slice(0, 10)
    },
  },

  actions: {
    loadRecords: ({ commit }) => {
      const saved = localStorage.getItem(STORAGE_KEY)
      const records = saved ? JSON.parse(saved) : []
      commit(MUTATIONS.SET_RECORDS, records)
    },

    saveRecord: ({ commit, state }, { time, mode, size }) => {
      const newRecord = {
        id: Date.now(),
        time: time,
        mode: mode,
        size: size,
        date: Date.now(),
      }

      const updatedRecords = [...state.records, newRecord]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords))
      commit(MUTATIONS.SET_RECORDS, updatedRecords)

      return newRecord
    },

    clearAllRecords: ({ commit }) => {
      localStorage.removeItem(STORAGE_KEY)
      commit(MUTATIONS.SET_RECORDS, [])
    },
  },
}