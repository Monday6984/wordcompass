import React from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = React.createContext(null);

// session: undefined while loading, null when signed out, otherwise the Supabase session.
export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(undefined);
  const [recovery, setRecovery] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(nextSession ?? null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = React.useMemo(
    () => ({ session, recovery, signOut: () => supabase.auth.signOut() }),
    [session, recovery]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
