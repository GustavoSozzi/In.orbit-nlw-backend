import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number // Correção aqui
}

export async function createGoal({
  title,
  desiredWeeklyFrequency, // Correção aqui
}: CreateGoalRequest) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency, // Correção aqui
    })
    .returning()

  const goal = result[0]

  return {
    goal,
  }
}
