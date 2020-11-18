<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const res = await this.$api.getFolder()
      console.log(res)
    }
  }
}
</script>
