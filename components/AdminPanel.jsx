"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

const C = { erasmus: "#003DA5", green: "#16A34A", red: "#DC2626", border: "#E2E8F0", muted: "#64748B", bg: "#F5F7FA" };

export default function AdminPanel({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => { if (isAdmin) fetchUsers(); }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const updateUser = async (id, updates) => {
    await supabase.from("profiles").update(updates).eq("id", id);
    fetchUsers();
  };

  if (!isAdmin) return null;

  const pending = users.filter(u => !u.approved);
  const approved = users.filter(u => u.approved);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.erasmus }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: 18 }}>👤 Panell d'administrador</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ overflowY: "auto", padding: 24 }}>
          {loading ? <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Carregant...</div> : (
            <>
              {/* Pending */}
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, color: C.red }}>⏳ Sol·licituds pendents ({pending.length})</div>
              {pending.length === 0 && <div style={{ color: C.muted, fontSize: 13, marginBottom: 24, padding: "12px 16px", background: C.bg, borderRadius: 8 }}>Cap sol·licitud pendent ✅</div>}
              {pending.map(u => (
                <div key={u.id} style={{ border: `1.5px solid #FECACA`, borderRadius: 10, padding: "14px 16px", marginBottom: 10, background: "#FEF2F2" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{u.name || "Sense nom"}</div>
                      <div style={{ fontSize: 13, color: C.muted }}>{u.email}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Sol·licitat: {new Date(u.created_at).toLocaleDateString("ca-ES")}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => updateUser(u.id, { approved: true })} style={{ background: C.green, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>✅ Aprovar</button>
                      <button onClick={() => updateUser(u.id, { approved: false, rejected: true })} style={{ background: C.red, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>❌ Rebutjar</button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Approved */}
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, marginTop: 20, color: C.green }}>✅ Usuaris aprovats ({approved.length})</div>
              {approved.map(u => (
                <div key={u.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name || "Sense nom"} {u.role === "admin" ? "👑" : ""}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {u.role !== "admin" && (
                      <button onClick={() => updateUser(u.id, { role: "admin" })} style={{ background: "#7C3AED", color: "white", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Fer admin</button>
                    )}
                    <button onClick={() => updateUser(u.id, { approved: false })} style={{ background: "#F1F5F9", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Revocar accés</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
