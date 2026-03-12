export default {
    createBoard() {

      for (let i = 1; i < this.size * this.size; i++) {
        this.cells.push(i);
      }
      this.cells.push(null);

      this.shuffle(this.cells);
    },

    checkNewRandomDirection(startIndex, directions = [this.size, -this.size, 1, -1]) {

      let direction = directions[Math.floor(Math.random() * directions.length)]
      let newIndex = startIndex + direction

        while (
          newIndex < 0 ||
          newIndex >= this.size * this.size ||
          (direction === 1 && startIndex % this.size === this.size - 1) ||
          (direction === -1 && startIndex % this.size === 0)
        ) {
          direction = directions[Math.floor(Math.random() * directions.length)]
          newIndex = startIndex + direction
        }

      return newIndex
    },

    shuffle(array) {

      let startIndex = this.size * this.size - 1

      for (let i = 0; i < Math.pow(this.size, 3); i++) {

        const newIndex = this.checkNewRandomDirection(startIndex)

        const temp = array[startIndex]
        array[startIndex] = array[newIndex]
        array[newIndex] = temp

        startIndex = newIndex
      }

    },

    checkWin() {

      for (let i = 0; i < this.cells.length - 1; i++) {
        if (this.cells[i] !== i + 1) return false
      }

      return this.cells[this.cells.length - 1] === null
    }
}