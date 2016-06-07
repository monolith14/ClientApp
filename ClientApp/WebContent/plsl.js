function genRowSelectPlayes(obj){
	var result = "<div id='team-tactic-r'>"+
				 	"<div id='team-tactic-r1-d1'>"+
				 		"<select class='form-control'>"+
				 			"<option>"+obj.gk+"</option>"+
				 			"<option>"+obj.df1+"</option>"+
				 			"<option>"+obj.df2+"</option>"+
				 			"<option>"+obj.df3+"</option>"+
				 			"<option>"+obj.df4+"</option>"+
				 			"<option>"+obj.df5+"</option>"+
				 			"<option>"+obj.md1+"</option>"+
				 			"<option>"+obj.md2+"</option>"+
				 			"<option>"+obj.md3+"</option>"+
				 			"<option>"+obj.md4+"</option>"+
				 			"<option>"+obj.md5+"</option>"+
				 			"<option>"+obj.fw1+"</option>"+
				 			"<option>"+obj.fw2+"</option>"+
				 			"<option>"+obj.fw3+"</option>"+
				 			"<option>"+obj.fw4+"</option>"+
				 			"<option>"+obj.fw5+"</option>"+
				 			"<option>"+obj.r1+"</option>"+
				 			"<option>"+obj.r2+"</option>"+
				 			"<option>"+obj.r3+"</option>"+
				 			"<option>"+obj.r4+"</option>"+
				 			"<option>"+obj.r5+"</option>"+
				 			"<option>"+obj.r6+"</option>"+
				 			"<option>"+obj.r7+"</option>"+
				 		"</select>"+
				 	"</div>"+		
				 "</div>";
	return result;
}