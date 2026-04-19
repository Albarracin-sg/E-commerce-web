import { useNavigate } from "react-router-dom";
import { useCheckoutState } from "../context/CheckoutContext";

const pageClassName = "min-h-screen bg-[#0f0f1a] bg-[radial-gradient(circle_at_1px_1px,#1e2740_1px,transparent_0)] [background-size:24px_24px] px-4 py-8 sm:px-6 lg:px-10";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { lastOrder, resetCheckout } = useCheckoutState();

  if (!lastOrder) {
    return (
      <div className={pageClassName}>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
          <header className="border-b border-line/80 px-6 py-4 md:px-8">
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">Vibra Shop</span>
          </header>
          <main className="px-6 py-12 md:px-8">
            <div className="rounded-[28px] bg-white px-6 py-10 text-center shadow-soft">
              <h1 className="font-display text-3xl font-bold text-ink-900">No hay confirmación disponible</h1>
              <p className="mt-3 text-sm text-ink-700">Primero debes completar una compra en el checkout.</p>
              <button className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-bold text-white transition hover:bg-brand-600" onClick={() => navigate("/cart")}>Ir al carrito</button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClassName}>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
        <header className="flex items-center justify-between border-b border-line/80 px-6 py-4 md:px-8">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">Vibra Shop</span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Compra confirmada</span>
        </header>

        <main className="px-6 py-10 md:px-8">
          <div className="rounded-[28px] bg-white px-6 py-10 text-center shadow-soft">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-4xl font-bold text-white">✓</div>
            <span className="mt-5 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">Compra exitosa</span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.04em] text-ink-900">Gracias por tu compra</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-700">Tu pedido ha sido confirmado. Recibirás un correo con los detalles de la compra.</p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-4 text-left md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-shell p-4"><strong className="text-sm text-ink-900">Número de orden</strong><p className="mt-2 font-display text-2xl font-extrabold text-brand-600">#{lastOrder.id}</p></div>
              <div className="rounded-2xl border border-line bg-shell p-4"><strong className="text-sm text-ink-900">Fecha</strong><p className="mt-2 text-sm text-ink-700">{new Date(lastOrder.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
              <div className="rounded-2xl border border-line bg-shell p-4 md:col-span-2"><strong className="text-sm text-ink-900">Total pagado</strong><p className="mt-2 font-display text-3xl font-extrabold text-ink-900">${lastOrder.total.toFixed(2)}</p></div>
              <div className="rounded-2xl border border-line bg-shell p-4 md:col-span-2">
                <strong className="text-sm text-ink-900">Productos</strong>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  {lastOrder.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 rounded-xl bg-white px-3 py-3">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span className="font-semibold text-ink-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-bold text-white transition hover:bg-brand-600" onClick={() => {
              resetCheckout();
              navigate("/cart");
            }}>
              Hacer otra compra
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
