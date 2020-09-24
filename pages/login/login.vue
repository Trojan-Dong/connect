<template>
	<view id="login">
		<view class="login-logo"></view>
		<view class="login-menu">
			<view>
				<input class="qxs-ic_user qxs-icon" placeholder-class="placeholder-class" placeholder="账号" type="text" name="loginName"
				 v-model="userName">
			</view>
			<view>
				<input class="qxs-ic_password qxs-icon" placeholder-class="placeholder-class" placeholder="密码" type="password" name="password"
				 v-model="password">
			</view>
			<view class="uni-btn-v">
				<button type="default" class="login-button" @click="login()">登录</button>
			</view>
			<view class="login-tips">
				<span>忘记密码</span><span>立即注册</span>
			</view>
		</view>

	</view>
</template>

<script>
	import request from '../../js/request.js'
	export default {
		name: 'login',
		data() {
			return {
				userName: '',
				password: ''
			}
		},
		methods: {
			login: function() {
				request.baseRequest({
					url: '/api/login',
					method: "POST"
				}, {
					loginName: this.userName,
					password: this.password
				}).then(res => {
					uni.setStorageSync('user', {
						id: res.user.id,
						loginName: res.user.loginname
					})
					uni.setStorageSync('token', res.token);
					console.log("navigate test")
					uni.navigateTo({
						url: '../friend/friend'
					})
				}, error => {
					console.log(res);
				})

			},
			cancel: function() {}
		},
		mounted() {

		}
	}
</script>

<style scoped>
	@import 'login.css';

	.login-logo {
		width: 100%;
		height: 200px;
		opacity: 0.2;
		background: url("img/passenger.jpg") no-repeat;
		background-size: 100% 100%;
	}

	.login-menu table {
		width: 90%;
		margin: 0px auto;
		border-spacing: 5px;
	}

	.qxs-icon {
		width: 80%;
		height: 2rem;
		padding: 0 10%;
		border-radius: 5px;
		margin: 5px auto;
		border-color: #FFFFCC;
		border-width: 0.5px;
		border-right-color: #CCCCCC;
		border-bottom-color: #CCCCCC;
	}

	.placeholder-class {
		font-size: 0.8rem;
		font-style: italic;
	}

	.qxs-ic_user {
		background: url("img/user-login.png") no-repeat;
		background-size: 13px 15px;
		background-position: 3%;
	}

	.qxs-ic_password {
		background: url("img/pass-login.png") no-repeat;
		background-size: 13px 15px;
		background-position: 3%;
	}

	.login-button {
		width: 95%;
		height: 2rem;
		line-height: 2rem;
		border-radius: 5px;
		background-color: blue;
		margin: 20px auto;
		color: #FFFFFF;
	}

	.login-tips {
		margin: 0px 2.5%;
		font-size: 10px;
	}

	.login-tips span:nth-child(1) {
		float: left;
	}

	.login-tips span:nth-child(2) {
		float: right;
	}
</style>
