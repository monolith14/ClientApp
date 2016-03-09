$(document).ready(function(){
			//ако има куки скрива формата за вход и показва името на потребителя заедно с бутон за изход
			//ако няма куки показва форма за вход или регистрация
			if($.cookie("id")){
					$("#login-elm").hide();
					$("#logout-elm").show();
					$("#elm-main-login").show();
					//зареждане на имен на потребител и отбор в горната лента от куки
					var welcomeUser = $.cookie("name");
					var welcomeTeam = "-";
					if($.cookie("team")!=0){
						welcomeTeam = $.cookie("team");
					}
					$("#welcome-manager-team").html("Мениджър: "+welcomeUser+" - "+welcomeTeam);
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
						resultWelcome+="<tr><td>"+tempArray[1]+"</td><td>"+tempArray[2]+"</td><td>"+tempArray[3]+"</td><td>"+tempArray[4]+"</td><td>"+tempArray[5]+"</td><td><button class='btn btn-success btn-sm' id='choosetmbtn' value="+tempArray[0]+"|"+tempArray[1]+">Избери</button></td></tr>";
					}
					resultWelcome+="</table>";
					$("#welcome-text").html(resultWelcome);
				});
			}
			//ако има избран отбор се извежда нещо????
			else{
				
			}
			//избор на отбор от таблицата
			$('body').on('click', '#choosetmbtn', function (){
				//alert($(this).prop("value"));
				//http://localhost:8080/WebGame/db/pickteam?uid=1&teamid=3&token=000000000000&teamname=Barcelona
				var tempArrayPickteam = $(this).prop("value").split('|');
				$.get("http://localhost:8080/WebGame/db/pickteam?uid="+$.cookie("id")+"&teamid="+tempArrayPickteam[0]+"&token="+$.cookie("token")+"&teamname="+tempArrayPickteam[1],function(resultPickTeam){
					alert(resultPickTeam);
					$.cookie("team",tempArrayPickteam[1]);
					window.location.reload(true);
				});
			});
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
						alert("Здравей "+resultlogin['name']+"!");
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
				alert("Успешен изход от системата!");
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
			//бутон "Начало" 
			$("#homebtn").click(function(){
				window.location.reload(true);
			});
			//бутон класиране
			$("#standingbtn").click(function(){
				$.get("http://localhost:8080/WebGame/db/getStandingTable",function(resultStandingTable){
					var tempStandingTable = resultStandingTable.replace('[','').replace(']','');
					var arrayStandingTable = new Array();
					var arrayStandingTableParted;
					var i_st;
					var returnStandingTable = '<table id="standingtbl" class="table-bordered"><tr><td>№</td><td>Мениджър:</td><td>Отбор:</td><td>Срещи:</td><td>Победи:</td><td>Равни:</td><td>Загуби:</td><td>Голове:</td><td>Точки:</td></tr>';
					arrayStandingTable = tempStandingTable.split(',');
					for(i_st = 0; i_st<arrayStandingTable.length;i_st++){
						arrayStandingTableParted = arrayStandingTable[i_st].split('|');
						if(arrayStandingTableParted[7]=='null'){
							arrayStandingTableParted[7] = 'свободен';
						}
						returnStandingTable +='<tr><td>'+(i_st+1)+'</td><td>'+arrayStandingTableParted[7]+'</td><td>'+arrayStandingTableParted[0]+'</td><td>'+arrayStandingTableParted[1]+'</td><td>'+arrayStandingTableParted[2]+'</td><td>'+arrayStandingTableParted[3]+'</td><td>'+arrayStandingTableParted[4]+'</td><td>'+arrayStandingTableParted[5]+'</td><td>'+arrayStandingTableParted[6]+'</td></tr>';
					}
					returnStandingTable+='</table>';
					$("#main-content").html(returnStandingTable);
				});
			});
			//бутон "Отбор" извеждат се показателите на отбора с кратки обяснения
			$("#teambtn").click(function(){
				$.get("http://localhost:8080/WebGame/db/getpt?team="+$.cookie("team"),function(resultTeam){
					var tempArrayTeam = resultTeam.replace('[','').replace(']','');
					var arrayTeam = new Array();
					arrayTeam = tempArrayTeam.split("|");
					var teamAttack = arrayTeam[0];
					var teamDefence = arrayTeam[1];
					var teamSpeed = arrayTeam[2];
					var teamTech = arrayTeam[3];
					var teamExtra = arrayTeam[4];
					var teamTotal = teamAttack+teamDefence+teamSpeed+teamTech+teamExtra;
					var tmpAtt = teamAttack;
					var tmpDef = teamDefence;
					var tmpSpd=teamSpeed;
					var tmpTec=teamTech;
					var tmpExt = teamExtra;

					var returnTeam = '<table id="teamtbl" class="table-bordered"><tr><td colspan="5"><h4>'+$.cookie('team')+'</h4></td></tr><tr><td>Атака:</td><td>Защита:</td><td>Скорост:</td><td>Техника:</td><td>За разпределяне:</td></tr><tr><td><button id ="team-att-plus" class="btn btn-danger btn-xs"> + </button><span id="teamAttPoint">'+arrayTeam[0]+'</span><button id ="team-att-minus" class="btn btn-primary btn-xs">&nbsp;-</button></td><td>'+arrayTeam[1]+'</td><td>'+arrayTeam[2]+'</td><td>'+arrayTeam[3]+'</td><td>'+arrayTeam[4]+'</td></tr></table>';

					$('body').on('click',"#team-att-plus",function(){
						$("#team-att-plus").prop("disabled","true");
						$("#teamAttPoint").text(parseInt(tmpAtt)+1);
						//да се допишат 2 метода единия да проверява има ли доп. точки за разпределяне, ако няма да деактивира бутоните
						//другия да проверява текуща стойност и да сравнява с първоначалната, ако са равни да деактивира бутона минус ?????????????????
					});


					returnTeam +="<ul><li><b>Атака</b> - показател на отбора пред противниковата врата. По-висока стойност означава по-голям процент на реализираните положения.</li><li><b>Защита</b> - показател на отбора за защита. По-висока стойност означава по-малък шанс за допускане на гол.</li><li><b>Скорост</b> - показател за придвижването на отбора по терена. По-висока стойност означава по-бързо прегрупиране от атака към защита и обратно, което води до създаване на по-голям брой положения.</li><li><b>Техника</b> - показател за техническите умения на отбора. По-висока стойност означава по-добър контрол на играта, съответно повече владение и повече положения за реализация.</li></ul>";
					$("#main-content").html(returnTeam);
				});
			});
			
			
			//бутон "Настройки" смяна на парола
			$("#settingsbtn").click(function(){
				var returnSettings = '<div id="changepass-div" class="input-group input-group-sm"><div class="row"><h4 id="reg-header">Смяна на парола:</h4></div><div class="row"><input id="chpass-old" type="password" placeholder="стара парола"></div><div class="row"><input id="chpass-new1" type="password" placeholder="нова парола"></div><div class="row"><input id="chpass-new2" type="password" placeholder="повтори паролата"></div><div class="row"><button class="btn btn-info btn-sm" id="frmchpassbtn">Промяна</button></div></div>';
				$("#main-content").html(returnSettings);
			});
			//бутон потвърждаване за смяна на паролата
			$("body").on('click', '#frmchpassbtn',function(resultChpass){
				var chpasswordold = $("#chpass-old").val();
				var chpasswordnew1 = $("#chpass-new1").val();
				var chpasswordnew2 = $("#chpass-new2").val();
				if(chpasswordnew1==chpasswordnew2 && chpasswordnew1!=""){
					$.get("http://localhost:8080/WebGame/db/chpass?passwordOld="+chpasswordold+"&passwordNew="+chpasswordnew1+"&id="+$.cookie('id'),function(resultChpass2){
						alert(resultChpass2);
						window.location.reload(true);
					});
				}
				else{
					alert("Несъвпадение на паролите!");
				}
			});
			//тест заявка към уеб сървиса за статистика на отделен отбор
			// връща JSON  от обект Team
			$("#test-btn").click(function(){
				$.get("http://localhost:8080/WebGame/db/getteams", function(resulttest){
					$("#main-content").text(resulttest);
				});
			});



});