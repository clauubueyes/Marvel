type AuthFailure = { code?: string; status?: number };

// Translate known service codes; never echo raw responses or submitted credentials.
export function authErrorMessage(error: AuthFailure, registering: boolean) {
  switch (error.code) {
    case "email_address_not_authorized":
      return "El servicio de correo no permite enviar la confirmación a esta dirección. Contacta con el administrador para habilitar el envío.";
    case "over_email_send_rate_limit":
      return "Se ha alcanzado el límite de envío de correos de confirmación. Espera antes de volver a intentarlo.";
    case "over_request_rate_limit":
      return "Se han realizado demasiados intentos. Espera antes de volver a intentarlo.";
    case "weak_password":
      return "La contraseña no cumple los requisitos de seguridad. Usa una contraseña más larga y combina mayúsculas, minúsculas, números y símbolos.";
    case "email_address_invalid":
      return "La dirección de correo no es válida. Revísala e inténtalo de nuevo.";
    case "email_not_confirmed":
      return "Confirma tu correo antes de iniciar sesión. Revisa también la carpeta de spam.";
    case "signup_disabled":
    case "email_provider_disabled":
      return "El servicio de cuentas no permite esta operación por email en este momento. Contacta con el administrador.";
    case "invalid_credentials":
      return "No se pudo iniciar sesión. Revisa tu email y contraseña.";
  }
  if (error.status === 429) return "Se han realizado demasiados intentos. Espera antes de volver a intentarlo.";
  return registering
    ? "No se pudo completar el registro. Revisa los datos o inténtalo más tarde. Si ya tienes cuenta, inicia sesión."
    : "No se pudo iniciar sesión. Revisa tu email, contraseña y confirmación de correo.";
}
