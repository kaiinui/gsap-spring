type EasingFn = (t: number) => number;

/**
 * returns a spring easing function for gsap using duration/bounce parameters, which is known as perceptual duration introduces in Apple's WWDC 2023
 *
 * @example
 * ```ts
 * gsap.to(".element", {
 * 		duration: 0.8,
 * 		x: 100,
 * 		// animate with duration = 0.8, bounce = 0.15
 * 		ease: pdSpring(0.8, 0.15),
 * });
 * ```
 */
export function pdSpring(duration = 0.8, bounce = 0.3): EasingFn {
	if (duration <= 0) {
		throw new Error("Duration must be greater than 0");
	}
	if (bounce > 1 || bounce < -1) {
		throw new Error("Bounce must be between -1 and 1");
	}

	const { stiffness, damping, mass } = translateParameters(duration, bounce);
	return spring(stiffness, damping, mass);
}

/**
 * returns a spring easing function for gsap using stiffness/damping/mass parameters
 *
 * @example
 * ```ts
 * gsap.to(".element", {
 * 		duration: 0.8,
 * 		x: 100,
 * 		// animate with stiffness = 100, damping = 10, mass = 1
 * 		ease: spring(100, 10, 1),
 * });
 * ```
 */
export function spring(
	stiffness: number,
	damping: number,
	mass: number,
	velocity = 0,
): EasingFn {
	return (t: number) => {
		const zeta = damping / (2 * Math.sqrt(stiffness * mass));

		const omega = Math.sqrt(stiffness / mass);

		const initialDisplacement = velocity / omega;

		if (zeta < 1) {
			const omega_d = omega * Math.sqrt(1 - zeta * zeta);

			return (
				1 -
				Math.exp(-zeta * omega * t) *
					((initialDisplacement * omega * Math.sin(omega_d * t)) / omega_d +
						Math.cos(omega_d * t))
			);
		}
		const alpha = omega * Math.sqrt(zeta * zeta - 1);
		return (
			1 -
			Math.exp(-zeta * omega * t) *
				((initialDisplacement * omega * Math.sinh(alpha * t)) / alpha +
					Math.cosh(alpha * t))
		);
	};
}

/**
 * Translate spring parameters from duration and bounce (which is known as perceptual duration) to traditional spring parameters stiffness, damping, and mass.
 * https://wwdcnotes.com/documentation/wwdcnotes/wwdc23-10158-animate-with-springs/
 */
function translateParameters(
	duration: number,
	bounce: number,
): {
	stiffness: number;
	damping: number;
	mass: number;
} {
	const bnc = 1 - bounce;
	// @see https://github.com/motiondivision/motion/blob/main/packages/framer-motion/src/animation/generators/spring/index.ts
	// to fit the perceptual duration to the actual duration
	const adjustedDuration = duration * 1.2;

	const mass = 1;
	const root = (2 * Math.PI) / adjustedDuration;
	const stiffness = root ** 2;

	if (bnc >= 0) {
		return {
			stiffness,
			damping: (1 - (4 * Math.PI * bnc) / adjustedDuration) * -1,
			mass,
		};
	}
	return {
		stiffness,
		damping: ((4 * Math.PI) / (adjustedDuration + 4 * Math.PI * bnc)) * -1,
		mass,
	};
}
