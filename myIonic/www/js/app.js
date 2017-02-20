angular.module('starter', ['ionic', 'ngCordova','starter.controllers','ngFileUpload'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
  	
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	
	$ionicConfigProvider.platform.ios.tabs.style('standard'); 
	$ionicConfigProvider.platform.ios.tabs.position('bottom');
	$ionicConfigProvider.platform.android.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.position('bottom');
	
	$ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
	$ionicConfigProvider.platform.android.navBar.alignTitle('center');
	
	$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
	$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');        

	$ionicConfigProvider.platform.ios.views.transition('ios'); 
	$ionicConfigProvider.platform.android.views.transition('android');
  $stateProvider
    .state('app', {
	    url: '/app',
	    abstract: true,
	    templateUrl: 'templates/menu.html',//默认的样式全在这html里面
	    controller: 'AppCtrl'
		})
  //首页
  	.state('app.home', {
	    url: '/home',
	    views: {
	      'homeContent': {
	        templateUrl: 'templates/home.html',
	        controller: 'homeCtrl'
	      }
	    }
	  })
  	//添加个人更多心愿
  	.state('app.addMoreActive', {
	    url: '/addMoreActive',
	    views: {
	      'homeContent': {
	        templateUrl: 'templates/addMoreActive.html',
	        controller: 'addMoreActiveCtrl'
	      }
	    }
	  })
  	//个人心愿详情
  	.state('app.homedetails', {
	    url: '/homedetails:num',
	    views: {
	      'homeContent': {
	        templateUrl: 'templates/homedetails.html',
	        controller: 'homedetailsCtrl'
	      }
	    }
	  })
  	//联系客服
  	.state('app.customer', {
		    url: '/customer',
		    views: {
		      'homeContent': {
		        templateUrl: 'templates/customer.html',
		        controller: 'customerCtrl'
		      }
		    }
		})
  	//我的更多心愿
  	.state('app.myMoreWish', {
	    url: '/myMoreWish',
	    views: {
	      'homeContent': {
	        templateUrl: 'templates/myMoreWish.html',
	        controller: 'myMoreWishCtrl'
	      }
	    }
	  })
  	//家族成员(个人)心愿详情
  	.state('app.merberWish', {
		    url: '/merberWish',
		    params:{'data':null},
		    views: {
		      'homeContent': {
		        templateUrl: 'templates/merberWish.html',
		        controller: 'merberWishCtrl'
		      }
		    }
		})
  	//家族更多心愿
  	.state('app.fDetails', {
		    url: '/fDetails',
		    views: {
		      'homeContent': {
		        templateUrl: 'templates/fDetails.html',
		        controller: 'fDetailsCtrl'
		      }
		    }
		})
  	
  //家族树
  	.state('app.family', {
	    url: '/family:num',
	    views: {
	      'familyContent': {
	        templateUrl: 'templates/family.html',
	        controller: 'familyCtrl'
	      }
	    }
	  })
  	//添加成员
  	.state('app.aperson', {
	    url: '/aperson',
	    params:{'data':null},
	    views: {
	      'familyContent': {
	        templateUrl: 'templates/aperson.html',
	        controller: 'addPersonCtrl'
	      }
	    }
	  })
  	//修改资料
  	.state('app.editProfile', {
	    url: '/editProfile',
	    params:{'data':null},
	    views: {
	      'familyContent': {
	        templateUrl: 'templates/editProfile.html',
	        controller: 'editProfileCtrl'
	      }
	    }
	  })
  	//查看详情
  	.state('app.viewDetails', {
	    url: '/viewDetails',
	    params:{'data':null},
	    views: {
	      'familyContent': {
	        templateUrl: 'templates/viewDetails.html',
	        controller: 'viewDetailsCtrl'
	      }
	    }
	  })
  	
  //发现
  	.state('app.find', {
	    url: '/find',
	    views: {
	      'findContent': {
	        templateUrl: 'templates/find.html',
	        controller: 'findCtrl'
	      }
	    }
	  })
  	//添加家庭故事
  	.state('app.flystory', {
	    url: '/flystory',
	    views: {
	      'findContent': {
	        templateUrl: 'templates/flystory.html',
	        controller: 'familystoryCtrl'
	      }
	    }
	  })
  	//姓氏搜索
  	.state('app.tobaidu', {
	    url: '/tobaidu',
	    params:{'data':null},
	    views: {
	      'findContent': {
	        templateUrl: 'templates/tobaidu.html',
	        controller: 'toBaiDuCtrl'
	      }
	    }
	  })
  	
  //个人中心
  	.state('app.personal', {
	    url: '/personal',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/personal.html',
	        controller: 'personalCtrl'
	      }
	    }
	  })
  	//修改个人信息
  	.state('app.modifyPersonInfo', {
	    url: '/modifyPersonInfo',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/modifyPersonInfo.html',
	        controller: 'modifyPersonInfoCtrl'
	      }
	    }
	  })
  	//个人详情
	  .state('app.personinfo', {
	    url: '/personinfo',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/personinfo.html',
	        controller: 'personinfoCtrl'
	      }
	    }
	  })
	  //设置
	  .state('app.install', {
	    url: '/install',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/install.html',
	        controller: 'installCtrl'
	      }
	    }
	  })
	  //成长故事(相册)
	  .state('app.story', {
	    url: '/story',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/story.html',
	        controller: 'storyCtrl'
	      }
	    }
	  })
	  //成长故事详情(详情相册)
	  .state('app.storydetails', {
		    url: '/storydetails',
		    params:{'data':null},
		    views: {
		      'personalContent': {
		        templateUrl: 'templates/storydetails.html',
		        controller: 'storydetailsCtrl'
		      }
		    }
		})
	  //愿望清单(未完成)
	  .state('app.wishlist', {
	    url: '/wishlist',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/wishlist.html',
	        controller: 'wishlistCtrl'
	      }
	    }
	  })
	  //愿望清单(已完成)
	  .state('app.finishWish', {
	    url: '/finishWish',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/finishWish.html',
	        controller: 'finishWishCtrl'
	      }
	    }
	  })
	  //祭日提醒
	  .state('app.gala', {
	    url: '/gala',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/gala.html',
	        controller: 'galaCtrl'
	      }
	    }
	  })
	  //添加祭日提醒
	  .state('app.addremind', {
	    url: '/addremind',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/addremind.html',
	        controller: 'addremindCtrl'
	      }
	    }
	  })
	  //纪念日
	  .state('app.mark', {
	    url: '/mark',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/mark.html',
	        controller: 'markCtrl'
	      }
	    }
	  })
	  //添加纪念日提醒
	  .state('app.addMarkremind', {
	    url: '/addMarkremind',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/addMarkremind.html',
	        controller: 'addMarkremindCtrl'
	      }
	    }
	  })
	  //体验反馈
	  .state('app.feedback', {
	    url: '/feedback',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/feedback.html',
	        controller: 'feedbackCtrl'
	      }
	    }
	  })
	  //联系我们
	  .state('app.contact', {
	    url: '/contact',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/contact.html',
	        controller: 'contactCtrl'
	      }
	    }
	  })
		//关于
		.state('app.about', {
	    url: '/about',
	    views: {
	      'personalContent': {
	        templateUrl: 'templates/about.html',
	        controller: 'aboutCtrl'
	      }
	    }
	 	})
		;
  	// if none of the above states are matched, use this as the fallback
  	$urlRouterProvider.otherwise('/app/home');//首先显示的html
});
