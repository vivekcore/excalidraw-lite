"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "../../utils/axiox";

interface IUser {
  id: string;
  name: string;
  email: string;
}

const RoomDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        if (response.status === 200 && response.data?.status === "success") {
          setUser(response.data.data);
        } else {
          // Token expired or invalid
          localStorage.removeItem("token");
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        localStorage.removeItem("token");
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Force reload to trigger clean memory state as per security guidelines
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <span style={styles.loader}></span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      <div style={styles.topBar}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div style={styles.userName}>{user?.name || "User"}</div>
            <div style={styles.userEmail}>{user?.email || "No email"}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={styles.logoutBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Log Out</span>
        </button>
      </div>

      <main className="glass-card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Workspace Hub</h2>
          <p style={styles.subtitle}>Select an action to launch or join collaborative rooms</p>
        </div>

        <div style={styles.grid}>
          <div 
            style={styles.gridCard} 
            className="glass-card" 
            onClick={() => router.push("/room/create-room")}
          >
            <div style={styles.cardIconZone(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div>
              <h3 style={styles.gridCardTitle}>Create Room</h3>
              <p style={styles.gridCardDesc}>Set up a brand new chat room and invite others using a unique URL slug.</p>
            </div>
            <button className="btn-primary" style={styles.gridCardBtn}>Create Room</button>
          </div>

          <div 
            style={styles.gridCard} 
            className="glass-card" 
            onClick={() => router.push("/room/join-room")}
          >
            <div style={styles.cardIconZone(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <div>
              <h3 style={styles.gridCardTitle}>Join Room</h3>
              <p style={styles.gridCardDesc}>Enter an existing room slug ID to join live group conversations.</p>
            </div>
            <button className="btn-secondary" style={styles.gridCardBtn}>Join Room</button>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, any> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
  },
  glow1: {
    position: "absolute",
    top: "10%",
    left: "20%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(139, 92, 246, 0.12)",
    filter: "blur(100px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    bottom: "10%",
    right: "20%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(6, 182, 212, 0.1)",
    filter: "blur(100px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  topBar: {
    position: "absolute",
    top: "24px",
    left: "24px",
    right: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "var(--primary-gradient)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1.1rem",
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
  },
  userName: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#fff",
  },
  userEmail: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
  },
  logoutBtn: {
    padding: "8px 16px",
    fontSize: "0.85rem",
  },
  card: {
    maxWidth: "800px",
    width: "100%",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "36px",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "12px",
  },
  gridCard: {
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255, 255, 255, 0.02)",
  },
  cardIconZone: (isPrimary: boolean) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: isPrimary ? "rgba(139, 92, 246, 0.15)" : "rgba(6, 182, 212, 0.15)",
    border: isPrimary ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid rgba(6, 182, 212, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isPrimary ? "#c084fc" : "#22d3ee",
  }),
  gridCardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "6px",
  },
  gridCardDesc: {
    fontSize: "0.88rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
    minHeight: "66px",
  },
  gridCardBtn: {
    width: "100%",
    marginTop: "auto",
  },
  loader: {
    width: "32px",
    height: "32px",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTopColor: "var(--accent-primary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default RoomDashboard;
