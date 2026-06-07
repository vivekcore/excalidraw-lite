"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";

interface Ifeildvalues {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Ifeildvalues>();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Ifeildvalues> = async (data) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.post("/user/signup", data);
      
      if (response.status === 200) {
        if (response.data?.status === "success") {
          setSuccess(true);
          reset();
          // Auto redirect after 3 seconds
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 2500);
        } else {
          setErrorMessage(response.data?.message || "Sign up failed. Please check inputs.");
        }
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 
        "Failed to register user. Email might already be taken."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow}></div>
      
      {!success && (
        <button 
          onClick={() => router.push("/")} 
          className="btn-secondary" 
          style={styles.backButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Home</span>
        </button>
      )}

      <div className="glass-card animate-fade-in" style={styles.card}>
        {success ? (
          <div style={styles.successContainer} className="animate-fade-in">
            <div style={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={styles.title}>Registration Complete</h2>
            <p style={styles.successText}>
              Your account has been successfully created. Redirecting to the sign-in portal...
            </p>
            <button 
              className="btn-primary" 
              style={{ width: "100%" }} 
              onClick={() => router.push("/auth/sign-in")}
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>Create Account</h2>
              <p style={styles.subtitle}>Get started with your collaborative workspaces</p>
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
                <label htmlFor="name" style={styles.label}>Your Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="glass-input"
                  style={styles.input}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span style={styles.fieldError}>{errors.name.message}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@domain.com"
                  className="glass-input"
                  style={styles.input}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <span style={styles.fieldError}>{errors.email.message}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="glass-input"
                  style={styles.input}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
              </div>

              <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <span style={styles.loader}></span>
                ) : (
                  <>
                    <span>Register Account</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div style={styles.footer}>
              <span style={styles.footerText}>Already have an account? </span>
              <button onClick={() => router.push("/auth/sign-in")} style={styles.linkBtn}>
                Sign In
              </button>
            </div>
          </>
        )}
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
    background: "rgba(6, 182, 212, 0.12)",
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
    paddingLeft: "2px",
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
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "18px",
    padding: "10px 0",
  },
  successIcon: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "50%",
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#34d399",
    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.2)",
    marginBottom: "8px",
  },
  successText: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    marginBottom: "10px",
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

export default SignUp;
