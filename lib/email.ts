import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type TipoEmail =
  | "recibido"
  | "pagado"
  | "en_produccion"
  | "enviado"
  | "entregado"
  | "rechazado";

const ASUNTOS: Record<TipoEmail, string> = {
  recibido: "Recibimos tu pedido — Termazo",
  pagado: "Tu pago fue confirmado — Termazo",
  en_produccion: "Tu Termazo está en producción",
  enviado: "Tu Termazo va en camino",
  entregado: "Tu Termazo fue entregado",
  rechazado: "Hubo un problema con tu pago — Termazo",
};

const MENSAJES: Record<TipoEmail, string> = {
  recibido:
    "Recibimos tu pedido y está esperando confirmación de pago. En cuanto se confirme, empezamos a grabarlo.",
  pagado:
    "Tu pago quedó confirmado. Tu termazo pasa ahora a producción — te avisamos en cuanto empiece el grabado.",
  en_produccion: "Tu termazo ya está en nuestro taller, siendo grabado con cuidado.",
  enviado: "Tu termazo salió de nuestro taller y va en camino a tu dirección.",
  entregado: "Tu termazo fue entregado. ¡Esperamos que lo disfrutes tanto como nosotros hacerlo!",
  rechazado:
    "Tu pago no pudo procesarse. Puedes intentar de nuevo desde tu carrito cuando quieras.",
};

type PedidoParaEmail = {
  numeroPedido: string;
  total: number;
  customer: { nombre: string; email: string };
};

function plantillaHtml(tipo: TipoEmail, pedido: PedidoParaEmail) {
  return `
  <div style="font-family: Arial, sans-serif; background:#FAFAF8; padding:40px 20px;">
    <div style="max-width:480px;margin:0 auto;background:#1A1A1A;border-radius:4px;overflow:hidden;">
      <div style="padding:32px 32px 20px;">
        <p style="color:#C4C4C4;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Termazo</p>
        <h1 style="color:#FAFAF8;font-size:22px;margin:0 0 16px;">${ASUNTOS[tipo]}</h1>
        <p style="color:#C4C4C4;font-size:14px;line-height:1.6;margin:0 0 24px;">
          Hola ${pedido.customer.nombre}, ${MENSAJES[tipo]}
        </p>
        <div style="background:#242424;border-radius:2px;padding:16px 20px;margin-bottom:8px;">
          <p style="color:#C4C4C4;font-size:12px;margin:0 0 4px;">Número de pedido</p>
          <p style="color:#FAFAF8;font-size:15px;font-weight:bold;margin:0;">${pedido.numeroPedido}</p>
        </div>
      </div>
      <div style="background:#D4763A;padding:14px;text-align:center;">
        <p style="color:#1A1A1A;font-size:12px;font-weight:bold;margin:0;">No es cualquier termo. Es tu Termazo.</p>
      </div>
    </div>
  </div>`;
}

export async function enviarEmailPedido(tipo: TipoEmail, pedido: PedidoParaEmail) {
  if (!resend) {
    console.warn(
      `RESEND_API_KEY no configurado — no se envió el email "${tipo}" para el pedido ${pedido.numeroPedido}.`
    );
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Termazo <pedidos@termazo.mx>",
      to: pedido.customer.email,
      subject: ASUNTOS[tipo],
      html: plantillaHtml(tipo, pedido),
    });
  } catch (err) {
    // Un email que falla nunca debe tumbar el flujo del pedido — solo lo
    // registramos para revisarlo después.
    console.error(`Error enviando email "${tipo}" para pedido ${pedido.numeroPedido}:`, err);
  }
}
