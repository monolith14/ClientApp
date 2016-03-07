$(document).ready(function(){
			//ако има куки скрива формата за вход и показва името на потребителя заедно с бутон за изход
			//ако няма куки показва форма за вход или регистрация
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
			//проверка за куки с отбор, ако не е избран се извежда съобщение и списък със свободните отбори
			if($.cookie("team")=="0"){
				alert("Нямате отбор! Моля, изберете от списъка!");
				$.get("http://localhost:8080/WebGame/db/getteams",function(resultwelcome){
					var tempTeams;
					var arrayTeams = new Array();
					tempTeams = resultwelcome.replace('[','').replace(']','');
					arrayTeams = tempTeams.split(',');
					//alert(arrayTeams.length);
					var tempArray;
					var resultWelcome = "<table id='pickteamtbl' class='table-bordered'><tr><td>Отбор:</td><td>Атака:</td><td>Защита:</td><td>Скорост:</td><td>Техника:</td><td></td></tr>";
					var i;
					for(i=0;i<arrayTeams.length;i++){
						tempArray = arrayTeams[i].split('|');
						resultWelcome+="<tr><td>"+tempArray[1]+"</td><td>"+tempArray[2]+"</td><td>"+tempArray[3]+"</td><td>"+tempArray[4]+"</td><td>"+tempArray[5]+"</td><td><button class='btn btn-success btn-sm'>Избери</button></td></tr>";
					}
					resultWelcome+="</table>";
					$("#welcome-text").html(resultWelcome);
				});
			}
			//заявка към сървиса ако върне данни за потребителя значи входа в системата е успешен и се сетват кукита с данни за потребителя
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
			//натискане на бутон за регистрация показва двата див-а с формата за регистрация като останалата част остава инактивна
			$("#registerbtn").click(function(){
				$("#disable-div").css("display","block");
				$("#register-div").css("display","block");
			});
			//натискане на бутон за регистрация/събмит на формата/ прави се проверка за празни полета и за съвпадение на паролите,
			//заявка към сървиса за регистрация на нов потребител
			$("#frmregisterbtn").click(function(){
				var regName = $("#register-name").val();
				var regMail = $("#register-mail").val();
				var regUsername = $("#register-username").val();
				var regPassword1 = $("#register-password1").val();
				var regPassword2 = $("#register-password2").val();
				if(regName!=""&&regMail!=""&&regUsername!=""&&regPassword1!=""&&regPassword1==regPassword2){
					$.get("http://localhost:8080/WebGame/db/register?username="+regUsername+"&password="+regPassword1+"&name="+regName+"&mail="+regMail,function(resultregister){
						alert(resultregister);
						$("#disable-div").css("display","none");
						$("#register-div").css("display","none");
					});
				}
				else{
					alert("Има празни полета или паролите не съвпадат!");
				}
			});
			//отказ от формата за регистрация - скрива двата див-а
			$("#frmcancelbtn").click(function(){
				$("#disable-div").css("display","none");
				$("#register-div").css("display","none");
			});
			//

			//тест заявка към уеб сървиса за статистика на отделен отбор
			// връща JSON  от обект Team
			$("#test-btn").click(function(){
				$.get("http://localhost:8080/WebGame/db/getteams", function(resulttest){
					$("#main-content").text(resulttest);
				});
			});



});