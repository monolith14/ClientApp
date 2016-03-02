$(document).ready(
		function() {
			if($.cookie("id")){
					$("#login-elm").hide();
					$("#logout-elm").show();
					$("#elm-main-login").show();
			}
			else{
				$("#login-elm").show();
				$("#logout-elm").hide();
				$("#elm-main-login").hide();
			}
			
			$("#loginbtn").on('click',function(){
				var username = $("#username").val();
				var password = $("#password").val();
				$.get("http://localhost:8080/WebGame/db/login?username="+username+"&password="+password, function(resultlogin){
					if(resultlogin['id']!="0"){
						$.cookie("id",resultlogin['id']);
						$.cookie("username",resultlogin['username']);
						$.cookie("team",resultlogin['team']);
						$.cookie("token",resultlogin['token']);
						$.cookie("name",resultlogin['name']);
						alert("Welcome "+resultlogin['name']+"!");
						window.location.reload(true);

					}
					else{
						alert("Invalid username/password");
					}
				});
			});
			//изход и изтрива кукито
			$("#logoutbtn").click(function(){
				$.removeCookie("id");
				$.removeCookie("username");
				$.removeCookie("team");
				$.removeCookie("token");
				$.removeCookie("name");
				alert("Logout ok!");
				window.location.reload(true);
			});
			//тест заявка към уеб сървиса за статистика на отделен отбор
			// връща JSON  от обект Team
			$("#test-btn").click(function(){
				$.get("http://localhost:8080/WebGame/db/getteams", function(resulttest){
					$("#main-content").text(resulttest);
				});
			});


});