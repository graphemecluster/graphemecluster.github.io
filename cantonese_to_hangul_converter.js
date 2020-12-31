(function(main, global) {
	(typeof exports == "object" ? exports : global).CantoneseToHangul = main();
})(function() {
	
	var regex = /((ng|[kgqx](?:w|u(?!e))?|dz|ts|[zcs]h?|[bpmfdtnlhjyw])?(aa?|e[eou]?|o[eo]?|ue?|yu?|i)([iyuo]|(?:ng|[mnpt])(?![aeiou]|y(?![aeiouy]))|[bd](?![aeiouy])|[gk](?![aeiouw]|y(?![aeiouy])))?|(h)?(m|ng))([1-9²³¹⁴-⁹₁-₉])?/g;
	
	var lead = {
		"": "ᄋ",
		b: "ᄇ",
		p: "ᄑ",
		m: "ᄆ",
		f: "ᄈ",
		d: "ᄃ",
		t: "ᄐ",
		n: "ᄂ",
		l: "ᄅ",
		g: "ᄀ",
		k: "ᄏ",
		ng: "ᄍ",
		gw: "ᄁ",
		kw: "ᄄ",
		w: "ᄊ",
		h: "ᄒ",
		z: "ᄌ",
		c: "ᄎ",
		s: "ᄉ",
		j: "ᄋ"
	};
	
	var vowel = {
		aa: "ᅡ",
		a: "ᅥ",
		o: "ᅩ",
		oe: "ᅬ",
		e: "ᅦ",
		i: "ᅵ",
		u: "ᅮ",
		yu: "ᅱ"
	}
	
	var vowelJ = {
		aa: "ᅣ",
		a: "ᅧ",
		o: "ᅭ",
		oe: "ᅬ",
		e: "ᅨ",
		i: "ᅵ",
		u: "ᅲ",
		yu: "ᅱ"
	}
	
	var trail = {
		i: "ᆺ",
		u: "ᆯ",
		m: "ᆷ",
		n: "ᆫ",
		ng: "ᆼ",
		p: "ᆸ",
		t: "ᆮ",
		k: "ᆨ"
	}
	
	var output;

	function finalize(tone, syllable) {
		
		syllable = String.fromCharCode((syllable.charCodeAt(0) - 4352) * 588 + (syllable.charCodeAt(1) - 4449) * 28 + (syllable.charCodeAt(2) - 4519 || 0) + 44032);
		
		if (CantoneseToHangul.withTone && tone) {
			     if ("1¹₁7⁷₇".indexOf(tone) != -1) syllable += "<b>̍</b>";
			else if ("2²₂".indexOf(tone) != -1) syllable += "<b>́</b>";
			else if ("3³₃8⁸₈".indexOf(tone) != -1) syllable += "<b>̄</b>";
			else if ("4⁴₄".indexOf(tone) != -1) syllable += "<b>̩</b>";
			else if ("5⁵₅".indexOf(tone) != -1) syllable += "<b>̗</b>";
			else if ("6⁶₆9⁹₉".indexOf(tone) != -1) syllable += "<b>̱</b>";
		}
		
		output.push(syllable);
		return "<span>" + syllable + "</span>";
		
	}
	
	function CantoneseToHangul(cantonese) {
		
		output = [];
		
		cantonese = cantonese.toLowerCase().replace(regex, function(match, syllable, initial, nucleus, terminal, aspirated, syllabicConsonant, tone) {
				
				if (syllabicConsonant) return finalize(tone, (aspirated ? "ᄒ" : "ᄋ") + "ᅳ" + (syllabicConsonant == "m" ? "ᆷ" : "ᆼ"));
				
					 if (initial == "gu" || initial == "xw" || initial == "xu") initial = "gw";
				else if (initial == "ku" || initial == "qw" || initial == "qu") initial = "kw";
				else if (initial == "dz" || initial == "zh" || CantoneseToHangul.jAsZ && initial == "j") initial = "z";
				else if (initial == "ts" || initial == "ch" || initial == "q") initial = "c";
				else if (initial == "sh" || initial == "x") initial = "s";
				else if (initial == "y") initial = "j";
				
				     if (!initial && (nucleus == "ee" || nucleus == "i" || nucleus == "y")) initial = "j";
				else if (initial == "j" && (nucleus == "u" || nucleus == "oo") && terminal != "ng" && terminal != "g" && terminal != "k") nucleus = "yu";
				
					 if (nucleus == "a" && (terminal == "o" || !terminal)) nucleus = "aa";
				else if (nucleus == "ue" && (terminal == "i" || terminal == "y")) nucleus = "oe";
				else if ((nucleus == "u" || nucleus == "oo") && terminal == "o" || nucleus == "oo" && terminal == "u") nucleus = "o";
				else if (nucleus == "u" && terminal == "u" || (nucleus == "i" || nucleus == "ee" || nucleus == "y") && (terminal == "i" || terminal == "y")) terminal = null;
				
					 if (nucleus == "eo" || nucleus == "eu") nucleus = "oe";
				else if (nucleus == "y" || nucleus == "ue") nucleus = "yu";
				else if (nucleus == "oo") nucleus = "u";
				else if (nucleus == "ee") nucleus = "i";
				
					 if (terminal == "y") terminal = "i";
				else if (terminal == "o") terminal = "u";
				else if (terminal == "b") terminal = "p";
				else if (terminal == "d") terminal = "t";
				else if (terminal == "g") terminal = "k";
				
				return finalize(tone, lead[initial || ""] + (initial == "j" ? vowelJ : vowel)[nucleus] + (trail[terminal] || ""));
				
			}
		);
		
		return CantoneseToHangul.replacementMode ? cantonese.replace(/[ 	 ﻿ -   　]+/g, "") : "<span>" + output.join("") + "</span>";
		
	}
	
	CantoneseToHangul.jAsZ						= false;
	CantoneseToHangul.replacementMode			= true;
	CantoneseToHangul.withTone					= false;
	
	return CantoneseToHangul;
	
}, this);