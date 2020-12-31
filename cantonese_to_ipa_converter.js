(function(main, global) {
	(typeof exports == "object" ? exports : global).CantoneseToIPA = main();
})(function() {
	
	var regex = /((ng|[kgqx](?:w|u(?!e))?|dz|ts|[zcs]h?|[bpmfdtnlhjyw])?(aa?|e[eou]?|o[eo]?|ue?|yu?|i)([iyuo]|(?:ng|[mnpt])(?![aeiou]|y(?![aeiouy]))|[bd](?![aeiouy])|[gk](?![aeiouw]|y(?![aeiouy])))?|(h)?(m|ng))([1-9²³¹⁴-⁹₁-₉])?/g;
	
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
		ou: "o-u̯",
		oei: "ɵ-y̑",
		oen: "ɵ-n",
		oet: "ɵ-t̚",
		ei: "e-i",
		ing: "ɪ-ŋ",
		ik: "ɪ-k̚",
		um: "ʊ-m",
		ung: "ʊ-ŋ",
		up: "ʊ-p̚",
		uk: "ʊ-k̚"
	}
	
	var trail = {
		i: "i̯",
		u: "u̯",
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
		
		if (!tone) {
			output.push(syllable.replace("-", ""));
			return;
		}
		
		tone = toneClass.findIndex(function(item) {
			return item.indexOf(tone) != -1;
		});
		
		if (terminal == "p" || terminal == "t" || terminal == "k") {
			     if (tone == 0) tone = 6;
			else if (tone == 2) tone = 7;
			else if (tone == 5) tone = 8;
		}
		
		output.push(CantoneseToIPA.toneAsSuffix ? syllable.replace("-", "") + (CantoneseToIPA.useToneLetter ? toneLetter : toneNumeral)[tone] : syllable.replace("-", toneDiacritic[tone]));
		
	}
	
	function CantoneseToIPA(cantonese) {
		
		if (CantoneseToIPA.toneAsSuffix) {
			if (CantoneseToIPA.useToneLetter) {
				toneLetter[0] = CantoneseToIPA.tone1Fall ? "˥˧" : "˥";
				toneLetter[3] = CantoneseToIPA.tone4Fall ? "˨˩" : "˩";
			} else {
				toneNumeral[0] = CantoneseToIPA.tone1Fall ? "⁵³" : CantoneseToIPA.doubleToneNumerals ? "⁵⁵" : "⁵";
				toneNumeral[2] = CantoneseToIPA.doubleToneNumerals ? "³³" : "³";
				toneNumeral[3] = CantoneseToIPA.tone4Fall ? "²¹" : CantoneseToIPA.doubleToneNumerals ? "¹¹" : "¹";
				toneNumeral[5] = CantoneseToIPA.doubleToneNumerals ? "²²" : "²";
			}
		} else {
			toneDiacritic[0] = CantoneseToIPA.tone1Fall ? "᷇" : (toneDiacritic[6] = CantoneseToIPA.tone1ExtraHigh ? "̋" : "́");
			toneDiacritic[3] = CantoneseToIPA.tone4Fall ? "᷆" : "̏";
		}
		
		output = [];
		
		cantonese.toLowerCase().replace(regex, function(match, syllable, initial, nucleus, terminal, aspirated, syllabicConsonant, tone) {
				
				if (syllabicConsonant) return finalize(null, tone, (aspirated ? "h" : "") + (syllabicConsonant == "m" ? "m̩-" : "ŋ̍-"));
				
					 if (initial == "gu" || initial == "xw" || initial == "xu") initial = "gw";
				else if (initial == "ku" || initial == "qw" || initial == "qu") initial = "kw";
				else if (initial == "dz" || initial == "zh" || CantoneseToIPA.jAsZ && initial == "j") initial = "z";
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
				
				return finalize(terminal, tone, (lead[initial] || "") + (exception[nucleus + terminal] || (vowel[nucleus] + (trail[terminal] || ""))));
				
			}
		);
		
		return output.join("<span>.</span><wbr>");
		
	}
	
	CantoneseToIPA.jAsZ							= false;
	CantoneseToIPA.toneAsSuffix					= false;
	CantoneseToIPA.		tone1ExtraHigh			= false;
	CantoneseToIPA.		useToneLetter			= true;
	CantoneseToIPA.			doubleToneNumerals	= true;
	CantoneseToIPA.tone1Fall					= false;
	CantoneseToIPA.tone4Fall					= false;
	
	return CantoneseToIPA;
	
}, this);