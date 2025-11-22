import { Container } from '../layout/Container';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "var(--color-secondary)",
      color: "var(--color-white)",
      padding: "var(--space-8) 0"
    }}>
      <Container>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-4)"
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--font-h3)",
              fontWeight: "700",
              marginBottom: "var(--space-2)"
            }}>
              Sarah Johnson
            </div>
            <p className="caption" style={{
              color: "rgba(255, 255, 255, 0.7)"
            }}>
              Frontend Developer & UI Designer
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: "var(--space-6)",
            alignItems: "center"
          }}>
            <a 
              href="#about" 
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontSize: "var(--font-caption)",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)"}
            >
              About
            </a>
            <a 
              href="#projects" 
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontSize: "var(--font-caption)",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)"}
            >
              Projects
            </a>
            <a 
              href="#contact" 
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontSize: "var(--font-caption)",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)"}
            >
              Contact
            </a>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          marginTop: "var(--space-8)",
          paddingTop: "var(--space-8)",
          textAlign: "center"
        }}>
          <p className="caption" style={{
            color: "rgba(255, 255, 255, 0.6)"
          }}>
            © 2024 Sarah Johnson. All rights reserved. Built with React & TypeScript.
          </p>
        </div>
      </Container>
    </footer>
  );
};