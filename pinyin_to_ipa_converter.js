(function(main, global) {
	(typeof exports == "object" ? exports : global).PinyinToIPA = main();
})(function() {
	
	var regex = /(?:([zcs]h?|[bpmfdtnlgkhjqxr])((?:(?:(?:[aoe]|i[ao]?|ua)ng|(?:a|e|[iuü]a?)n)(?![aoeiuü])|a[oi]?|ou?|ei?|i(?:ao?|e|u)?|u(?:[oe]|a?i?)|üe?))|((?:(?:(?:[wy]?a|y?o|w?e|yi)ng|(?:w?[ae]|y(?:a|i|ua?))n)(?![aoeiuü])|a[oi]?|ou?|ei?|w(?:ai?|ei|o|u)|y(?:ao?|e|i|ou?|ue?))))(r(?![aoeiuü]))?([1-4])?/g;

	var initialList = {
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
		h: "x",
		j: "t͡ɕ",
		q: "t͡ɕʰ",
		x: "ɕ",
		zh: "ʈ͡ʂ",
		ch: "ʈ͡ʂʰ",
		sh: "ʂ",
		r: "ɻ",
		z: "t͡s",
		c: "t͡sʰ",
		s: "s"
	};

	var finalList = [
		["a", "a", "ä", "ɑ˞"],
		["ai", "ai", "aɪ̯", "ɑ˞"],
		["an", "an", "an", "ɑ˞"],
		["ang", "ang", "ɑŋ", "ɑ̃˞"],
		["ao", "ao", "ɑʊ̯", "ɑʊ̯˞"],
		["e", "e", "ɤ", "ɤ˞"],
		["ei", "ei", "eɪ̯", "ɚ"],
		["en", "en", "ən", "ɚ"],
		["eng", "eng", "əŋ", "ɚ̃"],
		["i", "yi", "i", "iɚ̯"],
		["ia", "ya", "jä", "jɑ˞"],
		["ian", "yan", "jɛn", "jɑ˞"],
		["iang", "yang", "jɑŋ", "jɑ̃˞"],
		["iao", "yao", "jɑʊ̯", "jɑʊ̯˞"],
		["ie", "ye", "jɛ", "jɛ˞"],
		["in", "yin", "in", "iɚ̯"],
		["ing", "ying", "iŋ", "iɚ̯̃"],
		[null, "yo", "jɔ", "jɔ˞"],
		["iong", "yong", "jʊŋ", "jʊ̃˞"],
		["iu", "you", "joʊ̯", "joʊ̯˞"],
		["o", null, "wɔ", "wɔ˞"],
		[null, "o", "ɔ", "ɔ˞"],
		["ong", "ong", "ʊŋ", "ʊ̃˞"],
		["ou", "ou", "oʊ̯", "oʊ̯˞"],
		["u", "wu", "u", "u˞"],
		["ua", "wa", "wä", "wɑ˞"],
		["uai", "wai", "waɪ̯", "wɑ˞"],
		["uan", "wan", "wan", "wɑ˞"],
		["uang", "wang", "wɑŋ", "wɑ̃˞"],
		[null, "weng", "wəŋ", "wɚ̃"],
		["ui", "wei", "weɪ̯", "wɚ"],
		["un", "wen", "wən", "wɚ"],
		["uo", "wo", "wɔ", "wɔ˞"],
		["ü", "yu", "y", "yɚ̯"],
		["üan", "yuan", "ɥɛn", "ɥɑ˞"],
		["üe", "yue", "ɥɛ", "ɥɛ˞"],
		["ün", "yun", "yn", "yɚ̯"]
	];

	return function(pinyin) {
		
		var output = [];
		pinyin = pinyin.normalize("NFD").toLowerCase().replace(/v|ü/g, "ü");
		var pinyin_notone = pinyin.replace(/[̄́̌̀]/g, "");
		var pinyin_normalized = pinyin.normalize("NFC");
		
		pinyin_notone.replace(regex, function(match, initial, onsetFinal, zeroOnsetFinal, erhua, tone, index) {
			
			if (/^[jqx]$/.test(initial)) onsetFinal = onsetFinal.replace(/^u(a?n|e)?$/, "ü$1");
			if (onsetFinal == "ue") onsetFinal = "üe";
			
			var syllable = zeroOnsetFinal
				? finalList.find(function(element) {
					return element[1] == zeroOnsetFinal;
				})[2 + !!erhua]
				: initial == "r" && onsetFinal == "i"
					? "ɻ̩" + (erhua ? "ɚ̯" : "")
					: initialList[initial] + (function(zcs) {
						return zcs && onsetFinal == "i"
							? (zcs[1] ? "ɻ̩" : "ɹ̩") + (erhua ? "ɚ̯" : "")
							: finalList.find(function(element) {
								return element[0] == onsetFinal;
							})[2 + !!erhua];
					})(initial.match(/^[zcs](h)?$/));
			
			output.push((function(searchTone) {
				return (searchTone = searchTone ? "̄́̌̀".indexOf(searchTone[0]) + 1 : tone)
					? syllable.replace(/([aäɑɔoəɚɤeɛiʊuy]̃?|[ɹɻ]̩)/, "$1" + "́̌̀̂".charAt(searchTone - 1))
					: syllable;
			})(pinyin_normalized.substr(index, match.length).normalize("NFD").match(/[̄́̌̀]/)));
			
		});
		return output.join("<span>.</span><wbr>");
	};

}, this);