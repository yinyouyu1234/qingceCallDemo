<template>
  <div class="scene-guidance-wrapper">
    <div v-show="false" id="div_device" class="panel panel-default">
      <div class="select">
        <label for="audioSource">Audio source:</label>
        <select id="audioSource"></select>
      </div>
      <div class="select">
        <label for="videoSource">Video source:</label>
        <select id="videoSource"></select>
      </div>
    </div>
    <div v-show="false" id="video" style="margin:0 auto;">
      <div id="agora_local" style="float:right;width:210px;height:147px;display:inline-block;"></div>
    </div>
    <button style="opacity: 0;position:absolute" id="btn">点击</button>
      <div id="video" style="margin:0 auto;">
        <div
          id="agora_remote"
          style="width:100%;height:100vh;display:inline-block;background:	#F0FFFF;"
        ></div>
      </div>
  </div>
</template>
<script>
import AgoraRTC from "agora-rtc-sdk";
export default {
  name: "SceneGuidance",
  components: {
  },
  data() {
    return {
      url: `${this.api}/onSiteService/uploadAttachment`,
      appurl: `${this.appUrl}/guide/upload/1`,
      client: null,
      localStream: null,
    };
  },
  watch: {

  },
  created() {
  },
  mounted() {
    const _this = this;
    var audioSelect = document.querySelector("select#audioSource");
    var videoSelect = document.querySelector("select#videoSource");
    AgoraRTC.getDevices(function(devices) {
      for (var i = 0; i !== devices.length; ++i) {
        var device = devices[i];
        var option = document.createElement("option");
        option.value = device.deviceId;
        if (device.kind === "audioinput") {
          option.text =
            device.label || "microphone " + (audioSelect.length + 1);
          audioSelect.appendChild(option);
        } else if (device.kind === "videoinput") {
          option.text = device.label || "camera " + (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log("Some other kind of source/device: ", device);
        }
      }
    });
    AgoraRTC.Logger.error("this is error");
    AgoraRTC.Logger.warning("this is warning");
    AgoraRTC.Logger.info("this is info");
    setTimeout(() => {
      this.join();
    }, 3000);
  },
  methods: {
    join() {
      const _this = this,
        channel_key = null;

      _this.client = AgoraRTC.createClient({ mode: "live" });
      _this.client.init(
        "5ff80b05a5bb45eeadcda871371d4b45",
        function() {
          console.log("AgoraRTC _this.client initialized");
          _this.client.setClientRole(
            "host",
            function() {
              console.log("setHost success");
            },
            function(e) {
              console.log("setHost failed", e);
            }
          );
          console.log(Number(_this.$route.query.id), 5555555555)
          _this.client.join(
            channel_key,
            window.sessionStorage.getItem("channelName"),
            Number(_this.$route.query.id),
            function(uid) {
              console.log("User " + uid + " join channel successfully");
              console.log(
                videoSource,
                audioSource,
                "-----------------------------"
              );
              console.log(
                videoSource.value,
                audioSource.value,
                "-----------------------------"
              );
              var camera = videoSource.value;
              var microphone = audioSource.value;
              var localStream = AgoraRTC.createStream({
                streamID: uid,
                audio: false,
                microphoneId: microphone,
                video: false,
                screen: false
              });
              //localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
              if (document.getElementById("video").checked) {
              }

              // The user has granted access to the camera and mic.
              localStream.on("accessAllowed", function() {
                console.log("accessAllowed");
              });

              // The user has denied access to the camera and mic.
              localStream.on("accessDenied", function() {
                console.log("accessDenied");
              });

              localStream.init(
                function() {
                  console.log("getUserMedia successfully");
                  // localStream.play("agora_local");

                  // _this.client.publish(localStream, function(err) {
                  //   console.log("Publish local stream error: " + err);
                  // });

                  // _this.client.on("stream-published", function(evt) {
                  //   console.log("Publish local stream successfully");
                  // });

                  // _this.client.publish(localStream, function(err) {
                  //   console.log("Publish local stream error: " + err);
                  // });
                },
                function(err) {
                  console.log("getUserMedia failed", err);
                }
              );
            },
            function(err) {
              console.log("Join channel failed", err);
            }
          );
        },
        function(err) {
          console.log("AgoraRTC _this.client init failed", err);
        }
      );

      var channelKey = "5ff80b05a5bb45eeadcda871371d4b45";
      _this.client.on("error", function(err) {
        console.log("Got error msg:", err.reason);
        if (err.reason === "DYNAMIC_KEY_TIMEOUT") {
          _this.client.renewChannelKey(
            channelKey,
            function() {
              console.log("Renew channel key successfully");
            },
            function(err) {
              console.log("Renew channel key failed: ", err);
            }
          );
        }
      });

      _this.client.on("stream-added", function(evt) {
        var stream = evt.stream;
        console.log("New stream added:1111 " + stream.getId());
        console.log("Subscribe ", stream);
        _this.client.subscribe(stream, function(err) {
          console.log("Subscribe stream failed11111", err);
        });
         stream.on("player-status-change", function(evt){
           console.log(evt, 999999999)
            if (evt.isErrorState && evt.status === "paused"){
                console.error(`Stream is paused unexpectedly. Trying to resume...`);
                stream.resume().then(function(){
                    console.log(`Stream is resumed successfully`);
                }).catch(function(e){
                  console.log(e)
                    console.error(`Failed to resume stream. Error ${e} Reason ${e.message}`);
                    console.log(document.querySelectorAll('video'))
                    document.querySelectorAll('video')[0].muted = true;
                    setTimeout(() => {
                      document.querySelectorAll('video')[0].muted = false;
                    }, 300)
                });
            }
        });
      });

      _this.client.on("stream-subscribed", function(evt) {
        var stream = evt.stream;
        stream.play("agora_remote");
      });

      _this.client.on("stream-removed", function(evt) {
        var stream = evt.stream;
        stream.stop();
      });

      _this.client.on("peer-leave", function(evt) {
        var stream = evt.stream;
        console.log(stream.streamId, 111111);
        stream.stop();
        _this.leave();
      });
    },
    leave() {
      window.sessionStorage.removeItem("channelName");
      const _this = this;
      if (this.client) {
        this.client.leave(
          function() {
            console.log("Leavel channel successfully");
            _this.$router.go(-1);
            // location.reload()
          },
          function(err) {
            console.log("Leave channel failed");
          }
        );
      }
    }
  },

  // beforeDestroy() {
  //   this.leave();
  // }
};
</script>
<style>
.scene-guidance-wrapper {
  height: 100vh;
}
.top-info--right {
  width: 500px;
  padding-left: 20px;
}

</style>
