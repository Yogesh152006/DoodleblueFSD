/**
 * Campus Events - Registration Page Script (register.js)
 * Basic and required JavaScript for navigation, auto-selecting events, and form handling
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
    const currentPage = window.location.pathname.split('/').pop() || 'register.html';
    const navLinks = document.querySelectorAll('#top ul li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === 'register.html') {
            link.classList.add('active');
        }
    });

    // 3. Pre-select event from URL query parameter (e.g. ?event=tech)
    const urlParams = new URLSearchParams(window.location.search);
    const selectedEvent = urlParams.get('event');
    const eventSelect = document.getElementById('eventss');

    if (selectedEvent && eventSelect) {
        // Map common shortcuts or values directly
        for (let i = 0; i < eventSelect.options.length; i++) {
            if (eventSelect.options[i].value === selectedEvent) {
                eventSelect.selectedIndex = i;
                break;
            }
        }
    }

    // 4. Form Submission and Simple Validation
    const form = document.getElementById('registrationForm');
    const feedback = document.getElementById('formFeedback');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const course = document.getElementById('eventss').value;
            const terms = document.getElementById('terms').checked;

            // Basic validation
            if (!fullname || !email || !phone || !course || !terms) {
                if (feedback) {
                    feedback.className = 'form-feedback error';
                    feedback.textContent = 'Please fill out all required fields and accept the terms.';
                    feedback.style.display = 'block';
                }
                return;
            }

            // Check phone number format (10 digits)
            if (!/^\d{10}$/.test(phone)) {
                if (feedback) {
                    feedback.className = 'form-feedback error';
                    feedback.textContent = 'Please enter a valid 10-digit phone number.';
                    feedback.style.display = 'block';
                }
                return;
            }

            // Show success message
            if (feedback) {
                feedback.className = 'form-feedback success';
                feedback.textContent = `Thank you, ${fullname}! You have successfully registered. A confirmation email has been sent to ${email}.`;
                feedback.style.display = 'block';
            }

            form.reset();
        });
    }
});
