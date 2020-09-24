const baseUrl = 'http://localhost.com'; //此为测试地址,并非真实地址
// 定义基础请求路径(后端服务器地址)
const baseRequest = (opts, data) => {
	console.log(baseUrl + opts)
	let baseDefaultOpts = {
		url: opts.url,
		// 请求接口地址
		data: data,
		// 传入请求参数
		method: opts.method
		// // 配置请求类型
		// header: opts.method == 'get' ? {
		// 	'X-Requested-With': 'XMLHttpRequest',
		// 	"Accept": "application/json",
		// 	"Content-Type": "application/json; charset=UTF-8"
		// } : {
		// 	'X-Requested-With': 'XMLHttpRequest',
		// 	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		// },
		// // 配置请求头
		// dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {

		uni.request(baseDefaultOpts).then((res) => {
			if (res[1].data.code == '00') {
				// 后端返回的状态码100为成功状态,成功则返回请求结果,在app调试时可以通过console.log(JSON.stringify(res[1].data))来查看返回值（以项目实际情况为准）
				resolve(res[1].data)
			}
		}).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
};

//带Token请求
const TokenRequest = (opts, data) => {
	let hjr_token = "";
	uni.getStorage({
		key: 'token',
		success: function(res) {
			hjr_token = res.data
		}
	});
	//此token是登录成功后后台返回保存在storage中的
	let DefaultOpts = {
		url: opts.url,
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			'accessToken': hjr_token,
			// 'X-Requested-With': 'XMLHttpRequest',
			// "Accept": "application/json",
			// "Content-Type": "application/json; charset=UTF-8"
		} : {
			'accessToken': hjr_token,
			// 'X-Requested-With': 'XMLHttpRequest',
			// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
		// dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(DefaultOpts).then((res) => {
			if (res[1].data.code == '00') {
				// 后端返回的状态码100为成功状态,成功则返回请求结果,在app调试时可以通过console.log(JSON.stringify(res[1].data))来查看返回值（以项目实际情况为准）
				resolve(res[1].data)
			} else {
				// 后端返回状态码为105则为未登录状态（以项目实际情况为准）
				uni.showToast({
					icon: 'none',
					title: '尚未登录',
					duration: 2000
				});
				// 尚未登录的逻辑处理
				return false
			}
		}).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
};
export default {
	baseUrl,
	baseRequest,
	TokenRequest
}
