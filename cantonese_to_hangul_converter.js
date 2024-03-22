(function(main, global) {
	(typeof exports == "object" ? exports : global).CantoneseToHangul = main();
})(function() {
	
	var regex = /((ng|[hkgqx](?:w|u(?![eiy]))?|dz|ts|[zcs]h?|[bpmfdtnlrjyw])?(aa?|e[eou]?|o[eo]?|u[ue]?|yy(?![aeiouy])|yu?|ii?)([iuo](?!(?:ng|[mnptkbdg])(?![aeiouy]))|(?:ng|[mnptyw])(?![aeiou]|y(?![aeiouy]))|[bd](?![aeiouy])|[gk](?![aeiouw]|y(?![aeiouy])))?|(h)?(m|ng))([1-9²³¹⁴-⁹₁-₉])?[ \t ﻿ -   　]*/g;
	
	var lead = {
		"": "ᄋ",
		b: "ᄇ",
		p: "ᄑ",
		m: "ᄆ",
		f: "ᄒ1",
		d: "ᄃ",
		t: "ᄐ",
		n: "ᄂ",
		l: "ᄅ",
		g: "ᄀ",
		k: "ᄏ",
		ng: "ᄋ",
		gw: "ᄀ1",
		kw: "ᄏ1",
		w: "ᄋ1",
		h: "ᄒ",
		z: "ᄌ",
		c: "ᄎ",
		s: "ᄉ",
		j: "ᄋ2"
	};
	
	var vowel = {
		aa: ["ᅡ", "ᅪ", "ᅣ"],
		a: ["ᅡ", "ᅪ", "ᅣ"],
		o: ["ᅩ", "ᅯ", "ᅭ"],
		oe: ["ᅥ", "ᅯ", "ᅧ"],
		e: ["ᅦ", "ᅰ", "ᅨ"],
		i: ["ᅵ", "ᅱ", "ᅵ"],
		u: ["ᅮ", "ᅮ", "ᅲ"],
		yu: ["ᅳ", "ᅳ", "ᅳ"]
	};

	var exception = {
		oei: "oe", oen: "oe", oet: "oe",
		ei: "e", ing: "e", ik: "e",
		ou: "o", um: "o", ung: "o", up: "o", uk: "o"
	};
	
	var trail = {
		m: "ᆷ",
		n: "ᆫ",
		ng: "ᆼ",
		p: "ᆸ",
		t: "ᆺ",
		k: "ᆨ"
	};
	
	var output;

	function finalize(append, initial, nucleus, terminal, prolong, prepend, tone) {
		
		var syllable = String.fromCharCode((initial.charCodeAt(0) - 4352) * 588 + (nucleus.charCodeAt(0) - 4449) * 28 + (terminal && terminal.charCodeAt(0) - 4519 || 0) + 44032);
		
		if (CantoneseToHangul.withTone && tone) {
			     if ("1¹₁7⁷₇".indexOf(tone) != -1) syllable += "<b>̍</b>";
			else if ("2²₂".indexOf(tone) != -1) syllable += "<b>́</b>";
			else if ("3³₃8⁸₈".indexOf(tone) != -1) syllable += "<b>̄</b>";
			else if ("4⁴₄".indexOf(tone) != -1) syllable += "<b>̩</b>";
			else if ("5⁵₅".indexOf(tone) != -1) syllable += "<b>̗</b>";
			else if ("6⁶₆9⁹₉".indexOf(tone) != -1) syllable += "<b>̱</b>";
		}
		
		if (!CantoneseToHangul.distinguishLongVowel && !prepend && ~"이우으".indexOf(syllable)) prepend = syllable;
		syllable = append + syllable + (prolong ? "-" : "") + prepend;
		
		output.push(syllable);
		return "<span>" + syllable + "</span>";
		
	}
	
	function CantoneseToHangul(cantonese) {
		
		return cantonese.split("\n").map(function(line) {
			
			output = [];
			
			line = line.toLowerCase().replace(regex, function(match, syllable, initial, nucleus, terminal, aspirated, syllabic, tone) {
				
				if (syllabic) return finalize("", aspirated ? "ᄒ" : "ᄋ", "ᅳ", trail[syllabic], false, "", tone);
				
					 if (!initial && nucleus == "y") initial = "j";
				else if (initial == "y" && nucleus == "u" && terminal != "ng" && terminal != "g" && terminal != "k") nucleus = "yu";
				
					 if (initial == "gu" || initial == "xw" || initial == "xu") initial = "gw";
				else if (initial == "ku" || initial == "qw" || initial == "qu") initial = "kw";
				else if (initial == "hw" || initial == "hu") initial = "f";
				else if (initial == "dz" || initial == "zh" || CantoneseToHangul.jAsZ && initial == "j") initial = "z";
				else if (initial == "ts" || initial == "ch" || initial == "q") initial = "c";
				else if (initial == "sh" || initial == "x") initial = "s";
				else if (initial == "r") initial = "l";
				else if (initial == "y") initial = "j";
				
					 if (nucleus == "a" && (terminal == "o" || terminal == "y" || !CantoneseToHangul.distinguishA && !terminal) || nucleus == "o" && terminal == "w") nucleus = "aa";
				else if (nucleus == "ue" && (terminal == "i" || terminal == "y")) nucleus = "oe";
				else if (!CantoneseToHangul.finalEuAsOe && nucleus == "eu" && !terminal) {nucleus = "e"; terminal = "u";}
				else if ((nucleus == "u" || nucleus == "oo") && terminal == "o" || nucleus == "oo" && (terminal == "u" || terminal == "w")) nucleus = "o";
				else if (nucleus == "ee" && (terminal == "i" || terminal == "y")) nucleus = "e";
				else if ((nucleus == "u" || nucleus == "yu" || nucleus == "ue") && terminal == "u" || (nucleus == "i" || nucleus == "y") && (terminal == "i" || terminal == "y")) terminal = null;
				
				var oet = CantoneseToHangul.distinguishOet && nucleus == "oe" && terminal == "t";
				
					 if (nucleus == "eo" || nucleus == "eu") nucleus = "oe";
				else if (nucleus == "y" || nucleus == "yy" || nucleus == "ue") nucleus = "yu";
				else if (nucleus == "uu" || nucleus == "oo") nucleus = "u";
				else if (nucleus == "ii" || nucleus == "ee") nucleus = "i";
				
					 if (initial == "gw" && nucleus == "u") initial = "g";
				else if (initial == "kw" && nucleus == "u") initial = "k";
				else if (!initial && nucleus == "i" && terminal != "ng" && terminal != "g" && terminal != "k") initial = "j";
				else if (!initial && nucleus == "u" && terminal != "ng" && terminal != "g" && terminal != "k") initial = "w";
				
					 if (terminal == "y") terminal = "i";
				else if (terminal == "o" || terminal == "w") terminal = "u";
				else if (terminal == "b") terminal = "p";
				else if (terminal == "d") terminal = "t";
				else if (terminal == "g") terminal = "k";
				
				var start = lead[initial || ""], special = exception[nucleus + terminal];
				
				return finalize(
					CantoneseToHangul.distinguishNg && initial == "ng" ? "'" : "",
					start[0],
					vowel[special || nucleus][~~start[1]],
					trail[terminal],
					CantoneseToHangul.distinguishLongVowel && (!special && nucleus != "a" || oet),
					terminal == "i" ? nucleus == "oe" ? "으" : "이" : terminal == "u" ? "우" : "",
					tone
				);
				
			});
			
			return CantoneseToHangul.replacementMode ? line : "<span>" + output.join("") + "</span>";
			
		}).join("\n");
		
	}
	
	CantoneseToHangul.jAsZ					= false;
	CantoneseToHangul.replacementMode		= true;
	CantoneseToHangul.withTone				= false;
	CantoneseToHangul.finalEuAsOe			= false;
	CantoneseToHangul.distinguishNg			= true;
	CantoneseToHangul.distinguishLongVowel	= true;
	CantoneseToHangul.		distinguishA	= false;
	CantoneseToHangul.		distinguishOet	= false;
	
	return CantoneseToHangul;
	
}, this);