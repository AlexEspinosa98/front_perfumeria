import { OriginalItem, formatCOP } from "@/data/inventory";

interface Props {
  items: OriginalItem[];
}

export default function OriginalesTable({ items }: Props) {
  const totalVendidos = items.reduce((s, i) => s + i.vendidos, 0);
  const totalGanancia = items.reduce((s, i) => s + i.ganancia * i.vendidos, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-headline-sm text-on-surface">
          Originales · Inventario 1.1
        </h2>
        <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mt-0.5">
          Frascos originales sellados · {items.length} referencias
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low">
              {[
                { label: "Fragancia", align: "left" },
                { label: "Costo compra", align: "right" },
                { label: "Costo logístico", align: "right" },
                { label: "Costo total", align: "right" },
                { label: "Precio venta", align: "right" },
                { label: "Ganancia", align: "right" },
                { label: "Margen %", align: "right" },
                { label: "Vendidos", align: "center" },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-4 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant text-${align}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.nombre}
                className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td className="px-4 py-3 font-sans text-body-md text-on-surface font-medium">
                  {item.nombre}
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md text-on-surface-variant">
                  {formatCOP(item.costoPorFrasco)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md text-on-surface-variant">
                  {formatCOP(item.costoEnvio)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md text-on-surface-variant">
                  {formatCOP(item.costoTotal)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md text-primary font-medium">
                  {formatCOP(item.precioVenta)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-sans text-body-md text-emerald-400 font-medium">
                    {formatCOP(item.ganancia)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-12 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, item.margen)}%` }}
                      />
                    </div>
                    <span className="font-sans text-[11px] text-on-surface-variant">
                      {item.margen.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-sans text-body-md text-on-surface">
                    {item.vendidos}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-outline-variant/30 bg-surface-container-low">
              <td className="px-4 py-3 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant">
                Totales
              </td>
              <td colSpan={5} />
              <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-emerald-400">
                {formatCOP(totalGanancia)}
              </td>
              <td />
              <td className="px-4 py-3 text-center font-sans text-body-md font-semibold text-on-surface">
                {totalVendidos}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
