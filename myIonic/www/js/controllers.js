angular.module('starter.controllers', ['ionic','ngFileUpload'])

//模块(登录,注册,修改密码)
.controller('AppCtrl', function($scope,$http,$location,$ionicActionSheet,$cordovaImagePicker,$cordovaFileTransfer, $ionicModal, $timeout,$state,$rootScope,$cordovaGeolocation) {

	$ionicModal.fromTemplateUrl('templates/index.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	
	$timeout(function() {
			$http.post('http://api.aihj.ren/Home/Login/logincodes_post_json',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == "TRUE"){
				$scope.modal.hide();
			}else{
				$scope.modal.show();
			}
		})
	});
	$scope.loginData = {};
	
	//点击首页注册按钮,注册页显示,登录页隐藏.
	$scope.register = function() {
	  	document.getElementById("register").style.display="block";
	  	document.getElementById("landing").style.display="none";
		$scope.Num = indentify("intallNum");
	};
	//点击注册页面的注册按钮
	$scope.reinfo = function(){
//		baidu_location.getCurrentPosition(function(data){
//			$scope.obj = data.split("\n");
//			$scope.loginLat = $scope.obj[2].split(":")[1];
//			$scope.loginLon = $scope.obj[3].split(":")[1];
//	    }, function(err){
//	      alert("错误："+err)
//	    });
		$http.post('http://api.aihj.ren/Home/Login/sign',{
			'phone':$scope.loginData.username,
			'password':$scope.loginData.password001,
			'repassword':$scope.loginData.password002,
			'latitude':'36.1111',//$scope.loginLat,
			'longitude':'110.2222',//$scope.loginLon,
		}).success(function(data){
			console.log(data)
			if(data.msg == 'true'){
				localStorage.token = data.token;
				$scope.modal.hide();
				$scope.promptLogin = '';
			}else{
				$scope.promptLogin ="提示信息："+ data.info;
			}
		})
	}
	//点击首页登录
	$scope.landing = function() {
    document.getElementById("landing").style.display = "block";
    document.getElementById("register").style.display = "none";
	};
	$scope.landData = {};
	//点击登录页面的登录时
	$scope.info = function(){
		baidu_location.getCurrentPosition(function(data){
			$scope.obj = data.split("\n");
			$scope.landLat = $scope.obj[2].split(":")[1];
			$scope.landLon = $scope.obj[3].split(":")[1];
	    }, function(err){
	      alert("错误："+err)
	    });
		$http.post('http://api.aihj.ren/Home/Login/login_post_json',{
			'phone':$scope.landData.username,
			'pwd':$scope.landData.password,
			'token':localStorage.token,
			'latitude':$scope.landLat,//'36.1111',
			'longitude':$scope.landLon,//'110.2222',
		}).success(function(data){
			if(data.msg == 'TRUE'){
				localStorage.token = data.token;
				$scope.modal.hide();
				$scope.promptLanding = '';
			}else{
				$scope.promptLanding = data.info;
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		});
	}
  //点击遇到问题
  $scope.error = function(){
		document.getElementById("getPassword").style.display = "block";
		$scope.Num = indentify("intallNumber");
	}
  //密码修改成功
  $scope.get_finish = function(){
  	document.getElementById("getPassword").style.display = "none";
  }
})
//首页
.controller('homeCtrl', function($scope,$rootScope, $stateParams,$location,$http,$state,$timeout,$ionicSlideBoxDelegate) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh = function(){
		
		$http.post('http://api.aihj.ren/home/Wish/indexWish',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == 'true'){
				$scope.arrparent = data.data;
				if($scope.arrparent.length > 0){
					document.getElementById("p001").innerHTML = "您的家族树：";
					var oUl = document.querySelector("#marquee");
					for(var i = 0 ;i<$scope.arrparent.length;i++){
						var oLi = document.createElement("li");
						oLi.innerHTML = "<span>"+$scope.arrparent[i].nodeTime+"</span><span>您的家族树录入：</span><span>"+$scope.arrparent[i].callName+"</span>";
						oLi.style.textAlign = "center";
						oUl.appendChild(oLi);
					}
					//上下无缝滚动
					startmarquee(25,300,0,1);
					document.getElementById("p002").innerHTML = "您可以";
					document.getElementById("h001").innerHTML = "对家族树的成员发布心愿";
				}
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
		$http.post('http://api.aihj.ren/home/Wish/wishSelect',{
			'token' : localStorage.token,
			'num' : 3,
		}).success(function(data){
			if(data.msg == 'true'){
				$scope.myWish = data.data;
				(function(){
					$ionicSlideBoxDelegate.update();
				})();
				$scope.chagePath=function (a) {
	 				$location.path ("app/homedetails&id="+a)
	 			}
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
		$http.post('http://api.aihj.ren/home/Wish/wishFamilySelect',{
			'token' : localStorage.token,
			'num' : 3,
		}).success(function(data){
			if(data.msg == 'true'){
				$scope.personwish = data.data;
				(function(){
					$ionicSlideBoxDelegate.update();
				})();
			}
		})
	}
	$scope.myMoreWish = function(){
		$state.go('app.myMoreWish');
		
	}
	$scope.family = function(){
		$rootScope.family();
	}
	$scope.familyWish = function(){
		$state.go('app.fDetails');
	}
	
	$scope.addMoreActive = function(){
		$state.go('app.addMoreActive')
	}
	$scope.gofamily = function(b){
		$state.go('app.merberWish')
	}
})
//添加个人心愿
.controller('addMoreActiveCtrl', function($scope,$rootScope,$timeout, $stateParams,$http,$state,$ionicScrollDelegate,$timeout,$ionicActionSheet,$cordovaImagePicker,$cordovaFileTransfer) {
	$scope.inputImg="";
	$scope.oDiv = document.querySelector(".moreWish").querySelectorAll("div");
	$scope.oLi = document.querySelector(".moreWish_ul").querySelectorAll("li");
	for(var i = 0 ; i < $scope.oLi.length ; i++){
		$scope.oLi[i].index = i;
		$scope.oLi[i].onclick = function(){
			var index = this.index;
			for(var j = 0 ;j < $scope.oLi.length ; j++){
				$scope.oLi[j].style.color = "#787272";
				$scope.oDiv[j].style.display = "none";
				document.querySelector("#customTitle").value = ''
			}
			this.style.color = "#ef6e34";
			$scope.oDiv[index].style.display = "block";		
		}
	}
	$scope.wishLi = document.querySelector(".defaultWish_list").querySelectorAll(".defaultWish_item");
	$scope.oScroll = document.querySelector(".scroll");
	var indexImg = ''
	for(var i = 0 ; i<$scope.wishLi.length;i++){
		$scope.wishLi[i].index = i;
		$scope.wishLi[i].onclick = function(){
			indexImg = this.index;
			document.querySelector(".defaultWish").style.display="none";
			document.querySelector(".customContent").style.display= "block";
			$scope.wishTitle = this.innerText;
			document.querySelector("#customTitle").value = $scope.wishTitle;
			//返回顶部
			$ionicScrollDelegate.$getByHandle('addMoreScroll').scrollTop();
		}
	}
	$scope.addImg = function(){
		var hidesheet=$ionicActionSheet.show({
			
	        buttons: [
	            { text: '从手机相册选择' }
	        ],
	        titleText: '选择照片',
	        cancelText: '取消',
	        cancel: function() {
	        },
	        buttonClicked: function(index) {
				if(index == 0){
					var oDivAddImg = document.querySelector('.addActiveImg');
	                var picOptions = {
					   	maximumImagesCount: 8,
					  	width: 800,
					   	height: 800,
					   	quality: 80
					};
				  	$cordovaImagePicker.getPictures(picOptions)
				    .then(function (results) {
						var imagesUrl = '';
						for(var i = 0; i < results.length; i++) {
							var requestParme = "?callback=JSON_CALLBACK";
					    	var serve = encodeURI('http://photo.aihj.ren/upload/do_upload' + requestParme);
					      	var fileURL = results[i];
							$cordovaFileTransfer.upload(serve, fileURL)
					      	.then(function(result) {
					      		var oImg = document.createElement('img');
					      		oImg.style.margin = "10px";
								oImg.src = "http://photo.aihj.ren/photo/get/"+result.response+"/60/60";
								oDivAddImg.insertBefore(oImg,oDivAddImg.childNodes[0]);
								$scope.inputImg +=  (result.response+",");
								
									hidesheet()
					      	}, function(err) {
					        	alert("失败"+err.message)
					      	});
				      	}
				    }, function(error) {
				      alert(error)
				    });  
	           }
	        }
    	});
	}
	$scope.release = function(){
		$scope.activeTitle = document.querySelector("#customTitle").value;
		$scope.activeContent = document.querySelector("#customText").value;
		$http.post('http://api.aihj.ren/home/Wish/addWish',{
			'token' : localStorage.token,
			'title': $scope.activeTitle,
			'contents' : $scope.activeContent,
			'photo' : $scope.inputImg,
		}).success(function(data){
			if(data.msg == "true"){
				$state.go('app.home')
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
})
//我的更多心愿
.controller('myMoreWishCtrl', function($scope, $stateParams,$http) {
	$http.post('http://api.aihj.ren/home/Wish/wishSelect',{
		'token' : localStorage.token,
	}).success(function(data){
		if(data.msg == 'true'){
			$scope.myWishList = data.data;
		}else{
			document.querySelector('.myMoreWish_content').innerHTML = "小惠提醒您:您还没有添加个人心愿,赶快添加吧!"
		}
	})
})
//我的个人心愿
.controller('homedetailsCtrl', function($scope, $stateParams,$location,$http,$state,$ionicSlideBoxDelegate) {
	$scope.userCon = $location.absUrl().split('&')[1];
	for(var i=0;i<$scope.userCon.length;i++){
		$scope.Id = $scope.userCon.split('=')[1];
	}
	$http.post('http://api.aihj.ren/home/Wish/wishSelect',{
		'token' : localStorage.token,
		'id' : $scope.Id,
	}).success(function(data){
		if(data.msg == 'true'){
			$scope.wishDetails = data.data;
			(function(){
				$ionicSlideBoxDelegate.update();
			})();
		}
	})
	var watch = $scope.$watch("wishDetails",function(newData,oldData){
		if(newData === oldData){return;}
		$scope.$broadcast('wishDetails', newData);
	},true)
	watch();
	$scope.Customer = function(){
		$state.go('app.customer')
	}
})
//联系客服
.controller('customerCtrl', function($scope, $stateParams) {
})
//家族成员心愿
.controller('merberWishCtrl', function($scope, $stateParams,$http,$ionicSlideBoxDelegate) {
	
	$http.post('http://api.aihj.ren/Home/Wish/wishFamilyInfo',{
		'token' :　localStorage.token,
		'id' : $stateParams.data,
	}).success(function(data){
//		console.log(data)
		$scope.familyMember = data.data;
		(function(){
			$ionicSlideBoxDelegate.update();
		})();
	})
})
//家族所有心愿
.controller('fDetailsCtrl', function($scope, $stateParams,$http) {
	$http.post('http://api.aihj.ren/home/Wish/wishFamilySelect',{
		'token' : localStorage.token,
	}).success(function(data){
//		console.log(data)
		if(data.msg == 'true'){
			$scope.familyWishList = data.data;
		}else{
			
		}
	})
})

//家族树
.controller('familyCtrl', function($scope, $stateParams,$http,$location,$ionicPopup,$state) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh=function(){
		
		$http.post('http://api.aihj.ren/home/family/indexFamily',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == 'true'){
				$scope.main = document.getElementById("main");
				$scope.main.style.width = "100vw";
				$scope.main.style.height = "70vh";
				if(data.datas){
					data.datas.unshift(data.user);
				}else{
					data.datas = [data.user]
				}
				var myChart = echarts.init(document.getElementById('main'));
				document.getElementById('addPerson').style.visibility = 'hidden';
				var option = {
					toolbox: {
					    show : true,
					    feature : {
					        restore : {show: true}
					    }
					},
					legend: {
					    x: 'left',
					    y: 'bottom',
					    data:[]
					},
					series : [
					    {
					        type:'force',
					        name : "人物关系",
					        ribbonType: false,
					        categories : [
					            {
					                name: '人物',
					            }
					        ],
					        itemStyle: {
					            normal: {
					                label: {
					                    show: true,
					                    textStyle: {
					                        color: '#fff',//字体颜色
					                        fontWeight:'600'//字体权重
					                    }
					                },
					                nodeStyle : {
					                    brushType : 'both',
					                    borderColor : '#ee9b35',//节点的
					                    borderWidth : 3//节点的
					                },
					                linkStyle : {
					                    color: '#cccccc'//控制线的颜色
					                }
					            },
					            emphasis: {
					                label: {
					                    show: false     
					                },
					                nodeStyle : {
					                    	
					                },
					                linkStyle : {
					                    	
					                }
					            }
					        },
					        minRadius : 15,
					        maxRadius : 25,
					        scaling: 1.2,//缩放比例
					        draggable: true,
					        linkSymbol: 'arrow',
					        symbolSize: [25, 25],
					        steps: 10,
					        coolDown: 0.9,
					        roam: 'move',
					        nodes: data.datas,
					        links : [
	   
					        ]
						}
					]
				};
				myChart.setOption(option);
						
				function focus(param) {
					var data = param.data;
					var links = option.series[0].links;
					var nodes = option.series[0].nodes;
					if (data.source != null && data.target != null) { //点击的是边
					    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
					    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
					      
	//					console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
					} else { // 点击的是点
	//				    console.log("选中了" + data.name + '(' + data.sourceUserid + ')');	
					    $scope.sourceUserid = data.sourceUserid;
					    $scope.oVisibility = document.getElementById('addPerson').style.visibility;
					    if($scope.oVisibility == 'hidden'){
					       	document.getElementById('addPerson').style.visibility = 'visible';
					    }else{
					        document.getElementById('addPerson').style.visibility = 'hidden';
					    }
					}
				}
				myChart.on(echarts.config.EVENT.CLICK, focus)
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
	
	$scope.addPerson = function(){
		$state.go('app.aperson',{data:$scope.sourceUserid},{ reload: true })
	}
	$scope.delPerson = function(){
		$http.post('http://api.aihj.ren/Home/family/deleteFamily',{
			'id' : $scope.sourceUserid,
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == 'false'){
				$scope.showAlert = function() {
			     	var alertPopup = $ionicPopup.alert({
			       	title: '<h3>删除家庭成员</h3>',
			       	okText:'确定',
			       	template: data.info,
			     	});
			   	}();
			}else{
				$scope.showAlert = function() {
			     	var alertPopup = $ionicPopup.alert({
			       	title: '<h3>删除家庭成员</h3>',
			       	okText:'确定',
			       	template: data.info,
			     	});
			     	alertPopup.then(function(res) {
			       		$state.go('app.family')
			     	});
			   	}();
			}
			
		})
	}
	$scope.editProfile = function(){
		$state.go('app.editProfile',{data:$scope.sourceUserid},{ reload: true });
		
	}
	$scope.viewDetails = function(){
		$state.go('app.viewDetails',{data:$scope.sourceUserid},{ reload: true });
		
	}
})
//添加成员
.controller('addPersonCtrl', function($scope,$timeout,$rootScope, $stateParams,$http,$location,$state,$ionicPopup,$ionicActionSheet,$cordovaImagePicker,$cordovaFileTransfer) {
	var imagesUrl = '';
	
	$scope.addAimg = function(){
		var hidesheet=$ionicActionSheet.show({
	        buttons: [
	            { text: '从手机相册选择' }
	        ],
	        titleText: '选择照片',
	        cancelText: '取消',
	        cancel: function() {
	        },
	        buttonClicked: function(index) {
				if(index == 0){
	                var picOptions = {
					   	maximumImagesCount: 1,
					  	width: 800,
					   	height: 800,
					   	quality: 80
					};
				  	$cordovaImagePicker.getPictures(picOptions)
				    .then(function (results) {
						for(var i = 0; i < results.length; i++) {
							var requestParme = "?callback=JSON_CALLBACK";
					    	var serve = encodeURI('http://photo.aihj.ren/upload/do_upload' + requestParme);
					      	var fileURL = results[i];
							$cordovaFileTransfer.upload(serve, fileURL)
					      	.then(function(result) {	
								imagesUrl =  result.response;
								document.getElementById("addpersonImg").src = 'http://photo.aihj.ren/photo/get/'+result.response+"/60/60";
								
						    		hidesheet();
					      	}, function(err) {
					        	alert("失败"+err.message)
					      	});
				      	}
				    }, function(error) {
				      alert(error)
				    });  
	           }
	        }
    	});
	}

	$scope.cancleTofamily =function(){
		$state.go('app.family')
	}
	$scope.addperson = {};
	$scope.releaseTofamily =function(){
		var addDate = document.getElementById("addDate").value;
		$http.post('http://api.aihj.ren/Home/Family/insertFamily',{
			'token' : localStorage.token,
			'id' : $stateParams.data,
			'name' : $scope.addperson.name,
			'sex' : $scope.addperson.sex,
			'relation' : $scope.addperson.callName,
			'birthday' : addDate,
			'phone' : $scope.addperson.tel,
			'email' : $scope.addperson.email,
			'love' : $scope.addperson.love,
			'photo': imagesUrl,
		}).success(function(data){
			if(data.msg == 'true'){
				$state.go('app.family')
			}else{
				$scope.showAlert = function() {
		         	var alertPopup = $ionicPopup.alert({
		           	title: '<h3>温馨提醒:<h3>',
		           	okText:'确定',
		           	template: data.info,
		         	});
		       	}();
			}
		})
	}
})
//修改成员资料
.controller('editProfileCtrl', function($scope, $stateParams,$ionicPopup,$http,$location,$state,$rootScope,$cordovaImagePicker,$cordovaFileTransfer) {
//	var imagesUrl = '';
	$http.post('http://api.aihj.ren/Home/family/familyinfo',{
		'id' : $stateParams.data,
		'token' : localStorage.token,
	}).success(function(data){
		if(data.msg == "true"){
			$scope.userInfo = data.data;
			$scope.birthday = new Date($scope.userInfo.birthday)
		}
	})
//	$scope.editImg = function(){
//		$rootScope.Cemera(1,'editImg','/60/60');
//	}
	$scope.cEditTofamily = function() {
		
	 	var confirmPopup = $ionicPopup.confirm({
		   	title: '<h3>您确认取消修改吗？</h3>',
		   	cancelText:'取消',
		   	okText:'确定',
	 	});
	 	confirmPopup.then(function(res) {
		   	if(res) {
		   		$state.go('app.family')
		   	} else {
		   		
		    }
	  	});
	};

	$scope.editTofamily =function(){
		var editName = document.getElementById("name").value;
		var editbirthday = document.getElementById("birthday").value;
		var editEmail = document.getElementById("email").value;
		var editLove = document.getElementById("love").value;
		var editSex = document.getElementById("sex").value;
		var editPhone = document.getElementById("phone").value;
		var editCallname = document.getElementById("callname").value;
		$http.post('http://api.aihj.ren/Home/family/updateFamily',{
			'id' : $stateParams.data,
			'token' : localStorage.token,
			'name' : editName,
			'birthday' : editbirthday,
			'email' : editEmail,
			'love' : editLove,
			'sex' : editSex,
			'phone' : editPhone,
			'relation' : editCallname,
//			'photo':imagesUrl,
		}).success(function(data){
			if(data.msg == "true"){
				$state.go('app.family')
			}else{
				$scope.showAlert = function() {
		         	var alertPopup = $ionicPopup.alert({
			           	title: '<h3>小惠提醒您:</h3>',
			           	okText:'确定',
			           	template: data.info,
		         	});
		       	}();
			}
		})
	}
})
//查看成员详情
.controller('viewDetailsCtrl', function($scope, $stateParams,$http,$location) {

	$http.post('http://api.aihj.ren/Home/family/familyinfo',{
		'id' : $stateParams.data,
		'token' : localStorage.token,
	}).success(function(data){
		if(data.msg == "true"){
			$scope.userInfo = data.data;
		}else{
			if(data.code == '-1'){
				$scope.modal.show();
			}
		}
	})
})

//发现
.controller('findCtrl', function($scope, $stateParams,$filter,$http,$cordovaCamera,$state,$cordovaGeolocation) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh=function(){
		
		$http.post('http://api.aihj.ren/Home/Find/selstory_post_json',{
			'token':localStorage.token,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$scope.familyStroy = data.info;
			}else{
				document.getElementById("unfamilyStory").innerHTML = "<span>小惠提醒您:您还没有家庭故事,请添加</span>"
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		});
	}
	$scope.addfamilystory = function(){
	   		$state.go('app.flystory')
	}
	$scope.oConDiv = document.querySelector(".find_content_div");
	$scope.oUl = document.querySelector(".find_content_title");
	$scope.oLi = $scope.oUl.getElementsByTagName("li");
	$scope.oI = $scope.oUl.getElementsByTagName("i");
	$scope.oDiv = $scope.oConDiv.getElementsByTagName("section");
	for(var i = 0; i < $scope.oLi.length; i++){
		$scope.oLi[i].index = i;
		$scope.oLi[i].onclick = function(){
			var index = this.index;
			for(var j = 0; j<$scope.oDiv.length;j++){
				$scope.oDiv[j].style.display = 'none';
				$scope.oI[j].style.backgroundPositionY = "-109px";
				$scope.oLi[j].style.color = "#797373";
			}
			if(index == 1){
				$http.post('http://api.aihj.ren/Home/Find/relativegps_post_json',{
					'token' : localStorage.token,
				}).success(function(data){
					if(data.msg == "TRUE"){
						// 百度地图API功能
						var mp = new BMap.Map("allmap");
						var point = new BMap.Point(116.404,39.915 );
						mp.centerAndZoom(point, 1);
						// 编写自定义函数,创建标注
						function addMarker(point){
						  var marker = new BMap.Marker(point);
						  mp.addOverlay(marker);
						}
						// 复杂的自定义覆盖物
					    function ComplexCustomOverlay(point, text){
					      this._point = point;
					      this._text = text;
					    }
					    ComplexCustomOverlay.prototype = new BMap.Overlay();
					    ComplexCustomOverlay.prototype.initialize = function(map){
					      this._map = map;
					      var div = this._div = document.createElement("div");
					      div.style.position = "absolute";
					      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
					      div.style.backgroundColor = "#EE5D5B";
					      div.style.border = "1px solid #BC3B3A";
					      div.style.color = "white";
					      div.style.height = "18px";
					      div.style.padding = "0px 5px";
					      div.style.lineHeight = "16px";
					      div.style.whiteSpace = "nowrap";
					      div.style.MozUserSelect = "none";
					      div.style.fontSize = "12px"
					      var span = this._span = document.createElement("span");
					      div.appendChild(span);
					      span.appendChild(document.createTextNode(this._text));      
					      var that = this;
					
					      var arrow = this._arrow = document.createElement("div");
					      arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
					      arrow.style.position = "absolute";
					      arrow.style.width = "11px";
					      arrow.style.height = "10px";
					      arrow.style.top = "17px";
					      arrow.style.left = "5px";
					      arrow.style.overflow = "hidden";
					      div.appendChild(arrow);
					      mp.getPanes().labelPane.appendChild(div);
					      
					      return div;
					    }
					    ComplexCustomOverlay.prototype.draw = function(){
					      var map = this._map;
					      var pixel = map.pointToOverlayPixel(this._point);
					      this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
					      this._div.style.top  = pixel.y - 30 + "px";
					    }
					    for(var i = 0 ; i <data.info.length; i++){
					    	var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data.info[i].longitude,data.info[i].latitude), data.info[i].name);

    						mp.addOverlay(myCompOverlay);
					    }
					}
				})
			}
			if(index == 2){
				
				$http.post('http://api.aihj.ren/Home/Find/selorigin_post_json').success(function(data){
					if(data.msg == "TRUE"){
						$scope.data = data.info;
						$scope.fnsearch=function(a){
							$scope.data=$filter("filter")(data.info,a)
						}
						$scope.linkName = function(zName){
							$state.go('app.tobaidu',{'data': zName},{ reload: true })
						}
					}else{
						if(data.code == '-1'){
							$scope.modal.show();
						}
					}
				})
			}
			if(index == 3){
				$http.post('http://api.aihj.ren/Home/Find/linkman_post_json',{
				'token':localStorage.token,
				}).success(function(data){
					if(data.msg == "TRUE"){
						$scope.linkname = data.info;
					}else{
						if(data.code == '-1'){
							$scope.modal.show();
						}
					}
				})
			}
			$scope.oDiv[index].style.display = 'block';
			$scope.oI[index].style.backgroundPositionY = "-39px";
			this.style.color = "#eaa24a";
		}
	}

})
//家庭故事
.controller('familystoryCtrl', function($scope,$timeout, $stateParams,$state,$http,$ionicActionSheet,$cordovaImagePicker,$cordovaFileTransfer) {
	$scope.inputImg = "";
	$scope.addfamilyImg = function(){
		var hidesheet=$ionicActionSheet.show({
	        buttons: [
	            { text: '从手机相册选择' }
	        ],
	        titleText: '选择照片',
	        cancelText: '取消',
	        cancel: function() {
	        },
	        buttonClicked: function(index) {
				if(index == 0){
					var oDivAddImg = document.querySelector('.familyStoryImg');
		            document.addEventListener("deviceready", function () {    
		                var picOptions = {
						   	maximumImagesCount: 8,
						  	width: 800,
						   	height: 800,
						   	quality: 80
						};
					  	$cordovaImagePicker.getPictures(picOptions)
					    .then(function (results) {
							var imagesUrl = '';
							for(var i = 0; i < results.length; i++) {
								var requestParme = "?callback=JSON_CALLBACK";
						    	var serve = encodeURI('http://photo.aihj.ren/upload/do_upload' + requestParme);
						      	var fileURL = results[i];
								$cordovaFileTransfer.upload(serve, fileURL)
						      	.then(function(result) {
						      		var oImg = document.createElement('img');
						      		oImg.style.margin = "10px";
									oImg.src = "http://photo.aihj.ren/photo/get/"+result.response+"/60/60";
									oDivAddImg.insertBefore(oImg,oDivAddImg.childNodes[0]);
									$scope.inputImg +=  (result.response+",");
						      		hidesheet()
						      	}, function(err) {
						        	alert("失败"+err.message)
						      	});
					      	}
					    }, function(error) {
					      alert(error)
					    }); 
					},false);
	            }
	        }
		})
	}
	$scope.familyStoryDate = {};
	$scope.familyStoryrelease = function(){
		$http.post('http://api.aihj.ren/home/Find/addstory_post_json',{
			'token' : localStorage.token,
			'content' : $scope.familyStoryDate.content,
			'photo' : $scope.inputImg,
		}).success(function(data){
			if(data.msg == "TRUE"){
				$state.go('app.find')
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
})
//姓氏搜索
.controller('toBaiDuCtrl', function($scope, $stateParams,$state,$timeout) {
	var oIframe = document.getElementById("iframe");
	$timeout(function(){
		oIframe.src = $stateParams.data;
	},100)
})

//个人中心
.controller('personalCtrl', function($scope,$state, $ionicPopup ,$stateParams,$cordovaCamera,$state,$ionicActionSheet,$cordovaImagePicker,$http,$rootScope,$cordovaFileTransfer,$timeout) {
	var images = document.getElementById('myImage');
	$scope.oRadio = { checked: true }
	$http.post('http://api.aihj.ren/Home/Userinfo/seluserinfo_post_josn',{
		'token' : localStorage.token,
	}).success(function(data){
		if(data.msg == 'TRUE'){
			images.src = "http://photo.aihj.ren/photo/get/"+data.info.photo+"/60/60";
			if(data.info.status != '1'){
				$scope.oRadio = { checked: false }
			}
		}
	})
	
	$scope.choosePicMenu = function() {
	    var hidesheet=$ionicActionSheet.show({
	        buttons: [
	            { text: '拍照' },
	            { text: '从手机相册选择' }
	        ],
	        titleText: '选择照片',
	        cancelText: '取消',
	        cancel: function() {
	        },
	        buttonClicked: function(index) {
	            if(index == 0){
	            	
	                var options = {
				      	quality: 50,
				     	destinationType: Camera.DestinationType.DATA_URL,
				      	sourceType: Camera.PictureSourceType.CAMERA,
				      	allowEdit: false,
				      	encodingType: Camera.EncodingType.JPEG,
				      	popoverOptions: CameraPopoverOptions,
				      	saveToPhotoAlbum: true,
					  	correctOrientation:true
					};
					//Camera.getPicture(type)->根据选择的“选取图片”的方式进行选取
		            $cordovaCamera.getPicture(options).then(
		　　　　　　　　　 	//返回一个imageURI，记录了照片的路径
		                function (imageData) {
		                	var imageUrl = imageData;
							$http.post('http://photo.aihj.ren/api/person/photo64',{
								'photo' : imageUrl,
							}).success(function(datas){
								if(datas.result == "true"){
									$http.post('http://api.aihj.ren/Home/Userinfo/updataphoto_post_json',{
										'token' : localStorage.token,
										'photo' : datas.message,	
									}).success(function(data){
										if(data.msg == "TRUE"){
						   	 				images.src = "http://photo.aihj.ren/photo/get/"+datas.message+"/60/60";	
											
											hidesheet();
										}
									})		
								}else{
									
								}
							})
		                },
		                function (err) {
		                	alert("照相失败");
		            });
	           }else if(index == 1){
	                var picOptions = {
					   	maximumImagesCount: 1,
					  	width: 800,
					   	height: 800,
					   	quality: 80
					};
					
				  	$cordovaImagePicker.getPictures(picOptions)
				    .then(function (results) {
				    	var imagesUrl = '';
				      	for (var i = 0; i < results.length; i++) {
				        	imagesUrl += results[i];
				      	}
				      	var requestParme = "?callback=JSON_CALLBACK";
				      	var serve = encodeURI('http://photo.aihj.ren/upload/do_upload' + requestParme);
				      	var fileURL = imagesUrl;
						$cordovaFileTransfer.upload(serve, fileURL)
				      	.then(function(result) {
							$http.post('http://api.aihj.ren/Home/Userinfo/updataphoto_post_json',{
								'token' : localStorage.token,
								'photo' : result.response,	
							}).success(function(data){
								if(data.msg == "TRUE"){
				   	 				images.src = "http://photo.aihj.ren/photo/get/"+result.response+"/60/60";
									
									hidesheet();
								}
							})	
				      	}, function(err) {
				        	alert("失败"+err.message)
				      	});
				    }, function(error) {
				      alert(error)
				    });
	            }
	　　　　　　　	
	        }
	    });
	};
	
 	//设置页面
 	$scope.install = function(){
		$state.go('app.install')
	}
 	//个人信息
	$scope.personinfo = function(){
		$state.go('app.personinfo')
	}
	
	//相册
	$scope.story = function(){
		$state.go('app.story')
	}
	//愿望清单
	$scope.wishlist = function(){
		$state.go('app.wishlist')
	}
	//祭日页面
	$scope.gala = function(){
		$state.go('app.gala')
	}
	//纪念日页面
	$scope.mark = function(){
		$state.go('app.mark')
	}
	//反馈页面
	$scope.feedback = function(){
		$state.go('app.feedback')
	}
	//联系
	$scope.contact = function(){
		$state.go('app.contact')
	}
	//关于
	$scope.about = function(){
		$state.go('app.about')
	}
	//定位开关
	$scope.oPosition = function(){
		if($scope.oRadio.checked){
			$http.post('http://api.aihj.ren/Home/Userinfo/publicgps_post_json',{
				'token' : localStorage.token,
				'status' : '1',
			})
		}else{
			$http.post('http://api.aihj.ren/Home/Userinfo/publicgps_post_json',{
				'token' : localStorage.token,
				'status' : '0',
			})
		}
	}
	
	//退出登录token为空
	$scope.quit = function(){
		$scope.modal.show();
		$state.go('app.home');
		localStorage.token = '';
		localStorage.selfId = '';
		document.getElementById("landing").style.display = "block";
	}
	//跳转到个人资料详情页
	$scope.modifyPersonInfo = function(){
		$state.go('app.modifyPersonInfo');
	}
})
//修改个人资料
.controller('modifyPersonInfoCtrl', function($scope, 
	$stateParams,$ionicPopup,$http,$state) {
	$http.post('http://api.aihj.ren/Home/Userinfo/seluserinfo_post_josn',{
		'token' : localStorage.token,
	}).success(function(data){
		localStorage.selfId = data.info.id;
		$scope.name = data.info.name;
		$scope.sex = data.info.sexName;
		$scope.birthday = new Date(data.info.birthday);
		$scope.email = data.info.email;
		$scope.love = data.info.love;
		$scope.phone = data.info.phone;
	})
	//取消修改个人资料.
	$scope.modifyEditToperson = function(){
		var confirmPopup = $ionicPopup.confirm({
	   	title: '<h3>您确认取消修改吗？</h3>',
	   	cancelText:'取消',
	   	okText:'确定',
	 	});
	 	confirmPopup.then(function(res) {
	   	if(res) {
				$state.go('app.personal')
	   	} else {
	   		
	    }
	  });
	}
	//确认修改个人资料.
	$scope.modifyToperson = function(){
		
		var userName = document.getElementById("selfname").value;
		var userSex = document.getElementById("sex").value;
		var userBirday = document.getElementById("birday").value;
		var userEmail = document.getElementById("email").value;
		var userLove = document.getElementById("love").value;
		$http.post('http://api.aihj.ren/Home/Userinfo/updatauserinfo_post_json',{
			'token' : localStorage.token,
			'name' : userName,
			'sex' : userSex,
			'birthday' : userBirday,
			'email' : userEmail,
			'love' : userLove,
			'id' : localStorage.selfId,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$state.go('app.personal')
			}else{
				$scope.showAlert = function() {
		          	var alertPopup = $ionicPopup.alert({
			            title: '<h3>温馨提醒:</h3>',
	   					okText:'确定',
			            template: data.info,
		          	});
		        }();
			}
		})
		
	}
})
//查看个人资料
.controller('personinfoCtrl', function($scope, $stateParams,$http) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh = function(){
		
		$http.post('http://api.aihj.ren/Home/Userinfo/seluserinfo_post_josn',{
			'token':localStorage.token,
		}).success(function(data){
			if(data.msg == "TRUE"){
				$scope.userInfo = data.info;
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		});
	}
})
//设置
.controller('installCtrl', function($scope, $stateParams) {
})
//成长故事
.controller('storyCtrl', function($scope, $stateParams,$location,$http,$ionicPopup,$state) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh=function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/selphototype_post_json',{
			'token':localStorage.token,
		}).success(function(data){
			if(data.msg == "TRUE"){
				$scope.storyBoxs = data.info;
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		});
	}
	
	$scope.addpic = document.getElementById("addpic");

	$scope.morePic=function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/selpototheme_post_json',{
			
		}).success(function(data){
			if(data.msg == "TRUE"){
				$scope.radios = data.info
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
		var display = $scope.addpic.style.display;

		if(display == ''){
			$scope.addpic.style.display = 'block';
		}else{
			$scope.addpic.style.display ='';
		}
	}
	
	$scope.cancel = function(){
		
		$scope.addpic.style.display = '';
		
	}
	$scope.storyDate = {};
	$scope.creat = function(){
		console.log($scope.storyDate)
		
		var radios = document.getElementsByName("relative");
		
		for(var i=0; i<radios.length; i ++){
			
	      	if(radios[i].checked==true){
	        	var themeid	= radios[i].value;
	      	}
	   	}
		$http.post('http://api.aihj.ren/Home/Userinfo/addtype_post_json',{
		  	'name':$scope.storyDate.title,
			'content':$scope.storyDate.content,
			'themeid':themeid,
			'token':localStorage.token,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$scope.addpic.style.display = '';
				$http.post('http://api.aihj.ren/Home/Userinfo/selphototype_post_json',{
					'token':localStorage.token,
				}).success(function(data){
					if(data.msg == "TRUE"){
						$scope.storyBoxs = data.info	
					}
				});
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
    	});

	}
	$scope.storyDetails = function(a){
		$state.go('app.storydetails',{'data': a},{ reload: true })
	}
	
	$scope.onHoldStory = function(idx){
	 	var confirmPopup = $ionicPopup.confirm({
	  	title: '<h3>确认要删除吗？</h3>',
	  	cancelText:'取消',
	  	okText:'确定',
	 	});
	 	confirmPopup.then(function(res) {
	  	if(res) {
	    	$http.post('http://api.aihj.ren/Home/Userinfo/delphototype_post_json',{
	    		'token' : localStorage.token,
	    		'id' : idx,
	    	}).success(function(data){
	    		if(data.msg == "TRUE"){
	    			$http.post('http://api.aihj.ren/Home/Userinfo/selphototype_post_json',{
						'token':localStorage.token,
					}).success(function(data){
						if(data.msg == "TRUE"){
							$scope.storyBoxs = data.info	
						}
					});
	    		}
	    	})
	   	} else {
	    	
	    }
	  });
	}
})
//相册详情
.controller('storydetailsCtrl', function($scope,$state,$stateParams,$ionicPopup,$ionicActionSheet,$cordovaImagePicker,$cordovaFileTransfer,$timeout,$http) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh=function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/selphoto_post_json',{
			'id' : $stateParams.data,
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == "TRUE"){
				$scope.picData = data.info;
			}
		})
	}
	$scope.addPersonPic = function(){
		var hidesheet = $ionicActionSheet.show({
	        buttons: [
	            { text: '从手机相册选择' }
	        ],
	        titleText: '选择照片',
	        cancelText: '取消',
	        cancel: function() {
	        },
	        buttonClicked: function(index) {
				if(index == 0){
	                var picOptions = {
					   	maximumImagesCount: 9,
					  	width: 800,
					   	height: 800,
					   	quality: 80
					};
				  	$cordovaImagePicker.getPictures(picOptions)
				    .then(function (results) {
						var imagesUrl = '';
						var count=0;
						for(var i = 0; i < results.length; i++) {
							
							var requestParme = "?callback=JSON_CALLBACK";
					    	var serve = encodeURI('http://photo.aihj.ren/upload/do_upload' + requestParme);
					      	var fileURL = results[i];
							$cordovaFileTransfer.upload(serve, fileURL)
					      	.then(function(result) {	
								imagesUrl +=  (result.response+",");
								count++;
								if(count == results.length){
									$http.post('http://api.aihj.ren/Home/Userinfo/addphoto_post_json',{
										'id' : $stateParams.data,
										'token' : localStorage.token,
										'photo' : imagesUrl,
									}).success(function(data){
										if(data.msg == 'TRUE'){
											$http.post('http://api.aihj.ren/Home/Userinfo/selphoto_post_json',{
												'id' : $stateParams.data,
												'token' : localStorage.token,
											}).success(function(data){
												$scope.picData = data.info;
												hidesheet();
											})
										}
									})
								}
					      	}, function(err) {
					        	alert("请重新上传")
					      	});
				      	}
				    }, function(error) {
				      alert(error)
				    });  
	           }
	        }
    	});	
	}
	$scope.onHold = function(idx){
	 	var confirmPopup = $ionicPopup.confirm({
	  		title: '<h3>确认要删除吗？</h3>',
	  		cancelText:'取消',
	  		okText:'确定',
	 	});
	 	confirmPopup.then(function(res) {
		  	if(res) {
		  		$http.post('http://api.aihj.ren/Home/Userinfo/deletephoto_post__json',{
		  			'token' : localStorage.token,
		  			'id' : idx,
		  		}).success(function(data){
		  			if(data.msg == "TRUE"){
		  				$state.go('app.storydetails',{},{reload:true})
		  			}
		  		})
		   	} else {
		    	
		    }
	  	});
	}

	$scope.shouBigImage = function (imageName) {//传递一个参数（图片的URl）
	    $scope.Url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
	    $scope.bigImage = true;   //显示大图
	};
	$scope.bigImage = false;    //初始默认大图是隐藏的
	$scope.hideBigImage = function () {
	    $scope.bigImage = false;
	};
})
//愿望清单(未完成)
.controller('wishlistCtrl', function($scope, $stateParams,$http,$timeout,$state,$ionicSlideBoxDelegate) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh=function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/wishstatus_post_json',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				(function(){
					$ionicSlideBoxDelegate.update();
				})();
				$scope.unfonishWish = data.info;
			}else{
				document.querySelector("#unfinishwish").innerHTML = "<span class='noWish'>小惠提醒您：您还没添加心愿哦！去首页添加心愿吧。</span>"
			}
		})
	}
	
	$scope.finishWish = function(){
		$state.go('app.finishWish')
	}
})
//愿望清单(已完成)
.controller('finishWishCtrl', function($scope, $stateParams,$http,$ionicSlideBoxDelegate) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh = function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/okwishstatus_post_json',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == "TRUE"){
				(function(){
					$ionicSlideBoxDelegate.update();
				})();
				$scope.finishWish = data.info
			}else{
				
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
	
})
//祭日提醒
.controller('galaCtrl', function($scope, $stateParams,$http,$state) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh = function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/seldeathday_post_json',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$scope.galaDate = data.info;
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
	
	$scope.addremind = function(){
		$state.go('app.addremind')
	}
	
})
//添加祭日提醒
.controller('addremindCtrl', function($scope, $stateParams,$http,$state,$ionicPopup) {
	
	$scope.remind = function(){
		var time = document.getElementById("addDate").value;
		var remindContend = document.getElementById("addContent").value;
		
		$http.post('http://api.aihj.ren/Home/Userinfo/deathdayadd_post_json',{
			'token' : localStorage.token,
			'content' : remindContend,
			'remindTime' : time,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$state.go('app.gala')
			}else{
				$scope.showAlert = function() {
		         	var alertPopup = $ionicPopup.alert({
			           	title: '<h3>小惠提醒您:</h3>',
			           	okText:'确定',
			           	template: data.info,
		         	});
		       	}();
			}
		})
	}
})
//纪念日提醒
.controller('markCtrl', function($scope, $stateParams,$http,$state) {
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.doRefresh();
	})
	$scope.doRefresh = function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/selspecial_post_json',{
			'token' : localStorage.token,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$scope.markDate = data.info;
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
	
	$scope.addMarkremind = function(){
		$state.go('app.addMarkremind');
	}
})
//添加纪念日提醒
.controller('addMarkremindCtrl', function($scope, $stateParams,$http,$state,$ionicPopup) {
	$scope.Markremind = function(){
		var Marktime = document.getElementById("addMarkDate").value;
		var MarkremindContend = document.getElementById("addMarkContent").value;
		$http.post('http://api.aihj.ren/Home/Userinfo/addspecial_post_json',{
			'token' : localStorage.token,
			'content' : MarkremindContend,
			'remindTime' : Marktime,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$state.go('app.mark')
			}else{
				$scope.showAlert = function() {
		         	var alertPopup = $ionicPopup.alert({
			           	title: '<h3>小惠提醒您:</h3>',
			           	okText:'确定',
			           	template: data.info,
		         	});
		       	}();
			}
		})
	}
})
//体验反馈
.controller('feedbackCtrl', function($scope, $stateParams,$http,$state) {
	$scope.feedDate = {};
	$scope.feedback = function(){
		$http.post('http://api.aihj.ren/Home/Userinfo/feedback_post_josn',{
			'token' : localStorage.token,
			'content' :$scope.feedDate.content,
		}).success(function(data){
			if(data.msg == 'TRUE'){
				$state.go('app.personal');
			}else{
				if(data.code == '-1'){
					$scope.modal.show();
				}
			}
		})
	}
})
//联系我们
.controller('contactCtrl', function($scope, $stateParams) {
})
//关于
.controller('aboutCtrl', function($scope, $stateParams) {
	
})
;
