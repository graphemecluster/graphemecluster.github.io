const commonOptions = { separator: " " };
var origin = document.getElementById("origin");
var target = document.getElementById("target");
function append(parent, content) {
	if (typeof content === "string") parent.appendChild(document.createTextNode(content));
	else if (Array.isArray(content)) for (var node of content) append(parent, node);
	else parent.appendChild(content);
}
function element(className, content) {
	const span = document.createElement("span");
	span.className = className;
	append(span, content);
	return span;
}
function segment(converter, string) {
	const nodes = [];
	const regex = new RegExp(converter.regex);
	let match, prevIndex = 0;
	while (match = regex.exec(string)) {
		if (regex.ignoreCase) for (var i = 0; i < match.length; i++) match[i] = match[i] && match[i].toLowerCase();
		match.push(match.index, match.input);
		if (match.groups) {
			if (regex.ignoreCase) for (var key in match.groups) match.groups[key] = match.groups[key] && match.groups[key].toLowerCase();
			match.push(match.groups);
		}
		let result = converter.transform.apply(converter, match);
		const stringBefore = string.slice(prevIndex, match.index);
		if (prevIndex && /^(\s*|['ʹʼˈ’′＇])$/.test(stringBefore)) {
			const pairwiseResult = converter.pairwise(nodes[nodes.length - 1][1], result);
			nodes[nodes.length - 1][1] = pairwiseResult[0];
			result = pairwiseResult[1];
			if (commonOptions.separator) nodes.push(["separator", commonOptions.separator]);
		}
		else if (stringBefore) nodes.push(["raw", stringBefore]);
		nodes.push(["substituted", result]);
		prevIndex = regex.lastIndex;
	}
	const stringAfter = string.slice(prevIndex);
	if (stringAfter) nodes.push(["raw", stringAfter]);
	for (var args of nodes) if (args[0] === "substituted") args[1] = converter.construct.apply(converter, args[1]);
	return nodes;
}
function update() {
	history.replaceState(null, document.title, location.pathname + (origin.value && "#" + encodeURIComponent(origin.value)));
	localStorage.setItem(Converter.name, JSON.stringify(Object.assign({ input: origin.value }, commonOptions, Converter)));
	target.textContent = "";
	const converter = new Converter();
	for (var node of origin.value.split(/\r\n?|[\n\u2028\u2029]/).map(function(line) {
		const div = document.createElement("div");
		for (var args of segment(converter, line)) div.appendChild(element.apply(void 0, args));
		return div;
	})) target.appendChild(node);
}
[].forEach.call(document.querySelectorAll("input[type=checkbox]"), function(element) {
	element.onclick = function() {
		Converter[element.id] = element.checked;
		update();
	};
	Converter[element.id] = element.checked;
});
[].forEach.call(document.querySelectorAll("input[type=radio]"), function(element) {
	if (element.name in commonOptions) {
		element.onclick = function() {
			commonOptions[element.name] = document.forms.options[element.name].value;
			update();
		};
		commonOptions[element.name] = document.forms.options[element.name].value;
	} else {
		element.onclick = function() {
			Converter[element.name] = document.forms.options[element.name].value;
			update();
		};
		Converter[element.name] = document.forms.options[element.name].value;
	}
});
var separatorOther = document.getElementById("separator-other");
var separatorOther = document.getElementById("separator-other");
var separatorOtherInput = document.getElementById("separator-other-input");
if (separatorOther && separatorOtherInput) separatorOtherInput.oninput = function() {
	separatorOther.checked = true;
	commonOptions.separator = separatorOther.value = separatorOtherInput.value;
	update();
};
origin.oninput = update;
origin.onscroll = function() {
	if (target.isScrolling) target.isScrolling = false;
	else {
		target.scrollTop = this.scrollTop / (this.scrollHeight - this.clientHeight) * (target.scrollHeight - target.clientHeight);
		origin.isScrolling = true;
	}
};
target.onscroll = function() {
	if (origin.isScrolling) origin.isScrolling = false;
	else {
		origin.scrollTop = this.scrollTop / (this.scrollHeight - this.clientHeight) * (origin.scrollHeight - origin.clientHeight);
		target.isScrolling = true;
	}
};
const prevOptions = localStorage.getItem(Converter.name);
if (prevOptions) {
	const options = JSON.parse(prevOptions);
	for (var key in options) {
		if (typeof options[key] === "boolean") {
			const input = document.getElementById(key);
			if (input) input.checked = options[key];
		}
	}
	if ("separator" in options) {
		const input = [].find.call(document.querySelectorAll("input[name=separator]"), function(element) {
			return element.value === options.separator;
		});
		if (input) input.checked = true;
		else if (separatorOther && separatorOtherInput) {
			separatorOther.checked = true;
			separatorOther.value = separatorOtherInput.value = options.separator;
		}
		commonOptions.separator = options.separator;
		delete options.separator;
	}
	if ("input" in options) {
		origin.value = options.input;
		delete options.input;
	}
	Object.assign(Converter, options);
}
function tryDecode(str) {
	try {
		return decodeURIComponent(str.replace(/%(?![\da-f]{2})/gi, "%25"));
	} catch (e) {
		return str;
	}
}
const hash = location.hash.slice(location.hash[0] === "#");
if (hash) origin.value = tryDecode(hash);
if (origin.value) update();
