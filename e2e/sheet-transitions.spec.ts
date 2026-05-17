import { expect, test } from '@playwright/test'

test.describe('sheet drawer transitions', () => {
  test('mobile endpoint preview event details drawer slides from the right', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/e/inspect/str')

    await expect(page.getByText('Stripe webhooks')).toBeVisible()
    await page.waitForTimeout(1000)
    await page.locator('.event-list-item').first().click()
    await expect(page).toHaveURL(/\/e\/inspect\/str\/events\/evt_/)

    const sheet = page.locator('[role="dialog"][data-side="right"]').first()
    await expect(sheet).toBeVisible()
    await expect(sheet).toHaveAttribute('data-state', 'open')
    await page.waitForTimeout(250)

    const openTransform = await sheet.evaluate(element => getComputedStyle(element).transform)
    expect(openTransform === 'none' || openTransform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy()

    await page.getByRole('button', { name: 'Close event details' }).click()
    await expect(page).toHaveURL('/e/inspect/str')
    await expect(sheet).toBeHidden()
  })
})
