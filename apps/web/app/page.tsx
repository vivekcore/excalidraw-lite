"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      {/* Decorative ambient glowing backdrops */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      <main className="glass-card animate-fade-in" style={styles.card}>
        <div style={styles.headerZone}>
          <div style={styles.logoBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h1 style={styles.title} className="glow-text">ConvoSpace</h1>
          <p style={styles.subtitle}>
            A real-time workspace for collaborative discussions and encrypted communication.
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>⚡</div>
            <div>
              <h4 style={styles.featureTitle}>Real-time WebSocket connection</h4>
              <p style={styles.featureDesc}>Instantaneous low-latency message streaming.</p>
            </div>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>🔒</div>
            <div>
              <h4 style={styles.featureTitle}>Persistent Rooms</h4>
              <p style={styles.featureDesc}>Secure room storage with dedicated administration controls.</p>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            className="btn-primary"
            style={styles.actionBtn}
            onClick={() => router.push("/auth/sign-in")}
          >
            <span>Sign In to Workspace</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button
            className="btn-secondary"
            style={styles.actionBtn}
            onClick={() => router.push("/auth/sign-up")}
          >
            Create New Account
          </button>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
  },
  glow1: {
    position: "absolute",
    top: "20%",
    left: "15%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(139, 92, 246, 0.2)",
    filter: "blur(80px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    bottom: "20%",
    right: "15%",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "rgba(6, 182, 212, 0.15)",
    filter: "blur(90px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    zIndex: 1,
    textAlign: "center",
  },
  headerZone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  logoBadge: {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    borderRadius: "16px",
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#a78bfa",
    marginBottom: "8px",
    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.2)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    letterSpacing: "-0.025em",
    background: "linear-gradient(to right, #ffffff, #c084fc, #67e8f9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    textAlign: "left",
    background: "rgba(0, 0, 0, 0.2)",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.03)",
  },
  featureItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  featureIcon: {
    fontSize: "1.2rem",
    marginTop: "2px",
  },
  featureTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "2px",
  },
  featureDesc: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  actionBtn: {
    width: "100%",
  },
};
