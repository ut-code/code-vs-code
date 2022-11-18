import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useState,
} from "react";

const context = createContext<{
  password: string | null;
  setPassword(password: string): void;
} | null>(null);

const LOCAL_STORAGE_KEY = "utcode_code_vs_code";

export function ApiPasswordContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [password, setPassword] = useState<string | null>(
    window.localStorage.getItem(LOCAL_STORAGE_KEY)
  );

  const contextValue = useMemo(
    () => ({
      password,
      setPassword(newPassword: string) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, newPassword);
        setPassword(newPassword);
      },
    }),
    [password]
  );

  return <context.Provider value={contextValue}>{children}</context.Provider>;
}

export function useApiPasswordContext() {
  const value = useContext(context);

  if (!value) throw new Error("Could not subscribe ApiPasswordContext");

  return value;
}
