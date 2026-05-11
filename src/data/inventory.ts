// ── Types ─────────────────────────────────────────────────────────────────────

export type GeneroConcentrado = "F" | "M" | "UNISEX";
export type TipoFormula = "1.1" | "preparada";

export interface FormulaConf {
  mlPorFrasco: number;     // ml per bottle, e.g. 14
  pctConcentrado: number;  // fraction 0–1, e.g. 0.5 = 50 % concentrate
  precioVenta: number;     // COP per bottle
}

export interface Concentrado {
  id: string;
  nombre: string;
  genero: GeneroConcentrado;
  gramosStock: number;      // total grams owned (never decremented automatically)
  costoPorGramo: number;    // COP per gram
  proveedor?: string;
  formula11: FormulaConf;
  formulaPreparada: FormulaConf;
}

export interface VentaItem {
  fecha: string;
  concentradoId: string;
  nombre: string;                    // denormalised
  tipo: TipoFormula;
  frascos: number;
  mlPorFrasco: number;               // snapshot from formula at time of sale
  pctConcentrado: number;            // snapshot
  gramosConcentradoUsados: number;   // frascos × mlPorFrasco × pctConcentrado
  gramosAlcohol: number;             // entered manually
  valorVenta: number;                // COP
  cartera: number;                   // COP pending collection
}

// ── Bajo Pedido / Insumos (unchanged) ────────────────────────────────────────

export interface BajoPedidoItem {
  referencia: string;
  genero: "MUJER" | "HOMBRE" | "UNISEX";
  precio: number;
  proveedor?: string;
}

export interface InsumoItem {
  insumo: string;
  precio: number;
  proveedor: string;
}

// ── Originales (reference comparison) ────────────────────────────────────────

export interface OriginalItem {
  nombre: string;
  costoPorFrag: number;
  costoPorFrasco: number;
  costoAlcohol: number;
  costoEnvio: number;
  costoTotal: number;
  precioVenta: number;
  ganancia: number;
  margen: number;
  vendidos: number;
}

// ── Seed: Concentrados ────────────────────────────────────────────────────────

export const concentradosSeed: Concentrado[] = [
  // ── Femeninos ────────────────────────────────
  {
    id: "C001", nombre: "Good Girl", genero: "F",
    gramosStock: 56, costoPorGramo: 1200, proveedor: "Mundo F",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 20000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
  {
    id: "C002", nombre: "Black Opium", genero: "F",
    gramosStock: 42, costoPorGramo: 1400, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 22000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
  {
    id: "C003", nombre: "Libre YSL", genero: "F",
    gramosStock: 70, costoPorGramo: 1600, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 22000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
  {
    id: "C004", nombre: "Coco Mademoiselle", genero: "F",
    gramosStock: 35, costoPorGramo: 2000, proveedor: "Mundo F",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 25000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 15000 },
  },
  {
    id: "C005", nombre: "La Vie Est Belle", genero: "F",
    gramosStock: 28, costoPorGramo: 1500, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 20000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
  {
    id: "C006", nombre: "212 VIP Rosé", genero: "F",
    gramosStock: 49, costoPorGramo: 1300, proveedor: "Mundo F",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 18000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 11000 },
  },
  {
    id: "C007", nombre: "Flowerbomb", genero: "F",
    gramosStock: 21, costoPorGramo: 1800, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 24000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 13000 },
  },
  // ── Masculinos ───────────────────────────────
  {
    id: "C008", nombre: "Sauvage Dior", genero: "M",
    gramosStock: 84, costoPorGramo: 2200, proveedor: "Mundo F",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 28000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 15000 },
  },
  {
    id: "C009", nombre: "Bleu de Chanel", genero: "M",
    gramosStock: 56, costoPorGramo: 2500, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 30000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 15000 },
  },
  {
    id: "C010", nombre: "1 Million", genero: "M",
    gramosStock: 42, costoPorGramo: 1800, proveedor: "Mundo F",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 22000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
  {
    id: "C011", nombre: "Acqua di Giò", genero: "M",
    gramosStock: 63, costoPorGramo: 1600, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 20000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
  {
    id: "C012", nombre: "Invictus", genero: "M",
    gramosStock: 35, costoPorGramo: 1400, proveedor: "Mundo F",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 18000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 11000 },
  },
  {
    id: "C013", nombre: "Eros Versace", genero: "M",
    gramosStock: 28, costoPorGramo: 1700, proveedor: "Aromia",
    formula11:       { mlPorFrasco: 14, pctConcentrado: 0.5, precioVenta: 22000 },
    formulaPreparada:{ mlPorFrasco: 14, pctConcentrado: 0.2, precioVenta: 12000 },
  },
];

// ── Seed: Ventas ──────────────────────────────────────────────────────────────

export const ventasSeed: VentaItem[] = [
  {
    fecha: "2025-04-05", concentradoId: "C001", nombre: "Good Girl",
    tipo: "preparada", frascos: 3, mlPorFrasco: 14, pctConcentrado: 0.2,
    gramosConcentradoUsados: 8.4, gramosAlcohol: 33.6, valorVenta: 36000, cartera: 0,
  },
  {
    fecha: "2025-04-10", concentradoId: "C008", nombre: "Sauvage Dior",
    tipo: "1.1", frascos: 2, mlPorFrasco: 14, pctConcentrado: 0.5,
    gramosConcentradoUsados: 14, gramosAlcohol: 14, valorVenta: 56000, cartera: 0,
  },
  {
    fecha: "2025-04-15", concentradoId: "C002", nombre: "Black Opium",
    tipo: "preparada", frascos: 4, mlPorFrasco: 14, pctConcentrado: 0.2,
    gramosConcentradoUsados: 11.2, gramosAlcohol: 44.8, valorVenta: 48000, cartera: 12000,
  },
  {
    fecha: "2025-04-20", concentradoId: "C009", nombre: "Bleu de Chanel",
    tipo: "1.1", frascos: 1, mlPorFrasco: 14, pctConcentrado: 0.5,
    gramosConcentradoUsados: 7, gramosAlcohol: 7, valorVenta: 30000, cartera: 0,
  },
  {
    fecha: "2025-05-02", concentradoId: "C003", nombre: "Libre YSL",
    tipo: "preparada", frascos: 5, mlPorFrasco: 14, pctConcentrado: 0.2,
    gramosConcentradoUsados: 14, gramosAlcohol: 56, valorVenta: 60000, cartera: 0,
  },
  {
    fecha: "2025-05-08", concentradoId: "C010", nombre: "1 Million",
    tipo: "preparada", frascos: 2, mlPorFrasco: 14, pctConcentrado: 0.2,
    gramosConcentradoUsados: 5.6, gramosAlcohol: 22.4, valorVenta: 24000, cartera: 0,
  },
];

// ── Seed: Bajo Pedido / Insumos ───────────────────────────────────────────────

export const bajoPedidoSeed: BajoPedidoItem[] = [
  { referencia: "Lolita Lempicka",     genero: "MUJER",  precio: 45000, proveedor: "Mundo F"  },
  { referencia: "Can Can Paris Hilton", genero: "MUJER",  precio: 42000, proveedor: "Mundo F"  },
  { referencia: "Bakara 540 (x1.1)",   genero: "UNISEX", precio: 70000, proveedor: "Aromia"   },
  { referencia: "Valentino Born in Roma", genero: "MUJER", precio: 55000, proveedor: "Aromia" },
  { referencia: "Polo Red EDP",        genero: "HOMBRE", precio: 50000, proveedor: "Mundo F"  },
  { referencia: "Coco Chanel N°5",     genero: "MUJER",  precio: 65000, proveedor: "Aromia"   },
  { referencia: "Eternity Now CK",     genero: "MUJER",  precio: 40000, proveedor: "Mundo F"  },
  { referencia: "Dior Homme Intense",  genero: "HOMBRE", precio: 60000, proveedor: "Aromia"   },
  { referencia: "Good Girl Blush",     genero: "MUJER",  precio: 55000, proveedor: "Mundo F"  },
  { referencia: "Interlude Man Amouage", genero: "HOMBRE", precio: 85000, proveedor: "Aromia" },
];

export const insumosSeed: InsumoItem[] = [
  { insumo: "Alcohol 96° (1L)",               precio: 25000,  proveedor: "Distribuidora Q" },
  { insumo: "Frascos atomizador 30ml (x50)",   precio: 180000, proveedor: "Envases & Co"   },
  { insumo: "Tapas doradas (x100)",             precio: 45000,  proveedor: "Envases & Co"   },
  { insumo: "Etiquetas personalizadas (x100)",  precio: 35000,  proveedor: "Impresiones XL" },
  { insumo: "Cajas de presentación (x20)",      precio: 60000,  proveedor: "Impresiones XL" },
  { insumo: "Papel kraft para empaque (x100)",  precio: 15000,  proveedor: "Distribuidora Q" },
];

// ── Seed: Originales (reference) ──────────────────────────────────────────────

export const inventarioOriginales: OriginalItem[] = [
  { nombre: "Good Girl Carolina Herrera", costoPorFrag: 180000, costoPorFrasco: 180000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 195000, precioVenta: 280000, ganancia: 85000, margen: 43.6, vendidos: 3 },
  { nombre: "Sauvage EDP Dior",           costoPorFrag: 220000, costoPorFrasco: 220000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 235000, precioVenta: 320000, ganancia: 85000, margen: 36.2, vendidos: 2 },
  { nombre: "Black Opium YSL",            costoPorFrag: 190000, costoPorFrasco: 190000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 205000, precioVenta: 290000, ganancia: 85000, margen: 41.5, vendidos: 4 },
  { nombre: "Bleu de Chanel EDP",         costoPorFrag: 210000, costoPorFrasco: 210000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 225000, precioVenta: 310000, ganancia: 85000, margen: 37.8, vendidos: 1 },
  { nombre: "La Vie Est Belle Lancôme",   costoPorFrag: 175000, costoPorFrasco: 175000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 190000, precioVenta: 270000, ganancia: 80000, margen: 42.1, vendidos: 2 },
  { nombre: "1 Million Paco Rabanne",     costoPorFrag: 185000, costoPorFrasco: 185000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 200000, precioVenta: 280000, ganancia: 80000, margen: 40.0, vendidos: 3 },
  { nombre: "Libre YSL EDP",              costoPorFrag: 200000, costoPorFrasco: 200000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 215000, precioVenta: 300000, ganancia: 85000, margen: 39.5, vendidos: 1 },
  { nombre: "Flowerbomb Viktor & Rolf",   costoPorFrag: 195000, costoPorFrasco: 195000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 210000, precioVenta: 295000, ganancia: 85000, margen: 40.5, vendidos: 2 },
  { nombre: "Invictus Paco Rabanne",      costoPorFrag: 170000, costoPorFrasco: 170000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 185000, precioVenta: 260000, ganancia: 75000, margen: 40.5, vendidos: 4 },
  { nombre: "Acqua di Giò Profumo",       costoPorFrag: 205000, costoPorFrasco: 205000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 220000, precioVenta: 305000, ganancia: 85000, margen: 38.6, vendidos: 2 },
  { nombre: "Aventus Creed 100ml",        costoPorFrag: 350000, costoPorFrasco: 350000, costoAlcohol: 0, costoEnvio: 20000, costoTotal: 370000, precioVenta: 520000, ganancia: 150000, margen: 40.5, vendidos: 1 },
  { nombre: "Boss Bottled Hugo Boss",     costoPorFrag: 165000, costoPorFrasco: 165000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 180000, precioVenta: 255000, ganancia: 75000,  margen: 41.7, vendidos: 2 },
  { nombre: "Olympea Paco Rabanne",       costoPorFrag: 175000, costoPorFrasco: 175000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 190000, precioVenta: 268000, ganancia: 78000,  margen: 41.1, vendidos: 3 },
  { nombre: "The One D&G Men",            costoPorFrag: 195000, costoPorFrasco: 195000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 210000, precioVenta: 290000, ganancia: 80000,  margen: 38.1, vendidos: 1 },
  { nombre: "Ultra Male JPG",             costoPorFrag: 185000, costoPorFrasco: 185000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 200000, precioVenta: 280000, ganancia: 80000,  margen: 40.0, vendidos: 2 },
  { nombre: "Polo Red Ralph Lauren",      costoPorFrag: 160000, costoPorFrasco: 160000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 175000, precioVenta: 250000, ganancia: 75000,  margen: 42.9, vendidos: 3 },
  { nombre: "Guilty Gucci Men",           costoPorFrag: 185000, costoPorFrasco: 185000, costoAlcohol: 0, costoEnvio: 15000, costoTotal: 200000, precioVenta: 278000, ganancia: 78000,  margen: 38.9, vendidos: 2 },
  { nombre: "Bakara Man 540",             costoPorFrag: 270000, costoPorFrasco: 270000, costoAlcohol: 0, costoEnvio: 20000, costoTotal: 290000, precioVenta: 420000, ganancia: 130000, margen: 44.8, vendidos: 1 },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Grams of concentrate needed per frasco */
export function calcGramosPorFrasco(conf: FormulaConf): number {
  return parseFloat((conf.mlPorFrasco * conf.pctConcentrado).toFixed(3));
}

/** How many frascos can be produced from available grams */
export function calcFrascosDisponibles(gramosDisponibles: number, conf: FormulaConf): number {
  const gpf = calcGramosPorFrasco(conf);
  return gpf > 0 ? Math.floor(gramosDisponibles / gpf) : 0;
}

/** Auto-generate next concentrado ID */
export function nextConcentradoId(existing: Concentrado[]): string {
  const nums = existing
    .map((c) => parseInt(c.id.replace("C", ""), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `C${String(next).padStart(3, "0")}`;
}
