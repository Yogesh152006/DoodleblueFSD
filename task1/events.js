/**
 * Campus Events - Events Page Script (events.js)
 * Basic and required JavaScript for navigation and event category filtering
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
    const currentPage = window.location.pathname.split('/').pop() || 'events.html';
    const navLinks = document.querySelectorAll('#top ul li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === 'events.html') {
            link.classList.add('active');
        }
    });

    // 3. Category Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.event-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedFilter = btn.dataset.filter;

            // Show or hide cards based on category
            cards.forEach(card => {
                const category = card.dataset.category;
                if (selectedFilter === 'all' || category === selectedFilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
