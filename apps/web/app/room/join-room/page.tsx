"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";

const JoinRoom = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ slug: string }>();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }
  }, [router]);

  const onSubmit = async (data: { slug: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get(`/room/slug/${data.slug}`);

      if (response.status === 200 && response.data?.status === "success") {
        if (response.data?.data) {
          router.push(`/slug/${data.slug}`);
        } else {
          setErrorMessage("No room found with that slug ID. Please check the spelling.");
        }
      } else {
        setErrorMessage("Invalid slug or request failed.");
      }
    } catch (error :any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || 
        "Room search failed. Make sure the room ID is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow}></div>

      {/* Header Back Controls */}
      <button 
        onClick={() => router.push("/room")} 
        className="btn-secondary" 
        style={styles.backButton}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Dashboard</span>
      </button>

      <div className="glass-card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Join Workspace</h2>
          <p style={styles.subtitle}>Enter a room ID slug to connect to a live room</p>
        </div>

        {errorMessage && (
          <div style={styles.errorBox} className="animate-fade-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="slug" style={styles.label}>Room ID / Slug</label>
            <input
              type="text"
              id="slug"
              placeholder="e.g. room-slug-name-here"
              className="glass-input"
              style={styles.input}
              {...register("slug", { required: "Room ID is required" })}
            />
            {errors.slug && <span style={styles.fieldError}>{errors.slug.message}</span>}
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loader}></span>
            ) : (
              <>
                <span>Connect to Room</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Need to set up a new room? </span>
          <button onClick={() => router.push("/room/create-room")} style={styles.linkBtn}>
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

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
  glow: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background: "rgba(6, 182, 212, 0.1)",
    filter: "blur(100px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  backButton: {
    position: "absolute",
    top: "24px",
    left: "24px",
    padding: "10px 16px",
    fontSize: "0.85rem",
    zIndex: 2,
  },
  card: {
    maxWidth: "420px",
    width: "100%",
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    zIndex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "var(--text-secondary)",
  },
  errorBox: {
    background: "rgba(244, 63, 94, 0.1)",
    border: "1px solid rgba(244, 63, 94, 0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fda4af",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    lineHeight: "1.4",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--text-primary)",
    paddingLeft: "2px",
  },
  input: {
    width: "100%",
  },
  fieldError: {
    fontSize: "0.78rem",
    color: "#f43f5e",
    marginTop: "2px",
  },
  submitBtn: {
    width: "100%",
    marginTop: "8px",
    height: "50px",
  },
  loader: {
    width: "20px",
    height: "20px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
  footer: {
    textAlign: "center",
    fontSize: "0.85rem",
    marginTop: "8px",
  },
  footerText: {
    color: "var(--text-secondary)",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
    fontFamily: "inherit",
    textDecoration: "underline",
  },
};

export default JoinRoom;
