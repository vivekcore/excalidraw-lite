"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";

interface ICreateRoom {
  name: string;
}

interface IRooms {
  id: number;
  slug: string;
  name: string;
  createdAt: string;
}

const CreateRoom = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ICreateRoom>();
  const [slug, setSlug] = useState<string | undefined>();
  const [isRoomCreated, setIsRoomCreated] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IRooms[]>([]);
  const [host, setHost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }
    setHost(window.location.host);
  }, [router]);

  const fetchRooms = async () => {
    try {
      const myRoom = await api.get("/room/my-rooms");
      if (myRoom.data?.status === "success") {
        setRooms(myRoom.data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [slug]);

  const onSubmit = async (data: ICreateRoom) => {
    setLoading(true);
    try {
      const response = await api.post("/room/create-room", {
        name: data.name,
      });
      if (response.data?.status === "success") {
        setSlug(response.data?.data?.slug);
        setIsRoomCreated(true);
        reset();
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (textToCopy: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(identifier);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow}></div>

      {/* Header back controls */}
      <div style={styles.headerControls}>
        <button onClick={() => router.push("/room")} className="btn-secondary" style={styles.controlBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Dashboard</span>
        </button>
        <button onClick={() => router.push("/room/join-room")} className="btn-secondary" style={styles.controlBtn}>
          <span>Join Existing Room</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <div style={styles.layout}>
        {/* Creation panel */}
        <section className="glass-card animate-fade-in" style={styles.card}>
          <div>
            <h2 style={styles.title}>Create Workspace</h2>
            <p style={styles.subtitle}>Provision a new room slug for team collaboration</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>Room Display Name</label>
              <input
                type="text"
                id="name"
                defaultValue="Untitled"
                placeholder="Marketing sync, Dev squad..."
                className="glass-input"
                style={styles.input}
                {...register("name", { required: "Room name is required" })}
              />
              {errors.name && <span style={styles.fieldError}>{errors.name.message}</span>}
            </div>

            <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span style={styles.loader}></span>
              ) : (
                <>
                  <span>Create Room</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </>
              )}
            </button>
          </form>

          {isRoomCreated && slug && (
            <div style={styles.createdBox} className="animate-fade-in">
              <div style={styles.successHeading}>
                <span style={styles.successBadge}>✓ Room Created</span>
              </div>
              
              <div style={styles.copyGroup}>
                <div style={styles.copyLabel}>Room ID (Slug)</div>
                <div style={styles.copyRow}>
                  <input type="text" value={slug} readOnly className="glass-input" style={styles.copyInput} />
                  <button 
                    onClick={() => handleCopy(slug, "slug-only")} 
                    className="btn-secondary" 
                    style={styles.copyBtn}
                  >
                    {copiedId === "slug-only" ? "Copied!" : "Copy ID"}
                  </button>
                </div>
              </div>

              <div style={styles.copyGroup}>
                <div style={styles.copyLabel}>Invite Link</div>
                <div style={styles.copyRow}>
                  <input type="text" value={`http://${host}/slug/${slug}`} readOnly className="glass-input" style={styles.copyInput} />
                  <button 
                    onClick={() => handleCopy(`http://${host}/slug/${slug}`, "link-only")} 
                    className="btn-secondary" 
                    style={styles.copyBtn}
                  >
                    {copiedId === "link-only" ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={styles.visitBtn}
                onClick={() => router.push(`/slug/${slug}`)}
              >
                <span>Enter Workspace</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* Existing Rooms List */}
        <section className="glass-card animate-fade-in" style={styles.listCard}>
          <h3 style={styles.listTitle}>Your Active Rooms</h3>
          
          <div style={styles.roomsScroll}>
            {rooms.length === 0 ? (
              <div style={styles.emptyRooms}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p style={styles.emptyText}>You haven&apos;t created any rooms yet. Build one on the left!</p>
              </div>
            ) : (
              <div style={styles.roomsGrid}>
                {rooms.map((val) => (
                  <div key={val.id} style={styles.roomItem} className="glass-card">
                    <div style={styles.roomItemMain}>
                      <div>
                        <h4 style={styles.roomItemName}>{val.name}</h4>
                        <span style={styles.roomItemSlug}>{val.slug}</span>
                      </div>
                      <div style={styles.roomActions}>
                        <button 
                          onClick={() => handleCopy(val.slug, `list-${val.id}`)}
                          className="btn-secondary" 
                          style={styles.actionIconBtn}
                          title="Copy Room Slug"
                        >
                          {copiedId === `list-${val.id}` ? "Copied" : "Copy"}
                        </button>
                        <button 
                          onClick={() => router.push(`/slug/${val.slug}`)} 
                          className="btn-primary" 
                          style={styles.actionIconBtnPrimary}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                    <div style={styles.roomItemMeta}>
                      <span>Created {new Date(val.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles: Record<string, any> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "100px 40px 40px 40px",
    position: "relative",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "rgba(139, 92, 246, 0.08)",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  headerControls: {
    position: "absolute",
    top: "24px",
    left: "40px",
    right: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  controlBtn: {
    padding: "8px 16px",
    fontSize: "0.85rem",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "30px",
    maxWidth: "1100px",
    width: "100%",
    zIndex: 1,
  },
  card: {
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    background: "rgba(255, 255, 255, 0.02)",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "var(--text-secondary)",
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
    height: "48px",
  },
  loader: {
    width: "20px",
    height: "20px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  createdBox: {
    marginTop: "12px",
    padding: "24px",
    background: "rgba(16, 185, 129, 0.04)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  successHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  successBadge: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#34d399",
    background: "rgba(16, 185, 129, 0.12)",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  copyGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  copyLabel: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
  copyRow: {
    display: "flex",
    gap: "10px",
  },
  copyInput: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "0.85rem",
    background: "rgba(0,0,0,0.2)",
  },
  copyBtn: {
    padding: "0 16px",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  visitBtn: {
    width: "100%",
    height: "44px",
    marginTop: "6px",
  },
  listCard: {
    padding: "36px",
    background: "rgba(255, 255, 255, 0.02)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxHeight: "600px",
  },
  listTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#fff",
  },
  roomsScroll: {
    overflowY: "auto",
    flex: 1,
    paddingRight: "4px",
  },
  emptyRooms: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    height: "250px",
    textAlign: "center",
  },
  emptyText: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    maxWidth: "280px",
    lineHeight: "1.5",
  },
  roomsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  roomItem: {
    padding: "18px 20px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "none",
  },
  roomItemMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  roomItemName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "2px",
  },
  roomItemSlug: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  roomActions: {
    display: "flex",
    gap: "8px",
  },
  actionIconBtn: {
    padding: "6px 12px",
    fontSize: "0.78rem",
  },
  actionIconBtnPrimary: {
    padding: "6px 12px",
    fontSize: "0.78rem",
    boxShadow: "none",
  },
  roomItemMeta: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    borderTop: "1px solid rgba(255, 255, 255, 0.03)",
    paddingTop: "6px",
  },
};

export default CreateRoom;
