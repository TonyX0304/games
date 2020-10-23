<template>
  <div>
    <div class="game-box">
      <ul v-for="(ul, uIndex) in list" :key="uIndex" :data-row="uIndex+1">
        <li v-for="(li, lIndex) in ul"  :key="lIndex"  :data-col="lIndex+1"> 
          <div class="piece" :class="[curPlayer === 'p1' ? 'whiting' : 'blacking', {white: li.value === 'p1'}, {black: li.value === 'p2'} ]" @click="playing(li)" />
          <!-- {{ lIndex + 1 }} -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Gobang',
  data() {
    return {
      list: [],
      xLength: 15,
      yLength: 15,
      curPlayer: 'p1'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      for(let i=0; i< this.xLength; i++) {
        const item = []
        for(let j=0; j< this.yLength; j++) {
          item.push({
            x: i+1,
            y: j+1,
            value: null
          })
        }
        this.list.push(item)
      }
    },
    playing(item) {
      if (item.value) {
        return
      } else {
        item.value = this.curPlayer
        this.isOver(item)
        this.curPlayer = this.curPlayer === 'p1' ? 'p2' : 'p1'
      }
    },
    isOver(item) {
      console.log(111)
      // 横向试探
      const xmin = item.x - 4
      const xMax = item.x + 4
      const leftStep = 4 - 0
    }
  }
}
</script>

<style lang="stylus" scoped>
  .game-box
    margin 20px auto
    width 800px
    background-color #d6b594
    padding 50px 20px
    ul
      list-style none
      padding 0
      margin 0
      display flex
      width 100%
      justify-content center
      &:last-child
        li
          border-left 0
          height 0
      li
        font-size 14px
        display inline-flex
        width 50px
        height 50px
        position relative
        border-left 1px solid #aaa
        border-top 1px solid #aaa
        box-sizing border-box
        &:last-child
          border-top 0
          width 0
        .piece
          display block
          content ''
          // background-color red
          transition all 0.3s
          position absolute
          width 25px
          height 25px
          border-radius 50%
          top 0
          left 0
          transform translate(-50%, -50%)
          cursor pointer
          &.whiting:not(.white):not(.black)
            &:hover
              background-color rgba(255,255,255,0.6)
          &.blacking:not(.white):not(.black)
            &:hover
              background-color rgba(0,0,0,0.6)
          &.white
            background-color #fff
            cursor not-allowed
          &.black
            background-color #000
            cursor not-allowed
</style>
