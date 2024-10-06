import { db } from '../db'
import dayjs from 'dayjs'
import { goCompletions, goals } from '../db/schema'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // Subquery: Contagem de conclusões de objetivos na semana atual
  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goCompletions.goalId, // Correção de referência
        completionCount: count(goCompletions.id).as('completionCount'), // Alias correto
      })
      .from(goCompletions)
      .where(
        and(
          gte(goCompletions.createdAt, firstDayOfWeek), // Correção de referência
          lte(goCompletions.createdAt, lastDayOfWeek), // Correção de referência
          eq(goCompletions.goalId, goalId) // Garantindo que seja para o objetivo específico
        )
      )
      .groupBy(goCompletions.goalId)
  )

  // Consulta principal para verificar a contagem de conclusões e a frequência semanal desejada
  const result = await db
    .with(goalCompletionCounts) // Usa a subquery
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency, // Frequência semanal
      completionCount:
        sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.as(
          'completionCount'
        ), // Usando COALESCE para retornar 0 se não houver conclusão
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id)) // Faz o join com a subquery
    .where(eq(goals.id, goalId)) // Limita ao objetivo específico
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]

  // Verifica se o objetivo já foi completado com a frequência desejada na semana
  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!')

}

  // Insere uma nova conclusão para o objetivo
  const insertResult = await db
    .insert(goCompletions)
    .values({ goalId })
    .returning() // Correção de tabela
  const goalCompletion = insertResult[0]

  // Retorna o resultado da conclusão inserida
  return {
    goalCompletion,
  }
}
