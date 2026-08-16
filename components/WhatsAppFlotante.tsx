// Número de WhatsApp de tu negocio — reemplaza este placeholder por el real
// (formato: código de país + número, sin espacios ni signos, ej. 5215512345678)
const WHATSAPP_NUMERO = "5215500000000";
const MENSAJE_INICIAL = "Hola! Tengo una duda sobre un termo personalizado 🙂";

export default function WhatsAppFlotante() {
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAJE_INICIAL)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.708 4.6 1.928 6.457L4 29l7.75-1.887A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm0 21.75c-1.94 0-3.75-.53-5.31-1.457l-.38-.226-4.6 1.12 1.14-4.48-.246-.396A9.7 9.7 0 0 1 5.25 15c0-5.93 4.82-10.75 10.75-10.75S26.75 9.07 26.75 15 21.93 24.75 16 24.75zm5.94-8.04c-.325-.163-1.92-.947-2.218-1.056-.298-.109-.515-.163-.732.163-.217.326-.84 1.056-1.03 1.273-.19.217-.38.244-.706.082-.325-.163-1.373-.506-2.615-1.611-.967-.862-1.62-1.926-1.81-2.252-.19-.326-.02-.502.143-.664.147-.146.325-.38.488-.57.163-.19.217-.326.325-.543.109-.217.054-.407-.027-.57-.082-.163-.732-1.767-1.003-2.42-.264-.635-.532-.55-.732-.56-.19-.008-.407-.01-.624-.01-.217 0-.57.082-.868.407-.298.326-1.138 1.113-1.138 2.716 0 1.603 1.166 3.152 1.329 3.37.163.217 2.294 3.503 5.558 4.912.776.335 1.382.535 1.854.685.779.248 1.487.213 2.048.129.625-.093 1.92-.784 2.19-1.541.271-.758.271-1.407.19-1.542-.081-.135-.298-.217-.624-.38z"/>
      </svg>
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </a>
  );
}
