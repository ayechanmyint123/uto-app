import { createTRPCRouter } from "./trpc";
import {
  productsRouter,
  branchesRouter,
  receiptsRouter,
  customersRouter,
  warehousesRouter,
  shelvesRouter,
  transfersRouter,
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  products: productsRouter,
  branches: branchesRouter,
  receipts: receiptsRouter,
  customers: customersRouter,
  warehouses: warehousesRouter,
  sheleves: shelvesRouter,
  transfers: transfersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
