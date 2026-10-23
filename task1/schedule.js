/**
 * Campus Events - Schedule Page Script (schedule.js)
 * Basic and required JavaScript for navigation and schedule table search
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
    const currentPage = window.location.pathname.split('/').pop() || 'schedule.html';
    const navLinks = document.querySelectorAll('#top ul li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === 'schedule.html') {
            link.classList.add('active');
        }
    });

    // 3. Search and filter schedule table rows
    const searchInput = document.getElementById('scheduleSearch');
    const tableRows = document.querySelectorAll('#tabledata tbody tr');

    if (searchInput && tableRows.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
