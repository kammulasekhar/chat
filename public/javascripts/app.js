'use strict';
var app = angular.module('chatApp', ['ui.router', 'toastr']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $urlRouterProvider.otherwise('/');
  
    $stateProvider
    .state('index', {
      url: '/',
      templateUrl: '../views/login.html',
      controller: 'chatCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: '../views/register.html',
      controller: 'chatCtrl'
    })
    .state('dashboard', {
      url: '/dashboard',
      views: {
        '': {
          templateUrl: '../views/dashboard.html',
          controller: 'chatCtrl'
        },
        'recent-chats@dashboard': {
          templateUrl: '../views/recent-chats.html'
        },
        'chat-box@dashboard': {
          templateUrl: '../views/welcome.html'
        }
      }
    })
    .state('dashboard.contacts', {
      url: '/contacts',
      views: {
        'recent-chats@dashboard': {
          templateUrl: '../views/contacts.html'
        }
      }
    })
    .state('dashboard.chat-box', {
      url: '/:selectedContact',
      views: {
        'chat-box@dashboard': {
          templateUrl: '../views/chat-box.html'
        }
      }
    })
});

app.controller('chatCtrl', function($scope, $http, $state, toastr, $timeout) {
  $scope.nameExp = /[^A-Z ]{3,30}/g;
  $scope.emailExp = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,}$/i;
  $scope.mobilenumberExp = /^[0-9]{10,10}$/;
  $scope.pincodeExp = /^[0-9]{6}$/;
  var socket = io.connect('');
  socket.on('connect', function() {
    socket.on('server-error', function(){
      toastr.error('Please try again', 'It seems thatserver not responding');
    });
    $scope.register = {name: '', email: '', mobilenumber: '', password: '', confirmpassword: ''};
    $scope.checkemail = 'exists';
    $scope.checkEmail = function(email){
      socket.emit('check-email', email, socket.id);
    }
    socket.on('email-not-exists', function(){
      $scope.checkemail = 'not exists';
      $('.email').removeClass('is-invalid');
      $('.email').next('.invalid-feedback').html('');
    });
    socket.on('email-exists', function(){
      $scope.checkemail = 'exists';
      $('.email').addClass('is-invalid');
      $(".email").next('.invalid-feedback').html('email already exists');
    });
    $scope.userRegister = function(){
      if($scope.register.name !== undefined && $scope.register.email !== undefined && $scope.register.mobilenumber !== undefined && $scope.register.password !== undefined && $scope.register.confirmpassword !== undefined){
        if($scope.register.name !== '' && $scope.register.email !== '' && $scope.register.mobilenumber !== '' && $scope.register.password !== '' && $scope.register.confirmpassword !== ''){
          if ($scope.nameExp.test($scope.register.name) && $scope.emailExp.test($scope.register.email) && $scope.mobilenumberExp.test($scope.register.mobilenumber)){
            if($scope.register.password === $scope.register.confirmpassword && $scope.checkemail === 'not exists'){
              socket.emit('register', $scope.register, new Date(), socket.id);
            }
          }
        }
      }
    }
    socket.on('register-fail', function(registerdata, registeredon){
      toastr.error('Please try again', ''+registerdata.name+', it seems that server is not responding');
    });
    socket.on('register-success', function(registerdata, registeredon){
      $("#registerForm")[0].reset();
      $scope.register = {name: '', email: '', mobilenumber: '', password: '', confirmpassword: ''};
      $state.go('index');
      toastr.success('Login here', ''+registerdata.name+', you have been successfully registered');
    });
    if(JSON.parse(localStorage.getItem('email'))){
      socket.emit('get-client-data', JSON.parse(localStorage.getItem('email')));
    }
    socket.on('client-data-not-found', function(){
      localStorage.clear();
      $scope.clientdata = null;
      if($state.current.name === 'dashboard'){
        $state.go('index');
      }
    });
    socket.on('client-data-found', function(clientdata){
      delete clientdata.password;
      $scope.clientdata = clientdata;
      socket.emit('push-client', {email: $scope.clientdata.email});
      socket.emit('get-contacts', $scope.clientdata);
    });
    $scope.login = {useremail: '', password: ''};
    $scope.clientdata = null;
    $scope.userLogin = function(){
      if($scope.login.useremail !== '' && $scope.login.useremail !== undefined && $scope.login.password !== '' && $scope.login.password !== undefined){
        if($scope.emailExp.test($scope.login.useremail)){
          $http.post('/login', $scope.login).then(function successCallback(response){
            localStorage.setItem('email', JSON.stringify(response.data.userdata.email));
            $("#loginForm")[0].reset();
            $scope.login = {useremail: '', password: ''};
            $state.go('dashboard');
          },function errorCallback(response){
            socket.emit('check-credantials-onfailure', response.config.data, socket.id);
          });
        }
      }
    }
    socket.on('check-credantials', function(errdata, credantialdata){
      if(errdata === 'Oops! Wrong password.'){
        $scope.login.useremail = credantialdata.useremail;
        $('.password').addClass('is-invalid');
        $('.password').next('.invalid-feedback').html(errdata);
      }else{
        $('.email').addClass('is-invalid');
        $('.email').next('.invalid-feedback').html(errdata);
      }
    });
    socket.on('online-clients', function(clients){
      for(var i=0; i<clients.length; i++){
        if($scope.clientdata !== null){
          if(clients[i].email === $scope.clientdata.email){
            clients.splice(i, 1);
          }
        }
      }
      $scope.onlinecontacts = clients;
    });
    socket.on('contacts', function(contactsdata){
      $scope.contacts = contactsdata;
      $scope.$digest();
    });
    $scope.selectedContactFun = function(contact){
      $scope.selectedContact = contact;
      $state.go('dashboard.chat-box', {selectedContact: $scope.selectedContact.email});
    }

    $scope.message={message:''};
    $scope.sendMessage = function(){
      if($scope.message.message !== ''){
        socket.emit('send-message', $scope.message.message, $scope.selectedContact.email, $scope.clientdata.email);
        $scope.message.message = '';
      }
    }
    socket.on('recieve-message', function(message){
      console.log(message);
    });

    $scope.logout = function(){
      socket.emit('logout', $scope.clientdata);
      localStorage.clear();
      $scope.clientdata = null;
      $state.go('index');
      $http.get('/logout');
    }
  });
});

app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

app.directive('formValidation', function(){
  return{
    link: function(){
      var nameExp = /[^A-Z ]{3,30}/g,emailExp = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,}$/i,mobilenumberExp = /^[0-9]{10,10}$/;
      $('.name').bind('keyup', function(){
          var i = $(this);
          i.val(i.val().replace(/[^a-zA-Z ]/g, function(){
          i.addClass('is-invalid');
          i.next('.invalid-feedback').html('no special characters are allowed');
          setTimeout(function(){i.removeClass('is-invalid')}, 1000);
          return '';
          }));
      });
      $('.name').bind('blur',function(){
          if($(this).val() !== ''){
          if (nameExp.test(this.value)){$(this).removeClass('is-invalid');}
          else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('name should be aleast 3 and maximum 35 characters.');}
          }
      });
      $('.email').bind('blur',function(){
          if($(this).val() !== ''){
          if (emailExp.test(this.value)){
              if($(this).next('.invalid-feedback').html() !== 'email already exists'){
              $(this).removeClass('is-invalid');
              }
          }
          else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('Invalid email');}
          }
      });
      $('.mobilenumber').bind('blur', function(){
          if($(this).val() !== ''){
          if (mobilenumberExp.test(this.value)){$(this).removeClass('is-invalid');}
          else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('Please enter a 10 digit phone number');}
          }
      });
      $(".confirmpassword").bind('keyup blur', function(){
          if($(this).val() !== '' && $('.password').val() !== ''){
          if($('.password').val() === $(this).val()){$(this).removeClass('is-invalid');}
          else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('Please enter the same password again.');}
          }
      });
    }
  }
});

app.directive('customeJs', function(){
  return{
    link: function(){
      $(".preloader").fadeOut();
      $(".left-sidebar").hover(
        function() {
          $(".navbar-header").addClass("expand-logo");
        },
        function() {
          $(".navbar-header").removeClass("expand-logo");
        }
      );
      $(".nav-toggler").on('click', function() {
        $("#main-wrapper").toggleClass("show-sidebar");
        $(".nav-toggler i").toggleClass("ti-menu");
      });
      $(".nav-lock").on('click', function() {
        $("body").toggleClass("lock-nav");
        $(".nav-lock i").toggleClass("mdi-toggle-switch-off");
        $("body, .page-wrapper").trigger("resize");
      });
      $(".search-box a, .search-box .app-search .srh-btn").on('click', function() {
        $(".app-search").toggle(200);
        $(".app-search input").focus();
      });
      $(function() {
        $(".service-panel-toggle").on('click', function() {
          $(".customizer").toggleClass('show-service-panel');
        });
        $('.page-wrapper').on('click', function() {
          $(".customizer").removeClass('show-service-panel');
        });
      });
      $('.floating-labels .form-control').on('focus blur', function(e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
      }).trigger('blur');
      $(function() {
        $('[data-toggle="tooltip"]').tooltip()
      })
      $(function() {
        $('[data-toggle="popover"]').popover()
      })

      /*var ps = new PerfectScrollbar('.message-body');
      var ps = new PerfectScrollbar('.notifications');
      var ps = new PerfectScrollbar('.scroll-sidebar');
      var ps = new PerfectScrollbar('.customizer-body');*/
      $("body, .page-wrapper").trigger("resize");
      $(".page-wrapper").show();
      $(".list-task li label").click(function() {
        $(this).toggleClass("task-done");
      });
      var setsidebartype = function() {
        var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
        if (width < 1170) {
          $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
        } else {
          $("#main-wrapper").attr("data-sidebartype", "full");
        }
      };
      $(window).ready(setsidebartype);
      $(window).on("resize", setsidebartype);
      $('.sidebartoggler').on("click", function() {
        $("#main-wrapper").toggleClass("mini-sidebar");
        if ($("#main-wrapper").hasClass("mini-sidebar")) {
          $(".sidebartoggler").prop("checked", !0);
          $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
        } else {
          $(".sidebartoggler").prop("checked", !1);
          $("#main-wrapper").attr("data-sidebartype", "full");
        }
      });
      //sidebar menu
      $('#sidebarnav a').on('click', function (e) {
        if (!$(this).hasClass("active")) {
          // hide any open menus and remove all other classes
          $("ul", $(this).parents("ul:first")).removeClass("in");
          $("a", $(this).parents("ul:first")).removeClass("active");
          // open our new menu and add the open class
          $(this).next("ul").addClass("in");
          $(this).addClass("active");
        }
        else if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(this).parents("ul:first").removeClass("active");
          $(this).next("ul").removeClass("in");
        }
      })
      $('#sidebarnav >li >a.has-arrow').on('click', function (e) {
        e.preventDefault();
      });
    }
  }
});

app.directive('scrollBar', function(){
  return{
    link: function(){
      $('.message-center, .customizer-body, .scrollable').perfectScrollbar({
        wheelPropagation: !0
      });
      $('.scroll-sidebar .ps-scrollbar-y-rail').css({'background':'transparent'});
      $('.scroll-sidebar .ps-scrollbar-y-rail .ps-scrollbar-y').css({'background':'rgba(255, 255, 255, 0.8)','right':'-3px'});
    }
  }
});