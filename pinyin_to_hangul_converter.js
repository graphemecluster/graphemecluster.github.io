(function(main, global) {
	(typeof exports == "object" ? exports : global).PinyinToHangul = main();
})(function() {
	
	var regex = /(?:([zcs]h?|[bpmfdtnlgkhjqxr])((?:(?:(?:[aoe]|i[ao]?|ua)ng|(?:a|e|[iuü]a?)n)(?![aoeiuü])|a[oi]?|ou?|ei?|i(?:ao?|e|u)?|u(?:[oe]|a?i?)|üe?))|((?:(?:(?:[wy]?a|y?o|w?e|yi)ng|(?:w?[ae]|y(?:a|i|ua?))n)(?![aoeiuü])|a[oi]?|ou?|ei?|w(?:ai?|ei|o|u)|y(?:ao?|e|i|ou?|ue?))))(r(?![aoeiuü]))?([1-4])?/g;

	var initialList = {
		"": 11,
		b: 7,
		p: 17,
		m: 6,
		f: 8,
		d: 3,
		t: 16,
		n: 2,
		l: 5,
		g: 0,
		k: 15,
		h: 18,
		j: 1,
		q: 4,
		x: 10,
		zh: 12,
		ch: 14,
		sh: 9,
		r: 13,
		z: 1,
		c: 4,
		s: 10
	};

	var finalList = [
		["a", "a", "아"],
		["ai", "ai", "앚"],
		["an", "an", "안"],
		["ang", "ang", "앙"],
		["ao", "ao", "압"],
		["e", "e", "어"],
		["ei", "ei", "엦"],
		["en", "en", "언"],
		["eng", "eng", "엉"],
		["i", "yi", "이"],
		["ia", "ya", "야"],
		["ian", "yan", "옌"],
		["iang", "yang", "양"],
		["iao", "yao", "얍"],
		["ie", "ye", "예"],
		["in", "yin", "인"],
		["ing", "ying", "잉"],
		[null, "yo", "jɔ", "요"],
		["iong", "yong", "용"],
		["iu", "you", "욥"],
		["o", "o", "오"],
		["ong", "ong", "옹"],
		["ou", "ou", "옵"],
		["u", "wu", "우"],
		["ua", "wa", "와"],
		["uai", "wai", "왖"],
		["uan", "wan", "완"],
		["uang", "wang", "왕"],
		[null, "weng", "웡"],
		["ui", "wei", "웾"],
		["un", "wen", "원"],
		["uo", "wo", "오"],
		["ü", "yu", "위"],
		["üan", "yuan", "왼"],
		["üe", "yue", "외"],
		["ün", "yun", "윈"]
	];
	
	var erFinal = {0: 8, 22: 1, 17: 9, 4: -3, 21: 6};

	function PinyinToHangul(pinyin) {
		
		var output = [];
		pinyin = pinyin.normalize("NFD").toLowerCase().replace(/v|ü/g, "ü");
		var pinyin_notone = pinyin.replace(/[̄́̌̀]/g, "");
		var pinyin_normalized = pinyin.normalize("NFC");
		
		pinyin = pinyin_notone.replace(regex, function(match, initial, onsetFinal, zeroOnsetFinal, erhua, tone, index) {
			
			if (/^[jqx]$/.test(initial)) onsetFinal = onsetFinal.replace(/^u(a?n|e)?$/, "ü$1");
			if (onsetFinal == "ue") onsetFinal = "üe";
			
			var syllable = zeroOnsetFinal
				? finalList.find(function(element) {
					return element[1] == zeroOnsetFinal;
				})[2]
				: initial.match(/^(?:[zcs]h?|r)$/) && onsetFinal == "i"
					? "으"
					: finalList.find(function(element) {
						return element[0] == onsetFinal;
					})[2];
			
			syllable = String.fromCharCode(initialList[initial || ""] * 588 + (syllable = syllable.charCodeAt(0) - 44032) % 588 + (+!!erhua && erFinal[syllable % 28]) + 44032) + (PinyinToHangul.withTone
				? (function(searchTone) {
					return searchTone ? searchTone[0] : tone ? "̄́̌̀".charAt(tone - 1) : "";
				})(pinyin_normalized.substr(index, match.length).normalize("NFD").match(/[̄́̌̀]/))
				: "");
			
			output.push(syllable);
			return "<span>" + syllable + "</span>";
			
		});
		
		return PinyinToHangul.replacementMode ? pinyin.replace(/[ 	 ﻿ -   　]+/g, "") : "<span>" + output.join("") + "</span>";
		
	};
	
	PinyinToHangul.replacementMode			= true;
	PinyinToHangul.withTone					= false;
	
	return PinyinToHangul;

}, this);