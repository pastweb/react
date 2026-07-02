import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createMicroStore as createToolsMicroStore } from '@pastweb/tools';
import { createMicroStore, reuseMicroStore } from '../../src/createMicroStore';

afterEach(() => {
  cleanup();
});

describe('createMicroStore', () => {
  it('reuses a tools micro-store and updates after actions', async () => {
    const counterStore = createToolsMicroStore('react-counter-full', () => ({
      state: {
        count: 0,
      },
      actions: {
        increment() {
          this.state.count += 1;
        },
      },
    }));

    function Counter() {
      const counter = reuseMicroStore(counterStore);

      return (
        <button onClick={counter.increment}>
          {counter.state.count}
        </button>
      );
    }

    render(<Counter />);

    expect(screen.getByRole('button')).toHaveTextContent('0');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('1');
    });
  });

  it('creates a React-ready micro-store with selector support', async () => {
    const useUserStore = createMicroStore('react-user-selected', () => ({
      state: {
        user: {
          name: 'Ada',
        },
      },
      actions: {
        rename(name: string) {
          this.state.user.name = name;
        },
      },
    }));

    function UserName() {
      const user = useUserStore(state => state.user.name);

      return (
        <button onClick={() => user.rename('Grace')}>
          {user.state}
        </button>
      );
    }

    render(<UserName />);

    expect(screen.getByRole('button')).toHaveTextContent('Ada');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Grace');
    });
  });

  it('updates React when a deeply nested full-store property changes', async () => {
    const settingsStore = createToolsMicroStore('react-settings-deep-full', () => ({
      state: {
        account: {
          preferences: {
            theme: {
              palette: {
                accent: 'blue',
              },
            },
          },
        },
      },
      actions: {
        setAccent(accent: string) {
          this.state.account.preferences.theme.palette.accent = accent;
        },
      },
    }));

    function Accent() {
      const settings = reuseMicroStore(settingsStore);

      return (
        <button onClick={() => settings.setAccent('green')}>
          {settings.state.account.preferences.theme.palette.accent}
        </button>
      );
    }

    render(<Accent />);

    expect(screen.getByRole('button')).toHaveTextContent('blue');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('green');
    });
  });

  it('updates React when a deeply nested selected object property changes', async () => {
    const useProfileStore = createMicroStore('react-profile-deep-selected', () => ({
      state: {
        profile: {
          contact: {
            address: {
              city: 'London',
            },
          },
        },
      },
      actions: {
        move(city: string) {
          this.state.profile.contact.address.city = city;
        },
      },
    }));

    function City() {
      const contact = useProfileStore(state => state.profile.contact);

      return (
        <button onClick={() => contact.move('Rome')}>
          {contact.state.address.city}
        </button>
      );
    }

    render(<City />);

    expect(screen.getByRole('button')).toHaveTextContent('London');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Rome');
    });
  });
});
