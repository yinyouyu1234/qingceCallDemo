<template>
  <div id="app">
    <button id="app-btn">按钮</button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {

    }
  },
  created() {


  },
  mounted() {
    document.getElementById('app-btn').addEventListener('click', () => {
      console.log('点击了！')
    })
    setInterval(() => {
      document.getElementById('app-btn').click()
    }, 300)
  }
}
</script>

<style>
button {
  opacity: 0;
  position: absolute;
}
</style>
