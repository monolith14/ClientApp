$(document).ready(
		function() {
			//проверка за съществуващо куки, ако има показва div "menu" и "bot"
			//ако няма показва div "logindiv" за вход
			if(!$.cookie("webgame")){
				$("#logindiv").show();
				$("#menu,#bot").hide();
			}
			else{
				$("#logindiv").hide();
				$("#menu").show();
			}
			//заявка към уеб сървиса с подадени параметри от поле за потребител и парола
			//връща JSON  от обект User
			$("#loginbtn").on('click',function(){
				var username = $("#username").val();
				var password = $("#password").val();
				
				$.get("http://localhost:8080/WebGame/db/login?username="+username+"&password="+password, function(resultlogin){
					if(resultlogin['id']!="0"){
						$.cookie("webgame",resultlogin['token']);
						$("#logindiv").hide();
						$("#menu,#bot").show();
						$("#txtarea").text("");
						alert("Welcome "+resultlogin['name']+"!");
						
					}
					else{
						alert("Invalid username/password");
					}
				});
			});
			//изход и изтрива кукито
			$("#logoutbtn").on('click',function(){
				$.removeCookie("webgame");
				$("#logindiv").show();
				$("#menu,#bot").hide();
				$("#txtarea").text("");
			});
			//тест заявка към уеб сървиса за статистика на отделен отбор
			// връща JSON  от обект Team
			$("#testbtn").on('click',function() {
					var teamnum = $("#teamnum").val();
					$("#txtarea").text("");
					$.get("http://localhost:8080/WebGame/db/teamstats?id="+ teamnum, function(result) {
						$("#txtarea").text(result['name'] + ": Срещи("
											+ result['played'] + "),победи("
											+ result['wons'] + "),равни("
											+ result['draws'] + "),загуби("
											+ result['loss'] + "); Точки: "
											+ result['points']);
					});
			});
			

});