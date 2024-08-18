import { useRef, cloneElement } from 'react';
import { select, isObject, effect, PortalTools } from '@pastweb/tools';
import { useBeforeMount } from '../../useBeforeMount';
import { usePortals } from '../usePortals';
import { PortalProps, Portals } from './types';

export function Portal(props: PortalProps) {
  const { path, tools, children, ...restProps } = props;
  
  if (!isObject(tools) || !Object.hasOwn(tools, '$$portalTools')) {
    throw Error('Portal error - the "tools" property must be a PortalTools Object.');
  }

  const portals = usePortals() as Portals;
  const storedProps = useRef(restProps);
  const isOpen = useRef<boolean>(false);
  const _tools = useRef<PortalTools | null>(null);
  
  useBeforeMount(() => {
    tools.open = () => {
      const portal = select(portals, path);
      _tools.current = portal(cloneElement(children, restProps));
      
      (_tools.current as PortalTools).onRemove(() => {
        tools.id = false;
        isOpen.current = false;
      });
      
      effect(_tools.current as PortalTools, ({ newValue }) => {
        tools.id = newValue;
      }, 'id');
  
      tools.update = (_tools.current as PortalTools).update; 
  
      tools.close = () => (_tools.current  as PortalTools).close;
      
      tools.remove = () => (_tools.current as PortalTools).remove();
      
  
      isOpen.current = true;
      return (_tools.current as PortalTools).open();
    };
  });

  if (isOpen.current) {
    let mustUpdate = false;

    for (const [ prop, val ] of Object.entries(restProps)) {
      if ((storedProps.current as Record<string, any>)[prop] !== val) {
      mustUpdate = true;
      break;
      } 
    }

    if (mustUpdate) {
      storedProps.current = restProps;
      (_tools.current as PortalTools).update(storedProps.current);
    }
  }

  return null;
}
