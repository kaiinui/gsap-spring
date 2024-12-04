# gsap-spring

A library that enables gsap to animate with spring parameters.

## Installation

```bash
npm install gsap-spring
pnpm add gsap-spring
bun add gsap-spring
```

## Usage

```ts
import { spring } from "gsap-spring";

// (recommended) animate with perceptual duration/bounce parameters
// which is more intuitive for designers
gsap.to(".element", {
	x: 100,
	ease: pdSpring(0.8, 0.15),
});

// (alternative) animate with traditional spring parameters
gsap.to(".element", {
	x: 100,
	ease: spring(100, 10, 1),
});
```

## License

MIT
