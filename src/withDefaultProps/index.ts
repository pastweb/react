/**
 * Merges props with defaults while preserving explicitly provided values.
 *
 * @typeParam TProps - Resulting props type.
 * @param props - Source props.
 * @param defaults - Defaults applied when a prop is `undefined`.
 * @returns A new object containing props with missing values filled from defaults.
 *
 * @example
 * ```tsx
 * const props = withDefaultProps(
 *   { tone: undefined },
 *   { tone: 'neutral', size: 'md' },
 * );
 * ```
 */
export function withDefaultProps<TProps extends {} = {}>(
  props: Partial<TProps>,
  defaults: Partial<TProps>,
): TProps {
  const withDefaults = Object.entries(defaults).reduce((acc, [prop, value]) => ({
    ...acc,
    [prop]: (props as Record<string, any>)[prop] !== undefined
      ? (props as Record<string, any>)[prop]
      : value,
  }), {} as TProps);

  return { ...props, ...withDefaults } as TProps;
}
