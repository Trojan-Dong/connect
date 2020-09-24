<template>
	<view id="friendList">
		<view class="list" v-for="(friendInfo,index) in friendList" v-bind:key="index" v-on:click="toSendPage(friendInfo)">
			<view class="pic">
				<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598875856740&di=483b8f1c98a70ee32a624049246473fe&imgtype=0&src=http://c-ssl.duitang.com/uploads/item/202008/15/20200815203046_pwcze.thumb.400_0.jpeg">
			</view>
			<view class="message">
				<view class="message_top">
					<span class="name"> {{ friendInfo.friendName }} </span>
					<span class="status"> {{ friendInfo.status=='0'?'在线':'离线' }} </span>
				</view>
				<view class="message_bottom">
					<view class="lastMsg">{{ friendInfo.lastMsg }}</view>
					<view v-if="friendInfo.msgCount>0" class="noread_mess">{{ friendInfo.msgCount }}</view>
				</view>
			</view>
		</view>
		<router-view />
	</view>
</template>
<script>
	import request from "../../js/request.js"
	var websocket
	export default {
		name: 'friend',
		data() {
			return {
				websocket: null,
				friendList: [],
				messageList: [],
				user: null
			}
		},
		methods: {
			socketInit() {
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
			},
			toSendPage(friendInfo) {
				var friend = {
					id: friendInfo.friendId,
					loginName: friendInfo.friendName
				};
				uni.navigateTo({
					url: '../message/message?param=' + encodeURIComponent(JSON.stringify(friend))
				})
			}
		},
		mounted() {
			// checkLogin();
			var user = uni.getStorageSync('user');
			this.user = user;
			if (user == null || user == '') {
				uni.redirectTo({
					url: '../login/login'
				});
			} else {
				request.TokenRequest({
					url: '/api/getFriendList',
					method: "POST"
				}, {
					userId: user.id
				}).then(res => {
					this.friendList = res.friendList;
					this.socketInit();
				}, error => {
					console.log(res);
				})
			}
		},
		beforeDestroy() {
			this.websocket.close();
		}
	}
</script>

<style scoped>
	.list {
		height: 50px;
		width: 100%;
		background-color: #fafafa;
		border-radius: 5px;
		margin: 3px 0px;
	}

	.pic {
		height: 50px;
		width: 20%;
		float: left;
	}

	.pic img {
		margin: 5px 1rem;
		width: 40px;
		height: 40px;
		border-radius: 30px;
	}

	.message {
		height: 50px;
		width: 80%;
		float: right;
	}

	.message .name {
		margin: 3px;
		font-size: 1rem;
		/*line-height: 50px;*/
	}

	.message .status {
		margin: 3px;
		font-size: 0.5rem;
		color: darkgrey;
		float: right;
	}

	.message_top {
		height: 50%;
	}

	.message_bottom {
		width: 100%;
		height: 50%;
	}

	.lastMsg {
		float: left;
		margin-left: 0.5rem;
		margin-top: 0.3rem;
		margin-right: 0.3rem;
		font-size: 0.5rem;
		text-align: center;
		line-height: 1rem;
	}

	.noread_mess {
		float: right;
		width: 1.5rem;
		height: 1rem;
		border-radius: 0.5rem;
		background-color: darkgrey;
		color: white;
		margin-right: 0.3rem;
		font-size: 0.8rem;
		text-align: center;
		line-height: 1rem;
	}
</style>
