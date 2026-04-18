import { Link, useNavigate } from "react-router-dom";
import MainStoreLayout from "../layouts/MainStoreLayout";
import { useCart } from "../context/CartContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, loading, increment, decrement, remove } = useCart();

  const shipping = totalAmount >= 200000 ? 0 : 15900;
  const taxes = totalAmount * 0.05;
  const grandTotal = totalAmount + shipping + taxes;

  if (loading) {
    return (
      <MainStoreLayout>
        <section className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm text-slate-600">Cargando carrito...</p>
        </section>
      </MainStoreLayout>
    );
  }

  return (
    <MainStoreLayout>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900">Carrito</h1>
          <span className="text-sm text-slate-600">{totalItems} ítems</span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-slate-600">Tu carrito está vacío.</p>
            <Link
              to="/catalogo"
              className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="flex gap-4 rounded-xl border bg-white p-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{item.product.name}</p>
                    <p className="text-xs text-slate-500">
                      {[item.color, item.size ? `Talla ${item.size}` : null].filter(Boolean).join(" · ") || "Sin variante"}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{formatPrice(item.unitPrice)}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="h-8 w-8 rounded border text-sm"
                        onClick={() => void decrement(item)}
                        aria-label="Disminuir"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="h-8 w-8 rounded border text-sm"
                        onClick={() => void increment(item)}
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                      <button
                        className="ml-3 text-xs font-semibold text-rose-600"
                        onClick={() => void remove(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatPrice(item.subtotal)}</p>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-xl border bg-white p-5">
              <h2 className="text-lg font-bold">Resumen</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
                <div className="flex justify-between"><span>Envío</span><span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span>Impuestos</span><span>{formatPrice(taxes)}</span></div>
                <div className="mt-3 flex justify-between border-t pt-3 text-base font-extrabold text-slate-900">
                  <span>Total</span><span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => navigate("/checkout")}
              >
                Ir a pagar
              </button>
            </aside>
          </div>
        )}
      </section>
    </MainStoreLayout>
  );
}
