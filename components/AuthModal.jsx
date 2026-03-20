"use client";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const C = {
  erasmus: "#003DA5",
  erasmusLight: "#E8F0FB",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
  green: "#16A34A",
  red: "#DC2626",
};

const DEFAULT_PASSWORD = "Sanfrancisco2026";
const INVITE_CODE = "Serrallarga2026";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // login | register | pending
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async () => {
    setLoading(true); setError("");
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError("Credencials incorrectes. Comprova l'email i la contrasenya.");
    else onClose();
  };

  const handleRegister = async () => {
    if (!name.trim()) { setError("Introdueix el teu nom."); return; }
    if (!email.trim()) { setError("Introdueix el teu email."); return; }
    if (inviteCode !== INVITE_CODE) { setError("Codi d'invitació incorrecte. Contacta amb mgar2373@xtec.cat per obtenir-lo."); return; }
    setLoading(true); setError("");
    // Registre sempre amb la contrasenya per defecte
    const err = await signUp(email, DEFAULT_PASSWORD, name);
    setLoading(false);
    if (err) setError(err.message);
    else setMode("pending");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: C.erasmus, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24, fontWeight: 900, color: "white", fontFamily: "serif" }}>E+</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
            {mode === "login" && "Iniciar sessió"}
            {mode === "register" && "Sol·licitar accés"}
            {mode === "pending" && "Sol·licitud enviada ✅"}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Mobilitat San Francisco 25-26</div>
        </div>

        {mode === "pending" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
              La teva sol·licitud ha estat enviada a l'administradora.<br/>
              Quan siguis aprovat/da, podràs entrar amb:
            </div>
            <div style={{ background: C.erasmusLight, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13 }}>
              <div><strong>Email:</strong> {email}</div>
              <div><strong>Contrasenya:</strong> Sanfrancisco2026</div>
            </div>
            <button onClick={onClose} style={{ background: C.erasmus, color: "white", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>Tancar</button>
          </div>
        ) : (
          <>
            {mode === "register" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Nom complet</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Èrika Ramón Larios" style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nom@exemple.com" style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            {mode === "login" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Contrasenya</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sanfrancisco2026" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            )}
            {mode === "register" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>🔑 Codi d'invitació</label>
                <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Demana'l a l'administradora" onKeyDown={e => e.key === "Enter" && handleRegister()} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Contacta amb mgar2373@xtec.cat per obtenir el codi.</div>
              </div>
            )}

            {error && <div style={{ background: "#FEF2F2", border: `1px solid #FECACA`, borderRadius: 8, padding: "10px 14px", color: C.red, fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading} style={{ width: "100%", background: C.erasmus, color: "white", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit", marginBottom: 14 }}>
              {loading ? "..." : mode === "login" ? "Entrar" : "Sol·licitar accés"}
            </button>

            {mode === "login" && (
              <div style={{ background: C.erasmusLight, borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: C.muted, textAlign: "center" }}>
                💡 Contrasenya per defecte: <strong style={{ color: C.erasmus }}>Sanfrancisco2026</strong>
              </div>
            )}

            <div style={{ textAlign: "center", fontSize: 13, color: C.muted }}>
              {mode === "login" ? (
                <>No tens accés? <button onClick={() => { setMode("register"); setError(""); }} style={{ background: "none", border: "none", color: C.erasmus, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Sol·licitar-lo aquí</button></>
              ) : (
                <>Ja tens compte? <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: C.erasmus, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>Inicia sessió</button></>
              )}
            </div>

            <button onClick={onClose} style={{ display: "block", width: "100%", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12, marginTop: 12, fontFamily: "inherit" }}>Continuar sense iniciar sessió (només lectura)</button>
          </>
        )}
      </div>
    </div>
  );
}
