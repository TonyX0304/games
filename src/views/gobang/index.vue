<template>
  <div class="game-box">
    <button @click="reset">重新开始</button>
    <ul class="player-list">
      <h2>
        {{ winner ? '获胜方为：' : '落子方：' }}
      </h2>
      <li v-if="winner" :class="winner === 'p1' ? 'white' : 'black'" />
      <template v-else>
        <li class="whiting" v-show="curPlayer === 'p1'"/>
        <li class="black" v-show="curPlayer === 'p2'" />
      </template>
    </ul>
    <ul v-for="(ul, uIndex) in list" :key="uIndex" :data-row="uIndex+1" class="list-box">
      <li v-for="(li, lIndex) in ul"  :key="lIndex"  :data-col="lIndex+1"> 
        <div 
          class="piece" 
          :class="[curPlayer === 'p1' ? 'whiting' : 'blacking', 
            {'white': li.value === 'p1'}, 
            {'black': li.value === 'p2'}, 
            {'active': li.success}, 
            {'disabled': winner} 
          ]" 
          @click="playing(li)" 
        />
        <!-- {{ uIndex+','+lIndex }} -->
      </li>
    </ul>
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
      curPlayer: 'p2',
      winner: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.list = []
      for(let i=0; i< this.yLength; i++) {
        const item = []
        for(let j=0; j< this.xLength; j++) {
          item.push({
            x: j,
            y: i,
            value: null
          })
        }
        this.list.push(item)
      }
    },
    playing(item) {
      if (item.value || this.winner) {
        return
      } else {
        item.value = this.curPlayer
        this.check(item)
        this.curPlayer = this.curPlayer === 'p1' ? 'p2' : 'p1'
      }
    },
    check(item) {
      const xMin = item.x - 4
      const xMax = item.x + 4
      const yMin = item.y - 4
      const xList = [] // 横向
      const yList = [] // 纵向
      const rotatePList = [] // 正向倾斜
      const rotateMList = [] // 负向倾斜
      for (let i=0; i < 9; i++) {
        const curXMin = xMin + i, curYMin = yMin + i
        const curXMax = xMax - i
        if(curXMin >= 0 && curXMin <= this.xLength -1) {
          xList.push({x: curXMin, y: item.y}) // 横向
          if(curYMin >= 0 && curYMin <= this.yLength -1) {
            rotateMList.push({x: curXMin, y: curYMin}) //  负向倾斜
          }
        }

        if(curYMin >= 0 && curYMin <= this.yLength -1) {
          yList.push({x: item.x, y: curYMin}) // 纵向
          if(curXMax >= 0 && curXMax <= this.xLength -1) {
            rotatePList.push({x: curXMax, y: curYMin}) // 正向倾斜
          }
        }
      }
      // console.log(xList, yList, rotatePList, rotateMList)
      const testXlist = this.isOver(xList, item)
      if(testXlist) {
        return
      }
      const testYlist = this.isOver(yList, item)
      if(testYlist) {
        return
      }
      const testRPlist = this.isOver(rotatePList, item)
      if(testRPlist) {
        return
      }
      this.isOver(rotateMList, item)
      // console.log(testXlist, testYlist, testRPlist, testRMlist)
    },
    /**
     * 查看数组中是否有5个连续的值与当前元素值一致
     */
    isOver(list, item) {
      if(list.length < 5) {
        return
      }
      let num = 0
      let lastIndex = null // 记录最后一个满足条件的索引
      for (let i=0; i < list.length; i++) {
        const element = list[i]
        if(this.list[element.y][element.x].value === item.value) {
          num++
          if(num === 5) {
            lastIndex = i
            break
          }
        } else {
          num = 0
        }
      }
      // 标记处满足条件的选项
      if(lastIndex && num >= 5) {
        list.forEach((element, index) => {
          if(index >= lastIndex - 4 && index <= lastIndex ) {
            this.list[element.y][element.x].success = true
          }
        })
        this.winner = item.value
      }
      return num >= 5
    },
    reset() {
      this.winner = null
      this.init()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .game-box
    margin 20px auto
    background-color #d6b594
    padding 20px 20px 50px
    ul
      list-style none
      padding 0
      margin 0
    ul.player-list
      display flex
      justify-content center
      margin-bottom 10px
      align-items center
      li
        width 26px
        height 26px
        border-radius 50%
        list-style none 
        background-color #fff
        &.black
          background-color #000
    ul.list-box
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
        width 40px
        height 40px
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
          &.whiting:not(.white):not(.black):not(.disabled)
            &:hover
              background-color rgba(255,255,255,0.6)
          &.blacking:not(.white):not(.black):not(.disabled)
            &:hover
              background-color rgba(0,0,0,0.6)
          &.white
            background-color #fff
            cursor not-allowed
          &.black
            background-color #000
            cursor not-allowed
          &.active
            border 3px solid green
</style>
