"use client";

import { useState, useRef, useEffect } from "react";
import { Termo, fuentes } from "@/lib/products";
import { useCarrito } from "@/context/CarritoContext";

type ModoPersonalizacion = "texto" | "logo" | "ambos";
type PosLibre = { x: number; y: number; rot: number };
const POS_INICIAL: PosLibre = { x: 50, y: 50, rot: 0 };

const MODOS: { id: ModoPersonalizacion; nombre: string }[] = [
  { id: "texto", nombre: "Texto" },
  { id: "logo", nombre: "Imagen" },
  { id: "ambos", nombre: "Ambos" },
];

const NIVELES_ZOOM = [
  { valor: 1, etiqueta: "1×" },
  { valor: 2.2, etiqueta: "🔍 2×" },
  { valor: 4, etiqueta: "🔎 4×" },
];

const PASOS = ["Termo", "Color", "Personaliza", "Revisa"];

export default function Personalizador({ termos }: { termos: Termo[] }) {
  const { agregarItem } = useCarrito();

  const [productoIdx, setProductoIdx] = useState(0);
  const producto = termos[productoIdx];
  const [colorIdx, setColorIdx] = useState(0);
  const color = producto.colores[colorIdx];

  const [modo, setModo] = useState<ModoPersonalizacion>("texto");
  const [texto, setTexto] = useState("Christian");
  const [fuenteId, setFuenteId] = useState(fuentes[0].id);
  const fuente = fuentes.find((f) => f.id === fuenteId)!;

  const [tamanoTexto, setTamanoTexto] = useState(50);
  const [tamanoLogo, setTamanoLogo] = useState(50);
  const [posTexto, setPosTexto] = useState<PosLibre>(POS_INICIAL);
  const [posLogo, setPosLogo] = useState<PosLibre>(POS_INICIAL);
  const [zoom, setZoom] = useState(1);
  const [cantidad, setCantidad] = useState(1);
  const [pasoIdx, setPasoIdx] = useState(0);

  const [logo, setLogo] = useState<string | null>(null);
  const [logoRaw, setLogoRaw] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [procesandoLogo, setProcesandoLogo] = useState(false);
  const [logoInvertido, setLogoInvertido] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  const zonaRef = useRef<HTMLDivElement>(null);
  const arrastrando = useRef<"texto" | "logo" | null>(null);

  const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/svg+xml"];
  const TAMANO_MAX_MB = 5;

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 3800);
      return () => clearTimeout(t);
    }
  }, [error]);

  function avanzarPasoSiCorresponde(minimo: number) {
    setPasoIdx((p) => (p < minimo ? minimo : p));
  }

  function iniciarArrastre(elemento: "texto" | "logo") {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      arrastrando.current = elemento;
      const mover = (ev: PointerEvent) => {
        if (!arrastrando.current || !zonaRef.current) return;
        const rect = zonaRef.current.getBoundingClientRect();
        let xPct = ((ev.clientX - rect.left) / rect.width) * 100;
        let yPct = ((ev.clientY - rect.top) / rect.height) * 100;
        xPct = Math.min(100, Math.max(0, xPct));
        yPct = Math.min(100, Math.max(0, yPct));
        if (arrastrando.current === "texto") setPosTexto((p) => ({ ...p, x: xPct, y: yPct }));
        else setPosLogo((p) => ({ ...p, x: xPct, y: yPct }));
      };
      const soltar = () => {
        arrastrando.current = null;
        window.removeEventListener("pointermove", mover);
        window.removeEventListener("pointerup", soltar);
      };
      window.addEventListener("pointermove", mover);
      window.addEventListener("pointerup", soltar);
    };
  }

  function rotar(elemento: "texto" | "logo") {
    const ciclo = [0, -90, 90];
    if (elemento === "texto") setPosTexto((p) => ({ ...p, rot: ciclo[(ciclo.indexOf(p.rot) + 1) % 3] }));
    else setPosLogo((p) => ({ ...p, rot: ciclo[(ciclo.indexOf(p.rot) + 1) % 3] }));
  }

  function vectorizarLogo(dataUrl: string, invertir: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 500;
        const escala = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * escala));
        const h = Math.max(1, Math.round(img.height * escala));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas no disponible"));
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        let suma = 0;
        let cuenta = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) continue;
          suma += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          cuenta++;
        }
        const umbral = cuenta ? suma / cuenta : 128;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) continue;
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          let esTrazo = lum < umbral;
          if (invertir) esTrazo = !esTrazo;
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = esTrazo ? 255 : 0;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("No se pudo procesar la imagen"));
      img.src = dataUrl;
    });
  }

  async function manejarSubidaLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setLogoError(null);
    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      setLogoError("Formato no permitido. Usa PNG, JPG o SVG.");
      return;
    }
    if (archivo.size > TAMANO_MAX_MB * 1024 * 1024) {
      setLogoError(`El archivo pesa demasiado (máx. ${TAMANO_MAX_MB}MB).`);
      return;
    }
    const lector = new FileReader();
    lector.onload = async () => {
      const dataUrl = lector.result as string;
      setLogoRaw(dataUrl);
      setPosLogo(POS_INICIAL);
      setProcesandoLogo(true);
      try {
        const stencil = await vectorizarLogo(dataUrl, logoInvertido);
        setLogo(stencil);
        avanzarPasoSiCorresponde(2);
      } catch {
        setLogoError("No se pudo procesar la imagen, intenta con otra.");
      } finally {
        setProcesandoLogo(false);
      }
    };
    lector.onerror = () => setLogoError("No se pudo leer el archivo, intenta de nuevo.");
    lector.readAsDataURL(archivo);
  }

  async function alternarInversion() {
    if (!logoRaw) return;
    setProcesandoLogo(true);
    try {
      const nuevoInvertido = !logoInvertido;
      const stencil = await vectorizarLogo(logoRaw, nuevoInvertido);
      setLogo(stencil);
      setLogoInvertido(nuevoInvertido);
    } catch {
      setLogoError("No se pudo procesar la imagen.");
    } finally {
      setProcesandoLogo(false);
    }
  }

  const fontSizePx = 8 + (tamanoTexto / 100) * 80;
  const logoTamanoPct = 15 + (tamanoLogo / 100) * 125;
  const centroZonaX = producto.zonaGrabado.left + (producto.zonaGrabado.right - producto.zonaGrabado.left) / 2;
  const centroZonaY = producto.zonaGrabado.top + (producto.zonaGrabado.bottom - producto.zonaGrabado.top) / 2;

  const precioUnitario = producto.desde;
  const total = precioUnitario * cantidad;

  function personalizacionResumen() {
    if (modo === "texto") return texto.trim() || "(sin texto)";
    if (modo === "logo") return logo ? "(imagen subida)" : "(sin imagen)";
    return `${texto.trim() || "(sin texto)"} + ${logo ? "imagen" : "(sin imagen)"}`;
  }

  function validarYAgregar() {
    if (!color) {
      setError("Selecciona un color antes de continuar.");
      return;
    }
    if ((modo === "texto" || modo === "ambos") && !texto.trim()) {
      setError("Escribe un texto o cambia a la opción de imagen.");
      return;
    }
    if ((modo === "logo" || modo === "ambos") && !logo) {
      setError("Sube una imagen o cambia a la opción de texto.");
      return;
    }
    for (let i = 0; i < cantidad; i++) {
      agregarItem({
        productoSlug: producto.slug,
        productoNombre: producto.nombre,
        precioUnitario: producto.desde,
        colorNombre: color.nombre,
        colorHex: color.hex,
        texto: modo === "logo" ? "(logo)" : texto || "(sin texto)",
        fuenteNombre: fuente.nombre,
        posicion: `texto x:${Math.round(posTexto.x)}% y:${Math.round(posTexto.y)}% rot:${posTexto.rot}° tam:${tamanoTexto} · logo x:${Math.round(posLogo.x)}% y:${Math.round(posLogo.y)}% rot:${posLogo.rot}° tam:${tamanoLogo}`,
        tamano: modo === "logo" ? tamanoLogo : tamanoTexto,
      });
    }
    setError(null);
    setConfirmado(true);
    setPasoIdx(3);
    setTimeout(() => setConfirmado(false), 3000);
  }

  const mostrarTexto = modo === "texto" || modo === "ambos";
  const mostrarLogo = modo === "logo" || modo === "ambos";

  return (
    <div>
      {/* ===== Barra de pasos ===== */}
      <div className="sticky top-0 z-40 bg-hueso/90 backdrop-blur-sm border-b border-grafito/10 py-3.5 mb-2">
        <div className="max-w-md mx-auto flex items-center justify-center px-4">
          {PASOS.map((p, i) => (
            <div key={p} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 transition-colors ${
                    i === pasoIdx
                      ? "bg-cobre text-white"
                      : i < pasoIdx
                      ? "bg-grafito text-cobre"
                      : "bg-grafito/10 text-grafito/40"
                  }`}
                >
                  {i < pasoIdx ? "✓" : i + 1}
                </span>
                <span className={`text-[11.5px] font-bold hidden sm:inline ${i === pasoIdx ? "text-grafito" : "text-grafito/35"}`}>
                  {p}
                </span>
              </div>
              {i < PASOS.length - 1 && <div className="flex-1 h-px bg-grafito/10 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[58%_42%] gap-0 pb-24 md:pb-10">
        {/* ===== IZQUIERDA: preview ===== */}
        <div className="md:sticky md:top-20 md:self-start px-0 md:px-6 pb-6">
          <div
            className="rounded-2xl border border-grafito/10 p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(180deg,#ffffff 0%, #f3f2ef 100%)" }}
          >
            <div className="flex items-center justify-between mb-1.5 relative z-30">
              <span className="text-[11px] uppercase tracking-widest text-cobre-dim font-extrabold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cobre" />
                {modo === "texto" && "Ajustando: texto"}
                {modo === "logo" && "Ajustando: imagen"}
                {modo === "ambos" && "Ajustando: texto + imagen"}
              </span>
              <div className="flex gap-[3px] bg-white border border-grafito/10 rounded-full p-[3px]">
                {NIVELES_ZOOM.map((n) => (
                  <button
                    key={n.valor}
                    onClick={() => setZoom(n.valor)}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-extrabold transition-colors ${
                      zoom === n.valor ? "bg-cobre text-white" : "text-grafito/45 hover:text-grafito"
                    }`}
                  >
                    {n.etiqueta}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-square w-full max-w-[520px] mx-auto mt-3.5 mb-1.5 overflow-hidden rounded-xl">
              <div
                className="absolute left-[8%] right-[8%] bottom-[4%] h-[14%] z-0"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(26,26,26,.16) 0%, rgba(26,26,26,0) 72%)",
                  filter: "blur(2px)",
                }}
              />
              <div
                className="absolute inset-[6%] z-[1] transition-transform duration-300"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: `${centroZonaX}% ${centroZonaY}%`,
                }}
              >
                {color?.imagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={color.imagenUrl}
                    alt={`${producto.nombre} — ${color.nombre}`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    style={{ filter: "drop-shadow(0 18px 22px rgba(26,26,26,.15))" }}
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-[10%]" style={{ background: color?.hex }} />
                )}

                <div
                  ref={zonaRef}
                  className="absolute touch-none"
                  style={{
                    top: `${producto.zonaGrabado.top}%`,
                    bottom: `${100 - producto.zonaGrabado.bottom}%`,
                    left: `${producto.zonaGrabado.left}%`,
                    right: `${100 - producto.zonaGrabado.right}%`,
                  }}
                >
                  {mostrarTexto && (
                    <div
                      onPointerDown={iniciarArrastre("texto")}
                      className="absolute text-center px-1 leading-tight cursor-grab active:cursor-grabbing select-none touch-none"
                      style={{
                        top: `${posTexto.y}%`,
                        left: `${posTexto.x}%`,
                        transform: `translate(-50%, -50%) rotate(${posTexto.rot}deg)`,
                        whiteSpace: posTexto.rot !== 0 ? "nowrap" : "normal",
                        maxWidth: posTexto.rot !== 0 ? "none" : "96%",
                        fontFamily: fuente.cssFamily,
                        fontSize: `${fontSizePx}px`,
                        letterSpacing: "0.02em",
                        color: "#E9EBEE",
                        textShadow:
                          "0 0 6px rgba(255,255,255,0.55), 0 1px 1px rgba(0,0,0,0.45), 0 -0.5px 0 rgba(255,255,255,0.4)",
                      }}
                    >
                      {texto || "Tu texto"}
                    </div>
                  )}

                  {mostrarLogo && logo && (
                    <div
                      onPointerDown={iniciarArrastre("logo")}
                      className="absolute cursor-grab active:cursor-grabbing select-none touch-none"
                      style={{
                        top: `${posLogo.y}%`,
                        left: `${posLogo.x}%`,
                        width: `${logoTamanoPct}%`,
                        aspectRatio: "1 / 1",
                        transform: `translate(-50%, -50%) rotate(${posLogo.rot}deg)`,
                        backgroundColor: "#E9EBEE",
                        filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5)) drop-shadow(0 1px 1px rgba(0,0,0,0.4))",
                        WebkitMaskImage: `url(${logo})`,
                        maskImage: `url(${logo})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <p className="text-center text-[11.5px] text-grafito/35 mt-2">Grabado láser · personalización premium</p>
          </div>
          <p className="text-center text-xs text-grafito/45 mt-3.5 flex items-center justify-center gap-4 flex-wrap">
            <span>✓ Visualiza tu diseño antes de comprar</span>
            <span>✓ Grabado láser real</span>
          </p>
        </div>

        {/* ===== DERECHA: pasos de configuración ===== */}
        <div className="px-0 md:px-6 pb-10">
          {/* 1. Termo */}
          <div className="py-6 border-b border-grafito/10">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="font-display text-sm text-cobre font-semibold">01</span>
              <h2 className="font-display text-lg font-medium">Elige tu termo</h2>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {termos.map((t, i) => (
                <button
                  key={t.slug}
                  onClick={() => {
                    setProductoIdx(i);
                    setColorIdx(0);
                    avanzarPasoSiCorresponde(1);
                  }}
                  className={`relative text-center rounded-lg border-[1.5px] p-2.5 transition-all bg-white hover:-translate-y-0.5 ${
                    i === productoIdx ? "border-cobre shadow-[0_0_0_3px_rgba(212,118,58,.12)]" : "border-grafito/10 hover:border-cobre/45"
                  }`}
                >
                  {i === productoIdx && (
                    <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-cobre text-white text-[11px] flex items-center justify-center font-black">
                      ✓
                    </span>
                  )}
                  <div className="w-full aspect-square rounded-md bg-[#f2f1ee] flex items-center justify-center overflow-hidden mb-2">
                    {t.colores[0]?.imagenUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.colores[0].imagenUrl} alt={t.nombre} className="w-[78%] h-[78%] object-contain" />
                    ) : (
                      <div className="w-2/3 h-2/3 rounded" style={{ background: t.colores[0]?.hex }} />
                    )}
                  </div>
                  <div className="text-xs font-bold leading-tight">{t.nombre}</div>
                  <div className="text-[10.5px] text-grafito/45 mt-0.5">{t.desc}</div>
                  <div className="text-xs font-extrabold text-cobre-dim mt-1">{t.precio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color */}
          <div className="py-6 border-b border-grafito/10">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="font-display text-sm text-cobre font-semibold">02</span>
              <h2 className="font-display text-lg font-medium">Elige el color</h2>
            </div>
            <div className="flex flex-wrap gap-3.5">
              {producto.colores.map((c, i) => (
                <button
                  key={c.hex + i}
                  onClick={() => {
                    setColorIdx(i);
                    avanzarPasoSiCorresponde(2);
                  }}
                  className="flex flex-col items-center gap-1.5 w-14"
                >
                  <span
                    className={`relative w-10 h-10 rounded-full transition-transform hover:scale-105 ${
                      i === colorIdx ? "ring-2 ring-cobre ring-offset-2" : ""
                    }`}
                    style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)" }}
                  >
                    {i === colorIdx && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-black" style={{ textShadow: "0 1px 2px rgba(0,0,0,.5)" }}>
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-center text-grafito/55 leading-tight font-semibold">{c.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Personaliza */}
          <div className="py-6 border-b border-grafito/10">
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="font-display text-sm text-cobre font-semibold">03</span>
              <h2 className="font-display text-lg font-medium">Personaliza</h2>
            </div>
            <p className="text-xs text-grafito/45 mb-4">Personalización premium con grabado láser real</p>

            <div className="flex gap-2 bg-[#f2f1ee] p-1 rounded-[10px] mb-5">
              {MODOS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModo(m.id)}
                  className={`flex-1 text-center py-2 rounded-md text-[12.5px] font-bold transition-all ${
                    modo === m.id ? "bg-white text-grafito shadow-sm" : "text-grafito/50"
                  }`}
                >
                  {m.nombre}
                </button>
              ))}
            </div>

            {mostrarTexto && (
              <div>
                <label className="text-[11.5px] uppercase tracking-widest text-grafito/50 font-bold block mb-2.5">
                  Agrega tu texto
                </label>
                <input
                  type="text"
                  value={texto}
                  maxLength={22}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escribe aquí tu nombre o frase"
                  className="w-full border-[1.5px] border-grafito/10 rounded-lg px-4 py-3.5 text-lg font-display focus:outline-none focus:border-cobre"
                />
                <div className="text-[11px] text-grafito/35 mt-1.5 text-right">{texto.length}/22 caracteres</div>

                <label className="text-[11.5px] uppercase tracking-widest text-grafito/50 font-bold block mb-2.5 mt-5">
                  Elige tu tipografía
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fuentes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFuenteId(f.id)}
                      className={`text-left border-[1.5px] rounded-lg p-3 transition-colors bg-white ${
                        f.id === fuenteId ? "border-cobre bg-cobre/5" : "border-grafito/10 hover:border-cobre/40"
                      }`}
                    >
                      <div
                        className="text-lg leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ fontFamily: f.cssFamily }}
                      >
                        {texto || "Tu texto"}
                      </div>
                      <div className="text-[10.5px] text-grafito/45 font-bold uppercase tracking-wide">{f.nombre}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mostrarLogo && (
              <div className={mostrarTexto ? "mt-6" : ""}>
                <label className="text-[11.5px] uppercase tracking-widest text-grafito/50 font-bold block mb-2.5">
                  Sube tu diseño
                </label>
                <input
                  type="file"
                  id="logoInputPremium"
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={manejarSubidaLogo}
                  className="hidden"
                />
                <label
                  htmlFor="logoInputPremium"
                  className="flex items-center gap-3.5 border-2 border-dashed border-cobre rounded-xl p-4 cursor-pointer bg-cobre/5 hover:bg-cobre/10 hover:-translate-y-px transition-all"
                >
                  <div className="shrink-0 rounded-full bg-grafito text-cobre flex items-center justify-center font-display font-semibold" style={{ width: 48, height: 48, fontSize: 23 }}>
                    T
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-[15.5px]">Sube tu diseño</div>
                    <div className="text-xs text-grafito/50">PNG, JPG o SVG · máx. 5MB</div>
                  </div>
                  <span className="ml-auto text-xl font-extrabold text-cobre">↑</span>
                </label>
                {procesandoLogo && <p className="text-xs text-cobre-dim mt-2.5 font-bold">Vectorizando diseño...</p>}
                {logoError && <p className="text-xs text-red-500 mt-2.5">{logoError}</p>}
              </div>
            )}
          </div>

          {/* 4. Ajusta tu diseño */}
          <div className="py-6 border-b border-grafito/10">
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="font-display text-sm text-cobre font-semibold">04</span>
              <h2 className="font-display text-lg font-medium">Ajusta tu diseño</h2>
            </div>
            <p className="text-xs text-grafito/45 mb-4">Arrastra el diseño directamente sobre el termo para moverlo</p>

            {mostrarTexto && (
              <div className="bg-cobre/[0.055] border border-cobre/20 rounded-xl p-4">
                <div className="text-[11px] uppercase tracking-widest text-cobre-dim font-extrabold mb-3">↔ Texto</div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => rotar("texto")} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cobre text-white text-[12.5px] font-bold hover:-translate-y-px hover:shadow-md transition-all">
                    ⟳ Rotar <b>{posTexto.rot}°</b>
                  </button>
                  <button onClick={() => setPosTexto((p) => ({ ...p, x: 50 }))} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border-[1.5px] border-cobre text-cobre-dim text-[12.5px] font-bold hover:-translate-y-px transition-all">
                    ↔ Centrar horizontal
                  </button>
                  <button onClick={() => setPosTexto((p) => ({ ...p, y: 50 }))} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border-[1.5px] border-cobre text-cobre-dim text-[12.5px] font-bold hover:-translate-y-px transition-all">
                    ↕ Centrar vertical
                  </button>
                  <button
                    onClick={() => setTexto("")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border-[1.5px] border-red-500 text-red-500 text-[12.5px] font-bold hover:-translate-y-px transition-all"
                  >
                    🗑 Eliminar
                  </button>
                </div>
                <div className="mt-3.5">
                  <label className="text-[11.5px] text-grafito/50 font-bold block mb-2">↗ Tamaño del texto</label>
                  <input type="range" min={0} max={100} value={tamanoTexto} onChange={(e) => setTamanoTexto(Number(e.target.value))} className="w-full accent-[#D4763A]" />
                </div>
              </div>
            )}

            {mostrarLogo && logo && (
              <div className={`bg-cobre/[0.055] border border-cobre/20 rounded-xl p-4 ${mostrarTexto ? "mt-4" : ""}`}>
                <div className="text-[11px] uppercase tracking-widest text-cobre-dim font-extrabold mb-3">↔ Imagen</div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => rotar("logo")} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cobre text-white text-[12.5px] font-bold hover:-translate-y-px hover:shadow-md transition-all">
                    ⟳ Rotar <b>{posLogo.rot}°</b>
                  </button>
                  <button onClick={() => setPosLogo((p) => ({ ...p, x: 50 }))} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border-[1.5px] border-cobre text-cobre-dim text-[12.5px] font-bold hover:-translate-y-px transition-all">
                    ↔ Centrar horizontal
                  </button>
                  <button onClick={() => setPosLogo((p) => ({ ...p, y: 50 }))} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border-[1.5px] border-cobre text-cobre-dim text-[12.5px] font-bold hover:-translate-y-px transition-all">
                    ↕ Centrar vertical
                  </button>
                  <button
                    onClick={() => {
                      setLogo(null);
                      setLogoRaw(null);
                      setLogoInvertido(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border-[1.5px] border-red-500 text-red-500 text-[12.5px] font-bold hover:-translate-y-px transition-all"
                  >
                    🗑 Eliminar
                  </button>
                </div>
                <div className="mt-3.5">
                  <label className="text-[11.5px] text-grafito/50 font-bold block mb-2">↗ Tamaño de la imagen</label>
                  <input type="range" min={0} max={100} value={tamanoLogo} onChange={(e) => setTamanoLogo(Number(e.target.value))} className="w-full accent-[#D4763A]" />
                </div>
                <button onClick={alternarInversion} className="text-xs text-grafito/50 underline mt-2.5">
                  Invertir trazos del grabado
                </button>
              </div>
            )}
          </div>

          {/* 5. Resumen */}
          <div className="py-6">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="font-display text-sm text-cobre font-semibold">05</span>
              <h2 className="font-display text-lg font-medium">Revisa tu pedido</h2>
            </div>

            <div className="bg-grafito text-white rounded-2xl p-5">
              <div className="font-display text-xs uppercase tracking-widest text-cobre font-semibold mb-4">Tu Termazo</div>

              <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-[13.5px]">
                <span className="text-white/50">Modelo</span>
                <span className="font-bold">{producto.nombre}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-[13.5px]">
                <span className="text-white/50">Color</span>
                <span className="font-bold">{color?.nombre}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-[13.5px]">
                <span className="text-white/50">Personalización</span>
                <span className="font-bold text-right max-w-[60%]">{personalizacionResumen()}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-[13.5px]">
                <span className="text-white/50">Tipo</span>
                <span className="font-bold">Grabado láser</span>
              </div>
              <div className="flex justify-between items-center py-2.5 text-[13.5px]">
                <span className="text-white/50">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="w-[26px] h-[26px] rounded-full border border-white/30 text-white flex items-center justify-center hover:border-cobre hover:text-cobre" style={{ width: 26, height: 26 }}>
                    −
                  </button>
                  <span className="font-extrabold min-w-[16px] text-center">{cantidad}</span>
                  <button onClick={() => setCantidad((c) => Math.min(20, c + 1))} className="rounded-full border border-white/30 text-white flex items-center justify-center hover:border-cobre hover:text-cobre" style={{ width: 26, height: 26 }}>
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-baseline my-4 pt-3.5 border-t border-white/15">
                <span className="text-[11px] uppercase tracking-widest text-white/50">Total</span>
                <span className="font-display text-[28px] font-semibold text-cobre">${total} MXN</span>
              </div>

              <button onClick={validarYAgregar} className="w-full bg-cobre text-grafito font-extrabold py-4 rounded-lg text-sm hover:bg-[#e6864a] hover:-translate-y-px transition-all">
                Agregar al carrito →
              </button>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold px-3.5 py-2.5 rounded-lg mt-3">
                  {error}
                </div>
              )}
              {confirmado && (
                <div className="bg-cobre/15 border border-cobre/40 text-cobre text-xs font-bold px-3.5 py-2.5 rounded-lg mt-3">
                  Diseño confirmado y agregado ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Sticky CTA móvil ===== */}
      <div className="md:hidden fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-grafito/10 px-4 py-3" style={{ boxShadow: "0 -6px 18px rgba(0,0,0,.08)" }}>
        <div className="flex items-center gap-3">
          <span className="font-display font-semibold text-lg shrink-0">${total}</span>
          <button onClick={validarYAgregar} className="flex-1 bg-cobre text-grafito font-extrabold py-3.5 rounded-lg text-[13.5px]">
            Agregar al carrito →
          </button>
        </div>
      </div>
    </div>
  );
}
