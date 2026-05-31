document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Curriculum Standards Tab Switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const contentPanels = document.querySelectorAll('.standards-content-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content panels
      contentPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 5. Interactive Math Playground Canvas Visualizer
  const canvas = document.getElementById('math-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Sliders & UI Controls
    const pgTypeButtons = document.querySelectorAll('.playground-type-btn');
    const control1Container = document.getElementById('ctrl-1-container');
    const control2Container = document.getElementById('ctrl-2-container');
    const control3Container = document.getElementById('ctrl-3-container');
    
    const slider1 = document.getElementById('slider-1');
    const slider2 = document.getElementById('slider-2');
    const slider3 = document.getElementById('slider-3');
    
    const val1Text = document.getElementById('val-1');
    const val2Text = document.getElementById('val-2');
    const val3Text = document.getElementById('val-3');
    
    const formulaText = document.getElementById('math-formula');
    const resultText = document.getElementById('math-result');

    let currentMode = 'trig'; // 'trig', 'quad', 'pythag'

    // Device Pixel Ratio scaling for sharp rendering
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      draw();
    }
    
    // Resize handler
    window.addEventListener('resize', resizeCanvas);
    
    // Initial UI Setup for Modes
    function setPlaygroundMode(mode) {
      currentMode = mode;
      pgTypeButtons.forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (mode === 'trig') {
        // Amplitude, Frequency
        control1Container.style.display = 'flex';
        control2Container.style.display = 'flex';
        control3Container.style.display = 'none';

        control1Container.querySelector('span').textContent = 'Amplitude (A)';
        slider1.min = '10';
        slider1.max = '100';
        slider1.value = '50';
        slider1.step = '1';

        control2Container.querySelector('span').textContent = 'Frequency (f)';
        slider2.min = '1';
        slider2.max = '10';
        slider2.value = '3';
        slider2.step = '0.5';

        formulaText.innerHTML = 'y = A &bull; sin(f &bull; x)';
      } 
      else if (mode === 'quad') {
        // a, b, c
        control1Container.style.display = 'flex';
        control2Container.style.display = 'flex';
        control3Container.style.display = 'flex';

        control1Container.querySelector('span').textContent = 'Coefficient a';
        slider1.min = '-5';
        slider1.max = '5';
        slider1.value = '1';
        slider1.step = '0.2';

        control2Container.querySelector('span').textContent = 'Coefficient b';
        slider2.min = '-10';
        slider2.max = '10';
        slider2.value = '0';
        slider2.step = '0.5';

        control3Container.querySelector('span').textContent = 'Constant c';
        slider3.min = '-50';
        slider3.max = '50';
        slider3.value = '-20';
        slider3.step = '1';

        formulaText.innerHTML = 'y = ax² + bx + c';
      } 
      else if (mode === 'pythag') {
        // base (a), height (b)
        control1Container.style.display = 'flex';
        control2Container.style.display = 'flex';
        control3Container.style.display = 'none';

        control1Container.querySelector('span').textContent = 'Base (a)';
        slider1.min = '30';
        slider1.max = '120';
        slider1.value = '80';
        slider1.step = '1';

        control2Container.querySelector('span').textContent = 'Height (b)';
        slider2.min = '30';
        slider2.max = '120';
        slider2.value = '60';
        slider2.step = '1';

        formulaText.innerHTML = 'a² + b² = c²';
      }

      updateSliderValues();
      draw();
    }

    function updateSliderValues() {
      val1Text.textContent = slider1.value;
      val2Text.textContent = slider2.value;
      if (currentMode === 'quad') {
        val3Text.textContent = slider3.value;
      }
    }

    // Connect slider events
    [slider1, slider2, slider3].forEach(slider => {
      slider.addEventListener('input', () => {
        updateSliderValues();
        draw();
      });
    });

    pgTypeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setPlaygroundMode(btn.getAttribute('data-mode'));
      });
    });

    // Helper functions for drawing
    function drawGrid(w, h, spacing = 40) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = spacing; x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    function drawAxes(w, h, originX, originY) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      
      // X Axis
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(w, originY);
      ctx.stroke();
      
      // Y Axis
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, h);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter';
      ctx.fillText('X', w - 15, originY - 8);
      ctx.fillText('Y', originX + 8, 15);
    }

    function draw() {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const originX = w / 2;
      const originY = h / 2;

      ctx.clearRect(0, 0, w, h);

      if (currentMode === 'trig') {
        const A = parseFloat(slider1.value);
        const f = parseFloat(slider2.value);

        drawGrid(w, h, 30);
        drawAxes(w, h, originX, originY);

        // Plot sin wave
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.shadowBlur = 10;

        for (let screenX = 0; screenX < w; screenX++) {
          const mathX = screenX - originX;
          const mathY = A * Math.sin(f * mathX * 0.02);
          const screenY = originY - mathY;

          if (screenX === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Dynamic formula value update
        resultText.innerHTML = `y = <strong>${A}</strong> sin(<strong>${f}</strong>x)`;
      } 
      else if (currentMode === 'quad') {
        const a = parseFloat(slider1.value);
        const b = parseFloat(slider2.value);
        const c = parseFloat(slider3.value);

        drawGrid(w, h, 30);
        drawAxes(w, h, originX, originY);

        // Plot parabola
        // Scale factors to fit in screen
        const scaleX = 15;
        const scaleY = 1.5;

        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        ctx.shadowBlur = 10;

        for (let screenX = 0; screenX < w; screenX++) {
          const mathX = (screenX - originX) / scaleX;
          const mathY = a * mathX * mathX + b * mathX + c;
          const screenY = originY - (mathY * scaleY);

          if (screenX === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Calculate roots
        const d = b * b - 4 * a * c;
        let rootsText = '';
        if (a === 0) {
          if (b !== 0) {
            const root = -c / b;
            rootsText = `Root: x = ${root.toFixed(2)}`;
          } else {
            rootsText = 'No roots';
          }
        } else {
          if (d > 0) {
            const r1 = (-b + Math.sqrt(d)) / (2 * a);
            const r2 = (-b - Math.sqrt(d)) / (2 * a);
            rootsText = `Roots: x₁ = ${r1.toFixed(1)}, x₂ = ${r2.toFixed(1)}`;
          } else if (d === 0) {
            const r = -b / (2 * a);
            rootsText = `Root: x = ${r.toFixed(1)}`;
          } else {
            rootsText = 'Complex roots (No X-intercepts)';
          }
        }

        let eq = `${a === 1 ? '' : a === -1 ? '-' : a}x²`;
        if (b > 0) eq += ` + ${b}x`;
        else if (b < 0) eq += ` - ${Math.abs(b)}x`;
        
        if (c > 0) eq += ` + ${c}`;
        else if (c < 0) eq += ` - ${Math.abs(c)}`;
        
        resultText.innerHTML = `${eq} | <span style="color:#a5b4fc">${rootsText}</span>`;
      } 
      else if (currentMode === 'pythag') {
        const a = parseFloat(slider1.value);
        const b = parseFloat(slider2.value);
        const c = Math.sqrt(a * a + b * b);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        drawGrid(w, h, 30);

        // Center the triangle slightly lower left to make space for squares
        const startX = originX - a/2;
        const startY = originY + b/2;

        const pA = { x: startX, y: startY }; // Right angle corner (bottom-left)
        const pB = { x: startX + a, y: startY }; // Bottom-right corner
        const pC = { x: startX, y: startY - b }; // Top-left corner

        // 1. Draw Squares on each side (shaded nicely)
        // Square on side a (base) - goes downwards
        ctx.fillStyle = 'rgba(6, 182, 212, 0.07)';
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(pA.x, pA.y, a, a);
        ctx.strokeRect(pA.x, pA.y, a, a);
        
        // Square on side b (height) - goes leftwards
        ctx.fillStyle = 'rgba(244, 63, 94, 0.07)';
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.fillRect(pA.x - b, pC.y, b, b);
        ctx.strokeRect(pA.x - b, pC.y, b, b);

        // Square on side c (hypotenuse) - tilted!
        ctx.fillStyle = 'rgba(99, 102, 241, 0.07)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
        ctx.beginPath();
        // Vector perpendicular to hypotenuse going outwards
        const dx = pB.x - pC.x;
        const dy = pB.y - pC.y;
        // Normal vector (-dy, dx)
        ctx.moveTo(pC.x, pC.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineTo(pB.x - dy, pB.y + dx);
        ctx.lineTo(pC.x - dy, pC.y + dx);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 2. Draw Main Right Triangle
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw Right Angle Box
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pA.x + 10, pA.y);
        ctx.lineTo(pA.x + 10, pA.y - 10);
        ctx.lineTo(pA.x, pA.y - 10);
        ctx.stroke();

        // Label sides
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`a = ${a}`, pA.x + a/2, pA.y + 18);
        ctx.textAlign = 'right';
        ctx.fillText(`b = ${b}`, pA.x - 8, pA.y - b/2);
        
        // Hypotenuse label
        ctx.textAlign = 'left';
        ctx.fillStyle = '#a5b4fc';
        ctx.fillText(`c = ${c.toFixed(1)}`, pC.x + a/2 + 8, pC.y + b/2 - 8);

        // Display math proof calculation
        resultText.innerHTML = `a² + b² = c² &rArr; ${a}² + ${b}² = <strong>${Math.round(c*c)}</strong> (c = <strong>${c.toFixed(2)}</strong>)`;
      }
    }

    // Trigger Initial Setup
    setPlaygroundMode('trig');
    setTimeout(resizeCanvas, 100);
  }

  // 6. Contact Form & WhatsApp Redirection
  const contactForm = document.getElementById('tution-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const standard = document.getElementById('form-standard').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !phone || !standard) {
        alert('Please fill in all required fields (Name, Contact Number, and Student Standard).');
        return;
      }

      // Format custom message for WhatsApp
      const whatsappText = `Hello! I would like to inquire about online mathematics tuition.
Here are the details:
- Name: ${name}
- Contact Number: ${phone}
- Student Standard: ${standard}
- Message/Requirements: ${message ? message : 'No additional message.'}`;

      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/918921399907?text=${encodedText}`;

      // Open in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      contactForm.reset();
    });
  }
});
