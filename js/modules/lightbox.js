/**
 * Lightbox Module
 * Handles zoomable image functionality with dynamic DOM creation
 */

const Lightbox = {
    init() {
        // Create lightbox element if it doesn't exist
        let lightbox = document.getElementById('image-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'image-lightbox';
            lightbox.className = 'lightbox-overlay';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-label', 'Image viewer');
            lightbox.hidden = true;
            lightbox.innerHTML = `
                <button class="lightbox-close" aria-label="Close image viewer">&times;</button>
                <img class="lightbox-image" src="" alt="">
            `;
            document.body.appendChild(lightbox);
        }

        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        // Open lightbox when clicking zoomable images
        document.querySelectorAll('.zoomable-image').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.hidden = false;
                document.body.style.overflow = 'hidden';
                closeBtn.focus();
            });
            // Also support keyboard activation
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    img.click();
                }
            });
        });

        // Close lightbox
        function closeLightbox() {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
        });
    }
};

export default Lightbox;
