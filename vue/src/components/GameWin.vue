<template>
  <div class="win">
    <h2 class="win__title">Вы собрали пятнашки!</h2>
    <p class="win__time">Время: {{ formatTime(time) }}</p>
    
    <button @click="saveAndContinue" class="win__button win__button--save">
      Сохранить рекорд
    </button>

    <router-link to="/" class="win__link">
      <button class="win__button win__button--back">
        Вернуться на главную
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      const ms = Math.floor((seconds % 1) * 100)
      return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
    },
    saveAndContinue() {
      this.$emit('save-record')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/main.scss" as *;

.win {
  text-align: center;
  color: #000;
  
  &__time {
    font-size: 24px;
    margin: 20px 0;
    font-family: monospace;
  }
  
  &__button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    
    &--save {
      background-color: #28a745;
      color: white;
      
      &:hover {
        background-color: #218838;
      }
    }
    
    &--back {
      background-color: $button-color;
      
      &:hover {
        background-color: #ccc;
      }
    }
  }
  
  &__link {
    text-decoration: none;
  }
}
</style>