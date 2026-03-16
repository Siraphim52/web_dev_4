<template>
  <div class="board" :style="{ '--board-size': size }">
    <div
      class="board__cell"
      v-for="(item, index) in cellsWithClasses"
      :key="index"
      :class="item.classes"
      @click="handleClick(index)"
    >
      {{ item.value }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cells: Array,
    size: Number,
    blockedIndex: Number,
    superMode: Boolean
  },
  emits: ['move', 'super-move'],
  
  computed: {
    cellsWithClasses() {
      return this.cells.map((cell, index) => ({
        value: cell,
        classes: this.getCellClasses(index, cell)
      }))
    }
  },
  
  methods: {
    handleClick(index) {
      if (index === this.blockedIndex) {
        return;
      }

      if (this.superMode) {
        this.$emit('super-move', index)
      } else {
        this.$emit('move', index)
      }
    },
    
    getCellClasses(index, cell) {
      const isEmpty = cell === null
      const isBlocked = index === this.blockedIndex
      const isSuperModeActive = this.superMode && !isEmpty && !isBlocked
      
      return {
        'board__cell--empty': isEmpty,
        'board__cell--blocked': isBlocked,
        'board__cell--super-mode': isSuperModeActive
      }
    }
  }
}
</script>

<style lang="scss">
@use "@/assets/styles/main.scss" as *;

.board {
  display: grid;
  grid-template-columns: repeat(var(--board-size), 1fr);
  gap: 5px;
  padding: 5px;
  background-color: $bg-color;
  border-radius: 10px;

  &__cell {
    width: calc(90vw / var(--board-size));
    aspect-ratio: 1;
    max-width: 80px;
    min-width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(2vw + 10px);
    color: white;
    background-color: #00639b;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      background: #004c75;
    }

    &--empty {
      background: transparent;
      cursor: default;

      &:hover {
        background: $bg-color;
      }
    }

    &--blocked {
      background: red;
      cursor: not-allowed;
      opacity: 0.8;

      &:hover {
        background: red;
      }
    }

    &--super-mode:hover {
      background: #ff9800;
      box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
    }
  }
}
</style>