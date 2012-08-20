$(function(){

	$("#iban").val("");
	$("#bic").val("");


	$("#convert").click(function(event){
		$("#progressbar").css("width", "0%");
		$("#iban").val("");
		$("#bic").val("");

		var bbans = $("#bban").val().split('\n');
		var total = bbans.length;
		var count = 0;
		var converted = 0;
		var startTime = new Date();

		for(var i in bbans){
			var bban = bbans[i];
			var iban = BBANtoIBAN(bban);
			var bic = "";
			if(iban !== "")
				var bic = BBANtoBIC(bban);

			if(iban != "" && bic != "")
				converted++;
			

			$("#iban").val( $("#iban").val() + iban);
			$("#bic").val( $("#bic").val() + bic);

			if(i < total-1){
				$("#iban").val( $("#iban").val() + "\n");
				$("#bic").val( $("#bic").val() + "\n");
			}

			count++;
			$("#progressbar").css("width", count/total*100 + "%");
		}

		var seconds = ( (new Date()).getTime() - startTime.getTime() )/1000;
		$("#stats").html(converted + " rekeningnummers geconverteerd in " + seconds.toFixed(3) + " seconden");

	});


	// samen scrollen:

	$('#bban').scroll(function() {
		var scrollValue = $('#bban').scrollTop();
		$('#iban').scrollTop(scrollValue);
		$('#bic').scrollTop(scrollValue);
	});

	$('#iban').scroll(function() {
		var scrollValue = $('#iban').scrollTop();
		$('#bban').scrollTop(scrollValue);
		$('#bic').scrollTop(scrollValue);
	});

	$('#bic').scroll(function() {
		var scrollValue = $('#bic').scrollTop();
		$('#iban').scrollTop(scrollValue);
		$('#bban').scrollTop(scrollValue);
	});
});






function BBANtoIBAN(bban) {
	bban = bban.replace(/\D/g,''); //niet-numerieke waarden eruit smijten
	bban = bban.replace(/\s/g, ""); //spaties uithalen

	if(bban == "")
		return "";
	
	var bigInt = BigInteger("" + bban + "111400"); //bigint van maken
	var mod = (bigInt.remainder(97)).toJSValue(); //modulo berekenen terug naar int omzetten

	var x = 98 - mod;

	if(x < 10)
		x = "0" + x;
	
	var iban = "BE" + x + " " + bban.substr(0,4) + " " + bban.substr(4,4) + " " + bban.substr(8,4); //spaties tss steken

	if(checkIban(iban))
		return iban;
	else
		return "";
}

function checkIban(iban) {
	iban = iban.replace(/\s/g, ""); //spaties uithalen

	var reversed = iban.substr(4) + iban.substr(0,4);
	var numeric = ""

	for(var i in reversed){
		var character = reversed[i];
		if(ibanletters[character])
			numeric += ibanletters[character];
		else
			numeric += character;
	}

	var bigInt = BigInteger(numeric);
	var mod = (bigInt.remainder(97)).toJSValue();

	if(mod == 1)
		return true;
	else
		return false;
}

var ibanletters = {
	A: 10,
	B: 11,
	C: 12,
	D: 13,
	E: 14,
	F: 15,
	G: 16,
	H: 17,
	I: 18,
	J: 19,
	K: 20,
	L: 21,
	M: 22,
	N: 23,
	O: 24,
	P: 25,
	Q: 26,
	R: 27,
	S: 28,
	T: 29,
	U: 30,
	V: 31,
	W: 32,
	X: 33,
	Y: 34,
	Z: 35
}

function BBANtoBIC(bban) {
	bban = bban.replace(/\D/g,'');

	var first3 = parseInt(bban.substr(0,3));

	for(var i in bics){
		var o = bics[i];
		if(o.from <= first3 && first3 <= o.to)
			return o.bic;
	}

	return "";
}

var bics = [
	{from:000, to:000, bic: "BPOT BE B1"},
	{from:001, to:040, bic: "GEBA BE BB"},
	{from:041, to:045, bic: "VRIJ"},
	{from:046, to:049, bic: "GEBA BE BB"},
	{from:050, to:099, bic: "GKCC BE BB"},
	{from:100, to:101, bic: "NBBE BE BB 203"},
	{from:102, to:102, bic: "nav"},
	{from:103, to:108, bic: "NICA BE BB"},
	{from:109, to:109, bic: "BKCP BE B1 BKB"},
	{from:110, to:110, bic: "BKCP BE BB"},
	{from:111, to:111, bic: "ABER BE 21"},
	{from:112, to:112, bic: "VRIJ"},
	{from:113, to:114, bic: "BKCP BE B1 BKB"},
	{from:115, to:115, bic: "VRIJ"},
	{from:116, to:116, bic: "VRIJ"},
	{from:117, to:118, bic: "VRIJ"},
	{from:119, to:121, bic: "BKCP BE B1 BKB"},
	{from:122, to:123, bic: "OBKB BE 99"},
	{from:124, to:124, bic: "BKCP BE B1 BKB"},
	{from:125, to:126, bic: "CPHB BE 75"},
	{from:127, to:127, bic: "BKCP BE B1 BKB"},
	{from:128, to:128, bic: "VRIJ"},
	{from:129, to:129, bic: "BKCP BE B1 BKB"},
	{from:130, to:130, bic: "VRIJ"},
	{from:131, to:131, bic: "BKCP BE B1 BKB"},
	{from:132, to:132, bic: "BNAG BE BB"},
	{from:133, to:134, bic: "BKCP BE B1 BKB"},
	{from:135, to:136, bic: "VRIJ"},
	{from:137, to:137, bic: "GEBA BE BB"},
	{from:138, to:138, bic: "NAP"},
	{from:139, to:139, bic: "nav"},
	{from:140, to:149, bic: "GEBA BE BB"},
	{from:150, to:150, bic: "BCMC BE BB"},
	{from:151, to:165, bic: "VRIJ"},
	{from:166, to:166, bic: "nav"},
	{from:167, to:170, bic: "VRIJ"},
	{from:171, to:171, bic: "CEVT BE 71"},
	{from:172, to:172, bic: "RABO BE 22"},
	{from:173, to:174, bic: "VRIJ"},
	{from:175, to:175, bic: "NAV"},
	{from:176, to:177, bic: "BSCH BE BR"},
	{from:178, to:179, bic: "COBA BE BX"},
	{from:180, to:182, bic: "VRIJ"},
	{from:183, to:183, bic: "BARB BE BB"},
	{from:184, to:184, bic: "VRIJ"},
	{from:185, to:185, bic: "HBKA BE 22"},
	{from:186, to:188, bic: "VRIJ"},
	{from:189, to:189, bic: "SMBC BE BB"},
	{from:190, to:199, bic: "CREG BE BB"},
	{from:200, to:214, bic: "GEBA BE BB"},
	{from:215, to:219, bic: "VRIJ"},
	{from:220, to:251, bic: "GEBA BE BB"},
	{from:252, to:256, bic: "VRIJ"},
	{from:257, to:257, bic: "GEBA BE BB"},
	{from:258, to:258, bic: "VRIJ"},
	{from:259, to:298, bic: "GEBA BE BB"},
	{from:299, to:299, bic: "BPOT BE B1"},
	{from:300, to:399, bic: "BBRU BE BB"},
	{from:400, to:499, bic: "KRED BE BB"},
	{from:500, to:500, bic: "VRIJ"},
	{from:501, to:501, bic: "DHBN BE BB"},
	{from:502, to:503, bic: "VRIJ"},
	{from:504, to:504, bic: "VOWA BE B1"},
	{from:505, to:506, bic: "NAP"},
	{from:507, to:507, bic: "DIER BE 21"},
	{from:508, to:508, bic: "PARB BE BZ MDC"},
	{from:509, to:509, bic: "ABNA BE 2A IPC"},
	{from:510, to:510, bic: "VAPE BE 21"},
	{from:511, to:511, bic: "NAP"},
	{from:512, to:512, bic: "DNIB BE 21"},
	{from:513, to:513, bic: "SGPB BE 99"},
	{from:514, to:514, bic: "PUIL BE BB"},
	{from:515, to:515, bic: "IRVT BE BB"},
	{from:516, to:516, bic: "VRIJ"},
	{from:517, to:517, bic: "FORD BE 21"},
	{from:518, to:518, bic: "NAP"},
	{from:519, to:519, bic: "BNYM BE BB"},
	{from:520, to:520, bic: "VRIJ"},
	{from:521, to:521, bic: "FVLB BE 22"},
	{from:522, to:522, bic: "UTWB BE BB"},
	{from:523, to:523, bic: "TRIO BE BB"},
	{from:524, to:524, bic: "WAFA BE BB"},
	{from:525, to:529, bic: "VRIJ"},
	{from:530, to:530, bic: "SHIZ BE BB"},
	{from:531, to:531, bic: "NAP"},
	{from:532, to:534, bic: "VRIJ"},
	{from:535, to:535, bic: "FBHL BE 22"},
	{from:536, to:537, bic: "VRIJ"},
	{from:538, to:538, bic: "nav"},
	{from:539, to:539, bic: "NAP"},
	{from:540, to:540, bic: "VRIJ"},
	{from:541, to:541, bic: "BKID BE 22"},
	{from:542, to:544, bic: "VRIJ"},
	{from:545, to:545, bic: "NAP"},
	{from:546, to:546, bic: "WAFA BE BB"},
	{from:547, to:547, bic: "VRIJ"},
	{from:548, to:548, bic: "LOCY BE BB"},
	{from:549, to:549, bic: "CHAS BE BX"},
	{from:550, to:560, bic: "GKCC BE BB"},
	{from:561, to:561, bic: "FTNO BE B1"},
	{from:562, to:569, bic: "GKCC BE BB"},
	{from:570, to:579, bic: "CITI BE BX"},
	{from:580, to:580, bic: "VRIJ"},
	{from:581, to:581, bic: "MHCB BE BB"},
	{from:582, to:582, bic: "VRIJ"},
	{from:583, to:583, bic: "DEGR BE BB"},
	{from:584, to:584, bic: "ICIC GB 2L"},
	{from:585, to:585, bic: "RCBP BE BB"},
	{from:586, to:586, bic: "CFFR BE B1"},
	{from:587, to:587, bic: "nav"},
	{from:588, to:588, bic: "CMCI BE B1"},
	{from:589, to:589, bic: "VRIJ"},
	{from:590, to:594, bic: "BSCH BE BB"},
	{from:595, to:601, bic: "CTBK BE BX"},
	{from:602, to:602, bic: "NAP"},
	{from:603, to:604, bic: "VRIJ"},
	{from:605, to:605, bic: "BKCH BE BB"},
	{from:606, to:606, bic: "VRIJ"},
	{from:607, to:607, bic: "ICBK BE BB"},
	{from:608, to:608, bic: "VRIJ"},
	{from:609, to:609, bic: "NAV"},
	{from:610, to:613, bic: "BDCH BE 22"},
	{from:614, to:623, bic: "VRIJ"},
	{from:624, to:625, bic: "GKCC BE BB"},
	{from:626, to:626, bic: "CPBI FRPP"},
	{from:627, to:629, bic: "VRIJ"},
	{from:630, to:631, bic: "BBRU BE BB"},
	{from:632, to:633, bic: "LOYD BE BB"},
	{from:634, to:636, bic: "BNAG BE BB"},
	{from:637, to:637, bic: "VRIJ"},
	{from:638, to:638, bic: "GKCC BE BB"},
	{from:639, to:639, bic: "ABNA BE 2A MYO"},
	{from:640, to:640, bic: "ADIA BE 22"},
	{from:641, to:641, bic: "VRIJ"},
	{from:642, to:642, bic: "BBVA BE BB"},
	{from:643, to:643, bic: "BMPB BE BB"},
	{from:644, to:644, bic: "VRIJ"},
	{from:645, to:645, bic: "JVBA BE 22"},
	{from:646, to:647, bic: "BNAG BE BB"},
	{from:648, to:650, bic: "VRIJ"},
	{from:651, to:651, bic: "KEYT BE BB"},
	{from:652, to:652, bic: "HBKA BE 22"},
	{from:653, to:655, bic: "VRIJ"},
	{from:656, to:656, bic: "ETHI BE BB"},
	{from:657, to:657, bic: "GKCC BE BB"},
	{from:658, to:658, bic: "HABB BE BB"},
	{from:659, to:663, bic: "VRIJ"},
	{from:664, to:664, bic: "BCDM BE BB"},
	{from:665, to:665, bic: "SPAA BE 22"},
	{from:666, to:666, bic: "nav"},
	{from:667, to:667, bic: "VRIJ"},
	{from:668, to:668, bic: "SBIN BE 2X"},
	{from:669, to:669, bic: "nav"},
	{from:670, to:670, bic: "NYA"},
	{from:671, to:671, bic: "EURB BE 99"},
	{from:672, to:672, bic: "GKCC BE BB"},
	{from:673, to:673, bic: "HBKA BE 22"},
	{from:674, to:674, bic: "ABNA BE 2A IDJ"},
	{from:675, to:675, bic: "BYBB BE BB"},
	{from:676, to:676, bic: "DEGR BE BB"},
	{from:677, to:677, bic: "VRIJ"},
	{from:678, to:678, bic: "DELE BE 22"},
	{from:679, to:679, bic: "PCHQ BE BB"},
	{from:680, to:680, bic: "GKCC BE BB"},
	{from:681, to:681, bic: "VRIJ"},
	{from:682, to:683, bic: "GKCC BE BB"},
	{from:684, to:684, bic: "VRIJ"},
	{from:685, to:686, bic: "BOFA BE 3X"},
	{from:687, to:687, bic: "MGTC BE BE"},
	{from:688, to:688, bic: "SGAB BE B2"},
	{from:689, to:689, bic: "VRIJ"},
	{from:690, to:690, bic: "BNPA BE BB"},
	{from:691, to:691, bic: "FTSB NL 2R"},
	{from:692, to:692, bic: "nav"},
	{from:693, to:693, bic: "BOTK BE BX"},
	{from:694, to:694, bic: "BDCH BE 22"},
	{from:695, to:695, bic: "VRIJ"},
	{from:696, to:696, bic: "CRLY BE BB"},
	{from:697, to:699, bic: "VRIJ"},
	{from:700, to:709, bic: "AXAB BE 22"},
	{from:710, to:718, bic: "NAP"},
	{from:719, to:719, bic: "FTSB BE 22"},
	{from:720, to:721, bic: "ABNA BE BR"},
	{from:722, to:722, bic: "ABNA BE 2A IPC"},
	{from:723, to:724, bic: "ABNA BE BR"},
	{from:725, to:727, bic: "KRED BE BB"},
	{from:728, to:729, bic: "CREG BE BB"},
	{from:730, to:731, bic: "KRED BE BB"},
	{from:732, to:732, bic: "CREG BE BB"},
	{from:733, to:741, bic: "KRED BE BB"},
	{from:742, to:742, bic: "CREG BE BB"},
	{from:743, to:749, bic: "KRED BE BB"},
	{from:750, to:774, bic: "AXAB BE 22"},
	{from:775, to:799, bic: "GKCC BE BB"},
	{from:800, to:816, bic: "AXAB BE 22"},
	{from:817, to:822, bic: "VRIJ"},
	{from:823, to:823, bic: "BLUX BE 41"},
	{from:824, to:824, bic: "NAV"},
	{from:825, to:826, bic: "DEUT BE BE"},
	{from:827, to:827, bic: "ETHI BE BB"},
	{from:828, to:828, bic: "HBKA BE 22"},
	{from:829, to:829, bic: "BMEC BE B1"},
	{from:830, to:839, bic: "GKCC BE BB"},
	{from:840, to:840, bic: "PRIB BE BB"},
	{from:841, to:841, bic: "COVE BE 71"},
	{from:842, to:842, bic: "UBSW BE BB"},
	{from:843, to:843, bic: "FTNO BE B1"},
	{from:844, to:844, bic: "RABO BE 22"},
	{from:845, to:845, bic: "DEGR BE BB"},
	{from:846, to:846, bic: "VRIJ"},
	{from:847, to:847, bic: "-"},
	{from:848, to:849, bic: "VRIJ"},
	{from:850, to:853, bic: "SPAA BE 22"},
	{from:854, to:858, bic: "VRIJ"},
	{from:859, to:863, bic: "SPAA BE 22"},
	{from:864, to:864, bic: "VRIJ"},
	{from:865, to:866, bic: "SPAA BE 22"},
	{from:867, to:867, bic: "VRIJ"},
	{from:868, to:868, bic: "KRED BE BB"},
	{from:869, to:869, bic: "NAP"},
	{from:870, to:872, bic: "BNAG BE BB"},
	{from:873, to:873, bic: "PCHQ BE BB"},
	{from:874, to:874, bic: "BNAG BE BB"},
	{from:875, to:875, bic: "-"},
	{from:876, to:876, bic: "NAP"},
	{from:877, to:879, bic: "BNAG BE BB"},
	{from:880, to:889, bic: "HBKA BE 22"},
	{from:890, to:899, bic: "VDSP BE 91"},
	{from:900, to:902, bic: "NAP"},
	{from:903, to:904, bic: "VRIJ"},
	{from:905, to:905, bic: "BHBE BE B1"},
	{from:906, to:906, bic: "GOFF BE 22"},
	{from:907, to:907, bic: "SPAA BE 22"},
	{from:908, to:908, bic: "CEKV BE 81"},
	{from:909, to:909, bic: "FTNO BE B1"},
	{from:910, to:910, bic: "HBKA BE 22"},
	{from:911, to:911, bic: "TUNZ BE B1"},
	{from:912, to:912, bic: "nav"},
	{from:913, to:913, bic: "EPBF BE BB"},
	{from:914, to:918, bic: "VRIJ"},
	{from:919, to:919, bic: "NAP"},
	{from:920, to:923, bic: "HBKA BE 22"},
	{from:924, to:924, bic: "VRIJ"},
	{from:925, to:925, bic: "HBKA BE 22"},
	{from:926, to:926, bic: "VRIJ"},
	{from:927, to:927, bic: "nav"},
	{from:928, to:928, bic: "VRIJ"},
	{from:929, to:939, bic: "HBKA BE 22"},
	{from:940, to:940, bic: "CLIQ BE B1"},
	{from:941, to:941, bic: "VRIJ"},
	{from:942, to:942, bic: "PUIL BE BB"},
	{from:943, to:943, bic: "nav"},
	{from:944, to:944, bic: "NYA"},
	{from:945, to:945, bic: "JPMG BE BB"},
	{from:946, to:946, bic: "VRIJ"},
	{from:947, to:947, bic: "AARB BE B1"},
	{from:948, to:948, bic: "VRIJ"},
	{from:949, to:949, bic: "HSBC BE BB"},
	{from:950, to:959, bic: "CTBK BE BX"},
	{from:960, to:960, bic: "ABNA BE 2A IPC"},
	{from:961, to:961, bic: "HBKA BE 22"},
	{from:962, to:962, bic: "ETHI BE BB"},
	{from:963, to:963, bic: "AXAB BE 22"},
	{from:964, to:964, bic: "NAP"},
	{from:965, to:965, bic: "ETHI BE BB"},
	{from:966, to:966, bic: "NAP"},
	{from:967, to:967, bic: "VRIJ"},
	{from:968, to:968, bic: "ENIB BE BB"},
	{from:969, to:969, bic: "PUIL BE BB"},
	{from:970, to:971, bic: "HBKA BE 22"},
	{from:972, to:972, bic: "NAP"},
	{from:973, to:973, bic: "ARSP BE 22"},
	{from:974, to:974, bic: "-"},
	{from:975, to:975, bic: "AXAB BE 22"},
	{from:976, to:976, bic: "HBKA BE 22"},
	{from:977, to:977, bic: "VRIJ"},
	{from:978, to:980, bic: "ARSP BE 22"},
	{from:981, to:984, bic: "PCHQ BE BB"},
	{from:985, to:988, bic: "BPOT BE B1"},
	{from:989, to:989, bic: "nav"},
	{from:990, to:999, bic: ""}
];
