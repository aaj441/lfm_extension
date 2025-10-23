# AI Rules and Tech Stack Guidelines

This document outlines the core technologies and best practices for developing this application.

## Tech Stack

*   **React:** The primary JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
*   **React Router:** Used for declarative routing within the application.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Radix UI:** A low-level UI component library providing unstyled, accessible components.
*   **lucide-react:** A library for beautiful and consistent open-source icons.

## Library Usage Rules

*   **Styling:** Always use **Tailwind CSS** for all styling. Avoid writing custom CSS files or inline styles unless absolutely necessary for specific, isolated cases.
*   **UI Components:**
    *   Prioritize using components from **shadcn/ui**. These components are pre-styled with Tailwind CSS and are accessible.
    *   If a specific component is not available in shadcn/ui or requires significant customization beyond what shadcn/ui offers, you may build a custom component. When building custom components, leverage **Radix UI** primitives for accessibility and functionality, and style them with **Tailwind CSS**.
*   **Icons:** Use icons exclusively from the **lucide-react** library.
*   **Routing:** All client-side routing should be handled using **React Router**.
*   **File Structure:**
    *   Source code should reside in the `src` folder.
    *   Pages should be placed in `src/pages/`.
    *   Reusable components should be placed in `src/components/`.
    *   Directory names must be all lower-case.