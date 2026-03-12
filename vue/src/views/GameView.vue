<template>
  <div class="main">
    <div class="game-layout">
      <div class="game-area">
        <div class="game-header">
          <Timer :isWin="isWin" @time-update="updateTime" />
          <div class="super-turn" :class="{ 'ready': superTurnReady }" @click="useSuperTurn">
            <span v-if="superTurnReady">Супер ход - готов!</span>
            <span v-else>Супер ход: {{ superTurnCooldown }}с</span>
          </div>
        </div>

        <GameBoard
          v-if="!isWin"
          :cells="cells"
          :size="size"
          :blockedIndex="blockedIndex"
          :super-mode="superMode"
          @move="moveTile"
          @super-move="superMoveTile"
        />

        <GameWin v-else @save-record="saveRecord" :time="elapsedTime" />
      </div>
    </div>
  </div>
</template>

<script>
import GameBoard from '@/components/GameBoard.vue';
import GameWin from '@/components/GameWin.vue';
import Timer from '@/components/Timer.vue';

import classicMode from '@/modes/classicMode';
import blockMode from '@/modes/blockMode';

export default {
  components: {
    GameBoard,
    GameWin,
    Timer
  },
  
  data() {
    return {
      size: Number(this.$route.query.size) || 4,
      mode: this.$route.query.mode || 'classic',
      blockedIndex: null,
      cells: [],
      isWin: false,
      elapsedTime: 0,
      superTurnReady: true,
      superTurnCooldown: 0,
      superMode: false,
      cooldownTimer: null
    }
  },
  
  mounted() {
    this.createBoard()
    if(this.mode === 'block') this.setBlockedCell()
  },
  
  beforeUnmount() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  },
  
  methods: {
    ...classicMode,
    ...blockMode,
    
    updateTime(time) {
      this.elapsedTime = time
    },

    saveRecord() {
      const records = JSON.parse(localStorage.getItem('puzzleRecords') || '[]')
      
      const newRecord = {
        id: Date.now(),
        time: this.elapsedTime,
        mode: this.mode,
        size: this.size,
        date: Date.now()
      }

      records.push(newRecord)
      localStorage.setItem('puzzleRecords', JSON.stringify(records))
      alert('Рекорд сохранен!')
    },
    
    useSuperTurn() {
      if (this.superTurnReady) {
        this.superMode = true
        this.superTurnReady = false
        this.startCooldown()
      }
    },
    
    startCooldown() {

      this.superTurnCooldown = 60

      this.cooldownTimer = setInterval(() => {

        this.superTurnCooldown--

        if (this.superTurnCooldown <= 0) {
          clearInterval(this.cooldownTimer)
          this.superTurnReady = true
          this.superTurnCooldown = 0
        }
      }, 1000)
    },
    
    superMoveTile(index) {
      const emptyIndex = this.cells.findIndex(cell => cell === null)
      
      if (emptyIndex !== -1 && index !== emptyIndex) {
        
        this.cells[emptyIndex] = this.cells[index]
        this.cells[index] = null

        if(this.mode === 'block') this.setBlockedCell()

        if (this.checkWin()) {
          this.isWin = true
        }
      }
      
      this.superMode = false
    },
    
    moveTile(index) {
      const row = Math.floor(index / this.size)
      const col = index % this.size

      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
      ]

      for (const [dx, dy] of directions) {
        const newRow = row + dx
        const newCol = col + dy

        if (
          newRow >= 0 && newRow < this.size &&
          newCol >= 0 && newCol < this.size
        ) {
          const newIndex = newRow * this.size + newCol

          if (this.cells[newIndex] === null) {
            this.cells[newIndex] = this.cells[index]
            this.cells[index] = null

            if(this.mode === 'block') this.setBlockedCell()

            if (this.checkWin()) {
              this.isWin = true
            }
            break
          }
        }
      }
    }
  },
  
  watch: {
    isWin(newVal) {
      if (newVal && this.cooldownTimer) {
        clearInterval(this.cooldownTimer)
      }
    }
  }
}
</script>

<style scoped>
.game-layout {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.game-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.super-turn {
  font-size: 18px;
  padding: 10px 20px;
  border: 2px solid #ff9800;
  border-radius: 8px;
  background: white;
  color: #ff9800;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.super-turn.ready {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.super-turn.ready:hover {
  background: #ff9800;
}

</style>