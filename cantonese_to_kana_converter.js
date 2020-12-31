(function(main, global) {
	(typeof exports == "object" ? exports : global).CantoneseToKana = main();
})(function() {
	
	var regex = /((ng|[kgqx](?:w|u(?!e))?|dz|ts|[zcs]h?|[bpmfdtnlhjyw])?(aa?|e[eou]?|o[eo]?|ue?|yu?|i)([iyuo]|(?:ng|[mnpt])(?![aeiou]|y(?![aeiouy]))|[bd](?![aeiouy])|[gk](?![aeiouw]|y(?![aeiouy])))?|(h)?(m|ng))([1-9²³¹⁴-⁹₁-₉])?/g;

	var kanaBase = ["ア", "イ", "ウ", "エ", "オ"];

	var kana = {
		b: null,
		p: ["パ", "ピ", "プ", "ペ", "ポ"],
		m: ["マ", "ミ", "ム", "メ", "モ"],
		f: ["ファ", "フィ", null, "フェ", "フォ"],
		d: null,
		t: ["タ", "ティ", "トゥ", "テ", "ト"],
		n: ["ナ", "ニ", "ヌ", "ネ", "ノ"],
		l: ["ラ", "リ", "ル", "レ", "ロ"],
		g: null,
		k: ["カ", "キ", "ク", "ケ", "コ"],
		ng: null,
		gw: null,
		kw: null,
		w: null,
		h: ["ハ", "ヒ", "フ", "ヘ", "ホ"],
		z: ["ツァ", "ツィ", "ツ", "ツェ", "ツォ"],
		c: null,
		s: ["サ", null, "ス", "セ", "ソ"],
		j: ["ヤ", "イ", "ユ", "イェ", "ヨ"]
	};
	
	var kanaBaseHW = ["ｱ", "ｲ", "ｳ", "ｴ", "ｵ"];

	var kanaHW = {
		b: null,
		p: ["ﾊﾟ", "ﾋﾟ", "ﾌﾟ", "ﾍﾟ", "ﾎﾟ"],
		m: ["ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ"],
		f: ["フｧ", "フｨ", null, "フｪ", "フｫ"],
		d: null,
		t: ["ﾀ", "テｨ", "トｩ", "ﾃ", "ﾄ"],
		n: ["ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ"],
		l: ["ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ"],
		g: null,
		k: ["ｶ", "ｷ", "ｸ", "ｹ", "ｺ"],
		ng: null,
		gw: null,
		kw: null,
		w: null,
		h: ["ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ"],
		z: ["ツｧ", "ツｨ", "ﾂ", "ツｪ", "ツｫ"],
		c: null,
		s: ["ｻ", null, "ｽ", "ｾ", "ｿ"],
		j: ["ﾔ", "ｲ", "ﾕ", "イｪ", "ﾖ"]
	};

	var rule = {
		aa: [0, "ー"],
		a: [0, "", true],
		o: [4, "ー"],
		oe: [4, "ェー", true],
		e: [3, "ー"],
		i: [1, "ー"],
		u: [2, "ー"],
		yu: [2, "ュー"]
	}

	var finalKana = {
		i: "イ",
		u: "ウ",
		m: "ㇺ",
		n: null,
		ng: "ン",
		p: "ㇷ゚",
		t: "ッ",
		k: null
	}

	var smallKana = {
		i: null,
		u: null
	};
	
	var yuExceptionBase = "ユー";
	
	var yuException = {
		c: null,
		j: "ユー",
		f: "フュー",
		d: null,
		t: "トュー",
	}

	var exception = {
		ai: [0, "ィー", true],
		au: [0, "ゥー", true],
		ou: [4, "ウ"],
		oei: [4, "ュー", true],
		oen: [4, null, true],
		oet: [4, "ェッ", true],
		ei: [3, "イ"],
		ing: [3, null, true],
		ik: [3, null, true],
		um: [4, null, true],
		ung: [4, null, true],
		up: [4, null, true],
		uk: [4, null, true]
	}
	
	var finalReplace = [
		[/ㇰ/g, "ク"],
		[/ㇵ/g, "ハ"],
		[/ㇶ/g, "ヒ"],
		[/ㇷ゚/g, "プ"],
		[/ㇷ/g, "フ"],
		[/ㇸ/g, "ヘ"],
		[/ㇹ/g, "ホ"],
		[/ㇺ/g, "ム"],
		[/ㇴ/g, "ヌ"]
	];
	
	var output, currentException, currentRule;

	function finalize(terminal, tone, syllable) {
		
		if (!CantoneseToKana.useExtendedKana) syllable = finalReplace.reduce(function(newSyllable, replaceValue) {
			return newSyllable.replace(replaceValue[0], "<sub>" + replaceValue[1] + "</sub>");
		}, syllable);
		
		if (!CantoneseToKana.withTone || !tone) {
			output.push(syllable);
			return "<span>" + syllable + "</span>";
		}
		
			 if ("1¹₁7⁷₇".indexOf(tone) != -1) tone = "1¹ˈ";
		else if ("2²₂".indexOf(tone) != -1) tone = "2²ˊ";
		else if ("3³₃8⁸₈".indexOf(tone) != -1) tone = "3³ˉ";
		else if ("4⁴₄".indexOf(tone) != -1) tone = "4⁴ˌ";
		else if ("5⁵₅".indexOf(tone) != -1) tone = "5⁵ˏ";
		else if ("6⁶₆9⁹₉".indexOf(tone) != -1) tone = "6⁶ˍ";
		
		if (!CantoneseToKana.useSLWongTone && CantoneseToKana.useCheckedTone && (terminal == "p" || terminal == "t" || terminal == "k")) {
			if (tone == "1¹ˈ") tone = "7⁷";
			else if (tone == "3³ˉ") tone = "8⁸";
			else if (tone == "6⁶ˍ") tone = "9⁹";
		}
		
		output.push(
			syllable = (
				CantoneseToKana.useSLWongTone
					? tone.charAt(2) + syllable
					: syllable + (
						CantoneseToKana.useSuperscriptTone
							? tone.charAt(1)
							: "<sup>" + tone.charAt(0) + "</sup>"
					)
			)
		);
		return "<span>" + syllable + "</span>";
		
	}
	
	function CantoneseToKana(cantonese) {
		
		kana.ng =
			CantoneseToKana.ngAsZeroInitial
				? CantoneseToKana.kanaBase
				: CantoneseToKana.useBidakuon
					? CantoneseToKana.autoLinkBidakuon
						? ["<s>[[</s>カ゚<s>]]</s>", "<s>[[</s>キ゚<s>]]</s>", "<s>[[</s>ク゚<s>]]</s>", "<s>[[</s>ケ゚<s>]]</s>", "<s>[[</s>コ゚<s>]]</s>"]
						: ["カ゚", "キ゚", "ク゚", "ケ゚", "コ゚"]
					: CantoneseToKana.subscriptBidakuonN
						? ["<sub>ン</sub>ガ", "<sub>ン</sub>ギ", "<sub>ン</sub>グ", "<sub>ン</sub>ゲ", "<sub>ン</sub>ゴ"]
						: CantoneseToKana.useExtendedSmallBidakuonN
							? ["𛅧ガ", "𛅧ギ", "𛅧グ", "𛅧ゲ", "𛅧ゴ"]
							: ["ンガ", "ンギ", "ング", "ンゲ", "ンゴ"];
		kana.kw = [
			CantoneseToKana.useSmallWa ? "クヮ" : "クァ",
			CantoneseToKana.useNormalAndSmallWiWeWo ? "ク𛅤" : "クィ",
			"ク",
			CantoneseToKana.useNormalAndSmallWiWeWo ? "ク𛅥" : "クェ",
			CantoneseToKana.useNormalAndSmallWiWeWo ? "ク𛅦" : "クォ"
		];
		kana.gw = CantoneseToKana.voicedKanaAllowed
			? [
				CantoneseToKana.useSmallWa ? "グヮ" : "グァ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "グ𛅤" : "グィ",
				"グ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "グ𛅥" : "グェ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "グ𛅦" : "グォ"
			]
			: kana.kw;
		kana.w = [
			"ワ",
			CantoneseToKana.useNormalAndSmallWiWeWo ? "ヰ" : "ウィ",
			CantoneseToKana.useDoubleU ? "ウゥ" : "ウ",
			CantoneseToKana.useNormalAndSmallWiWeWo ? "ヱ" : "ウェ",
			CantoneseToKana.useNormalAndSmallWiWeWo ? "ヲ" : "ウォ"
		];
		kana.f[2] = CantoneseToKana.useDoubleU ? "フゥ" : "フ";
		
		kana.c =
			CantoneseToKana.useTsuForC
				? CantoneseToKana.fullyUseTsuForC
					? CantoneseToKana.useAspiratedTsu
						? ["ツㇵ", "ツㇶ", "ツㇷ", "ツㇸ", "ツㇹ"]
						: kana.z
					: CantoneseToKana.useAspiratedTsu
						? ["ツㇵ", "チ", "チュ", "ツㇸ", "チョ"]
						: ["ツァ", "チ", "チュ", "ツェ", "チョ"]
				: ["チャ", "チ", "チュ", "チェ", "チョ"];
		
		kana.s[1] = CantoneseToKana.useShi ? "シ" : "スィ";
		kana.b = CantoneseToKana.voicedKanaAllowed ? ["バ", "ビ", "ブ", "ベ", "ボ"] : kana.p;
		kana.d = CantoneseToKana.voicedKanaAllowed ? ["ダ", "ディ", "ドゥ", "デ", "ド"] : kana.t;
		kana.g = CantoneseToKana.voicedKanaAllowed ? ["ガ", "ギ", "グ", "ゲ", "ゴ"] : kana.k;
		
		if (CantoneseToKana.useHalfwidthKana) {
			
			kanaHW.ng =
				CantoneseToKana.ngAsZeroInitial
					? CantoneseToKana.kanaBase
					: CantoneseToKana.useBidakuon
						? CantoneseToKana.autoLinkBidakuon
							? ["<s>[[</s>ｶﾟ<s>]]</s>", "<s>[[</s>ｷﾟ<s>]]</s>", "<s>[[</s>ｸﾟ<s>]]</s>", "<s>[[</s>ｹﾟ<s>]]</s>", "<s>[[</s>ｺﾟ<s>]]</s>"]
							: ["ｶﾟ", "ｷﾟ", "ｸﾟ", "ｹﾟ", "ｺﾟ"]
						: CantoneseToKana.subscriptBidakuonN
							? ["<sub>ン</sub>ｶﾞ", "<sub>ン</sub>ｷﾞ", "<sub>ン</sub>ｸﾞ", "<sub>ン</sub>ｹﾞ", "<sub>ン</sub>ｺﾞ"]
							: CantoneseToKana.useExtendedSmallBidakuonN
								? ["𛅧ｶﾞ", "𛅧ｷﾞ", "𛅧ｸﾞ", "𛅧ｹﾞ", "𛅧ｺﾞ"]
								: ["ンｶﾞ", "ンｷﾞ", "ンｸﾞ", "ンｹﾞ", "ンｺﾞ"];
			
			kanaHW.kw = [
				CantoneseToKana.useSmallWa ? "クヮ" : "クｧ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "ク𛅤" : "クｨ",
				"ｸ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "ク𛅥" : "クｪ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "ク𛅦" : "クｫ"
			];
			kanaHW.gw = CantoneseToKana.voicedKanaAllowed
				? [
					CantoneseToKana.useSmallWa ? "グヮ" : "グｧ",
					CantoneseToKana.useNormalAndSmallWiWeWo ? "グ𛅤" : "グｨ",
					"ｸﾞ",
					CantoneseToKana.useNormalAndSmallWiWeWo ? "グ𛅥" : "グｪ",
					CantoneseToKana.useNormalAndSmallWiWeWo ? "グ𛅦" : "グｫ"
				]
				: kana.kw;
			kanaHW.w = [
				"ﾜ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "ヰ" : "ウｨ",
				CantoneseToKana.useDoubleU ? "ウｩ" : "ｳ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "ヱ" : "ウｪ",
				CantoneseToKana.useNormalAndSmallWiWeWo ? "ヲ" : "ウｫ"
			];
			kanaHW.f[2] = CantoneseToKana.useDoubleU ? "フｩ" : "ﾌ";
			
			kanaHW.c =
				CantoneseToKana.useTsuForC
					? CantoneseToKana.fullyUseTsuForC
						? CantoneseToKana.useAspiratedTsu
							? kana.c
							: kanaHW.z
						: CantoneseToKana.useAspiratedTsu
							? ["ツㇵ", "ﾁ", "チｭ", "ツㇸ", "チｮ"]
							: ["ツｧ", "ﾁ", "チｭ", "ツｪ", "チｮ"]
					: ["チｬ", "ﾁ", "チｭ", "チｪ", "チｮ"];
			
			kanaHW.s[1] = CantoneseToKana.useShi ? "ｼ" : "スｨ";
			kanaHW.b = CantoneseToKana.voicedKanaAllowed ? ["ﾊﾞ", "ﾋﾞ", "ﾌﾞ", "ﾍﾞ", "ﾎﾞ"] : kanaHW.p;
			kanaHW.d = CantoneseToKana.voicedKanaAllowed ? ["ﾀﾞ", "デｨ", "ドｩ", "ﾃﾞ", "ﾄﾞ"] : kanaHW.t;
			kanaHW.g = CantoneseToKana.voicedKanaAllowed ? ["ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ"] : kanaHW.k;
			
		}
		
		finalKana.n = CantoneseToKana.distinguishN
			? CantoneseToKana.useNuForN
				? "ㇴ"
				: CantoneseToKana.useExtendedSmallN
					? "𛅧"
					: "<sub>ン</sub>"
			: "ン";
		finalKana.k = CantoneseToKana.distinguishK ? "ㇰ" : "ッ";
		
		smallKana.i = CantoneseToKana.useSmallKanaForNearClose ? "ィ" : "";
		smallKana.u = CantoneseToKana.useSmallKanaForNearClose ? "ゥ" : "";
		
		exception.oen[1] = "ェ" + finalKana.n;
		exception.ing[1] = smallKana.i + finalKana.ng;
		exception.ik[1] = smallKana.i + finalKana.k;
		exception.um[1] = smallKana.u + finalKana.m;
		exception.ung[1] = smallKana.u + finalKana.ng;
		exception.up[1] = smallKana.u + finalKana.p;
		exception.uk[1] = smallKana.u + finalKana.k;
		
		yuException.c =
			CantoneseToKana.fullyUseTsuForC
				? CantoneseToKana.useAspiratedTsu
					? "ツㇷュー"
					: "ツュー"
				: "チュー";
		
		yuException.d = CantoneseToKana.voicedKanaAllowed ? "ドュー" : yuException.t;
		
		output = [];
		
		cantonese = cantonese.toLowerCase().replace(regex, function(match, syllable, initial, nucleus, terminal, aspirated, syllabicConsonant, tone) {
				
				if (syllabicConsonant) return finalize(null, tone, (aspirated ? "ㇷ" : "") + "ン" + (CantoneseToKana.distinguishSyllabicM && syllabicConsonant == "m" ? "ㇺ" : "") + "ー");
				
					 if (initial == "gu" || initial == "xw" || initial == "xu") initial = "gw";
				else if (initial == "ku" || initial == "qw" || initial == "qu") initial = "kw";
				else if (initial == "dz" || initial == "zh" || CantoneseToKana.jAsZ && initial == "j") initial = "z";
				else if (initial == "ts" || initial == "ch" || initial == "q") initial = "c";
				else if (initial == "sh" || initial == "x") initial = "s";
				else if (initial == "y") initial = "j";
				
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
				
				return finalize(
					terminal,
					tone,
					(currentException = exception[nucleus + terminal])
						? (CantoneseToKana.useSmallKanaForNearClose
								&& (initial == "d" || initial == "t")
								&& nucleus == "i"
								&& (terminal == "ng" || terminal == "k")
							? kana[initial][3] + (CantoneseToKana.useHalfwidthKana ? "ｪ" : "ェ")
							: CantoneseToKana.useSmallKanaForNearClose
								&& (initial == "d" || initial == "t")
								&& nucleus == "u"
								&& (terminal == "ng" || terminal == "k")
							? kana[initial][4] + (CantoneseToKana.useHalfwidthKana ? "ｫ" : "ォ")
							: (CantoneseToKana.useHalfwidthKana && currentException[2]
								? kanaHW[initial] || kanaBaseHW
								: kana[initial] || kanaBase
							)[currentException[0]]
						) + currentException[1]
						: (nucleus == "yu" && (initial ? yuException[initial] : yuExceptionBase)
							|| (((currentRule = rule[nucleus])[2] && CantoneseToKana.useHalfwidthKana
								? kanaHW[initial] || kanaBaseHW
								: kana[initial] || kanaBase
							)[currentRule[0]] + currentRule[1])
						) + (finalKana[terminal] || "")
				);
				
			}
		);
		
		return CantoneseToKana.replacementMode
			? cantonese
			: "<span>" + output.join(
				CantoneseToKana.addSeperator
					? CantoneseToKana.useDot
						? "・"
						: " "
					: ""
			) + "</span>";
		
	}
	
	CantoneseToKana.jAsZ									= false;
	CantoneseToKana.voicedKanaAllowed						= true;
	CantoneseToKana.useHalfwidthKana						= false;
	CantoneseToKana.replacementMode							= true;
	CantoneseToKana.	addSeperator						= true;
	CantoneseToKana.		useDot							= false;
	CantoneseToKana.useShi									= true;
	CantoneseToKana.useDoubleU								= false;
	CantoneseToKana.withTone								= false;
	CantoneseToKana.	useSLWongTone						= false;
	CantoneseToKana.		useSuperscriptTone				= true;
	CantoneseToKana.		useCheckedTone					= true;
	CantoneseToKana.ngAsZeroInitial							= false;
	CantoneseToKana.	useBidakuon							= true;
	CantoneseToKana.		autoLinkBidakuon				= false;
	CantoneseToKana.		subscriptBidakuonN				= true;
	CantoneseToKana.			useExtendedSmallBidakuonN	= true;
	CantoneseToKana.useSmallKanaForNearClose				= true;
	CantoneseToKana.useSmallWa								= true;
	CantoneseToKana.	useNormalAndSmallWiWeWo				= false;
	CantoneseToKana.useExtendedKana							= true;
	CantoneseToKana.distinguishK							= false;
	CantoneseToKana.distinguishN							= false;
	CantoneseToKana.	useNuForN							= false;
	CantoneseToKana.		useExtendedSmallN				= false;
	CantoneseToKana.useTsuForC								= true;
	CantoneseToKana.	useAspiratedTsu						= true;
	CantoneseToKana.	fullyUseTsuForC						= false;
	CantoneseToKana.distinguishSyllabicM					= true;
	
	return CantoneseToKana;
	
}, this);