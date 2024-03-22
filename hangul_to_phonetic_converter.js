(function(main, global) {
	(typeof exports == "object" ? exports : global).HangulToPhonetic = main();
})(function() {
	
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
	
	function HangulToPhonetic(hangul) {
		
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
			
			for (var i = 0; i < syllables.length; i++) {
				
				var curr = syllables[i], currNull = curr.lead == "ᄋ";
				
				// ALL
				if (!currNull) {
					if (curr.lead != "ᄅ" || !HangulToPhonetic.ryeVowelAsYe) curr.vowel = curr.vowel.replace("ᅨ", "ᅦ");
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
							else if (HangulToPhonetic.nInsertion && "ᅵᅣᅧᅭᅲᅢᅨ".indexOf(curr.vowel) != -1) {curr.lead = "ᄂ";}
							else if (prev.trail != "ᆼ") {curr.lead = trailToLead[prev.trail]; moveCluster();}
							
						} else if (curr.lead == "ᄒ") {
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄎ"; moveCluster();}
							// aspiration
							else if (prev.trail == "ᆨ") {curr.lead = "ᄏ"; moveCluster();}
							else if (prev.trail == "ᇂ" || prev.trail == "ᆮ" || prev.trail == "ᆺ" || prev.trail == "ᆻ") {curr.lead = "ᄐ"; moveCluster();}
							else if (prev.trail == "ᆸ") {curr.lead = "ᄑ"; moveCluster();}
							else if (prev.trail == "ᆽ") {curr.lead = "ᄎ"; moveCluster();}
							else if (HangulToPhonetic.hLenition) {
								// lenition
								     if (prev.trail == "ᆷ") {curr.lead = "ᄆ"; moveCluster();}
								else if (prev.trail == "ᆫ") {curr.lead = "ᄂ"; moveCluster();}
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
									? !(prev.lead == "ᄇ" && prev.vowel == "ᅡ" || HangulToPhonetic.neolbTrailAsB && prev.lead == "ᄂ" && prev.vowel == "ᅥ")
									: readBefore[prev.cluster]) prev.trail = convertTrailBefore[prev.cluster];
							delete prev.cluster;
						}
						
						if (curr.lead == "ᄋ") {
							// palatalization and renonka
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄌ"; delete prev.trail;}
							else if (isPalatal && prev.trail == "ᇀ") {curr.lead = "ᄎ"; delete prev.trail;}
							// no need to repeat n insertion
							else if (prev.trail != "ᆼ") {curr.lead = trailToLead[prev.trail]; delete prev.trail;}
							
						} else if (curr.lead == "ᄒ") {
								 if (isPalatal && prev.trail == "ᆮ") {curr.lead = "ᄎ"; delete prev.trail;}
							// aspiration
							else if (prev.trail == "ᆨ") {curr.lead = "ᄏ"; delete prev.trail;}
							else if (prev.trail == "ᇂ" || prev.trail == "ᆮ" || prev.trail == "ᆺ" || prev.trail == "ᆻ") {curr.lead = "ᄐ"; delete prev.trail;}
							else if (prev.trail == "ᆸ") {curr.lead = "ᄑ"; delete prev.trail;}
							else if (prev.trail == "ᆽ") {curr.lead = "ᄎ"; delete prev.trail;}
							else if (HangulToPhonetic.hLenition) {
								// lenition
								     if (prev.trail == "ᆷ") {curr.lead = "ᄆ"; delete prev.trail;}
								else if (prev.trail == "ᆫ") {curr.lead = "ᄂ"; delete prev.trail;}
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
			debugger;
			return "<span>" + syllables.map(function(item) {
				return String.fromCharCode((item.lead.charCodeAt(0) - 4352) * 588 + (item.vowel.charCodeAt(0) - 4449) * 28 + (item.trail ? item.trail.charCodeAt(0) - 4519 : 0) + 44032);
			}).join("") + "</span>";
			
		});
		
	}
	
	HangulToPhonetic.neolbTrailAsB	= false;
	HangulToPhonetic.ryeVowelAsE	= true;
	HangulToPhonetic.hLenition		= true;
	HangulToPhonetic.nInsertion		= false;
	
	return HangulToPhonetic;
	
}, this);