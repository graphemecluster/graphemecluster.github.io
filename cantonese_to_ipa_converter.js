(function(main, global) {
	(typeof exports == "object" ? exports : global).CantoneseToIPA = main();
})(function() {
	
	var regex = /((ng|[kgqx](?:w|u(?![eiy]))?|dz|ts|[zcs]h?|[bpmfdtnlrhjyw])?(aa?|e[eou]?|o[eo]?|u[ue]?|yy(?![aeiouy])|yu?|ii?)([iuo](?!(?:ng|[mnptkbdg])(?![aeiouy]))|(?:ng|[mnptyw])(?![aeiou]|y(?![aeiouy]))|[bd](?![aeiouy])|[gk](?![aeiouw]|y(?![aeiouy])))?|(h)?(m|ng))([1-9²³¹⁴-⁹₁-₉])?/g;
	
	var lead = {
		b: "p",
		p: "pʰ",
		m: "m",
		f: "f",
		d: "t",
		t: "tʰ",
		n: "n",
		l: "l",
		g: "k",
		k: "kʰ",
		ng: "ŋ",
		gw: "kʷ",
		kw: "kʷʰ",
		w: "w",
		h: "h",
		z: "t͡s",
		c: "t͡sʰ",
		s: "s",
		j: "j"
	};
	
	var vowel = {
		aa: "a-ː",
		a: "ɐ-",
		o: "ɔ-ː",
		oe: "œ-ː",
		e: "ɛ-ː",
		i: "i-ː",
		u: "u-ː",
		yu: "y-ː"
	}

	var exception = {
		ou: null,
		oei: null,
		oen: "ɵ-n",
		oet: "ɵ-t̚",
		ei: null,
		ing: "ɪ-ŋ",
		ik: "ɪ-k̚",
		um: "ʊ-m",
		ung: "ʊ-ŋ",
		up: "ʊ-p̚",
		uk: "ʊ-k̚"
	}
	
	var trail = {
		i: null,
		u: null,
		m: "m",
		n: "n",
		ng: "ŋ",
		p: "p̚",
		t: "t̚",
		k: "k̚"
	}
	
	var toneLetter = [null, "˧˥", "˧", null, "˩˧", "˨", "˥", "˧", "˨"];
	
	var toneNumeral = [null, "³⁵", null, null, "¹³", null, "⁵", "³", "²"];
	
	var toneDiacritic = [null, "᷄", "̄", null, "᷅", "̀", null, "̄", "̀"];
	
	var toneClass = ["1¹₁7⁷₇", "2²₂", "3³₃8⁸₈", "4⁴₄", "5⁵₅", "6⁶₆9⁹₉"];
	
	var output;

	function finalize(terminal, tone, syllable) {
		
		if (!tone) return syllable.replace("-", "");
		
		tone = toneClass.findIndex(function(item) {
			return item.indexOf(tone) != -1;
		});
		
		if (terminal == "p" || terminal == "t" || terminal == "k") {
			     if (tone == 0) tone = 6;
			else if (tone == 2) tone = 7;
			else if (tone == 5) tone = 8;
		}
		
		return CantoneseToIPA.toneAsSuffix ? syllable.replace("-", "") + (CantoneseToIPA.useToneLetter ? toneLetter : toneNumeral)[tone] : syllable.replace("-", toneDiacritic[tone]);
		
	}
	
	function CantoneseToIPA(cantonese) {
		
		if (CantoneseToIPA.toneAsSuffix) {
			if (CantoneseToIPA.useToneLetter) {
				toneLetter[0] = CantoneseToIPA.tone1Fall ? CantoneseToIPA.tone1FullFall ? "˥˩" : "˥˧" : "˥";
				toneLetter[3] = CantoneseToIPA.tone4Fall ? "˨˩" : "˩";
			} else {
				toneNumeral[0] = CantoneseToIPA.tone1Fall ? CantoneseToIPA.tone1FullFall ? "⁵¹" : "⁵³" : CantoneseToIPA.doubleToneNumerals ? "⁵⁵" : "⁵";
				toneNumeral[2] = CantoneseToIPA.doubleToneNumerals ? "³³" : "³";
				toneNumeral[3] = CantoneseToIPA.tone4Fall ? "²¹" : CantoneseToIPA.doubleToneNumerals ? "¹¹" : "¹";
				toneNumeral[5] = CantoneseToIPA.doubleToneNumerals ? "²²" : "²";
			}
		} else {
			toneDiacritic[0] = CantoneseToIPA.tone1Fall ? CantoneseToIPA.tone1FullFall ? "̂" : "᷇" : (toneDiacritic[6] = CantoneseToIPA.tone1ExtraHigh ? "̋" : "́");
			toneDiacritic[3] = CantoneseToIPA.tone4Fall ? "᷆" : "̏";
		}
		trail.i = CantoneseToIPA.useNonSyllabicSymbol ? "i̯" : "j";
		trail.u = CantoneseToIPA.useNonSyllabicSymbol ? "u̯" : "w";
		exception.ou = CantoneseToIPA.useNonSyllabicSymbol ? "o-u̯" : "o-w";
		exception.oei = CantoneseToIPA.useRoundedIForY
			? CantoneseToIPA.useNonSyllabicSymbol ? "ɵ-i̯ʷ" : "ɵ-jʷ"
			: CantoneseToIPA.useNonSyllabicSymbol ? CantoneseToIPA.putYSymbolBelow ? "ɵ-y̯" : "ɵ-y̑" : "ɵ-ɥ";
		exception.ei = CantoneseToIPA.useNonSyllabicSymbol ? "e-i̯" : "e-j";
		
		return cantonese.split("\n").map(function(line) {
			
			output = [];
			
			line.toLowerCase().replace(regex, function(match, syllable, initial, nucleus, terminal, aspirated, syllabicConsonant, tone) {
				
					if (syllabicConsonant) output.push(finalize(null, tone, (aspirated ? "h" : "") + (syllabicConsonant == "m" ? "m̩-" : "ŋ̍-")));
					
						 if (!initial && nucleus == "y") initial = "j";
					else if (initial == "y" && nucleus == "u" && terminal != "ng" && terminal != "g" && terminal != "k") nucleus = "yu";
					
						 if (initial == "gu" || initial == "xw" || initial == "xu") initial = "gw";
					else if (initial == "ku" || initial == "qw" || initial == "qu") initial = "kw";
					else if (initial == "dz" || initial == "zh" || CantoneseToIPA.jAsZ && initial == "j") initial = "z";
					else if (initial == "ts" || initial == "ch" || initial == "q") initial = "c";
					else if (initial == "sh" || initial == "x") initial = "s";
					else if (initial == "r") initial = "l";
					else if (initial == "y") initial = "j";
					
						 if (nucleus == "a" && (terminal == "o" || terminal == "y" || !terminal) || nucleus == "o" && terminal == "w") nucleus = "aa";
					else if (nucleus == "ue" && (terminal == "i" || terminal == "y")) nucleus = "oe";
					else if (!CantoneseToIPA.finalEuAsOe && nucleus == "eu" && !terminal) {nucleus = "e"; terminal = "u";}
					else if ((nucleus == "u" || nucleus == "oo") && terminal == "o" || nucleus == "oo" && (terminal == "u" || terminal == "w")) nucleus = "o";
					else if (nucleus == "ee" && (terminal == "i" || terminal == "y")) nucleus = "e";
					else if ((nucleus == "u" || nucleus == "yu" || nucleus == "ue") && terminal == "u" || (nucleus == "i" || nucleus == "y") && (terminal == "i" || terminal == "y")) terminal = null;
					
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
					
					output.push(finalize(terminal, tone, (lead[initial] || "") + (exception[nucleus + terminal] || (vowel[nucleus] + (trail[terminal] || "")))));
					
				}
			);
			
			return output.join("<span>.</span><wbr>");
			
		}).join("\n");
		
	}
	
	CantoneseToIPA.jAsZ							= false;
	CantoneseToIPA.toneAsSuffix					= false;
	CantoneseToIPA.		tone1ExtraHigh			= false;
	CantoneseToIPA.		useToneLetter			= true;
	CantoneseToIPA.			doubleToneNumerals	= true;
	CantoneseToIPA.tone1Fall					= false;
	CantoneseToIPA.		tone1FullFall			= false;
	CantoneseToIPA.tone4Fall					= false;
	CantoneseToIPA.useNonSyllabicSymbol			= false;
	CantoneseToIPA.		putYSymbolBelow			= false;
	CantoneseToIPA.finalEuAsOe					= false;
	CantoneseToIPA.useRoundedIForY				= false;
	
	return CantoneseToIPA;
	
}, this);