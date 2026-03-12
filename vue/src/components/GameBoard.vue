<template>
  <div class="board" :style="{ '--size': size }">
    <div
      class="cell"
      v-for="(cell, index) in cells"
      :key="index"
      :class="{ 
        empty: cell === null, 
        blocked: index === blockedIndex,
        'super-mode': superMode && cell !== null && index !== blockedIndex
      }"
      @click="handleClick(index)"
    >
      {{ cell }}
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
  
  methods: {
    handleClick(index) {
      if (this.superMode) {
        this.$emit('super-move', index)
      } else {
        this.$emit('move', index)
      }
    }
  }
}
</script>

<style lang="scss">
@use "@/assets/styles/main.scss" as *;

.board {
  display: grid;
  grid-template-columns: repeat(var(--size), 1fr);
  gap: 5px;
  padding: 5px;
  background-color: $bg-color;
  border-radius: 10px;
}

.cell {
  width: calc(90vw / var(--size));
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
  user-select: none;
  transition: all 0.2s ease;

  &:hover:not(.empty):not(.blocked) {
    background: #004c75;
  }

  &.super-mode:hover {
    background: #ff9800;
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  }

  &.empty {
    background: transparent;
    cursor: default;
    
    &:hover {
      background: transparent;
      cursor: default;
    }
  }

  &.blocked {
    background: red;
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.8;
    
    &:hover {
      background: #cc0000;
      transform: none;
    }
  }
}
</style>