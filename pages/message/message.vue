<template>
	<view id="SendMessage">
		<view class="list" v-for="(list,index) in messageList" v-bind:key="index" v-bind:class="list.type=='send'?'isSend':'isReceive'"
		 v-scroll>
			<view class="message">
				<!-- <view class="messageTime"> {{ list.time|formatDate }}</view> -->
				<view class="messageText"> {{ list.message }}</view>
			</view>
		</view>
		<view class="bottom">
		</view>
		<view id="send">
			<input type="text" v-model="message">
			<button @click="sendMessage()">发送</button>
		</view>
	</view>
</template>
<script>
	import request from "../../js/request.js"
	export default {
		name: 'SendMessage',
		data() {
			return {
				userId: '',
				userName: '',
				receiver: {},
				messageList: [],
				message: '',
				user: {}
			}
		},
		methods: {
			sendMessage() {
				var page = this
				var message = {
					'sender': page.user,
					'reciver': page.receiver,
					'message': page.message,
					'type': 'send',
					'time': new Date()
				}
				axios.post(this.HOST + '/sendMessage', message).then(function(res) {
					page.message = ''
					page.messageList.push(message)
					console.log(page.messageList)
				}).catch(function(error) {
					console.debug(error)
				})
			},
			onLoad(options) {
				console.log(options);
				this.user = uni.getStorageSync("user");
				this.userId = this.user.id;
				var param = options.param;
				this.receiver = JSON.parse(decodeURIComponent(param));
				console.log(this.receiver.id)
				this.initWebSocket();
				request.TokenRequest({
					url: '/api/getHistoryMessage',
					method: "POST"
				}, {
					receiverId: this.user.id,
					senderId: this.receiver.id
				}).then(res => {
					console.log(res)
					for (var i = 0; i < res.messageList.length; i++) {
						var info = {
							'sender': res.messageList[i]['senderId'],
							'reciver': res.messageList[i]['receiverId'],
							'time': res.messageList[i]['sendtime'],
							'message': res.messageList[i]['text'],
							'type': res.messageList[i]['receiverId'] == this.receiver.id ? 'send' : ''
						}
						this.messageList.push(info)
					}
				}, error => {
					console.log(res)
				})

			},
			initWebSocket() {
				//创建websocket连接
				this.websocket = uni.connectSocket({
					url: 'ws://localhost/relationship/websocket/' + this.user.id,
					success(data) {
						console.log("websocket连接成功" + data);
					}
				});
				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.websocket.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.websocket.onMessage((res) => {
						console.log("receive：" + res.data);
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.websocket.onClose(() => {
					console.log("socket closed")
				})
				window.onbeforeunload = this.onbeforeunload
			},
			onbeforeunload() {
				this.closeWebSocket()
			},
			closeWebSocket() {
				this.websocket.close()
			}
		},
		mounted() {

		},
		beforeDestroy() {
			this.onbeforeunload()
		},
		watch: {},
		filters: {
			formatDate(time) {
				var datePattern = /^(\d{4})-(\d{2})-(\d{2})$/
				try {
					if (datePattern.test(time.substr(0, 10))) {
						return time.substr(0, 19).replace('T', ' ')
					} else {
						return formatDate(time, 'yyyy-MM-dd hh:mm:ss')
					}
				} catch (e) {
					return formatDate(time, 'yyyy-MM-dd hh:mm:ss')
				}
			}
		},
		directives: {
			scroll: {
				inserted(el) {
					el.scrollIntoView()
				}
			}
		}
	}
</script>
<style scoped>
	#SendMessage {
		margin: 0px 5px
	}

	.bottom {
		clear: both;
		height: 50px;
	}

	.list {
		/*height: 50px;*/
		width: 45%;
		background-color: aliceblue;
		border-radius: 5px;
		margin: 3px 10px;
	}

	.isSend {
		clear: both;
		float: right;
	}

	.isReceive {
		clear: both;
		float: left;
	}

	.message {
		margin: 3px 10px;
		border-radius: 10px;
		width: auto;
	}

	.messageTime {
		margin: 3px;
		font-size: 0.5rem;
	}

	.messageText {
		margin: 3px;
		font-size: 1rem;
	}

	#send {
		position: fixed;
		bottom: 10px;
		clear: both;
		width: 100%;
	}

	#send input {
		float: left;
		width: 70%;
		height: 1.5rem;
		border: #4CD964 solid 0.5px;
		border-radius: 0.5rem;

	}

	#send button {
		width: 25%;
		height: 1.5rem;
		line-height: 1.5rem;
	}
</style>
