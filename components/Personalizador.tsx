"use client";

import { useState, useRef } from "react";
import { Termo, fuentes } from "@/lib/products";
import { useCarrito } from "@/context/CarritoContext";

type ModoPersonalizacion = "texto" | "logo" | "ambos";

const MODOS = [
  { id: "texto" as ModoPersonalizacion, nombre: "Ajusta tu texto" },
  { id: "logo" as ModoPersonalizacion, nombre: "Ajusta tu imagen" },
  { id: "ambos" as ModoPersonalizacion, nombre: "Ajusta texto e imagen" },
];

type PosLibre = { x: number; y: number; rot: number }; // x/y en % dentro de la zona de grabado

const POS_INICIAL: PosLibre = { x: 50, y: 50, rot: 0 };

export default function Personalizador({ termos }: { termos: Termo[] }) {
  const { agregarItem } = useCarrito();
  const [confirmado, setConfirmado] = useState(false);
  const [modo, setModo] = useState<ModoPersonalizacion>("texto");

  const [productoIdx, setProductoIdx] = useState(0);
  const producto = termos[productoIdx];

  const [colorIdx, setColorIdx] = useState(0);
  const [texto, setTexto] = useState("CHRISTIAN");
  const [fuenteId, setFuenteId] = useState(fuentes[0].id);
  const [tamanoTexto, setTamanoTexto] = useState(50); // 0-100, tamaño del texto
  const [tamanoLogo, setTamanoLogo] = useState(50); // 0-100, tamaño del logo

  const [posTexto, setPosTexto] = useState<PosLibre>(POS_INICIAL);
  const [posLogo, setPosLogo] = useState<PosLibre>(POS_INICIAL);

  const [logo, setLogo] = useState<string | null>(null);
  const [logoRaw, setLogoRaw] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [procesandoLogo, setProcesandoLogo] = useState(false);
  const [logoInvertido, setLogoInvertido] = useState(false);

  const zonaRef = useRef<HTMLDivElement>(null);
  const arrastrando = useRef<"texto" | "logo" | null>(null);

  const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/svg+xml"];
  const TAMANO_MAX_MB = 5;

  // Arrastre libre — funciona con mouse y con dedo (pointer events unifica ambos).
  // La posición se guarda como porcentaje dentro de la zona de grabado, así
  // que funciona igual sin importar el tamaño real del termo en pantalla.
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

        if (arrastrando.current === "texto") {
          setPosTexto((p) => ({ ...p, x: xPct, y: yPct }));
        } else {
          setPosLogo((p) => ({ ...p, x: xPct, y: yPct }));
        }
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
    if (elemento === "texto") {
      setPosTexto((p) => ({ ...p, rot: ciclo[(ciclo.indexOf(p.rot) + 1) % 3] }));
    } else {
      setPosLogo((p) => ({ ...p, rot: ciclo[(ciclo.indexOf(p.rot) + 1) % 3] }));
    }
  }

  // Convierte la imagen subida en un "stencil" bitonal: separa trazos oscuros
  // (el logo) del fondo claro, usando un umbral automático basado en el
  // promedio de luminancia de la imagen. El resultado es un PNG con
  // transparencia real donde antes no la había — así simula un grabado
  // láser real (líneas sí/no), no una foto pegada encima del termo.
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
          const luminancia = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          let esTrazo = luminancia < umbral;
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

  const fuente = fuentes.find((f) => f.id === fuenteId)!;
  const color = producto.colores[colorIdx];
  const esClaro = color.hex === "#FAFAF8" || color.hex === "#C4C4C4";
  const colorGrabado = esClaro ? "#1A1A1A" : "#C4C4C4";

  // Tamaño de fuente real limitado dentro de un rango razonable para no salirse de la zona de grabado
  const fontSizePx = 7 + (tamanoTexto / 100) * 21; // 7px a 28px
  const logoTamanoPct = 25 + (tamanoLogo / 100) * 60; // 25% a 85% del ancho de la zona

  return (
    <div className="grid md:grid-cols-2 gap-14">
      {/* Vista previa */}
      <div className="bg-grafito flex flex-col items-center justify-center sticky top-24 self-start p-5 md:p-10">
        <p className="text-plata text-xs uppercase tracking-widest mb-4">
          {modo === "texto" && "Ajustando: texto"}
          {modo === "logo" && "Ajustando: imagen"}
          {modo === "ambos" && "Ajustando: texto + imagen — arrastra cada uno por separado"}
        </p>
        <div
          className="relative h-[380px] w-[200px] md:h-[520px] md:w-[280px] rounded-[70px_70px_18px_18px] border border-plata/15 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${color.hex}dd, ${color.hex})` }}
        >
          {/* Textura sutil de metal cepillado */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
              mixBlendMode: "overlay",
            }}
          />
          {/* Brillo direccional para dar volumen al termo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Zona de grabado — además de referencia visual, es el área de arrastre real.
              El ancho se ajusta al producto (cada termo tiene su propia zona real). */}
          <div
            ref={zonaRef}
            className="absolute border border-dashed touch-none"
            style={{
              top: `${producto.zonaGrabado.top}%`,
              bottom: `${100 - producto.zonaGrabado.bottom}%`,
              left: `${producto.zonaGrabado.left}%`,
              right: `${100 - producto.zonaGrabado.right}%`,
              borderColor: esClaro ? "rgba(26,26,26,0.15)" : "rgba(196,196,196,0.2)",
            }}
          >
            {modo !== "logo" && (
              <div
                onPointerDown={iniciarArrastre("texto")}
                className="absolute text-center px-1 leading-tight cursor-grab active:cursor-grabbing select-none touch-none"
                style={{
                  top: `${posTexto.y}%`,
                  left: `${posTexto.x}%`,
                  transform: `translate(-50%, -50%) rotate(${posTexto.rot}deg)`,
                  whiteSpace: posTexto.rot !== 0 ? "nowrap" : "normal",
                  maxWidth: posTexto.rot !== 0 ? "none" : "96%",
                  wordBreak: posTexto.rot !== 0 ? "normal" : "break-word",
                  fontFamily: fuente.cssFamily,
                  fontSize: `${fontSizePx}px`,
                  letterSpacing: "0.02em",
                  color: colorGrabado,
                  opacity: 0.94,
                  textShadow: esClaro
                    ? "0 1.5px 0 rgba(255,255,255,0.6), 0 -0.5px 0 rgba(0,0,0,0.25)"
                    : "0 1.5px 0 rgba(255,255,255,0.22), 0 -1px 0 rgba(0,0,0,0.65)",
                }}
              >
                {texto || "TU TEXTO"}
              </div>
            )}

            {/* Logo, si el cliente subió uno — se convierte a una silueta sólida en el
                color de grabado (plata u oscuro), como se ve un grabado láser real */}
            {modo !== "texto" && logo && (
              <div
                onPointerDown={iniciarArrastre("logo")}
                className="absolute cursor-grab active:cursor-grabbing select-none touch-none"
                style={{
                  top: `${posLogo.y}%`,
                  left: `${posLogo.x}%`,
                  width: `${logoTamanoPct}%`,
                  aspectRatio: "1 / 1",
                  transform: `translate(-50%, -50%) rotate(${posLogo.rot}deg)`,
                  backgroundColor: colorGrabado,
                  opacity: 0.92,
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

      {/* Controles */}
      <div>
        <span className="eyebrow text-cobre-dim font-bold mb-3">Personaliza</span>
        <h1 className="font-display font-medium text-3xl md:text-4xl mb-8">
          Diseña tu termo.
        </h1>

        {/* 0. Modo de personalización */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">
            ¿Qué quieres ajustar?
          </p>
          <div className="flex gap-2 flex-wrap">
            {MODOS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModo(m.id)}
                className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                  modo === m.id
                    ? "border-cobre bg-cobre/10 text-cobre-dim font-semibold"
                    : "border-grafito/15 text-grafito/70 hover:border-grafito/30"
                }`}
              >
                {m.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Producto */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">Termo</p>
          <div className="flex gap-2 flex-wrap">
            {termos.map((t, i) => (
              <button
                key={t.slug}
                onClick={() => {
                  setProductoIdx(i);
                  setColorIdx(0);
                }}
                className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                  i === productoIdx
                    ? "border-cobre bg-cobre/10 text-cobre-dim font-semibold"
                    : "border-grafito/15 text-grafito/70 hover:border-grafito/30"
                }`}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Color */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">
            Color: <span className="text-grafito font-semibold">{color.nombre}</span>
          </p>
          <div className="flex gap-3">
            {producto.colores.map((c, i) => (
              <button
                key={c.hex}
                onClick={() => setColorIdx(i)}
                aria-label={c.nombre}
                className={`h-9 w-9 rounded-full border-2 transition-transform ${
                  i === colorIdx ? "border-cobre scale-110" : "border-transparent"
                }`}
                style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
              />
            ))}
          </div>
        </div>

        {/* 3. Texto */}
        {modo !== "logo" && (
          <div className="mb-8">
            <label className="text-xs uppercase tracking-widest text-grafito/50 mb-3 block">
              Texto (nombre o frase)
            </label>
            <input
              type="text"
              value={texto}
              maxLength={22}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Tu nombre"
              className="w-full border border-grafito/20 rounded-sm px-4 py-3 text-lg font-display focus:outline-none focus:border-cobre"
            />
            <p className="text-xs text-grafito/40 mt-1">{texto.length}/22 caracteres</p>
          </div>
        )}

        {/* 4. Tipografía */}
        {modo !== "logo" && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">Tipografía</p>
            <div className="flex gap-2 flex-wrap">
              {fuentes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFuenteId(f.id)}
                  style={{ fontFamily: f.cssFamily }}
                  className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                    f.id === fuenteId
                      ? "border-cobre bg-cobre/10 text-cobre-dim"
                      : "border-grafito/15 text-grafito/70 hover:border-grafito/30"
                  }`}
                >
                  {f.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Tamaño */}
        {modo !== "logo" && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">
              Tamaño del texto
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={tamanoTexto}
              onChange={(e) => setTamanoTexto(Number(e.target.value))}
              className="w-full accent-[#D4763A]"
            />
          </div>
        )}
        {modo !== "texto" && logo && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">
              Tamaño de la imagen
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={tamanoLogo}
              onChange={(e) => setTamanoLogo(Number(e.target.value))}
              className="w-full accent-[#D4763A]"
            />
          </div>
        )}

        {/* 6. Posición — libre, arrastrando directo sobre el cuadro punteado del termo */}
        <div className="mb-10 bg-hueso border border-grafito/10 p-4 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">Posición</p>
          <p className="text-sm text-grafito/60 mb-4">
            En la vista previa de la izquierda, arrastra el texto o la imagen dentro del recuadro punteado para acomodarlos donde quieras.
          </p>
          <div className="flex gap-3 flex-wrap">
            {modo !== "logo" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rotar("texto")}
                  className="px-3 py-1.5 text-xs border border-grafito/20 rounded-sm hover:border-cobre"
                >
                  Rotar texto ({posTexto.rot}°)
                </button>
                <button
                  onClick={() => setPosTexto(POS_INICIAL)}
                  className="px-3 py-1.5 text-xs text-grafito/50 underline"
                >
                  Centrar
                </button>
              </div>
            )}
            {modo !== "texto" && logo && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rotar("logo")}
                  className="px-3 py-1.5 text-xs border border-grafito/20 rounded-sm hover:border-cobre"
                >
                  Rotar logo ({posLogo.rot}°)
                </button>
                <button
                  onClick={() => setPosLogo(POS_INICIAL)}
                  className="px-3 py-1.5 text-xs text-grafito/50 underline"
                >
                  Centrar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 7. Logo */}
        {modo !== "texto" && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">Logo</p>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              onChange={manejarSubidaLogo}
              className="text-sm text-grafito/70 file:mr-4 file:px-4 file:py-2 file:border file:border-grafito/20 file:rounded-sm file:bg-white file:text-sm file:cursor-pointer hover:file:border-cobre"
            />
            {procesandoLogo && (
              <p className="text-xs text-cobre-dim mt-2">Vectorizando logo...</p>
            )}
            {logoError && <p className="text-xs text-red-500 mt-2">{logoError}</p>}
            {logo && !procesandoLogo && (
              <div className="flex gap-4 mt-2">
                <button
                  onClick={alternarInversion}
                  className="text-xs text-grafito/50 underline"
                >
                  Invertir trazos
                </button>
                <button
                  onClick={() => {
                    setLogo(null);
                    setLogoRaw(null);
                    setLogoInvertido(false);
                  }}
                  className="text-xs text-grafito/50 underline"
                >
                  Quitar logo
                </button>
              </div>
            )}
            <p className="text-xs text-grafito/40 mt-2">
              PNG, JPG o SVG · máx. 5MB · se convierte a grabado automáticamente
            </p>
          </div>
        )}

        <button
          onClick={() => {
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
            setConfirmado(true);
            setTimeout(() => setConfirmado(false), 2500);
          }}
          className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
        >
          Confirmar diseño y agregar al carrito →
        </button>
        {confirmado && (
          <p className="text-sm text-cobre-dim mt-3 font-semibold">
            Agregado al carrito ✓
          </p>
        )}
      </div>
    </div>
  );
}
