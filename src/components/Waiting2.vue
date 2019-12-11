<template>
  <div style="text-align:center">
    等待中...
    <!-- <button @click="out">退出</button> -->
  </div>
</template>
<script>
export default {
  name: 'Waiting2',
  data() {
    return {
      session: null,
      timer: null
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    this.logIn()
      this.timer = setInterval(() => {
        this.logIn()
      }, 60 * 1000)
  },
  methods: {
    logIn() {
      const _this = this
      setTimeout(() => {
        const appId = '5ff80b05a5bb45eeadcda871371d4b45'
        const token = '_no_need_token'
        // eslint-disable-next-line no-undef
        const signal = Signal(appId)
        var session = null;
        session = signal.login(2, token, 10, 30)
        this.session = session
        window.onbeforeunload = (event) => {
          // session.logout()
          return undefined
        }
        session.onLoginSuccess = function () {
          console.log('login')
        }
        session.onInviteReceived = function (call) {
          console.log('邀请了')
            call.channelInviteAccept()
            let channel = session.channelJoin(call.channelName)
            console.log(call, call.channelName)
            window.channelName = call.channelName
            window.sessionStorage.setItem('channelName', call.channelName)
            window.channel = channel
            _this.$router.push({
              path: '/SceneGuidance',
              query: {
                id: 2
              }
            })
        }
        session.onLogout = function (reson) {
          console.log(reson, '退出  登出')

        }
      }, 1000);
    },
    out() {
      this.session.logout()
    }
  }
}
</script>
<style >
body {
  margin: 0;
  padding: 0;
}
div {
  height: 100vh;
  line-height: 100vh;
  font-size: 50px;
  background: rgb(240, 255, 255);
}
</style>