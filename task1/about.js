/**
 * Campus Events - About Page Script (about.js)
 * Basic and required JavaScript for navigation and active link highlighting
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

    // 2. Active navigation link highlight
    const currentPage = window.location.pathname.split('/').pop() || 'about.html';
    const navLinks = document.querySelectorAll('#top ul li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === 'about.html') {
            link.classList.add('active');
        }
    });
});
