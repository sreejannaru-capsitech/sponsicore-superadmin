import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { format } from "date-fns";

test.describe("Superadmin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill(process.env.SUPERADMIN_USERNAME!);
    await page.getByLabel("Password").fill(process.env.SUPERADMIN_PASSWORD!);
    await Promise.all([
      page.waitForURL("**/dashboard"),
      page.locator("//span[normalize-space()='Login']").click(),
    ]);
  });

  test(`Search for company and edit details`, async ({ page }) => {
    // Visit the company page
    test.setTimeout(120000000);

    for (let i = 141; i < 196; i++) {
      let companyNo = i;
      if (i == 192) {
        continue;
      }

      await page
        .locator('span.ant-menu-title-content > a[href="/company"]')
        .click();
      await page
        .locator("//input[@placeholder='Search...']")
        .fill(`CMP-${companyNo}`);

      await page.locator("//input[@placeholder='Search...']").press("Enter");

      await page.locator(`//u[normalize-space()='CMP-${companyNo}']`).click();

      // Click on the edit button
      await page.getByTitle("Edit").click();

      // Select a business category
      await page.locator("#edit-company-form_businessCategory").click();
      const businessCategory = faker.helpers.arrayElement([
        "Agriculture & Farming",
        "Education",
        "Entertainment",
        "Healthcare",
        "Construction and Real Estate",
        "Financial Services",
        "IT & Accounting",
      ]);
      await page.getByText(businessCategory, { exact: true }).click();

      await page
        .locator("#edit-company-form_companyNo")
        .fill(`CMP${companyNo}${faker.number.int({ min: 1, max: 1000 })}`);
      await page
        .locator("#edit-company-form_vatNo")
        .fill(faker.number.int({ min: 1, max: 1000 }).toString());
      await page
        .locator("#edit-company-form_address_addressLine1")
        .fill(faker.location.streetAddress());
      await page
        .locator("#edit-company-form_address_city")
        .fill(faker.location.city());
      await page
        .locator("#edit-company-form_address_postcode")
        .fill(faker.location.zipCode());

      // Click on the save button
      await page.getByTitle("Save").click(); // Click on the save button

      const notificationLocator = page.getByText(
        "Company details updated successfully"
      );
      await expect(notificationLocator).toBeVisible();
      await page.locator("span.ant-notification-notice-close-x").click();
    }
  });
});
