document.addEventListener('DOMContentLoaded', () => {
  // --- TYPEWRITER EFFECT ---
  const words = ['Fullstack Developer', 'AI Programmer', 'Mobile Developer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2000;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      currentSpeed = delayBetweenWords; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      currentSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, currentSpeed);
  }

  if (typewriterElement) {
    type();
  }

  // --- HEADER SCROLL ACTION ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE NAV MENU TOGGLE ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinksContainer) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinksContainer.style.display = 
        navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
      
      // Basic styling toggle for mobile menu display
      if (navLinksContainer.style.display === 'flex') {
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '100%';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.width = '100%';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.background = 'rgba(8, 9, 12, 0.95)';
        navLinksContainer.style.padding = '2rem';
        navLinksContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        mobileMenuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });

    // Close mobile menu on navlink clicks
    const links = navLinksContainer.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinksContainer.style.display = 'none';
          mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      });
    });
  }

  // --- INTERSECTION OBSERVER FOR REVEAL ON SCROLL ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- ACTIVE LINK ON SCROLL ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- CONTACT FORM HANDLER ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('nameInput').value;
      const email = document.getElementById('emailInput').value;
      const message = document.getElementById('messageInput').value;
      
      const whatsappText = `Halo Muhamad Lutfi, saya ${name} (${email}).\n\nPesan:\n${message}`;
      const whatsappUrl = `https://wa.me/6283813450734?text=${encodeURIComponent(whatsappText)}`;
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Visual feedback and redirect
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Membuka WhatsApp... <i class="fa-solid fa-spinner fa-spin"></i>';
      
      setTimeout(() => {
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        submitBtn.innerHTML = 'Terkirim! <i class="fa-solid fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.style.color = '#fff';
        
        // Reset form
        contactForm.reset();
        
        // Restore button after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1200);
    });
  }

  // --- CANVAS PARTICLE BACKGROUND ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 80;
    const connectionDistance = 120;

    // Mouse coordinates
    let mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // particle size 1px to 3px
        this.speedX = Math.random() * 0.4 - 0.2; // slow speed
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.45)' : 'rgba(127, 0, 255, 0.45)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce back from edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Init particles
    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    init();

    // Draw lines between close particles
    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            let opacity = 1 - (distance / connectionDistance);
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.08})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        // Draw connections to mouse if active
        if (mouse.x !== null && mouse.y !== null) {
          let dxMouse = particlesArray[a].x - mouse.x;
          let dyMouse = particlesArray[a].y - mouse.y;
          let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distanceMouse < mouse.radius) {
            let opacityMouse = 1 - (distanceMouse / mouse.radius);
            ctx.strokeStyle = `rgba(127, 0, 255, ${opacityMouse * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    }
    animate();

    // Re-init particles on resize to adapt density
    window.addEventListener('resize', () => {
      init();
    });
  }
});
