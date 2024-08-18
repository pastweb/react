import { useContext as _useContext, Context } from 'react';

export function useContext<T>(context: Context<T | null>, contextName: string): T {
  const contextValue = _useContext(context);
  
  if (contextValue === null) {
    throw Error(`The value for ${contextName} has not been Provided!`);
  }
  
  return contextValue as T;
}
