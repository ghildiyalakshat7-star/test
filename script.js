document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initMenu();
  initReveals();
  initHoverImages();
  initTextScramble();
});

/* 1. MAGNETIC CUSTOM CURSOR */
/* 1. MAGNETIC HUD TARGETING CURSOR */
function initCursor() {
  // Create center dot
  const dot = document.createElement('div');
  dot.classList.add('cursor-dot');
  
  // Create outer reticle
  const reticle = document.createElement('div');
  reticle.classList.add('cursor-reticle');
  
  // Create the 4 corners of the reticle
  const tl = document.createElement('div'); tl.className = 'reticle-bracket bracket-tl';
  const tr = document.createElement('div'); tr.className = 'reticle-bracket bracket-tr';
  const bl = document.createElement('div'); bl.className = 'reticle-bracket bracket-bl';
  const br = document.createElement('div'); br.className = 'reticle-bracket bracket-br';
  
  reticle.appendChild(tl);
  reticle.appendChild(tr);
  reticle.appendChild(bl);
  reticle.appendChild(br);
  
  document.body.appendChild(dot);
  document.body.appendChild(reticle);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let reticleX = mouseX, reticleY = mouseY;

  // Track raw mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // The dot snaps instantly
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth follow for the reticle (easing)
  const animate = () => {
    let distX = mouseX - reticleX;
    let distY = mouseY - reticleY;
    
    reticleX = reticleX + (distX * 0.2); // Easing speed
    reticleY = reticleY + (distY * 0.2);
    
    reticle.style.transform = `translate(${reticleX}px, ${reticleY}px)`;
    requestAnimationFrame(animate);
  };
  animate();

  // Add the "Lock On" effect when hovering over interactive elements
  const interactives = document.querySelectorAll('a, button, .archive-row, .glitch-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
/* 2. FULLSCREEN MENU */
function initMenu() {
  const btn = document.querySelector('.menu-btn');
  const overlay = document.querySelector('.menu-overlay');
  const links = document.querySelectorAll('.menu-link');
  
  if(!btn || !overlay) return;

  btn.addEventListener('click', () => {
    const isActive = overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    btn.textContent = isActive ? '[ CLOSE ]' : '[ MENU ]';
    
    // Staggered reveal for menu links
    links.forEach((link, idx) => {
      link.style.transitionDelay = isActive ? `${0.2 + (idx * 0.1)}s` : '0s';
    });
  });
}

/* 3. CINEMATIC SCROLL REVEALS */
function initReveals() {
  const elements = document.querySelectorAll('.reveal-text');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  elements.forEach(el => observer.observe(el));
}

/* 4. FLOATING CURSOR IMAGE REVEAL (Lifeforms Page) */
function initHoverImages() {
  const rows = document.querySelectorAll('.archive-row');
  if(!rows.length) return;

  const hoverBox = document.createElement('div');
  hoverBox.classList.add('hover-image-reveal');
  const hoverImg = document.createElement('img');
  hoverBox.appendChild(hoverImg);
  document.body.appendChild(hoverBox);

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      hoverImg.src = row.dataset.img;
      hoverBox.style.opacity = '1';
      hoverBox.style.transform = 'scale(1) translate(-50%, -50%)';
    });
    
    row.addEventListener('mousemove', (e) => {
      hoverBox.style.left = e.clientX + 'px';
      hoverBox.style.top = e.clientY + 'px';
    });
    
    row.addEventListener('mouseleave', () => {
      hoverBox.style.opacity = '0';
      hoverBox.style.transform = 'scale(0.8) translate(-50%, -50%)';
    });
  });
}

/* 5. CYBERPUNK TEXT SCRAMBLE ON HOVER */
function initTextScramble() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const elements = document.querySelectorAll('.scramble');
  
  elements.forEach(el => {
    el.addEventListener('mouseover', event => {
      let iterations = 0;
      const originalText = event.target.dataset.value;
      
      clearInterval(el.interval);
      el.interval = setInterval(() => {
        event.target.innerText = originalText.split("")
          .map((letter, index) => {
            if(index < iterations) return originalText[index];
            return letters[Math.floor(Math.random() * letters.length)];
          }).join("");
        
        if(iterations >= originalText.length) clearInterval(el.interval);
        iterations += 1 / 3;
      }, 30);
    });
  });
}