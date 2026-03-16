<template>
  <div class="timer">
    <span class="timer__display">{{ formattedTime }}</span>
  </div>
</template>

<script>
export default {
  props: {
    isWin: { type: Boolean, default: false }
  },
  data() {
    return {
      elapsed: 0,
      timerId: null,
      startTime: null
    }
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.elapsed / 60)
      const seconds = Math.floor(this.elapsed % 60)
      const milliseconds = Math.floor((this.elapsed % 1) * 100)
      
      if (minutes > 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
      } else {
        return `${seconds}.${milliseconds.toString().padStart(2, '0')} s`
      }
    }
  },
  mounted() {
    this.startTimer()
  },
  watch: {
    isWin(newVal) {
      if (newVal) {
        this.stopTimer()
      }
    }
  },
  methods: {
    startTimer() {
      this.startTime = Date.now() - this.elapsed * 1000
      
      this.timerId = setInterval(() => {
        this.elapsed = (Date.now() - this.startTime) / 1000
        this.$emit('time-update', this.elapsed)
      }, 10)
    },
    stopTimer() {
      clearInterval(this.timerId)
      this.timerId = null
    }
  },
  beforeUnmount() {
    this.stopTimer()
  }
}
</script>

<style scoped lang="scss">
.timer {
  font-size: 24px;
  padding: 10px 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  background: white;
}
</style>