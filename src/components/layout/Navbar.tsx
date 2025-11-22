import { Container } from '../layout/Container';

export const Navbar = () => {
  return (
    <nav style={{
      background: 'linear-gradient(90deg, var(--color-white), var(--color-primary-light))',
      borderBottom: '2px solid var(--color-border)',
      padding: 'var(--space-4) 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(212, 165, 212, 0.2)'
    }}>
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div style={{
            fontFamily: 'var(--font-retro)',
            fontSize: 'var(--font-h3)',
            fontWeight: '400',
            color: 'var(--color-accent)',
            textShadow: '1px 1px 2px rgba(212, 165, 212, 0.3)'
          }}>
            ~dreamy.space~
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6" style={{
            fontSize: 'var(--font-body-m)',
            fontWeight: '500'
          }}>
            <a href="#about" style={{
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-accent)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-button)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
                e.currentTarget.style.textShadow = '0 0 10px var(--color-accent)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-secondary)';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              About
            </a>
            <a href="#projects" style={{
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-accent)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-button)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-tertiary)';
                e.currentTarget.style.textShadow = '0 0 10px var(--color-tertiary)';
                e.currentTarget.style.borderColor = 'var(--color-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-secondary)';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              Projects
            </a>
            <a href="#contact" style={{
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-accent)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-button)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-alt)';
                e.currentTarget.style.textShadow = '0 0 10px var(--color-accent-alt)';
                e.currentTarget.style.borderColor = 'var(--color-accent-alt)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-secondary)';
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              Contact
            </a>
            <a href="/resume.pdf" className="btn-primary" style={{
              marginLeft: 'var(--space-4)',
              fontSize: 'var(--font-caption)'
            }}>
              📄 Resume
            </a>
          </div>
        </div>
      </Container>
    </nav>
  );
};