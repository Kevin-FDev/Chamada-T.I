/*
  Warnings:

  - Added the required column `usuarioId` to the `Chamado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chamado" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
