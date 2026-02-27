import React, { useEffect, useRef, useState } from 'react';
import './Home.css';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const canvasRef = useRef(null);
  const soundRef = useRef(null);
  const touchStart = useRef(0);

  const sections = [
    { id: 'welcome', label: 'Welcome', text: 'We are Nitro Web Studio and we are UI/UX designers' },
    { id: 'why', label: 'Work', text: 'Specialization and our work' },
    { id: 'contact', label: 'Contact', text: 'Contact Us' }
  ];

  const handleStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (soundRef.current) {
        soundRef.current.play().catch(e => console.log("Audio play blocked"));
      }
    }
  };

  const goToSlide = (index) => {
    if (!hasStarted) {
      handleStart();
      return;
    }
    if (index >= 0 && index < sections.length) {
      setCurrentIndex(index);
      if (soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(e => {});
      }
    }
  };

  // Wheel & Touch Listeners
  useEffect(() => {
    const handleWheel = (e) => {
      if (!hasStarted) {
        if (e.deltaY > 0) handleStart();
      } else {
        if (e.deltaY > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, hasStarted]);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;
    
    if (!hasStarted) {
      if (diff > 30) handleStart(); // Swipe up to start
    } else {
      if (diff > 50) goToSlide(currentIndex + 1);
      if (diff < -50) goToSlide(currentIndex - 1);
    }
  };

  // Galaxy Engine (Visuals)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const initGalaxy = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: window.innerWidth < 768 ? 300 : 800 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05,
        blink: Math.random() * 0.02
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = s.opacity;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -20) s.y = canvas.height + 20;
        s.opacity += s.blink;
        if (s.opacity > 1 || s.opacity < 0.2) s.blink = -s.blink;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    initGalaxy();
    draw();
    window.addEventListener('resize', initGalaxy);
    return () => {
      window.removeEventListener('resize', initGalaxy);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className={`home-body ${hasStarted ? 'active' : ''}`} 
      onClick={handleStart}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} id="galaxyCanvas" />

      {/* Landing Hint: only visible BEFORE start */}
      <div className={`landing-hint ${hasStarted ? 'hidden' : ''}`}>
        <i className="fas fa-hand-pointer"></i>
        <span>Scroll or Tap to Enter</span>
      </div>

      <div id="mainLogo" className={hasStarted ? 'collapsed' : ''}>
        NITRO WEB STUDIOS
      </div>

      <div className="content-container" style={{ transform: `translateY(-${currentIndex * 100}vh)` }}>
        {sections.map((sec) => (
          <div key={sec.id} className="section">{sec.text}</div>
        ))}
      </div>

      <div className="navigator">
        {sections.map((sec, i) => (
          <div 
            key={sec.id} 
            className={`nav-item ${currentIndex === i ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
          >
            {sec.label}
          </div>
        ))}
      </div>

      <div className={`contact-icons ${sections[currentIndex].id === 'contact' ? 'show' : ''}`}>
        <div className="contact-block">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-row">
            <i className="fab fa-instagram"></i> Instagram
          </a>
          <a href="mailto:akindu22@gmail.com" className="contact-row">
            <i className="fas fa-envelope"></i> Email Us
          </a>
        </div>
      </div>

      <audio ref={soundRef}>
        <source src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Home;