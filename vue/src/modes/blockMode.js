import classicMode from '@/modes/classicMode'

export default {

  setBlockedCell() {
    const emptyIndex = this.cells.indexOf(null)
    this.blockedIndex = classicMode.checkNewRandomDirection.call(this, emptyIndex)
  }

}