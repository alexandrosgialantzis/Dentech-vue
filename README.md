# Dentech

Front end for a dental lab. Dentists place orders for products, the lab tracks them and marks them sent. Built with Vue 3, TypeScript, Pinia, and Vite.

The interface is in Greek.

## API

Needs the server running:

https://github.com/alexandrosgialantzis/dentech-api

## Roles

Three roles: admin, dentist, plain user.

Admins see everything, orders, products, users, and can change a person's role. Dentists see only their own orders. A plain user waits for an admin to give them a role.

Each route carries its own meta flags, `requiresAuth`, `requiresAdmin`, `requiresDentist`. One guard in the router reads them, so access rules live next to the routes instead of inside each page.

## State

Four Pinia stores. The user store holds the session and exposes `isLoggedIn`.

The guard checks `sessionChecked` before anything else. On a cold load it asks the server who you are, once, and every later route change reads the result from the store. No repeated calls, no flash of the wrong page.

## Services

One file per resource: `authHttp`, `userHttp`, `orderHttp`, `productHttp`. Each makes its own axios instance from `VITE_API_URL` plus its path, with credentials on.

## Layout

```
src/views/         one per screen
src/components/    grouped by order, product, user, modals
src/stores/        pinia
src/services/      axios per resource
src/types/         interfaces and enums
src/router/        routes and the guard
```

## Run it

```
git clone https://github.com/alexandrosgialantzis/Dentech-vue.git
npm install
npm run dev
```

Make a `.env` file with:

```
VITE_API_URL=
```

Point it at your running API, ending with a slash.
