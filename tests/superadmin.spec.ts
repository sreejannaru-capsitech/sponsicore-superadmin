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

  test(`Company Creation Iteration`, async ({ page }) => {
    await page.locator("//a[contains(@href,'/company')]").click();
    await page.waitForURL("**/company");

    const n = 1; // Number of companies to create

    for (let i = 0; i < n; i++) {
      const addNewButton = page.getByRole("button", { name: "Add New" });
      await expect(addNewButton).toBeVisible();
      await addNewButton.click();

      const companyType = faker.helpers.arrayElement([
        "Client",
        "Trial",
        "Self-Owned",
      ]);

      if (companyType === "Trial") {
        await page.locator("//span[@title='Client']").click();
        await page.locator("//div[contains(text(),'Trial')]").click();

        await page
          .locator("#company-form_allowedEmps")
          .fill(faker.number.int({ min: 0, max: 50 }).toString());

        const startDate = format(faker.date.past(), "dd MMM yyyy");
        const endDate = format(faker.date.soon(), "dd MMM yyyy");

        const startDatefield = page.locator("#company-form_subscriptionPeriod");
        await startDatefield.click();
        await startDatefield.press("Control+A");
        await startDatefield.press("Delete");
        await startDatefield.fill(startDate);

        const endDatefield = page.locator(
          'input[placeholder="DD MMM YYYY"]:not(#company-form_subscriptionPeriod)'
        );
        await endDatefield.click();
        await endDatefield.press("Control+A");
        await endDatefield.press("Delete");
        await endDatefield.fill(endDate);
      } else if (companyType === "Self-Owned") {
        await page.locator("//span[@title='Client']").click();
        await page.locator("//div[contains(text(),'Self-Owned')]").click();
      }

      const firstName = faker.person.firstName();
      await page.locator("#company-form_cmpName").fill(faker.company.name());
      await page
        .locator("#company-form_fullName")
        .fill(firstName + " " + faker.person.lastName());
      await page
        .locator("#company-form_managerEmail")
        .fill(`${firstName}.manager@chitthi.in`);

      await page
        .locator("//input[@placeholder='Enter contact number']")
        .fill("91" + faker.number.bigInt({ min: 5000000000, max: 9999999999 }));

      await page.locator("//span[normalize-space()='Save']").click();

      const notificationLocator = page.getByText("Company saved successfully");
      await expect(notificationLocator).toBeVisible();

      await page.locator("span.ant-notification-notice-close-x").click();
    }
  });
});
