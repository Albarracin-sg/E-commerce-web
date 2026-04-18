import { Link } from "react-router-dom";
import MainStoreLayout from "../layouts/MainStoreLayout";
import { useCart } from "../context/CartContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function Checkout() {
  const { items, totalAmount, totalItems } = useCart();
  const shipping = totalAmount >= 200000 ? 0 : 15900;
  const total = totalAmount + shipping;

  return (
    <MainStoreLayout>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-slate-600">No hay artículos en el carrito.</p>
            <Link
              to="/catalogo"
              className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Volver al catálogo
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
            <p className="mt-2 text-sm text-slate-600">
              El pago final se implementará en el próximo sprint. Este resumen valida el flujo.
            </p>

            <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-lg bg-slate-50 p-4 text-left text-sm">
              <div className="flex justify-between"><span>Ítems</span><span>{totalItems}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-extrabold text-slate-900">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white opacity-60"
              disabled
            >
              Confirmar pago (próximamente)
            </button>

            <Link to="/cart" className="mt-4 inline-block text-sm font-semibold text-rose-600 hover:underline">
              Volver al carrito
            </Link>
          </div>
        )}
      </section>
    </MainStoreLayout>
  );
}
