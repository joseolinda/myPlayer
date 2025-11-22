/**
 * Adds swipe-left functionality to an element
 * @param {HTMLElement} el - The element to attach the swipe listener to
 * @param {Function} callback - Function to execute when swipe is completed
 */
export default function swipeLeft(el, callback) {
    if (!(el instanceof HTMLElement)) {
        console.error("swipe error: Element provided is not an HTMLElement");
        return;
    }

    let startX = 0;
    let currentX = 0;
    const threshold = 120; // px to trigger callback

    el.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        // Reset transition for dragging
        el.style.transition = 'none';
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const diffX = startX - touchX;

        // Only allow swiping left (positive diffX)
        if (diffX > 0) {
            // Limit drag distance
            const moveX = Math.min(diffX, 150);
            el.style.transform = `translateX(-${moveX}px)`;

            // Fade out effect
            const opacity = 1 - (moveX / 300);
            el.style.opacity = opacity;

            currentX = moveX;
        }
    }, { passive: true });

    el.addEventListener('touchend', () => {
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

        if (currentX > threshold) {
            // Swipe completed
            el.style.transform = 'translateX(-100%)';
            el.style.opacity = '0';
            setTimeout(callback, 300);
        } else {
            // Reset
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        }

        currentX = 0;
        startX = 0;
    });
}