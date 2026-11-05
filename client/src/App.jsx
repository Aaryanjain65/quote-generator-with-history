import { useState } from "react";
import "./App.css";

function App() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/quotes/random"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Unable to fetch quote");
      }

      setQuote(data.quote);
    } catch (error) {
      setMessage("Unable to fetch quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyQuote = async () => {
    if (!quote) return;

    await navigator.clipboard.writeText(
      `"${quote.text}" - ${quote.author}`
    );

    setMessage("Quote copied successfully!");
  };

  return (
    <div className="app">
      <header className="navbar">
        <h2>Quote Generator</h2>
        <span>Inspiration for Every Day</span>
      </header>

      <main className="main-content">
        <section className="quote-card">
          <p className="tagline">YOUR DAILY DOSE OF INSPIRATION</p>

          <h1>Words That Inspire</h1>

          <p className="description">
            Discover meaningful quotes and save your favorites.
          </p>

          <div className="quote-box">
            {quote ? (
              <>
                <h2>"{quote.text}"</h2>
                <p className="author">— {quote.author}</p>
              </>
            ) : (
              <h2>Your next inspiration is waiting.</h2>
            )}
          </div>

          <div className="actions">
            <button onClick={fetchQuote} disabled={loading}>
              {loading ? "Loading..." : "Generate Quote"}
            </button>

            <button
              className="secondary-button"
              onClick={copyQuote}
              disabled={!quote}
            >
              Copy Quote
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </section>
      </main>

      <footer>
        <p>Quote Generator | Built with React, Node.js and SQLite</p>
      </footer>
    </div>
  );
}

export default App;