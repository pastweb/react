import { useRef, cloneElement } from 'react';
import { select, isObject, effect, type PortalHandler } from '@pastweb/tools';
import { useBeforeMount } from '../../useBeforeMount';
import { usePortals } from '../usePortals';
import type { PortalProps, Portals } from './types';

/**
 * The `Portal` component integrates with the portal system to render its children into a specific portal location.
 * It sets up and manages the portal handler for opening, updating, and closing the portal.
 *
 * @param props - The props for the `Portal` component.
 * @param props.path - The path to the target portal where the content should be rendered.
 * @param props.use - The `PortalHandler` object used to manage the portal's lifecycle. Must be a valid `PortalHandler` object.
 * @param props.children - The content to be rendered inside the portal.
 * @param restProps - Any additional props to be passed to the rendered content inside the portal.
 *
 * @returns `null` - This component does not render anything to the DOM directly.
 *
 * @throws Will throw an error if the `use` prop is not a valid `PortalHandler` object.
 *
 * @example
 * // Example usage:
 * import { usePortal } from '@pastweb/react';
 * const portalHandler = usePortal();
 * <Portal path="myPortal" use={portalHandler}>
 *   <MyComponent />
 * </Portal>
 */
export function Portal(props: PortalProps) {
  const { path, use, children, ...restProps } = props;

  if (!isObject(use) || !Object.hasOwn(use, "$$portalHandler")) {
    throw Error(
      'Portal error - the "use" property must be a PortalHandler Object.'
    );
  }

  const portals = usePortals() as Portals;
  const storedProps = useRef(restProps);
  const isOpen = useRef<boolean>(false);
  const _use = useRef<PortalHandler | null>(null);

  useBeforeMount(() => {
    use.open = () => {
      const portal = select(portals, path);
      _use.current = portal(cloneElement(children, restProps));

      (_use.current as PortalHandler).onRemove(() => {
        use.id = false;
        isOpen.current = false;
      });

      effect(
        _use.current as PortalHandler,
        (newValues) => {
          use.id = newValues.id as string | false;
        },
        "id"
      );

      use.update = (_use.current as PortalHandler).update;

      use.close = () => (_use.current as PortalHandler).close;

      use.remove = () => (_use.current as PortalHandler).remove();

      isOpen.current = true;
      return (_use.current as PortalHandler).open();
    };
  });

  if (isOpen.current) {
    let mustUpdate = false;

    for (const [prop, val] of Object.entries(restProps)) {
      if ((storedProps.current as Record<string, any>)[prop] !== val) {
        mustUpdate = true;
        break;
      }
    }

    if (mustUpdate) {
      storedProps.current = restProps;
      (_use.current as PortalHandler).update(storedProps.current);
    }
  }

  return null;
}
