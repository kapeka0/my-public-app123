"use client"
import { useEffect, useState, useRef } from "react";

export default function FrameReadyEmitter() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);
  const [intervalMs, setIntervalMs] = useState(100);
  const intervalRef = useRef(null);

  const message = { __v0_remote__: 1, type: "frame_ready" };

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      try {
        window.parent.postMessage(message, "*");
        setCount((c) => c + 1);
      } catch (e) {
        console.error("postMessage failed:", e);
      }
    };

    // Emitir inmediatamente y luego en intervalos
    tick();
    intervalRef.current = setInterval(tick, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, intervalMs]);

  return (
    <div
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        padding: "24px",
        maxWidth: "560px",
        margin: "40px auto",
        background: "#0b0b0f",
        color: "#e6e6e6",
        borderRadius: "12px",
        border: "1px solid #2a2a35",
      }}
    >
      <h1 style={{ fontSize: "18px", marginTop: 0, marginBottom: "8px" }}>
        frame_ready emitter
      </h1>
      <p style={{ fontSize: "13px", color: "#9a9aa6", marginTop: 0 }}>
        Enviando <code>{`{__v0_remote__:1, type:'frame_ready'}`}</code> a{" "}
        <code>window.parent</code>.
      </p>

      <div
        style={{
          background: "#15151c",
          padding: "12px 16px",
          borderRadius: "8px",
          margin: "16px 0",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        <div>
          Estado:{" "}
          <span style={{ color: running ? "#4ade80" : "#f87171" }}>
            {running ? "● emitiendo" : "○ detenido"}
          </span>
        </div>
        <div>Intervalo: {intervalMs} ms</div>
        <div>Mensajes enviados: {count}</div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => setRunning((r) => !r)}
          style={btnStyle(running ? "#f87171" : "#4ade80")}
        >
          {running ? "Detener" : "Iniciar"}
        </button>
        <button onClick={() => setCount(0)} style={btnStyle("#60a5fa")}>
          Reset contador
        </button>
        <select
          value={intervalMs}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            background: "#15151c",
            color: "#e6e6e6",
            border: "1px solid #2a2a35",
          }}
        >
          <option value={50}>50 ms</option>
          <option value={100}>100 ms</option>
          <option value={250}>250 ms</option>
          <option value={500}>500 ms</option>
          <option value={1000}>1000 ms</option>
        </select>
      </div>
    </div>
  );
}

function btnStyle(color) {
  return {
    padding: "6px 14px",
    borderRadius: "6px",
    background: "transparent",
    color,
    border: `1px solid ${color}`,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
  };
}