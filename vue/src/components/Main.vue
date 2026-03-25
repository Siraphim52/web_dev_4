<template>
  <div class="main">
    <div class="main__header"></div>
    <div class="main__content">
      <div class="game-settings">
        <h1 class="game-settings__title">Пятнашки</h1>
        <h3 class="game-settings__size-label">Размер: {{ currentSize }} x {{ currentSize }}</h3>
        <input 
          type="range" 
          min="3" 
          max="5" 
          class="game-settings__slider"
          :value="currentSize" 
          @input="(event) => updateSize(event.target.value)"
        >
        <router-link :to="{ path: '/game', query: { size: currentSize, mode: 'classic' } }" class="game-settings__link">
          <button class="game-settings__button">Классический режим</button>
        </router-link>
        <router-link :to="{ path: '/game', query: { size: currentSize, mode: 'block' } }" class="game-settings__link">
          <button class="game-settings__button">Режим с блоками</button>
        </router-link>
      </div>
      
      <Leaderboard />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Leaderboard from '@/components/Leaderboard.vue'

export default {
  components: {
    Leaderboard
  },
  
  data() {
    return {
      currentSize: 4
    }
  },
  
  mounted() {
    this.loadRecords()
  },
  
  methods: {
    ...mapActions('records', ['loadRecords']),
    
    updateSize(size) {
      this.currentSize = Number(size)
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main {
  min-height: 100vh;
  background-color: #b3fff1;

  &__header {
    height: 20vh;
  }

  &__content {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
    padding: 0 20px;
  }
}

.game-settings {
  display: flex;
  text-align: center;
  flex-direction: column;
  width: 320px;
  border: solid;
  border-radius: 5px;
  padding: 25px;
  gap: 15px;
  background: white;

  &__title {
    font-size: 36px;
  }

  &__size-label {
    font-size: 20px;
  }

  &__slider {
    width: 100%;
  }

  &__button {
    width: 100%;
    background-color: teal;
    padding: 14px;
    border-radius: 15px;
    border: none;
    font-size: 18px;
    color: white;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: #006d6d;
    }
  }

  &__link {
    text-decoration: none;
  }
}
</style>