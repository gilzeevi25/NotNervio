document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav ul');
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Hero letter-by-letter reveal
  const title = document.querySelector('.hero-title');
  const letters = title.textContent.split('');
  title.textContent = '';
  letters.forEach((letter, i) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.transitionDelay = `${i * 40}ms`;
    title.appendChild(span);
  });
  setTimeout(() => {
    title.querySelectorAll('span').forEach(span => span.classList.add('reveal'));
  }, 100);

  // IntersectionObserver animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.card, .feature-item, .team-member, .solution-illustration').forEach(el => {
    observer.observe(el);
  });

  // Testimonial carousel
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.querySelector('.carousel-dots');
  let index = 0;
  testimonials.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('span');

  function showTestimonial(i) {
    testimonials[index].classList.remove('active');
    dots[index].classList.remove('active');
    index = i;
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
  }

  setInterval(() => {
    showTestimonial((index + 1) % testimonials.length);
  }, 5000);
});
