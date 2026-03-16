<template>
  <div class="leaderboard">
    <h3>Таблица рекордов</h3>
    
    <div class="mode-tabs">
      <button 
        v-for="mode in modes" 
        :key="mode.value"
        :class="{ active: currentMode === mode.value }"
        @click="currentMode = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="size-tabs">
      <button 
        v-for="size in availableSizes" 
        :key="size"
        :class="{ active: currentSize === size }"
        @click="currentSize = size"
      >
        {{ size }}x{{ size }}
      </button>
    </div>

    <div class="records-list" v-if="filteredRecords.length">
      <div 
        v-for="(record, index) in filteredRecords" 
        :key="record.id"
        class="record-item"
        :class="{ 'best': index === 0 }"
      >
        <span class="position">{{ index + 1 }}</span>
        <span class="time">{{ formatTime(record.time) }}</span>
        <span class="date">{{ formatDate(record.date) }}</span>
      </div>
    </div>

    <div v-else class="no-records">
      Нет рекордов для этого режима и размера
    </div>

    <button v-if="filteredRecords.length" @click="clearRecords" class="clear-btn">
      Очистить рекорды
    </button>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  props: {
    records: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      currentMode: 'classic',
      currentSize: 4,
      modes: [
        { value: 'classic', label: 'Классический' },
        { value: 'block', label: 'С блоками' }
      ],
      availableSizes: [3, 4, 5]
    }
  },
  computed: {
    filteredRecords() {
      return this.records
        .filter(r => r.mode === this.currentMode && r.size === this.currentSize)
        .sort((a, b) => a.time - b.time)
        .slice(0, 10)
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      const ms = Math.floor((seconds % 1) * 100)
      return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString()
    },
    clearRecords() {
      if (confirm('Очистить все рекорды?')) {
        this.$emit('clear')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.leaderboard {
  background: white;
  border-radius: 10px;
  padding: 15px;
  min-width: 280px;
  max-height: 400px;
  overflow-y: auto;

  h3 {
    margin: 0 0 15px 0;
    color: #333;
    text-align: center;
  }

  .mode-tabs,
  .size-tabs {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;

    button {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 5px;
      background: #f0f0f0;
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: #00639b;
        color: white;
      }
    }
  }

  .records-list {
    margin-top: 15px;

    .record-item {
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #eee;
      font-size: 14px;

      &.best {
        background: #fff3cd;
        font-weight: bold;
      }

      .position {
        width: 30px;
        color: #666;
      }

      .time {
        flex: 1;
        font-family: monospace;
      }

      .date {
        color: #999;
        font-size: 12px;
      }
    }
  }

  .no-records {
    text-align: center;
    color: #999;
    padding: 20px;
  }

  .clear-btn {
    width: 100%;
    margin-top: 15px;
    padding: 8px;
    border: none;
    border-radius: 5px;
    background: red;
    color: white;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #c82333;
    }
  }
}
</style>