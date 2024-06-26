(function(main, global) {
	(typeof exports == "object" ? exports : global).CantoneseToKana = main();
})(function() {
	const regex = /(?:(ng|[kgqx](?:w|u(?=a|o(?!e|u)))?|dz|ts|[zcs]h?|y(?!y)|[bpmfdtnlhjw])?(?:(aa?)o|(aa?|ee|oo?|i)u|(aa?|e[eou]?|o[eo]?|ue?)(?:i|y(?![aeiou]|n(?![aeiouyg])|t(?![aeiouy])))|(aa?|e[eou]?|o[eo]?|ue?|yu?|i)((?:ng?|[mptkbd])(?![aeiou]|y(?![aeio]))|g(?![aeiou]|y(?![aeio])|w[aeiouy]))?)|(h)?(m|ng))([1-9²³¹⁴-⁹₁-₉])?/gi;

	const baseKana = ["ア", "イ", "ウ", "エ", "オ"];
	const onset = {
		b: ["バ", "ビ", "ブ", "ベ", "ボ"],
		p: ["パ", "ピ", "プ", "ペ", "ポ"],
		m: ["マ", "ミ", "ム", "メ", "モ"],
		f: ["ファ", "フィ", "フ", "フェ", "フォ"],
		d: ["ダ", "ディ", "ドゥ", "デ", "ド"],
		t: ["タ", "ティ", "トゥ", "テ", "ト"],
		n: ["ナ", "ニ", "ヌ", "ネ", "ノ"],
		l: ["ラ", "リ", "ル", "レ", "ロ"],
		g: ["ガ", "ギ", "グ", "ゲ", "ゴ"],
		k: ["カ", "キ", "ク", "ケ", "コ"],
		ng: ["カ゚", "キ゚", "ク゚", "ケ゚", "コ゚"],
		gw: ["グァ", "グィ", "グ", "グェ", "グォ"],
		kw: ["クァ", "クィ", "ク", "クェ", "クォ"],
		w: ["ワ", "ウィ", "ウ", "ウェ", "ウォ"],
		h: ["ハ", "ヒ", "ホゥ", "ヘ", "ホ"],
		z: ["ザ", "ズィ", "ズ", "ゼ", "ゾ"],
		c: ["ツァ", "ツィ", "ツ", "ツェ", "ツォ"],
		s: ["サ", "スィ", "ス", "セ", "ソ"],
		j: ["ヤ", "イ", "ユ", "イェ", "ヨ"],
	};
	const nucleus = { aa: "アー", a: "ア", e: "エー", ee: "エ", o: "オー", oo: "オ", oe: "オェー", eo: "オェ", i: "イー", u: "ウー", yu: "ウュー" };
	const coda = { i: "イ", u: "ウ", m: "ㇺ", n: "ㇴ", ng: "ン", p: "ㇷ゚", t: "ㇳ", k: "ㇰ", h: "ッ" };

	const aspiratedOnset = new Set(["p", "t", "k", "kw", "c"]);
	const toAspirated = { b: "p", d: "t", g: "k", gw: "kw", z: "c" };
	const aspiratedSmallKana = ["ㇵ", "ㇶ", "ㇷ", "ㇸ", "ㇹ"];

	const homorganicConsonants = {
		p: new Set(["b", "p", "m", "f"]),
		t: new Set(["d", "t", "n", "l", "z", "c", "s"]),
		k: new Set(["g", "k", "gw", "kw", "ng"]),
	};

	function sup(content) {
		if (typeof document === "undefined") return content;
		const sup = document.createElement("sup");
		sup.appendChild(document.createTextNode(content));
		return sup;
	}

	const prototype = {
		regex,
		transform(match, initial, nucleusO, nucleusU, nucleusI, nucleusActual, terminal, aspirated, syllabicConsonant, tone) {
			if (syllabicConsonant) return [aspirated, "", syllabicConsonant, tone];

				 if (initial == "gu" || initial == "xw" || initial == "xu") initial = "gw";
			else if (initial == "ku" || initial == "qw" || initial == "qu") initial = "kw";
			else if (initial == "dz" || initial == "zh" || CantoneseToKana.jAsZ && initial == "j") initial = "z";
			else if (initial == "ts" || initial == "ch" || initial == "q") initial = "c";
			else if (initial == "sh" || initial == "x") initial = "s";
			else if (initial == "y") initial = "j";

				 if (nucleusO) { nucleusActual = "aa"; terminal = "u"; }
			else if (nucleusU) { nucleusActual = nucleusU; terminal = "u"; }
			else if (nucleusI) { nucleusActual = nucleusI; terminal = "i"; }
			else terminal = toAspirated[terminal] || terminal;

				 if (nucleusActual == "a" && !terminal && CantoneseToKana.convertFinalAToAa) nucleusActual = "aa";
			else if (nucleusActual == "i" && (terminal == "ng" || terminal == "k") || nucleusActual == "e" && terminal == "i") nucleusActual = "ee";
			else if (nucleusActual == "ee" && (terminal != "i" && terminal != "ng" && terminal != "k")) nucleusActual = "i";
			else if (nucleusActual == "u" && (terminal == "m" || terminal == "ng" || terminal == "p" || terminal == "k") || nucleusActual == "o" && terminal == "u") nucleusActual = "oo";
			else if (nucleusActual == "oo" && (terminal != "u" && terminal != "m" && terminal != "ng" && terminal != "p" && terminal != "k")) nucleusActual = "u";
			else if (nucleusActual == "ue" && terminal == "i") nucleusActual = "eo";
			else if (nucleusActual == "eu" && !terminal) { nucleusActual = "e"; terminal = "u"; }
			else if ((nucleusActual == "oe" || nucleusActual == "eu") && (terminal == "i" || terminal == "n") || (nucleusActual == "oe" && CantoneseToKana.convertOetToEot || nucleusActual == "eu") && terminal == "t") nucleusActual = "eo";
			else if ((nucleusActual == "eo" || nucleusActual == "eu") && (terminal != "i" && terminal != "n" && terminal != "t")) nucleusActual = "oe";
			else if (nucleusActual == "y" || nucleusActual == "ue") nucleusActual = "yu";

			return [initial, nucleusActual, terminal, tone];
		},
		pairwise(left, right) {
			if (CantoneseToKana.convertHomorganicCodaToSmallTsu) {
				const rule = homorganicConsonants[left[2]];
				if (rule && rule.has(right[0])) left[2] = "h";
			}
			return [left, right];
		},
		construct(initial, nucleusActual, terminal, tone) {
			let syllable;
			if (nucleusActual) {
				const index = baseKana.indexOf(nucleus[nucleusActual][0]);
				syllable = (
					(CantoneseToKana.voicedKanaAllowed || !aspiratedOnset.has(initial)
						? (onset[!CantoneseToKana.voicedKanaAllowed && toAspirated[initial] || initial] || baseKana)[index]
						: onset[initial][index].replace(/[ァィゥェォ]?$/, aspiratedSmallKana[index])
					) + nucleus[nucleusActual].slice(1) + (nucleusActual == "eo" && terminal == "i" ? "ュ" : coda[terminal] || "")
				).replace(/[ウユ]ュ/, "ユ");
			}
			else syllable = (initial ? "ㇷ" : "") + "ン" + (terminal == "m" ? "ㇺ" : "") + "ー";
	
			if (!CantoneseToKana.withTone || !tone) return syllable;
	
				 if ("1¹₁7⁷₇".indexOf(tone) != -1) tone = "1¹ˈ";
			else if ("2²₂".indexOf(tone) != -1) tone = "2²ˊ";
			else if ("3³₃8⁸₈".indexOf(tone) != -1) tone = "3³ˉ";
			else if ("4⁴₄".indexOf(tone) != -1) tone = "4⁴ˌ";
			else if ("5⁵₅".indexOf(tone) != -1) tone = "5⁵ˏ";
			else if ("6⁶₆9⁹₉".indexOf(tone) != -1) tone = "6⁶ˍ";
	
			return CantoneseToKana.useSLWongTone
				? tone[2] + syllable
				: CantoneseToKana.useSuperscriptTone
					? syllable + tone[1]
					: [syllable, sup(tone[0])];
		},
	};

	function CantoneseToKana() {}
	Object.setPrototypeOf(CantoneseToKana.prototype, prototype);

	CantoneseToKana.jAsZ							= false;
	CantoneseToKana.convertFinalAToAa				= false;
	CantoneseToKana.convertOetToEot					= false;
	CantoneseToKana.voicedKanaAllowed				= true;
	CantoneseToKana.convertHomorganicCodaToSmallTsu = false;
	CantoneseToKana.withTone						= false;
	CantoneseToKana.	useSLWongTone				= false;
	CantoneseToKana.		useSuperscriptTone		= true;

	return CantoneseToKana;
}, this);
