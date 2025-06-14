import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: "⏱️", title: "Real-time Updates", desc: "Live queue status and wait times" },
    { icon: "👥", title: "Smart Analytics", desc: "Insights to optimize your operations" },
    { icon: "🏢", title: "Multi-location", desc: "Manage queues across all branches" },
    { icon: "⚡", title: "Instant Notifications", desc: "SMS and push notifications for users" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #6411A4FF 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated background elements */}
      <div style={{ position: 'absolute', inset: '0' }}>
        <div
          style={{
            position: 'absolute',
            width: '384px',
            height: '384px',
            background: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '50%',
            filter: 'blur(96px)',
            transition: 'all 1000ms ease-out',
            left: mousePosition.x * 0.02 + 'px',
            top: mousePosition.y * 0.02 + 'px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '256px',
            height: '256px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(96px)',
            transition: 'all 1500ms ease-out',
            right: (typeof window !== 'undefined' ? window.innerWidth - mousePosition.x : 0) * 0.01 + 'px',
            bottom: (typeof window !== 'undefined' ? window.innerHeight - mousePosition.y : 0) * 0.01 + 'px',
          }}
        />
      </div>

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: '0' }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `pulse ${Math.random() * 3 + 2}s infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <header style={{ padding: '24px' }}>
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1152px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                👥
              </div>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>QueueMe</span>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              transition: 'all 1000ms',
              transform: isVisible ? 'translateY(0) ' : 'translateY(40px)',
              opacity: isVisible ? 1 : 0
            }}>
              {/* Logo/Image placeholder */}
              <div style={{ marginBottom: '48px', position: 'relative' }}>
                <div style={{
                  width: '800px',
                  height: '480px',
                  margin: '0 auto',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.5s',
                  cursor: 'pointer'
                }}>
                  <img
                    src="/queue.png"
                    alt="Queue illustration"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      zIndex: 10,
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15)'
                    }}
                  />
                </div>
              </div>

              <h1 style={{
                fontSize: 'clamp(48px, 8vw, 112px)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                lineHeight: '1.1'
              }}>
                Welcome to{' '}
                <span style={{
                  background: 'linear-gradient(to right, #c084fc, #f472b6, #60a5fa)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  animation: 'pulse 2s infinite'
                }}>
                  QueueMe
                </span>
              </h1>

              <p style={{
                fontSize: 'clamp(18px, 3vw, 32px)',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '48px',
                maxWidth: '768px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Revolutionary queue management system for schools, banks, and businesses.
                <span style={{
                  display: 'block',
                  marginTop: '8px',
                  fontSize: 'clamp(16px, 2.5vw, 24px)',
                  color: '#c084fc'
                }}>
                  Eliminate wait times, maximize efficiency, delight customers.
                </span>
              </p>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '64px'
              }}>
                <button
                  style={{
                    position: 'relative',
                    padding: '16px 32px',
                    background: 'linear-gradient(to right, #9333ea, #2563eb)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '16px',
                    border: 'none',
                    transition: 'all 0.3s',
                    transform: 'scale(1)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                  }}
                  onClick={() => navigate("/register")}
                >
                  ✨ Create Account →
                </button>

                <button
                  style={{
                    padding: '16px 32px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s',
                    transform: 'scale(1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login →
                </button>
              </div>

              {/* Features Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                transition: 'all 1000ms',
                transitionDelay: '500ms',
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                opacity: isVisible ? 1 : 0
              }}>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s',
                      transform: 'translateY(0)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'scale(1.05) translateY(-8px)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'scale(1) translateY(0)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      fontSize: '24px',
                      transition: 'transform 0.3s'
                    }}>
                      {feature.icon}
                    </div>
                    <h3 style={{
                      color: 'white',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '18px'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats Section */}
              <div style={{
                marginTop: '80px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '32px',
                transition: 'all 1000ms',
                transitionDelay: '700ms',
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                opacity: isVisible ? 1 : 0
              }}>
                {[
                  { number: "99%", label: "Efficiency Rate" },
                  { number: "24/7", label: "Always Available" },
                  { number: "30%", label: "Reduction in Wait Times" }
                ].map((stat, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 'clamp(32px, 6vw, 64px)',
                      fontWeight: 'bold',
                      background: 'linear-gradient(to right, #c084fc, #60a5fa)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      marginBottom: '8px',
                      transition: 'transform 0.3s',
                      cursor: 'pointer'
                    }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                      {stat.number}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ marginTop: '80px', padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{
            maxWidth: '1152px',
            margin: '0 auto',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            <p>&copy; 2025 QueueMe. Revolutionizing queue management worldwide.</p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

export default Welcome;
