export function displayRatio(n: number) {
	const r = prec(n).toString();
	if (r !== "NaN" && r !== "Infinity") {
		return r;
	}
	return null;
}

export function prec(n: number) {
	return n.toPrecision(4);
}
