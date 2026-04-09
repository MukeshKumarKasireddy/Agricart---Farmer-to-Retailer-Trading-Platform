import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import heroBg from "../assets/landing-page.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing">

      {/* SECTION 1: HERO */}
      <section className="hero">
        <div
          className="hero-card"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="hero-overlay">
            <h1 className="hero-title">Agricart</h1>
            <p className="hero-subtitle">
              Agricart connects farmers and retailers on a single digital platform for transparent and efficient agricultural trade. It simplifies product management, pricing, and direct transactions without intermediaries.
            </p>

            <div className="hero-actions">
              <span
                className="login-text"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY AGRICART */}
      <section className="section">
        <h2>Why Agricart?</h2>
        <div className="features">
          <div className="feature-card">
            <h4>Fragmented Market</h4>
            <p>
              Farmers and retailers lack a direct, reliable trading platform.
            </p>
          </div>
          <div className="feature-card">
            <h4>Lack of Transparency</h4>
            <p>
              Pricing and availability are often unclear and inconsistent.
            </p>
          </div>
          <div className="feature-card">
            <h4>Inefficient Communication</h4>
            <p>
              Dependence on intermediaries slows down the trade process.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="section light">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Farmers add and manage their products</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>Retailers browse available products</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Direct trade with clarity and efficiency</p>
          </div>
        </div>
      </section>

{/* SECTION: CUSTOMER REVIEWS */}
<section className="section reviews">
  <h2>What Our Users Say</h2>

  <div className="review-cards">
    <div className="review-card">
      <p>
        “Agricart helped me sell my produce directly to retailers without
        middlemen. Pricing is fair and transparent.”
      </p>

      <div className="review-stars">★★★★★</div>
      <h4>Ramesh, Farmer</h4>
    </div>

    <div className="review-card">
      <p>
        “Finding reliable farmers is now easy. The platform saves time and
        improves communication.”
      </p>

      <div className="review-stars">★★★★☆</div>
      <h4>Anjali, Retailer</h4>
    </div>

    <div className="review-card">
      <p>
        “Simple interface, clear pricing, and smooth transactions. Exactly
        what agriculture needed.”
      </p>

      <div className="review-stars">★★★★★</div>
      <h4>Suresh, Retailer</h4>
    </div>
  </div>
</section>

      {/* SECTION 4: CTA */}
      <section className="cta-section">
        <h2>Start using Agricart today</h2>
        <button className="cta-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </section>

    </div>
  );
};

export default LandingPage;
