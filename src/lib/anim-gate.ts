/**
 * Inline <head> script (kept out of "use client" modules so the server layout
 * can import the plain string).
 *
 * - Adds `html.js`, which lets CSS pre-hide animated elements so there is no
 *   flash before GSAP takes over.
 * - Safety net: if GSAP hasn't initialised within 3.5s (slow network, script
 *   error), adds `html.no-anim` so everything is shown without animation.
 */
export const animGateScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('gsap'))d.classList.add('no-anim')},3500)})();`;
