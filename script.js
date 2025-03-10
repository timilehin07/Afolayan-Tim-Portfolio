function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

window.onscroll = function() {
  var scrollButton = document.querySelector('.scroll-to-top');
  var thirdSection = document.getElementById('third-section'); // Replace with the actual ID of your 3rd section

  // Check if the page has been scrolled past the third section
  if (window.scrollY >= thirdSection.offsetTop - 200) { // Adjust this value for more precise control
    scrollButton.classList.add('show'); // Show the arrow
  } else {
    scrollButton.classList.remove('show'); // Hide the arrow
  }
};


const roles = ["Software Engineer", "AI-Engineer", "ML-Engineer", "Tech Enthutiast"]; // Add more roles here
const typingTextElement = document.getElementById("typing-text");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    // Delete characters
    typingTextElement.textContent = currentRole.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Move to the next role
      setTimeout(typeText, 500); // Wait before typing the next role
      return;
    }
  } else {
    // Type characters
    typingTextElement.textContent = currentRole.substring(0, charIndex++);
    if (charIndex > currentRole.length) {
      isDeleting = true;
      setTimeout(typeText, 1500); // Pause before deleting
      return;
    }
  }
  setTimeout(typeText, isDeleting ? 100 : 150); // Adjust typing/deleting speed
}

// Start typing effect
typeText();



// Get the button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Show/hide the button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add('show');
    scrollToTopBtn.classList.remove('hide');
  } else {
    scrollToTopBtn.classList.add('hide');
    scrollToTopBtn.classList.remove('show');
  }
});

// Smooth scroll to the top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// first project table 
let currentSlideIndex = 0;

function moveSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');

  // Update the current slide index
  currentSlideIndex += direction;

  // Handle edge cases (loop back to start or end)
  if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1; // Go to the last slide
  } else if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0; // Go back to the first slide
  }

  updateSliderPosition();
}

function updateSliderPosition() {
  const slider = document.querySelector('.slider');
  const translateXValue = -currentSlideIndex * 100; // Moves the slider by 100% per slide
  slider.style.transform = `translateX(${translateXValue}%)`; // Apply the translation
}

// Event listeners for next and previous buttons
document.querySelector('.next').addEventListener('click', () => moveSlide(1));
document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));

// Adding click event listeners for direct navigation between slides
document.querySelectorAll('.slide').forEach((slide, index) => {
  slide.addEventListener('click', () => jumpToSlide(index));
});

function jumpToSlide(index) {
  currentSlideIndex = index;
  updateSliderPosition();
}

function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  menu.classList.toggle('active'); // Toggle the visibility of the menu
}


