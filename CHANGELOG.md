# Changelog

- Removed `normalizeDependency` from the public React package exports and AsyncComponent utility barrels.
- Kept dependency normalization internal to `loadDependency`, allowing `AsyncComponent` to continue accepting dependency functions, promises, and `DependencyInfo` objects.
- Moved the `AsyncComponent` README documentation into the Element functions section and removed the public `normalizeDependency` documentation.
- Updated the AsyncComponent server tests to assert the supported internal dependency loading flow without mocking `normalizeDependency`.
- Added `reuseMatchDevice` to bridge tools reactive device state into React rendering.
