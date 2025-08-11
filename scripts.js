// Main interaction logic

document.addEventListener('DOMContentLoaded', () => {
  // Letter-by-letter reveal for hero headline
  const headline = document.querySelector('.hero h1');
  const text = headline.textContent;
  headline.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
      span.style.display = 'inline';
    } else {
      span.textContent = char;
      span.style.display = 'inline-block';
    }
    span.style.transitionDelay = `${i * 50}ms`;
    headline.appendChild(span);
  });
  setTimeout(() => headline.classList.add('revealed'), 100);

  // IntersectionObserver animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

  // Parallax effect for hero background
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    hero.style.backgroundPositionY = window.scrollY * 0.5 + 'px';
  });

  // Testimonial carousel
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  let current = 0;

  function show(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function next() {
    current = (current + 1) % testimonials.length;
    show(current);
  }

  let interval = setInterval(next, 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      show(i);
      clearInterval(interval);
      interval = setInterval(next, 5000);
    });
  });
});
