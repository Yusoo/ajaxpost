# ajaxpost
一个基于jQuery的Ajax表单工具,此工具的目的是解放前端，让后端可以直接通过返回特定的信息，控制表单提交后的浏览器行为。

可根据服务器返回的数据，执行弹窗提示、刷新页面、页面跳转以及执行自定义js代码等。

# 使用方法
```html
<form action="/login_ajax" method="post" id="login">
	<input name="name" type="text" placeholder="用户名">
	<input name="password" type="password" placeholder="密码">
	<input type="submit" value="登录">
	<p id="notification"></p>
</form>
//引入jquery
<script src="jquery.js"></script>
<script>
	$(function () {
		$('#login').ajaxpost();
	});
</script>
```


#前端配置
参数 | 说明
---|---
action | 提交地址，默认会获取form的action属性
notice | 显示提示文字的元素，默认是'#notification'，如果页面上没有这个元素则会以alert方式弹框提示
datas | 默认是整个表单数据，即$form.serialize()
func | 定义数据成功返回后要执行的js代码

例子
```js
$('#login').ajaxpost({
	notice: '#tips', //在#tips元素上显示提示信息
	func: function (data) { //后端没有返回登录成功的状态，自动点击刷新验证码（如果有的话）
		if (data.status !== 'succeed') {
			$('.vcode').trigger('click');
		}
	}
});
```

#后端返回的JSON配置
参数 | 说明
---|---
status | 状态，请求过程中为'pending'，请求返回后会更新为json.status，并会把提示元素标签的class改为json.status，以便根据不同状态更改前端样式
notice | 提示信息，如果前端配置的notice元素不存在，则会以alert方式弹框提示
alert | 需要弹框提示的信息
reload | 刷新页面
reset | 重置表单，表单中必须有reset元素才行
redirect | 重定向浏览器到某个地址
script | 要执行的js代码


例子
```json
{"status":"succeed","notice":"登录成功","redirect":"/user"}
```
接收到后端返回的数据后，会在#notification标签中显示json.notice的信息，这里后端还返回了redirect参数，浏览器会跳转到/user。

```json
{"status":"succeed","notice":"登录成功","script":"alert('hello')"}
```
使用script参数，浏览器会执行参数中的js代码。


```json
{"status":"fail","notice":"密码错误","reset":true}
```
提示登录失败，并且重置表单。

#非表单Ajax
ajaxpost也可用于非表单的请求，后端同样可以控制浏览器行为。
```js
$('#abc').click(function () {
	$(this).ajaxpost({
		action: '/something',
		notice: '#note',
		datas: { name: 'Yusoo', age:7 }
	});
});
```

# License
MIT