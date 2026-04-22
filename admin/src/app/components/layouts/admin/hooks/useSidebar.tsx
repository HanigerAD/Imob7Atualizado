import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";

export const SidebarContext = createContext(
  {} as {
    toggled: boolean;
    toggle(): void;
  }
);

export const SidebarProvider = ({ children }: any) => {
  const [toggledState, setToggledState] = useLocalStorage("sb|sidebar-toggle");

  const toggled = useMemo(() => {
    return typeof toggledState !== "undefined" ? Boolean(toggledState) : false;
  }, [toggledState]);

  const toggle = useCallback(() => {
    setToggledState((toggled: any) => !toggled);
  }, [setToggledState]);

  return (
    <SidebarContext.Provider value={{ toggled, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  return useContext(SidebarContext);
}
