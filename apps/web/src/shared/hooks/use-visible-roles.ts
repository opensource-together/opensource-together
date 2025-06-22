import { RefObject, useLayoutEffect, useRef, useState } from "react";

interface Role {
  name: string;
  color?: string;
  bgColor?: string;
}

interface UseVisibleRolesOptions {
  roles: Role[];
  dependencies?: unknown[];
}

interface UseVisibleRolesResult {
  containerRef: RefObject<HTMLDivElement>;
  counterRef: RefObject<HTMLDivElement>;
  actionRef: RefObject<HTMLAnchorElement>;
  maxVisible: number;
  visibleRoles: Role[];
  remainingRoles: number;
  measured: boolean;
}

/**
 * Hook personnalisé pour calculer dynamiquement le nombre de badges de rôles visibles
 * en fonction de l'espace disponible
 */
export function useVisibleRoles({
  roles,
  dependencies = [],
}: UseVisibleRolesOptions): UseVisibleRolesResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLAnchorElement>(null);
  const [maxVisible, setMaxVisible] = useState(roles.length);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    function measure() {
      if (!containerRef.current || !counterRef.current) return;
      const container = containerRef.current;
      const counter = counterRef.current;
      const action = actionRef.current;

      // Largeur totale du conteneur
      const totalWidth = container.offsetWidth;

      // Largeur du compteur
      const counterWidth = counter.offsetWidth + 8;

      // Largeur du bouton d'action
      const actionWidth = action ? action.offsetWidth + 8 : 0;

      // Largeur du badge +X
      let plusWidth = 0;
      if (roles.length > 0) {
        const temp = document.createElement("span");
        temp.className =
          "h-[18px] flex-shrink-0 flex items-center px-2 rounded-full text-[10px] whitespace-nowrap text-[black]/20";
        temp.style.visibility = "hidden";
        temp.innerText = "+" + (roles.length - 1);
        container.appendChild(temp);
        plusWidth = temp.offsetWidth + 8;
        container.removeChild(temp);
      }

      // Largeur disponible pour les rôles
      const available = totalWidth - counterWidth - actionWidth;

      // On va rendre les rôles un par un
      let used = 0;
      let visible = 0;

      // On crée des spans temporaires pour mesurer chaque rôle
      for (let i = 0; i < roles.length; i++) {
        const temp = document.createElement("span");
        temp.className =
          "h-[18px] flex-shrink-0 flex items-center px-2 rounded-full text-[10px] whitespace-nowrap";
        temp.style.visibility = "hidden";
        temp.innerText = roles[i].name;
        container.appendChild(temp);
        const roleWidth = temp.offsetWidth + 8;
        container.removeChild(temp);

        // Si on doit afficher le badge +X, il faut réserver la place
        const needPlus = i < roles.length - 1;
        if (used + roleWidth + (needPlus ? plusWidth : 0) > available) {
          break;
        }
        used += roleWidth;
        visible++;
      }

      setMaxVisible(visible);
      setMeasured(true);
    }

    measure();

    // ResizeObserver pour recalculer si la taille change
    let ro: ResizeObserver | undefined;
    const currentContainer = containerRef.current;

    if (currentContainer) {
      ro = new ResizeObserver(() => {
        setMeasured(false);
        setTimeout(measure, 10);
      });
      ro.observe(currentContainer);
    }

    return () => {
      if (ro && currentContainer) ro.disconnect();
    };
  }, [roles, dependencies]);

  const visibleRoles = measured ? roles.slice(0, maxVisible) : roles;
  const remainingRoles = measured ? roles.length - maxVisible : 0;

  return {
    containerRef: containerRef as RefObject<HTMLDivElement>,
    counterRef: counterRef as RefObject<HTMLDivElement>,
    actionRef: actionRef as RefObject<HTMLAnchorElement>,
    maxVisible,
    visibleRoles,
    remainingRoles,
    measured,
  };
}
