import React from "react";
import { createViewRouter, RouterOptions } from "@pastweb/tools";
import { RouterView } from "../../src/router/RouterView";
import { useRouter } from "../../src/router/useRouter";

// A simple test component that uses the useRouter hook to get the router instance
const TestHome = () => {
  const routerInstance = useRouter();
  return <div data-testid="route-home">{routerInstance.currentRoute.path}</div>;
};

const TestAbout = () => {
  const routerInstance = useRouter();
  return (
    <div data-testid="route-depth-0">{routerInstance.currentRoute.path}</div>
  );
};

const TestComponent1 = () => {
  const routerInstance = useRouter();
  return (
    <div data-testid="route-depth-1">{routerInstance.currentRoute.path}</div>
  );
};

const TestComponent2 = () => {
  const routerInstance = useRouter();
  return (
    <div data-testid="route-depth-2">{routerInstance.currentRoute.path}</div>
  );
};

export const options: RouterOptions = {
  RouterView,
  routes: [
    { path: "/", view: TestHome },
    {
      path: "/about",
      // view: TestAbout,
      children: [
        {
          path: "/somethig",
          view: TestComponent1,
          children: [{ path: "/more", view: TestComponent2 }],
        },
      ],
    },
  ],
};

export const router = createViewRouter(options);
