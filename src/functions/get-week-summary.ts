import dayjs from 'dayjs'
import { goals, goCompletions } from '../db/schema'
import { and, gte, lte, sql, eq } from 'drizzle-orm'
import { db } from '../db'

export async function getWeekSummary() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // Subquery: Goals created up to the current week
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt, // Corrigi para `createdAt`
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  // Subquery: Goals completed in the week
  const goalCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        completedAt: goCompletions.createdAt, // Corrigi aqui também
        completedAtDate: sql`
          DATE(${goCompletions.createdAt})
        `.as('completedAtDate'),
      })
      .from(goCompletions)
      .innerJoin(goals, eq(goals.id, goCompletions.goalId))
      .orderBy(goCompletions.createdAt)
      .where(
        and(
          gte(goCompletions.createdAt, firstDayOfWeek),
          lte(goCompletions.createdAt, lastDayOfWeek)
        )
      )
  )

  // Subquery: Group goals completed by week day
  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: sql`DATE(${goCompletions.createdAt})`.as(
          'completedAtDate'
        ),
        completions: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalCompletedInWeek.id},
              'title', ${goalCompletedInWeek.title},
              'completedAt', ${goalCompletedInWeek.completedAt}
            )
          )
        `.as('completions'),
      })
      .from(goalCompletedInWeek)
      .orderBy(goalCompletedInWeek.completedAtDate)
      .groupBy(sql`DATE(${goalCompletedInWeek.completedAtDate})`)
  )

  // Tipagem correta do GoalsPerDay
  type GoalsPerDay = Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >

  const result = await db
    .with(goalsCreatedUpToWeek, goalCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql`(SELECT COUNT(*) FROM ${goalCompletedInWeek})`.mapWith(
        Number
      ),
      total:
        sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `.as('goalsPerDay'),
    })
    .from(goalsCompletedByWeekDay)

  return {
    summary: result[0],
  }
}
