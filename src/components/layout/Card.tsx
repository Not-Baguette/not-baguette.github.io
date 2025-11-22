import "./Card.css";

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card-container">
    {children}
  </div>
);
