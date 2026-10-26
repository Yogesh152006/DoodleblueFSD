/**
 * Campus Events - Event Details Page Script (event-details.js)
 * Basic and required JavaScript for navigation and hash-based event highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile navigation menu toggle
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('#top ul');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('nav-open');
        });
    }

    // 2. Active navigation link highlight (Events is the parent section)
    const currentPage = window.location.pathname.split('/').pop() || '';
    const navLinks = document.querySelectorAll('#top ul li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage.includes('event-details') && href === 'events.html')) {
            link.classList.add('active');
        }
    });

    // 3. Highlight event if linked with a hash anchor
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            targetElement.classList.add('highlighted');
            setTimeout(() => {
                targetElement.classList.remove('highlighted');
            }, 3000);
        }
    }
});
