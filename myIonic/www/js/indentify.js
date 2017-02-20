//获取验证码
function indentify(obj){
	var timerNum = 60;
	function settime(o){
		if(timerNum == 0){
			o.removeAttribute("disabled")
			o.innerText = "获取验证码"
			timerNum=60
		}
		else{
			o.setAttribute("disabled",true)
			o.innerText = "重新发送"+timerNum
			timerNum--
			setTimeout(function(){
				settime(o)
			},1000)
		}
	}
	document.getElementById(obj).onclick = function(){
		settime(this);
	}
}
