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
            @activate-super-mode="() => activateSuperMode()"
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
import { mapGetters, mapActions } from 'vuex'
import GameBoard from '@/components/GameBoard.vue'
import GameWin from '@/components/GameWin.vue'
import Timer from '@/components/Timer.vue'
import SuperTurn from '@/components/SuperTurn.vue'

export default {
  components: {
    GameBoard,
    GameWin,
    Timer,
    SuperTurn
  },
  
  data() {
    return {
      sizeFromRoute: null,
      modeFromRoute: null
    }
  },
  
  computed: {
    ...mapGetters('game', {
      cells: 'getCells',
      size: 'getSize',
      blockedIndex: 'getBlockedIndex',
      isWin: 'isWin',
      elapsedTime: 'getElapsedTime',
      superMode: 'isSuperMode'
    })
  },
  
  created() {
    this.sizeFromRoute = Number(this.$route.query.size) || 4
    this.modeFromRoute = this.$route.query.mode || 'classic'
    
    this.initializeGame({
      size: this.sizeFromRoute,
      mode: this.modeFromRoute
    })
  },
  
  methods: {
    ...mapActions('game', [
      'initializeGame',
      'updateTime',
      'activateSuperMode',
      'moveTile',
      'superMoveTile'
    ]),
    ...mapActions('records', ['saveRecord']),
    
    saveRecord() {
      this.saveRecord({
        time: this.elapsedTime,
        mode: this.modeFromRoute,
        size: this.sizeFromRoute
      })
      alert('Рекорд сохранен!')
      this.$router.push('/')
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