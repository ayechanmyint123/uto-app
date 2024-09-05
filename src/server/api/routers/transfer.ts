import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const transfersRouter = createTRPCRouter ({
    getAll: publicProcedure.query (async ({ctx})=>{
        const transfer = await ctx.prisma.transfer.findMany({
            include : {
                transferItem : true,
            },
        });
        if ( !transfer ) throw new TRPCError ({ code : "NOT_FOUND" });
        return transfer;
    }),
    getTransferbyBranch : publicProcedure
     .input (z.object ({ branchId : z.string()}))
     .query (async ({ ctx,input }) => {
        const transfer = await ctx.prisma.transfer.findMany({
          include:{
            warehouseFrom:true,
            warehouseTo:true,
            transferItem:{
              include:{
                product:true,
                shelvesTo:true,
                shelvesFrom:true
              },
            },
          },  
          where : { branchId : input.branchId},
        });
        if ( !transfer ) throw new TRPCError ({ code : "NOT_FOUND"});
        return transfer;
     }),
     deleteByInvoiceNumber: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const transfers = await ctx.prisma.transfer.findMany({
        where: {
          invoiceNumber: input.invoiceNumber,
        },
        include: {
          transferItem: true,
        },
      });

      for (const transfer of transfers) {
        await ctx.prisma.transferItems.deleteMany({
          where: {
            productId: '10L-012B',
          },
        });
      }
      const deletedTransfers = await ctx.prisma.transfer.deleteMany({
        where: {
          invoiceNumber: input.invoiceNumber,
        },
      });

      return deletedTransfers;
    }),
    create : publicProcedure
    .input(
        z.object({
          invoiceNumber: z.number(),
          branchId: z.string().min(1).max(100),
          date: z.date(),
          warehouseFromId: z.string(),
          warehouseToId: z.string(),
          confirm: z.boolean(),
          transferItem: z.array(
            z.object({
              productId: z.string().min(1).max(100),
              qty: z.number(),
              shelvesFromId: z.string(),
              shelvesToId: z.string().nullable(),
              remark: z.string(),
            })
          ),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const transfer = await ctx.prisma.transfer.create({
          data: {
            invoiceNumber:input.invoiceNumber,
            branchId: input.branchId,
            date: input.date,
            warehouseFromId: input.warehouseFromId,
            warehouseToId: input.warehouseToId,
            confirm: input.confirm,
            transferItem: {
              create: input.transferItem.map((item) => ({
                productId: item.productId,
                shelvesFromId: item.shelvesFromId,
                shelvesToId: item.shelvesToId,
                qty: item.qty,
                remark: item.remark,
              })),
            },
          },
          include :{
            transferItem: true,
          }
        });
    
        return transfer;
    }),
    update : publicProcedure
    .input(
        z.object({
          id:z.string().min(1).max(100),
          invoiceNumber: z.number(),
          branchId: z.string().min(1).max(100),
          date: z.date(),
          warehouseFromId: z.string(),
          warehouseToId: z.string(),
          confirm: z.boolean(),
          transferItem: z.array(
            z.object({
              productId: z.string().min(1).max(100),
              qty: z.number(),
              shelvesFromId: z.string(),
              shelvesToId: z.string().nullable(),
              remark: z.string(),
            })
          ),
        })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.transferItems.deleteMany({
        where:{
          transferId:input.id
        },
      });

      const transfer = await ctx.prisma.transfer.update({
        where:{
          id: input.id,
        },  
        data: {
            invoiceNumber:input.invoiceNumber,
            branchId: input.branchId,
            date: input.date,
            warehouseFromId: input.warehouseFromId,
            warehouseToId: input.warehouseToId,
            confirm: input.confirm,
            transferItem: {
              create: input.transferItem.map((item) => ({
                productId: item.productId,
                shelvesFromId: item.shelvesFromId,
                shelvesToId: item.shelvesToId,
                qty: item.qty,
                remark: item.remark,
              })),
            },
          },
          include :{
            transferItem: true,
          }
        });
        return transfer;
    }),
})
