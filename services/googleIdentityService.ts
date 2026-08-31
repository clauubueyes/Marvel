export type GoogleTokenResponse = { access_token?: string; error?: string };
type GoogleTokenClient = { requestAccessToken: (options?: { prompt?: string }) => void };

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: () => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

export function requestGoogleCalendarToken(clientId: string) {
  return new Promise<string>((resolve, reject) => {
    const oauth = window.google?.accounts.oauth2;
    if (!oauth) {
      reject(new Error("Google todavía no ha terminado de cargar."));
      return;
    }
    const tokenClient = oauth.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/calendar.app.created",
      callback: (response) => response.access_token ? resolve(response.access_token) : reject(new Error("Google no concedió acceso al calendario.")),
      error_callback: () => reject(new Error("La ventana de autorización se cerró o fue bloqueada.")),
    });
    tokenClient.requestAccessToken({ prompt: "consent" });
  });
}
