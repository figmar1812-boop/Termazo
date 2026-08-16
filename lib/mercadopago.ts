import { MercadoPagoConfig } from "mercadopago";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn(
    "MERCADOPAGO_ACCESS_TOKEN no está configurado — los pagos no van a funcionar hasta agregarlo en .env / Vercel."
  );
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
});
