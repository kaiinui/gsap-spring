import { animate } from "motion";
import { pdSpring } from "../lib/spring";
import "./style.css";
import gsap from "gsap";

const duration = 0.8;
const bounce = 0.15;
const repeat = 100;

const tl = gsap.timeline();
tl.fromTo(
	".spring",
	{
		x: 0,
	},
	{
		duration,
		x: 200,
		repeat,
		ease: pdSpring(duration, bounce),
		// ease: spring(100, 10, 1),
	},
);

animate(
	".motion",
	{
		x: 200,
	},
	{
		type: "spring",
		bounce,
		duration,
		repeat,
	},
);

document.addEventListener("keydown", (event) => {
	if (event.code === "Space") {
		tl.seek(0);
	}
});
