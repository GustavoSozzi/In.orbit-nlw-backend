import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { and, lte, count, sql, gte, eq } from 'drizzle-orm'
import { goCompletions, goals } from '../db/schema'

dayjs.extend(weekOfYear)

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // Subquery: Goals created up to the current week
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  // Subquery: Goal completion counts for the current week
  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goCompletions.goalId,
        completionCount: count(goCompletions.id).as('completionCount'), // Assigning alias here
      })
      .from(goCompletions)
      .where(
        and(
          gte(goCompletions.createdAt, firstDayOfWeek),
          lte(goCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goCompletions.goalId)
  )

  // Main query: Joining the results of the two subqueries
  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
                COALESCE(${goalCompletionCounts.completionCount}, 0)
            `.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    )

  return { pendingGoals }
}
