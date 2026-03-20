<template>
  <div 
    class="super-turn" 
    :class="{ 'super-turn--ready': isReady }" 
    @click="useSuperTurn()"
  >
    <span v-if="isReady" class="super-turn__text">Супер ход - готов!</span>
    <span v-else class="super-turn__cooldown">Супер ход: {{ cooldown }}с</span>
  </div>
</template>

<script>
export default {
  name: 'SuperTurn',
  
  props: {
    isWin: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['activate-super-mode'],
  
  data() {
    return {
      isReady: true,
      cooldown: 0,
      cooldownTimer: null
    }
  },
  
  watch: {
    isWin(newVal) {
      if (newVal && this.cooldownTimer) {
        clearInterval(this.cooldownTimer)
      }
    }
  },
  
  beforeUnmount() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  },
  
  methods: {
    useSuperTurn() {
      if (this.isReady) {
        this.$emit('activate-super-mode')
        this.isReady = false
        this.startCooldown()
      }
    },
    
    startCooldown() {
      this.cooldown = 60

      this.cooldownTimer = setInterval(() => {
        this.cooldown--

        if (this.cooldown <= 0) {
          clearInterval(this.cooldownTimer)
          this.isReady = true
          this.cooldown = 0
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
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

  &--ready {
    background: #ff9800;
    color: white;
    border-color: #ff9800;

    &:hover {
      background: #ff9800;
    }
  }
}
</style>