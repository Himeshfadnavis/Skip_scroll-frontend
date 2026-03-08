import { useState } from 'react';
import './SecondPage.css';

/* ─────────────────────────────────────────────
   SecondPage — SKIPSCROLL Wizard
   Classic Netflix Red & Black
   ───────────────────────────────────────────── */

const PLATFORMS = [
  { id: 'netflix', name: 'NETFLIX' },
  { id: 'jiohotstar', name: 'JIOHOTSTAR' },
  { id: 'primevideo', name: 'PRIME VIDEO' },
  { id: 'sonyliv', name: 'SONYLIV' },
  { id: 'hbo', name: 'HBO MAX' }
];

const TIME_OPTIONS = [
  { id: 'quick', title: 'Quick Watch (Under 2 Hours)', subtext: 'Standard movies and documentaries.' },
  { id: 'epic', title: 'Epic Journey (2.5+ Hours)', subtext: 'Long films or limited mini-series.' },
  { id: 'binge', title: 'Binge Series (Multi-Episode)', subtext: 'Multiple seasons to get lost in.' }
];

const VIBE_OPTIONS = [
  { id: 'mind_bending', text: 'Mind-Bending & Dark' },
  { id: 'light_switch_off', text: 'Light & Switch-My-Brain-Off' },
  { id: 'high_stakes', text: 'High-Stakes Adrenaline' },
  { id: 'heavy_drama', text: 'Emotional & Heavy' },
  { id: 'horror', text: 'Horror & Suspense' },
  { id: 'cozy', text: 'Cozy & Casual' }
];

const LANGUAGE_OPTIONS = [
  { id: 'hindi', title: 'Hindi', subtext: 'Bollywood & Hindi-Dubbed' },
  { id: 'english', title: 'English', subtext: 'Hollywood & Global Originals' },
  { id: 'any', title: 'Any Language', subtext: 'Show me the best, regardless of language' }
];

function SecondPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 👇 NEW STATE: This holds the 5 movies sent back from Python 👇
  const [results, setResults] = useState([]);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id)
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const submitToBackend = async () => {
    setIsProcessing(true);

    const answers = {
      platforms: selectedPlatforms,
      time: selectedTime,
      vibe: selectedVibe,
      language: selectedLanguage
    };

    console.log("Sending to Python:", answers);

    try {
      // ✅ FIXED: Pointing directly to your live Render backend
      const response = await fetch("https://skip-scroll.onrender.com/api/match-vibe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Python Backend says:", result);

      if (result.status === "success") {
        setResults(result.movies);
        setStep(5);
      } else {
        alert(`Oops! 🎬\n\n${result.message}`);
      }

    } catch (error) {
      console.error("Failed to connect to Python backend:", error);
      alert("Failed to connect to the AI brain. Please check your internet connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="sp-wrapper">
      <div className="sp-bg">
        <div className="sp-circuit" />
        <div className="sp-ambient sp-ambient--tl" />
        <div className="sp-ambient sp-ambient--br" />
        <div className="sp-ambient sp-ambient--c" />
      </div>

      <div className="sp-frame" />

      <nav className="sp-nav">
        <button
          onClick={() => {
            if (isProcessing) return;
            if (step === 5) {
              setStep(4);
              setResults([]);
            }
            else if (step === 4) setStep(3);
            else if (step === 3) setStep(2);
            else if (step === 2) setStep(1);
            else onBack();
          }}
          className="sp-brand"
          aria-label="Go Back"
          style={{ visibility: isProcessing ? 'hidden' : 'visible' }}
        >
          <span className="sp-brand-name">
            <span className="sp-brand-highlight">Skip</span>Scroll
          </span>
        </button>
      </nav>

      <div className="sp-content">

        {/* PROCESSING STATE */}
        {isProcessing && (
          <div className="processing-state">
            <div className="processing-pulse" />
            <h2 className="processing-text">ANALYZING YOUR VIBE...</h2>
          </div>
        )}

        {/* STEP 1: PLATFORMS */}
        {step === 1 && !isProcessing && (
          <>
            <h1 className="sp-headline">
              <span className="sp-line">Step 1: Your Platforms</span>
            </h1>

            <div className="platform-grid">
              {PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    className={`platform-btn ${isSelected ? 'platform-btn--selected' : ''}`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    {platform.name}
                  </button>
                );
              })}
            </div>

            <button
              className="next-step-btn"
              disabled={selectedPlatforms.length === 0}
              onClick={() => setStep(2)}
            >
              NEXT STEP
            </button>
          </>
        )}

        {/* STEP 2: TIME COMMITMENT */}
        {step === 2 && !isProcessing && (
          <>
            <div className="sp-header-wrap">
              <h1 className="sp-headline">
                <span className="sp-line">Step 2: Your Time</span>
              </h1>
              <p className="sp-subhead">How long are we watching?</p>
            </div>

            <div className="time-stack">
              {TIME_OPTIONS.map((time) => {
                const isSelected = selectedTime === time.id;
                return (
                  <button
                    key={time.id}
                    className={`time-card ${isSelected ? 'time-card--selected' : ''}`}
                    onClick={() => setSelectedTime(time.id)}
                  >
                    <div className="time-card-title">{time.title}</div>
                    <div className="time-card-sub">{time.subtext}</div>
                  </button>
                );
              })}
            </div>

            <button
              className="next-step-btn"
              disabled={!selectedTime}
              onClick={() => setStep(3)}
            >
              CHOOSE VIBE
            </button>
          </>
        )}

        {/* STEP 3: THE VIBE */}
        {step === 3 && !isProcessing && (
          <>
            <div className="sp-header-wrap">
              <h1 className="sp-headline">
                <span className="sp-line">Step 3: The Vibe</span>
              </h1>
              <p className="sp-subhead">What are we feeling tonight?</p>
            </div>

            <div className="vibe-grid">
              {VIBE_OPTIONS.map((vibe) => {
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    className={`vibe-card ${isSelected ? 'vibe-card--selected' : ''}`}
                    onClick={() => setSelectedVibe(vibe.id)}
                  >
                    {vibe.text}
                  </button>
                );
              })}
            </div>

            <button
              className="next-step-btn"
              disabled={!selectedVibe}
              onClick={() => setStep(4)}
            >
              NEXT STEP
            </button>
          </>
        )}

        {/* STEP 4: YOUR LANGUAGE */}
        {step === 4 && !isProcessing && (
          <>
            <div className="sp-header-wrap">
              <h1 className="sp-headline">
                <span className="sp-line">Step 4: Your Language</span>
              </h1>
              <p className="sp-subhead">What language are we watching in?</p>
            </div>

            <div className="time-stack">
              {LANGUAGE_OPTIONS.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    className={`time-card ${isSelected ? 'time-card--selected' : ''}`}
                    onClick={() => setSelectedLanguage(lang.id)}
                  >
                    <div className="time-card-title">{lang.title}</div>
                    <div className="time-card-sub">{lang.subtext}</div>
                  </button>
                );
              })}
            </div>

            <button
              className="next-step-btn"
              disabled={!selectedLanguage}
              onClick={submitToBackend}
            >
              GENERATE MATCHES
            </button>
          </>
        )}

        {/* STEP 5 (THE RESULTS PAGE) */}
        {step === 5 && !isProcessing && results.length > 0 && (
          <div className="results-container">
            <h1 className="sp-headline" style={{ marginBottom: '2rem' }}>
              <span className="sp-line">Your Top Matches</span>
            </h1>

            {/* PRIORITY 1: THE HERO MOVIE */}
            <div className="hero-match">
              <div className="hero-rank-badge">#1 MATCH</div>
              <img src={results[0].poster_url} alt={results[0].title} className="hero-poster" />
              <div className="hero-info">
                <h2>{results[0].title}</h2>
                <div className="hero-meta">
                  <span className="match-score">{results[0].rating}% Match</span>
                  <span>• {results[0].release_date?.substring(0, 4)}</span>
                  <span>• {results[0].format_type}</span>
                </div>
                <p className="hero-plot">{results[0].overview}</p>
                <button
                  className="watch-now-btn"
                  onClick={() => window.open(`https://www.google.com/search?q=Watch ${results[0].title} online ${results[0].release_date?.substring(0, 4)}`, '_blank')}
                >
                  WATCH NOW
                </button>
              </div>
            </div>

            {/* PRIORITIES 2 TO 5: THE RUNNERS UP */}
            <h3 className="runners-up-title">Other Great Options</h3>
            <div className="runners-up-grid">
              {results.slice(1).map((movie) => (
                <div key={movie.rank} className="runner-up-card">
                  <div className="runner-up-badge">#{movie.rank}</div>
                  <img src={movie.poster_url} alt={movie.title} />
                  <div className="runner-up-info">
                    <h4>{movie.title}</h4>
                    <span className="small-score">{movie.rating}% Match</span>
                  </div>
                </div>
              ))}
            </div>

            {/* RESET BUTTON */}
            <button
              className="next-step-btn"
              style={{ marginTop: '3rem', background: 'transparent', border: '1px solid #e50914' }}
              onClick={() => {
                setStep(1);
                setResults([]);
                setSelectedPlatforms([]);
                setSelectedTime(null);
                setSelectedVibe(null);
                setSelectedLanguage(null);
              }}
            >
              START OVER
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default SecondPage;