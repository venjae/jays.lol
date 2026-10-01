const profileCard = document.querySelector(".profile-card");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && !prefersReducedMotion) {
	const cursorOrbit = document.createElement("div");
	cursorOrbit.className = "cursor-orbit";
	cursorOrbit.setAttribute("aria-hidden", "true");
	cursorOrbit.innerHTML = '<svg class="cursor-orbit__star" viewBox="0 0 40 40" focusable="false"><path d="M20 3 28 36 4 16h32L12 36 20 3Z" /></svg>';
	document.body.append(cursorOrbit);

	window.addEventListener("pointermove", (event) => {
		if (event.pointerType !== "mouse") return;
		cursorOrbit.style.setProperty("--cursor-x", `${event.clientX}px`);
		cursorOrbit.style.setProperty("--cursor-y", `${event.clientY}px`);
		cursorOrbit.classList.add("is-visible");
	});

	document.documentElement.addEventListener("pointerleave", () => {
		cursorOrbit.classList.remove("is-visible");
	});
}

if (profileCard && canHover && !prefersReducedMotion) {
	const maxTilt = 14;
	let restingBounds = null;

	const resetTilt = () => {
		profileCard.style.setProperty("--card-tilt-x", "0deg");
		profileCard.style.setProperty("--card-tilt-y", "0deg");
		profileCard.classList.remove("is-tilting");
		restingBounds = null;
		window.removeEventListener("pointermove", updateTilt);
	};

	const updateTilt = (event) => {
		if (event.pointerType !== "mouse") return;
		if (!restingBounds) return;

		const { left, right, top, bottom, width, height } = restingBounds;
		if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
			resetTilt();
			return;
		}

		const horizontalPosition = (event.clientX - left) / width;
		const verticalPosition = (event.clientY - top) / height;

		profileCard.style.setProperty("--card-tilt-x", `${(0.5 - verticalPosition) * maxTilt}deg`);
		profileCard.style.setProperty("--card-tilt-y", `${(horizontalPosition - 0.5) * maxTilt}deg`);
	};

	profileCard.addEventListener("pointerenter", (event) => {
		if (event.pointerType !== "mouse") return;

		const bounds = profileCard.getBoundingClientRect();
		restingBounds = {
			left: bounds.left,
			right: bounds.right,
			top: bounds.top,
			bottom: bounds.bottom,
			width: bounds.width,
			height: bounds.height,
		};
		profileCard.classList.add("is-tilting");
		window.addEventListener("pointermove", updateTilt);
		updateTilt(event);
	});

	window.addEventListener("blur", resetTilt);
}
