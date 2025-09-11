function toggleMenu() {
  const menu = document.querySelector(".menu-links")
  const icon = document.querySelector(".hamburger-icon")
  menu.classList.toggle("open")
  icon.classList.toggle("open")
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  const scrollBtn = document.getElementById("scrollToTopBtn")
  if (window.pageYOffset > 300) {
    scrollBtn.classList.add("show")
  } else {
    scrollBtn.classList.remove("show")
  }
})

// Slider functionality for project 5
let currentSlide = 0
const slides = document.querySelectorAll(".slide")

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index)
  })
}

function moveSlide(direction) {
  currentSlide += direction
  if (currentSlide >= slides.length) {
    currentSlide = 0
  } else if (currentSlide < 0) {
    currentSlide = slides.length - 1
  }
  showSlide(currentSlide)
}

// Initialize slider
if (slides.length > 0) {
  showSlide(0)

  // Auto-advance slides every 5 seconds
  setInterval(() => {
    moveSlide(1)
  }, 5000)
}

// Typing effect
const texts = ["Full-Stack Software Engineer", "AI/ML Developer", "Web Developer", "Mobile App Developer"]

let textIndex = 0
let charIndex = 0
let isDeleting = false
const typingSpeed = 100
const deletingSpeed = 50
const pauseTime = 2000

function typeWriter() {
  const typingElement = document.getElementById("typing-text")
  const currentText = texts[textIndex]

  if (!isDeleting) {
    // Typing
    typingElement.textContent = currentText.substring(0, charIndex + 1)
    charIndex++

    if (charIndex === currentText.length) {
      // Pause before deleting
      setTimeout(() => {
        isDeleting = true
        typeWriter()
      }, pauseTime)
      return
    }
  } else {
    // Deleting
    typingElement.textContent = currentText.substring(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
    }
  }

  const speed = isDeleting ? deletingSpeed : typingSpeed
  setTimeout(typeWriter, speed)
}

// Start typing effect when page loads
document.addEventListener("DOMContentLoaded", typeWriter)
