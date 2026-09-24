const CONFETTI_COLORS = ['#ffd43b', '#ff6b6b', '#69db7c', '#74c0fc', '#f06595', '#fff', '#a9e34b'];

export function spawnConfetti(container: HTMLElement | null) {
  if (typeof (window as any).confetti === 'function' && container) {
    const cRect = container.getBoundingClientRect();
    const originX = (cRect.left + cRect.width / 2) / window.innerWidth;
    const originY = (cRect.top + cRect.height / 2) / window.innerHeight;

    const count = 150;
    const defaults = {
      origin: { x: originX, y: originY },
      colors: CONFETTI_COLORS,
      zIndex: 9999,
      scalar: 1.2,
      disableForReducedMotion: true
    };

    function fire(particleRatio: number, opts: any) {
      (window as any).confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, { spread: 26, startVelocity: 45 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 40 });
  }
}
