window.addEventListener('scroll', () => {
    const hint = document.querySelector('.scroll-hint');
    if (!hint) return;

    // Get the current scroll position
    const scrollY = window.scrollY;
    // Set a distance (in pixels) where the arrow should be completely gone
    const fadeDistance = 150; 

    // Calculate opacity: 1 at the top, 0 after scrolling fadeDistance
    let opacity = 1 - (scrollY / fadeDistance);

    // Clamp the opacity between 0 and 1
    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    // Apply the opacity and a slight downward movement
    hint.style.opacity = opacity;
    hint.style.transform = `translateX(-50%) translateY(${(1 - opacity) * 20}px)`;

    // Optimization: Disable pointer events when invisible so it doesn't block clicks
    if (opacity === 0) {
        hint.style.pointerEvents = 'none';
    } else {
        hint.style.pointerEvents = 'auto';
    }
});

let lastScrollTop = 0;

// This handles hiding/showing the main site header on scroll
document.addEventListener('scroll', function() {
    const header = document.getElementById('site-header');
    if (!header) return;

    // Check scroll position from multiple sources to be safe
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    // Fix for scroll-snap: if scrollTop is 0, check the active section
    if (scrollTop === 0) {
        scrollTop = window.scrollY;
    }

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // SCROLLING DOWN -> Hide Header
        header.classList.add('nav-up');
    } else {
        // SCROLLING UP -> Show Header
        header.classList.remove('nav-up');
    }

    // Update last position, but don't let it go below 0
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, true);

// Text Scramble Animation
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%@$#";
let scrambleRun = false; 

const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !scrambleRun) {
            setTimeout(() => {
                startScramble();
            }, 500);
            scrambleRun = true; 
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero-section');
if (heroSection) scrambleObserver.observe(heroSection);

function startScramble() {
    const spans = document.querySelectorAll(".scramble-text span");
    
    spans.forEach(span => {
        let iteration = 0;
        const targetWord = span.dataset.value; 
        
        let interval = setInterval(() => {
            span.innerText = targetWord
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return targetWord[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            if (iteration >= targetWord.length) {
                clearInterval(interval);
            }
            
            iteration += 1; 
            
        }, 100);
    });
}

// HORIZONTAL PHOTO GALLERY: Dynamic Swipe Fade Fix
const dgScroll = document.getElementById('dg-scroll');
const dgWrapper = document.getElementById('dg-wrapper');

if (dgScroll && dgWrapper) {
    const dgText = dgWrapper.querySelector('.dg-text');

    dgScroll.addEventListener('scroll', () => {
        const scrollLeft = dgScroll.scrollLeft;
        
        // Distance in pixels over which the text should slowly fade into complete invisibility
        const fadeDistance = 250; 
        
        // Calculate dynamic, smooth opacity based on horizontal scroll progress
        let opacity = 1 - (scrollLeft / fadeDistance);
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        
        if (dgText) {
            // Apply the direct opacity fade
            dgText.style.opacity = opacity;
            
            // Optional Parallax Effect: Shifts text slowly to the left as it disappears
            dgText.style.transform = `translateY(-50%) translateX(${- (1 - opacity) * 40}px)`;
            
            // Let touch gestures pass cleanly through when text is fully invisible
            if (opacity === 0) {
                dgText.style.pointerEvents = 'none';
            } else {
                dgText.style.pointerEvents = 'auto';
            }
        }

        // Maintain fallback classes just in case your CSS uses them elsewhere
        if (scrollLeft > 40) {
            dgWrapper.classList.add('is-scrolling');
        } else {
            dgWrapper.classList.remove('is-scrolling');
        }
    });
    
    dgScroll.addEventListener('click', (e) => {
        // Only trigger slide if an actual image card is clicked
        if (e.target.closest('.dg-item')) {
            dgWrapper.classList.add('is-scrolling');
            const slideDistance = window.innerWidth > 900 ? window.innerWidth * 0.45 : window.innerWidth * 0.85;
            dgScroll.scrollBy({ left: slideDistance, behavior: 'smooth' });
        }
    });
}