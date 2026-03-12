<template>
  <div class="main">
    <div class="header"></div>
    <div class="content">
      <div class="base">
        <h1>Пятнашки</h1>
        <h3>Размер: {{ size }} x {{ size }}</h3>
        <input type="range" min="3" max="5" v-bind:value="size" @input="inputValue">
        <router-link :to="{ path: '/game', query: { size: size, mode: 'classic' } }">
          <button class="btn">Классический режим</button>
        </router-link>
        <router-link :to="{ path: '/game', query: { size: size, mode: 'block' } }">
          <button class="btn">Режим с блоками</button>
        </router-link>
      </div>
      
      <Leaderboard 
        :records="records" 
        @clear="clearAllRecords"
      />
    </div>
  </div>
</template>

<script>
import Leaderboard from '@/components/Leaderboard.vue'

export default {

  components: {
    Leaderboard
  },

  data() {
    return {
      size: this.$route.query.size || 4,
      mode: this.$route.query.mode || "classic",
      records: []
    }      
  },

  mounted() {
    this.loadRecords()
  },

  methods: {

    inputValue(event) {
      this.size = event.target.value;
    },

    loadRecords() {
      const saved = localStorage.getItem('puzzleRecords')
      this.records = saved ? JSON.parse(saved) : []
    },

    clearAllRecords() {
      localStorage.removeItem('puzzleRecords')
      this.records = []
    }
    
  }
}
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .main {
        min-height: 100vh;
        background-color: #b3fff1;
    }

    .header {
        height: 20vh;
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 30px;
        padding: 0 20px;
    }

    .base {
        display: flex;
        text-align: center;
        flex-direction: column;
        width: 320px;
        border: solid;
        border-radius: 5px;
        padding: 25px;
        gap: 15px;
        background: white;
    }

    h1 {
        font-size: 36px;
    }

    h3 {
        font-size: 20px;
    }

    input[type="range"] {
        width: 100%;
    }

    .btn {
        width: 100%;
        background-color: teal;
        padding: 14px;
        border-radius: 15px;
        border: none;
        font-size: 18px;
        color: white;
        cursor: pointer;
        transition: background 0.2s;
    }

    .btn:hover {
        background-color: #006d6d;
    }
</style>