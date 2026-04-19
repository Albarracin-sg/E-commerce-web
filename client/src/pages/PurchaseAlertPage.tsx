import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckoutState } from "../context/CheckoutContext";

const pageClassName = "min-h-screen bg-[#0f0f1a] bg-[radial-gradient(circle_at_1px_1px,#1e2740_1px,transparent_0)] [background-size:24px_24px] px-4 py-8 sm:px-6 lg:px-10";

export default function PurchaseAlertPage() {
  const navigate = useNavigate();
  const { lastOrder } = useCheckoutState();

  useEffect(() => {
    if (!lastOrder) {
      navigate("/cart", { replace: true });
    }
  }, [lastOrder, navigate]);

  if (!lastOrder) {
    return null;
  }

  return (
    <div className={pageClassName}>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
        <header className="flex items-center justify-between border-b border-line/80 px-6 py-4 md:px-8">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">Vibra Shop</span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Alerta de compra</span>
        </header>

        <main className="px-6 py-12 md:px-8">
          <div className="rounded-[28px] bg-white px-6 py-10 text-center shadow-soft">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-4xl font-bold text-white shadow-lg">!</div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-ink-900">Compra aprobada</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-700">Tu pago fue validado correctamente. La orden <strong>#{lastOrder.id}</strong> ya fue registrada y está lista para mostrar la confirmación final.</p>
            <div className="mx-auto mt-8 grid max-w-2xl gap-4 text-left md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-shell p-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">Estado</p><p className="mt-2 text-sm font-semibold text-success">Pago autorizado</p></div>
              <div className="rounded-2xl border border-line bg-shell p-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">Total</p><p className="mt-2 text-sm font-semibold text-ink-900">${lastOrder.total.toFixed(2)}</p></div>
              <div className="rounded-2xl border border-line bg-shell p-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">Productos</p><p className="mt-2 text-sm font-semibold text-ink-900">{lastOrder.items.length} item(s)</p></div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="inline-flex h-12 items-center justify-center rounded-2xl border border-line bg-white px-6 text-sm font-semibold text-ink-900 transition hover:bg-brand-50" onClick={() => navigate("/cart")}>Volver al carrito</button>
              <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-bold text-white transition hover:bg-brand-600" onClick={() => navigate("/confirmation", { replace: true })}>Ver confirmación final</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
