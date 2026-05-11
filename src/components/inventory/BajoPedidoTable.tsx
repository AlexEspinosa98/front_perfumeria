import { BajoPedidoItem, InsumoItem, formatCOP } from "@/data/inventory";

interface Props {
  items: BajoPedidoItem[];
  insumos: InsumoItem[];
}

const genderColors = {
  MUJER: "bg-rose-400/10 text-rose-400 border border-rose-400/20",
  HOMBRE: "bg-sky-400/10 text-sky-400 border border-sky-400/20",
  UNISEX: "bg-primary/10 text-primary border border-primary/20",
};

export default function BajoPedidoTable({ items, insumos }: Props) {
  const totalFragrancias = items.reduce((s, i) => s + i.precio, 0);
  const totalInsumos = insumos.reduce((s, i) => s + i.precio, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-headline-sm text-on-surface mb-1">
          Fragancias por Pedir
        </h2>
        <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">
          Wishlist de restock · {items.length} referencias
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                {["Referencia", "Género", "Precio estimado", "Proveedor"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${
                        h === "Precio estimado" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.referencia}
                  className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
                >
                  <td className="px-4 py-3 font-sans text-body-md text-on-surface font-medium">
                    {item.referencia}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                        genderColors[item.genero]
                      }`}
                    >
                      {item.genero}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-body-md text-primary font-medium">
                    {formatCOP(item.precio)}
                  </td>
                  <td className="px-4 py-3 font-sans text-body-md text-on-surface-variant">
                    {item.proveedor || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-outline-variant/30 bg-surface-container-low">
                <td
                  colSpan={2}
                  className="px-4 py-3 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant"
                >
                  Total estimado fragancias
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-primary">
                  {formatCOP(totalFragrancias)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-headline-sm text-on-surface mb-1">
          Insumos Pendientes
        </h2>
        <p className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">
          Materiales y suministros · {insumos.length} ítems
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                {["Insumo", "Precio", "Proveedor"].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant ${
                      h === "Precio" ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insumos.map((item) => (
                <tr
                  key={item.insumo}
                  className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
                >
                  <td className="px-4 py-3 font-sans text-body-md text-on-surface">
                    {item.insumo}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-body-md text-primary">
                    {formatCOP(item.precio)}
                  </td>
                  <td className="px-4 py-3 font-sans text-body-md text-on-surface-variant">
                    {item.proveedor}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-outline-variant/30 bg-surface-container-low">
                <td className="px-4 py-3 font-sans text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Total insumos
                </td>
                <td className="px-4 py-3 text-right font-sans text-body-md font-semibold text-primary">
                  {formatCOP(totalInsumos)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 p-4 border border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center">
            <span className="font-sans text-label-sm uppercase tracking-widest text-on-surface-variant">
              Inversión total necesaria
            </span>
            <span className="font-serif text-headline-sm text-primary">
              {formatCOP(totalFragrancias + totalInsumos)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
