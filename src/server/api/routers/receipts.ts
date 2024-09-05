import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const receiptsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const receipts = await ctx.prisma.receipt.findMany({
      include: {
        receiptItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!receipts) throw new TRPCError({ code: "NOT_FOUND" });

    return receipts;
  }),

  getReceiptsByBranch: publicProcedure
    .input(z.object({ branchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const receipts = await ctx.prisma.receipt.findMany({
        include: {
          receiptItems: {
            include: {
              product: true,
            },
          },
        },
        where: { branchId: input.branchId },
      });

      if (!receipts) throw new TRPCError({ code: "NOT_FOUND" });

      return receipts;
    }),

  getReceiptsById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const receipt = await ctx.prisma.receipt.findUnique({
        where: {
          id: input.id,
        },
        include: {
          receiptItems: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!receipt) throw new TRPCError({ code: "NOT_FOUND" });

      return receipt;
    }),
  deleteByInvoiceNumber: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const receipts = await ctx.prisma.receipt.findMany({
        where: {
          invoiceNumber: input.invoiceNumber,
        },
        include: {
          receiptItems: true,
        },
      });

      for (const receipt of receipts) {
        await ctx.prisma.receiptItems.deleteMany({
          where: {
            id: receipt.id,
          },
        });
      }
      const deletedReceipts = await ctx.prisma.receipt.deleteMany({
        where: {
          invoiceNumber: input.invoiceNumber,
        },
      });

      return deletedReceipts;
    }),

  create: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.number(),
        branchId: z.string().min(1).max(100),
        customerId: z.string().min(1).max(100),
        customerLocation: z.string().min(1).max(100),
        date: z.date(),
        paymentType: z.string(),
        finalTotalPrice: z.number().multipleOf(0.01),
        paidDate: z.date().nullable(),
        salePerson: z.string().min(1).max(10),
        status: z.boolean(),
        receiptItems: z.array(
          z.object({
            productId: z.string().min(1).max(100),
            shelvesId: z.string().min(1).max(100),
            qty: z.number(),
            wholeSale: z.number().multipleOf(0.01),
            totalPrice: z.number().multipleOf(0.01),
            discount: z.number().multipleOf(0.01),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const receipt = await ctx.prisma.receipt.create({
        data: {
          invoiceNumber: input.invoiceNumber,
          branchId: input.branchId,
          customerId: input.customerId,
          customerLocation: input.customerLocation,
          date: input.date,
          paymentType: input.paymentType,
          finalTotalPrice: input.finalTotalPrice,
          paidDate: input.paidDate,
          salePerson: input.salePerson,
          status: input.status,
          receiptItems: {
            create: input.receiptItems.map((item) => ({
              productId: item.productId,
              shelvesId: item.shelvesId,
              qty: item.qty,
              wholeSale: item.wholeSale,
              totalPrice: item.totalPrice,
              discount: item.discount,
            })),
          },
        },
        include: {
          receiptItems: true,
        },
      });
      return receipt;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1).max(100),
        invoiceNumber: z.number(),
        branchId: z.string().min(1).max(100),
        customerId: z.string().min(1).max(100),
        customerLocation: z.string().min(1).max(100),
        date: z.date(),
        paymentType: z.string(),
        finalTotalPrice: z.number().multipleOf(0.01),
        paidDate: z.date().nullable(),
        salePerson: z.string().min(1).max(10),
        status: z.boolean(),
        receiptItems: z.array(
          z.object({
            productId: z.string().min(1).max(100),
            shelvesId: z.string().min(1).max(100),
            qty: z.number(),
            wholeSale: z.number().multipleOf(0.01),
            totalPrice: z.number().multipleOf(0.01),
            discount: z.number().multipleOf(0.01),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.receiptItems.deleteMany({
        where: {
          receiptId: input.id,
        },
      });

      const receipt = await ctx.prisma.receipt.update({
        where: {
          id: input.id,
        },
        data: {
          invoiceNumber: input.invoiceNumber,
          branchId: input.branchId,
          customerId: input.customerId,
          customerLocation: input.customerLocation,
          date: input.date,
          paymentType: input.paymentType,
          finalTotalPrice: input.finalTotalPrice,
          paidDate: input.paidDate,
          salePerson: input.salePerson,
          status: input.status,
          receiptItems: {
            create: input.receiptItems.map((item) => ({
              productId: item.productId,
              shelvesId: item.shelvesId,
              qty: item.qty,
              wholeSale: item.wholeSale,
              totalPrice: item.totalPrice,
              discount: item.discount,
            })),
          },
        },
        include: {
          receiptItems: true,
        },
      });
      return receipt;
    }),
});
