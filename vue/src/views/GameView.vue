<template>
  <div class="main">
    <div class="game__layout">
      <div class="game__area">
        <div class="game__header">
          <Timer 
            v-if="!isWin"
            :isWin="isWin" 
            @time-update="(time) => updateTime(time)" 
          />
          <SuperTurn 
            v-if="!isWin"
            :isWin="isWin"
            @activate-super-mode="activateSuperMode()"
          />
        </div>

        <GameBoard
          v-if="!isWin"
          :cells="cells"
          :size="size"
          :blocked-index="blockedIndex"
          :super-mode="superMode"
          @move="(index) => moveTile(index)"
          @super-move="(index) => superMoveTile(index)"
        />

        <GameWin 
          v-else 
          @save-record="() => saveRecord()" 
          :time="elapsedTime" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import GameBoard from '@/components/GameBoard.vue';
import GameWin from '@/components/GameWin.vue';
import Timer from '@/components/Timer.vue';
import SuperTurn from '@/components/SuperTurn.vue';

import classicMode from '@/modes/classicMode';

export default {
  components: {
    GameBoard,
    GameWin,
    Timer,
    SuperTurn
  },
  
  data() {
    return {
      size: Number(this.$route.query.size) || 4,
      mode: this.$route.query.mode || 'classic',
      blockedIndex: null,
      cells: [],
      isWin: false,
      elapsedTime: 0,
      superMode: false,
    }
  },
  
  mounted() {
    this.createBoard()
    
    if(this.mode === 'block') {
      this.blockedIndex = classicMode.checkNewRandomDirection.call(this, this.cells.indexOf(null))
    }
  },
  
  methods: {
    ...classicMode,
    
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
    
    activateSuperMode() {
      this.superMode = true
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

            if(this.mode === 'block') {
              this.blockedIndex = classicMode.checkNewRandomDirection.call(this, this.cells.indexOf(null))
            }

            if (this.checkWin()) {
              this.isWin = true
            }
            break
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.game {

  &__layout {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  &__area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  &__header {
    display: flex;
    gap: 20px;
    align-items: center;
  }
}
</style>