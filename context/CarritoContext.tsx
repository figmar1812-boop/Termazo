"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ItemCarrito = {
  id: string; // id único por diseño (producto + config), no por producto genérico
  productoSlug: string;
  productoNombre: string;
  precioUnitario: number;
  colorNombre: string;
  colorHex: string;
  texto: string;
  fuenteNombre: string;
  posicion: string;
  tamano: number;
  cantidad: number;
};

type CarritoContextType = {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, "id" | "cantidad">) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  eliminarItem: (id: string) => void;
  vaciarCarrito: () => void;
  total: number;
  cantidadTotal: number;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

const STORAGE_KEY = "termazo_carrito";

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar del localStorage al montar (solo en el navegador del cliente)
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // si falla, arrancamos con carrito vacío
    }
    setCargado(true);
  }, []);

  // Guardar cada vez que cambie el carrito
  useEffect(() => {
    if (cargado) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, cargado]);

  function agregarItem(nuevo: Omit<ItemCarrito, "id" | "cantidad">) {
    const id = `${nuevo.productoSlug}-${Date.now()}`;
    setItems((prev) => [...prev, { ...nuevo, id, cantidad: 1 }]);
  }

  function actualizarCantidad(id: string, cantidad: number) {
    if (cantidad < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)));
  }

  function eliminarItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregarItem, actualizarCantidad, eliminarItem, vaciarCarrito, total, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
