(function(main, global) {
	(typeof exports == "object" ? exports : global).HangulToKana = main();
})(function() {

	var lead = {
		"ᄀ": ["ガ", "ギ", "グ", "ゲ", "ゴ"],
		"ᄁ": ["ッカ", "ッキ", "ック", "ッケ", "ッコ"],
		"ᄂ": ["ナ", "ニ", "ヌ", "ネ", "ノ"],
		"ᄃ": ["ダ", "ディ", "ドゥ", "デ", "ド"],
		"ᄄ": ["ッタ", "ッティ", "ットゥ", "ッテ", "ット"],
		"ᄅ": ["ラ", "リ", "ル", "レ", "ロ"],
		"ᄆ": ["マ", "ミ", "ム", "メ", "モ"],
		"ᄇ": ["バ", "ビ", "ブ", "ベ", "ボ"],
		"ᄈ": ["ッパ", "ッピ", "ップ", "ッペ", "ッポ"],
		"ᄉ": ["サ", "シ", "ス", "セ", "ソ"],
		"ᄊ": ["ッサ", "ッシ", "ッス", "ッセ", "ッソ"],
		"ᄋ": ["ア", "イ", "ウ", "エ", "オ"],
		"ᄌ": null,
		"ᄍ": ["ッチャ", "ッチ", "ッチュ", "ッチェ", "ッチョ"],
		"ᄎ": ["チャ", "チ", "チュ", "チェ", "チョ"],
		"ᄏ": ["カ", "キ", "ク", "ケ", "コ"],
		"ᄐ": ["タ", "ティ", "トゥ", "テ", "ト"],
		"ᄑ": ["パ", "ピ", "プ", "ペ", "ポ"],
		"ᄒ": ["ハ", "ヒ", "フ", "ヘ", "ホ"],
		"ᅌ": null
	};

	var vowel = {
		"ᅡ": [0, ""],
		"ᅢ": [3, ""],
		"ᅣ": [1, "ャ"],
		"ᅤ": [1, "ェ"],
		"ᅥ": [4, null],
		"ᅦ": [3, ""],
		"ᅧ": [1, null],
		"ᅨ": [1, "ェ"],
		"ᅩ": [4, ""],
		"ᅪ": [2, null],
		"ᅫ": [2, "ェ"],
		"ᅬ": [2, "ェ"],
		"ᅭ": [1, "ョ"],
		"ᅮ": [2, ""],
		"ᅯ": [2, "ォ"],
		"ᅰ": [2, "ェ"],
		"ᅱ": [2, "ィ"],
		"ᅲ": [1, "ュ"],
		"ᅳ": [2, null],
		"ᅴ": [2, null],
		"ᅵ": [1, ""]
	};
	
	var trail = {
		"ᆨ": "ᆨ",
		"ᆩ": "ᆨ",
		"ᆫ": "ᆫ",
		"ᆮ": "ᆮ",
		"ᆯ": "ᆯ",
		"ᆷ": "ᆷ",
		"ᆸ": "ᆸ",
		"ᆺ": "ᆮ",
		"ᆻ": "ᆮ",
		"ᆼ": "ᆼ",
		"ᆽ": "ᆮ",
		"ᆾ": "ᆮ",
		"ᆿ": "ᆨ",
		"ᇀ": "ᆮ",
		"ᇁ": "ᆸ",
		"ᇂ": "ᆮ"
	};
	
	var trailType = {
		"ᆷ": null,
		"ᆫ": null,
		"ᆼ": "ン",
		"ᆸ": null,
		"ᆮ": null,
		"ᆨ": null,
		"ᆯ": null
	};
	
	var trailToLead = {
		"ᆨ": "ᄀ",
		"ᆩ": "ᄁ",
		"ᆫ": "ᄂ",
		"ᆮ": "ᄃ",
		"ᆯ": "ᄅ",
		"ᆷ": "ᄆ",
		"ᆸ": "ᄇ",
		"ᆺ": "ᄉ",
		"ᆻ": "ᄊ",
		"ᆼ": "ᅌ",
		"ᆽ": "ᄌ",
		"ᆾ": "ᄎ",
		"ᆿ": "ᄏ",
		"ᇀ": "ᄐ",
		"ᇁ": "ᄑ",
		"ᇂ": "ᄋ"
	};
	
	var convertTrailBefore = {
		"ᆪ": "ᆨ",
		"ᆬ": "ᆫ",
		"ᆭ": "ᆫ",
		"ᆰ": "ᆯ",
		"ᆱ": "ᆯ",
		"ᆲ": "ᆯ",
		"ᆳ": "ᆯ",
		"ᆴ": "ᆯ",
		"ᆵ": "ᆯ",
		"ᆶ": "ᆯ",
		"ᆹ": "ᆸ"
	};
	
	var convertTrailAfter = {
		"ᆪ": "ᆺ",
		"ᆬ": "ᆽ",
		"ᆭ": "ᇂ",
		"ᆰ": "ᆨ",
		"ᆱ": "ᆷ",
		"ᆲ": "ᆸ",
		"ᆳ": "ᆺ",
		"ᆴ": "ᇀ",
		"ᆵ": "ᇁ",
		"ᆶ": "ᇂ",
		"ᆹ": "ᆺ"
	};
	
	var readBefore = {
		"ᆪ": true,
		"ᆬ": true,
		"ᆭ": true,
		"ᆰ": false,
		"ᆱ": false,
		"ᆲ": true,
		"ᆳ": true,
		"ᆴ": true,
		"ᆵ": false,
		"ᆶ": true,
		"ᆹ": true
	};
	
	function extKana(ext, sub) {
		return HangulToKana.useExtendedKana ? ext : "<sub>" + sub + "</sub>";
	}
	
	function HangulToKana(hangul) {
		
		if (!HangulToKana.ngNoSandhi) lead["ᅌ"] =
			HangulToKana.autoLinkBidakuon
				? ["<s>[[</s>カ゚<s>]]</s>", "<s>[[</s>キ゚<s>]]</s>", "<s>[[</s>ク゚<s>]]</s>", "<s>[[</s>ケ゚<s>]]</s>", "<s>[[</s>コ゚<s>]]</s>"]
				: ["カ゚", "キ゚", "ク゚", "ケ゚", "コ゚"];
		
		lead["ᄌ"] = HangulToKana.useDyaForJa ? ["ヂャ", "ヂ", "ヂュ", "ヂェ", "ヂョ"] : ["ジャ", "ジ", "ジュ", "ジェ", "ジョ"];
		
		vowel["ᅧ"][1] = "ョ" + (vowel["ᅥ"][1] = HangulToKana.distinguishO ? "<b>͍</b>" : "");
		vowel["ᅪ"][1] = HangulToKana.useSmallWa ? "ヮ" : "ァ";
		vowel["ᅯ"][1] = (vowel["ᅯ"][1] = HangulToKana.useNormalAndSmallWiWeWo ? "𛅦" : "ォ") + (HangulToKana.distinguishO ? "<b>͍</b>" : "");
		vowel["ᅴ"][1] = (vowel["ᅳ"][1] = HangulToKana.distinguishU ? "<b>͍</b>" : "") + (vowel["ᅱ"][1] = HangulToKana.useNormalAndSmallWiWeWo ? "𛅤" : "ィ");
		vowel["ᅫ"][1] = vowel["ᅬ"][1] = vowel["ᅰ"][1] = HangulToKana.useNormalAndSmallWiWeWo ? "𛅥" : "ェ";
		
		trailType["ᆷ"] = extKana("ㇺ", "ム");
		trailType["ᆫ"] =
			HangulToKana.distinguishN
				? HangulToKana.useNuForN
					? extKana("ㇴ", "ヌ")
					: HangulToKana.useDiacriticForN
						? "ン<b>͍</b>"
						: HangulToKana.useExtendedSmallN
							? "𛅧"
							: "<sub>ン</sub>"
				: "ン";
		trailType["ᆸ"] = extKana("ㇷ゚", "プ");
		trailType["ᆨ"] = HangulToKana.distinguishK ? HangulToKana.useDiacriticForK ? "ッ<b>͍</b>" : extKana("ㇰ", "ク") : "ッ";
		trailType["ᆮ"] = HangulToKana.distinguishFortisWithT ? extKana("ㇳ", "ト") : "ッ";
		trailType["ᆯ"] = extKana("ㇽ", "ル");
		
		return hangul.replace(/[가-힣]+/g, function(syllables) {
			
			syllables = syllables.split("").map(function(input) {
				input = input.charCodeAt(0) - 44032;
				var obj = {
					lead: String.fromCharCode(input / 588 + 4352),
					vowel: String.fromCharCode(input / 28 % 21 + 4449)
				};
				if (input %= 28) {
					obj.trail = String.fromCharCode(input + 4519);
					// Cluster
					var clusterAfter = convertTrailAfter[obj.trail];
					if (clusterAfter) {
						obj.cluster = obj.trail;
						obj.trail = clusterAfter;
					}
				}
				return obj;
			});
			
			var i;
			
			// INITIAL ONLY
			// dakuonka
			syllables[0].lead = syllables[0].lead.replace("ᄀ", "ᄏ").replace("ᄃ", "ᄐ").replace("ᄇ", "ᄑ").replace("ᄌ", "ᄎ");
			
			for (i = 0; i < syllables.length; i++) {
				
				var curr = syllables[i], currNull = curr.lead == "ᄋ";
				
				// ALL
				if (!currNull) {
					if (curr.lead != "ᄅ" || !HangulToKana.ryeVowelAsYe) curr.vowel = curr.vowel.replace("ᅨ", "ᅦ");
					curr.vowel = curr.vowel.replace("ᅴ", "ᅵ");
				}
				
				if (i) {
					
					var prev = syllables[i - 1], isPalatal = curr.vowel == "ᅵ" || curr.vowel == "ᅧ";
					
					// EXCEPT INITIAL
					if (currNull) curr.vowel = curr.vowel.replace("ᅴ", i == syllables.length - 1 ? "ᅦ" : "ᅵ");
					
					if (prev.trail) {
						
						if (currNull) {
							// palatalization and renonka
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄌ"; moveCluster();}
							else if (isPalatal && prev.trail == "ᇀ") {curr.lead = "ᄎ"; moveCluster();}
							else if (HangulToKana.nInsertion && "ᅵᅣᅧᅭᅲᅢᅨ".indexOf(curr.vowel) != -1) {curr.lead = "ᄂ";}
							else if (!HangulToKana.ngNoSandhi || prev.trail != "ᆼ") {curr.lead = trailToLead[prev.trail]; moveCluster();}
							
						} else if (curr.lead == "ᄒ") {
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄎ"; moveCluster();}
							// aspiration
							else if (prev.trail == "ᆨ") {curr.lead = "ᄏ"; moveCluster();}
							else if (prev.trail == "ᇂ" || prev.trail == "ᆮ" || prev.trail == "ᆺ" || prev.trail == "ᆻ") {curr.lead = "ᄐ"; moveCluster();}
							else if (prev.trail == "ᆸ") {curr.lead = "ᄑ"; moveCluster();}
							else if (prev.trail == "ᆽ") {curr.lead = "ᄎ"; moveCluster();}
							else if (HangulToKana.hLenition) {
								// lenition
								     if (prev.trail == "ᆷ") {curr.lead = "ᄆ"; moveCluster();}
								else if (prev.trail == "ᆫ") {curr.lead = "ᄂ"; moveCluster();}
								else if (prev.trail == "ᆼ" && !HangulToKana.ngNoSandhi) {curr.lead = "ᅌ"; moveCluster();}
								else if (prev.trail == "ᆯ") {curr.lead = "ᄅ"; moveCluster();}
							}
							
						} else if (prev.trail == "ᇂ") {
							// aspiration
								 if (curr.lead == "ᄀ") {curr.lead = "ᄏ"; moveCluster();}
							else if (curr.lead == "ᄃ") {curr.lead = "ᄐ"; moveCluster();}
							else if (curr.lead == "ᄇ") {curr.lead = "ᄑ"; moveCluster();}
							else if (curr.lead == "ᄌ") {curr.lead = "ᄎ"; moveCluster();}
						}
						
						function moveCluster() {
							if (prev.cluster) {
								prev.trail = convertTrailBefore[prev.cluster];
								delete prev.cluster;
							} else delete prev.trail;
						}
						
					} else continue;
					
					if (prev.trail) {
						
						// cluster processing
						if (prev.cluster) {
							if (prev.cluster == "ᆰ"
								? curr.lead == "ᄀ"
								: prev.cluster == "ᆲ"
									? !(prev.lead == "ᄇ" && prev.vowel == "ᅡ" || HangulToKana.neolbTrailAsB && prev.lead == "ᄂ" && prev.vowel == "ᅥ")
									: readBefore[prev.cluster]) prev.trail = convertTrailBefore[prev.cluster];
							delete prev.cluster;
						}
						
						if (curr.lead == "ᄋ") {
							// palatalization and renonka
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄌ"; delete prev.trail;}
							else if (isPalatal && prev.trail == "ᇀ") {curr.lead = "ᄎ"; delete prev.trail;}
							// no need to repeat n insertion
							else if (!HangulToKana.ngNoSandhi || prev.trail != "ᆼ") {curr.lead = trailToLead[prev.trail]; delete prev.trail;}
							
						} else if (curr.lead == "ᄒ") {
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄎ"; delete prev.trail;}
							// aspiration
							else if (prev.trail == "ᆨ") {curr.lead = "ᄏ"; delete prev.trail;}
							else if (prev.trail == "ᇂ" || prev.trail == "ᆮ" || prev.trail == "ᆺ" || prev.trail == "ᆻ") {curr.lead = "ᄐ"; delete prev.trail;}
							else if (prev.trail == "ᆸ") {curr.lead = "ᄑ"; delete prev.trail;}
							else if (prev.trail == "ᆽ") {curr.lead = "ᄎ"; delete prev.trail;}
							else if (HangulToKana.hLenition) {
								// lenition
								     if (prev.trail == "ᆷ") {curr.lead = "ᄆ"; delete prev.trail;}
								else if (prev.trail == "ᆫ") {curr.lead = "ᄂ"; delete prev.trail;}
								else if (prev.trail == "ᆼ" && !HangulToKana.ngNoSandhi) {curr.lead = "ᅌ"; delete prev.trail;}
								else if (prev.trail == "ᆯ") {curr.lead = "ᄅ"; delete prev.trail;}
							}
							
						} else if (prev.trail == "ᇂ") {
							// aspiration
								 if (curr.lead == "ᄀ") {curr.lead = "ᄏ"; delete prev.trail;}
							else if (curr.lead == "ᄃ") {curr.lead = "ᄐ"; delete prev.trail;}
							else if (curr.lead == "ᄇ") {curr.lead = "ᄑ"; delete prev.trail;}
							else if (curr.lead == "ᄌ") {curr.lead = "ᄎ"; delete prev.trail;}
						}
					
					} else continue;
					
					if (prev.trail) {
						
						// convert stops
						prev.trail = trail[prev.trail];
						
						switch (prev.trail) {
							case "ᆷ": bionka(); break;
							case "ᆫ": if (curr.lead == "ᄅ") prev.trail = "ᆯ"; break;
							case "ᆼ": bionka(); break;
							case "ᆸ": bionka(); fortition("ᆷ"); break;
							case "ᆮ": fortition("ᆫ"); break;
							case "ᆨ": bionka(); fortition("ᆼ"); break;
							case "ᆯ": if (curr.lead == "ᄂ") curr.lead = "ᄅ"; break;
						}
						
						function fortition(bion) {
							// bionka
							if (curr.lead == "ᄆ" || curr.lead == "ᄂ") prev.trail = bion;
							curr.lead = curr.lead.replace("ᄀ", "ᄁ").replace("ᄃ", "ᄄ").replace("ᄇ", "ᄈ").replace("ᄉ", "ᄊ").replace("ᄌ", "ᄍ");
						}
						
						function bionka() {
							if (curr.lead == "ᄅ") curr.lead = "ᄂ";
						}
						
					}
				}
			}
			
			// LAST ONLY
			var last = syllables[i - 1];
			if (last.cluster) {
				if (readBefore[last.cluster]) last.trail = convertTrailBefore[last.cluster];
				delete last.cluster;
			}
			last.trail = trail[last.trail];
			
			return "<span>" + syllables.map(function(item) {
				return lead[item.lead][vowel[item.vowel][0]] + vowel[item.vowel][1] + (trailType[item.trail] || "");
			}).join("").replace(/イャ/g, "ヤ").replace(/イュ/g, "ユ").replace(/イョ/g, "ヨ").replace(/ウ[ァヮ]/g, "ワ").replace(/ウ(<b>͍<\/b>)?𛅤/g,　"ヰ$1").replace(/ウ𛅥/g,　"ヱ").replace(/ウ𛅦/g,　"ヲ").replace(/スィ/g, "シュィ").replace(/(ト|ド)ゥ([ァヮェィ])/g, HangulToKana.simplifyAlveolarStopsWithGlide ? "$1$2" : "$&").replace(/(テ|デ)ィ([ャュョ])/g, HangulToKana.simplifyAlveolarStopsWithGlide ? "$1$2" : "$&").replace(/(ッ(<b>͍<\/b>)?)ッ/g, "$1").replace(/(ㇷ゚|ㇳ|ㇰ|<sub>[プトク]<\/sub>)ッ/g, HangulToKana.removeRepeatFortis ? "$1" : "$&") + "</span>";
			
		}).replace(/ /g, "　").replace(/\./g, "<i>。</i>").replace(/,/g, "<i>、</i>").replace(/\?/g, "<i>？</i>").replace(/!/g, "<i>！</i>").replace(/:/g, "<i>：</i>").replace(/;/g, "<i>；</i>").replace(/\(/g, "<i>（</i>").replace(/\)/g, "<i>）</i>").replace(/~/g, "<i>～</i>");
	}
	
	HangulToKana.useSmallWa						= true;
	HangulToKana.	useNormalAndSmallWiWeWo		= false;
	HangulToKana.distinguishU					= false;
	HangulToKana.distinguishO					= false;
	HangulToKana.distinguishK					= false;
	HangulToKana.	useDiacriticForK			= false;
	HangulToKana.		distinguishFortisWithT	= false;
	HangulToKana.distinguishN					= false;
	HangulToKana.	useNuForN					= false;
	HangulToKana.		useDiacriticForN		= true;
	HangulToKana.			useExtendedSmallN	= false;
	HangulToKana.neolbTrailAsB					= false;
	HangulToKana.ryeVowelAsE					= true;
	HangulToKana.hLenition						= true;
	HangulToKana.nInsertion						= false;
	HangulToKana.ngNoSandhi						= true;
	HangulToKana.	autoLinkBidakuon			= false;
	HangulToKana.removeRepeatFortis				= true;
	HangulToKana.useExtendedKana				= true;
	HangulToKana.useDyaForJa					= false;
	HangulToKana.simplifyAlveolarStopsWithGlide	= true;
	
	return HangulToKana;
	
}, this);