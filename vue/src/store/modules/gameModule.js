const MUTATIONS = {
  SET_SIZE: 'SET_SIZE',
  SET_MODE: 'SET_MODE',
  SET_CELLS: 'SET_CELLS',
  SET_BLOCKED_INDEX: 'SET_BLOCKED_INDEX',
  SET_WIN: 'SET_WIN',
  SET_ELAPSED_TIME: 'SET_ELAPSED_TIME',
  SET_SUPER_MODE: 'SET_SUPER_MODE',
  SET_GAME_STARTED: 'SET_GAME_STARTED',
  MOVE_TILE: 'MOVE_TILE',
  RESET_GAME: 'RESET_GAME',
}

const checkNewRandomDirection = (size, startIndex, directions = [size, -size, 1, -1]) => {
  let direction = directions[Math.floor(Math.random() * directions.length)]
  let newIndex = startIndex + direction

  while (
    newIndex < 0 ||
    newIndex >= size * size ||
    (direction === 1 && startIndex % size === size - 1) ||
    (direction === -1 && startIndex % size === 0)
  ) {
    direction = directions[Math.floor(Math.random() * directions.length)]
    newIndex = startIndex + direction
  }

  return newIndex
}

export default {
  namespaced: true,

  state: () => ({
    size: 4,
    mode: 'classic',
    cells: [],
    blockedIndex: null,
    isWin: false,
    elapsedTime: 0,
    superMode: false,
    isGameStarted: false,
  }),

  mutations: {
    [MUTATIONS.SET_SIZE]: (state, size) => {
      state.size = size
    },

    [MUTATIONS.SET_MODE]: (state, mode) => {
      state.mode = mode
    },

    [MUTATIONS.SET_CELLS]: (state, cells) => {
      state.cells = [...cells]
    },

    [MUTATIONS.SET_BLOCKED_INDEX]: (state, index) => {
      state.blockedIndex = index
    },

    [MUTATIONS.SET_WIN]: (state, isWin) => {
      state.isWin = isWin
    },

    [MUTATIONS.SET_ELAPSED_TIME]: (state, time) => {
      state.elapsedTime = time
    },

    [MUTATIONS.SET_SUPER_MODE]: (state, isActive) => {
      state.superMode = isActive
    },

    [MUTATIONS.SET_GAME_STARTED]: (state, isStarted) => {
      state.isGameStarted = isStarted
    },

    [MUTATIONS.MOVE_TILE]: (state, { fromIndex, toIndex }) => {
      const newCells = [...state.cells]
      newCells[toIndex] = newCells[fromIndex]
      newCells[fromIndex] = null
      state.cells = newCells
    },

    [MUTATIONS.RESET_GAME]: (state) => {
      state.isWin = false
      state.elapsedTime = 0
      state.superMode = false
      state.isGameStarted = false
      state.blockedIndex = null
      state.cells = []
    },
  },

  getters: {
    getSize: (state) => state.size,
    getMode: (state) => state.mode,
    getCells: (state) => state.cells,
    getBlockedIndex: (state) => state.blockedIndex,
    isWin: (state) => state.isWin,
    getElapsedTime: (state) => state.elapsedTime,
    isSuperMode: (state) => state.superMode,
    isGameStarted: (state) => state.isGameStarted,
  },

  actions: {
    initializeGame: ({ commit, dispatch }, { size, mode }) => {
      commit(MUTATIONS.RESET_GAME)
      commit(MUTATIONS.SET_SIZE, size)
      commit(MUTATIONS.SET_MODE, mode)
      dispatch('createBoard')
      commit(MUTATIONS.SET_GAME_STARTED, true)
    },

    createBoard: ({ commit, state }) => {
      const cells = []
      const size = state.size

      for (let i = 1; i < size * size; i++) {
        cells.push(i)
      }
      cells.push(null)

      let startIndex = size * size - 1

      for (let i = 0; i < Math.pow(size, 3); i++) {
        const newIndex = checkNewRandomDirection(size, startIndex)

        const temp = cells[startIndex]
        cells[startIndex] = cells[newIndex]
        cells[newIndex] = temp

        startIndex = newIndex
      }

      commit(MUTATIONS.SET_CELLS, cells)

      if (state.mode === 'block') {
        const emptyIndex = cells.indexOf(null)
        const blockedIndex = checkNewRandomDirection(size, emptyIndex)
        commit(MUTATIONS.SET_BLOCKED_INDEX, blockedIndex)
      }
    },

    moveTile: ({ commit, state, dispatch }, clickedIndex) => {
      const emptyIndex = state.cells.findIndex(cell => cell === null)
      const emptyRow = Math.floor(emptyIndex / state.size)
      const emptyCol = emptyIndex % state.size
      const clickedRow = Math.floor(clickedIndex / state.size)
      const clickedCol = clickedIndex % state.size

      const isAdjacent = (Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol)) === 1

      if (isAdjacent && clickedIndex !== state.blockedIndex) {
        commit(MUTATIONS.MOVE_TILE, { fromIndex: clickedIndex, toIndex: emptyIndex })

        if (state.mode === 'block') {
          const newEmptyIndex = state.cells.indexOf(null)
          const newBlockedIndex = checkNewRandomDirection(state.size, newEmptyIndex)
          commit(MUTATIONS.SET_BLOCKED_INDEX, newBlockedIndex)
        }

        dispatch('checkWin')
      }
    },

    superMoveTile: ({ commit, state, dispatch }, clickedIndex) => {
      const emptyIndex = state.cells.findIndex(cell => cell === null)

      if (emptyIndex !== -1 && clickedIndex !== emptyIndex && clickedIndex !== state.blockedIndex) {
        commit(MUTATIONS.MOVE_TILE, { fromIndex: clickedIndex, toIndex: emptyIndex })

        if (state.mode === 'block') {
          const newEmptyIndex = state.cells.indexOf(null)
          const newBlockedIndex = checkNewRandomDirection(state.size, newEmptyIndex)
          commit(MUTATIONS.SET_BLOCKED_INDEX, newBlockedIndex)
        }

        dispatch('checkWin')
      }

      commit(MUTATIONS.SET_SUPER_MODE, false)
    },

    checkWin: ({ commit, state }) => {
      for (let i = 0; i < state.cells.length - 1; i++) {
        if (state.cells[i] !== i + 1) return false
      }

      const isWin = state.cells[state.cells.length - 1] === null

      if (isWin) {
        commit(MUTATIONS.SET_WIN, true)
      }

      return isWin
    },

    updateTime: ({ commit }, time) => {
      commit(MUTATIONS.SET_ELAPSED_TIME, time)
    },

    activateSuperMode: ({ commit }) => {
      commit(MUTATIONS.SET_SUPER_MODE, true)
    },

    resetGame: ({ dispatch, state }) => {
      dispatch('initializeGame', {
        size: state.size,
        mode: state.mode,
      })
    },
  },
}