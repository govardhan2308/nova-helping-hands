/**
 * Nova Helping Hands NGO Website - JavaScript Document
 * Tagline: Help • Care • Empower • Together
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Navigation Active Link & Scroll Behaviors
    // -------------------------------------------------------------------------
    const navbar = document.querySelector('.navbar-custom');
    const navLinks = document.querySelectorAll('.nav-link-custom');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Highlight current page active link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Shrink navbar & change transparent background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // -------------------------------------------------------------------------
    // 2. Count-up Statistics Counter Animation
    // -------------------------------------------------------------------------
    const counters = document.querySelectorAll('.stat-count');
    const speed = 200; // The lower the slower

    const startCounterAnimation = (counter) => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        
        // Calculate increment step size
        const increment = target / speed;
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count).toLocaleString();
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString() + (counter.getAttribute('data-suffix') || '');
            }
        };
        
        updateCount();
    };

    // Use IntersectionObserver to trigger animations when section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection && counters.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => startCounterAnimation(counter));
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    }


    // -------------------------------------------------------------------------
    // 3. Interactive Donation Widget (Home / Programs Page)
    // -------------------------------------------------------------------------
    const presetButtons = document.querySelectorAll('.btn-preset');
    const donationInput = document.querySelector('#customDonationInput');
    const donateSubmitBtn = document.querySelector('#btnDonateSubmit');
    
    // Elements to update
    const raisedValEl = document.querySelector('#raisedVal');
    const donorsCountEl = document.querySelector('#donorsCount');
    const donationProgressBar = document.querySelector('.progress-bar-custom');

    let currentRaised = 38500;
    let currentDonors = 1420;
    const goalAmount = 50000;

    // Set presets behavior
    if (presetButtons.length > 0 && donationInput) {
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active classes
                presetButtons.forEach(b => b.classList.remove('active'));
                
                // Add active to current
                btn.classList.add('active');
                
                // Set input value
                donationInput.value = btn.getAttribute('data-amount');
            });
        });

        // Clear active preset classes when typing in custom input
        donationInput.addEventListener('input', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
        });
    }

    // Submit Donation Simulation
    if (donateSubmitBtn) {
        donateSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const donationVal = parseFloat(donationInput.value);

            if (isNaN(donationVal) || donationVal <= 0) {
                alert('Please enter a valid donation amount.');
                return;
            }

            // Simulate updating database values
            currentRaised += donationVal;
            currentDonors += 1;

            // Update UI elements with formatting
            if (raisedValEl) raisedValEl.innerText = '$' + currentRaised.toLocaleString();
            if (donorsCountEl) donorsCountEl.innerText = currentDonors.toLocaleString();

            // Recalculate and update progress bar
            const newPercentage = Math.min((currentRaised / goalAmount) * 100, 100);
            if (donationProgressBar) {
                donationProgressBar.style.width = newPercentage + '%';
            }

            // Show interactive success alert or modal
            alert(`Thank you so much for your generous donation of $${donationVal.toLocaleString()}! Together we are making a big difference.`);
            
            // Reset fields
            donationInput.value = '';
            presetButtons.forEach(b => b.classList.remove('active'));
        });
    }


    // -------------------------------------------------------------------------
    // 4. Newsletter Form Handler
    // -------------------------------------------------------------------------
    const newsletterForm = document.querySelector('#newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert(`Thank you for subscribing to our newsletter! We will keep you updated at ${email}.`);
            emailInput.value = '';
        });
    }


    // -------------------------------------------------------------------------
    // 5. Volunteer Registration Form Validation (volunteer.html)
    // -------------------------------------------------------------------------
    const volunteerForm = document.querySelector('#volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.querySelector('#fullName');
            const emailInput = document.querySelector('#email');
            const phoneInput = document.querySelector('#phone');
            const interestInput = document.querySelector('#areaOfInterest');
            const messageInput = document.querySelector('#message');

            // Reset error states
            [nameInput, emailInput, phoneInput, interestInput, messageInput].forEach(input => {
                if (input) {
                    input.classList.remove('is-invalid-custom');
                }
            });

            // Validate Full Name
            if (!nameInput || nameInput.value.trim() === '') {
                nameInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Email
            if (!emailInput || !validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Phone Number
            if (!phoneInput || phoneInput.value.trim().length < 8) {
                phoneInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Interest
            if (!interestInput || interestInput.value === '') {
                interestInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Message
            if (!messageInput || messageInput.value.trim() === '') {
                messageInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            if (isValid) {
                alert(`Thank you, ${nameInput.value.trim()}! Your registration as a volunteer was successful. Our outreach team will contact you shortly.`);
                volunteerForm.reset();
            }
        });
    }


    // -------------------------------------------------------------------------
    // 6. Contact Form Validation (contact.html)
    // -------------------------------------------------------------------------
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.querySelector('#contactName');
            const emailInput = document.querySelector('#contactEmail');
            const subjectInput = document.querySelector('#contactSubject');
            const messageInput = document.querySelector('#contactMessage');

            // Reset error states
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (input) {
                    input.classList.remove('is-invalid-custom');
                }
            });

            // Validate Name
            if (!nameInput || nameInput.value.trim() === '') {
                nameInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Email
            if (!emailInput || !validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Subject
            if (!subjectInput || subjectInput.value.trim() === '') {
                subjectInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            // Validate Message
            if (!messageInput || messageInput.value.trim() === '') {
                messageInput.classList.add('is-invalid-custom');
                isValid = false;
            }

            if (isValid) {
                alert(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. We will get back to you shortly.`);
                contactForm.reset();
            }
        });
    }


    // -------------------------------------------------------------------------
    // 7. Dynamic Gallery Filters & Modal Lightbox (gallery.html)
    // -------------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item-wrapper');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset active classes
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                        // Add fade-in-up class to trigger animation
                        item.classList.add('fade-in-up');
                    } else if (item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.classList.add('fade-in-up');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in-up');
                    }
                });
            });
        });
    }

    // Modal Lightbox Setup
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const galleryTriggerItems = document.querySelectorAll('.gallery-item');

    if (lightboxModal && lightboxImage && galleryTriggerItems.length > 0) {
        galleryTriggerItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSource = item.getAttribute('data-src');
                if (imgSource) {
                    lightboxImage.setAttribute('src', imgSource);
                    // Bootstrap 5 modal instantiation
                    const modal = new bootstrap.Modal(lightboxModal);
                    modal.show();
                }
            });
        });
    }


    // Helper email validator
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }
});
