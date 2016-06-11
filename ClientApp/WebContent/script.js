$(document).ready(function(){
			var myHost = "http://localhost:8080/";
			//ако има куки скрива формата за вход и показва името на потребителя заедно с бутон за изход
			//ако няма куки показва форма за вход или регистрация
			if($.cookie("id")){
				if($.cookie("admin")==1){
					$("#adminbtn").show();
				}
				else{
					$("#adminbtn").hide();
				}
					$("#login-elm").hide();
					$("#logout-elm").show();
					$("#elm-main-login").show();
					//зареждане на име на потребител и отбор в горната лента от куки
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
				$("#adminbtn").hide();
			}
			//проверка за куки с отбор, ако не е избран се извежда съобщение и списък със свободните отбори
			if($.cookie("team")=="0"){
				alert("Нямате избран клуб! Моля, изберете от списъка!");
				$.get(myHost+"WebGame/db/getteams",function(resultwelcome){
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
				$.get(myHost+"WebGame/db/pickteam?uid="+$.cookie("id")+"&teamid="+tempArrayPickteam[0]+"&token="+$.cookie("token")+"&teamname="+tempArrayPickteam[1],function(resultPickTeam){
					alert(resultPickTeam);
					$.cookie("team",tempArrayPickteam[1]);
					window.location.reload(true);
				});
			});
			//заявка към сървиса ако върне данни за потребителя значи входа в системата е успешен и се сетват кукита с данни за потребителя
			$("#loginbtn").on('click',function(){
				var username = $("#username").val();
				var password = $("#password").val();
				$.get(myHost+"WebGame/db/login?username="+username+"&password="+password, function(resultlogin){
					if(resultlogin['id']!="0"){
						$.cookie("id",resultlogin['id']);
						$.cookie("username",resultlogin['username']);
						$.cookie("team",resultlogin['team']);
						$.cookie("teamId",resultlogin['teamId']);
						$.cookie("token",resultlogin['token']);
						$.cookie("name",resultlogin['name']);
						$.cookie("admin",resultlogin['status']);
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
				$.removeCookie("teamId");
				$.removeCookie("token");
				$.removeCookie("name");
				$.removeCookie("admin");
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
					$.get(myHost+"WebGame/db/register?username="+regUsername+"&password="+regPassword1+"&name="+regName+"&mail="+regMail,function(resultregister){
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
				$("#sub-menu").html("&nbsp;");
				$.get(myHost+"WebGame/db/getStandingTable",function(resultStandingTable){
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
			//бутон "Отбор" извежда таблица с играчите на отбора по позиции
			$("#teambtn").click(function(){
				$("#main-content").html("Текст за ?????");
				var teamMenuButtons = "<button class='btn btn-info btn-xs' id='teambtntable'>Състав</button>&nbsp;<button id='teambtntactic' class='btn btn-info btn-xs'>Схема на игра</button>";
				$("#sub-menu").html(teamMenuButtons);
			});		
				$("body").on('click','#teambtntactic',function(){
					var teamTacticTable = "<div id='spacer-120px'></div><div id='team-tactic'>";
					var teamTacticTableDiv;
					$.getJSON(myHost+"WebGame/db/groupteam?teamid="+$.cookie("teamId"), function(resultTeamPlayers1){
						teamTacticTableDiv = genRowSelectPlayes(resultTeamPlayers1);
						//1 - 3  red za napadateli centralni i zashtitnici
						for(taci=0;taci<3;taci++){
						teamTacticTable+="<div id='team-tactic-r'>";
							for(tac_i = 0;tac_i<5;tac_i++){teamTacticTable+=teamTacticTableDiv;}
						teamTacticTable+="</div>";
						teamTacticTable+="<div id='spacer-120px'></div>";
						}
						//posledniq div za vratar
						teamTacticTable+="<div id='team-tactic-r'><div id='team-tactic-r1-d1'></div><div id='team-tactic-r1-d1'></div>";
						teamTacticTable+=teamTacticTableDiv;
						teamTacticTable+="</div>";

					$("#main-content").html(teamTacticTable);
					});
					

				});
				$("body").on('click','#teambtntable',function(){
					$.getJSON(myHost+"WebGame/db/groupteam?teamid="+$.cookie("teamId"), function(resultTeamPlayers){
					var teamPlayersTable ="<table id='teamtbl' class='table-bordered'><tr><td>No:</td><td>Позиция:</td><td>Име:</td><td>Години:</td><td>Атака:</td><td>Защита:</td><td>Скорост:</td><td>Техника:</td><td>Кондиция:</td></tr>";
					teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.gk);
					if(resultTeamPlayers.df1){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.df1);
					}
					if(resultTeamPlayers.df2){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.df2);
					}
					if(resultTeamPlayers.df3){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.df3);
					}
					if(resultTeamPlayers.df4){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.df4);
					}
					if(resultTeamPlayers.df5){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.df5);
					}
					if(resultTeamPlayers.md1){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.md1);
					}
					if(resultTeamPlayers.md2){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.md2);
					}
					if(resultTeamPlayers.md3){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.md3);
					}
					if(resultTeamPlayers.md4){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.md4);
					}
					if(resultTeamPlayers.md5){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.md5);
					}
					if(resultTeamPlayers.fw1){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.fw1);
					}
					if(resultTeamPlayers.fw2){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.fw2);
					}
					if(resultTeamPlayers.fw3){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.fw3);
					}
					if(resultTeamPlayers.fw4){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.fw4);
					}
					if(resultTeamPlayers.fw5){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.fw5);
					}
					if(resultTeamPlayers.r1){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r1);
					}
					if(resultTeamPlayers.r2){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r2);
					}
					if(resultTeamPlayers.r3){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r3);
					}
					if(resultTeamPlayers.r4){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r4);
					}
					if(resultTeamPlayers.r5){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r5);
					}
					if(resultTeamPlayers.r6){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r6);
					}
					if(resultTeamPlayers.r7){
						teamPlayersTable+=createTbRowPLayers(resultTeamPlayers.r7);
					}
					teamPlayersTable+="</table>";

					$("#main-content").html(teamPlayersTable);				
				});
				});
				
			
			
			
			//бутон "Настройки" смяна на парола
			$("#settingsbtn").click(function(){
				var returnSettings = '<div id="changepass-div" class="input-group input-group-sm"><div class="row"><h4 id="reg-header">Смяна на парола:</h4></div><div class="row"><input id="chpass-old" type="password" placeholder="стара парола"></div><div class="row"><input id="chpass-new1" type="password" placeholder="нова парола"></div><div class="row"><input id="chpass-new2" type="password" placeholder="повтори паролата"></div><div class="row"><button class="btn btn-info btn-sm" id="frmchpassbtn">Промяна</button></div></div>';
				$("#main-content").html(returnSettings);
				var teamMenuButtons = "&nbsp;";
				$("#sub-menu").html(teamMenuButtons);
			});
			//бутон потвърждаване за смяна на паролата
			$("body").on('click', '#frmchpassbtn',function(resultChpass){
				var chpasswordold = $("#chpass-old").val();
				var chpasswordnew1 = $("#chpass-new1").val();
				var chpasswordnew2 = $("#chpass-new2").val();
				if(chpasswordnew1==chpasswordnew2 && chpasswordnew1!=""){
					$.get(myHost+"WebGame/db/chpass?passwordOld="+chpasswordold+"&passwordNew="+chpasswordnew1+"&id="+$.cookie('id'),function(resultChpass2){
						alert(resultChpass2);
						window.location.reload(true);
					});
				}
				else{
					alert("Несъвпадение на паролите!");
				}
			});

			//бутон admin
			$("#adminbtn").click(function(){
				$("#main-content").html("кратко разяснение на админ ббутоните");
				var teamMenuButtons = "<button class='btn btn-info btn-xs' id='createplayerbtn'>Генериране на играчи</button>&nbsp;<button id='distributeplayersbtn' class='btn btn-info btn-xs'>Разпределение по отбори</button>&nbsp;<button id='createroundsbtn' class='btn btn-info btn-xs'>Генериране на програма</button>&nbsp;<button id='playgamebtn' class='btn btn-info btn-xs'>Старт на кръга</button>";
				$("#sub-menu").html(teamMenuButtons);
			});

			$("body").on('click','#createplayerbtn',function(){
					var createplayerbtnhtml = "<div id='team-tactic'><h3>Въведете брой играчи за генериране</h3></br><input style='color:black;' size='3' type='text' id='inpcreateplayerqty'>&nbsp;&nbsp;<button class='btn btn-info btn-xs' id='createplayerbtnqty'>Генериране</button></div>";
					$("#main-content").html(createplayerbtnhtml);
				});

			//суб бутон за генериране на играчи
			$("body").on('click','#createplayerbtnqty',function(){
					$.get(myHost+"WebGame/db/createplayer?qty="+$("#inpcreateplayerqty").val(), function(resultCreatePlayers){
						$("#main-content").html(resultCreatePlayers);
					});
			});



			//суб бутон за разпределение на играчите по отбори
			$("body").on('click','#distributeplayersbtn',function(){
					$.get(myHost+"WebGame/db/distributeplayers", function(resultDistributePlayers){
						$("#main-content").html(resultDistributePlayers);
					});
			});


			//суб бутон създаване на програмата
			$("body").on('click','#createroundsbtn',function(){
					$.get(myHost+"WebGame/db/createrounds", function(resultCreateRounds){
						$("#main-content").html(resultCreateRounds);
					});
			});


			//суб бутон старт на кръга
			$("body").on('click','#playgamebtn',function(){
					$.get(myHost+"WebGame/db/playgame", function(resultPlayGame){
						$("#main-content").html(resultPlayGame);
					});
			});


			//тест заявка към уеб сървиса за статистика на отделен отбор
			// връща JSON  от обект Team
			$("#test-btn").click(function(){
				$.get(myHost+"WebGame/db/getteams", function(resulttest){
					$("#main-content").text(resulttest);
				});
			});


			//функции б.б.

			function createTbRowPLayers(a){
				if(a){
					var aa,bb;
					switch (a.position){
						case 0:
						aa="Резерва"; bb="style='color:grey;'";
						break;
						case 1:
						aa="Вратар";bb="style='color:#2C833F;'";
						break;
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						aa="Защитник";bb="style='color:#3E9451;'";
						break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
						aa="Полузащитник";bb="style='color:#6BB57B;'";
						break;
						case 12:
						case 13:
						case 14:
						case 15:
						case 16:
						aa="Нападател";bb="style='color:#84C592;'";
						break;
					}
					return "<tr "+bb+"><td>"+a.playNumber+"</td><td>"+aa+"</td><td>"+a.name+"</td><td>"+a.age+"</td><td>"+a.s1+"</td><td>"+a.s2+"</td><td>"+a.s3+"</td><td>"+a.s4+"</td><td>"+a.condition+"</td></tr>";
				}
			}

			function genRowSelectPlayes(obj){
				var resultGenRow = "<div id='team-tactic-r1-d1'><select class='form-control input-sm'><option> </option>";
				var prefpos;
				if(obj.gk){resultGenRow+="<option>GK-"+obj.gk.name+":"+obj.gk.s1+"-"+obj.gk.s2+"-"+obj.gk.s3+"-"+obj.gk.s4+"</option>";}
				if(obj.df1){resultGenRow+="<option>DF-"+obj.df1.name+":"+obj.df1.s1+"-"+obj.df1.s2+"-"+obj.df1.s3+"-"+obj.df1.s4+"</option>";}
				if(obj.df2){resultGenRow+="<option>DF-"+obj.df2.name+":"+obj.df2.s1+"-"+obj.df2.s2+"-"+obj.df2.s3+"-"+obj.df2.s4+"</option>";}
				if(obj.df3){resultGenRow+="<option>DF-"+obj.df3.name+":"+obj.df3.s1+"-"+obj.df3.s2+"-"+obj.df3.s3+"-"+obj.df3.s4+"</option>";}
				if(obj.df4){resultGenRow+="<option>DF-"+obj.df4.name+":"+obj.df4.s1+"-"+obj.df4.s2+"-"+obj.df4.s3+"-"+obj.df4.s4+"</option>";}
				if(obj.df5){resultGenRow+="<option>DF-"+obj.df5.name+":"+obj.df5.s1+"-"+obj.df5.s2+"-"+obj.df5.s3+"-"+obj.df5.s4+"</option>";}
				if(obj.md1){resultGenRow+="<option>MF-"+obj.md1.name+":"+obj.md1.s1+"-"+obj.md1.s2+"-"+obj.md1.s3+"-"+obj.md1.s4+"</option>";}
				if(obj.md2){resultGenRow+="<option>MF-"+obj.md2.name+":"+obj.md2.s1+"-"+obj.md2.s2+"-"+obj.md2.s3+"-"+obj.md2.s4+"</option>";}
				if(obj.md3){resultGenRow+="<option>MF-"+obj.md3.name+":"+obj.md3.s1+"-"+obj.md3.s2+"-"+obj.md3.s3+"-"+obj.md3.s4+"</option>";}
				if(obj.md4){resultGenRow+="<option>MF-"+obj.md4.name+":"+obj.md4.s1+"-"+obj.md4.s2+"-"+obj.md4.s3+"-"+obj.md4.s4+"</option>";}
				if(obj.md5){resultGenRow+="<option>MF-"+obj.md5.name+":"+obj.md5.s1+"-"+obj.md5.s2+"-"+obj.md5.s3+"-"+obj.md5.s4+"</option>";}
				if(obj.fw1){resultGenRow+="<option>FW-"+obj.fw1.name+":"+obj.fw1.s1+"-"+obj.fw1.s2+"-"+obj.fw1.s3+"-"+obj.fw1.s4+"</option>";}
				if(obj.fw2){resultGenRow+="<option>FW-"+obj.fw2.name+":"+obj.fw2.s1+"-"+obj.fw2.s2+"-"+obj.fw2.s3+"-"+obj.fw2.s4+"</option>";}
				if(obj.fw3){resultGenRow+="<option>FW-"+obj.fw3.name+":"+obj.fw3.s1+"-"+obj.fw3.s2+"-"+obj.gk.fw3+"-"+obj.fw3.s4+"</option>";}
				if(obj.fw4){resultGenRow+="<option>FW-"+obj.fw4.name+":"+obj.fw4.s1+"-"+obj.fw4.s2+"-"+obj.fw4.s3+"-"+obj.fw4.s4+"</option>";}
				if(obj.fw5){resultGenRow+="<option>FW-"+obj.fw5.name+":"+obj.fw5.s1+"-"+obj.fw5.s2+"-"+obj.fw5.s3+"-"+obj.fw5.s4+"</option>";}
				if(obj.r1){resultGenRow+="<option>R-"+obj.r1.name+":"+obj.r1.s1+"-"+obj.r1.s2+"-"+obj.r1.s3+"-"+obj.r1.s4+"</option>";}
				if(obj.r2){resultGenRow+="<option>R-"+obj.r2.name+":"+obj.r2.s1+"-"+obj.r2.s2+"-"+obj.r2.s3+"-"+obj.r2.s4+"</option>";}
				if(obj.r3){resultGenRow+="<option>R-"+obj.r3.name+":"+obj.r3.s1+"-"+obj.r3.s2+"-"+obj.r3.s3+"-"+obj.r3.s4+"</option>";}
				if(obj.r4){resultGenRow+="<option>R-"+obj.r4.name+":"+obj.r4.s1+"-"+obj.r4.s2+"-"+obj.r4.s3+"-"+obj.r4.s4+"</option>";}
				if(obj.r5){resultGenRow+="<option>R-"+obj.r5.name+":"+obj.r5.s1+"-"+obj.r5.s2+"-"+obj.r5.s3+"-"+obj.r5.s4+"</option>";}
				if(obj.r6){resultGenRow+="<option>R-"+obj.r6.name+":"+obj.r6.s1+"-"+obj.r6.s2+"-"+obj.r6.s3+"-"+obj.r6.s4+"</option>";}
				if(obj.r7){resultGenRow+="<option>R-"+obj.r7.name+":"+obj.r7.s1+"-"+obj.r7.s2+"-"+obj.r7.s3+"-"+obj.r7.s4+"</option>";}
				resultGenRow+="</select></div>";
				return resultGenRow;
}



});