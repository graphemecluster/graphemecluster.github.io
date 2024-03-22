(function(main, global) {
	(typeof exports == "object" ? exports : global).HangulToIPA = main();
})(function() {

	var lead = {
		"ᄀ": "g",
		"ᄁ": "k͈",
		"ᄂ": "n",
		"ᄃ": "d",
		"ᄄ": "t͈",
		"ᄅ": "ɾ",
		"ᄆ": "m",
		"ᄇ": "b",
		"ᄈ": "p͈",
		"ᄋ": "",
		"ᄌ": "d͡ʑ",
		"ᄍ": "t͡͏͈ɕ",
		"ᄎ": "t͡ɕʰ",
		"ᄐ": "tʰ",
		"ᄑ": "pʰ",
		"ᅌ": "ŋ"
	};
	
	var leadAllophone = {
		"ᄉ": null,
		"ᄊ": ["s͈", "ɕ͈", "s͈", "s͈"],
		"ᄏ": ["kʰ", "c͡çʰ", "k͡xʰ", "kʰ"],
		"ᄒ": ["ɦ", "ʝ", "ɣ", "βʷ"]
	};
	
	var initialLead = {
		"ᄀ": ["k", "g̊"],
		"ᄃ": ["t", "d̥"],
		"ᄇ": ["p", "b̥"],
		"ᄌ": ["t͡ɕ", "d͡͏̥ʑ"]
	};
	
	var initialhAllophone = null;

	var vowel = {
		"ᅡ": null,
		"ᅢ": ["ɛ̝", "ɛ", 0],
		"ᅣ": null,
		"ᅤ": ["jɛ̝", "jɛ", 1],
		"ᅥ": ["ʌ̽", "ʌ", 0],
		"ᅦ": ["e̞", "e", 0],
		"ᅧ": ["jʌ̽", "jʌ", 1],
		"ᅨ": ["je̞", "je", 1],
		"ᅩ": ["o̞", "o", 3],
		"ᅪ": null,
		"ᅫ": ["wɛ̝", "wɛ", 3],
		"ᅬ": ["we̞", "we", 3],
		"ᅭ": ["jo̞", "jo", 1],
		"ᅮ": ["u", "u", 3],
		"ᅯ": ["wʌ̽", "wʌ", 3],
		"ᅰ": ["we̞", "we", 3],
		"ᅱ": ["ẅi", "wi", 3],
		"ᅲ": ["ju", "ju", 1],
		"ᅳ": ["ɯ̽", "ɯ", 2],
		"ᅴ": ["ɰ̈i", "ɰi", 2],
		"ᅵ": ["i", "i", 1]
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
		"ᆷ": "m",
		"ᆫ": "n",
		"ᆼ": "ŋ",
		"ᆸ": "p̚",
		"ᆮ": "t̚",
		"ᆨ": "k̚",
		"ᆯ": "l"
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
	
	function HangulToIPA(hangul) {
		
		var output = [];
		
		hangul.replace(/[가-힣]+/g, function(syllables) {
			
			leadAllophone["ᄉ"] = HangulToIPA.aspiratedS ? ["sʰ", "ɕʰ", "sʰ", "sʰ"] : ["s", "ɕ", "s", "s"];
			initialhAllophone = HangulToIPA.useVoicelessDiacritics && HangulToIPA.useVoicelessDiacriticsForH ? ["ɦ̥", "ʝ̊", "ɣ̊", "β̥ʷ"] : ["h", "ç", "x", "ɸʷ"];
			
			vowel["ᅡ"] = HangulToIPA.fullyOpenA ? ["ä", "a", 0] : ["ɐ", "ɐ", 0];
			vowel["ᅣ"] = HangulToIPA.fullyOpenA ? ["jä", "ja", 1] : ["jɐ", "jɐ", 1];
			vowel["ᅪ"] = HangulToIPA.fullyOpenA ? ["wä", "wa", 3] : ["wɐ", "wɐ", 3];
			
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
			
			for (var i = 0; i < syllables.length; i++) {
				
				var curr = syllables[i], currNull = curr.lead == "ᄋ";
				
				// ALL
				if (!currNull) {
					if (curr.lead != "ᄅ" || !HangulToIPA.ryeVowelAsYe) curr.vowel = curr.vowel.replace("ᅨ", "ᅦ");
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
							else if (HangulToIPA.nInsertion && "ᅵᅣᅧᅭᅲᅢᅨ".indexOf(curr.vowel) != -1) {curr.lead = "ᄂ";}
							else if (!HangulToIPA.ngNoSandhi || prev.trail != "ᆼ") {curr.lead = trailToLead[prev.trail]; moveCluster();}
							
						} else if (curr.lead == "ᄒ") {
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄎ"; moveCluster();}
							// aspiration
							else if (prev.trail == "ᆨ") {curr.lead = "ᄏ"; moveCluster();}
							else if (prev.trail == "ᇂ" || prev.trail == "ᆮ" || prev.trail == "ᆺ" || prev.trail == "ᆻ") {curr.lead = "ᄐ"; moveCluster();}
							else if (prev.trail == "ᆸ") {curr.lead = "ᄑ"; moveCluster();}
							else if (prev.trail == "ᆽ") {curr.lead = "ᄎ"; moveCluster();}
							else if (HangulToIPA.hLenition) {
								// lenition
								     if (prev.trail == "ᆷ") {curr.lead = "ᄆ"; moveCluster();}
								else if (prev.trail == "ᆫ") {curr.lead = "ᄂ"; moveCluster();}
								else if (prev.trail == "ᆼ" && !HangulToIPA.ngNoSandhi) {curr.lead = "ᅌ"; moveCluster();}
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
									? !(prev.lead == "ᄇ" && prev.vowel == "ᅡ" || HangulToIPA.neolbTrailAsB && prev.lead == "ᄂ" && prev.vowel == "ᅥ")
									: readBefore[prev.cluster]) prev.trail = convertTrailBefore[prev.cluster];
							delete prev.cluster;
						}
						
						if (curr.lead == "ᄋ") {
							// palatalization and renonka
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄌ"; delete prev.trail;}
							else if (isPalatal && prev.trail == "ᇀ") {curr.lead = "ᄎ"; delete prev.trail;}
							// no need to repeat n insertion
							else if (!HangulToIPA.ngNoSandhi || prev.trail != "ᆼ") {curr.lead = trailToLead[prev.trail]; delete prev.trail;}
							
						} else if (curr.lead == "ᄒ") {
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄎ"; delete prev.trail;}
							// aspiration
							else if (prev.trail == "ᆨ") {curr.lead = "ᄏ"; delete prev.trail;}
							else if (prev.trail == "ᇂ" || prev.trail == "ᆮ" || prev.trail == "ᆺ" || prev.trail == "ᆻ") {curr.lead = "ᄐ"; delete prev.trail;}
							else if (prev.trail == "ᆸ") {curr.lead = "ᄑ"; delete prev.trail;}
							else if (prev.trail == "ᆽ") {curr.lead = "ᄎ"; delete prev.trail;}
							else if (HangulToIPA.hLenition) {
								// lenition
								     if (prev.trail == "ᆷ") {curr.lead = "ᄆ"; delete prev.trail;}
								else if (prev.trail == "ᆫ") {curr.lead = "ᄂ"; delete prev.trail;}
								else if (prev.trail == "ᆼ" && !HangulToIPA.ngNoSandhi) {curr.lead = "ᅌ"; delete prev.trail;}
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
			
			output.push(syllables.map(function(item, index) {
				return (
					(
						!index && (
							item.lead == "ᄒ" && initialhAllophone[vowel[item.vowel][2]] ||
							initialLead[item.lead] &&
							initialLead[item.lead][+HangulToIPA.useVoicelessDiacritics]
						) ||
						leadAllophone[item.lead] &&
						leadAllophone[item.lead][+("ᄉᄊ".indexOf(item.lead) != -1 && vowel[item.vowel][0].indexOf("i") != -1) || vowel[item.vowel][2]] ||
						lead[item.lead]
					) + vowel[item.vowel][+HangulToIPA.omitVowelDiacritics] + (trailType[item.trail] || "")
				).replace("ʷw", "ʷ").replace(/(ʝ̊?|çʰ?)j/, "$1");
			}).join("<span>.</span><wbr>"));
			
		});
		
		return output.join("<s>|</s><wbr>");
		
	}
	
	HangulToIPA.neolbTrailAsB					= false;
	HangulToIPA.ryeVowelAsE						= true;
	HangulToIPA.hLenition						= true;
	HangulToIPA.nInsertion						= false;
	HangulToIPA.ngNoSandhi						= true;
	HangulToIPA.useVoicelessDiacritics			= false;
	HangulToIPA.	useVoicelessDiacriticsForH	= false;
	HangulToIPA.fullyOpenA						= false;
	HangulToIPA.omitVowelDiacritics				= false;
	HangulToIPA.aspiratedS						= false;
	
	return HangulToIPA;
	
}, this);